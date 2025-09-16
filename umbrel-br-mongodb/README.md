# MongoDB para Umbrel

Banco de dados MongoDB com interface web Mongo Express.

## Como usar

### Sem senha (padrão - desenvolvimento)
- Conexão: `mongodb://umbrel.local:27017`
- Interface web: Clique em "Abrir" no app

### Com senha (produção)
1. SSH no Umbrel: `ssh umbrel@umbrel.local`
2. Edite o arquivo:
   ```bash
   cd ~/umbrel/app-data/umbrel-br-mongodb
   nano docker-compose.yml
   ```
3. Descomente as linhas de senha e defina suas credenciais:
   ```yaml
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=suasenhaforte
   ```
4. Reinicie o app pelo painel do Umbrel
5. Conexão: `mongodb://admin:suasenhaforte@umbrel.local:27017/?authSource=admin`

## Problemas comuns

### Porta em conflito
Se a interface não abrir, pode ser conflito de porta. O app usa a porta 3333 internamente.

### Resetar senha
1. Pare o app
2. Delete o volume: `docker volume rm umbrel-br-mongodb_mongodb-data`
3. Inicie o app novamente