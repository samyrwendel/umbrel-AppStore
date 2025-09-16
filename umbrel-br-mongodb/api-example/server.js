const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://umbrel.local:27017';
const DB_NAME = process.env.DB_NAME || 'minhaLoja';

let db;

// Conectar ao MongoDB
MongoClient.connect(MONGO_URI)
  .then(client => {
    console.log('Conectado ao MongoDB!');
    db = client.db(DB_NAME);
  })
  .catch(error => console.error('Erro ao conectar:', error));

// Rotas da API

// GET - Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await db.collection('produtos').find({}).toArray();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await db.collection('produtos').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const novoProduto = {
      nome: req.body.nome,
      preco: req.body.preco,
      descricao: req.body.descricao,
      estoque: req.body.estoque || 0,
      criadoEm: new Date()
    };
    
    const resultado = await db.collection('produtos').insertOne(novoProduto);
    res.status(201).json({ 
      id: resultado.insertedId, 
      ...novoProduto 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const atualizacao = {
      $set: {
        nome: req.body.nome,
        preco: req.body.preco,
        descricao: req.body.descricao,
        estoque: req.body.estoque,
        atualizadoEm: new Date()
      }
    };
    
    const resultado = await db.collection('produtos').updateOne(
      { _id: new ObjectId(req.params.id) },
      atualizacao
    );
    
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remover produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const resultado = await db.collection('produtos').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    endpoints: {
      'GET /api/produtos': 'Listar todos os produtos',
      'GET /api/produtos/:id': 'Buscar produto por ID',
      'POST /api/produtos': 'Criar novo produto',
      'PUT /api/produtos/:id': 'Atualizar produto',
      'DELETE /api/produtos/:id': 'Remover produto'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});