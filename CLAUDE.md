# DevStash 

Um centro de conhecimento para desenvolvedores com trechos de código, comandos, instruções, notas, arquivos, imagens, links e tipos personalizados;

## Context files

Leia os arquivos a seguir para obter o contexto completo do projeto;

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Comandos de Desenvolvimento

### Rodar o servidor de desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000`.

### Build para produção
```bash
npm run build
```

### Iniciar servidor de produção
```bash
npm run start
```

### Linting
```bash
npm run lint
```

## 🔒 Política de Commits (OBRIGATÓRIO)

- NUNCA realize commits automaticamente.
- Só é permitido fazer commit quando houver um pedido EXPLÍCITO do usuário.
- Sempre confirme antes de commitar, mesmo que pareça óbvio.
- Se houver qualquer dúvida, NÃO commitar.
- Alterações de código devem permanecer locais até aprovação.

Exemplo de comportamento esperado:
"Você deseja que eu faça o commit dessas alterações?"

## Neon MCP Configuration

Ao utilizar o Neon MCP ou a CLI `neonctl`, siga estas diretrizes:
- **Projeto Padrão:** Sempre utilize o projeto `devstash` (ID: `small-unit-58892269`).
- **Branch Padrão:** Utilize a branch `development` (ID: `br-spring-dust-anl6q0tg`) para todas as operações de banco de dados, migrações e consultas.
- **Restrição de Produção:** **NUNCA** realize alterações, migrações ou manipulação de dados na branch `production` (ID: `br-still-credit-an3kvvdr`), a menos que eu peça explicitamente por escrito.
- **Contexto de Comando:** Ao rodar comandos via shell, prefira `npx neonctl` se a CLI global não estiver disponível.