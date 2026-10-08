const app = document.querySelector('#app');
const dialog = document.querySelector('#decision-dialog');
const detailDialog = document.querySelector('#detail-dialog');
const toastRegion = document.querySelector('#toast-region');

let data;
let activeView = 'overview';
let selectedCompetitionId = 'comp-cnf-2026-v1';
let stadiumSearch = '';
let selectedRoleName = 'Avaliador técnico';
let territoryMap;
let territoryMarkers = [];
let mapMode = 'eligibility';
let selectedStadiumId = 'stad-alfa';
let lastDialogTrigger = null;

[dialog, detailDialog].forEach((modal) => modal.addEventListener('close', () => {
  if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus();
  lastDialogTrigger = null;
}));

const cbfLogoUrl = '/cbf-crest.svg';

const navItems = [
  ['overview', 'territory', 'Território'],
  ['stadiums', 'stadium', 'Estádios'],
  ['competitions', 'rules', 'Competições'],
  ['evaluations', 'check', 'Avaliações'],
  ['requests', 'calendar', 'Solicitações'],
  ['governance', 'shield', 'Governança'],
  ['demo', 'play', 'Roteiro da demo']
];

const navIconPaths = {
  territory: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  stadium: '<path d="M4 8c0-2 3.6-4 8-4s8 2 8 4v8c0 2-3.6 4-8 4s-8-2-8-4Z"/><path d="M4 8c0 2 3.6 4 8 4s8-2 8-4M8 10v8M16 10v8"/>',
  rules: '<path d="M6 3h10l2 2v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M13 14h3"/>',
  shield: '<path d="M12 3 20 6v5c0 5-3.2 8.2-8 10-4.8-1.8-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>'
};

function navIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${navIconPaths[name]}</svg>`;
}

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const formatDate = (value) => value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${value}T12:00:00`)) : '—';
const formatNumber = (value) => value == null ? 'Não informado' : new Intl.NumberFormat('pt-BR').format(value);
const byId = (collection, id) => data[collection].find((item) => item.id === id);

function badge(value) {
  const normalized = String(value || '').toLowerCase();
  const type = /atende|aprovada|disponível|validado|vigente/.test(normalized) && !/não/.test(normalized) ? 'good'
    : /não atende|reprovada|indisponível|desatualizado|vencida/.test(normalized) ? 'bad'
    : /conflito|condicionada|em revisão/.test(normalized) ? 'warn' : 'pending';
  return `<span class="badge ${type}">${escapeHtml(value || 'Não informado')}</span>`;
}

function showToast(message, type = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastRegion.append(toast);
  setTimeout(() => toast.remove(), 4200);
}

function evaluationFor(stadiumId, competitionId = selectedCompetitionId) {
  return data.evaluations.find((item) => item.stadiumId === stadiumId && item.competitionId === competitionId);
}

function resultTone(result) {
  if (result === 'Atende') return '#0ca968';
  if (result === 'Não atende') return '#e44d55';
  if (result === 'Evidência vencida') return '#e59420';
  return '#2f6fed';
}

function mapInspectorHtml(stadiumId) {
  const stadium = byId('stadiums', stadiumId) || data.stadiums[0];
  const evaluation = evaluationFor(stadium.id);
  const checks = evaluation ? data.checks.filter((item) => item.evaluationId === evaluation.id) : [];
  const approvedChecks = checks.filter((item) => item.result === 'Atende').length;
  const completeness = evaluation ? Math.min(100, Math.round((checks.length / evaluation.expectedChecks) * 100)) : 0;
  return `<div class="inspector-kicker"><span>ESTÁDIO SELECIONADO</span><span class="inspector-code">${escapeHtml(stadium.code)}</span></div>
    <div class="inspector-title"><div><h3>${escapeHtml(stadium.name)}</h3><p class="inspector-location">${escapeHtml(stadium.city)} · ${escapeHtml(stadium.state)} · ${escapeHtml(stadium.region)}</p></div><span class="state-orb">${escapeHtml(stadium.state)}</span></div>
    <div class="decision-pair"><div><span>Resultado técnico</span>${badge(evaluation?.technicalResult || 'Sem avaliação')}</div><div><span>Decisão humana</span>${badge(evaluation?.approval || 'Não enviada')}</div></div>
    <div class="inspector-metrics"><div><strong>${formatNumber(stadium.capacity)}</strong><span>capacidade declarada</span></div><div><strong>${approvedChecks}/${evaluation?.expectedChecks || 0}</strong><span>critérios favoráveis</span></div></div>
    <div class="inspector-progress"><div><span>Completude da avaliação</span><strong>${completeness}%</strong></div><i><b style="width:${completeness}%"></b></i></div>
    <dl><div><dt>Cadastro</dt><dd>${escapeHtml(stadium.registrationStatus)}</dd></div><div><dt>Fonte</dt><dd>${escapeHtml(stadium.source)}</dd></div><div><dt>Próxima revisão</dt><dd>${formatDate(stadium.nextReview)}</dd></div></dl>
    <div class="inspector-actions"><button class="map-step" data-map-step="-1" aria-label="Estádio anterior">←</button><button class="button inspector-button" data-stadium-detail="${stadium.id}">Abrir dossiê completo</button><button class="map-step" data-map-step="1" aria-label="Próximo estádio">→</button></div>`;
}

const stateCodes = {
  '11':'RO','12':'AC','13':'AM','14':'RR','15':'PA','16':'AP','17':'TO','21':'MA','22':'PI','23':'CE','24':'RN','25':'PB','26':'PE','27':'AL','28':'SE','29':'BA','31':'MG','32':'ES','33':'RJ','35':'SP','41':'PR','42':'SC','43':'RS','50':'MS','51':'MT','52':'GO','53':'DF'
};

function stateQuality(state) {
  const stadiums = data.stadiums.filter((item) => item.state === state);
  if (!stadiums.length) return 'neutral';
  if (stadiums.some((item) => !item.location || !item.capacity)) return 'pending';
  if (stadiums.some((item) => item.registrationStatus === 'Desatualizado')) return 'warn';
  if (stadiums.some((item) => item.registrationStatus === 'Em revisão')) return 'bad';
  return 'good';
}

function selectMapStadium(id) {
  selectedStadiumId = id;
  const inspector = document.querySelector('#map-inspector');
  if (inspector) inspector.innerHTML = mapInspectorHtml(id);
  bindDetailButtons();
  bindMapInspectorButtons();
  territoryMap?.redraw?.();
}

function bindMapInspectorButtons() {
  document.querySelectorAll('[data-map-step]').forEach((button) => button.addEventListener('click', () => {
    const geocoded = data.stadiums.filter((item) => item.location);
    const index = Math.max(0, geocoded.findIndex((item) => item.id === selectedStadiumId));
    const next = (index + Number(button.dataset.mapStep) + geocoded.length) % geocoded.length;
    selectMapStadium(geocoded[next].id);
  }));
}

async function initializeTerritoryMap() {
  const container = document.querySelector('#territory-map');
  if (!container || !window.d3) return;
  if (territoryMap?.destroy) territoryMap.destroy();
  container.innerHTML = '<div class="map-loading"><span class="spinner"></span><strong>Carregando malha oficial do IBGE…</strong></div>';
  try {
    let response = await fetch('/api/brazil-states');
    if (!response.ok) {
      response = await fetch('https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application%2Fvnd.geo%2Bjson&qualidade=minima&intrarregiao=UF');
    }
    if (!response.ok) throw new Error('Malha territorial indisponível');
    const geo = await response.json();
    // A malha do IBGE usa orientação de anéis oposta à convenção esférica do d3-geo.
    // Reverter todos os anéis impede que o motor desenhe o complemento do território.
    geo.features.forEach((feature) => {
      const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      polygons.forEach((polygon) => polygon.forEach((ring) => ring.reverse()));
    });
    const svg = window.d3.select(container).html('').append('svg').attr('role', 'group').attr('aria-label', 'Mapa do Brasil com limites das 27 unidades federativas e estádios demonstrativos');
    const defs = svg.append('defs');
    defs.append('filter').attr('id', 'map-shadow').html('<feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#020b17" flood-opacity=".5"/>');
    defs.append('filter').attr('id', 'beacon-glow').html('<feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>');
    const viewport = svg.append('g').attr('class', 'territory-viewport');
    const underlay = viewport.append('g').attr('class', 'state-underlay').attr('filter', 'url(#map-shadow)');
    const statesLayer = viewport.append('g').attr('class', 'states-layer');
    const labelsLayer = viewport.append('g').attr('class', 'state-labels');
    const markersLayer = viewport.append('g').attr('class', 'beacons-layer');

    function redraw() {
      if (!document.body.contains(container)) return;
      const width = Math.max(320, container.clientWidth);
      const height = Math.max(430, container.clientHeight);
      svg.attr('viewBox', `0 0 ${width} ${height}`);
      const projection = window.d3.geoMercator().fitExtent([[width < 650 ? 20 : 70, 34], [width < 650 ? width - 20 : width - 70, height - 40]], geo);
      const path = window.d3.geoPath(projection);
      const selected = byId('stadiums', selectedStadiumId) || data.stadiums.find((item) => item.location);
      const maxCapacity = Math.max(...data.stadiums.map((item) => item.capacity || 0));
      const stateWithData = new Set(data.stadiums.filter((item) => item.location).map((item) => item.state));

      underlay.selectAll('path').data(geo.features, (feature) => feature.properties.codarea).join('path')
        .attr('d', path).attr('transform', 'translate(0,10)');
      statesLayer.selectAll('path').data(geo.features, (feature) => feature.properties.codarea).join('path')
        .attr('d', path)
        .attr('class', (feature) => {
          const uf = stateCodes[feature.properties.codarea];
          return `state-shape ${stateWithData.has(uf) ? 'has-data' : ''} ${selected?.state === uf ? 'selected' : ''} quality-${stateQuality(uf)}`;
        })
        .attr('data-state', (feature) => stateCodes[feature.properties.codarea])
        .attr('tabindex', (feature) => stateWithData.has(stateCodes[feature.properties.codarea]) ? 0 : null)
        .attr('role', (feature) => stateWithData.has(stateCodes[feature.properties.codarea]) ? 'button' : null)
        .attr('aria-pressed', (feature) => stateWithData.has(stateCodes[feature.properties.codarea]) ? (selected?.state === stateCodes[feature.properties.codarea] ? 'true' : 'false') : null)
        .attr('aria-hidden', (feature) => stateWithData.has(stateCodes[feature.properties.codarea]) ? null : 'true')
        .attr('aria-label', (feature) => {
          const uf = stateCodes[feature.properties.codarea];
          const stadium = data.stadiums.find((item) => item.state === uf && item.location);
          return stadium ? `${uf}: selecionar ${stadium.name}, ${stadium.city}` : null;
        })
        .on('click', (_, feature) => {
          const uf = stateCodes[feature.properties.codarea];
          const stadium = data.stadiums.find((item) => item.state === uf && item.location);
          if (stadium) selectMapStadium(stadium.id);
          else showToast(`${uf}: nenhum estádio georreferenciado nesta base demonstrativa.`);
        })
        .on('keydown', (event, feature) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          const uf = stateCodes[feature.properties.codarea];
          const stadium = data.stadiums.find((item) => item.state === uf && item.location);
          if (stadium) selectMapStadium(stadium.id);
        });

      labelsLayer.selectAll('text').data(geo.features, (feature) => feature.properties.codarea).join('text')
        .attr('x', (feature) => path.centroid(feature)[0]).attr('y', (feature) => path.centroid(feature)[1])
        .attr('aria-hidden', 'true')
        .attr('class', (feature) => stateWithData.has(stateCodes[feature.properties.codarea]) ? 'state-label has-data' : 'state-label')
        .text((feature) => stateCodes[feature.properties.codarea]);

      const geocoded = data.stadiums.filter((stadium) => stadium.location);
      const markers = markersLayer.selectAll('g.stadium-beacon').data(geocoded, (stadium) => stadium.id).join((enter) => {
        const group = enter.append('g').attr('class', 'stadium-beacon').attr('tabindex', 0).attr('role', 'button');
        group.append('circle').attr('class', 'beacon-halo');
        group.append('line').attr('class', 'beacon-stem');
        group.append('circle').attr('class', 'beacon-core');
        const label = group.append('g').attr('class', 'beacon-label');
        label.append('rect').attr('rx', 8);
        label.append('text').attr('class', 'beacon-name');
        label.append('text').attr('class', 'beacon-meta');
        return group;
      });
      markers.attr('transform', (stadium) => {
        const [x, y] = projection([stadium.location.lng, stadium.location.lat]);
        return `translate(${x},${y})`;
      }).attr('class', (stadium) => `stadium-beacon ${stadium.id === selectedStadiumId ? 'selected' : ''}`)
        .attr('aria-label', (stadium) => `${stadium.name}, ${stadium.city}, ${evaluationFor(stadium.id)?.technicalResult || 'sem avaliação'}`)
        .attr('aria-pressed', (stadium) => stadium.id === selectedStadiumId ? 'true' : 'false')
        .on('click', (_, stadium) => selectMapStadium(stadium.id))
        .on('keydown', (event, stadium) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectMapStadium(stadium.id); } });
      markers.select('.beacon-halo').attr('r', (stadium) => mapMode === 'capacity' ? 16 + ((stadium.capacity || 0) / maxCapacity) * 18 : 25)
        .attr('fill', (stadium) => mapMode === 'capacity' ? '#ffd84d' : resultTone(evaluationFor(stadium.id)?.technicalResult));
      markers.select('.beacon-stem').attr('y1', -5).attr('y2', (stadium) => -(18 + ((stadium.capacity || 0) / maxCapacity) * 35));
      markers.select('.beacon-core').attr('cy', (stadium) => -(18 + ((stadium.capacity || 0) / maxCapacity) * 35))
        .attr('r', (stadium) => mapMode === 'capacity' ? 7 + ((stadium.capacity || 0) / maxCapacity) * 7 : 10)
        .attr('fill', (stadium) => mapMode === 'capacity' ? '#ffd84d' : resultTone(evaluationFor(stadium.id)?.technicalResult));
      markers.select('.beacon-label').attr('transform', (stadium) => {
        const x = stadium.state === 'SP' ? -157 : 15;
        return `translate(${x},${-(30 + ((stadium.capacity || 0) / maxCapacity) * 35)})`;
      });
      markers.select('.beacon-label rect').attr('width', 142).attr('height', 39);
      markers.select('.beacon-name').attr('x', 9).attr('y', 16).text((stadium) => stadium.name);
      markers.select('.beacon-meta').attr('x', 9).attr('y', 30).text((stadium) => mapMode === 'capacity' ? `${formatNumber(stadium.capacity)} lugares` : evaluationFor(stadium.id)?.technicalResult || 'Sem avaliação');
      container.dataset.mode = mapMode;
    }
    const observer = new ResizeObserver(redraw);
    observer.observe(container);
    territoryMap = { redraw, destroy: () => observer.disconnect() };
    redraw();
  } catch (error) {
    container.innerHTML = `<div class="map-error"><strong>Não foi possível carregar o território.</strong><span>${escapeHtml(error.message)}</span><button class="button secondary" data-map-retry>Tentar novamente</button></div>`;
    container.querySelector('[data-map-retry]')?.addEventListener('click', initializeTerritoryMap);
  }
}

function setMapMode(mode) {
  mapMode = mode;
  document.querySelectorAll('[data-map-mode]').forEach((button) => {
    const selected = button.dataset.mapMode === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  territoryMap?.redraw?.();
}

function shell(content, title, subtitle) {
  return `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark cbf-crest"><img src="${cbfLogoUrl}" alt="Escudo da CBF" /></div><div class="brand-lockup"><small>CBF</small><strong>Central de Operações</strong><span>Estádios & Governança</span></div></div>
        <nav class="nav" aria-label="Navegação principal">
          ${navItems.map(([id, icon, label]) => `<button data-view="${id}" class="${activeView === id ? 'active' : ''}" ${activeView === id ? 'aria-current="page"' : ''}><span class="nav-icon">${navIcon(icon)}</span><span>${label}</span></button>`).join('')}
        </nav>
        <div class="sidebar-foot"><div class="sidebar-foot-head"><span class="pulse-dot"></span><strong>Sistema operacional</strong></div><p>Ambiente demonstrativo com decisões humanas, evidências e contexto regulatório preservados.</p><span class="sidebar-version">DEMO CONTROLADA · 2026</span></div>
      </aside>
      <main id="main-content" class="main view-${activeView}" tabindex="-1">
        <header class="topbar"><div><div class="breadcrumb">CENTRAL TERRITORIAL <span aria-hidden="true">/</span> ${escapeHtml(title).toUpperCase()}</div><h1 tabindex="-1">${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="topbar-actions"><span class="sync-state"><span aria-hidden="true"></span>Sincronizado agora</span><span class="demo-chip">AMBIENTE DEMO</span><span class="user-chip" aria-label="Usuário Lucas Buzato">LB</span></div></header>
        <section class="content"><div class="notice notice-slim"><span>⚠</span><div><strong>${escapeHtml(data.meta.notice)}</strong> Resultados positivos indicam somente prontidão para revisão humana.</div></div>${content}</section>
      </main>
    </div>`;
}

function competitionSelector() {
  return `<div class="field"><label for="competition">Competição, edição e versão</label><select id="competition">${data.competitions.map((item) => `<option value="${item.id}" ${item.id === selectedCompetitionId ? 'selected' : ''}>${escapeHtml(item.name)} ${item.edition} · v${item.version} · ${item.status}</option>`).join('')}</select></div>`;
}

function overview() {
  const evaluations = data.evaluations.filter((item) => item.competitionId === selectedCompetitionId);
  const valid = evaluations.filter((item) => item.approval === 'Aprovada').length;
  const pending = evaluations.filter((item) => ['Pendente', 'Evidência vencida'].includes(item.technicalResult) || item.approval === 'Em revisão').length;
  const failed = evaluations.filter((item) => item.technicalResult === 'Não atende').length;
  const expired = data.checks.filter((item) => item.result === 'Evidência vencida' && evaluations.some((evaluation) => evaluation.id === item.evaluationId)).length;
  const requests = data.gameRequests.filter((item) => item.competitionId === selectedCompetitionId && item.decision === 'Em análise').length;
  const competition = byId('competitions', selectedCompetitionId);
  const relevantChecks = data.checks.filter((check) => evaluations.some((evaluation) => evaluation.id === check.evaluationId));
  const priorityEvaluations = evaluations.filter((item) => item.technicalResult !== 'Atende' || item.approval !== 'Aprovada');
  const withoutLocation = data.stadiums.filter((item) => !item.location);
  return shell(`
    <div class="territory-command"><div><span class="eyebrow">SALA DE CONTROLE · BRASIL</span><h2>Visão territorial de estádios</h2><p>Capacidade, elegibilidade e qualidade cadastral em uma única leitura operacional.</p></div><div class="command-actions">${competitionSelector()}<button class="button ghost" id="reset-demo">Restaurar demo</button></div></div>
    <section class="territory-console">
      <div class="territory-stage">
        <div class="stage-head"><div><span class="live-tag"><i aria-hidden="true"></i> MALHA IBGE · 27 UFs</span><strong>${escapeHtml(competition.name)} · ${escapeHtml(competition.edition)} · v${escapeHtml(competition.version)}</strong></div><div class="map-mode" role="group" aria-label="Camada do mapa"><button class="${mapMode === 'eligibility' ? 'active' : ''}" data-map-mode="eligibility" aria-pressed="${mapMode === 'eligibility'}">Elegibilidade</button><button class="${mapMode === 'capacity' ? 'active' : ''}" data-map-mode="capacity" aria-pressed="${mapMode === 'capacity'}">Capacidade</button><button class="${mapMode === 'quality' ? 'active' : ''}" data-map-mode="quality" aria-pressed="${mapMode === 'quality'}">Qualidade</button></div></div>
        <div id="territory-map" class="territory-map" role="region" aria-label="Mapa interativo dos estádios demonstrativos" aria-describedby="territory-map-summary"></div>
        <p id="territory-map-summary" class="sr-only">Mapa do Brasil com 27 unidades federativas. Há estádios georreferenciados em São Paulo, Rio de Janeiro e Bahia. Use Tab para percorrer estados e estádios; Enter ou Espaço seleciona o item.</p>
        <div class="map-legend" aria-label="Legenda de situação"><span><i style="--dot:#24d98a" aria-hidden="true"></i>Atende</span><span><i style="--dot:#ff5964" aria-hidden="true"></i>Não atende</span><span><i style="--dot:#ffb534" aria-hidden="true"></i>Evidência vencida</span><span><i style="--dot:#58a6ff" aria-hidden="true"></i>Pendente</span></div>
        <div class="map-source">Fonte cartográfica: IBGE · malha simplificada · dados operacionais fictícios</div>
      </div>
      <aside id="map-inspector" class="map-inspector">${mapInspectorHtml(selectedStadiumId)}</aside>
      <footer class="operational-strip">
        ${[['Aprovado', valid, 'good'],['Bloqueado', failed, 'bad'],['Evidência vencida', expired, 'warn'],['Cadastro incompleto', withoutLocation.length, 'pending'],['Em decisão', requests, 'neutral']].map(([label,value,tone]) => `<article class="${tone}"><span>${label}</span><strong>${value}</strong><i></i></article>`).join('')}
      </footer>
    </section>
    <section class="territory-secondary"><div><span class="eyebrow">FILA DE AÇÃO</span><h2>Pendências que alteram a decisão</h2></div><div class="action-ribbon">${priorityEvaluations.map((evaluation, index) => { const stadium = byId('stadiums', evaluation.stadiumId); return `<button data-select-stadium="${stadium.id}"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(stadium.name)}</strong><small>${escapeHtml(evaluation.pending)}</small></div>${badge(evaluation.technicalResult)}</button>`; }).join('')}</div></section>
    `, 'Território', `${competition.name} ${competition.edition} · mapa operacional e governança`);
}

function stadiumsView() {
  const filtered = data.stadiums.filter((item) => `${item.name} ${item.city} ${item.state} ${item.code}`.toLowerCase().includes(stadiumSearch.toLowerCase()));
  const maxCapacity = Math.max(...data.stadiums.map((item) => item.capacity || 0));
  return shell(`
    <div class="stadium-toolbar"><div><span class="eyebrow">CENTRAL DE CADASTRO</span><h2>Dossiês territoriais</h2><p>Origem, qualidade, capacidade declarada e situação por competição.</p></div><div class="stadium-tools"><div class="search-field"><span aria-hidden="true">⌕</span><label class="sr-only" for="stadium-search">Buscar estádio</label><input id="stadium-search" type="search" value="${escapeHtml(stadiumSearch)}" placeholder="Buscar por estádio, cidade, UF ou código" aria-describedby="stadium-search-status" /></div>${competitionSelector()}</div></div>
    <p id="stadium-search-status" class="sr-only" role="status" aria-live="polite">${filtered.length} ${filtered.length === 1 ? 'estádio encontrado' : 'estádios encontrados'}.</p>
    <div class="registry-summary"><div><strong>${data.stadiums.length}</strong><span>registros demonstrativos</span></div><div><strong>${data.stadiums.filter((item) => item.location).length}</strong><span>georreferenciados</span></div><div><strong>${data.stadiums.filter((item) => item.registrationStatus === 'Validado para consulta').length}</strong><span>validados para consulta</span></div><div><strong>${data.stadiums.filter((item) => !item.location || !item.capacity).length}</strong><span>completude pendente</span></div></div>
    <section class="stadium-grid">
      ${filtered.map((stadium) => {
        const evaluation = evaluationFor(stadium.id);
        const allEvaluations = data.evaluations.filter((item) => item.stadiumId === stadium.id);
        const capacityPct = stadium.capacity ? Math.round((stadium.capacity / maxCapacity) * 100) : 0;
        const qualityFields = [stadium.code, stadium.city, stadium.state, stadium.location, stadium.capacity, stadium.source, stadium.updatedAt, stadium.nextReview];
        const quality = Math.round((qualityFields.filter(Boolean).length / qualityFields.length) * 100);
        const stadiumTone = evaluation?.technicalResult === 'Atende' ? 'good' : evaluation?.technicalResult === 'Não atende' ? 'bad' : evaluation?.technicalResult === 'Evidência vencida' ? 'warn' : 'pending';
        return `<article class="stadium-card status-${stadiumTone}">
          <header><div><span class="stadium-code">${escapeHtml(stadium.code)}</span><h3>${escapeHtml(stadium.name)}</h3><p>${escapeHtml(stadium.city)} · ${escapeHtml(stadium.state)} <i></i> ${escapeHtml(stadium.region)}</p></div>${badge(evaluation?.technicalResult || 'Sem avaliação')}</header>
          <div class="stadium-visual"><div class="capacity-orbit" style="--capacity:${capacityPct * 3.6}deg"><div><strong>${stadium.capacity ? formatNumber(stadium.capacity) : '—'}</strong><span>lugares</span></div></div><div class="stadium-signals"><div><span>Qualidade cadastral</span><strong>${quality}%</strong></div><div class="mini-progress"><i style="width:${quality}%"></i></div><dl><div><dt>Situação</dt><dd>${escapeHtml(stadium.registrationStatus)}</dd></div><div><dt>Avaliações</dt><dd>${allEvaluations.length} contextos</dd></div><div><dt>Próxima revisão</dt><dd>${formatDate(stadium.nextReview)}</dd></div></dl></div></div>
          <footer><div><span>Fonte registrada</span><strong>${escapeHtml(stadium.source)}</strong></div><button class="button stadium-open" data-stadium-detail="${stadium.id}">Abrir dossiê</button></footer>
        </article>`;
      }).join('') || '<div class="empty card">Nenhum estádio encontrado.</div>'}
    </section>
    <div class="data-caveat"><span>i</span><div><strong>Capacidade declarada não equivale à capacidade autorizada.</strong><p>Dados ausentes permanecem como pendência explícita e nunca geram validação positiva.</p></div></div>`, 'Estádios', 'Cadastro confiável, origem do dado e contexto regulatório');
}

function competitionsView() {
  const selected = byId('competitions', selectedCompetitionId);
  const requirements = data.requirements.filter((item) => item.competitionId === selectedCompetitionId);
  return shell(`
    <div class="regulation-hero"><div><span class="eyebrow">MATRIZ REGULATÓRIA DEMONSTRATIVA</span><h2>Regras preservadas por edição e versão</h2><p>Uma nova versão nunca sobrescreve silenciosamente a referência usada em decisões anteriores.</p></div>${competitionSelector()}</div>
    <section class="version-line" aria-label="Histórico de versões">${data.competitions.map((competition, index) => `<button data-select-competition="${competition.id}" class="version-node ${competition.id === selectedCompetitionId ? 'active' : ''} ${competition.status === 'Rascunho' ? 'draft' : ''}" aria-pressed="${competition.id === selectedCompetitionId}"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(competition.code)} · v${escapeHtml(competition.version)}</strong><small>${escapeHtml(competition.status)} · ${formatDate(competition.validFrom)}</small></div></button>`).join('')}</section>
    <div class="regulation-grid"><section class="card regulation-card"><div class="regulation-cover"><img src="${cbfLogoUrl}" alt="" /><span>REGULAMENTO · DEMO</span></div><div class="regulation-content"><div>${badge(selected.status)} <span class="version-pill">VERSÃO ${escapeHtml(selected.version)}</span></div><h2>${escapeHtml(selected.name)} ${escapeHtml(selected.edition)}</h2><dl><div><dt>Código</dt><dd>${escapeHtml(selected.code)}</dd></div><div><dt>Vigência</dt><dd>${formatDate(selected.validFrom)} — ${formatDate(selected.validTo)}</dd></div><div><dt>Área proprietária</dt><dd>${escapeHtml(selected.owner)}</dd></div><div><dt>Requisitos carregados</dt><dd>${requirements.length}</dd></div></dl><p class="regulation-warning">Critérios abaixo são fictícios e servem apenas para demonstrar a lógica de avaliação.</p></div></section>
    <section class="card"><div class="card-head"><div><span class="eyebrow">CRITÉRIOS APLICÁVEIS</span><h2>Requisitos da versão ${escapeHtml(selected.version)}</h2><p>Cada critério explicita tipo, evidência, validade e responsável.</p></div><span class="card-label">${requirements.length} REQUISITOS</span></div><div class="card-body requirement-stack">${requirements.map((requirement, index) => `<article class="requirement-card"><span class="requirement-index">R${String(index + 1).padStart(2, '0')}</span><div><div class="requirement-head"><span>${escapeHtml(requirement.category).toUpperCase()}</span>${badge(requirement.mandatory ? 'Obrigatório' : 'Informativo')}</div><h3>${escapeHtml(requirement.code)} · ${escapeHtml(requirement.name)}</h3><p>${escapeHtml(requirement.type)}${requirement.limit ? ` · regra ${escapeHtml(requirement.operator)} ${formatNumber(requirement.limit)} ${escapeHtml(requirement.unit)}` : ' · conclusão por revisão humana'}</p><div class="requirement-meta"><span><b>Evidência</b>${escapeHtml(requirement.evidence)}</span><span><b>Validade</b>${escapeHtml(requirement.validity)}</span></div><small>${escapeHtml(requirement.notice)}</small></div></article>`).join('') || '<div class="empty">Nenhum requisito carregado. A ausência impede conclusão positiva.</div>'}</div></section></div>`, 'Competições e requisitos', 'Versionamento, evidência e interpretação controlada');
}

function evaluationsView() {
  const evaluations = data.evaluations.filter((item) => item.competitionId === selectedCompetitionId);
  const complete = evaluations.filter((item) => data.checks.filter((check) => check.evaluationId === item.id).length === item.expectedChecks).length;
  const alfaComparisons = data.evaluations.filter((item) => item.stadiumId === 'stad-alfa');
  return shell(`
    <div class="evaluation-hero"><div><span class="eyebrow">CENTRAL DE ELEGIBILIDADE</span><h2>Da evidência à decisão humana</h2><p>Completude, resultado técnico e aprovação são controles independentes.</p></div>${competitionSelector()}</div>
    <div class="evaluation-stats"><article><span>Avaliações no contexto</span><strong>${evaluations.length}</strong><small>uma por estádio + versão</small></article><article><span>Completude registrada</span><strong>${complete}/${evaluations.length}</strong><small>linhas de verificação presentes</small></article><article><span>Prontas para revisão</span><strong>${evaluations.filter((item) => item.technicalResult === 'Atende').length}</strong><small>não significa homologação</small></article><article><span>Com bloqueio técnico</span><strong>${evaluations.filter((item) => item.technicalResult !== 'Atende').length}</strong><small>exigem ação ou evidência</small></article></div>
    <section class="card"><div class="card-head"><div><span class="eyebrow">MATRIZ DE AVALIAÇÃO</span><h2>Resultado explicável por estádio</h2><p>Uma falha obrigatória nunca é compensada por média percentual.</p></div></div><div class="card-body matrix evaluation-matrix">
      ${evaluations.map((evaluation) => {
        const stadium = byId('stadiums', evaluation.stadiumId);
        const checks = data.checks.filter((item) => item.evaluationId === evaluation.id);
        const percent = Math.round((checks.length / evaluation.expectedChecks) * 100);
        const pass = checks.filter((item) => item.result === 'Atende').length;
        const tone = evaluation.technicalResult === 'Atende' ? 'good' : evaluation.technicalResult === 'Não atende' ? 'bad' : evaluation.technicalResult === 'Evidência vencida' ? 'warn' : 'pending';
        return `<article class="evaluation-row eval-${tone}"><div class="evaluation-id"><span>${escapeHtml(evaluation.code)}</span><strong>${escapeHtml(stadium.name)}</strong><small>${formatDate(evaluation.referenceDate)} · ${escapeHtml(evaluation.evaluator)}</small></div><div class="check-dots" aria-label="${checks.length} verificações">${Array.from({ length: evaluation.expectedChecks }, (_, index) => `<i class="${checks[index]?.result === 'Atende' ? 'good' : checks[index]?.result === 'Não atende' ? 'bad' : checks[index] ? 'warn' : ''}" title="${escapeHtml(checks[index]?.result || 'Não verificado')}"></i>`).join('')}<span>${pass}/${evaluation.expectedChecks} favoráveis</span></div><div class="evaluation-result">${badge(evaluation.technicalResult)}${badge(evaluation.approval)}</div><div class="evaluation-action"><span>${escapeHtml(evaluation.pending)}</span><small>${escapeHtml(evaluation.nextAction)}</small></div><button class="button ${evaluation.technicalResult === 'Atende' ? 'green' : 'secondary'}" data-approval="${evaluation.id}">Revisar decisão</button><div class="evaluation-progress"><i style="width:${Math.min(100, percent)}%"></i></div></article>`;
      }).join('') || '<div class="empty">Nenhuma avaliação neste contexto.</div>'}
    </div></section>
    <div class="evaluation-lower"><section class="card"><div class="card-head"><div><span class="eyebrow">EVIDÊNCIA AUDITÁVEL</span><h2>Verificações por requisito</h2><p>Uma linha única para cada combinação avaliação + requisito.</p></div></div><div class="table-wrap" tabindex="0" role="region" aria-label="Tabela de verificações por requisito"><table><caption class="sr-only">Verificações das avaliações por requisito, resultado, validade e justificativa</caption><thead><tr><th scope="col">Avaliação</th><th scope="col">Requisito</th><th scope="col">Observado</th><th scope="col">Resultado</th><th scope="col">Validade</th><th scope="col">Justificativa</th></tr></thead><tbody>${data.checks.filter((check) => evaluations.some((evaluation) => evaluation.id === check.evaluationId)).map((check) => `<tr><td>${escapeHtml(byId('evaluations', check.evaluationId).code)}</td><td>${escapeHtml(byId('requirements', check.requirementId)?.code || 'Requisito não carregado')}</td><td>${escapeHtml(check.observed)}</td><td>${badge(check.result)}</td><td>${formatDate(check.evidenceValidUntil)}</td><td>${escapeHtml(check.justification)}</td></tr>`).join('')}</tbody></table></div></section>
    <aside class="card comparison-card"><div class="card-head"><div><span class="eyebrow">COMPARAÇÃO DE CONTEXTO</span><h2>Mesmo estádio, regras diferentes</h2></div></div><div class="card-body"><h3>Estádio Alfa</h3><p>O resultado depende da competição, edição e versão — nunca de um campo genérico no cadastro.</p>${alfaComparisons.map((evaluation) => { const competition = byId('competitions', evaluation.competitionId); return `<div class="comparison-row"><div><strong>${escapeHtml(competition.name)}</strong><span>${escapeHtml(competition.edition)} · v${escapeHtml(competition.version)}</span></div>${badge(evaluation.technicalResult)}</div>`; }).join('')}<div class="comparison-note">Alterar requisito, capacidade ou evidência exige reavaliação; a aprovação anterior permanece apenas como histórico demonstrativo.</div></div></aside></div>`, 'Avaliações', 'Critérios, evidências, completude e aprovação segregada');
}

function requestsView() {
  return shell(`
    <div class="request-hero"><div><span class="eyebrow">ORQUESTRAÇÃO DE JOGOS</span><h2>Elegibilidade não é disponibilidade</h2><p>A decisão só avança quando contexto, avaliação compatível, janela operacional e revisão humana estão documentados.</p></div>${competitionSelector()}</div>
    <div class="decision-flow">${['Solicitação recebida','Contexto validado','Avaliação compatível','Disponibilidade','Revisão humana','Decisão registrada'].map((label, index) => `<div class="flow-step ${index < 3 ? 'complete' : index === 3 ? 'attention' : ''}"><span>${index < 3 ? '✓' : index + 1}</span><strong>${label}</strong></div>`).join('')}</div>
    <div class="request-layout"><section class="request-list"><div class="section-heading"><div><span class="eyebrow">FILA DE DECISÃO</span><h2>Solicitações em análise</h2></div><span>${data.gameRequests.length} registros demonstrativos</span></div>${data.gameRequests.map((request) => {
      const stadium = byId('stadiums', request.stadiumId);
      const competition = byId('competitions', request.competitionId);
      const evaluation = byId('evaluations', request.evaluationId);
      return `<article class="game-card ${request.availability === 'Conflito' ? 'conflict' : ''}"><div class="game-date"><strong>${request.date.slice(8, 10)}</strong><span>NOV</span><small>${request.start}</small></div><div class="game-main"><header><div><span>${escapeHtml(request.code)}</span><h3>${escapeHtml(stadium.name)}</h3></div>${badge(request.decision)}</header><p>${escapeHtml(competition.name)} · ${escapeHtml(competition.edition)} · v${escapeHtml(competition.version)}</p><div class="game-controls"><div><span>Elegibilidade</span>${badge(evaluation?.technicalResult || 'Sem avaliação')}</div><div><span>Disponibilidade</span>${badge(request.availability)}</div><div><span>Análise técnica</span>${badge(request.technicalAnalysis)}</div></div><footer><div><span>Próxima ação</span><strong>${escapeHtml(request.nextSteps)}</strong></div><button class="button ${request.availability === 'Disponível' && request.technicalAnalysis === 'Favorável' ? 'green' : 'secondary'}" data-decision="${request.id}">Registrar decisão</button></footer></div></article>`;
    }).join('')}</section>
    <aside class="conflict-panel"><div class="conflict-head"><span>!</span><div><strong>Conflito operacional detectado</strong><p>Estádio Alfa · 14 de novembro de 2026</p></div></div><div class="time-axis"><div class="axis-labels"><span>14h</span><span>16h</span><span>18h</span><span>20h</span><span>22h</span></div><div class="time-row"><span>JOGO-DEMO-001</span><i class="slot slot-a"></i><small>16h — 20h</small></div><div class="time-row"><span>JOGO-DEMO-002</span><i class="slot slot-b"></i><small>18h — 22h</small></div><div class="overlap-zone"><span>2h de sobreposição</span></div></div><div class="conflict-rules"><div><span>01</span><p><strong>Bloqueio de aprovação</strong>Aprovação automática impedida enquanto houver conflito.</p></div><div><span>02</span><p><strong>Janela operacional</strong>Preparação e desmontagem devem ser confirmadas pela área.</p></div><div><span>03</span><p><strong>Fonte oficial</strong>O calendário visual não representa reserva do estádio.</p></div></div><div class="decision-gate"><span>GATE DE DECISÃO</span><strong>Revisão humana obrigatória</strong><small>Evidência de disponibilidade ainda não confirmada.</small></div></aside></div>`, 'Solicitações de jogos', 'Compatibilidade, disponibilidade, conflitos e decisão registrada');
}

function governanceView() {
  const role = data.roles.find((item) => item.role === selectedRoleName) || data.roles[0];
  const capabilities = [
    ['maintainCatalog', 'Manter cadastro e fontes'], ['evaluate', 'Executar avaliação técnica'],
    ['approve', 'Registrar aprovação humana'], ['viewRestricted', 'Consultar conteúdo restrito']
  ];
  const securityTests = [
    ['Conta sem privilégio de proprietário', 'A estrutura e as regras devem permanecer bloqueadas.', 'Validar na monday'],
    ['Avaliador tentando aprovar', 'A segregação de funções deve impedir a decisão final.', 'Simulado aqui'],
    ['Participante externo em item restrito', 'Arquivos, links e colunas protegidas não podem vazar.', 'Validar na monday'],
    ['Exportação e compartilhamento', 'Acesso exportado deve respeitar a política definida.', 'Validar na monday'],
    ['Board conectado ou espelhado', 'A origem não pode ampliar acesso por herança indevida.', 'Validar na monday']
  ];
  const automations = [
    ['Evidência próxima do vencimento', 'Avisar responsável e abrir pendência', 'Revisão diária', 'Se falhar: fila manual de vencimentos'],
    ['Dado crítico do estádio alterado', 'Invalidar prontidão e solicitar reavaliação', 'Em mudança', 'Se falhar: revisão semanal de alterações'],
    ['Todas as verificações concluídas', 'Mover avaliação para revisão humana', 'Em conclusão', 'Se falhar: visão de avaliações completas'],
    ['Solicitação pronta para decisão', 'Notificar aprovador sem decidir por ele', 'Em prontidão', 'Se falhar: fila de decisão priorizada'],
    ['Conflito operacional resolvido', 'Reabrir gate de disponibilidade', 'Em resolução', 'Se falhar: confirmação manual documentada']
  ];
  return shell(`
    <section class="governance-hero"><div><span class="eyebrow">CENTRO DE CONFIANÇA</span><h2>Controle demonstrável, limites declarados</h2><p>O protótipo evidencia a lógica de segregação. A efetividade das permissões deve ser testada com usuários reais no ambiente monday.</p></div><div class="trust-score"><span>MODELO DE CONTROLE</span><strong>4 camadas</strong><small>papel · evidência · decisão · auditoria</small></div></section>
    <div class="governance-layout"><section class="card role-lab"><div class="card-head"><div><span class="eyebrow">SIMULADOR DE PAPÉIS</span><h2>O que este perfil pode fazer?</h2><p>Selecione um papel para visualizar a separação proposta.</p></div><select id="role-simulator" aria-label="Perfil simulado">${data.roles.map((item) => `<option ${item.role === role.role ? 'selected' : ''}>${escapeHtml(item.role)}</option>`).join('')}</select></div><div class="role-result"><div class="role-avatar">${escapeHtml(role.role.split(' ').map((part) => part[0]).join('').slice(0,2))}</div><div><span>PERFIL EM FOCO</span><h3>${escapeHtml(role.role)}</h3><p>Política demonstrativa; requer tradução para permissões reais de boards, colunas, arquivos e links.</p></div></div><div class="capability-grid">${capabilities.map(([key, label]) => `<article class="capability ${role[key] ? 'allowed' : 'blocked'}"><span>${role[key] ? '✓' : '×'}</span><div><strong>${label}</strong><small>${role[key] ? 'Permitido no modelo' : 'Bloqueado no modelo'}</small></div></article>`).join('')}</div></section>
    <section class="card"><div class="card-head"><div><span class="eyebrow">MATRIZ DE ACESSO</span><h2>Segregação de funções</h2><p>Nenhum papel recebe acesso por conveniência.</p></div></div><div class="table-wrap" tabindex="0" role="region" aria-label="Matriz de segregação de funções"><table class="governance-table"><caption class="sr-only">Permissões de cadastro, avaliação, aprovação e conteúdo restrito por perfil</caption><thead><tr><th scope="col">Perfil</th><th scope="col">Cadastro</th><th scope="col">Avaliar</th><th scope="col">Aprovar</th><th scope="col">Restrito</th></tr></thead><tbody>${data.roles.map((item) => `<tr class="${item.role === role.role ? 'selected-row' : ''}"><td><strong>${escapeHtml(item.role)}</strong></td>${['maintainCatalog','evaluate','approve','viewRestricted'].map((key) => `<td class="${item[key] ? 'yes' : 'no'}"><span aria-label="${item[key] ? 'Permitido' : 'Bloqueado'}">${item[key] ? '✓' : '—'}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div></section></div>
    <div class="governance-layout lower"><section class="card"><div class="card-head"><div><span class="eyebrow">TESTES DE SEGURANÇA</span><h2>Cenários que precisam de evidência</h2><p>Aparência de restrição não prova controle de acesso.</p></div></div><div class="security-tests">${securityTests.map(([name, expected, status], index) => `<article><span class="test-number">T${index + 1}</span><div><strong>${name}</strong><p>${expected}</p></div><em class="${status === 'Simulado aqui' ? 'simulated' : ''}">${status}</em></article>`).join('')}</div></section>
    <section class="card architecture-card"><div class="card-head"><div><span class="eyebrow">ARQUITETURA DE DADOS</span><h2>Seis entidades, uma decisão explicável</h2></div></div><div class="entity-flow"><div class="entity primary">Estádios<small>identidade estável</small></div><span>→</span><div class="entity">Avaliações<small>estádio + versão</small></div><span>→</span><div class="entity primary">Solicitações<small>jogo + janela</small></div><div class="entity">Competições<small>edição + versão</small></div><span>→</span><div class="entity">Requisitos<small>critério aplicável</small></div><span>→</span><div class="entity">Verificações<small>evidência única</small></div></div><div class="architecture-rule"><strong>Regra de integridade</strong><span>Ausência de linha ou evidência = pendência explícita, nunca aprovação silenciosa.</span></div></section></div>
    <section class="card automation-card"><div class="card-head"><div><span class="eyebrow">AUTOMAÇÕES PROPOSTAS</span><h2>Automatizar o aviso, preservar a decisão humana</h2><p>Cada fluxo inclui uma alternativa operacional caso a automação falhe.</p></div><span class="card-label">5 FLUXOS</span></div><div class="automation-grid">${automations.map(([trigger, action, cadence, fallback], index) => `<article><div class="automation-icon">${String(index + 1).padStart(2,'0')}</div><div><span>${cadence.toUpperCase()}</span><h3>${trigger}</h3><p>${action}</p><small>${fallback}</small></div></article>`).join('')}</div></section>
    <section class="enterprise-section"><div class="enterprise-intro"><span class="eyebrow">CONVERSA ENTERPRISE</span><h2>Valor ligado à necessidade de governança</h2><p>O mapa é parte da experiência, não justificativa isolada de licenciamento.</p></div><div class="enterprise-grid"><article><span>NECESSIDADE</span><strong>Identidade e acesso</strong><p>Quem pode ver, alterar e aprovar cada tipo de dado?</p><em>Validar SSO, provisionamento e permissões granulares.</em></article><article><span>NECESSIDADE</span><strong>Rastreabilidade operacional</strong><p>Como demonstrar contexto, evidência e responsável pela decisão?</p><em>Validar logs, retenção, exportação e limites de auditoria.</em></article><article><span>NECESSIDADE</span><strong>Escala e integração</strong><p>Como conectar fontes sem perder origem, qualidade e controle?</p><em>Validar integrações, espelhamento e governança documental.</em></article></div><div class="audit-caveat"><span>!</span><p><strong>Limite declarado:</strong> o log de atividade não é apresentado como trilha imutável, assinatura eletrônica, homologação oficial ou garantia de conformidade.</p></div></section>`, 'Governança', 'Papéis, controles, automações e posicionamento Enterprise');
}

function demoView() {
  const route = [
    ['01','Localizar','Visão geral','Selecionar a Copa Nacional Feminina e localizar o Estádio Alfa no mapa.','Mapa interativo + dado georreferenciado'],
    ['02','Entender','Estádios','Abrir o dossiê e separar capacidade declarada, origem, atualização e classificação.','Fonte e qualidade sempre visíveis'],
    ['03','Comparar','Avaliações','Mostrar o mesmo estádio em competições e versões diferentes.','Resultado depende do contexto regulatório'],
    ['04','Explicar','Avaliações','Identificar o critério obrigatório que bloqueia o Estádio Beta.','Decisão rastreável até a evidência'],
    ['05','Resolver','Solicitações','Visualizar as duas janelas sobrepostas no Estádio Alfa.','Elegibilidade não prova disponibilidade'],
    ['06','Decidir','Solicitações','Registrar decisão com aprovador e justificativa obrigatórios.','Aprovação permanece humana'],
    ['07','Governar','Governança','Alternar entre avaliador, aprovador e participante externo.','Segregação proposta + testes reais pendentes'],
    ['08','Posicionar','Governança','Relacionar controles a necessidades Enterprise sem vender o mapa como exclusivo.','Valor baseado em acesso, escala e auditoria']
  ];
  const coverage = [
    ['Modelo e conteúdo','6 entidades relacionadas; 4 estádios; 3 contextos de competição; requisitos versionados; evidências e validade.','demonstrated'],
    ['Funcionamento','Busca, filtros, mapa, troca de camada, dossiês, comparação, decisões e restauração da base.','demonstrated'],
    ['Cenários críticos','Alfa válido; Beta com falha obrigatória; Gama com evidência vencida; Delta incompleto; conflito de jogos.','demonstrated'],
    ['Segurança e acesso','Matriz e simulação presentes; testes com não proprietário, arquivos, links e espelhamento dependem do ambiente real.','validate'],
    ['Automação','Gatilhos, comportamento esperado e fallback manual documentados; execução depende da configuração monday.','validate'],
    ['Posicionamento','Demo explicitamente não oficial; aprovação humana; mapa não tratado como recurso Enterprise exclusivo.','demonstrated']
  ];
  const viewForScreen = (screen) => screen === 'Visão geral' ? 'overview' : screen === 'Estádios' ? 'stadiums' : screen === 'Avaliações' ? 'evaluations' : screen === 'Solicitações' ? 'requests' : 'governance';
  return shell(`
    <section class="demo-hero"><div class="demo-crest"><img src="${cbfLogoUrl}" alt="Identidade visual da CBF" /></div><div><span class="eyebrow">ROTEIRO EXECUTIVO · 12 MINUTOS</span><h2>Da localização territorial à decisão governada</h2><p>Uma narrativa guiada para demonstrar valor sem confundir protótipo, regra fictícia e homologação oficial.</p><div class="demo-tags"><span>Dados 100% fictícios</span><span>Decisão humana</span><span>Critérios versionados</span></div></div><button class="button green" data-view="overview">Iniciar demonstração</button></section>
    <section class="route-section"><div class="section-heading"><div><span class="eyebrow">JORNADA DA APRESENTAÇÃO</span><h2>8 momentos, uma história contínua</h2></div><span>Siga a sequência para evitar saltos de contexto</span></div><div class="demo-route">${route.map(([number, verb, screen, action, proof]) => `<article><div class="route-number">${number}</div><div class="route-copy"><span>${escapeHtml(screen).toUpperCase()}</span><h3>${escapeHtml(verb)}</h3><p>${escapeHtml(action)}</p><small>${escapeHtml(proof)}</small></div><button class="route-go" data-view="${viewForScreen(screen)}" aria-label="Ir para ${escapeHtml(screen)}">→</button></article>`).join('')}</div></section>
    <section class="coverage-section"><div class="coverage-head"><div><span class="eyebrow">COBERTURA DO BRIEFING</span><h2>Requisitos transformados em evidência demonstrável</h2></div><div class="coverage-key"><span><i class="ready"></i>Presente no protótipo</span><span><i></i>Validar na monday</span></div></div><div class="coverage-grid">${coverage.map(([title, copy, state]) => `<article><span class="coverage-state ${state}">${state === 'demonstrated' ? '✓ DEMONSTRADO' : '◌ A VALIDAR'}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></section>
    <section class="demo-close"><div><span class="eyebrow">FECHAMENTO RECOMENDADO</span><h2>O que a CBF passa a enxergar melhor?</h2></div><div class="close-points"><span><b>01</b>Onde estão os estádios e qual a qualidade do cadastro</span><span><b>02</b>Por que um estádio atende ou não a cada contexto</span><span><b>03</b>Qual pendência impede o próximo passo operacional</span><span><b>04</b>Quem avaliou, quem aprovou e com qual justificativa</span></div><p>A etapa seguinte é reproduzir a arquitetura no workspace Leste Demo, aplicar permissões reais e documentar os testes com contas não proprietárias.</p></section>`, 'Roteiro da demo', 'Narrativa, cobertura do briefing e limites explícitos');
}

function openStadiumDetail(id) {
  const stadium = byId('stadiums', id);
  if (!stadium) return;
  lastDialogTrigger = document.activeElement;
  const evaluations = data.evaluations.filter((item) => item.stadiumId === id);
  const qualityFields = [stadium.code, stadium.city, stadium.state, stadium.region, stadium.location, stadium.capacity, stadium.owner, stadium.source, stadium.updatedAt, stadium.nextReview];
  const quality = Math.round((qualityFields.filter(Boolean).length / qualityFields.length) * 100);
  detailDialog.innerHTML = `<div class="detail-shell"><header class="detail-hero"><div class="detail-watermark" aria-hidden="true">${escapeHtml(stadium.state)}</div><div class="detail-brand"><img src="${cbfLogoUrl}" alt="" /><span>CENTRAL DE OPERAÇÕES · DOSSIÊ TERRITORIAL</span></div><button type="button" class="detail-close" data-detail-close aria-label="Fechar dossiê">×</button><div class="detail-identity"><div><span class="stadium-code">${escapeHtml(stadium.code)}</span><h2 id="detail-title">${escapeHtml(stadium.name)}</h2><p>${escapeHtml(stadium.city)} · ${escapeHtml(stadium.state)} · ${escapeHtml(stadium.region)}</p></div><div class="detail-quality" style="--quality:${quality * 3.6}deg"><div><strong>${quality}%</strong><span>completude</span></div></div></div><div class="detail-head-metrics"><div><strong>${stadium.capacity ? formatNumber(stadium.capacity) : '—'}</strong><span>capacidade declarada</span></div><div><strong>${evaluations.filter((item) => item.technicalResult === 'Atende').length}/${evaluations.length}</strong><span>contextos atendidos</span></div><div><strong>${evaluations.length}</strong><span>avaliações vinculadas</span></div></div></header><div class="detail-body"><div class="detail-warning"><span aria-hidden="true">i</span><p>Este dossiê é fictício. Capacidade declarada não equivale à capacidade autorizada ou homologada.</p></div><section class="detail-grid"><article><span>CADASTRO</span><dl><div><dt>Situação</dt><dd>${escapeHtml(stadium.registrationStatus)}</dd></div><div><dt>Responsável</dt><dd>${escapeHtml(stadium.owner)}</dd></div><div><dt>Classificação</dt><dd>${escapeHtml(stadium.classification)}</dd></div><div><dt>Georreferenciamento</dt><dd>${stadium.location ? `${stadium.location.lat}, ${stadium.location.lng}` : 'Ausente'}</dd></div></dl></article><article><span>ORIGEM E REVISÃO</span><dl><div><dt>Fonte</dt><dd>${escapeHtml(stadium.source)}</dd></div><div><dt>Atualizado em</dt><dd>${formatDate(stadium.updatedAt)}</dd></div><div><dt>Próxima revisão</dt><dd>${formatDate(stadium.nextReview)}</dd></div><div><dt>Documento</dt><dd>Ficha demonstrativa vinculada</dd></div></dl></article></section><section class="detail-evaluations"><div class="detail-section-head"><span>CONTEXTO REGULATÓRIO</span><h3>Avaliações e evidências</h3></div>${evaluations.map((evaluation) => { const competition = byId('competitions', evaluation.competitionId); const checks = data.checks.filter((item) => item.evaluationId === evaluation.id); return `<article><header><div><span>${escapeHtml(evaluation.code)}</span><strong>${escapeHtml(competition.name)} · ${escapeHtml(competition.edition)} · v${escapeHtml(competition.version)}</strong></div><div>${badge(evaluation.technicalResult)}${badge(evaluation.approval)}</div></header><div class="detail-checks">${Array.from({length: evaluation.expectedChecks}, (_, index) => { const check = checks[index]; const requirement = check && byId('requirements', check.requirementId); return `<div class="detail-check ${check?.result === 'Atende' ? 'good' : check?.result === 'Não atende' ? 'bad' : 'warn'}"><span aria-hidden="true">${check ? (check.result === 'Atende' ? '✓' : '!') : '—'}</span><div><strong>${escapeHtml(requirement?.name || 'Verificação ausente')}</strong><p>${escapeHtml(check?.justification || 'A ausência impede conclusão positiva.')}</p><small>${check?.evidenceValidUntil ? `Evidência até ${formatDate(check.evidenceValidUntil)}` : 'Validade não informada'}</small></div></div>`; }).join('')}</div><footer><span><b>Pendência:</b> ${escapeHtml(evaluation.pending)}</span><span><b>Próxima ação:</b> ${escapeHtml(evaluation.nextAction)}</span></footer></article>`; }).join('') || '<div class="empty">Nenhuma avaliação vinculada. O estádio não está elegível por padrão.</div>'}</section></div></div>`;
  detailDialog.setAttribute('aria-labelledby', 'detail-title');
  detailDialog.showModal();
  detailDialog.querySelector('[data-detail-close]')?.addEventListener('click', () => detailDialog.close());
}

function bindDetailButtons() {
  document.querySelectorAll('[data-stadium-detail]').forEach((button) => button.addEventListener('click', () => openStadiumDetail(button.dataset.stadiumDetail)));
}

function render() {
  if (territoryMap?.destroy) { territoryMap.destroy(); territoryMap = null; territoryMarkers = []; }
  const views = { overview, stadiums: stadiumsView, competitions: competitionsView, evaluations: evaluationsView, requests: requestsView, governance: governanceView, demo: demoView };
  app.innerHTML = views[activeView]();
  bindEvents();
  if (activeView === 'overview') requestAnimationFrame(initializeTerritoryMap);
}

function bindEvents() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
    activeView = button.dataset.view;
    render();
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.querySelector('h1')?.focus({ preventScroll: true });
    });
  }));
  document.querySelector('#competition')?.addEventListener('change', (event) => { selectedCompetitionId = event.target.value; render(); requestAnimationFrame(() => document.querySelector('#competition')?.focus()); });
  document.querySelectorAll('[data-select-competition]').forEach((button) => button.addEventListener('click', () => { selectedCompetitionId = button.dataset.selectCompetition; render(); requestAnimationFrame(() => document.querySelector(`[data-select-competition="${selectedCompetitionId}"]`)?.focus()); }));
  document.querySelectorAll('[data-map-mode]').forEach((button) => button.addEventListener('click', () => setMapMode(button.dataset.mapMode)));
  document.querySelectorAll('[data-select-stadium]').forEach((button) => button.addEventListener('click', () => selectMapStadium(button.dataset.selectStadium)));
  document.querySelector('#stadium-search')?.addEventListener('input', (event) => { stadiumSearch = event.target.value; stadiumsViewDebounced(); });
  document.querySelectorAll('[data-stadium]').forEach((button) => button.addEventListener('click', () => { const stadium = byId('stadiums', button.dataset.stadium); showToast(`${stadium.name}: ${stadium.city}/${stadium.state} · ${stadium.registrationStatus}`); }));
  document.querySelectorAll('[data-approval]').forEach((button) => button.addEventListener('click', () => openDecision('approval', button.dataset.approval)));
  document.querySelectorAll('[data-decision]').forEach((button) => button.addEventListener('click', () => openDecision('request', button.dataset.decision)));
  document.querySelector('#role-simulator')?.addEventListener('change', (event) => { selectedRoleName = event.target.value; render(); requestAnimationFrame(() => document.querySelector('#role-simulator')?.focus()); });
  bindDetailButtons();
  bindMapInspectorButtons();
  document.querySelector('#reset-demo')?.addEventListener('click', resetDemo);
}

let searchTimer;
function stadiumsViewDebounced() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { const input = document.querySelector('#stadium-search'); stadiumSearch = input?.value || ''; render(); requestAnimationFrame(() => { const next = document.querySelector('#stadium-search'); next?.focus(); next?.setSelectionRange(stadiumSearch.length, stadiumSearch.length); }); }, 180);
}

function openDecision(kind, id) {
  const isApproval = kind === 'approval';
  const record = isApproval ? byId('evaluations', id) : byId('gameRequests', id);
  const options = isApproval ? ['Em revisão','Aprovada','Reprovada'] : ['Em análise','Aprovada','Condicionada','Reprovada'];
  lastDialogTrigger = document.activeElement;
  dialog.innerHTML = `<form method="dialog" id="decision-form"><div class="dialog-head"><h2 id="decision-title">${isApproval ? 'Revisão da avaliação' : 'Decisão da solicitação'}</h2></div><div class="dialog-body"><div class="notice"><span aria-hidden="true">i</span><div>Esta ação registra uma decisão <strong>somente na demonstração</strong>.</div></div><div class="dialog-error" id="decision-error" role="alert" aria-live="assertive" tabindex="-1" hidden></div><div class="field"><label for="decision">Decisão</label><select id="decision" required>${options.map((option) => `<option ${record[isApproval ? 'approval' : 'decision'] === option ? 'selected' : ''}>${option}</option>`).join('')}</select></div><div class="field"><label for="reviewer">${isApproval ? 'Revisor' : 'Aprovador'}</label><input id="reviewer" required value="${escapeHtml(isApproval ? record.reviewer : record.approver)}" placeholder="Nome do responsável" /></div><div class="field"><label for="justification">Justificativa obrigatória</label><textarea id="justification" required rows="4" placeholder="Explique a decisão e as evidências consideradas">${escapeHtml(isApproval ? record.approvalJustification : record.justification)}</textarea></div><div class="dialog-actions"><button type="button" data-decision-close class="button secondary">Cancelar</button><button type="submit" value="default" class="button green">Registrar decisão</button></div></div></form>`;
  dialog.setAttribute('aria-labelledby', 'decision-title');
  dialog.showModal();
  dialog.querySelector('[data-decision-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('#decision-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorMessage = dialog.querySelector('#decision-error');
    errorMessage.hidden = true;
    const payload = { decision: dialog.querySelector('#decision').value, justification: dialog.querySelector('#justification').value, [isApproval ? 'reviewer' : 'approver']: dialog.querySelector('#reviewer').value };
    const endpoint = isApproval ? `/api/evaluations/${id}/approval` : `/api/requests/${id}/decision`;
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível registrar a decisão');
      await loadData();
      dialog.close();
      render();
      showToast('Decisão demonstrativa registrada.');
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
      errorMessage.focus();
    }
  });
}

async function resetDemo() {
  await fetch('/api/reset', { method: 'POST' });
  await loadData();
  render();
  showToast('Dados fictícios restaurados.');
}

async function loadData() {
  const response = await fetch('/api/demo-data');
  if (!response.ok) throw new Error('Não foi possível carregar os dados demonstrativos.');
  data = await response.json();
}

async function initMonday() {
  if (!window.mondaySdk) return;
  try {
    const monday = window.mondaySdk();
    const context = await Promise.race([
      monday.get('context'),
      new Promise((resolve) => setTimeout(() => resolve(null), 1500))
    ]);
    const theme = context?.data?.theme || context?.data?.themeConfig?.name;
    document.body.classList.toggle('dark-theme', /dark|black/i.test(theme || ''));
    monday.listen('context', (event) => {
      const nextTheme = event?.data?.theme || event?.data?.themeConfig?.name;
      document.body.classList.toggle('dark-theme', /dark|black/i.test(nextTheme || ''));
    });
  } catch { /* Fora do iframe da monday: usar tema padrão. */ }
}

Promise.all([loadData(), initMonday()]).then(render).catch((error) => {
  app.innerHTML = `<div class="loading-screen"><strong>Não foi possível abrir a demonstração.</strong><span>${escapeHtml(error.message)}</span><button class="button" onclick="location.reload()">Tentar novamente</button></div>`;
});
