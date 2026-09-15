/* ============================================================
   Cuaderno de repaso — COMPONENTES
   Los bloques interactivos de Aplicaciones Web (simulador, juegos,
   giros…) y los inicios de cada materia. Ninguno sabe en qué página vive:
   initSecciones() arranca solo los que encuentra en el HTML de la página.
   Los de Estructura de Datos están en secciones-ed.js.
   ============================================================ */

/* ---------- si el nucleo.js es el de antes ----------
   GitHub Pages ignora el ?v=: una página vieja en caché puede cargar este
   archivo nuevo junto con el nucleo.js de antes, que no sabe de materias.
   Entonces se imitan aquí sus funciones, como si todo fuera Aplicaciones Web,
   para que la página no truene los 10 minutos que dura la caché. Con el
   nucleo.js nuevo este bloque no hace nada. */
if (typeof materiaActual !== 'function') {
  const web = {
    id: 'web', llave: '', examen: 'examen.html',
    primera: { href: 'fundamentos.html', txt: 'Empieza por los fundamentos' },
    simulacro: { n: 10, gancho: 'Pruébate como el lunes' }
  };
  const conMateria = p => p && Object.assign({ materia: 'web' }, p);
  Object.assign(window, {
    materiaDe: () => web,
    materiaActual: () => web,
    llaveDe: (mat, k) => k,
    datosDe: () => ({ chuleta: CHEAT, quiz: QUIZ }),
    paginaDe: id => conMateria(PAGINAS.find(p => p.id === id)),
    paginasDe: () => PAGINAS.map(conMateria),
    escHtml: s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  });
}

/* La chuleta de la materia de la página: cada una marca las suyas. */
function renderCheat() {
  const mat = (materiaActual() || materiaDe('web')).id;
  const lista = datosDe(mat).chuleta, llave = llaveDe(mat, 'cheat');
  const done = store.get(llave, []);
  const g = $('#cheats'); g.innerHTML = '';
  lista.forEach((c, i) => {
    const n = el('div', 'cheat' + (done.includes(i) ? ' done' : ''), `<span class="mark"><i data-lucide="check"></i></span><h4>${c.t}</h4><p>${c.d}</p>`);
    n.addEventListener('click', () => {
      const d = store.get(llave, []); const k = d.indexOf(i);
      if (k > -1) d.splice(k, 1); else d.push(i);
      store.set(llave, d); renderCheat(); progreso();
    });
    g.appendChild(n);
  });
  $('#cheatCount').textContent = `${done.length} de ${lista.length} dominadas`;
}

function renderResto() {
  const g = $('#resto'); g.innerHTML = '';
  RESTO.forEach(p => {
    const n = el('div', 'resto-p', `<i class="e" data-lucide="${p.e}"></i><div class="n">${p.n}</div><div class="q">${p.q}</div>`);
    n.addEventListener('click', () => {
      $$('.resto-p').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#restoOut').innerHTML = `<h4><i class="e-in" data-lucide="${p.e}"></i> ${p.n} → ${p.q}</h4><p>${p.d}</p>`;
    });
    g.appendChild(n);
  });
}

function renderRest() {
  const g = $('#restGrid'); g.innerHTML = '';
  REST_RULES.forEach(r => g.appendChild(el('div', 'rest-c' + (r.star ? ' star' : ''),
    `<div class="n2">${r.n}</div><h4>${r.t}${r.star ? ' <i data-lucide="star" class="ico-star"></i>' : ''}</h4><p>${r.d}</p><p class="say">${r.s}</p>`)));
}

function renderUrl() {
  const g = $('#urlBox'); g.innerHTML = '';
  URLP.forEach(p => {
    const n = el('span', 'u-part', p.t);
    n.addEventListener('click', () => {
      $$('.u-part').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#urlOut').innerHTML = `<h4>${p.n}</h4><p><code>${p.t}</code> — ${p.d}</p>`;
    });
    g.appendChild(n);
  });
}

function renderMets() {
  const g = $('#mets'); g.innerHTML = '';
  METODOS.forEach(m => {
    const n = el('div', 'met', `
      <div class="met-h" style="background:${m.bg}"><span class="m">${m.m}</span><span class="c">${m.c}</span></div>
      <div class="met-b">
        <div class="t">${m.t}</div><p>${m.d}</p>
        <div class="ex">${m.ex}</div>
        <div class="flags">
          <span class="flag ${m.safe ? 'y' : 'n'}"><i data-lucide="${m.safe ? 'check' : 'x'}"></i> Seguro</span>
          <span class="flag ${m.idem ? 'y' : 'n'}"><i data-lucide="${m.idem ? 'check' : 'x'}"></i> Idempotente</span>
        </div>
      </div>`);
    g.appendChild(n);
  });
}

function renderFams() {
  const g = $('#fams'); g.innerHTML = '';
  FAMILIAS.forEach(f => {
    const n = el('div', 'fam', `${f.pr ? '<span class="pr">PRINCIPAL</span>' : ''}
      <div class="nn">${f.n}</div><h4>${f.t}</h4><p>${f.d}</p><div class="q">${f.q}</div>`);
    n.style.background = f.bg;
    g.appendChild(n);
  });
  $('#mnemo').innerHTML = MNEMO.map(m => `<li>${m}</li>`).join('');
}

let filtro = 'todos';
function renderFilters() {
  const g = $('#filters'); g.innerHTML = '';
  ['todos', '2xx', '3xx', '4xx', '5xx', 'clave'].forEach(k => {
    const b = el('button', 'fbtn' + (k === filtro ? ' on' : ''), k);
    b.addEventListener('click', () => { filtro = k; renderFilters(); renderCodes(); });
    g.appendChild(b);
  });
}

function renderCodes() {
  const g = $('#codes'); g.innerHTML = '';
  CODIGOS.filter(c => filtro === 'todos' || (filtro === 'clave' ? c.star : c.f === filtro)).forEach(c => {
    const n = el('div', 'code', `${c.star ? '<span class="st"><i data-lucide="star"></i></span>' : ''}<b>${c.c}</b><span>${c.n}</span>`);
    n.style.background = famBg(c.f);
    n.addEventListener('click', () => {
      $$('.code').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#codeOut').innerHTML = `
        <h4><span style="font-family:var(--mono)">${c.c}</span> · ${c.n} ${c.star ? '<i data-lucide="star" class="ico-star"></i>' : ''}</h4>
        <p>${c.d}</p>
        <p style="margin:0"><span style="background:${famBg(c.f)};color:#1a1712;border:2px solid var(--line);border-radius:7px;padding:2px 9px;font-weight:800;font-size:.8rem">familia ${c.f}</span>
        &nbsp; <span style="font-family:var(--mono);font-size:.85rem">${c.ex}</span></p>`;
    });
    g.appendChild(n);
  });
}

function renderDuels() {
  const g = $('#duels'); g.innerHTML = '';
  DUELS.forEach(d => g.appendChild(el('div', 'duel', `<h4>${d.t}</h4>` +
    d.r.map(r => `<div class="duel-r"><span class="duel-c">${r[0]}</span><span class="duel-t">${r[1]}</span></div>`).join(''))));
}

function renderRules() {
  const g = $('#rules'); g.innerHTML = '';
  RULES.forEach(r => g.appendChild(el('div', 'rule',
    `<h4>${r.t}</h4><div class="ok-line"><i data-lucide="check"></i> <span>${r.g}</span></div><div class="bad-line"><i data-lucide="x"></i> <span>${r.b}</span></div><p>${r.p}</p>`)));
}

function renderLayers() {
  const g = $('#layers'); g.innerHTML = '';
  LAYERS.forEach((l, i) => {
    const n = el('div', 'layer', `<i class="e" data-lucide="${l.e}"></i><div><div class="nm">${i + 1}. ${l.n}</div><div class="sh2">${l.s}</div></div>`);
    n.addEventListener('click', () => {
      $$('.layer').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#layerOut').innerHTML = `<h4><i class="e-in" data-lucide="${l.e}"></i> ${l.n}</h4><p>${l.d}</p>`;
    });
    g.appendChild(n);
    if (i < LAYERS.length - 1) g.appendChild(el('div', 'arrow', '↓'));
  });
}

/* ---------- juego: ordena las capas ---------- */
let ordState = [];
function nuevoOrden() {
  do { ordState = shuffle(LAYERS.map((_, i) => i)); } while (ordState.every((v, i) => v === i));
  $('#ordMsg').textContent = '';
  pintarOrden();
}
function pintarOrden(marcar) {
  const g = $('#order'); g.innerHTML = '';
  ordState.forEach((idx, pos) => {
    const l = LAYERS[idx];
    const cls = marcar ? (idx === pos ? ' good' : ' bad') : '';
    const n = el('div', 'ord' + cls, `<i class="e" data-lucide="${l.e}"></i><span class="t">${l.n}</span>
      <span class="ord-btns"><button data-d="-1" aria-label="Subir">↑</button><button data-d="1" aria-label="Bajar">↓</button></span>`);
    $$('button', n).forEach(b => b.addEventListener('click', () => {
      const d = +b.dataset.d, np = pos + d;
      if (np < 0 || np >= ordState.length) return;
      [ordState[pos], ordState[np]] = [ordState[np], ordState[pos]];
      pintarOrden();
    }));
    g.appendChild(n);
  });
}
function comprobarOrden() {
  const bien = ordState.every((v, i) => v === i);
  pintarOrden(true);
  $('#ordMsg').textContent = bien ? '¡Exacto! Ese es el orden.' : 'Todavía no. Las verdes están en su lugar.';
  if (window.Sonido) bien ? Sonido.fanfarria() : Sonido.mal();
  if (bien) { store.set('orden', true); progreso(); }
}

/* ---------- juego: parejas ---------- */
let mSel = null, mHits = 0, mTries = 0, mLock = false;
function nuevaRonda() {
  const elegidos = shuffle(CODIGOS.filter(c => c.star)).slice(0, 6);
  const cartas = shuffle(
    elegidos.map(c => ({ id: c.c, cara: String(c.c), tipo: 'code' }))
      .concat(elegidos.map(c => ({ id: c.c, cara: c.corto, tipo: 'txt' })))
  );
  mSel = null; mHits = 0; mTries = 0; mLock = false;
  $('#mPairs').textContent = '0/6'; $('#mTries').textContent = '0'; $('#mMsg').textContent = '';
  const g = $('#match'); g.innerHTML = '';
  cartas.forEach(c => {
    const n = el('div', 'm-card' + (c.tipo === 'code' ? ' code-face' : ''), c.cara);
    n.dataset.id = c.id; n.dataset.tipo = c.tipo;
    n.addEventListener('click', () => tocarCarta(n));
    g.appendChild(n);
  });
  const best = store.get('mBest', null);
  $('#mBest').textContent = best == null ? '–' : best + ' intentos';
}
function tocarCarta(n) {
  if (mLock || n.classList.contains('hit') || n === mSel) return;
  if (window.Sonido) Sonido.tic();
  if (!mSel) { mSel = n; n.classList.add('sel'); return; }
  if (mSel.dataset.tipo === n.dataset.tipo) { mSel.classList.remove('sel'); mSel = n; n.classList.add('sel'); return; }

  mTries++; $('#mTries').textContent = mTries;
  if (mSel.dataset.id === n.dataset.id) {
    mSel.classList.remove('sel'); mSel.classList.add('hit'); n.classList.add('hit');
    mSel = null; mHits++; $('#mPairs').textContent = mHits + '/6';
    if (window.Sonido) mHits === 6 ? Sonido.fanfarria() : Sonido.pareja();
    if (mHits === 6) {
      const best = store.get('mBest', null);
      const record = best == null || mTries < best;
      if (record) { store.set('mBest', mTries); $('#mBest').textContent = mTries + ' intentos'; }
      $('#mMsg').textContent = record ? `¡Ronda completa en ${mTries} intentos! Nuevo récord.` : `Ronda completa en ${mTries} intentos.`;
      store.set('parejas', true); progreso();
    } else {
      $('#mMsg').textContent = '¡Va!';
    }
  } else {
    mLock = true;
    const a = mSel, b = n;
    if (window.Sonido) Sonido.mal();
    a.classList.remove('sel'); a.classList.add('miss'); b.classList.add('miss');
    $('#mMsg').textContent = 'Esa no.';
    setTimeout(() => { a.classList.remove('miss'); b.classList.remove('miss'); mLock = false; }, 420);
    mSel = null;
  }
}

/* ---------- constructor de endpoints ---------- */
const B = {
  metodo: 'GET',
  version: '/v1',
  recurso: '/mascotas',
  id: '',
  sub: '',
  query: ''
};

function renderBuilder() {
  const g = $('#bGroups'); g.innerHTML = '';
  BGROUPS.forEach(gr => {
    const box = el('div', 'bgroup', `<div class="bgroup-t">${gr.t}</div>`);
    const row = el('div', 'bblocks');
    gr.op.forEach(([val, lbl]) => {
      const b = el('button', 'bblock' + (B[gr.k] === val ? ' on' : ''), lbl);
      b.addEventListener('click', () => { B[gr.k] = val; store.set('usoConst', true); renderBuilder(); progreso(); });
      row.appendChild(b);
    });
    box.appendChild(row); g.appendChild(box);
  });
  evaluarBuilder();
}

function evaluarBuilder() {
  const ruta = B.version + B.recurso + B.id + B.sub + B.query;
  $('#bMet').textContent = B.metodo;
  $('#bMet').style.background = metBg(B.metodo);
  $('#bPath').textContent = ruta || '/';

  const problemas = [];
  if (B.recurso === '/getMascotas') problemas.push('<b>/getMascotas</b> lleva un verbo dentro. El verbo ya lo pone el método HTTP: debe ser <b>/mascotas</b>.');
  if (B.recurso === '/mascota') problemas.push('<b>/mascota</b> está en singular. Los recursos van en <b>plural</b>: <b>/mascotas</b>.');
  if (B.sub && !B.id) problemas.push('Pusiste un subrecurso sin id. <b>/mascotas/vacunas</b> no dice de cuál mascota: falta el <b>/42</b>.');
  if (B.query && B.id) problemas.push('Con un id ya estás pidiendo <b>uno solo</b>: el filtro del <code>?</code> sobra, sirve para filtrar colecciones.');
  if (!B.version) problemas.push('Sin versión funciona, pero <b>/v1</b> te deja cambiar la API mañana sin romper nada. (Detalle, no error grave.)');

  if (B.metodo === 'POST' && B.id) problemas.push('<b>POST</b> va sobre la colección, no sobre un id: el servidor asigna el id, tú no. Devolvería <b>405</b>.');
  if ((B.metodo === 'PUT' || B.metodo === 'PATCH' || B.metodo === 'DELETE') && !B.id) problemas.push(`<b>${B.metodo}</b> necesita saber <b>cuál</b> elemento. Sin id devolvería <b>405</b>.`);

  const grave = problemas.some((p, i) => !p.startsWith('Sin versión'));
  const v = $('#bVerdict');

  if (grave) {
    v.className = 'build-verdict v-no';
    v.innerHTML = '<b><i data-lucide="circle-x"></i> Algo no cuadra</b><ul style="margin:6px 0 0">' + problemas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    return;
  }

  const plural = B.recurso.replace('/', '');
  const cosa = B.sub ? B.sub.replace('/', '') : plural;
  let hace, codigo;
  if (B.metodo === 'GET' && !B.id) { hace = `Devuelve la colección completa de <b>/${cosa}</b>${B.query ? ', filtrada por especie' : ''}.`; codigo = '200 OK · y 200 con lista vacía si no hay ninguno'; }
  else if (B.metodo === 'GET' && B.id && !B.sub) { hace = `Devuelve el elemento con id 42 de <b>/${plural}</b>.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'GET' && B.sub) { hace = `Devuelve los elementos de <b>/${cosa}</b> que pertenecen al 42 de /${plural}.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'POST') { hace = `Crea un elemento nuevo dentro de <b>/${cosa}</b>.`; codigo = '201 Created · 400 si el cuerpo viene mal'; }
  else if (B.metodo === 'PUT') { hace = `Reemplaza <b>por completo</b> el elemento 42. Lo que no mandes se pierde.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'PATCH') { hace = `Cambia <b>solo los campos que mandes</b> del elemento 42.`; codigo = '200 OK · 404 si no existe'; }
  else { hace = `Borra el elemento 42.`; codigo = '204 No Content · 404 si no existe'; }

  v.className = 'build-verdict v-ok';
  v.innerHTML = `<b><i data-lucide="circle-check"></i> Bien formado</b>
    <p style="margin:6px 0 4px">${hace}</p>
    <p style="margin:0"><b>Códigos esperados:</b> <span style="font-family:var(--mono)">${codigo}</span></p>
    ${problemas.length ? '<p style="margin:8px 0 0;font-size:.87rem"><i data-lucide="lightbulb"></i> ' + problemas[0] + '</p>' : ''}`;
}

/* ---------- validador ---------- */
function validar(ruta) {
  const out = [], r = (ruta || '').trim();
  if (!r) return [['warn', 'Escribe una ruta para revisarla.']];
  if (!r.startsWith('/')) out.push(['err', 'Debe empezar con <b>/</b>.']);
  const sq = r.split('?')[0], partes = sq.split('/').filter(Boolean);
  if (/[A-Z]/.test(sq)) out.push(['err', 'Tiene <b>mayúsculas</b>. Las URLs van en minúsculas.']);
  const verbos = ['get', 'post', 'obtener', 'crear', 'borrar', 'eliminar', 'actualizar', 'listar', 'buscar', 'consultar', 'agregar', 'insertar', 'update', 'delete', 'create', 'add', 'filtrar', 'guardar', 'editar', 'modificar', 'registrar', 'traer', 'ver'];
  const cv = partes.find(p => verbos.some(v => p.toLowerCase() === v || (p.toLowerCase().startsWith(v) && p.length > v.length && /[A-Z-]/.test(p[v.length] || ''))));
  // Los pedazos de la ruta los escribió el alumno: se escapan para que un «<b>» se lea, no se pinte.
  if (cv) out.push(['err', `<b>«${escHtml(cv)}»</b> parece un verbo. El verbo lo pone el método HTTP, no la URL.`]);
  if (/_/.test(sq)) out.push(['warn', 'Usa <b>guion medio</b> (-) en vez de guion bajo (_).']);
  const sust = partes.filter(p => !/^\{?\d/.test(p) && !/^\{.*\}$/.test(p) && !/^v\d+$/.test(p) && !/^api$/i.test(p));
  const sing = sust.find(p => !/s$|es$/.test(p.toLowerCase()) && !verbos.includes(p.toLowerCase()));
  if (sing && !cv) out.push(['warn', `<b>«${escHtml(sing)}»</b> parece estar en <b>singular</b>. Los recursos van en plural.`]);
  if (!partes.some(p => /^v\d+$/.test(p))) out.push(['warn', 'No veo versión (<b>/v1</b>). No es obligatorio, pero suma puntos.']);
  if (r.includes('?')) out.push(['ok', `Query params detectados. Perfecto: los filtros van ahí, no en la ruta.`]);
  const i = partes.findIndex(p => /^\d+$|^\{.*\}$/.test(p));
  if (i > 0) out.push(['ok', `Identificador <b>«${escHtml(partes[i])}»</b> bien colocado después de «${escHtml(partes[i - 1])}».`]);
  if (!out.some(o => o[0] !== 'ok')) out.unshift(['ok', '<b>¡Ruta correcta!</b> Cumple las reglas de nombrado REST.']);
  else if (!out.some(o => o[0] === 'err')) out.unshift(['ok', 'Sin errores graves, solo detalles que pulir.']);
  return out;
}
function pintarVal(r) {
  $('#valOut').innerHTML = validar(r).map(([t, m]) =>
    `<div class="v-item ${t === 'err' ? 'err' : t === 'warn' ? 'warn' : 'ok'}"><span>${t === 'err' ? '<i data-lucide="circle-x"></i>' : t === 'warn' ? '<i data-lucide="triangle-alert"></i>' : '<i data-lucide="circle-check"></i>'}</span><span>${m}</span></div>`).join('');
}

/* ---------- giros ---------- */
let giroI = 0;
function renderGiroTabs() {
  const g = $('#giroTabs'); g.innerHTML = '';
  GIROS.forEach((x, i) => {
    const b = el('button', 'gtab' + (i === giroI ? ' on' : ''), `<i data-lucide="${x.e}"></i> ${x.n}`);
    b.addEventListener('click', () => { giroI = i; store.set('giro', i); renderGiroTabs(); renderGiro(); });
    g.appendChild(b);
  });
}
function renderGiro() {
  const x = GIROS[giroI], js = JSON.stringify(x.j.b, null, 2);
  $('#giro').innerHTML = `
    <div class="giro-t"><i class="e" data-lucide="${x.e}"></i><h3>API de ${x.n}</h3></div>
    <p class="giro-s">${x.s}</p>

    <div class="gb"><h4>1 · Recursos, en plural</h4>
      <div class="res">${x.res.map(r => `<span>${r}</span>`).join('')}</div></div>

    <div class="gb"><h4>2 · Los 5 endpoints</h4>
      <div class="tscroll"><table>
        <thead><tr><th>Método</th><th>Endpoint</th><th>Qué hace</th><th>Códigos</th></tr></thead>
        <tbody>${x.eps.map(e => `<tr>
          <td><span class="mtag" style="background:${metBg(e.m)}">${e.m}</span></td>
          <td class="epath">${e.p}</td><td>${e.d}</td>
          <td>${e.c.map(c => `<span class="ecode" style="background:${famBg(String(c)[0] + 'xx')}">${c}</span>`).join('')}</td>
        </tr>`).join('')}</tbody></table></div></div>

    <div class="gb"><h4>3 · JSON de ejemplo</h4>
      <div class="copy-r"><span class="counter" style="font-family:var(--mono)">${x.j.r}</span>
        <button class="btn btn-ghost btn-s" id="copyJson">Copiar</button></div>
      <pre><code>${js.replace(/</g, '&lt;')}</code></pre></div>

    <div class="gb"><h4>4 · Códigos esperados</h4>
      <div>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">200 · consultas correctas</span>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">201 · al registrar</span>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">204 · al borrar</span>
        <span class="ecode" style="background:#fff1c9;padding:5px 11px;font-size:.82rem">400 · datos mal</span>
        <span class="ecode" style="background:#fff1c9;padding:5px 11px;font-size:.82rem">404 · id inexistente</span>
        <span class="ecode" style="background:#ffd9da;padding:5px 11px;font-size:.82rem">500 · falla del servidor</span>
      </div></div>

    <div class="gb"><h4>5 · Diagrama de capas</h4>
      <div class="mini">${LAYERS.map(l => `<div><i data-lucide="${l.e}"></i> <b>${l.n}</b> — ${l.s}</div>`).join('<div class="arrow">↓</div>')}</div></div>`;

  const cb = $('#copyJson');
  cb.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(js); cb.textContent = 'Copiado'; }
    catch (e) { cb.textContent = 'Selecciónalo a mano'; }
    setTimeout(() => cb.textContent = 'Copiar', 1700);
  });
}

function renderCheck() {
  const done = store.get('chk', []);
  const g = $('#check'); g.innerHTML = '';
  CHECK.forEach((t, i) => {
    const n = el('div', 'chk' + (done.includes(i) ? ' done' : ''), `<div class="chk-b"><i data-lucide="check"></i></div><div class="chk-t">${t}</div>`);
    n.addEventListener('click', () => {
      const d = store.get('chk', []); const k = d.indexOf(i);
      if (k > -1) d.splice(k, 1); else d.push(i);
      store.set('chk', d); renderCheck(); progreso();
    });
    g.appendChild(n);
  });
}

/* ---------- simulador ---------- */
function initSim() {
  const ms = $('#simMetodo'), rs = $('#simRecurso');
  METODOS.forEach(m => { const o = el('option', '', m.m); o.value = m.m; ms.appendChild(o); });
  SIM_R.forEach(r => { const o = el('option', '', '/' + r); o.value = r; rs.appendChild(o); });
  ['#simMetodo', '#simRecurso', '#simId', '#simCaso'].forEach(s => $(s).addEventListener('change', () => {
    store.set('usoSim', true); runSim(); progreso();
  }));
  runSim();
}

function runSim() {
  const m = $('#simMetodo').value, rec = $('#simRecurso').value;
  const conId = $('#simId').value === 'si', caso = $('#simCaso').value;
  const ruta = '/v1/' + rec + (conId ? '/42' : ''), cuerpo = SIM_EJ[rec];

  let req = `${m} ${ruta} HTTP/1.1\nHost: api.ejemplo.com\nAccept: application/json`;
  if (caso !== 'sintoken') req += `\nAuthorization: Bearer eyJhbGciOi...`;
  if (['POST', 'PUT', 'PATCH'].includes(m)) req += `\nContent-Type: application/json\n\n` + JSON.stringify(caso === 'malos' ? { nombre: '' } : cuerpo, null, 2);

  let code, nm, body, why;
  if (caso === 'sintoken') { code = 401; nm = 'Unauthorized'; body = { error: 'Token no proporcionado' }; why = '<b>401</b> porque el servidor <b>no sabe quién eres</b>. Si supiera quién eres pero no te dejara, sería <b>403</b>.'; }
  else if (caso === 'servidor') { code = 500; nm = 'Internal Server Error'; body = { error: 'Error inesperado en el servidor' }; why = '<b>500</b>: familia <b>5xx</b>, culpa del <b>servidor</b>. Tu petición estaba bien; algo tronó del otro lado.'; }
  else if (caso === 'malos' && ['POST', 'PUT', 'PATCH'].includes(m)) { code = 400; nm = 'Bad Request'; body = { error: 'El campo "nombre" es obligatorio' }; why = '<b>400</b>: familia <b>4xx</b>, culpa del <b>cliente</b>. Mandaste el cuerpo incompleto o mal formado.'; }
  else if (caso === 'malos') { code = 200; nm = 'OK'; body = { nota: 'GET y DELETE no llevan cuerpo' }; why = '<b>GET</b> y <b>DELETE</b> normalmente no llevan cuerpo, así que no puede haber datos inválidos. Cambia a POST, PUT o PATCH para ver el 400.'; }
  else if (caso === 'noexiste' && conId) { code = 404; nm = 'Not Found'; body = { error: `No existe ${rec.slice(0, -1)} con id 42` }; why = '<b>404</b>: la ruta es correcta pero <b>ese elemento no existe</b>. Es 4xx porque el cliente pidió algo que no está.'; }
  else if (caso === 'noexiste' && !conId) { code = 200; nm = 'OK'; body = { datos: [], total: 0 }; why = '<b>Trampa de examen.</b> Si pides la <b>colección completa</b> y está vacía, NO es 404: la colección sí existe. Es <b>200 con lista vacía</b>.'; }
  else if (m === 'GET') { code = 200; nm = 'OK'; body = conId ? Object.assign({ id: 42 }, cuerpo) : { datos: [Object.assign({ id: 42 }, cuerpo)], total: 1, pagina: 1 }; why = '<b>200 OK</b>: la lectura salió bien. GET nunca modifica nada, por eso es el único «seguro».'; }
  else if (m === 'POST' && !conId) { code = 201; nm = 'Created'; body = Object.assign({ id: 43 }, cuerpo); why = `<b>201 Created</b> porque se <b>creó</b> un recurso nuevo. Suele traer <code>Location: ${ruta}/43</code>.`; }
  else if (m === 'POST' && conId) { code = 405; nm = 'Method Not Allowed'; body = { error: 'No se puede crear sobre un id existente' }; why = `<b>405</b>: POST va sobre la <b>colección</b> (<code>/v1/${rec}</code>), no sobre un id. El servidor asigna el id, tú no.`; }
  else if ((m === 'PUT' || m === 'PATCH') && conId) { code = 200; nm = 'OK'; body = Object.assign({ id: 42 }, cuerpo, { actualizado: true }); why = m === 'PUT' ? '<b>200 OK</b>: PUT <b>reemplaza el recurso completo</b>. Lo que no mandes se pierde.' : '<b>200 OK</b>: PATCH cambia <b>solo los campos que mandaste</b>.'; }
  else if (m === 'PUT' || m === 'PATCH') { code = 405; nm = 'Method Not Allowed'; body = { error: 'Indica qué elemento modificar' }; why = `<b>405</b>: para modificar hay que decir <b>cuál</b>. ${m} necesita un id: <code>${ruta}/42</code>.`; }
  else if (m === 'DELETE' && conId) { code = 204; nm = 'No Content'; body = null; why = '<b>204 No Content</b>: se borró bien y <b>no hay nada que devolver</b>. Por eso el cuerpo va vacío.'; }
  else { code = 405; nm = 'Method Not Allowed'; body = { error: 'No se permite borrar la colección completa' }; why = '<b>405</b>: un DELETE sobre la colección borraría <b>todo</b>. Casi ninguna API lo permite.'; }

  $('#simReq').textContent = req;
  $('#simStatus').textContent = `${code} ${nm}`;
  $('#simStatus').style.background = famBg(String(code)[0] + 'xx');
  $('#simRes').textContent = body === null ? '(sin cuerpo)' : JSON.stringify(body, null, 2);
  $('#simWhy').innerHTML = '<i data-lucide="lightbulb"></i> ' + why;
}

/* ============================================================
   INICIOS — ruta de estudio, avisos y las materias
   ============================================================ */
function renderRuta() {
  const g = $('#ruta'); if (!g) return;
  const mat = materiaActual(); if (!mat) return;
  g.innerHTML = paginasDe(mat.id).slice(1).map((p, i) => {
    const av = avancePagina(p.id), pct = Math.round(av * 100), lista = av >= .99;
    const estado = lista ? 'Listo' : av > 0 ? 'Continuar' : 'Empezar';
    return `<a class="ruta-c tono-${p.tono}${lista ? ' lista' : ''}" href="${p.archivo}">
      <span class="ruta-top"><span class="ruta-n">${i + 1}</span><i class="ruta-ico" data-lucide="${p.icono}"></i></span>
      <b class="ruta-t">${p.nombre}</b>
      <span class="ruta-d">${p.desc}</span>
      <span class="ruta-pie">
        <span class="ruta-min"><i data-lucide="clock"></i> ${p.min} min</span>
        <span class="ruta-est">${lista ? '<i data-lucide="check"></i> ' : ''}${estado}</span>
      </span>
      <span class="ruta-barra"><span style="width:${pct}%"></span></span>
    </a>`;
  }).join('');
}

const avisoHtml = (tono, href, ico, chico, grande) =>
  `<a class="aviso tono-${tono}" href="${href}"><i class="aviso-i" data-lucide="${ico}"></i><span><small>${chico}</small><b>${grande}</b></span><i class="aviso-f" data-lucide="arrow-right"></i></a>`;

const fallosDe = mat => {
  const f = store.get(llaveDe(mat, 'fallos'), {});
  return datosDe(mat).quiz.filter(q => f[q.id]).length;
};
const ultimaDe = mat => {
  const p = paginaDe(store.get(llaveDe(mat, 'ultima'), null));
  return p && p.materia === mat && p.id !== paginasDe(mat)[0].id ? p : null;
};

function renderAvisos() {
  const c = $('#avisos'); if (!c) return;
  const mat = materiaActual(); if (!mat) return;
  const nf = fallosDe(mat.id), ultima = ultimaDe(mat.id);
  const bestEx = store.get(llaveDe(mat.id, 'bestExamen'), 0);
  c.innerHTML =
    (ultima ? avisoHtml(ultima.tono, ultima.archivo, 'bookmark', 'Te quedaste en', ultima.nombre)
      : avisoHtml('az', mat.primera.href, 'play', 'Primera vez aquí', mat.primera.txt)) +
    (nf ? avisoHtml('am', mat.examen + '#fallos', 'rotate-ccw', 'Tienes pendientes', nf + ' pregunta' + (nf === 1 ? '' : 's') + ' que fallaste') : '') +
    avisoHtml('ro', mat.examen + '#simulacro', 'timer', bestEx ? `Tu mejor simulacro: ${bestEx}/${mat.simulacro.n}` : mat.simulacro.gancho, 'Hacer el simulacro');
}

/* Inicio general: una tarjeta por materia con su avance. */
function renderMaterias() {
  const g = $('#materias'); if (!g) return;
  g.innerHTML = MATERIAS.map(m => {
    const pct = Math.round(avanceMateria(m.id) * 100);
    const ultima = ultimaDe(m.id), nf = fallosDe(m.id);
    const bestEx = store.get(llaveDe(m.id, 'bestExamen'), 0);
    const pags = paginasDe(m.id).slice(1);
    const meta = (bestEx ? `<span><i data-lucide="timer"></i> Mejor simulacro: <b>${bestEx}/${m.simulacro.n}</b></span>` : '') +
      (nf ? `<a href="${m.examen}#fallos"><i data-lucide="rotate-ccw"></i> ${nf} fallo${nf === 1 ? '' : 's'} pendiente${nf === 1 ? '' : 's'}</a>` : '');
    return `<article class="materia tono-${m.tono}">
      <a class="materia-h" href="${m.inicio}">
        <span class="materia-ico"><i data-lucide="${m.icono}"></i></span>
        <span class="materia-nom"><small>${m.tema}</small><b>${m.nombre}</b></span>
        <span class="materia-pct">${pct}%</span>
      </a>
      <div class="materia-b">
        <p class="materia-d">${m.desc}</p>
        <ol class="materia-pags">
          ${pags.map((p, i) => `<li${avancePagina(p.id) >= .99 ? ' class="lista"' : ''}><a href="${p.archivo}"><span class="materia-n">${i + 1}</span>${p.nombre}<i data-lucide="check"></i></a></li>`).join('')}
        </ol>
        <div class="materia-barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Avance en ${m.nombre}"><span style="width:${pct}%"></span></div>
        ${meta ? `<p class="materia-meta">${meta}</p>` : ''}
        <div class="materia-cta">
          <a class="btn btn-yellow" href="${ultima ? ultima.archivo : m.inicio}">${ultima ? `Seguir en ${ultima.nombre}` : 'Entrar'} <i data-lucide="arrow-right"></i></a>
          ${ultima ? `<a class="btn btn-ghost btn-s" href="${m.inicio}">Inicio de la materia</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');

  const av = $('#avisosHub');
  if (av) {
    const m = materiaDe(store.get('ultimaMateria', null)), ultima = m && ultimaDe(m.id);
    av.innerHTML = ultima ? avisoHtml(m.tono, ultima.archivo, 'bookmark', `Te quedaste en ${m.nombre}`, ultima.nombre) : '';
    av.classList.toggle('hidden', !ultima);
  }
}

/* ============================================================
   ARRANQUE DE COMPONENTES
   Cada uno se enciende solo si su contenedor existe en esta página.
   ============================================================ */
function initSecciones() {
  const hay = id => !!document.getElementById(id);

  if (hay('materias')) { renderMaterias(); alProgreso.push(renderMaterias); }
  if (hay("ruta")) { renderRuta(); alProgreso.push(renderRuta); }
  if (hay("avisos")) renderAvisos();

  if (hay('cheats')) {
    renderCheat();
    const r = $('#resetCheat');
    if (r) r.addEventListener('click', () => { store.set(llaveDe((materiaActual() || materiaDe('web')).id, 'cheat'), []); renderCheat(); progreso(); });
  }
  if (hay('resto')) renderResto();
  if (hay('restGrid')) renderRest();
  if (hay('urlBox')) renderUrl();
  if (hay('mets')) renderMets();
  if (hay('layers')) renderLayers();

  if (hay('order')) {
    nuevoOrden();
    $('#ordCheck').addEventListener('click', comprobarOrden);
    $('#ordNew').addEventListener('click', nuevoOrden);
  }

  if (hay('fams')) renderFams();
  if (hay('codes')) { renderFilters(); renderCodes(); }
  if (hay('duels')) renderDuels();

  if (hay('match')) {
    nuevaRonda();
    $('#mNew').addEventListener('click', nuevaRonda);
  }

  if (hay('simMetodo')) initSim();
  if (hay('bGroups')) renderBuilder();

  if (hay('valInput')) {
    $('#valBtn').addEventListener('click', () => pintarVal($('#valInput').value));
    $('#valInput').addEventListener('keydown', e => { if (e.key === 'Enter') pintarVal($('#valInput').value); });
    $$('.val-ex .tagbtn').forEach(p => p.addEventListener('click', () => {
      $('#valInput').value = p.dataset.val; pintarVal(p.dataset.val);
    }));
  }

  if (hay('rules')) renderRules();
  if (hay('giroTabs')) { giroI = store.get('giro', 0); renderGiroTabs(); renderGiro(); }
  if (hay('check')) renderCheck();
}
