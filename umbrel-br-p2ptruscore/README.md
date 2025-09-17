# P2P TrustScore Bot para Umbrel

Bot de karma/reputação para grupos do Telegram, agora disponível no Umbrel!

## 🚀 Instalação Rápida

1. **Instale o MongoDB primeiro** (se ainda não tiver)
   - Vá até a loja de apps do Umbrel
   - Instale o app "MongoDB" da nossa loja

2. **Instale o P2P TrustScore Bot**
   - Encontre e instale o app na loja

3. **Configure o Bot**
   - Crie um bot no Telegram via [@BotFather](https://t.me/botfather)
   - Anote o token e o username do bot

## ⚙️ Configuração

### 1. Criar arquivo de configuração

SSH no seu Umbrel e execute:

```bash
# Navegue até a pasta do app
cd ~/umbrel/app-data/umbrel-br-p2ptruscore

# Crie a pasta de configuração
mkdir -p config

# Crie o arquivo .env
nano config/.env
```

### 2. Adicione as variáveis obrigatórias:

```env
# Token do Bot (obrigatório)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Username do Bot sem @ (obrigatório)
TELEGRAM_BOT_USERNAME=MeuP2PBot
```

### 3. Reinicie o app

```bash
# Via Umbrel UI ou SSH:
cd ~/umbrel
sudo ./scripts/app restart umbrel-br-p2ptruscore
```

## 📱 Como Usar

1. **Adicione o bot ao seu grupo**
2. **Comandos disponíveis:**
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

## 🔧 Logs e Debug

Para ver os logs do bot:

```bash
# Via SSH
docker logs umbrel-br-p2ptruscore_bot_1 -f
```

## 🌐 API para Mini Apps

A API está disponível na porta mostrada no Umbrel para integração com Telegram Mini Apps.

Endpoints principais:
- `GET /api/karma/top` - Top usuários
- `GET /api/users/:userId` - Dados do usuário
- E muito mais...

## ⚠️ Problemas Comuns

### Bot não responde
- Verifique se o token está correto
- Confirme que o username não tem @
- Veja os logs para erros

### Erro de conexão MongoDB
- Certifique-se que o MongoDB está instalado e rodando
- A senha padrão é `umbrel`

## 📞 Suporte

- [Issues no GitHub](https://github.com/samyrwendel/p2ptruscore/issues)
- [Código fonte](https://github.com/samyrwendel/p2ptruscore)