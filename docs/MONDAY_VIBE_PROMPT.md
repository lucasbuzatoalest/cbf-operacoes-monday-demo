# Prompt mestre — monday Vibe

Copie integralmente o conteúdo entre `INÍCIO DO PROMPT` e `FIM DO PROMPT` para criar uma nova versão da demonstração no monday Vibe.

Referências do projeto anterior:

- Demo visual: https://d531f-service-10459683-ba512309.us.monday.app
- Código-fonte: https://github.com/lucasbuzatoalest/cbf-operacoes-monday-demo
- Workspace pretendido: `Teste CBF`
- Variante recomendada no Vibe: aplicativo completo com dados próprios e múltiplas telas (`object_fullstack`)

---

## INÍCIO DO PROMPT

Crie um aplicativo completo, funcional e altamente polido no monday Vibe chamado **“CBF | Central de Operações — Estádios e Governança”**. Ele é uma demonstração executiva e operacional, em português do Brasil, para mostrar como a CBF poderia cadastrar estádios, visualizar sua distribuição territorial, versionar requisitos por competição, avaliar elegibilidade com evidências, analisar solicitações de jogos e registrar decisões humanas com governança e rastreabilidade.

O aplicativo deve parecer uma central de operações premium e confiável, não um dashboard genérico nem uma landing page. Ele precisa funcionar como uma história demonstrável de ponta a ponta: **localização territorial → cadastro → regra versionada → verificação → avaliação → disponibilidade → decisão humana → governança**.

### 1. Limites e avisos obrigatórios

- Todos os dados são 100% fictícios e devem ser identificados como demonstrativos.
- Exiba em todas as telas relevantes, de forma visível mas não intrusiva: **“Demonstração — dados 100% fictícios; não representa homologação oficial da CBF.”**
- Nunca trate um dado ausente como requisito atendido.
- Nunca trate uma simulação, status ou pontuação como homologação oficial.
- Nunca trate capacidade declarada como capacidade autorizada para um evento.
- Elegibilidade e disponibilidade são verificações diferentes.
- A aprovação final deve permanecer humana e exigir responsável e justificativa.
- O mapa é contexto geográfico; não o apresente como recurso exclusivo de plano Enterprise.
- Não invente exigências oficiais da CBF. Todo requisito fictício deve ser rotulado como **“Exemplo demonstrativo, não é requisito oficial da CBF.”**

### 2. Público e principais tarefas

O aplicativo será usado em uma demonstração para áreas de negócio e TI. Ele precisa permitir que:

1. Um gestor localize estádios no Brasil e veja a qualidade do cadastro.
2. Um analista entenda se um estádio atende a uma competição, edição e versão específicas.
3. Um avaliador veja cada requisito, evidência, validade, resultado, pendência e responsável.
4. Um aprovador registre decisão humana com justificativa.
5. O TI entenda separação de papéis, rastreabilidade, limitações e pontos que ainda exigem validação real no monday.com.
6. Um apresentador execute um roteiro guiado de aproximadamente 12 minutos.

### 3. Estrutura de navegação

Crie uma aplicação com menu lateral fixo e sete áreas:

1. **Território**
2. **Estádios**
3. **Competições**
4. **Avaliações**
5. **Solicitações**
6. **Governança**
7. **Roteiro da demo**

No cabeçalho, mostre breadcrumb, título da tela, subtítulo curto, indicador “Sincronizado agora”, selo “AMBIENTE DEMO” e avatar. Preserve filtros e seleção de competição ao trocar de tela quando isso ajudar a continuidade da análise.

### 4. Identidade visual e experiência

Use uma identidade inspirada na CBF, com aspecto institucional, tecnológico e brasileiro:

- Fundo geral muito claro, próximo de `#F4F8FA`.
- Azul-marinho profundo `#021D2B` para navegação, cabeçalhos e áreas de comando.
- Verde `#00A859` ou equivalente acessível para estados positivos e foco principal.
- Amarelo-ouro `#F7C928` para destaque institucional e atenção moderada.
- Azul de foco `#2F6BFF`, vermelho `#D92D3A` e âmbar `#C77A00` apenas para semântica clara.
- Tipografia moderna, humana e muito legível. Títulos podem ser compactos; subtítulos, textos, dados, tabelas e metadados nunca podem ficar pequenos demais. Use aproximadamente 16 px ou mais para texto normal e 14 px somente para metadados secundários de alto contraste.
- Não use bordas coloridas laterais ou superiores nos cards. Se precisar comunicar estado, use selo, ícone, faixa interna suave, fundo tonal, marcador ou gráfico dentro do conteúdo.
- Evite excesso de cards flutuantes e bordas. Use faixas, divisores, tabelas e áreas de trabalho contínuas.
- Nada pode sobrepor, cortar ou passar por baixo de outro card. Textos longos devem quebrar corretamente. Componentes devem crescer com o conteúdo.
- Garanta contraste WCAG AA: 4,5:1 para texto normal, 3:1 para texto grande e elementos gráficos importantes.
- Não dependa apenas de cor: combine cor com texto, ícone, padrão ou formato.
- Estados de foco devem ser claros; toda interação deve funcionar por teclado; modais devem devolver o foco ao gatilho; áreas dinâmicas devem ter mensagens acessíveis.
- Respeite `prefers-reduced-motion`. Animações devem ser discretas e ter função analítica, não decorativa.
- O layout desktop deve priorizar a área operacional. Em celular, use composição própria: barra compacta, mapa ou evidência principal primeiro, filtros em drawer/bottom sheet, alvos de toque com 44–48 px e nenhuma informação essencial dependente de hover.
- Use o brasão/logo da CBF somente se estiver disponível e autorizado. Caso contrário, use um escudo demonstrativo com as cores nacionais e o texto “CBF — Central de Operações”, deixando claro que é uma representação de demo.

### 5. Tela Território — principal experiência visual

Faça desta tela a experiência mais marcante do aplicativo.

#### Estrutura

- Título: **“Visão territorial de estádios”**.
- Subtítulo: “Capacidade, elegibilidade e qualidade cadastral em uma única leitura operacional.”
- Seletor de competição, edição e versão.
- Botão **“Restaurar demo”**.
- Área de trabalho ampla com mapa do Brasil, inspector lateral e faixa de indicadores.

#### Mapa

- Use um mapa vetorial geograficamente correto do Brasil com as 27 UFs, preferencialmente a malha simplificada do IBGE. Se a fonte externa não estiver disponível, incorpore uma geometria local confiável ou use um mapa nativo equivalente; nunca desenhe uma aproximação grosseira.
- Exiba limites estaduais discretos, siglas das UFs quando legíveis e marcadores dos estádios georreferenciados.
- Pode haver sensação visual sutil de profundidade por sombras e camadas, mas mantenha leitura cartográfica correta e ofereça uma versão plana/reduzida para acessibilidade e desempenho.
- Três modos coordenados: **Elegibilidade**, **Capacidade** e **Qualidade cadastral**.
- Elegibilidade: cor e rótulo para Atende, Não atende, Evidência vencida e Pendente.
- Capacidade: tamanho do marcador proporcional à capacidade declarada, com escala e legenda explícitas.
- Qualidade: intensidade ordenada por completude cadastral, deixando ausências claras.
- Estado selecionado deve ser diferente do significado dos dados; por exemplo, use bracket, halo neutro ou contorno de foco, sem reutilizar a cor de situação.
- Valores essenciais devem estar visíveis sem hover. No toque ou teclado, seleção abre/atualiza o inspector.
- Inclua zoom, redefinir visualização, busca por estádio/UF e alternativa textual/lista para quem não usa o mapa.
- Mostre fonte e ressalva: “Fonte cartográfica: IBGE · malha simplificada · dados operacionais fictícios”.

#### Inspector sincronizado

Ao selecionar um estádio, mostrar:

- Nome, código, cidade, UF e região.
- Capacidade declarada.
- Situação cadastral e completude.
- Resultado da avaliação na competição selecionada.
- Pendência principal e próxima ação.
- Botão **“Abrir dossiê”**.

#### Faixa operacional

Apresente cinco indicadores claramente definidos para o contexto selecionado: Aprovado, Bloqueado, Evidência vencida, Cadastro incompleto e Em decisão. Não misture total de estádios com total de avaliações e não duplique um estádio na contagem do contexto.

Abaixo, mostre **“Pendências que alteram a decisão”**, com ações ordenadas por prioridade e acesso direto ao estádio correspondente.

### 6. Tela Estádios

Título: **“Dossiês territoriais”**. Inclua busca por estádio, cidade, UF ou código e filtro por competição/versão.

Mostre resumo de registros, georreferenciados, validados para consulta e cadastros incompletos. Para cada estádio, apresente sem borda colorida:

- Código, nome, cidade/UF/região.
- Capacidade declarada em destaque.
- Qualidade/completude cadastral.
- Situação cadastral.
- Resultado no contexto selecionado.
- Número de avaliações relacionadas.
- Próxima revisão e fonte.
- Botão **“Abrir dossiê”**.

O dossiê deve abrir em modal ou painel acessível e conter cadastro, origem, revisão, georreferenciamento, avaliações por competição/versão, verificações, validade das evidências, pendência e próxima ação. Mostre explicitamente quando não existir avaliação: **“Nenhuma avaliação vinculada. O estádio não está elegível por padrão.”**

### 7. Tela Competições

Título: **“Competições e requisitos”**.

- Seletor de competição, edição e versão.
- Linha do tempo/abas das versões, preservando versões anteriores.
- Cartão ou painel do regulamento selecionado, sem sobreposição de conteúdo.
- Campos: nome, código, edição, versão, situação, vigência, área proprietária e responsável.
- Lista de requisitos aplicáveis com código, categoria, descrição, tipo, operador/limite/unidade quando houver, obrigatoriedade, evidência exigida, validade e aviso demonstrativo.
- Nova versão nunca deve sobrescrever silenciosamente a referência usada em decisões anteriores.
- Se uma versão não tiver requisitos, mostrar pendência explícita; nunca assumir “todos atendidos”.

### 8. Tela Avaliações

Título: **“Avaliações de elegibilidade”**.

- Filtros por competição/versão, estádio, resultado técnico, aprovação e responsável.
- KPIs de avaliações, prontas para revisão, pendentes, não atendidas e evidências vencidas.
- Matriz ou lista densa mas legível com avaliação, estádio, contexto regulatório, resultado técnico, situação da aprovação, número de verificações completas/esperadas, pendência e próxima ação.
- Permita expandir cada avaliação para ver todas as verificações e evidências.
- Para o Estádio Alfa, mostre claramente que o resultado pode ser diferente entre competições/versões.
- Botão **“Revisar avaliação”** abre formulário com decisão, revisor e justificativa obrigatória.

Regras de consolidação:

1. Exigir exatamente uma verificação por requisito aplicável.
2. Linha ausente, vínculo incorreto, duplicidade, dado ausente ou evidência inacessível mantém pendência.
3. Evidência vencida impede resultado positivo.
4. Falha em requisito obrigatório gera “Não atende”; uma média ou porcentagem nunca compensa essa falha.
5. “Critérios atendidos” significa pronto para revisão, não aprovação automática.
6. Só permitir aprovação quando o resultado técnico for “Atende”.
7. Alteração relevante de capacidade, evidência, requisito, versão ou contexto deve exigir reavaliação.

### 9. Tela Solicitações

Título: **“Solicitações de jogos”**.

- Mostre KPIs de solicitações em análise, conflitos, disponíveis e decisões concluídas.
- Apresente cada solicitação com código, competição/versão, estádio candidato, avaliação vinculada, data, horário, solicitante, disponibilidade, análise técnica, decisão, aprovador, justificativa e próximos passos.
- Crie uma visualização temporal clara para detectar sobreposição de uso no mesmo estádio, incluindo intervalos de preparação/desmontagem se futuramente informados.
- Destaque o conflito entre JOGO-DEMO-001 (16h–20h) e JOGO-DEMO-002 (18h–22h), ambos no Estádio Alfa em 14/11/2026.
- Botão **“Registrar decisão”** abre formulário acessível com decisão, aprovador e justificativa obrigatória.
- Só permita “Aprovada” quando a disponibilidade for “Disponível” e a análise técnica for “Favorável”. Caso contrário, exiba erro claro e mantenha o formulário preenchido.
- Opções: Em análise, Aprovada, Condicionada e Reprovada.

### 10. Tela Governança

Título: **“Governança e acesso”**.

Crie uma matriz visual e textual de seis perfis:

- Administrador técnico: mantém cadastro, avalia, aprova e vê restritos.
- Mantenedor de cadastro: mantém cadastro; não avalia, não aprova e não vê restritos.
- Avaliador técnico: avalia e vê restritos; não mantém cadastro nem aprova.
- Aprovador: aprova e vê restritos; não mantém cadastro nem registra avaliação.
- Gestor de negócio: somente consulta autorizada.
- Participante externo: consulta ou fornece apenas conteúdo autorizado.

Inclua simulador de perfil que atualize permissões aparentes e explique que se trata de simulação. Diferencie claramente:

- **Demonstrado no protótipo**: matriz, interface e separação conceitual.
- **A validar na monday**: permissões reais, conta não proprietária, arquivos, links, espelhamento, exportação, revogação e trilha disponível.

Inclua seção **“Segurança não é aparência”** explicando que coluna escondida, filtro, grupo ou view personalizada não equivalem a controle de acesso. Inclua checklist de testes e uma matriz “necessidade → evidência → pergunta sobre plano”, sem prometer SSO, provisionamento, auditoria imutável ou exclusividade Enterprise sem validação.

Inclua catálogo de automações propostas, cada uma com condição, ação, segurança e fallback manual:

- Evidência próxima do vencimento.
- Evidência vencida.
- Alteração de dado crítico.
- Verificações concluídas.
- Solicitação pronta.
- Pendência resolvida.

Nenhuma automação deve aprovar automaticamente.

### 11. Tela Roteiro da demo

Crie uma narrativa guiada de 8 etapas, com botão para abrir a tela correspondente:

1. **Localizar — Território:** selecionar Copa Nacional Feminina 2026 v1.0 e localizar Estádio Alfa.
2. **Entender — Estádios:** abrir o dossiê e separar capacidade, origem, atualização e classificação.
3. **Comparar — Avaliações:** comparar o mesmo estádio em competições/versões diferentes.
4. **Explicar — Avaliações:** mostrar o requisito obrigatório que bloqueia o Estádio Beta.
5. **Resolver — Solicitações:** mostrar as duas janelas sobrepostas no Estádio Alfa.
6. **Decidir — Solicitações:** registrar decisão com aprovador e justificativa.
7. **Governar — Governança:** alternar entre avaliador, aprovador e participante externo.
8. **Posicionar — Governança:** relacionar controles às necessidades Enterprise sem vender o mapa como exclusivo.

Mostre também uma seção de cobertura do briefing com estados “Demonstrado” e “A validar”, e um fechamento com quatro respostas: onde estão os estádios, por que atendem ou não, qual pendência impede o próximo passo e quem avaliou/aprovou com qual justificativa.

### 12. Modelo de dados relacional

Crie dados próprios do aplicativo ou boards relacionados, conforme for mais adequado no Vibe. Use IDs estáveis e preserve as relações. Entidades:

1. **Estádios**: id, código, nome, cidade, UF, região, latitude, longitude, capacidade declarada, situação cadastral, responsável, fonte, atualização, próxima revisão, classificação e documentação.
2. **Competições e edições**: id, código, nome, edição, versão, situação, vigência inicial/final, área proprietária e responsável.
3. **Requisitos por competição**: id, competição/versão, código, nome, categoria, tipo, operador, limite, unidade, obrigatoriedade, evidência exigida, validade, referência e responsável.
4. **Avaliações de estádio**: id, código, estádio, competição/versão, data de referência, validade, avaliador, revisor, resultado técnico, aprovação, quantidade esperada, pendência, próxima ação, data e justificativa da aprovação.
5. **Verificações de requisitos**: id, avaliação, requisito, valor observado, unidade, fonte/documento, validade da evidência, avaliador, data, resultado, justificativa e responsável pela pendência.
6. **Solicitações de jogos**: id, código, competição/versão, estádio, avaliação vinculada, data, início, fim, solicitante, disponibilidade, evidência, análise técnica, decisão, aprovador, justificativa e próximos passos.

Não use um único campo “competições atendidas” no cadastro como fonte de decisão. A avaliação usada pela solicitação deve corresponder ao mesmo estádio, competição, edição e versão.

### 13. Base fictícia inicial obrigatória

Competições:

- `comp-cnf-2026-v1`: Copa Nacional Feminina, código CNF-2026, edição 2026, versão 1.0, Vigente, 15/01/2026 a 20/12/2026.
- `comp-sd-2026-v2`: Supercopa de Desenvolvimento, código SD-2026, edição 2026, versão 2.0, Vigente, 01/03/2026 a 30/11/2026.
- `comp-cnf-2026-v2`: Copa Nacional Feminina, CNF-2026, edição 2026, versão 2.0, Rascunho, 01/09/2026 a 20/12/2026, usada para demonstrar versionamento e reavaliação.

Estádios:

- `EST-ALFA`, Estádio Alfa, São Paulo/SP, Sudeste, coordenadas -23.5505/-46.6333, capacidade 45.000, “Validado para consulta”, atualizado em 20/09/2026, próxima revisão 20/03/2027.
- `EST-BETA`, Estádio Beta, Rio de Janeiro/RJ, Sudeste, coordenadas -22.9068/-43.1729, capacidade 32.000, “Em revisão”, atualizado em 12/08/2026, próxima revisão 12/02/2027.
- `EST-GAMA`, Estádio Gama, Salvador/BA, Nordeste, coordenadas -12.9777/-38.5016, capacidade 38.000, “Desatualizado”, atualizado em 05/12/2025, próxima revisão 05/06/2026.
- `EST-DELTA`, Estádio Delta, Brasília/DF, Centro-Oeste, sem capacidade e sem localização, “Rascunho”, atualizado em 01/10/2026, próxima revisão 20/10/2026.

Requisitos demonstrativos:

- CNF v1.0: capacidade mínima 35.000 lugares; documento dentro da validade; revisão humana de infraestrutura. Todos obrigatórios.
- SD v2.0: capacidade mínima 30.000 lugares, obrigatória.

Avaliações:

- Alfa/CNF: Atende, Aprovada, 3/3 verificações, sem pendência.
- Beta/CNF: Não atende por capacidade de 32.000 abaixo de 35.000.
- Gama/CNF: Evidência vencida; documento venceu em 31/07/2026 e revisão humana está pendente.
- Delta/CNF: Pendente; cadastro, capacidade e localização incompletos.
- Alfa/SD: Atende, Em revisão, 1/1 verificação, aguardando decisão humana final.

Solicitações:

- `JOGO-DEMO-001`: CNF, Estádio Alfa, 14/11/2026, 16h–20h, disponibilidade “Conflito”, análise favorável, em análise.
- `JOGO-DEMO-002`: SD, Estádio Alfa, 14/11/2026, 18h–22h, disponibilidade “Conflito”, análise favorável, em análise.
- `JOGO-DEMO-003`: CNF, Estádio Beta, 22/11/2026, 15h–19h, disponibilidade “Disponível”, análise desfavorável, em análise.

Use nomes fictícios claros para responsáveis, como “Ana Souza (fictícia)”, “Bruno Lima (fictício)”, “Pedro Silva (fictício)” e “Marina Costa (fictícia)”.

### 14. Funcionalidades e estados

- Busca, filtros, seleção coordenada, drill-down e navegação entre entidades.
- Persistir alterações dentro da aplicação/boards do Vibe.
- Botão “Restaurar demo” repõe exatamente a base inicial e solicita confirmação antes de apagar alterações da sessão.
- Estados de carregamento, vazio, erro, parcial e sem localização.
- Datas e números no padrão `pt-BR`.
- Mensagens de sucesso e erro com região `aria-live`.
- URLs ou estado compartilhável para tela, filtros e entidade selecionada, se suportado.
- As telas devem funcionar como um fluxo, não como páginas isoladas.

### 15. Critérios de aceite

Considere a primeira geração concluída somente quando:

- Todas as sete telas existirem e forem navegáveis.
- O mapa correto do Brasil mostrar 27 UFs, três estádios georreferenciados e uma lista explícita do Estádio Delta sem localização.
- A troca de competição/versão alterar os resultados sem apagar o histórico.
- Alfa, Beta, Gama e Delta demonstrarem respectivamente cenário positivo, falha obrigatória, evidência vencida e cadastro incompleto.
- O conflito das duas solicitações do Estádio Alfa estiver visível.
- Aprovação técnica inválida e aprovação de solicitação sem disponibilidade/análise favorável forem bloqueadas com mensagem clara.
- Toda decisão exigir pessoa e justificativa.
- O layout não apresentar sobreposição, cortes, texto minúsculo ou contraste ruim.
- Nada depender somente de hover ou cor.
- Dados fictícios e limitações estiverem claros.
- A aplicação estiver visualmente próxima de uma central de operações premium da CBF, sem parecer template genérico.

Gere a aplicação completa agora. Se algum recurso não puder ser implementado nativamente no Vibe, mantenha a experiência funcional com um fallback explícito e registre na própria tela “A validar na monday”, sem fingir que o controle existe.

## FIM DO PROMPT

---

## Prompts de refinamento recomendados

Use estes prompts somente após a primeira geração, um por vez, revisando o resultado entre eles.

### 1. Auditoria visual e acessibilidade

> Faça uma auditoria completa em todas as telas. Corrija fontes abaixo de 14 px, contraste insuficiente, truncamento, sobreposição, overflow, cards que não crescem com o conteúdo, foco invisível, alvos de toque pequenos, informação dependente apenas de cor ou hover e navegação por teclado. Não altere as regras de negócio nem os dados. Remova bordas coloridas usadas para estado e substitua por selo, ícone, faixa interna suave ou fundo tonal. Garanta WCAG AA e responsividade real entre 360 px e desktop amplo.

### 2. Qualidade territorial

> Aprimore somente a tela Território. Garanta um mapa vetorial geograficamente correto do Brasil com 27 UFs, marcadores legíveis e inspector sincronizado. Preserve os três modos Elegibilidade, Capacidade e Qualidade cadastral. Separe visualmente significado dos dados e estado selecionado, mantenha valores essenciais visíveis sem hover, inclua busca, zoom, reset, navegação por teclado, alternativa textual e lista do registro sem localização. Evite 3D decorativo; qualquer profundidade deve ajudar orientação e ter fallback plano.

### 3. Validação funcional

> Execute uma revisão funcional de ponta a ponta. Verifique filtros, relações, versionamento, busca, dossiê, expansão de verificações, restauração da base, conflito de horários, formulário de revisão e formulário de decisão. Confirme que dado ausente nunca aprova, requisito obrigatório não pode ser compensado por média, evidência vencida bloqueia conclusão positiva e solicitação só pode ser aprovada quando disponibilidade e análise técnica forem favoráveis. Corrija qualquer comportamento que viole essas regras.

### 4. Polimento executivo

> Faça o acabamento final para apresentação à CBF. Preserve a identidade azul-marinho, verde, ouro e fundo claro, o mapa e todos os fluxos. Reduza aparência de template genérico, organize a hierarquia visual, elimine excesso de cards e decorações sem função, mantenha textos e números legíveis e faça cada tela ser compreensível em uma captura de tela sem hover. Não remova ressalvas, rastreabilidade nem estados “A validar na monday”.

