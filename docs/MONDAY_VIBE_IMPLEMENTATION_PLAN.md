# Plano de implementação — CBF no monday Vibe

Este plano substitui o prompt mestre único por **12 prompts cumulativos**. Use todos no mesmo aplicativo e na ordem indicada.

## Como executar sem timeout

1. Crie somente um aplicativo no monday Vibe.
2. Envie o Prompt 1 e espere a geração terminar completamente.
3. Confira o checkpoint da etapa antes de enviar o próximo prompt.
4. Envie apenas um prompt por vez; não coloque vários prompts na fila.
5. Nunca comece um novo app entre as etapas.
6. Se uma etapa falhar, use o prompt de recuperação no final deste documento antes de tentar novamente.
7. Não peça polimento visual pesado enquanto as regras e relações ainda estiverem sendo construídas.

## Arquitetura da experiência

- **Trabalho analítico:** geografia, monitoramento operacional, comparação regulatória e decisão governada.
- **Artefato principal:** central de operações com mapa territorial, listas relacionadas, matrizes e formulários de decisão.
- **Caminho de leitura:** localizar → entender cadastro → comparar regra → explicar resultado → verificar disponibilidade → decidir → governar.
- **Fallback do mapa:** lista textual sincronizada de estádios e UFs, sempre disponível.
- **Estado compartilhado:** competição/versão selecionada, estádio selecionado, filtros e tela ativa devem permanecer ao navegar, quando o Vibe suportar.
- **Mobile:** a evidência principal aparece primeiro; filtros e detalhes ficam em drawer ou bottom sheet; nada depende de hover.
- **Dados:** base pequena, determinística e 100% fictícia.

---

## Prompt 1 — Fundação, navegação e identidade visual

```text
Crie a fundação de um aplicativo no monday Vibe chamado “CBF | Central de Operações — Estádios e Governança”. Nesta etapa, construa somente a estrutura global, a navegação e o sistema visual. Não implemente ainda mapa, regras complexas ou formulários de decisão.

O aplicativo é uma demonstração em português do Brasil. Crie menu lateral com sete páginas: Território, Estádios, Competições, Avaliações, Solicitações, Governança e Roteiro da demo. No cabeçalho, mostre breadcrumb, título da página, subtítulo curto, indicador “Sincronizado agora”, selo “AMBIENTE DEMO” e avatar demonstrativo.

Inclua em todas as páginas um aviso visível e discreto: “Demonstração — dados 100% fictícios; não representa homologação oficial da CBF.”

Use uma identidade institucional e tecnológica inspirada na CBF: azul-marinho profundo para navegação e áreas de comando, verde para estados positivos, amarelo-ouro para destaque institucional, fundo geral muito claro, vermelho apenas para bloqueios e âmbar para atenção. Use tipografia altamente legível: texto normal com aproximadamente 16 px ou mais e metadados com pelo menos 14 px e alto contraste.

Não use bordas coloridas para comunicar situação. Prefira selos, ícones, fundos tonais suaves e marcadores internos. Evite excesso de cards flutuantes, gradientes decorativos, brilhos e elementos sem função. Nada pode se sobrepor, cortar texto ou passar por baixo de outro componente.

Em cada página, crie apenas um estado vazio elegante com o nome e uma frase explicando o objetivo futuro. Prepare layout responsivo: menu lateral no desktop e navegação compacta/drawer no celular. Todos os controles devem ter foco de teclado visível e alvos de toque adequados.

Ao terminar, preserve essa fundação para as próximas etapas e não invente dados reais da CBF.
```

### Checkpoint 1

- As sete páginas existem e a navegação funciona.
- O aviso de dados fictícios está visível.
- Identidade visual, fontes e responsividade básica estão consistentes.
- Ainda não existe lógica complexa.

---

## Prompt 2 — Modelo de dados e base fictícia

```text
Continue o aplicativo existente. Não recrie a navegação nem altere a identidade visual. Nesta etapa, implemente o modelo de dados relacional e carregue a base fictícia inicial. Ainda não construa o mapa nem os formulários finais.

Crie seis entidades com IDs estáveis:

1. Estádios: id, código, nome, cidade, UF, região, latitude, longitude, capacidade declarada, situação cadastral, responsável, fonte, atualização, próxima revisão e classificação.
2. Competições: id, código, nome, edição, versão, situação, vigência inicial/final, área proprietária e responsável.
3. Requisitos: id, competição/versão, código, nome, categoria, tipo, operador, limite, unidade, obrigatoriedade, evidência exigida, validade e aviso demonstrativo.
4. Avaliações: id, código, estádio, competição/versão, data de referência, validade, avaliador, revisor, resultado técnico, aprovação, verificações esperadas, pendência, próxima ação, data e justificativa da aprovação.
5. Verificações: id, avaliação, requisito, valor observado, validade da evidência, avaliador, resultado e justificativa.
6. Solicitações de jogos: id, código, competição/versão, estádio, avaliação vinculada, data, início, fim, solicitante, disponibilidade, análise técnica, decisão, aprovador, justificativa e próximos passos.

Carregue estes dados:

Competições: Copa Nacional Feminina 2026 v1.0 vigente; Supercopa de Desenvolvimento 2026 v2.0 vigente; Copa Nacional Feminina 2026 v2.0 em rascunho.

Estádios: EST-ALFA em São Paulo/SP, coordenadas -23.5505/-46.6333, capacidade 45.000, validado; EST-BETA no Rio de Janeiro/RJ, -22.9068/-43.1729, capacidade 32.000, em revisão; EST-GAMA em Salvador/BA, -12.9777/-38.5016, capacidade 38.000, desatualizado; EST-DELTA em Brasília/DF, sem capacidade e sem localização, rascunho.

Requisitos: para CNF v1.0, capacidade mínima fictícia de 35.000, documento dentro da validade e revisão humana de infraestrutura, todos obrigatórios; para SD v2.0, capacidade mínima fictícia de 30.000. Marque todos como “Exemplo demonstrativo, não é requisito oficial da CBF.”

Avaliações: Alfa/CNF atende e está aprovada com 3/3 verificações; Beta/CNF não atende por capacidade; Gama/CNF tem evidência vencida e validação pendente; Delta/CNF está pendente por cadastro incompleto; Alfa/SD atende e está em revisão com 1/1 verificação.

Solicitações: JOGO-DEMO-001 no Alfa em 14/11/2026 das 16h às 20h, conflito; JOGO-DEMO-002 no Alfa na mesma data das 18h às 22h, conflito; JOGO-DEMO-003 no Beta em 22/11/2026 das 15h às 19h, disponível, mas com análise técnica desfavorável.

Implemente um botão “Restaurar demo” que peça confirmação e recarregue exatamente essa base. Preserve relações por ID. Um dado ausente deve continuar ausente e nunca virar aprovação.
```

### Checkpoint 2

- As seis entidades e relações existem.
- A base contém quatro estádios, três contextos de competição, requisitos, cinco avaliações e três solicitações.
- Restaurar demo funciona.

---

## Prompt 3 — Território: estrutura operacional sem mapa complexo

```text
Continue o mesmo aplicativo e preserve tudo que já existe. Implemente a página Território usando os dados atuais, mas ainda não gere a geometria detalhada do mapa do Brasil; deixe uma área de mapa preparada para a próxima etapa.

Crie o título “Visão territorial de estádios” e o subtítulo “Capacidade, elegibilidade e qualidade cadastral em uma única leitura operacional”. Inclua seletor de competição, edição e versão e o botão Restaurar demo.

Organize a área principal como uma central operacional: grande viewport reservado para o mapa, inspector lateral sincronizado e faixa inferior de indicadores. Use como seleção inicial Copa Nacional Feminina 2026 v1.0 e Estádio Alfa.

No inspector, mostre nome, código, cidade, UF, região, capacidade declarada, situação cadastral, completude, resultado na competição selecionada, pendência, próxima ação e botão “Abrir dossiê”.

Na faixa operacional, mostre Aprovado, Bloqueado, Evidência vencida, Cadastro incompleto e Em decisão. Calcule sempre no contexto selecionado e não misture total de estádios com total de avaliações.

Abaixo, crie “Pendências que alteram a decisão”, ordenada por prioridade, com acesso ao estádio correspondente. Crie também uma lista textual de todos os estádios georreferenciados e outra seção “Sem localização válida”, na qual deve aparecer o Estádio Delta.

A área de mapa deve ter cabeçalho, botões Elegibilidade, Capacidade e Qualidade cadastral, legenda, fonte cartográfica e estado de carregamento. Nesta etapa ela pode usar uma representação simples ou placeholder funcional, mas todos os filtros, indicadores, listas e inspector já devem responder aos dados.
```

### Checkpoint 3

- Seletor, KPIs, inspector e filas funcionam sem depender do mapa.
- Delta aparece como registro sem localização.
- O mapa possui um espaço estável para receber a cartografia.

---

## Prompt 4 — Mapa territorial do Brasil

```text
Aprimore somente a página Território do aplicativo existente. Não reconstrua as outras páginas. Substitua o placeholder por um mapa vetorial geograficamente correto do Brasil com as 27 UFs. Use a malha simplificada do IBGE quando possível; se a fonte externa não estiver disponível, use uma geometria local confiável. Nunca desenhe uma aproximação grosseira.

Mostre limites estaduais discretos, siglas quando legíveis e marcadores de Alfa, Beta e Gama. Mantenha Delta na lista “Sem localização válida”. Implemente três modos coordenados:

- Elegibilidade: Atende, Não atende, Evidência vencida e Pendente, combinando cor, texto e ícone.
- Capacidade: tamanho do marcador proporcional à capacidade declarada, com escala explícita.
- Qualidade cadastral: intensidade ordenada por completude, deixando dados ausentes evidentes.

O estado selecionado não pode reutilizar a cor do dado; use contorno, bracket ou halo neutro de foco. Ao selecionar um marcador, UF ou item da lista, atualize o inspector e mantenha a seleção estável. Inclua busca, zoom, redefinir visualização, navegação por teclado e alternativa de seleção anterior/próximo.

Valores essenciais não podem depender de hover. No celular, o mapa aparece antes dos filtros extensos; o inspector abre em bottom sheet; os marcadores têm áreas de toque ampliadas; ofereça controles de zoom visíveis. Respeite movimento reduzido.

Inclua a fonte: “Fonte cartográfica: IBGE · malha simplificada · dados operacionais fictícios”. Pode usar sombra e profundidade sutil para orientação, mas não use 3D decorativo. Mantenha fallback plano e a lista textual sincronizada.
```

### Checkpoint 4

- O Brasil e as 27 UFs são reconhecíveis e corretos.
- Os três modos mudam a codificação sem perder a seleção.
- Teclado, toque, zoom, inspector e lista textual funcionam.

---

## Prompt 5 — Estádios e dossiê

```text
Continue o aplicativo atual e implemente apenas a página Estádios e o dossiê. Preserve o mapa, os dados, a navegação e o sistema visual.

Título: “Dossiês territoriais”. Inclua busca por estádio, cidade, UF ou código e filtro por competição/versão. Mostre resumo de registros, georreferenciados, validados para consulta e cadastros incompletos.

Para cada estádio, mostre código, nome, cidade/UF/região, capacidade declarada, completude cadastral, situação, resultado no contexto selecionado, número de avaliações, próxima revisão, fonte e botão “Abrir dossiê”. Não use borda colorida para situação; use selo, ícone e fundo tonal interno.

O dossiê deve abrir em modal ou painel acessível e mostrar: cadastro, responsável, classificação, coordenadas ou ausência, fonte, atualização, próxima revisão e todas as avaliações por competição/versão. Para cada avaliação, mostre verificações, resultado, justificativa, validade da evidência, pendência e próxima ação.

Se não existir avaliação, exiba “Nenhuma avaliação vinculada. O estádio não está elegível por padrão.” Mostre também “Capacidade declarada não equivale à capacidade autorizada ou homologada.”

O modal deve fechar por botão e Escape, prender foco corretamente enquanto aberto e devolver o foco ao botão que o abriu. Textos longos devem quebrar sem sobreposição.
```

### Checkpoint 5

- Busca e filtro funcionam.
- Todos os quatro estádios abrem dossiês coerentes.
- O modal é acessível e não apresenta sobreposição.

---

## Prompt 6 — Competições, versões e requisitos

```text
Continue o mesmo app. Implemente apenas a página Competições. Não altere dados ou telas já concluídas.

Título: “Competições e requisitos”. Crie seletor de competição, edição e versão e uma linha do tempo ou abas para versões. Mostre nome, código, edição, versão, situação, vigência, área proprietária e responsável.

Liste os requisitos aplicáveis com código, categoria, descrição, tipo, operador/limite/unidade, obrigatoriedade, evidência exigida, validade e aviso “Exemplo demonstrativo, não é requisito oficial da CBF.”

A seleção CNF v1.0 deve mostrar três requisitos; SD v2.0 deve mostrar um. CNF v2.0 em rascunho deve preservar a versão anterior e deixar claro que a nova versão exige validação/reavaliação. Nunca sobrescreva silenciosamente a referência usada em decisões anteriores.

Se uma versão não tiver requisitos, mostre pendência explícita. Ausência de requisitos nunca significa “todos atendidos”. Garanta que o painel do regulamento e a lista de requisitos cresçam com o conteúdo e não se sobreponham.
```

### Checkpoint 6

- As três versões podem ser selecionadas.
- Requisitos mudam conforme o contexto.
- Histórico e avisos permanecem claros.

---

## Prompt 7 — Avaliações, verificações e aprovação

```text
Continue o aplicativo existente. Implemente somente a página Avaliações e as regras de consolidação. Preserve todas as outras áreas.

Título: “Avaliações de elegibilidade”. Inclua filtros por competição/versão, estádio, resultado técnico, aprovação e responsável. Mostre indicadores de avaliações, prontas para revisão, pendentes, não atendidas e evidências vencidas.

Crie uma matriz ou lista legível com código, estádio, contexto regulatório, resultado técnico, aprovação, verificações completas/esperadas, pendência e próxima ação. Permita expandir para ver requisitos, valores, evidências, validade, resultado e justificativa. Destaque que Alfa pode ter resultados diferentes em CNF e SD.

Implemente estas regras:
1. Deve existir exatamente uma verificação por requisito aplicável.
2. Linha ausente, vínculo incorreto, duplicidade, dado ausente ou evidência inacessível mantém pendência.
3. Evidência vencida impede conclusão positiva.
4. Falha em requisito obrigatório gera “Não atende”; média ou porcentagem não compensa.
5. “Critérios atendidos” significa pronto para revisão, não aprovação automática.
6. Só permita aprovação quando o resultado técnico for “Atende”.
7. Mudança relevante de capacidade, evidência, requisito, versão ou contexto exige reavaliação.

O botão “Revisar avaliação” abre formulário acessível com decisão, revisor e justificativa obrigatória. Se alguém tentar aprovar Beta, Gama ou Delta, bloqueie a ação com mensagem clara e preserve o conteúdo preenchido. Atualize os dados persistidos após uma decisão válida.
```

### Checkpoint 7

- Alfa pode ser aprovado; Beta, Gama e Delta são bloqueados corretamente.
- Expansões mostram verificações e evidências.
- Filtros e indicadores permanecem sincronizados.

---

## Prompt 8 — Solicitações, conflito e decisão

```text
Continue o app existente. Implemente somente a página Solicitações e sua lógica de decisão.

Título: “Solicitações de jogos”. Mostre indicadores de solicitações em análise, conflitos, disponíveis e decisões concluídas. Cada solicitação deve apresentar código, competição/versão, estádio, avaliação vinculada, data, horário, solicitante, disponibilidade, análise técnica, decisão, aprovador, justificativa e próximos passos.

Crie uma visualização temporal simples e legível do uso do estádio. Evidencie a sobreposição entre JOGO-DEMO-001, das 16h às 20h, e JOGO-DEMO-002, das 18h às 22h, ambos no Estádio Alfa em 14/11/2026. A visualização precisa ter rótulos diretos e alternativa em tabela; não dependa apenas de cor.

Mantenha elegibilidade e disponibilidade separadas. O botão “Registrar decisão” abre formulário acessível com opções Em análise, Aprovada, Condicionada e Reprovada, além de aprovador e justificativa obrigatórios.

Só permita “Aprovada” quando disponibilidade for “Disponível” e análise técnica for “Favorável”. Bloqueie a aprovação dos dois jogos em conflito e do jogo do Beta com análise desfavorável, mostrando o motivo sem apagar o formulário. Persista decisões válidas e atualize os indicadores.
```

### Checkpoint 8

- A sobreposição está visível em timeline e tabela.
- Aprovações incompatíveis são bloqueadas.
- Disponibilidade e elegibilidade não são confundidas.

---

## Prompt 9 — Governança, perfis e automações propostas

```text
Continue o aplicativo. Implemente somente a página Governança. Não altere os fluxos funcionais existentes.

Crie uma matriz de seis perfis: Administrador técnico; Mantenedor de cadastro; Avaliador técnico; Aprovador; Gestor de negócio; Participante externo. As capacidades são manter cadastro, avaliar, aprovar e visualizar conteúdo restrito.

Administrador possui todas; Mantenedor apenas mantém cadastro; Avaliador avalia e vê restritos; Aprovador aprova e vê restritos; Gestor consulta conteúdo autorizado; Participante externo consulta ou fornece somente conteúdo autorizado.

Inclua um simulador de perfil que atualize a interface, mas rotule claramente como simulação. Diferencie “Demonstrado no protótipo” de “A validar na monday”, incluindo permissões reais, contas não proprietárias, arquivos, links, espelhamento, exportação, revogação e histórico.

Adicione “Segurança não é aparência”: filtro, coluna escondida, grupo ou view personalizada não equivalem a controle de acesso. Não prometa SSO, provisionamento, auditoria imutável ou exclusividade Enterprise sem validação.

Crie uma lista de automações propostas: evidência próxima do vencimento; evidência vencida; alteração crítica; verificações concluídas; solicitação pronta; pendência resolvida. Para cada uma, mostre condição, ação, risco e fallback manual. Nenhuma automação pode aprovar automaticamente.
```

### Checkpoint 9

- A matriz e o simulador explicam a segregação de funções.
- Limites entre protótipo e permissão real estão explícitos.
- Automações não concedem aprovação automática.

---

## Prompt 10 — Roteiro executivo da demonstração

```text
Continue o aplicativo e implemente somente a página Roteiro da demo. Preserve as outras telas.

Crie um roteiro executivo de aproximadamente 12 minutos com oito etapas e botões que abrem a página correta mantendo o contexto:
1. Localizar — Território: selecionar CNF 2026 v1.0 e Estádio Alfa.
2. Entender — Estádios: abrir o dossiê e mostrar capacidade, origem, atualização e classificação.
3. Comparar — Avaliações: comparar Alfa em CNF e SD.
4. Explicar — Avaliações: mostrar o requisito obrigatório que bloqueia Beta.
5. Resolver — Solicitações: mostrar os dois horários sobrepostos no Alfa.
6. Decidir — Solicitações: abrir o registro de decisão com aprovador e justificativa.
7. Governar — Governança: alternar entre avaliador, aprovador e participante externo.
8. Posicionar — Governança: relacionar controles a necessidades Enterprise sem dizer que o mapa é exclusivo.

Adicione uma seção “Cobertura do briefing” com estados Demonstrado e A validar. No fechamento, responda: onde estão os estádios; por que atendem ou não; qual pendência impede o próximo passo; quem avaliou e aprovou com qual justificativa.

Use a frase de abertura: “Para esta competição e esta edição, quais estádios podemos analisar e o que falta resolver antes de decidir?”
```

### Checkpoint 10

- Os oito atalhos levam às telas e contextos corretos.
- O roteiro diferencia protótipo, validação e implantação real.

---

## Prompt 11 — Integração entre telas e integridade dos dados

```text
Faça uma revisão funcional do aplicativo inteiro sem redesenhar a interface. Corrija apenas integração, estado e consistência.

Garanta que competição/versão selecionada seja compartilhada entre Território, Estádios, Competições e Avaliações. A seleção de estádio no mapa, lista, fila de pendências e dossiê deve apontar para o mesmo ID. A avaliação usada numa solicitação deve corresponder ao mesmo estádio, competição, edição e versão.

Confirme que filtros, buscas, contagens e indicadores usam a mesma unidade e não duplicam estádios. Ausência de requisito, verificação, evidência, capacidade ou localização deve gerar pendência explícita. Alterar versão deve preservar histórico e sinalizar reavaliação. Restaurar demo deve repor todos os dados e estados iniciais após confirmação.

Teste o fluxo completo: localizar Alfa; abrir dossiê; comparar Alfa em CNF e SD; explicar Beta; encontrar documento vencido de Gama; localizar Delta sem georreferenciamento; visualizar conflito dos jogos do Alfa; bloquear decisões inválidas; registrar uma decisão válida quando as condições forem atendidas; alternar perfis; iniciar o roteiro guiado.

Corrija links quebrados, botões sem ação, estados vazios incorretos, erros de persistência e inconsistências entre páginas. Não remova ressalvas nem transforme simulação em controle real.
```

### Checkpoint 11

- O fluxo ponta a ponta funciona sem inconsistência.
- Dados e seleções são os mesmos em todas as telas.
- Não há botões quebrados.

---

## Prompt 12 — Acessibilidade, responsividade e acabamento final

```text
Faça o acabamento final do aplicativo inteiro. Não altere o modelo de dados nem as regras de negócio já validadas.

Audite todas as telas em desktop amplo, tablet, celular de 360–430 px e celular em paisagem para o mapa. Corrija fontes pequenas, contraste, truncamento, quebra de texto, overflow, sobreposição, componentes com altura fixa insuficiente e controles encobertos pelo teclado virtual.

Garanta WCAG AA: texto normal 4,5:1; texto grande e elementos gráficos importantes 3:1. Nada pode depender somente de cor ou hover. Adicione rótulos diretos, ícones e texto redundante. Todos os controles devem funcionar por teclado, ter foco visível e alvos de toque de 44–48 px quando possível. Modais devem controlar e restaurar foco; mensagens dinâmicas devem usar aria-live; respeite movimento reduzido.

No mobile, coloque mapa ou evidência principal antes de filtros longos, use drawer/bottom sheet para controles e preserve seleção ao abrir/fechar painéis. No mapa, mantenha zoom, reset e lista textual. Na timeline, mantenha alternativa tabular. Em tabelas densas, priorize colunas essenciais e detalhe expansível em vez de reduzir a fonte.

Remova bordas coloridas de estado e substitua por selos, ícones ou fundos tonais internos. Elimine aparência de template genérico, excesso de cards, brilhos e gradientes decorativos. Preserve azul-marinho, verde, ouro e fundo claro. Faça cada tela ser compreensível em uma captura de tela sem hover.

Por fim, verifique estados de carregamento, vazio, erro e dados parciais. Não esconda dados já carregados durante falhas temporárias. Entregue a aplicação pronta para apresentação, mantendo todos os avisos de dados fictícios e itens “A validar na monday”.
```

### Checkpoint 12

- Não há sobreposição, texto minúsculo, contraste ruim ou bordas coloridas de estado.
- Desktop e mobile preservam o mesmo sentido.
- O aplicativo está pronto para apresentação.

---

## Prompt de recuperação de timeout

Use este texto somente se uma etapa der timeout:

```text
Continue a implementação da última solicitação a partir do estado atual deste mesmo aplicativo. Não reinicie, não recrie páginas, não substitua o modelo de dados e não refaça funcionalidades já concluídas. Primeiro identifique silenciosamente o que da última etapa já existe. Depois implemente somente o que ficou incompleto, em mudanças pequenas. Preserve navegação, identidade visual, dados, relações, regras e avisos. Ao terminar, informe de forma curta quais itens da etapa foram concluídos e quais ainda precisam de outro prompt.
```

## Regra de decisão após cada etapa

- **Tudo certo:** seguir para o próximo prompt.
- **Visual incompleto, mas lógica correta:** não voltar etapas; anotar para o Prompt 12.
- **Lógica incompleta:** usar o prompt de recuperação antes de avançar.
- **Dados ou relações alterados indevidamente:** corrigir imediatamente antes do próximo prompt.
- **Vibe criou outra arquitetura:** pedir para preservar o app atual e corrigir somente a etapa, nunca colar novamente o prompt mestre inteiro.

