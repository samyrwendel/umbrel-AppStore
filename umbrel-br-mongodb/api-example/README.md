# API REST com MongoDB

Exemplo de API REST usando Express.js e MongoDB instalado no Umbrel.

## Como usar

### 1. Clone o exemplo
```bash
cd umbrel-br-mongodb/api-example
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o .env
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. Execute a API
```bash
npm start
# ou para desenvolvimento com hot reload:
npm run dev
```

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos/:id` | Busca produto por ID |
| POST | `/api/produtos` | Cria novo produto |
| PUT | `/api/produtos/:id` | Atualiza produto |
| DELETE | `/api/produtos/:id` | Remove produto |

## Exemplo de requisições

### Criar produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook",
    "preco": 2999.90,
    "descricao": "Notebook Dell",
    "estoque": 10
  }'
```

### Listar produtos
```bash
curl http://localhost:3000/api/produtos
```

### Buscar produto específico
```bash
curl http://localhost:3000/api/produtos/ID_DO_PRODUTO
```

### Atualizar produto
```bash
curl -X PUT http://localhost:3000/api/produtos/ID_DO_PRODUTO \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Gamer",
    "preco": 3999.90,
    "descricao": "Notebook Dell Gaming",
    "estoque": 5
  }'
```

### Deletar produto
```bash
curl -X DELETE http://localhost:3000/api/produtos/ID_DO_PRODUTO
```

## Estrutura do banco

A API cria automaticamente:
- Database: `minhaLoja`
- Collection: `produtos`

Estrutura do documento produto:
```json
{
  "_id": "ObjectId",
  "nome": "string",
  "preco": "number",
  "descricao": "string",
  "estoque": "number",
  "criadoEm": "Date",
  "atualizadoEm": "Date"
}
```

## Visualizar no Mongo Express

1. Abra o Mongo Express pelo Umbrel
2. Navegue até o banco `minhaLoja`
3. Clique na collection `produtos`
4. Você verá todos os produtos cadastrados via API

## Referências

- [Tutorial MongoDB + Express](https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)