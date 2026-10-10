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

## Design 2 — Território como sala de controle

```text
Refine somente a página Território, preservando dados, mapa e interações. Transforme-a na principal sala de controle.

Use título editorial “Visão territorial de estádios” e seletor de contexto acima de um console escuro dominante. No desktop, o console possui mapa amplo à esquerda e inspector fixo de aproximadamente 318 px à direita. Fundo do mapa em navy profundo com grade cartográfica discreta; Brasil e limites estaduais em verdes fechados, rótulos legíveis e marcadores luminosos sem efeitos decorativos.

No topo do mapa, mostre “MALHA IBGE · 27 UFs”, contexto selecionado e controle segmentado Elegibilidade, Capacidade e Qualidade. O inspector deve ter nome, localização, resultado técnico, decisão humana, capacidade, completude, fonte, revisão e navegação anterior/próximo. Abaixo, use uma faixa escura de indicadores e uma fila de ação numerada.

Use ouro somente para seleção e ação principal, verde para favorável, vermelho para bloqueio, âmbar para vencimento e azul para pendência. Não use cor nas bordas externas dos cards. No celular, mapa primeiro e inspector em bottom sheet.
```

## Design 3 — Estádios e Competições

```text
Refine somente Estádios e Competições, sem alterar dados ou funcionamento.

Em Estádios, crie hero escuro institucional com título, busca e seletor; abaixo, faixa navy contínua com quatro indicadores. Mostre os estádios em grade de dois passaportes operacionais: cabeçalho navy com código, nome, localização e selo; corpo claro com anel de capacidade, barra de qualidade e metadados; rodapé claro com fonte e botão. Use status dentro do conteúdo, nunca na borda externa. O dossiê deve ter hero navy, escudo, nome grande, indicador circular de qualidade e blocos claros de inspeção.

Em Competições, use hero escuro e uma régua horizontal navy com versões numeradas. Abaixo, componha duas colunas: capa de regulamento escura com escudo e metadados à esquerda; requisitos claros e expansíveis à direita. Cada requisito usa índice verde interno, título, regra, evidência, validade e aviso demonstrativo. Evite grades genéricas de cards iguais e preserve quebra de texto.
```

## Design 4 — Avaliações e Solicitações

```text
Refine somente Avaliações e Solicitações, mantendo todas as regras e ações.

Em Avaliações, use hero navy com seletor e uma faixa escura contínua de quatro métricas. A matriz deve parecer uma mesa de decisão: fundo navy, linhas largas com código, estádio, pontos de verificação, selos, pendência, próxima ação e botão. Comunique estado por fundo tonal interno, chips e uma pequena barra de progresso dentro da linha, nunca por borda colorida externa.

Em Solicitações, use hero escuro e uma régua horizontal das seis etapas do fluxo. A área principal tem solicitações claras à esquerda e painel de conflito escuro à direita. Cada solicitação deve ter bloco vertical de data, código, estádio e três células internas para elegibilidade, disponibilidade e análise técnica. O conflito deve mostrar timeline 14h–22h, duas barras sobrepostas e faixa explícita “2h de sobreposição”, seguida de regras e gate de decisão. Vermelho fica restrito ao conflito real.
```

## Design 5 — Governança e Roteiro

```text
Refine somente Governança e Roteiro da demo, preservando conteúdo e navegação.

Em Governança, use hero navy “Centro de confiança” com resumo “4 camadas”. Abaixo, duas colunas: simulador de papéis com perfil em foco e capacidades tonais; matriz de acesso clara com cabeçalho navy e linha selecionada em verde suave. Na sequência, combine testes de segurança claros, arquitetura de dados em painel navy e automações em blocos brancos com marcadores internos.

No Roteiro, crie hero navy com escudo, título forte, chips e botão ouro. Mostre as oito etapas em grade 4×2 de cartões amplos, numerados por círculos internos verdes ou ouro, com categoria, verbo, descrição, aprendizado e botão quadrado ouro. Abaixo, cobertura do briefing e fechamento executivo. Preserve muito espaço, alinhamento e hierarquia; não transforme tudo em cards iguais nem use bordas coloridas de estado.
```

## Design 6 — Conferência de fidelidade

```text
Faça uma conferência visual final sem alterar nenhuma função. Compare todas as páginas com este contrato: shell institucional consistente; sidebar navy de 224 px; topbar branca; fundo técnico claro; hero navy próprio por módulo; ouro reservado para seleção e ações; verde para operação favorável; vermelho apenas para bloqueio; tipografia legível; componentes sem sobreposição; e layouts específicos para mapa, passaportes, versões, matriz, timeline, governança e roteiro.

Corrija páginas que ainda pareçam templates genéricos, tenham cards iguais demais, espaços vazios sem intenção, textos pequenos, contraste fraco, bordas coloridas de estado ou hierarquia rasa. Preserve os dados e a lógica. Teste desktop, tablet e celular. No mobile, o conteúdo principal deve aparecer antes de filtros extensos; use drawer ou bottom sheet sem perder seleção. Ao terminar, liste página por página o que foi ajustado e confirme que nenhum comportamento funcional mudou.
```
