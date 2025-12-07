# Cleanup Manager para Umbrel

Uma ferramenta essencial para manter seu Umbrel saudável e organizado.

## Funcionalidades

- **Lista instalações com problema**: Identifica containers que falharam, pararam ou estão em loop de reinício
- **Volumes órfãos**: Encontra e remove volumes que não estão sendo usados por nenhum container
- **Imagens pendentes**: Remove imagens Docker não utilizadas para liberar espaço
- **Visualização de containers**: Lista todos os containers com seus status
- **Limpeza seletiva**: Remove itens individualmente ou em lote
- **Limpeza completa**: Remove tudo que não está em uso com um clique

## Instalação

Este app está disponível na Umbrel BR Community Store. Adicione a loja e instale o app:

1. Vá em Configurações do Umbrel
2. Adicione a loja: `https://github.com/umbrel-br/umbrel-AppStore`
3. Procure por "Cleanup Manager" e instale

## Uso

Após a instalação, acesse o app pela interface do Umbrel. A interface mostrará:

- **Dashboard**: Visão geral do uso de disco e problemas detectados
- **Instalações com Problema**: Containers que precisam de atenção
- **Volumes Órfãos**: Volumes sem uso que podem ser removidos
- **Imagens Pendentes**: Imagens Docker não utilizadas
- **Todos os Containers**: Lista completa para monitoramento

## Segurança

- O app tem acesso somente leitura aos diretórios de dados do Umbrel
- Todas as operações de remoção requerem confirmação
- O socket Docker é montado como somente leitura onde possível

## Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório:
https://github.com/umbrel-br/cleanup-manager/issues

## Licença

MIT
