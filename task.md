## Umbrel App Store — Plano de Trabalho

Objetivo: preparar este repositório como um App Store personalizado para o Umbrel.

### Itens a definir
- id: identificador único do App Store (apenas letras minúsculas a–z e hifens "-").
- name: nome exibido na interface do Umbrel.

### Checklist
- [x] Definir o `id` do App Store.
- [x] Definir o `name` do App Store.
- [x] Criar o arquivo `umbrel-app-store.yml` com os valores definidos.
- [x] Documentar uso rápido no `README.md`.

### MongoDB (Umbrel BR)
- [x] Criar pasta `umbrel-br-mongodb`.
- [x] Adicionar `umbrel-br-mongodb/umbrel-app.yml`.
- [x] Adicionar `umbrel-br-mongodb/docker-compose.yml` com volume e credenciais.
- [x] Validar execução no Umbrel e conexão em `mongodb://mongo:mongo@<host>:27017`.

### Mongo Express (UI)
- [x] Incluir serviço `mongo-express` no compose mapeando `${PORT}:8081`.
- [x] Alterar `umbrel-app.yml` para expor porta `8081` e ajustar nome.
- [x] Acessar interface em `http://umbrel.local:<porta-app>` e validar login.

### Notas
- O arquivo raiz obrigatório é `umbrel-app-store.yml` contendo `id` e `name`.
- Valores definidos:
  - id: `umbrel-br`
  - name: `Umbrel BR App Store`

### MongoDB 7 + Mongo Express
- [x] Atualizado para MongoDB 7 com volume configdb e comando `--auth`.
- [x] Corrigido manifesto (developer, gallery, repo e icon PNG).
- [x] Confirmado funcionamento via logs e UI.
- String de conexão: `mongodb://mongo:mongo@umbrel.local:27017/?authSource=admin`

### Próximos passos (opcional)
- Validar na UI do Umbrel adicionando este App Store personalizado.
- Publicar no GitHub e apontar o Umbrel para o repositório público.


