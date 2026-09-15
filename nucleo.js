/* ============================================================
   Cuaderno de repaso — NÚCLEO
   Lo que comparten todas las páginas de las dos materias: utilidades,
   guardado, tema, iconos, sonido, cabecera y pie, avance y la hoja
   imprimible.
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; };
const escHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Todas las llaves llevan el prefijo rest_ desde la primera versión de la
// página: no se cambia, o tus compañeros pierden su avance. Las de
// Estructura de Datos llevan además ed_ (ver MATERIAS).
const store = {
  get(k, d) { try { const v = localStorage.getItem('rest_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('rest_' + k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem('rest_' + k); } catch (e) { } }
};

const famBg = f => (FAMILIAS.find(x => x.n === f) || {}).bg || '#e6e3db';
const metBg = m => (METODOS.find(x => x.m === m) || {}).bg || '#e6e3db';

/* ---------- Java con colores ----------
   Un resaltador mínimo: comentarios, textos, números, tipos, palabras
   reservadas y nombres de método. No entiende Java; solo hace que el
   código se lea mejor en la pantalla del celular. */
const JAVA_TIPOS = new Set(['int', 'long', 'double', 'float', 'boolean', 'char', 'void', 'String', 'byte', 'short']);
const JAVA_RESERVADAS = new Set(['public', 'private', 'protected', 'static', 'final', 'class', 'return', 'if', 'else',
  'for', 'while', 'do', 'new', 'true', 'false', 'null', 'break', 'continue', 'this', 'switch', 'case', 'default']);

function resaltarJava(src) {
  const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(\d+(?:\.\d+)?[lLdD]?)\b|\b([A-Za-z_]\w*)\b/g;
  let out = '', ult = 0, m;
  while ((m = re.exec(src))) {
    out += escHtml(src.slice(ult, m.index));
    const t = m[0];
    if (m[1]) out += `<span class="jc">${escHtml(t)}</span>`;
    else if (m[2]) out += `<span class="js">${escHtml(t)}</span>`;
    else if (m[3]) out += `<span class="jn">${t}</span>`;
    else if (JAVA_TIPOS.has(t)) out += `<span class="jt">${t}</span>`;
    else if (JAVA_RESERVADAS.has(t)) out += `<span class="jk">${t}</span>`;
    else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += `<span class="jf">${t}</span>`;
    else out += t;
    ult = re.lastIndex;
  }
  return out + escHtml(src.slice(ult));
}

/* ============================================================
   MATERIAS
   Cada una guarda su avance aparte. Las llaves de Aplicaciones Web son
   las de siempre (sin prefijo): cambiarlas borraría el avance de todos.
   ============================================================ */
const MATERIAS = [
  {
    id: 'web', nombre: 'Aplicaciones Web', corto: 'Web', tema: 'API REST', icono: 'globe', tono: 'am', llave: '',
    inicio: 'aplicaciones-web.html', examen: 'examen.html',
    desc: 'Qué es una API, REST, los métodos y los códigos HTTP, el ejercicio de diseño resuelto y un simulacro con reloj.',
    primera: { href: 'fundamentos.html', txt: 'Empieza por los fundamentos' },
    simulacro: { n: 10, seg: 6 * 60, gancho: 'Pruébate como el lunes', desc: 'Como el lunes: no ves si acertaste hasta entregar, y puedes regresar a cambiar respuestas.', meta: 'Así se llega al lunes.' }
  },
  {
    id: 'ed', nombre: 'Estructura de Datos', corto: 'Datos', tema: 'Recursividad', icono: 'layers', tono: 'rs', llave: 'ed_',
    inicio: 'estructura-datos.html', examen: 'estructura-datos-examen.html',
    desc: 'Recursividad en Java desde cero: el Java que necesitas, la pila de llamadas paso a paso, 10 ejemplos resueltos y un laboratorio para practicar.',
    primera: { href: 'java-basico.html', txt: 'Empieza por Java desde cero' },
    simulacro: { n: 10, seg: 10 * 60, gancho: 'Pruébate con reloj', desc: 'Como un examen de verdad: no ves si acertaste hasta entregar, y puedes regresar a cambiar respuestas.', meta: 'Así se llega al examen.' }
  }
];

const materiaDe = id => MATERIAS.find(m => m.id === id) || null;
const llaveDe = (mat, k) => (materiaDe(mat) || { llave: '' }).llave + k;

/* Los datos de cada materia viven en su propio archivo. Se piden con typeof
   para que una página vieja en caché (que no carga datos-ed.js) no truene. */
function datosDe(mat) {
  if (mat === 'ed') return {
    chuleta: typeof ED_CHEAT !== 'undefined' ? ED_CHEAT : [],
    quiz: typeof ED_QUIZ !== 'undefined' ? ED_QUIZ : []
  };
  return {
    chuleta: typeof CHEAT !== 'undefined' ? CHEAT : [],
    quiz: typeof QUIZ !== 'undefined' ? QUIZ : []
  };
}

/* ============================================================
   ESTRUCTURA DEL SITIO
   El orden de las páginas de cada materia ES su ruta de estudio: de aquí
   salen el menú, los botones «Anterior / Siguiente» y las tarjetas de su
   inicio. Los id de Aplicaciones Web no se cambian: de ellos salen llaves
   de avance guardadas.
   ============================================================ */
const PAGINAS = [
  { id: 'hub', archivo: 'index.html', nombre: 'Mis materias', corto: 'Inicio', icono: 'house', tono: 'am' },

  { id: 'inicio', materia: 'web', archivo: 'aplicaciones-web.html', nombre: 'Inicio', corto: 'Inicio', icono: 'house', tono: 'am' },
  {
    id: 'fundamentos', materia: 'web', archivo: 'fundamentos.html', nombre: 'Fundamentos', corto: 'Fundamentos', icono: 'book-open', tono: 'az', min: 20,
    desc: 'Qué es una API, REST en 6 reglas, las partes de un endpoint, los métodos HTTP y la arquitectura por capas.'
  },
  {
    id: 'codigos', materia: 'web', archivo: 'codigos.html', nombre: 'Códigos HTTP', corto: 'Códigos', icono: 'traffic-cone', tono: 've', min: 15,
    desc: 'Las 5 familias, los 18 códigos y cuándo se usa cada uno, los duelos que confunden y el juego de parejas.'
  },
  {
    id: 'laboratorio', materia: 'web', archivo: 'laboratorio.html', nombre: 'Laboratorio', corto: 'Laboratorio', icono: 'flask-conical', tono: 'mo', min: 15,
    desc: 'Simulador de peticiones, constructor de endpoints y validador de rutas. Aquí se practica razonando.'
  },
  {
    id: 'ejercicio', materia: 'web', archivo: 'ejercicio.html', nombre: 'El ejercicio', corto: 'Ejercicio', icono: 'pencil-ruler', tono: 'am', min: 25,
    desc: 'Reglas de nombrado, los 6 giros resueltos, arma tu propia API y el checklist de la entrega.'
  },
  {
    id: 'examen', materia: 'web', archivo: 'examen.html', nombre: 'Examen', corto: 'Examen', icono: 'timer', tono: 'ro', min: 15,
    desc: 'Práctica libre, simulacro cronometrado de 10 preguntas y repaso de lo que has fallado.'
  },

  { id: 'ed-inicio', materia: 'ed', archivo: 'estructura-datos.html', nombre: 'Inicio', corto: 'Inicio', icono: 'house', tono: 'rs' },
  {
    id: 'ed-java', materia: 'ed', archivo: 'java-basico.html', nombre: 'Java desde cero', corto: 'Java', icono: 'coffee', tono: 'am', min: 30,
    desc: 'Variables, operadores, if, ciclos, métodos, arreglos y String: exactamente el Java que usa la recursividad, sin suponer nada.'
  },
  {
    id: 'ed-recursividad', materia: 'ed', archivo: 'recursividad.html', nombre: '¿Qué es la recursividad?', corto: '¿Qué es?', icono: 'repeat', tono: 'rs', min: 25,
    desc: 'La idea con la fila del cine, el caso base y el caso recursivo, las reglas de oro, cómo pensar recursivo y sus tipos.'
  },
  {
    id: 'ed-pila', materia: 'ed', archivo: 'recursividad-pila.html', nombre: 'La pila de llamadas', corto: 'La pila', icono: 'layers', tono: 'mo', min: 25,
    desc: 'Qué pasa por dentro cuando un método se llama a sí mismo: visualizador paso a paso, ida y vuelta, prueba de escritorio y StackOverflowError.'
  },
  {
    id: 'ed-ejemplos', materia: 'ed', archivo: 'recursividad-ejemplos.html', nombre: 'Ejemplos resueltos', corto: 'Ejemplos', icono: 'code-xml', tono: 've', min: 35,
    desc: 'Los 10 clásicos, del más fácil al reto: la idea en español, el código comentado línea por línea y su prueba de escritorio.'
  },
  {
    id: 'ed-laboratorio', materia: 'ed', archivo: 'recursividad-laboratorio.html', nombre: 'Laboratorio', corto: 'Laboratorio', icono: 'flask-conical', tono: 'az', min: 25,
    desc: '¿Qué imprime?, encuentra el error, arma tu propio método recursivo y las Torres de Hanoi. Aquí se practica razonando.'
  },
  {
    id: 'ed-examen', materia: 'ed', archivo: 'estructura-datos-examen.html', nombre: 'Examen', corto: 'Examen', icono: 'timer', tono: 'ro', min: 20,
    desc: 'Práctica libre con explicaciones, simulacro cronometrado de 10 preguntas y repaso de lo que has fallado.'
  }
];

const paginaDe = id => PAGINAS.find(p => p.id === id) || null;
const paginasDe = mat => PAGINAS.filter(p => p.materia === mat);
const paginaActual = () => paginaDe(document.body.dataset.pagina) || PAGINAS[0];
const materiaActual = () => materiaDe(paginaActual().materia);

/* Cuánto llevas de cada página, de 0 a 1. */
function avancePagina(id) {
  const si = k => !!store.get(k, false);
  const parte = (llave, lista) => lista.length ? Math.min(1, store.get(llave, []).length / lista.length) : 0;
  const ed = typeof ED_CHEAT !== 'undefined';   // página vieja en caché: sin datos de Estructura de Datos
  switch (id) {
    case 'inicio': return parte('cheat', datosDe('web').chuleta);
    case 'fundamentos': return (si('visto_fundamentos') ? .4 : 0) + (si('orden') ? .6 : 0);
    case 'codigos': return (si('visto_codigos') ? .3 : 0) + (si('parejas') ? .7 : 0);
    case 'laboratorio': return (si('visto_laboratorio') ? .4 : 0) + (si('usoSim') ? .3 : 0) + (si('usoConst') ? .3 : 0);
    case 'ejercicio': return (typeof CHECK !== 'undefined' ? (store.get('chk', []).length / CHECK.length) * .5 : 0) + (si('armarOk') ? .5 : 0);
    case 'examen': {
      const n = datosDe('web').quiz.length;
      return n ? Math.min(1, (store.get('best', 0) / n) * .4 + (store.get('bestExamen', 0) / 10) * .6) : 0;
    }

    case 'ed-inicio': return parte('ed_cheat', datosDe('ed').chuleta);
    case 'ed-java': return (si('visto_ed-java') ? .4 : 0) + (ed ? parte('ed_java_chk', ED_JAVA_CHECK) * .6 : 0);
    case 'ed-recursividad': return (si('visto_ed-recursividad') ? .4 : 0) + (si('ed_fila') ? .3 : 0) + (si('ed_clasifica') ? .3 : 0);
    case 'ed-pila': return (si('visto_ed-pila') ? .3 : 0) + (si('ed_visual') ? .3 : 0) + (si('ed_rastreo') ? .4 : 0);
    case 'ed-ejemplos': return (si('visto_ed-ejemplos') ? .3 : 0) + (ed ? parte('ed_ejemplos', ED_EJEMPLOS) * .7 : 0);
    case 'ed-laboratorio': return (si('visto_ed-laboratorio') ? .1 : 0) + (si('ed_imprime') ? .25 : 0) + (si('ed_error') ? .25 : 0) + (si('ed_armar') ? .2 : 0) + (si('ed_hanoi') ? .2 : 0);
    case 'ed-examen': {
      const n = datosDe('ed').quiz.length;
      return n ? Math.min(1, (store.get('ed_best', 0) / n) * .4 + (store.get('ed_bestExamen', 0) / 10) * .6) : 0;
    }
  }
  return 0;
}

function avanceMateria(mat) {
  const ps = paginasDe(mat);
  return ps.length ? ps.reduce((t, p) => t + avancePagina(p.id), 0) / ps.length : 0;
}

/* Quien necesite enterarse de un cambio de avance se anota aquí. */
const alProgreso = [];

function progreso() {
  const mat = materiaActual();
  const av = mat ? avanceMateria(mat.id) : MATERIAS.reduce((t, m) => t + avanceMateria(m.id), 0) / MATERIAS.length;
  const pct = Math.round(av * 100);
  const f = $('#progFill'), t = $('#progPct');
  if (f) f.style.width = pct + '%';
  if (t) t.textContent = pct + '%';
  $$('.tab[data-p], .mat-pag[data-p]').forEach(a => a.classList.toggle('lista', avancePagina(a.dataset.p) >= .99));
  $$('.tab[data-m]').forEach(a => a.classList.toggle('lista', avanceMateria(a.dataset.m) >= .99));
  $$('[data-pct-materia]').forEach(n => { n.textContent = Math.round(avanceMateria(n.dataset.pctMateria) * 100) + '%'; });
  alProgreso.forEach(fn => { try { fn(pct); } catch (e) { } });
}

/* ============================================================
   CABECERA Y PIE
   Se pintan desde aquí para que el menú exista en UN solo lugar.
   Dentro de una materia, las pestañas son sus páginas; en el inicio
   general, las pestañas son las materias.
   ============================================================ */
function inyectarCabecera(pag) {
  const c = $('#cabecera'); if (!c) return;
  const mat = materiaActual();
  const tabs = mat
    ? paginasDe(mat.id).map(p => `<a href="${p.archivo}" class="tab${p.id === pag ? ' on' : ''}" data-p="${p.id}"${p.id === pag ? ' aria-current="page"' : ''}>${p.corto}</a>`)
    : MATERIAS.map(m => `<a href="${m.inicio}" class="tab tab-materia tono-${m.tono}" data-m="${m.id}"><i data-lucide="${m.icono}"></i> ${m.nombre}</a>`);

  c.outerHTML = `
  <header class="bar">
    <div class="bar-in">
      <a class="logo" href="index.html" aria-label="Inicio: todas las materias">
        <i class="logo-mark" data-lucide="notebook-pen"></i>
        ${mat ? '' : '<span class="logo-txt"><b>Repaso</b></span>'}
      </a>
      ${mat ? `<button class="mat-btn tono-${mat.tono}" id="matBtn" aria-expanded="false" aria-controls="matPanel" title="Cambiar de materia">
        <i data-lucide="${mat.icono}"></i><span class="mat-btn-t">${mat.nombre}</span><span class="mat-btn-c">${mat.corto}</span><i class="mat-chev" data-lucide="chevron-down"></i>
      </button>` : ''}
      ${mat ? panelMateria(mat, pag) : ''}
      <nav class="tabs" aria-label="${mat ? 'Páginas de ' + mat.nombre : 'Materias'}">
        ${tabs.join('')}
      </nav>
      <div class="bar-right">
        <div class="prog" title="${mat ? 'Tu avance en ' + mat.nombre : 'Tu avance en las dos materias'}"><div class="prog-fill" id="progFill"></div><span id="progPct">0%</span></div>
        <button class="icon-btn" id="sndBtn" aria-label="Sonido"><i data-lucide="volume-x"></i></button>
        <button class="icon-btn" id="themeBtn" aria-label="Cambiar tema"><i data-lucide="moon"></i></button>
      </div>
    </div>
    <div class="snd-panel hidden" id="sndPanel">
      <div class="snd-row"><span>Efectos de sonido</span><button class="sw" id="swFx" role="switch" aria-checked="false"><i></i></button></div>
      <div class="snd-row"><span>Lluvia para concentrarse</span><button class="sw" id="swRain" role="switch" aria-checked="false"><i></i></button></div>
      <div class="snd-row"><span>Volumen</span><input type="range" id="sndVol" min="0" max="1" step="0.05" value="0.5"></div>
      <p class="snd-nota">Todo se genera aquí mismo: no descarga nada ni usa datos. Si cambias de página, la lluvia sigue en cuanto toques la pantalla.</p>
    </div>
  </header>`;
}

/* El panel va justo después de su botón: así, con el teclado, el Tab entra
   directo a él. Se posiciona respecto a la barra, igual que el del sonido. */
function panelMateria(mat, pag) {
  return `<div class="mat-panel hidden" id="matPanel">
      <p class="mat-panel-t">Estás en ${mat.nombre} · <span data-pct-materia="${mat.id}">0%</span></p>
      <nav class="mat-pags" aria-label="Páginas de ${mat.nombre}">
        ${paginasDe(mat.id).map(p => `<a class="mat-pag${p.id === pag ? ' on' : ''}" href="${p.archivo}" data-p="${p.id}"${p.id === pag ? ' aria-current="page"' : ''}>
          <i data-lucide="${p.icono}"></i><span>${p.nombre}</span><i class="mat-pag-ok" data-lucide="check"></i>
        </a>`).join('')}
      </nav>
      <p class="mat-panel-t">Cambiar de materia</p>
      ${MATERIAS.filter(m => m.id !== mat.id).map(m => `<a class="mat-op tono-${m.tono}" href="${m.inicio}">
        <span class="mat-op-ico"><i data-lucide="${m.icono}"></i></span>
        <span class="mat-op-txt"><b>${m.nombre}</b><small>${m.tema} · <span data-pct-materia="${m.id}">0%</span></small></span>
        <i data-lucide="arrow-right"></i>
      </a>`).join('')}
      <a class="mat-todas" href="index.html"><i data-lucide="layout-grid"></i> Ver todas mis materias</a>
    </div>`;
}

function inyectarPie(pag) {
  const c = $('#pie'); if (!c) return;
  const mat = materiaActual();
  const lista = mat ? paginasDe(mat.id) : [];
  const i = lista.findIndex(p => p.id === pag);
  const ant = i > 0 ? lista[i - 1] : null, sig = i > -1 ? lista[i + 1] || null : null;
  c.outerHTML = `
  <footer class="foot">
    ${(ant || sig) ? `<nav class="pg-nav" aria-label="Ruta de estudio">
      ${ant ? `<a class="pg-nav-a" href="${ant.archivo}"><i data-lucide="arrow-left"></i><span><small>Anterior</small>${ant.nombre}</span></a>` : '<span></span>'}
      ${sig ? `<a class="pg-nav-a sig tono-${sig.tono}" href="${sig.archivo}"><span><small>Siguiente</small>${sig.nombre}</span><i data-lucide="arrow-right"></i></a>` : '<span></span>'}
    </nav>` : ''}
    <p class="foot-big">Tú puedes.</p>
    <p class="counter">Tu avance se guarda solo en este dispositivo. Nadie más lo ve.</p>
    <p class="counter">Hecho por Diego para el grupo${mat ? ' de ' + mat.nombre : ''}.</p>
    <div class="row-mid">
      ${mat ? '<button class="btn btn-ghost btn-s" data-imprimir><i data-lucide="printer"></i> Imprimir la chuleta</button>' : ''}
      <button class="btn btn-ghost btn-s" id="wipe">${mat ? 'Borrar mi avance' : 'Borrar todo mi avance'}</button>
    </div>
  </footer>
  <a href="#top" class="up" id="up" aria-label="Arriba"><i data-lucide="arrow-up"></i></a>
  <div id="hojaImpresa" aria-hidden="true"></div>`;
}

/* Panel para cambiar de materia. Solo existe dentro de una materia. */
function initMaterias() {
  const btn = $('#matBtn'), panel = $('#matPanel');
  if (!btn || !panel) return;
  const abrir = si => {
    panel.classList.toggle('hidden', !si);
    btn.setAttribute('aria-expanded', si);
    if (si) { const snd = $('#sndPanel'); if (snd) snd.classList.add('hidden'); progreso(); }
  };
  btn.addEventListener('click', e => { e.stopPropagation(); abrir(panel.classList.contains('hidden')); });
  document.addEventListener('click', e => {
    if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !btn.contains(e.target)) abrir(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || panel.classList.contains('hidden')) return;
    const adentro = panel.contains(document.activeElement);
    abrir(false);
    if (adentro) btn.focus();      // si no, el foco se queda en un link que ya no se ve
  });
}

/* ============================================================
   TEMA
   El <head> de cada página ya lo aplicó antes de pintar (para que no
   haya un destello blanco al navegar); aquí solo va el botón.
   ============================================================ */
function initTema() {
  const guardado = store.get('tema', null);
  const oscuro = guardado != null ? guardado : window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(oscuro);
  const b = $('#themeBtn');
  if (b) b.addEventListener('click', () => {
    const ahora = document.documentElement.getAttribute('data-theme') !== 'dark';
    aplicarTema(ahora); store.set('tema', ahora);
  });
}
function aplicarTema(oscuro) {
  document.documentElement.setAttribute('data-theme', oscuro ? 'dark' : 'light');
  const b = $('#themeBtn');
  if (b) { b.innerHTML = '<i data-lucide="' + (oscuro ? 'sun' : 'moon') + '"></i>'; iconos(); }
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', oscuro ? '#1b1a21' : '#f7f1e3');
}

/* ============================================================
   ICONOS (Lucide)
   ============================================================ */
function iconos(intento) {
  if (!window.lucide) return;
  try { lucide.createIcons(); } catch (e) { }
  // Ojo: aquí NO se puede usar requestAnimationFrame. El navegador lo congela
  // cuando la pestaña no está al frente, y los iconos se quedan sin pintar
  // para siempre en quien abre el link y se cambia de app.
  const n = intento || 0;
  if (n < 6 && document.querySelector('i[data-lucide]')) setTimeout(() => iconos(n + 1), 40);
}

function initIconos() {
  if (!window.lucide) return;              // si el CDN falla, la página sigue funcionando
  let pendiente = false;
  new MutationObserver(() => {
    if (pendiente) return;
    pendiente = true;
    setTimeout(() => { pendiente = false; iconos(); }, 30);
  }).observe(document.body, { childList: true, subtree: true });
  iconos();
}

/* ============================================================
   SONIDO
   ============================================================ */
function initSonido() {
  if (!window.Sonido) return;
  const btn = $('#sndBtn'), panel = $('#sndPanel');
  if (!btn || !panel) return;
  const swFx = $('#swFx'), swRain = $('#swRain'), vol = $('#sndVol');

  const pinta = () => {
    const fx = Sonido.efectosActivos(), rain = Sonido.lluviaActiva();
    swFx.classList.toggle('on', fx); swFx.setAttribute('aria-checked', fx);
    swRain.classList.toggle('on', rain); swRain.setAttribute('aria-checked', rain);
    btn.innerHTML = '<i data-lucide="' + ((fx || rain) ? 'volume-2' : 'volume-x') + '"></i>'; iconos();
  };

  btn.addEventListener('click', e => {
    e.stopPropagation(); panel.classList.toggle('hidden'); pinta();
    const mp = $('#matPanel'); if (mp) { mp.classList.add('hidden'); const mb = $('#matBtn'); if (mb) mb.setAttribute('aria-expanded', false); }
  });
  document.addEventListener('click', e => {
    if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !btn.contains(e.target)) panel.classList.add('hidden');
  });

  swFx.addEventListener('click', () => { Sonido.alternarEfectos(); pinta(); });
  swRain.addEventListener('click', () => { Sonido.alternarLluvia(); store.set('lluviaViva', Sonido.lluviaActiva()); pinta(); });
  vol.value = Sonido.volumen();
  vol.addEventListener('input', e => Sonido.ponerVolumen(+e.target.value));

  // Al cambiar de página el navegador corta todo el audio, y iOS no deja
  // arrancarlo solo. Si la lluvia venía sonando, se reanuda con el primer
  // toque del usuario en la página nueva.
  if (store.get('lluviaViva', false)) {
    btn.classList.add('espera');
    const reanudar = () => {
      document.removeEventListener('pointerdown', reanudar, true);
      document.removeEventListener('keydown', reanudar, true);
      btn.classList.remove('espera');
      if (store.get('lluviaViva', false) && !Sonido.lluviaActiva()) { Sonido.alternarLluvia(); pinta(); }
    };
    document.addEventListener('pointerdown', reanudar, true);
    document.addEventListener('keydown', reanudar, true);
  }
  pinta();
}

/* ============================================================
   NAVEGACIÓN DENTRO DE LA PÁGINA
   ============================================================ */
function initIndice() {
  const links = $$('.pg-indice a');
  if (links.length) {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach(s => obs.observe(s));
  }
  const up = $('#up');
  if (up) window.addEventListener('scroll', () => up.classList.toggle('show', window.scrollY > 700), { passive: true });
  const actual = $('.tab.on');
  if (actual) setTimeout(() => actual.scrollIntoView({ inline: 'center', block: 'nearest' }), 60);
}

function initCd() {
  if (!$('#cdD')) return;
  const tick = () => {
    const now = new Date(), t = new Date(now);
    const dias = (8 - now.getDay()) % 7 || 7;
    t.setDate(now.getDate() + dias); t.setHours(7, 0, 0, 0);
    if (now.getDay() === 1 && now.getHours() < 7) t.setDate(t.getDate() - 7);
    let ms = t - now; if (ms < 0) ms = 0;
    $('#cdD').textContent = Math.floor(ms / 86400000);
    $('#cdH').textContent = String(Math.floor(ms / 3600000) % 24).padStart(2, '0');
    $('#cdM').textContent = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
    $('#cdS').textContent = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
}

/* Quien compartió un link viejo aterriza en index.html, que ahora es el
   inicio de las dos materias: se le manda a la sección que corresponde.
   Las primeras anclas son de cuando todo era una sola página (#quiz,
   #giros…); chuleta y ruta-sec, de cuando index.html era el inicio de API REST. */
const ANCLAS_VIEJAS = {
  api: 'fundamentos.html#api', rest: 'fundamentos.html#rest', url: 'fundamentos.html#url',
  metodos: 'fundamentos.html#metodos', capas: 'fundamentos.html#capas',
  codigos: 'codigos.html', parejas: 'codigos.html#parejas',
  simulador: 'laboratorio.html#simulador', diseno: 'laboratorio.html#constructor',
  giros: 'ejercicio.html#giros', armar: 'ejercicio.html#armar', quiz: 'examen.html',
  chuleta: 'aplicaciones-web.html#chuleta', 'ruta-sec': 'aplicaciones-web.html#ruta-sec'
};
function redirigirAnclasViejas(pag) {
  // también por la dirección: un index.html viejo en caché todavía dice data-pagina="inicio"
  if (pag !== 'hub' && !/\/(index\.html)?$/.test(location.pathname)) return false;
  const destino = ANCLAS_VIEJAS[location.hash.slice(1)];
  if (destino) { location.replace(destino); return true; }
  return false;
}

/* Borra el avance de una materia, pero no las preferencias (tema y sonido). */
const LLAVES_AVANCE = {
  web: ['cheat', 'chk', 'best', 'bestExamen', 'examenes', 'fallos', 'giro', 'mBest', 'parejas',
    'orden', 'armar', 'armarOk', 'usoSim', 'usoConst', 'ultima'],
  ed: ['ed_cheat', 'ed_best', 'ed_bestExamen', 'ed_examenes', 'ed_fallos', 'ed_ultima',
    'ed_java_chk', 'ed_fila', 'ed_clasifica', 'ed_visual', 'ed_rastreo', 'ed_ejemplos', 'ed_ejemplo',
    'ed_imprime', 'ed_error', 'ed_armar', 'ed_hanoi', 'ed_hanoiBest']
};
const llavesAvance = mat => LLAVES_AVANCE[mat].concat(paginasDe(mat).map(p => 'visto_' + p.id));

/* ---------- hoja imprimible ----------
   Solo aparece al imprimir o al «Guardar como PDF». Se arma con los mismos
   datos de cada materia, pero condensada: en pantalla no se ve nunca.
   En el inicio general no hay hoja, y la página se imprime tal cual. */
function construirHoja() {
  const c = $('#hojaImpresa'); if (!c) return;
  const mat = materiaActual();
  const hoja = !mat ? null : mat.id === 'ed' ? (typeof hojaEd === 'function' ? hojaEd : null) : hojaWeb;
  // Se marca la página SIN hoja, no la que la tiene: así un nucleo.js viejo en
  // caché (que no pone ninguna clase) sigue imprimiendo su hoja como siempre.
  document.body.classList.toggle('sin-hoja', !hoja);
  c.innerHTML = hoja ? hoja() : '';
}

function hojaWeb() {
  const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
  const claves = CODIGOS.filter(c => c.star);
  const tonos = ['az', 've', 'am', 'mo', 'ro'];

  // diagrama de capas, dibujado (no una lista con flechas de texto)
  const cajas = LAYERS.map((l, i) => {
    const x = 6 + i * 152, col = ['#cfe0ff', '#c8f0d8', '#fff1c9', '#e7e0ff', '#ffd9da'][i];
    return `
      <rect x="${x}" y="26" width="132" height="62" rx="13" fill="${col}" stroke="#1a1712" stroke-width="2.4"/>
      <text x="${x + 66}" y="52" text-anchor="middle" font-size="12" font-weight="800" fill="#1a1712">${l.n}</text>
      <text x="${x + 66}" y="70" text-anchor="middle" font-size="9.5" fill="#3d3a33">${l.s.length > 27 ? l.s.slice(0, 25) + '…' : l.s}</text>
      ${i < 4 ? `<path d="M${x + 136} 57 h12" stroke="#1a1712" stroke-width="2.4" marker-end="url(#pta)"/>` : ''}`;
  }).join('');

  return `
  <!-- ===================== HOJA 1 ===================== -->
  <div class="hi-pg">
    <span class="hi-tape t1"></span><span class="hi-tape t2"></span>

    <header class="hi-head">
      <h1>Repaso <span class="hl am">API REST</span></h1>
      <p class="hi-sub">Aplicaciones Web · UTEZ</p>
      <p class="hi-mano">todo lo que cae, en dos hojas ✦</p>
    </header>

    <section class="hi-sec">
      <h2><span class="hi-tab az"></span>Lo mínimo que hay que saberse</h2>
      <div class="hi-notas">
        ${CHEAT.map((c, i) => `<div class="hi-nota ${tonos[i % 5]}"><b>${c.t}</b>${sinHtml(c.d)}</div>`).join('')}
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab ve"></span>Los métodos HTTP</h2>
      <table class="hi-t hi-met">
        <tr><th>Método</th><th>Qué hace</th><th>Seguro</th><th>Idemp.</th><th>Éxito</th></tr>
        ${METODOS.map(m => `<tr>
          <td><span class="hi-pill" style="background:${m.bg}">${m.m}</span></td>
          <td>${m.t}</td><td>${m.safe ? 'sí' : 'no'}</td><td>${m.idem ? 'sí' : 'no'}</td>
          <td><b>${m.c}</b></td></tr>`).join('')}
      </table>
      <p class="hi-mano hi-flecha">el método es el <u>verbo</u>, la URL es el <u>sustantivo</u></p>
      <div class="hi-sticky">
        <b>PUT vs PATCH</b>
        PUT reemplaza el recurso <u>completo</u> y lo que no mandes se pierde.
        PATCH cambia <u>solo</u> los campos que mandaste.
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab am"></span>Las 5 familias</h2>
      <div class="hi-fams">
        ${FAMILIAS.map(f => `<div class="hi-fam" style="background:${f.bg}">
          <b>${f.n}</b><span>${f.t}</span><i>${f.q}</i></div>`).join('')}
      </div>
      <p class="hi-mano">el <b>4</b> es «fallaste tú» · el <b>5</b> es «se cayó el servidor»</p>
    </section>
  </div>

  <!-- ===================== HOJA 2 ===================== -->
  <div class="hi-pg">
    <span class="hi-tape t3"></span>

    <section class="hi-sec">
      <h2><span class="hi-tab ro"></span>Los códigos que caen</h2>
      <table class="hi-t hi-cod">
        ${claves.map(c => `<tr>
          <td><span class="hi-cod-n" style="background:${famBg(c.f)}">${c.c}</span></td>
          <td><b>${c.n}</b></td><td>${sinHtml(c.corto)}</td></tr>`).join('')}
      </table>
      <p class="hi-mano hi-flecha">colección vacía = <b>200 con [ ]</b>, nunca 404</p>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab mo"></span>Reglas de nombrado</h2>
      <div class="hi-reglas">
        ${RULES.map(r => `<div class="hi-regla">
          <b>${r.t}</b>
          <span class="si">sí &nbsp;<code>${r.g}</code></span>
          <span class="no">no &nbsp;<code>${r.b}</code></span>
        </div>`).join('')}
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab az"></span>Arquitectura por capas</h2>
      <svg class="hi-svg" viewBox="0 0 774 132" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="pta" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill="#1a1712"/></marker></defs>
        <text x="6" y="16" font-size="11" font-weight="800" fill="#1a1712">la petición baja →</text>
        ${cajas}
        <path d="M740 96 q0 22 -22 22 H30 q-22 0 -22 -18" stroke="#1a1712" stroke-width="2.4"
              fill="none" stroke-dasharray="6 5" marker-end="url(#pta)"/>
        <text x="387" y="128" text-anchor="middle" font-size="10.5" font-weight="700" fill="#3d3a33">
          ← y la respuesta regresa por el mismo camino</text>
      </svg>
      <div class="hi-caps">
        ${LAYERS.map(l => `<div><b>${l.n}:</b> ${sinHtml(l.d).split('.')[0]}.</div>`).join('')}
      </div>
    </section>

    <div class="hi-sticky final">
      <b>No se te olvide</b>
      La entrega va <u>en la libreta</u>, con fotos, y <u>FIRMADA</u>.
      Mínimo 2 recursos en plural · 5 endpoints · 1 JSON · códigos · diagrama.
      <span class="hi-pie">skytoti.github.io/Aplicaciones-Web</span>
    </div>
  </div>`;
}


/* ============================================================
   ARRANQUE COMÚN
   Corre en todas las páginas antes que el código propio de cada una.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const pag = paginaActual().id;
  if (redirigirAnclasViejas(pag)) return;
  const mat = materiaActual();

  inyectarCabecera(pag);
  inyectarPie(pag);
  initTema();

  if (mat) {
    store.set('visto_' + pag, true);
    // «Te quedaste en…»: cada materia recuerda la suya, y el inicio general la última materia
    if (pag !== paginasDe(mat.id)[0].id) store.set(llaveDe(mat.id, 'ultima'), pag);
    store.set('ultimaMateria', mat.id);
  }

  if (typeof initSecciones === 'function') initSecciones();
  if (typeof initSeccionesEd === 'function') initSeccionesEd();

  initIndice();
  initCd();
  initSonido();
  initMaterias();

  $$('[data-imprimir]').forEach(b => b.addEventListener('click', () => { construirHoja(); window.print(); }));

  const wipe = $('#wipe');
  if (wipe) wipe.addEventListener('click', () => {
    const texto = mat
      ? `¿Borrar tu avance de ${mat.nombre}? Se pierden tus fallos, tus récords y tu progreso de esta materia. No se puede deshacer.`
      : '¿Borrar tu avance de las dos materias? Se pierden tus fallos, tus récords y tu progreso. No se puede deshacer.';
    if (!confirm(texto)) return;
    (mat ? [mat.id] : MATERIAS.map(m => m.id)).forEach(m => llavesAvance(m).forEach(k => store.del(k)));
    if (!mat) store.del('ultimaMateria');
    location.reload();
  });

  construirHoja();
  progreso();
  initIconos();

  // Caveat solo se usa en la hoja impresa, y el navegador no descarga fuentes
  // de elementos ocultos: sin esto las anotaciones salen con letra de repuesto.
  try { if (document.fonts && document.fonts.load) document.fonts.load('700 13pt Caveat'); } catch (e) { }
});
