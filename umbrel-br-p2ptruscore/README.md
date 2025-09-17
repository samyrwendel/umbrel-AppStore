# P2P TrustScore Bot para Umbrel

Bot de karma/reputação para grupos do Telegram.

## 🚀 Instalação Rápida

1. **Instale o app** pela loja do Umbrel

2. **Configure o bot** via SSH:

```bash
# Acesse o Umbrel
ssh umbrel@umbrel.local

# Vá para a pasta de dados do app
cd ~/umbrel/app-data/umbrel-br-p2ptruscore/data

# Crie o arquivo de configuração
nano .env
```

3. **Adicione suas credenciais:**

```env
# Obrigatório - Token do @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Obrigatório - Username sem @
TELEGRAM_BOT_USERNAME=MeuP2PBot

# Opcional - se quiser usar outro MongoDB
# MONGODB_CNN=mongodb://user:pass@host:27017/dbname
```

4. **Reinicie o app:**

```bash
cd ~/umbrel
sudo ./scripts/app restart umbrel-br-p2ptruscore
```

## 📱 Comandos do Bot

- Responda `+1` ou `-1` para dar/tirar karma
- `/me` - Ver seu status
- `/melhorscore` - Top 10 usuários
- `/piorscore` - 10 piores scores
- `/hoje` - Melhores das últimas 24h
- `/mes` - Melhores dos últimos 30 dias
- `/ano` - Melhores do ano
- `/transferir <quantidade>` - Transferir pontos
- `/history` - Seu histórico
- `/comandos` - Lista todos os comandos

## 🔧 Verificar Logs

```bash
docker logs umbrel-br-p2ptruscore_bot_1 -f
```

## 🌐 API para Mini Apps

A API estará disponível na porta mostrada no Umbrel.

## ⚠️ Problemas?

Se o bot não iniciar:
1. Verifique se o token está correto
2. Confirme que o username não tem @
3. Veja os logs para identificar erros

## 📞 Suporte

- [GitHub do Projeto](https://github.com/samyrwendel/p2ptruscore)