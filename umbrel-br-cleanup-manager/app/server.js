const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs').promises;
const { execSync, exec } = require('child_process');

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const PORT = process.env.PORT || 3000;

// Umbrel app data directory
const UMBREL_DATA_DIR = process.env.UMBREL_DATA_DIR || '/umbrel-data';
const UMBREL_APPS_DIR = process.env.UMBREL_APPS_DIR || '/umbrel-apps';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to execute shell commands
function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
}

// Get disk usage
async function getDiskUsage() {
  try {
    const output = await execCommand('df -h / | tail -1');
    const parts = output.trim().split(/\s+/);
    return {
      total: parts[1],
      used: parts[2],
      available: parts[3],
      percentage: parts[4]
    };
  } catch (e) {
    return { total: 'N/A', used: 'N/A', available: 'N/A', percentage: 'N/A' };
  }
}

// Get all containers with their status
async function getAllContainers() {
  try {
    const containers = await docker.listContainers({ all: true });
    return containers.map(container => ({
      id: container.Id.substring(0, 12),
      fullId: container.Id,
      name: container.Names[0]?.replace('/', '') || 'unknown',
      image: container.Image,
      state: container.State,
      status: container.Status,
      created: new Date(container.Created * 1000).toLocaleString('pt-BR'),
      labels: container.Labels || {}
    }));
  } catch (e) {
    console.error('Error listing containers:', e);
    return [];
  }
}

// Identify failed/orphan containers
async function getFailedInstallations() {
  const containers = await getAllContainers();
  const failed = [];

  for (const container of containers) {
    const isUmbrelApp = container.name.includes('umbrel') ||
                        container.labels['com.docker.compose.project']?.includes('umbrel');

    // Check for problematic states
    const isFailed = container.state === 'exited' ||
                     container.state === 'dead' ||
                     container.state === 'created' ||
                     container.status.toLowerCase().includes('exit') ||
                     container.status.toLowerCase().includes('dead');

    // Check for restart loops
    const hasRestartIssue = container.status.toLowerCase().includes('restarting');

    if (isUmbrelApp && (isFailed || hasRestartIssue)) {
      failed.push({
        ...container,
        reason: isFailed ? 'Container parado ou falhou' : 'Container em loop de reinício',
        type: 'container'
      });
    }
  }

  return failed;
}

// Get orphan volumes
async function getOrphanVolumes() {
  try {
    const volumes = await docker.listVolumes();
    const containers = await docker.listContainers({ all: true });

    // Get all volume names used by containers
    const usedVolumes = new Set();
    containers.forEach(container => {
      if (container.Mounts) {
        container.Mounts.forEach(mount => {
          if (mount.Name) usedVolumes.add(mount.Name);
        });
      }
    });

    // Find orphan volumes (not used by any container)
    const orphanVolumes = [];
    if (volumes.Volumes) {
      for (const volume of volumes.Volumes) {
        if (!usedVolumes.has(volume.Name)) {
          // Check if it looks like an Umbrel app volume
          const isUmbrelRelated = volume.Name.includes('umbrel') ||
                                   volume.Labels?.['com.docker.compose.project']?.includes('umbrel');

          let size = 'Calculando...';
          try {
            const volumeInfo = await docker.getVolume(volume.Name).inspect();
            if (volumeInfo.UsageData) {
              size = formatBytes(volumeInfo.UsageData.Size);
            }
          } catch (e) {}

          orphanVolumes.push({
            name: volume.Name,
            driver: volume.Driver,
            created: volume.CreatedAt,
            isUmbrelRelated,
            size,
            type: 'volume'
          });
        }
      }
    }

    return orphanVolumes;
  } catch (e) {
    console.error('Error getting orphan volumes:', e);
    return [];
  }
}

// Get dangling images
async function getDanglingImages() {
  try {
    const images = await docker.listImages({ filters: { dangling: ['true'] } });
    return images.map(image => ({
      id: image.Id.replace('sha256:', '').substring(0, 12),
      fullId: image.Id,
      size: formatBytes(image.Size),
      created: new Date(image.Created * 1000).toLocaleString('pt-BR'),
      type: 'image'
    }));
  } catch (e) {
    console.error('Error getting dangling images:', e);
    return [];
  }
}

// Get residual app data directories
async function getResidualAppData() {
  const residual = [];

  try {
    // Check for app data directories that don't have running containers
    const containers = await getAllContainers();
    const runningApps = new Set();

    containers.forEach(c => {
      const project = c.labels['com.docker.compose.project'];
      if (project) runningApps.add(project);
    });

    // Check app data directory
    try {
      const appDirs = await fs.readdir(UMBREL_DATA_DIR);
      for (const dir of appDirs) {
        const fullPath = path.join(UMBREL_DATA_DIR, dir);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory() && dir.includes('umbrel') && !runningApps.has(dir)) {
          let size = 'Calculando...';
          try {
            const output = await execCommand(`du -sh "${fullPath}" 2>/dev/null | cut -f1`);
            size = output.trim();
          } catch (e) {}

          residual.push({
            name: dir,
            path: fullPath,
            size,
            type: 'data'
          });
        }
      }
    } catch (e) {
      console.log('Could not read app data directory:', e.message);
    }
  } catch (e) {
    console.error('Error getting residual app data:', e);
  }

  return residual;
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// API Routes

// Get system overview
app.get('/api/overview', async (req, res) => {
  try {
    const [diskUsage, containers, failedInstallations, orphanVolumes, danglingImages] = await Promise.all([
      getDiskUsage(),
      getAllContainers(),
      getFailedInstallations(),
      getOrphanVolumes(),
      getDanglingImages()
    ]);

    res.json({
      diskUsage,
      totalContainers: containers.length,
      runningContainers: containers.filter(c => c.state === 'running').length,
      failedCount: failedInstallations.length,
      orphanVolumesCount: orphanVolumes.length,
      danglingImagesCount: danglingImages.length
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all failed installations
app.get('/api/failed', async (req, res) => {
  try {
    const failed = await getFailedInstallations();
    res.json(failed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get orphan volumes
app.get('/api/volumes/orphan', async (req, res) => {
  try {
    const orphans = await getOrphanVolumes();
    res.json(orphans);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get dangling images
app.get('/api/images/dangling', async (req, res) => {
  try {
    const images = await getDanglingImages();
    res.json(images);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get residual data
app.get('/api/data/residual', async (req, res) => {
  try {
    const residual = await getResidualAppData();
    res.json(residual);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all containers
app.get('/api/containers', async (req, res) => {
  try {
    const containers = await getAllContainers();
    res.json(containers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Stop a specific container
app.post('/api/container/:id/stop', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    const info = await container.inspect();

    if (info.State.Running || info.State.Restarting) {
      await container.stop({ t: 10 });
      res.json({ success: true, message: 'Container parado com sucesso' });
    } else {
      res.json({ success: true, message: 'Container já estava parado' });
    }
  } catch (e) {
    if (e.statusCode === 304) {
      res.json({ success: true, message: 'Container já estava parado' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

// Kill a specific container (force stop)
app.post('/api/container/:id/kill', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.kill();
    res.json({ success: true, message: 'Container finalizado com sucesso' });
  } catch (e) {
    if (e.statusCode === 409) {
      res.json({ success: true, message: 'Container não estava rodando' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

// Remove a specific container
app.delete('/api/container/:id', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);

    // Get container state
    let isRunning = false;
    try {
      const info = await container.inspect();
      isRunning = info.State.Running || info.State.Restarting;
    } catch (e) {}

    // If running, try to kill it first (faster than stop)
    if (isRunning) {
      try {
        await container.kill();
      } catch (killErr) {
        // Try stop as fallback
        try {
          await container.stop({ t: 3 });
        } catch (stopErr) {}
      }
      // Wait a bit for container to fully stop
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Remove with force
    await container.remove({ force: true, v: true });
    res.json({ success: true, message: 'Container removido com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Remove a specific volume
app.delete('/api/volume/:name', async (req, res) => {
  try {
    const volume = docker.getVolume(req.params.name);
    await volume.remove();
    res.json({ success: true, message: 'Volume removido com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Remove a specific image
app.delete('/api/image/:id', async (req, res) => {
  try {
    const image = docker.getImage(req.params.id);
    await image.remove({ force: true });
    res.json({ success: true, message: 'Imagem removida com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Remove residual data directory
app.delete('/api/data/:name', async (req, res) => {
  try {
    const dirPath = path.join(UMBREL_DATA_DIR, req.params.name);

    // Security check - make sure we're only deleting from the expected directory
    if (!dirPath.startsWith(UMBREL_DATA_DIR)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await execCommand(`rm -rf "${dirPath}"`);
    res.json({ success: true, message: 'Dados removidos com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Docker system prune (cleanup everything)
app.post('/api/cleanup/all', async (req, res) => {
  try {
    const results = {
      containers: 0,
      volumes: 0,
      images: 0,
      spaceReclaimed: '0 B'
    };

    // Remove stopped containers
    const stoppedContainers = await docker.listContainers({
      all: true,
      filters: { status: ['exited', 'dead', 'created'] }
    });

    for (const container of stoppedContainers) {
      try {
        await docker.getContainer(container.Id).remove({ force: true });
        results.containers++;
      } catch (e) {}
    }

    // Remove dangling images
    const danglingImages = await docker.listImages({ filters: { dangling: ['true'] } });
    for (const image of danglingImages) {
      try {
        await docker.getImage(image.Id).remove({ force: true });
        results.images++;
      } catch (e) {}
    }

    // Remove unused volumes
    try {
      const pruneResult = await docker.pruneVolumes();
      results.volumes = pruneResult.VolumesDeleted?.length || 0;
      results.spaceReclaimed = formatBytes(pruneResult.SpaceReclaimed || 0);
    } catch (e) {}

    res.json({
      success: true,
      message: 'Limpeza concluída',
      results
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Docker prune (containers, images, volumes)
app.post('/api/prune/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let result;

    switch (type) {
      case 'containers':
        result = await docker.pruneContainers();
        break;
      case 'volumes':
        result = await docker.pruneVolumes();
        break;
      case 'images':
        result = await docker.pruneImages();
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    res.json({
      success: true,
      spaceReclaimed: formatBytes(result.SpaceReclaimed || 0),
      deleted: result.ContainersDeleted || result.VolumesDeleted || result.ImagesDeleted || []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Cleanup Manager running on port ${PORT}`);
});
