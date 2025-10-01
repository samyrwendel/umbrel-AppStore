# PRD - Umbrel App Store

## Visão Geral do Projeto

Este projeto é uma **Community App Store** para o Umbrel OS, focada em fornecer aplicações Bitcoin, desenvolvimento e ferramentas de monitoramento para usuários brasileiros e da comunidade global. <mcreference link="https://github.com/getumbrel/umbrel-community-app-store" index="5">5</mcreference>

## Objetivos

### Objetivo Principal
Criar e manter uma coleção curada de aplicativos para o ecossistema Umbrel, priorizando:
- Aplicações Bitcoin e Lightning Network
- Ferramentas de desenvolvimento
- Soluções de monitoramento e observabilidade
- Aplicações de produtividade

### Objetivos Específicos
1. **Qualidade**: Todos os apps devem ser testados e funcionais
2. **Documentação**: Cada app deve ter documentação clara em português
3. **Segurança**: Configurações seguras por padrão
4. **Facilidade de uso**: Interface intuitiva e setup simplificado
5. **Compatibilidade**: Seguir padrões oficiais do Umbrel <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>

## Estrutura do Projeto

### Organização de Diretórios
```
umbrel-AppStore/
├── umbrel-[nome-do-app]/      # Apps principais da loja
│   ├── umbrel-app.yml         # Configurações do app
│   ├── docker-compose.yml     # Definição dos serviços
│   └── exports.sh            # Variáveis de ambiente (opcional)
├── [outros-apps]/            # Apps de terceiros (referência técnica)
│   ├── umbrel-app.yml
│   └── docker-compose.yml
├── umbrel-app-store.yml       # Configuração da loja
├── task.md                   # Lista de tarefas
└── prd.md                   # Este documento
```

### Padrões de Nomenclatura
- **ID da loja**: `umbrel` (conforme umbrel-app-store.yml)
- **Prefixo principal**: `umbrel-` para apps da loja
- **Apps de terceiros**: Mantidos com prefixos originais apenas como referência técnica
- **Nome em lowercase** com hífens para separação

## Especificações Técnicas do Umbrel

### Arquivo umbrel-app-store.yml <mcreference link="https://github.com/getumbrel/umbrel-community-app-store" index="5">5</mcreference>
```yaml
id: "umbrel"
name: "Umbrel App Store"
```

### Arquivo umbrel-app.yml
Campos obrigatórios conforme documentação oficial: <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>
- `manifestVersion`: Sempre 1
- `id`: Deve começar com `umbrel-`
- `name`: Nome amigável
- `tagline`: Descrição curta
- `category`: Categoria (Bitcoin, Development, Monitoring, etc.)
- `version`: Versão do app
- `port`: Porta principal de acesso
- `description`: Descrição detalhada em português
- `developer`: Desenvolvedor original
- `website`: Site oficial
- `repo`: Repositório do código fonte
- `dependencies`: Lista de dependências (array)

### Arquivo docker-compose.yml
Padrões obrigatórios conforme framework oficial: <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>
- **Version**: `"3.7"` (exato)
- **app_proxy**: Obrigatório para apps com UI web
  ```yaml
  app_proxy:
    environment:
      APP_HOST: <container-name>
      APP_PORT: <port-number>
  ```
- **Restart policy**: `on-failure` (não `unless-stopped`)
- **Stop grace period**: `1m` recomendado
- **Volumes**: Usar `${APP_DATA_DIR}` para persistência
- **Portas**: Expor apenas portas necessárias para conectividade externa
- **Imagens**: Usar digests SHA256 em produção

### Categorias Suportadas
- **Bitcoin**: Nodes, wallets, ferramentas Lightning
- **Development**: IDEs, bancos de dados, ferramentas de dev
- **Monitoring**: Métricas, logs, observabilidade
- **Productivity**: Ferramentas de produtividade
- **Media**: Streaming, organização de mídia
- **Networking**: VPN, proxy, ferramentas de rede

## Apps Incluídos

### Apps Bitcoin
- **Floresta**: Full node Bitcoin leve com tecnologia Utreexo
  - Servidor Electrum (porta 50001)
  - Interface RPC (porta 8332)
  - Tecnologia Utreexo para eficiência

### Apps de Desenvolvimento
- **MongoDB**: Banco de dados NoSQL com interface web

### Apps de Monitoramento
- **Beszel**: Sistema de monitoramento leve
- **NetAlertX**: Monitoramento de rede
- **Tianji**: Plataforma de observabilidade

### Outros Apps
- **BookStack**: Wiki e documentação
- **Excalidraw**: Ferramenta de desenho colaborativo
- **SearXNG**: Meta-motor de busca privado

## Processo de Adição de Novos Apps

### 1. Análise do Projeto
- Verificar compatibilidade com Docker
- Analisar documentação oficial
- Identificar portas e dependências
- Verificar licença e segurança
- **Validar arquiteturas**: ARM64 e AMD64 <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>

### 2. Criação dos Arquivos
- Criar diretório com padrão `umbrel-[nome]`
- Configurar `umbrel-app.yml` com ID correto
- Criar `docker-compose.yml` seguindo padrões
- Adicionar `exports.sh` se necessário
- Testar configuração localmente

### 3. Validação
- Verificar funcionamento completo
- Testar persistência de dados
- Validar configurações de segurança
- Documentar instruções específicas
- **Testar em ambas arquiteturas**

### 4. Integração
- Adicionar à loja principal
- Atualizar documentação
- Criar release notes

## Diferenças da Loja Oficial

### Community App Store vs Official Store <mcreference link="https://github.com/getumbrel/umbrel-community-app-store" index="5">5</mcreference>
- **Distribuição independente**: Não requer submissão à loja oficial
- **Controle total**: Gerenciamento próprio de apps e atualizações
- **Flexibilidade**: Menos restrições para apps experimentais
- **Responsabilidade**: Manutenção e suporte próprios

### Processo de Review
- **Loja oficial**: Review rigoroso, ajustes automáticos, pinning de imagens
- **Community store**: Review próprio, responsabilidade do mantenedor

## Manutenção

### Atualizações Regulares
- Monitorar atualizações dos apps upstream
- Atualizar versões nos arquivos de configuração
- **Atualizar digests SHA256** das imagens Docker
- Testar compatibilidade com novas versões
- Manter documentação atualizada

### Suporte
- Monitorar issues nos repositórios originais
- Fornecer suporte básico de configuração
- Documentar problemas conhecidos
- Manter canal de comunicação com usuários

## Roadmap

### Próximas Funcionalidades
1. Automação de testes para todos os apps
2. Sistema de backup automático
3. Métricas de uso dos apps
4. Interface web para gerenciamento da loja
5. **CI/CD para builds multi-arquitetura**

### Apps Planejados
- Mais ferramentas Bitcoin (BTCPay Server, LNbits)
- Ferramentas de desenvolvimento (GitLab, Jenkins)
- Aplicações de produtividade (Nextcloud, Bitwarden)

## Considerações de Segurança

### Práticas Obrigatórias
- Senhas padrão devem ser alteradas pelo usuário
- Configurações seguras por padrão
- Documentação de riscos de segurança
- Atualizações regulares de segurança
- **Verificação de checksums** para assets remotos <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>

### Validações
- Verificar origem das imagens Docker
- Analisar configurações de rede
- Validar permissões de arquivos
- Testar isolamento entre containers
- **Usar imagens com digests SHA256** em produção

## Arquitetura e Compatibilidade

### Suporte Multi-Arquitetura <mcreference link="https://github.com/getumbrel/umbrel-apps/blob/master/README.md" index="4">4</mcreference>
- **ARM64**: Raspberry Pi e dispositivos ARM
- **AMD64**: PCs e servidores x86
- **Build process**: Usar `docker buildx` para multi-arch
- **Testing**: Validar em ambas arquiteturas

### Requisitos do Sistema
- **umbrelOS 1.x**: Framework atual
- **Docker**: Containerização obrigatória
- **Web UI**: Preferencial para todos os apps
- **CLI access**: Não esperado pelo usuário final