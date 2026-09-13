/* ============================================================
   Arma tu propia API — el alumno diseña, no copia.
   Al final escupe una hoja lista para pasar a la libreta.
   ============================================================ */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

  // Un <option> nativo solo admite texto: aquí no caben iconos ni SVG.
  const GIRO_OPS = [
    ['veterinaria', 'Veterinaria'], ['gimnasio', 'Gimnasio'], ['cine', 'Cine'],
    ['biblioteca', 'Biblioteca'], ['restaurante', 'Restaurante'], ['hospital', 'Hospital'],
    ['otro', 'Otro (yo lo escribo)']
  ];
  const CAPAS = ['Cliente', 'Controlador', 'Servicio', 'Repositorio', 'Base de datos'];
  const METS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const COLOR = { GET: '#cfe0ff', POST: '#c8f0d8', PUT: '#fff1c9', PATCH: '#e7e0ff', DELETE: '#ffd9da' };
  const VERBOS = ['get', 'post', 'obtener', 'crear', 'borrar', 'eliminar', 'actualizar', 'listar', 'buscar',
    'consultar', 'agregar', 'insertar', 'update', 'delete', 'create', 'add', 'filtrar', 'guardar',
    'editar', 'modificar', 'registrar', 'traer', 'ver'];

  const vacio = () => ({
    giro: 'veterinaria', giroNombre: '',
    recursos: ['mascotas', 'citas', ''],
    eps: [
      { m: 'GET', r: 0, id: false, sub: '' },
      { m: 'GET', r: 0, id: true, sub: '' },
      { m: 'POST', r: 0, id: false, sub: '' },
      { m: 'PUT', r: 0, id: true, sub: '' },
      { m: 'DELETE', r: 1, id: true, sub: '' }
    ],
    json: ''
  });

  let S = (() => {
    try { const v = JSON.parse(localStorage.getItem('rest_armar')); return v && v.eps ? v : vacio(); }
    catch (e) { return vacio(); }
  })();
  const persistir = () => { try { localStorage.setItem('rest_armar', JSON.stringify(S)); } catch (e) { } };

  /* ---------- revisiones ---------- */
  function revisaRecurso(txt) {
    const t = (txt || '').trim();
    if (!t) return { nivel: 'vacio', msg: '' };
    if (/[\s/]/.test(t)) return { nivel: 'err', msg: 'Sin espacios ni barras: solo el nombre' };
    // Verbo = la palabra exacta, o el verbo seguido de mayúscula o guion
    // (getMascotas, crear-cita). Así «verduras» o «ventas» no dan falso positivo.
    const low = t.toLowerCase();
    if (VERBOS.some(v => low === v || (low.startsWith(v) && /[A-Z-]/.test(t[v.length] || ''))))
      return { nivel: 'err', msg: 'Lleva un verbo. El verbo lo pone el método' };
    if (/[A-Z]/.test(t)) return { nivel: 'err', msg: 'Va en minúsculas' };
    if (!/s$/.test(t)) return { nivel: 'warn', msg: 'Parece singular. Va en plural' };
    return { nivel: 'ok', msg: 'Bien' };
  }

  function rutaDe(e) {
    const rec = (S.recursos[e.r] || '').trim();
    if (!rec) return null;
    return '/v1/' + rec + (e.id ? '/{id}' : '') + (e.sub ? '/' + e.sub.trim() : '');
  }

  function codigosDe(e) {
    const sinId = !e.id;
    if (e.m === 'GET') return sinId ? [200] : [200, 404];
    if (e.m === 'POST') return sinId ? [201, 400] : ['405'];
    if (e.m === 'DELETE') return sinId ? ['405'] : [204, 404];
    return sinId ? ['405'] : [200, 404];   // PUT y PATCH
  }

  function avisoDe(e) {
    if (e.m === 'POST' && e.id) return 'POST va sobre la colección, no sobre un id. Quita el id.';
    if (['PUT', 'PATCH', 'DELETE'].includes(e.m) && !e.id) return `${e.m} necesita saber cuál elemento. Pon el id.`;
    if (e.sub && !e.id) return 'El subrecurso necesita el id del padre.';
    return null;
  }

  /* ---------- render ---------- */
  function render() {
    pintaPaso1(); pintaPaso2(); pintaPaso3(); pintaPaso4(); pintaHoja(); pintaAvance();
    persistir();
    if (window.iconos) iconos();
  }

  function pintaPaso1() {
    const sel = $('#arGiro');
    if (!sel.options.length) {
      GIRO_OPS.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; sel.appendChild(o); });
      sel.addEventListener('change', () => { S.giro = sel.value; render(); });
      $('#arGiroNombre').addEventListener('input', e => { S.giroNombre = e.target.value; pintaHoja(); pintaAvance(); persistir(); });
    }
    sel.value = S.giro;
    $('#arGiroNombre').classList.toggle('hidden', S.giro !== 'otro');
    $('#arGiroNombre').value = S.giroNombre;
  }

  function pintaPaso2() {
    const c = $('#arRecursos');
    if (c.dataset.listo) {
      $$('.ar-rec', c).forEach((fila, i) => {
        const chip = $('.ar-chip', fila), v = revisaRecurso(S.recursos[i]);
        chip.className = 'ar-chip ' + v.nivel;
        const ico = n => '<i data-lucide="' + n + '"></i> ';
        chip.innerHTML = v.nivel === 'ok' ? ico('check') : v.nivel === 'warn' ? ico('triangle-alert') + v.msg : v.nivel === 'err' ? ico('circle-x') + v.msg : (i < 2 ? 'obligatorio' : 'opcional');
        if (window.iconos) iconos();
      });
      return;
    }
    c.innerHTML = '';
    S.recursos.forEach((_, i) => {
      const fila = el('div', 'ar-rec', `<span class="ar-slash">/</span>`);
      const inp = el('input', ''); inp.type = 'text'; inp.value = S.recursos[i];
      inp.placeholder = i === 0 ? 'mascotas' : i === 1 ? 'citas' : 'tercero (opcional)';
      inp.autocapitalize = 'off'; inp.spellcheck = false;
      inp.addEventListener('input', e => { S.recursos[i] = e.target.value; render(); });
      fila.appendChild(inp);
      fila.appendChild(el('span', 'ar-chip', ''));
      c.appendChild(fila);
    });
    c.dataset.listo = '1';
    pintaPaso2();
  }

  function pintaPaso3() {
    const c = $('#arEps'); c.innerHTML = '';
    S.eps.forEach((e, i) => {
      const fila = el('div', 'ar-ep');
      const nm = el('span', 'ar-n', String(i + 1));

      const selM = el('select', 'ar-met');
      METS.forEach(m => { const o = el('option', '', m); o.value = m; selM.appendChild(o); });
      selM.value = e.m; selM.style.background = COLOR[e.m];
      selM.addEventListener('change', () => { e.m = selM.value; render(); });

      const selR = el('select', 'ar-recsel');
      S.recursos.forEach((r, k) => {
        if (!r.trim()) return;
        const o = el('option', '', '/' + r.trim()); o.value = k; selR.appendChild(o);
      });
      if (!selR.options.length) { const o = el('option', '', '(escribe un recurso arriba)'); selR.appendChild(o); selR.disabled = true; }
      selR.value = e.r; selR.addEventListener('change', () => { e.r = +selR.value; render(); });

      const bId = el('button', 'ar-id' + (e.id ? ' on' : ''), e.id ? '/{id}' : 'sin id');
      bId.addEventListener('click', () => { e.id = !e.id; render(); });

      const inSub = el('input', 'ar-sub'); inSub.type = 'text'; inSub.value = e.sub;
      inSub.placeholder = 'subrecurso'; inSub.autocapitalize = 'off'; inSub.spellcheck = false;
      inSub.addEventListener('input', ev => { e.sub = ev.target.value; render(); });

      fila.append(nm, selM, selR, bId, inSub);

      const ruta = rutaDe(e), aviso = avisoDe(e);
      const out = el('div', 'ar-ep-out' + (aviso ? ' mal' : ''));
      out.innerHTML = ruta
        ? `<code>${e.m} ${ruta}</code> <span class="ar-cods">${codigosDe(e).map(x => `<i>${x}</i>`).join('')}</span>` +
        (aviso ? `<div class="ar-aviso"><i data-lucide="triangle-alert"></i> ${aviso}</div>` : '')
        : '<span class="ph">Elige un recurso arriba.</span>';

      const caja = el('div', 'ar-ep-box');
      caja.append(fila, out);
      c.appendChild(caja);
    });
  }

  function pintaPaso4() {
    const ta = $('#arJson');
    if (!ta.dataset.listo) {
      ta.addEventListener('input', () => { S.json = ta.value; pintaHoja(); pintaAvance(); persistir(); });
      $('#arGenJson').addEventListener('click', () => {
        const rec = (S.recursos[0] || 'recurso').trim().replace(/s$/, '');
        S.json = JSON.stringify({ nombre: 'Ejemplo', [rec + 'Id']: 1, fecha: '2026-09-18', activo: true }, null, 2);
        ta.value = S.json; pintaHoja(); pintaAvance(); persistir();
        if (window.Sonido) Sonido.tic();
      });
      ta.dataset.listo = '1';
    }
    ta.value = S.json;
    let estado = '';
    if (S.json.trim()) {
      try { JSON.parse(S.json); estado = '<span class="ar-chip ok"><i data-lucide="circle-check"></i> JSON válido</span>'; }
      catch (err) { estado = '<span class="ar-chip err"><i data-lucide="circle-x"></i> Le falta algo: revisa comas y comillas</span>'; }
    }
    $('#arJsonEstado').innerHTML = estado;
  }

  /* ---------- la hoja final ---------- */
  function textoHoja() {
    const giro = S.giro === 'otro' ? (S.giroNombre || 'Mi giro') : (GIRO_OPS.find(g => g[0] === S.giro) || [, ''])[1];
    const recs = S.recursos.filter(r => r.trim()).map(r => '/' + r.trim());
    const L = [];
    L.push(`API DE ${giro.toUpperCase()}`);
    L.push('');
    L.push(`RECURSOS (${recs.length}): ${recs.join('   ')}`);
    L.push('');
    L.push('ENDPOINTS:');
    S.eps.forEach((e, i) => {
      const r = rutaDe(e);
      if (!r) { L.push(`  ${i + 1}. (sin definir)`); return; }
      L.push(`  ${i + 1}. ${e.m.padEnd(6)} ${r.padEnd(30)} -> ${codigosDe(e).join(', ')}`);
    });
    L.push('');
    if (S.json.trim()) { L.push('JSON DE EJEMPLO:'); S.json.split('\n').forEach(l => L.push('  ' + l)); L.push(''); }
    L.push('CODIGOS ESPERADOS:');
    L.push('  200 OK · 201 Created · 204 No Content');
    L.push('  400 Bad Request · 404 Not Found · 500 Internal Server Error');
    L.push('');
    L.push('ARQUITECTURA POR CAPAS:');
    L.push('  ' + CAPAS.join('  ->  '));
    L.push('  (y la respuesta regresa por el mismo camino)');
    return L.join('\n');
  }

  function pintaHoja() { $('#arHoja').textContent = textoHoja(); }

  function faltantes() {
    const f = [];
    if (S.giro === 'otro' && !S.giroNombre.trim()) f.push('ponerle nombre a tu giro');
    const recs = S.recursos.filter(r => r.trim());
    if (recs.length < 2) f.push('mínimo 2 recursos');
    if (recs.some(r => revisaRecurso(r).nivel === 'err')) f.push('arreglar los recursos marcados en rojo');
    if (S.eps.some(e => !rutaDe(e))) f.push('completar los 5 endpoints');
    if (S.eps.some(e => avisoDe(e))) f.push('arreglar los endpoints marcados en rojo');
    if (!S.json.trim()) f.push('el JSON de ejemplo');
    else { try { JSON.parse(S.json); } catch (e) { f.push('arreglar el JSON'); } }
    return f;
  }

  function pintaAvance() {
    const f = faltantes(), listo = f.length === 0;
    const c = $('#arAvance');
    c.className = 'ar-avance ' + (listo ? 'ok' : '');
    c.innerHTML = listo
      ? '<b><i data-lucide="circle-check"></i> Ya está completo.</b> Cópialo y pásalo a la libreta. No se te olvide <b>firmarlo</b>.'
      : '<b>Te falta:</b> ' + f.join(' · ');
    $('#arCopiar').disabled = false;
  }

  /* ---------- arranque ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (!$('#armar')) return;
    render();

    $('#arCopiar').addEventListener('click', async () => {
      const t = textoHoja();
      try {
        if (navigator.share) { await navigator.share({ title: 'Mi diseño de API', text: t }); }
        else { await navigator.clipboard.writeText(t); }
        $('#arCopiar').innerHTML = '<i data-lucide="check"></i> Listo';
      } catch (e) {
        try { await navigator.clipboard.writeText(t); $('#arCopiar').innerHTML = '<i data-lucide="check"></i> Copiado'; }
        catch (e2) { $('#arCopiar').textContent = 'Selecciónalo a mano'; }
      }
      if (window.Sonido) Sonido.bien();
      setTimeout(() => $('#arCopiar').textContent = 'Copiar mi hoja', 1900);
    });

    $('#arReset').addEventListener('click', () => {
      S = vacio();
      $('#arRecursos').dataset.listo = '';
      $('#arJson').value = '';
      render();
    });
  });
})();
