# Restauração visual da demo CBF no monday Vibe

Use os prompts abaixo no mesmo aplicativo, um por vez. Eles alteram somente apresentação e composição; dados, quadros, relações, regras e ações devem permanecer intactos.

## Design 1A — Shell institucional global

```text
Redesenhe somente a estrutura visual global do aplicativo existente. Não altere dados, quadros, relações, textos, regras, filtros, rotas ou ações.

Aplique uma central de operações institucional da CBF. No desktop, use sidebar fixa de 224 px em azul-marinho profundo (#071d31 até #04121e), escudo da CBF no topo, identificação “CBF · Central de Operações · Estádios & Governança” e menu vertical com ícones lineares. O item ativo recebe fundo verde translúcido e pequeno marcador amarelo interno, nunca borda colorida no card.

Use topbar branca de aproximadamente 82 px com breadcrumb, título, subtítulo, “Sincronizado agora”, selo amarelo “AMBIENTE DEMO” e avatar. Fundo do conteúdo #edf2f4 com grade técnica muito discreta de 44 px. Preserve acessibilidade e responsividade. Nesta etapa, mude somente o shell compartilhado; não redesenhe ainda o conteúdo interno das páginas.
```

## Design 1B — Tokens e hierarquia visual

```text
Continue o redesign visual do aplicativo atual sem alterar dados ou funcionamento. Aplique estes tokens globalmente: navy #061728, verde #19c985, ouro #ffd447, branco e cinzas azulados; vermelho somente para bloqueio real.

Use Inter ou equivalente, títulos fortes de 24–34 px, corpo de 15–16 px e metadados nunca menores que 12 px. Use raios de 16–22 px, divisores discretos e sombras profundas porém suaves. Grandes seções de comando podem usar fundo navy; conteúdo detalhado permanece claro.

Elimine aparência de template genérico, cards repetitivos, brilhos, sombras pesadas, gradientes decorativos e espaços vazios sem função. Não use bordas coloridas para estado; comunique com selos, ícones, marcadores internos e fundos tonais. Mantenha contraste WCAG AA, foco visível e alvos de toque adequados. Preserve integralmente o shell criado na etapa anterior.
```

## Design 2A — Console territorial e mapa

```text
Refine somente a estrutura visual principal da página Território, preservando todos os dados, filtros e interações. Transforme-a na principal sala de controle.

Use título editorial “Visão territorial de estádios” e seletor de contexto acima de um console escuro dominante. No desktop, o console possui mapa amplo à esquerda e inspector fixo de aproximadamente 318 px à direita. Fundo do mapa em navy profundo com grade cartográfica discreta; Brasil e limites estaduais em verdes fechados, rótulos legíveis e marcadores luminosos sem efeitos decorativos.

No topo do mapa, mostre “MALHA IBGE · 27 UFs”, contexto selecionado e controle segmentado Elegibilidade, Capacidade e Qualidade. Use ouro somente para seleção, verde para favorável, vermelho para bloqueio, âmbar para vencimento e azul para pendência. Não use cor nas bordas externas. Nesta etapa, não redesenhe o inspector nem as áreas abaixo do mapa.
```

## Design 2B — Inspector e faixa operacional

```text
Continue o redesign da página Território sem alterar dados ou interações. Preserve integralmente o mapa e o console criados na etapa anterior.

Transforme a coluna direita em inspector navy de aproximadamente 318 px. Mostre código, nome, cidade/UF/região, resultado técnico, decisão humana, capacidade declarada, critérios favoráveis, completude, situação cadastral, fonte e próxima revisão. Inclua botões anterior, “Abrir dossiê completo” e próximo, com seleção ouro e textos legíveis.

Abaixo do console, crie uma faixa operacional escura e contínua para Aprovado, Bloqueado, Evidência vencida, Cadastro incompleto e Em decisão. Depois, mostre “Pendências que alteram a decisão” como fila numerada sincronizada com o mapa.

No celular, mantenha o mapa antes dos filtros longos; abra o inspector em bottom sheet; preserve seleção, zoom e lista textual. Não use bordas coloridas de estado, cards genéricos ou efeitos 3D decorativos.

```

## Design 3A — Estádios e dossiê

```text
Refine somente Estádios e o dossiê, sem alterar dados ou funcionamento.

Crie hero escuro institucional com título, busca e seletor; abaixo, faixa navy contínua com quatro indicadores. Mostre os estádios em grade de dois passaportes operacionais: cabeçalho navy com código, nome, localização e selo; corpo claro com anel de capacidade, barra de qualidade e metadados; rodapé claro com fonte e botão. Use status dentro do conteúdo, nunca na borda externa.

O dossiê deve abrir como superfície executiva ampla: hero navy com escudo, código, nome grande, localização e indicador circular de qualidade. Abaixo, organize cadastro, fonte, revisão, coordenadas e avaliações em blocos claros de inspeção, com títulos fortes e textos legíveis. Preserve fechamento por botão e Escape, foco e quebra de texto.
```

## Design 3B — Competições e requisitos

```text
Refine somente Competições, sem alterar dados, versões ou funcionamento.

Use hero escuro institucional com título, explicação e seletor. Abaixo, crie uma régua horizontal navy com versões numeradas; a versão ativa recebe fundo verde profundo, indicador ouro interno e texto de vigência.

Componha a área principal em duas colunas: capa de regulamento escura com escudo, selo de versão, nome, vigência e metadados à esquerda; requisitos claros e expansíveis à direita. Cada requisito usa índice verde interno, categoria, título, regra, evidência, validade, obrigatoriedade e aviso demonstrativo.

Os painéis devem crescer com o conteúdo sem sobreposição. Evite cards genéricos iguais e mantenha o histórico visual de versões.
```

## Design 4A — Avaliações

```text
Refine somente Avaliações, mantendo todas as regras, filtros e ações.

Use hero navy com título, explicação e seletor. Abaixo, crie uma faixa escura contínua de quatro métricas, separadas por divisores discretos, com números grandes e observações legíveis.

A matriz deve parecer uma mesa de decisão: cabeçalho claro e corpo navy, com linhas largas contendo código, estádio, contexto, pontos de verificação, selos de resultado e aprovação, pendência, próxima ação e botão “Revisar decisão”. Comunique estado por fundo tonal interno, chips e pequena barra de progresso dentro da linha, nunca por borda colorida externa.

Preserve expansão de verificações e comparação Alfa CNF × SD. Use verde, vermelho, âmbar e azul somente com texto e ícones redundantes.
```

## Design 4B — Solicitações e conflito

```text
Refine somente Solicitações, mantendo todas as regras, dados e ações.

Use hero escuro e uma régua navy horizontal das seis etapas do fluxo. A área principal tem solicitações claras à esquerda e painel de conflito escuro à direita. Cada solicitação deve ter bloco vertical de data, código, estádio, contexto e três células internas para elegibilidade, disponibilidade e análise técnica, além de próxima ação e botão.

O painel de conflito mostra cabeçalho vermelho, timeline 14h–22h, duas barras sobrepostas e indicação explícita “2h de sobreposição”, seguida de três regras e um gate de decisão navy. Vermelho fica restrito ao conflito real. Preserve alternativa tabular, formulário, bloqueios e justificativas.
```

## Design 5A — Governança

```text
Refine somente Governança, preservando conteúdo, simulações e navegação.

Use hero navy “Centro de confiança” com título “Controle demonstrável, limites declarados” e resumo interno “4 camadas”. Abaixo, use duas colunas: simulador de papéis com perfil em foco e capacidades em fundos tonais; matriz de acesso clara com cabeçalho navy e linha selecionada em verde suave.

Na sequência, combine testes de segurança em superfície clara, arquitetura das seis entidades em painel navy e automações em blocos brancos com marcadores internos. Diferencie “Demonstrado” e “A validar” com chips e ícones, nunca bordas coloridas. Preserve todos os avisos sobre permissões reais.
```

## Design 5B — Roteiro da demo

```text
Refine somente Roteiro da demo, preservando conteúdo, atalhos e contexto.

Crie hero navy amplo com escudo, “Roteiro executivo · 12 minutos”, título forte, descrição, três chips e botão ouro “Iniciar demonstração”.

Mostre as oito etapas em grade 4×2 de cartões amplos. Cada cartão possui categoria verde, verbo principal, descrição, aprendizado em azul, número dentro de círculo verde ou ouro e botão quadrado ouro. Varie o destaque interno sem usar bordas coloridas.

Abaixo, mantenha Cobertura do briefing e Fechamento recomendado em seções executivas claras. Preserve bastante espaço, alinhamento e hierarquia. No celular, use uma coluna mantendo os botões e a ordem 1–8.
```

## Design 6A — Conferência de fidelidade visual

```text
Faça uma conferência visual de todas as páginas sem alterar nenhuma função. Garanta: sidebar navy de 224 px; topbar branca; fundo técnico claro; hero navy próprio por módulo; ouro reservado para seleção e ações; verde para operação favorável; vermelho apenas para bloqueio; tipografia legível e componentes sem sobreposição.

Confira os layouts específicos: console cartográfico em Território; passaportes em Estádios; regulamento e versões em Competições; matriz escura em Avaliações; timeline e conflito em Solicitações; centro de confiança em Governança; jornada 4×2 no Roteiro.

Corrija páginas que ainda pareçam templates genéricos, tenham cards iguais demais, espaços vazios sem intenção, textos pequenos, contraste fraco, bordas coloridas de estado ou hierarquia rasa. Preserve dados e lógica. Liste página por página os ajustes realizados.
```

## Design 6B — Responsividade e regressão funcional

```text
Faça a última validação do aplicativo sem redesenhar o visual aprovado. Teste desktop, tablet, celular entre 360 e 430 px e celular em paisagem para o mapa.

Corrija somente overflow, textos cortados, sobreposições, controles inacessíveis e perda de hierarquia. No celular, mostre o conteúdo principal antes de filtros extensos; use drawer ou bottom sheet; preserve mapa, seleção, zoom, tabelas alternativas e navegação. Não reduza fontes para encaixar conteúdo.

Confirme que o redesign não alterou dados, quadros, relações, filtros, busca, mapa, modais, formulários, decisões, restauração da demo ou atalhos do roteiro. Teste os botões principais e corrija apenas regressões visuais ou funcionais introduzidas pelo redesign.

Ao terminar, informe quais resoluções foram testadas, quais problemas foram corrigidos e confirme que nenhum comportamento de negócio mudou.
```
