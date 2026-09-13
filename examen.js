/* ============================================================
   Repaso API REST — EXAMEN
   Tres modos sobre el mismo banco de preguntas:
     · Práctica libre  — las 24, con la explicación después de cada una.
     · Simulacro       — 10 preguntas y reloj, como el lunes: no ves nada
                          hasta entregar y puedes regresar a cambiar.
     · Mis fallos      — solo lo que has fallado, en cualquier modo.
   ============================================================ */

(() => {
  const SIMULACRO_N = 10;
  // ?seg=20 acorta el reloj: sirve para probar el fin de tiempo sin esperar.
  const SIMULACRO_SEG = (() => {
    const v = parseInt(new URLSearchParams(location.search).get('seg'), 10);
    return v > 0 ? v : 6 * 60;
  })();

  /* ============================================================
     MIS FALLOS
     Se guarda cada pregunta fallada con cuántas veces se ha fallado.
     Sale de la lista cuando se contesta bien DOS veces seguidas: una sola
     puede ser suerte, dos ya es que te la sabes.
     ============================================================ */
  const Fallos = {
    todos() { return store.get('fallos', {}); },
    preguntas() {
      const f = this.todos();
      return QUIZ.filter(q => f[q.id]).sort((a, b) => f[b.id].veces - f[a.id].veces);
    },
    cuantos() { return this.preguntas().length; },
    /* devuelve 'fallo', 'racha', 'dominada' o null (acertó y no estaba) */
    registrar(q, ok) {
      const f = this.todos();
      if (!ok) {
        f[q.id] = { veces: ((f[q.id] || {}).veces || 0) + 1, racha: 0 };
        store.set('fallos', f);
        return 'fallo';
      }
      if (!f[q.id]) return null;
      f[q.id].racha = (f[q.id].racha || 0) + 1;
      if (f[q.id].racha >= 2) { delete f[q.id]; store.set('fallos', f); return 'dominada'; }
      store.set('fallos', f);
      return 'racha';
    }
  };
  window.Fallos = Fallos;   // el inicio lo usa para el aviso de pendientes

  /* ============================================================
     ESTADO DE LA RONDA
     ============================================================ */
  const R = {
    modo: null,
    preg: [],        // [{ q, orden }]: orden = índices de opciones ya revueltos
    resp: [],        // índice ORIGINAL elegido por pregunta, o null
    i: 0,
    aciertos: 0,
    dominadas: 0,
    fin: 0,          // hora exacta en que se acaba el simulacro
    inicio: 0,
    reloj: null,
    ultimoSeg: null
  };

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const app = () => $('#examenApp');
  const sonido = fn => { if (window.Sonido) Sonido[fn](); };

  /* Simulacro: 10 preguntas repartidas entre todos los temas, no al azar
     puro. Así no te tocan siete de códigos y ninguna de capas. */
  function elegirSimulacro() {
    const porTema = {};
    shuffle(QUIZ).forEach(q => (porTema[q.tema] = porTema[q.tema] || []).push(q));
    const temas = shuffle(Object.keys(porTema)), out = [];
    while (out.length < SIMULACRO_N) {
      let hubo = false;
      for (const t of temas) {
        if (porTema[t].length && out.length < SIMULACRO_N) { out.push(porTema[t].pop()); hubo = true; }
      }
      if (!hubo) break;
    }
    return shuffle(out);
  }

  function prepararRonda(modo) {
    const base = modo === 'simulacro' ? elegirSimulacro()
      : modo === 'fallos' ? Fallos.preguntas()
        : shuffle(QUIZ);
    R.modo = modo;
    R.preg = base.map(q => ({ q, orden: shuffle(q.o.map((_, k) => k)) }));
    R.resp = R.preg.map(() => null);
    R.i = 0; R.aciertos = 0; R.dominadas = 0;
  }

  /* ============================================================
     MENÚ
     ============================================================ */
  function pintarMenu(resaltar) {
    detenerReloj();
    const nf = Fallos.cuantos();
    const best = store.get('best', 0), bestEx = store.get('bestExamen', 0);
    const hist = store.get('examenes', []).slice(-6);

    app().innerHTML = `
      <div class="modos">
        <button class="modo tono-ro${resaltar === 'simulacro' ? ' pulso' : ''}" data-modo="simulacro">
          <span class="modo-ico"><i data-lucide="timer"></i></span>
          <b class="modo-t">Simulacro de examen</b>
          <span class="modo-meta">${SIMULACRO_N} preguntas · ${fmt(SIMULACRO_SEG)} minutos</span>
          <span class="modo-d">Como el lunes: no ves si acertaste hasta entregar, y puedes regresar a cambiar respuestas.</span>
          <span class="modo-best">${bestEx ? `Tu mejor: <b>${bestEx}/${SIMULACRO_N}</b>` : 'Todavía no lo intentas'}</span>
        </button>

        <button class="modo tono-az${resaltar === 'practica' ? ' pulso' : ''}" data-modo="practica">
          <span class="modo-ico"><i data-lucide="pencil-line"></i></span>
          <b class="modo-t">Práctica libre</b>
          <span class="modo-meta">${QUIZ.length} preguntas · sin tiempo</span>
          <span class="modo-d">Después de cada respuesta ves la explicación. Lo que falles se guarda para repasarlo.</span>
          <span class="modo-best">${best ? `Tu mejor: <b>${best}/${QUIZ.length}</b>` : 'Todavía no lo intentas'}</span>
        </button>

        <button class="modo tono-am${resaltar === 'fallos' ? ' pulso' : ''}" data-modo="fallos"${nf ? '' : ' disabled'}>
          <span class="modo-ico"><i data-lucide="rotate-ccw"></i></span>
          <b class="modo-t">Mis fallos</b>
          <span class="modo-meta">${nf ? `${nf} pregunta${nf === 1 ? '' : 's'} pendiente${nf === 1 ? '' : 's'}` : 'Nada pendiente'}</span>
          <span class="modo-d">Solo lo que has fallado. Cada una se va de la lista cuando la contestas bien dos veces seguidas.</span>
          <span class="modo-best">${nf ? 'Empieza por las que más fallas' : 'Haz un simulacro o una práctica primero'}</span>
        </button>
      </div>

      ${hist.length ? `
      <div class="historial">
        <h3 class="sub">Tus últimos simulacros</h3>
        <div class="hist-barras">
          ${hist.map(h => `
            <div class="hist-b" title="${h.a}/${h.t} en ${fmt(h.s)}">
              <div class="hist-col"><div class="hist-fill ${h.a / h.t >= .8 ? 'bien' : h.a / h.t >= .6 ? 'medio' : 'mal'}" style="height:${Math.max(6, h.a / h.t * 100)}%"></div></div>
              <b>${h.a}</b><small>${fmt(h.s)}</small>
            </div>`).join('')}
        </div>
      </div>` : ''}`;

    $$('.modo', app()).forEach(b => b.addEventListener('click', () => {
      sonido('tic');
      empezar(b.dataset.modo);
    }));
    if (resaltar) setTimeout(() => { const m = $('.modo.pulso'); if (m) m.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 150);
  }

  function empezar(modo) {
    prepararRonda(modo);
    if (!R.preg.length) return pintarMenu();
    history.replaceState(null, '', '#' + modo);
    if (modo === 'simulacro') {
      R.inicio = Date.now();
      R.fin = R.inicio + SIMULACRO_SEG * 1000;
      pintarSimulacro();
      arrancarReloj();
    } else {
      pintarPractica();
    }
    const top = $('#examen');
    if (top) top.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  /* ============================================================
     PRÁCTICA Y FALLOS — con explicación después de cada respuesta
     ============================================================ */
  function pintarPractica() {
    const p = R.preg[R.i], q = p.q, total = R.preg.length;
    app().innerHTML = `
      <div class="quiz">
        <div class="q-top">
          <button class="ex-salir" aria-label="Salir"><i data-lucide="x"></i></button>
          <span class="counter">${R.i + 1} / ${total}</span>
          <div class="q-bar"><div id="qBar" style="width:${R.i / total * 100}%"></div></div>
          <span class="counter">${R.aciertos} <i data-lucide="check"></i></span>
        </div>
        ${R.modo === 'fallos' ? `<span class="q-tag tag-fallo"><i data-lucide="rotate-ccw"></i> La has fallado ${Fallos.todos()[q.id] ? Fallos.todos()[q.id].veces : 1} ${(Fallos.todos()[q.id] || {}).veces === 1 ? 'vez' : 'veces'}</span> ` : ''}
        <span class="q-tag">${q.tema}</span>
        <h3 class="q-q">${q.q}</h3>
        <div class="q-opts">
          ${p.orden.map(k => `<button class="qopt" data-k="${k}">${q.o[k]}</button>`).join('')}
        </div>
        <div class="q-fb hidden" id="qFb"></div>
        <button class="btn btn-yellow hidden" id="qNext">${R.i + 1 >= total ? 'Ver resultado' : 'Siguiente'}</button>
      </div>`;

    $('.ex-salir', app()).addEventListener('click', () => pintarMenu());
    $$('.qopt', app()).forEach(b => b.addEventListener('click', () => responderPractica(+b.dataset.k, b)));
    $('#qNext').addEventListener('click', () => {
      R.i++;
      R.i >= R.preg.length ? terminar() : pintarPractica();
    });
  }

  function responderPractica(k, boton) {
    const q = R.preg[R.i].q, ok = k === q.r;
    R.resp[R.i] = k;
    $$('.qopt', app()).forEach(b => { b.disabled = true; if (+b.dataset.k === q.r) b.classList.add('right'); });
    if (!ok) boton.classList.add('wrong'); else R.aciertos++;

    const estado = Fallos.registrar(q, ok);
    if (estado === 'dominada') R.dominadas++;
    sonido(ok ? (estado === 'dominada' ? 'fanfarria' : 'bien') : 'mal');

    const extra = estado === 'dominada' ? '<span class="q-dominada"><i data-lucide="sparkles"></i> ¡Dominada! Ya salió de tus fallos.</span>'
      : estado === 'racha' ? '<span class="q-dominada racha">Una más bien y sale de tus fallos.</span>'
        : estado === 'fallo' ? '<span class="q-dominada guardada">Guardada en «Mis fallos» para que la repases.</span>' : '';

    const fb = $('#qFb');
    fb.className = 'q-fb ' + (ok ? 'ok' : 'no');
    fb.innerHTML = (ok ? '<i data-lucide="circle-check"></i> <b>¡Correcto!</b> ' : '<i data-lucide="circle-x"></i> <b>No era esa.</b> ') + q.e + extra;
    $('#qNext').classList.remove('hidden');
  }

  /* ============================================================
     SIMULACRO — reloj, sin respuestas hasta entregar
     ============================================================ */
  function pintarSimulacro() {
    const p = R.preg[R.i], q = p.q, total = R.preg.length;
    const contestadas = R.resp.filter(v => v !== null).length;

    app().innerHTML = `
      <div class="quiz simulacro">
        <div class="sim-top">
          <button class="ex-salir" aria-label="Salir"><i data-lucide="x"></i></button>
          <div class="reloj" id="reloj"><i data-lucide="timer"></i><span id="relojTxt">${fmt(Math.max(0, (R.fin - Date.now()) / 1000))}</span></div>
          <span class="counter">${contestadas}/${total} contestadas</span>
          <button class="btn btn-yellow btn-s" id="exEntregar"><i data-lucide="send"></i> Entregar</button>
        </div>

        <div class="puntos" role="tablist" aria-label="Preguntas">
          ${R.preg.map((_, k) => `<button class="punto${R.resp[k] !== null ? ' lleno' : ''}${k === R.i ? ' aqui' : ''}" data-k="${k}" aria-label="Pregunta ${k + 1}">${k + 1}</button>`).join('')}
        </div>

        <span class="q-tag">${q.tema}</span>
        <h3 class="q-q"><span class="q-n">${R.i + 1}.</span> ${q.q}</h3>
        <div class="q-opts">
          ${p.orden.map((k, pos) => `<button class="qopt${R.resp[R.i] === k ? ' sel' : ''}" data-k="${k}"><span class="q-letra">${'abcd'[pos]}</span>${q.o[k]}</button>`).join('')}
        </div>

        <div class="sim-nav">
          <button class="btn btn-ghost" id="exAnt"${R.i === 0 ? ' disabled' : ''}><i data-lucide="arrow-left"></i> Anterior</button>
          ${R.i + 1 < total
        ? `<button class="btn btn-ghost" id="exSig">Siguiente <i data-lucide="arrow-right"></i></button>`
        : `<button class="btn btn-yellow" id="exSig"><i data-lucide="send"></i> Entregar</button>`}
        </div>
      </div>`;

    $('.ex-salir', app()).addEventListener('click', () => {
      if (confirm('¿Salir del simulacro? Se pierde lo que llevas.')) { detenerReloj(); pintarMenu(); }
    });
    $$('.qopt', app()).forEach(b => b.addEventListener('click', () => {
      R.resp[R.i] = +b.dataset.k;
      sonido('tic');
      // se marca y se avanza solo, para no tener que tocar dos veces
      const siguiente = R.resp.findIndex((v, k) => k > R.i && v === null);
      $$('.qopt', app()).forEach(x => x.classList.toggle('sel', x === b));
      setTimeout(() => {
        // si el tiempo se acabó en estos 260 ms, ya se entregó: no repintar encima
        if (R.modo !== 'simulacro' || !R.reloj) return;
        if (R.i + 1 < R.preg.length) R.i = siguiente > -1 ? siguiente : R.i + 1;
        pintarSimulacro();
      }, 260);
    }));
    $$('.punto', app()).forEach(b => b.addEventListener('click', () => { R.i = +b.dataset.k; pintarSimulacro(); }));
    $('#exAnt').addEventListener('click', () => { if (R.i > 0) { R.i--; pintarSimulacro(); } });
    $('#exSig').addEventListener('click', () => {
      if (R.i + 1 < R.preg.length) { R.i++; pintarSimulacro(); } else entregar();
    });
    $('#exEntregar').addEventListener('click', entregar);
    actualizarReloj();
  }

  function entregar(porTiempo) {
    const faltan = R.resp.filter(v => v === null).length;
    if (porTiempo !== true && faltan && !confirm(`Te falta${faltan === 1 ? '' : 'n'} ${faltan} sin contestar. ¿Entregar así?`)) return;
    detenerReloj();
    R.preg.forEach((p, k) => {
      const ok = R.resp[k] === p.q.r;
      if (ok) R.aciertos++;
      if (Fallos.registrar(p.q, ok) === 'dominada') R.dominadas++;
    });
    terminar(porTiempo === true);
  }

  /* El reloj se calcula contra la hora de fin, no restando segundos: si el
     navegador congela la pestaña un rato, al volver marca lo correcto. */
  function arrancarReloj() {
    detenerReloj();
    R.ultimoSeg = null;
    R.reloj = setInterval(actualizarReloj, 250);
    window.addEventListener('beforeunload', avisarSalida);
  }
  function detenerReloj() {
    if (R.reloj) clearInterval(R.reloj);
    R.reloj = null;
    window.removeEventListener('beforeunload', avisarSalida);
  }
  function avisarSalida(e) { e.preventDefault(); e.returnValue = ''; }

  function actualizarReloj() {
    if (R.modo !== 'simulacro' || !R.reloj) return;
    const resta = Math.max(0, (R.fin - Date.now()) / 1000);
    const seg = Math.ceil(resta);
    const r = $('#reloj'), t = $('#relojTxt');
    if (t) t.textContent = fmt(seg);
    if (r) {
      r.classList.toggle('urgente', seg <= 60);
      r.classList.toggle('ultimos', seg <= 10);
    }
    if (seg !== R.ultimoSeg) {
      if (seg <= 10 && seg > 0) sonido('tictac');
      R.ultimoSeg = seg;
    }
    if (resta <= 0) {
      sonido('alarma');
      entregar(true);
    }
  }

  /* ============================================================
     RESULTADO
     ============================================================ */
  function terminar(porTiempo) {
    const total = R.preg.length, pct = R.aciertos / total;
    const seg = R.modo === 'simulacro' ? Math.min(SIMULACRO_SEG, Math.round((Date.now() - R.inicio) / 1000)) : 0;
    const malas = R.preg.map((p, k) => ({ p, k, ok: R.resp[k] === p.q.r })).filter(x => !x.ok);
    const temas = [...new Set(malas.map(x => x.p.q.tema))];

    // récords e historial
    if (R.modo === 'practica' && total === QUIZ.length && R.aciertos > store.get('best', 0)) store.set('best', R.aciertos);
    if (R.modo === 'simulacro') {
      if (R.aciertos > store.get('bestExamen', 0)) store.set('bestExamen', R.aciertos);
      const h = store.get('examenes', []);
      h.push({ a: R.aciertos, t: total, s: seg, f: new Date().toISOString() });
      store.set('examenes', h.slice(-10));
    }
    progreso();

    const msg = pct === 1 ? 'Perfecto. Vas blindado.'
      : pct >= .8 ? 'Muy bien. Así se llega al lunes.'
        : pct >= .6 ? 'Pasas, pero raspando. Repasa tus fallos y repite.'
          : 'Todavía no. Repasa tus fallos y vuelve a intentarlo.';
    const nf = Fallos.cuantos();
    const etiqueta = R.modo === 'simulacro' ? 'Simulacro' : R.modo === 'fallos' ? 'Repaso de fallos' : 'Práctica libre';

    // en el simulacro se revisa todo; en práctica ya viste cada explicación
    const revisar = R.modo === 'simulacro' ? R.preg.map((p, k) => ({ p, k })) : malas;

    app().innerHTML = `
      <div class="quiz q-end">
        ${porTiempo ? '<p class="ex-tiempo"><i data-lucide="alarm-clock"></i> Se acabó el tiempo: se entregó lo que llevabas.</p>' : ''}
        <span class="q-tag">${etiqueta}</span>
        <div class="q-score"><b>${R.aciertos}</b><span>/${total}</span></div>
        <h3>${msg}</h3>
        ${R.modo === 'simulacro' ? `<p class="counter">Tardaste ${fmt(seg)} de ${fmt(SIMULACRO_SEG)}</p>` : ''}
        ${R.dominadas ? `<p class="q-dominada"><i data-lucide="sparkles"></i> Dominaste ${R.dominadas} pregunta${R.dominadas === 1 ? '' : 's'}: ya salieron de tus fallos.</p>` : ''}
        ${temas.length ? '<p class="counter" style="margin:10px 0 4px">Repasa estos temas:</p>' + temas.map(t => `<span class="weak">${t}</span>`).join('') : ''}

        <pre class="q-share" id="exShareTxt">${textoCompartir(etiqueta, total, seg, temas)}</pre>
        <div class="row-mid">
          <button class="btn btn-yellow" id="exShare"><i data-lucide="share-2"></i> Compartir resultado</button>
          <button class="btn btn-ghost" id="exOtra"><i data-lucide="rotate-cw"></i> Otra vez</button>
          ${nf && R.modo !== 'fallos' ? `<button class="btn btn-ghost" id="exFallos"><i data-lucide="rotate-ccw"></i> Mis fallos (${nf})</button>` : ''}
          <button class="btn btn-ghost" id="exMenu">Cambiar de modo</button>
        </div>
      </div>

      ${revisar.length ? `
      <h3 class="sub">${R.modo === 'simulacro' ? 'Revisión pregunta por pregunta' : 'Las que fallaste'}</h3>
      <ol class="revision">
        ${revisar.map(({ p, k }) => {
      const q = p.q, r = R.resp[k], ok = r === q.r;
      return `<li class="rev ${ok ? 'ok' : 'no'}">
            <div class="rev-h">
              <span class="rev-n">${k + 1}</span>
              <span class="q-tag">${q.tema}</span>
              <span class="rev-est"><i data-lucide="${ok ? 'circle-check' : 'circle-x'}"></i> ${ok ? 'Correcta' : r === null ? 'Sin contestar' : 'Incorrecta'}</span>
            </div>
            <p class="rev-q">${q.q}</p>
            ${!ok && r !== null ? `<p class="rev-a">Contestaste: <b>${q.o[r]}</b></p>` : ''}
            <p class="rev-c">${ok ? 'Tu respuesta' : 'La correcta'}: <b>${q.o[q.r]}</b></p>
            <p class="rev-e">${q.e}</p>
          </li>`;
    }).join('')}
      </ol>` : ''}`;

    if (pct >= .8) sonido('fanfarria');

    $('#exShare').addEventListener('click', () => compartir(textoCompartir(etiqueta, total, seg, temas), $('#exShare')));
    // si ya dominaste todos tus fallos no hay «otra vez» que dar: al menú,
    // nunca a un simulacro con reloj que no pediste
    $('#exOtra').addEventListener('click', () => R.modo === 'fallos' && !Fallos.cuantos() ? pintarMenu() : empezar(R.modo));
    const bf = $('#exFallos'); if (bf) bf.addEventListener('click', () => empezar('fallos'));
    $('#exMenu').addEventListener('click', () => { history.replaceState(null, '', location.pathname + location.search); pintarMenu(); });
    const top = $('#examen'); if (top) top.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function textoCompartir(etiqueta, total, seg, temas) {
    const filas = [];
    const marcas = R.preg.map((p, k) => R.resp[k] === p.q.r ? '🟩' : '🟥');
    const ancho = total <= 10 ? 5 : 8;
    for (let k = 0; k < marcas.length; k += ancho) filas.push(marcas.slice(k, k + ancho).join(''));
    return `${etiqueta} API REST — ${R.aciertos}/${total}${R.modo === 'simulacro' ? ` en ${fmt(seg)}` : ''}\n${filas.join('\n')}` +
      (temas.length ? `\nMe falta: ${temas.join(', ')}` : '\nSin fallos 🏆') +
      `\nhttps://skytoti.github.io/Aplicaciones-Web/examen.html`;
  }

  async function compartir(texto, boton) {
    const original = boton.innerHTML;
    try {
      if (navigator.share) await navigator.share({ text: texto });
      else await navigator.clipboard.writeText(texto);
      boton.innerHTML = '<i data-lucide="check"></i> Listo';
    } catch (e) {
      try { await navigator.clipboard.writeText(texto); boton.innerHTML = '<i data-lucide="check"></i> Copiado'; }
      catch (e2) { boton.textContent = 'Cópialo de arriba'; }
    }
    setTimeout(() => { boton.innerHTML = original; }, 2000);
  }

  /* ============================================================
     ARRANQUE
     El link puede traer el modo: examen.html#fallos lo abre directo.
     El simulacro nunca arranca solo: el reloj no corre sin que lo pidas.
     ============================================================ */
  function abrirPorAncla() {
    const h = location.hash.slice(1);
    if ((h === 'practica') || (h === 'fallos' && Fallos.cuantos())) empezar(h);
    else pintarMenu(h === 'simulacro' ? 'simulacro' : null);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!$('#examenApp')) return;
    abrirPorAncla();
    // Cambiar solo el # NO recarga la página, así que DOMContentLoaded no
    // vuelve a correr. Sin esto, un link a #fallos estando ya aquí no hacía
    // nada. Un simulacro en curso no se interrumpe por un cambio de ancla.
    window.addEventListener('hashchange', () => { if (!R.reloj) abrirPorAncla(); });
  });
})();
