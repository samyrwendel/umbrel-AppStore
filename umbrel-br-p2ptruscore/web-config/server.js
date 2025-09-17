const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const ENV_FILE_PATH = '/data/.env';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Função para ler o arquivo .env
async function readEnvFile() {
    try {
        const content = await fs.readFile(ENV_FILE_PATH, 'utf8');
        const env = {};
        
        content.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    env[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return env;
    } catch (error) {
        console.log('Arquivo .env não encontrado, criando configuração vazia');
        return {};
    }
}

// Função para escrever o arquivo .env
async function writeEnvFile(env) {
    const content = Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    await fs.writeFile(ENV_FILE_PATH, content, 'utf8');
}

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para obter configurações
app.get('/api/config', async (req, res) => {
    try {
        const env = await readEnvFile();
        res.json(env);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler configurações' });
    }
});

// API para salvar configurações
app.post('/api/config', async (req, res) => {
    try {
        const env = req.body;
        
        // Validação básica
        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_BOT_USERNAME) {
            return res.status(400).json({ 
                error: 'TELEGRAM_BOT_TOKEN e TELEGRAM_BOT_USERNAME são obrigatórios' 
            });
        }
        
        await writeEnvFile(env);
        res.json({ success: true, message: 'Configurações salvas com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

// API para status do bot
app.get('/api/status', async (req, res) => {
    try {
        const env = await readEnvFile();
        const configured = !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_USERNAME);
        
        res.json({
            configured,
            hasToken: !!env.TELEGRAM_BOT_TOKEN,
            hasUsername: !!env.TELEGRAM_BOT_USERNAME
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar status' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de configuração rodando em http://0.0.0.0:${PORT}`);
    console.log(`📁 Arquivo de configuração: ${ENV_FILE_PATH}`);
});