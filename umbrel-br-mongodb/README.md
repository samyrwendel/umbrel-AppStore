# MongoDB para Umbrel

MongoDB com interface visual Mongo Express.

## Credenciais Padrão

- **Usuário**: `admin`
- **Senha**: `umbrel`

⚠️ **IMPORTANTE**: Mude a senha padrão após a primeira instalação!

## Como Mudar a Senha

### Método 1: Via MongoDB Shell

1. Acesse o terminal SSH do Umbrel
2. Entre no container do MongoDB:
```bash
docker exec -it umbrel-br-mongodb_mongo_1 mongosh
```

3. Autentique como admin:
```javascript
use admin
db.auth('admin', 'umbrel')
```

4. Mude a senha:
```javascript
db.changeUserPassword('admin', 'NOVA_SENHA_AQUI')
```

5. Saia do MongoDB:
```javascript
exit
```

### Método 2: Editando o docker-compose.yml

1. SSH no Umbrel
2. Edite o arquivo:
```bash
nano ~/umbrel/app-data/umbrel-br-mongodb/docker-compose.yml
```

3. Mude as linhas:
```yaml
MONGO_INITDB_ROOT_PASSWORD: sua_nova_senha
ME_CONFIG_MONGODB_ADMINPASSWORD: sua_nova_senha
```

4. Reinicie o app no Umbrel

## Conectar ao MongoDB

### MongoDB Compass
```
mongodb://admin:umbrel@umbrel.local:27017/?authSource=admin
```

### Aplicações
```javascript
const uri = "mongodb://admin:umbrel@umbrel.local:27017/?authSource=admin";
```

## Segurança

- Sempre mude a senha padrão
- Use senhas fortes
- Considere limitar acesso por IP se necessário