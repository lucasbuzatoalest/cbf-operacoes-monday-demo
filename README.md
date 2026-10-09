# CBF | Estádios e Governança

Aplicativo demonstrativo para monday.com. A solução apresenta uma Central Territorial da CBF com cadastro fictício de estádios, malha oficial das 27 UFs, requisitos versionados, avaliações, verificações, solicitações de jogos e uma matriz de governança.

> Todos os dados são fictícios. A aplicação não representa homologação oficial da CBF, reserva de estádio, interpretação de regulamento ou garantia de conformidade.

## Executar localmente

```bash
npm start
```

Abra `http://localhost:3000`. O servidor usa apenas APIs nativas do Node.js e não exige instalação de dependências.

## Demo publicada

- Aplicativo monday.com: `CBF Operações — Estádios & Governança (Demo)`
- App ID: `12342364`
- Feature: Board View (`125942613`)
- URL: https://d531f-service-10459683-ba512309.us.monday.app
- Situação no momento deste registro: versão implantada em rascunho no Developer Center.

## Migração para monday Vibe

O [prompt mestre para recriar a solução no monday Vibe](docs/MONDAY_VIBE_PROMPT.md) reúne o briefing, a experiência visual, o modelo de dados, a base fictícia, as regras de negócio, os critérios de acessibilidade e os prompts de refinamento.

## Verificar sintaxe

```bash
npm run check
```

## Arquitetura

- `server.js`: servidor HTTP e endpoints de decisão demonstrativa.
- `data/demo-data.json`: base fictícia restaurável.
- `public/`: interface responsiva incorporável em um iframe da monday.com, com mapa vetorial em D3.
- `monday-app-manifest.json`: especificação de registro do Custom Object para o Apps MCP.

## Publicação pretendida

1. Acessar o app existente no Developer Center da conta **Alest Demo**.
2. Executar `npm run check` e testar localmente com `npm start`.
3. Gerar um novo pacote e implantar com o Apps MCP ou `mapps code:push`.
4. Conferir a rota `/` na feature Board View.
5. Promover a versão após a revisão e instalá-la na conta quando autorizado.

## Continuidade

O código-fonte deste repositório é a fonte compartilhada do projeto. O acesso ao repositório não concede automaticamente permissão para editar ou publicar o aplicativo na monday.com; essa permissão deve ser adicionada em **Developer Center > Manage > Collaborators**.

Antes de publicar uma alteração:

```bash
npm run check
npm start
```

Não versione tokens da monday.com, arquivos `.env`, pacotes gerados ou relatórios locais de segurança.

## Limitações atuais

- Decisões são mantidas em memória e voltam à base inicial ao reiniciar o servidor. Para produção, trocar o adaptador por monday code storage/document DB.
- A malha territorial é obtida da API oficial do IBGE e mantida em cache durante a execução; o ambiente de deploy precisa permitir essa consulta ou empacotar o GeoJSON.
- Permissões de perfis são apresentadas como matriz de teste, não como controle efetivamente configurado.
- O usuário Lucas Buzato consegue consultar o workspace, mas a API retornou `USER_UNAUTHORIZED` ao tentar criar quadros nele. O aplicativo foi desenhado para não depender desses quadros.
