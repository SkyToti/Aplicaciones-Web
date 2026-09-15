/* ============================================================
   Estructura de Datos — COMPONENTES
   Los bloques interactivos del tema de recursividad. Igual que en
   secciones.js, ninguno sabe en qué página vive: initSeccionesEd()
   arranca solo los que encuentra en el HTML.
   ============================================================ */

/* Un sonido nunca debe poder tumbar un juego (ver examen.js). */
const sonarEd = fn => { try { if (window.Sonido && typeof Sonido[fn] === 'function') Sonido[fn](); } catch (e) { } };

/* Código con número de renglón. marcar: renglones (desde 1) a resaltar. */
function codigoConLineas(src, marcar = [], clase = '') {
  return `<pre class="codigo ${clase}"><code>${src.split('\n').map((l, i) =>
    `<span class="ln${marcar.includes(i + 1) ? ' on' : ''}" data-n="${i + 1}">${resaltarJava(l) || ' '}</span>`).join('')}</code></pre>`;
}

/* «Paso 7 de 13», que en el celular se lee «7/13» para que los botones quepan en un renglón */
const contadorPaso = (i, n) => `<span class="t">Paso </span>${i}<span class="t"> de </span><span class="c">/</span>${n}`;

async function copiarTexto(texto, boton, etiqueta) {
  try { await navigator.clipboard.writeText(texto); boton.innerHTML = '<i data-lucide="check"></i> Copiado'; }
  catch (e) { boton.textContent = 'Selecciónalo a mano'; }
  setTimeout(() => { boton.innerHTML = etiqueta; }, 1800);
}

/* ============================================================
   JAVA DESDE CERO
   ============================================================ */

/* «Toca cada pieza» del código */
function renderAnatomia(cont) {
  const datos = ED_ANATOMIAS[cont.dataset.anatomia];
  const out = document.getElementById(cont.id + 'Out');
  if (!datos || !out) return;
  // Cada pieza se colorea sola, así que un nombre de método no «ve» su paréntesis
  // si está en la pieza siguiente: se le presta el ( y luego se quita.
  const color = (t, sig) => sig && sig[0] === '(' ? resaltarJava(t + '(').slice(0, -1) : resaltarJava(t);
  cont.innerHTML = `
    <pre class="anat-code"><code>${datos.lineas.map(l => l.map(([t, k], j) => {
      const html = color(t, (l[j + 1] || [])[0]);
      return k == null ? html : `<span class="a-part" data-k="${k}" role="button" tabindex="0">${html}</span>`;
    }).join('')).join('\n')}</code></pre>
    <div class="anat-chips">${datos.partes.map((p, k) => `<button class="anat-chip" data-k="${k}">${p.n}</button>`).join('')}</div>`;
  const elegir = k => {
    $$('.a-part', cont).forEach(x => x.classList.toggle('on', +x.dataset.k === k));
    $$('.anat-chip', cont).forEach(x => x.classList.toggle('on', +x.dataset.k === k));
    out.innerHTML = `<h4>${datos.partes[k].n}</h4><p>${datos.partes[k].d}</p>`;
    sonarEd('tic');
  };
  $$('.a-part, .anat-chip', cont).forEach(x => {
    x.addEventListener('click', () => elegir(+x.dataset.k));
    x.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(+x.dataset.k); } });
  });
}

function renderTiposDato() {
  $('#tiposDato').innerHTML = '<thead><tr><th>Tipo</th><th>Guarda</th><th>Ejemplo</th><th>Lo que hay que saber</th></tr></thead><tbody>' +
    ED_TIPOS_DATO.map(t => `<tr><td><code class="tipo-n">${t.t}</code></td><td><b>${t.que}</b></td><td class="tipo-ej"><code>${resaltarJava(t.ej)}</code></td><td>${t.nota}</td></tr>`).join('') +
    '</tbody>';
}

/* La división de la primaria: cociente y residuo, con las reglas de Java */
function initCalcDiv() {
  const c = $('#calcDiv');
  c.innerHTML = `
    <div class="calc-fila">
      <label>a <input type="number" id="calcA" value="17" inputmode="numeric" step="1"></label>
      <label>b <input type="number" id="calcB" value="5" inputmode="numeric" step="1"></label>
    </div>
    <div class="calc-res">
      <div class="calc-op tono-am"><code>a / b</code><b id="calcCoc"></b><small>cociente: cuántas veces cabe b en a</small></div>
      <div class="calc-op tono-mo"><code>a % b</code><b id="calcRes"></b><small>residuo: lo que sobra</small></div>
    </div>
    <p class="calc-exp" id="calcExp"></p>
    <div class="val-ex">
      <span class="lead">Prueba con:</span>
      <button class="tagbtn calc-ej" data-a="4096" data-b="10">4096 y 10</button>
      <button class="tagbtn calc-ej" data-a="8" data-b="2">8 y 2</button>
      <button class="tagbtn calc-ej" data-a="3" data-b="5">3 y 5</button>
      <button class="tagbtn calc-ej" data-a="10" data-b="0">10 y 0</button>
    </div>`;
  const A = $('#calcA'), B = $('#calcB');
  // Number y no parseInt: parseInt leía «1e3» como 1 y «3.5» como 3 sin decir nada
  const leer = inp => inp.value.trim() === '' ? NaN : Number(inp.value);
  const esInt = v => Number.isInteger(v) && v >= -2147483648 && v <= 2147483647;
  const pinta = () => {
    const a = leer(A), b = leer(B);
    const coc = $('#calcCoc'), res = $('#calcRes'), exp = $('#calcExp');
    if (!Number.isInteger(a) || !Number.isInteger(b)) { coc.textContent = res.textContent = '–'; exp.textContent = 'Escribe dos números enteros, sin decimales.'; return; }
    if (!esInt(a) || !esInt(b)) { coc.textContent = res.textContent = '–'; exp.innerHTML = 'Ese número ya no cabe en un <code>int</code>, que va de −2,147,483,648 a 2,147,483,647.'; return; }
    if (b === 0) {
      coc.textContent = res.textContent = '💥';
      exp.innerHTML = 'Entre 0 no se puede dividir: al ejecutarse, Java truena con <code>ArithmeticException: / by zero</code>.';
      return;
    }
    // el único cociente de int que se sale del rango: Java «da la vuelta»
    const q = a === -2147483648 && b === -1 ? -2147483648 : Math.trunc(a / b), r = a % b;
    coc.textContent = q; res.textContent = r;
    let pista = '';
    if (b === 10 && a >= 10) pista = `Con 10 es el truco de los dígitos: <code>% 10</code> te da el <b>último dígito</b> (${r}) y <code>/ 10</code> te deja el número <b>sin él</b> (${q}).`;
    else if (b === 2) pista = `Con 2: si el residuo es 0 el número es <b>par</b>, si es 1 (o −1) es impar. ${a} es ${r === 0 ? 'par' : 'impar'}.`;
    else if (a < 0 || b < 0) pista = 'Con negativos, Java corta hacia el 0 y el residuo lleva el signo de <code>a</code>.';
    else if (a < b) pista = `Como ${a} es más chico que ${b}, cabe 0 veces y sobra todo.`;
    exp.innerHTML = `<b>${a} = ${b} × ${q} + ${r}</b>${pista ? '<br>' + pista : ''}`;
  };
  [A, B].forEach(i => i.addEventListener('input', pinta));
  $$('.calc-ej', c).forEach(b => b.addEventListener('click', () => { A.value = b.dataset.a; B.value = b.dataset.b; pinta(); sonarEd('tic'); }));
  pinta();
}

/* Laboratorio de String: length, charAt y substring sobre la palabra que escribas */
function initStrLab() {
  const c = $('#strLab');
  c.innerHTML = `
    <div class="str-ctrl">
      <label><code>String s =</code> <input type="text" id="strS" value="hola" maxlength="12" autocapitalize="off" autocomplete="off" spellcheck="false"></label>
      <label><code>int i =</code> <input type="number" id="strI" value="1" inputmode="numeric" step="1"></label>
    </div>
    <div class="str-cajas" id="strCajas"></div>
    <div class="str-res" id="strRes"></div>`;
  let activa = 1;
  const S = $('#strS'), I = $('#strI');
  const FUERA = 'StringIndexOutOfBoundsException';
  const exprs = [
    { e: 's.length()', d: 'Cuántos caracteres tiene. Las posiciones válidas van de 0 a <code>length() - 1</code>.', f: s => ({ v: String(s.length), m: [] }) },
    { e: 's.charAt(i)', d: 'El carácter de la posición i. Es un <code>char</code>: va entre comillas simples.', f: (s, i) => i >= 0 && i < s.length ? { v: `'${s[i]}'`, m: [i] } : { err: true } },
    { e: 's.substring(i)', d: 'Desde la posición i <b>hasta el final</b>. Con i = 1 quita la primera letra; con i = 0 es la cadena completa.', f: (s, i) => i >= 0 && i <= s.length ? { v: `"${s.slice(i)}"`, m: range(i, s.length) } : { err: true } },
    { e: 's.substring(1, s.length() - 1)', d: 'Desde la 1 hasta <b>antes</b> de la última: quita la primera y la última letra. El segundo número no se incluye.', f: s => s.length >= 2 ? { v: `"${s.slice(1, -1)}"`, m: range(1, s.length - 1) } : { err: true } },
    { e: 's.charAt(s.length() - 1)', d: 'La última letra: su posición es uno menos que el largo.', f: s => s.length ? { v: `'${s[s.length - 1]}'`, m: [s.length - 1] } : { err: true } }
  ];
  function range(a, b) { const r = []; for (let k = a; k < b; k++) r.push(k); return r; }
  const pinta = () => {
    const s = S.value, i = parseInt(I.value, 10) || 0;
    const res = exprs.map(x => x.f(s, i));
    const marcas = (res[activa] && res[activa].m) || [];
    $('#strCajas').innerHTML = s.length
      ? s.split('').map((ch, k) => `<span class="arr-c${marcas.includes(k) ? ' on' : ''}${k === i ? ' es-i' : ''}"><b>${ch === ' ' ? '␣' : escHtml(ch)}</b><small>${k}</small></span>`).join('')
      : '<span class="ph">La cadena vacía, <code>""</code>: tiene 0 caracteres.</span>';
    $('#strRes').innerHTML = exprs.map((x, k) => `
      <button class="str-r${k === activa ? ' on' : ''}${res[k].err ? ' err' : ''}" data-k="${k}" aria-pressed="${k === activa}">
        <code class="str-e">${resaltarJava(x.e)}</code>
        <b class="str-v">${res[k].err ? FUERA : escHtml(res[k].v)}</b>
        <span class="str-d">${res[k].err ? 'Esa posición no existe en esta cadena, y al ejecutar Java truena.' : x.d}</span>
      </button>`).join('');
    $$('.str-r', c).forEach(b => b.addEventListener('click', () => {
      activa = +b.dataset.k; pinta(); sonarEd('tic');
      // se repintó el botón: el foco regresa al nuevo, o con el teclado se perdería
      const nuevo = $(`.str-r[data-k="${activa}"]`, c); if (nuevo) nuevo.focus();
    }));
  };
  [S, I].forEach(x => x.addEventListener('input', pinta));
  pinta();
}

function renderJavaCheck() {
  const done = store.get('ed_java_chk', []);
  const g = $('#javaCheck'); g.innerHTML = '';
  ED_JAVA_CHECK.forEach((t, i) => {
    const n = el('div', 'chk' + (done.includes(i) ? ' done' : ''), `<div class="chk-b"><i data-lucide="check"></i></div><div class="chk-t">${t}</div>`);
    n.addEventListener('click', () => {
      const d = store.get('ed_java_chk', []); const k = d.indexOf(i);
      if (k > -1) d.splice(k, 1); else d.push(i);
      store.set('ed_java_chk', d);
      if (d.length === ED_JAVA_CHECK.length) sonarEd('fanfarria'); else sonarEd('tic');
      renderJavaCheck(); progreso();
    });
    g.appendChild(n);
  });
  const m = $('#javaCheckMsg');
  if (m) m.innerHTML = done.length === ED_JAVA_CHECK.length
    ? '<i data-lucide="sparkles"></i> Todo palomeado. Ya tienes el Java que necesitas: sigue con <a href="recursividad.html">¿Qué es la recursividad?</a>'
    : `${done.length} de ${ED_JAVA_CHECK.length} palomeados`;
}

/* ============================================================
   VISUALIZADOR DE LA PILA DE LLAMADAS
   Cada traza corre la misma lógica que el código Java y va tomando
   «fotos»: qué renglón se ejecuta, qué marcos hay en la pila y qué se
   ha impreso. El visualizador solo pasa de una foto a otra.
   ============================================================ */
const DESBORDE = { desborde: true };

function nuevaTraza() {
  const T = { pasos: [], pila: [], salida: [], id: 0 };
  T.marco = (m, args) => { const f = { id: ++T.id, m, args, nota: '', estado: '' }; T.pila.push(f); return f; };
  T.foto = (linea, msg, fase) => T.pasos.push({ linea, msg, fase, salida: T.salida.slice(), pila: T.pila.map(f => ({ ...f })) });
  T.sacar = () => T.pila.pop();
  return T;
}

const VIS_LLAMADA = {
  cuenta: n => `cuentaRegresiva(${n})`, idaVuelta: n => `idaYVuelta(${n})`, suma: n => `suma(${n})`,
  factorial: n => `factorial(${n})`, potencia: n => `potencia(2, ${n})`, fibonacci: n => `fibonacci(${n})`,
  invertir: s => `invertir("${s}")`, sinBase: n => `suma(${n})`
};

const VIS_TRAZAS = {
  llamadas(T) {
    const main = T.marco('main', '');
    T.foto('m1', 'El programa empieza en <code>main</code>. Por ahora es la única tarjeta: la única llamada en curso.', 'inicio');
    main.nota = 'espera a cuadruple(5)'; main.estado = 'espera';
    T.foto('m2', 'Para imprimir, primero necesita saber cuánto vale <code>cuadruple(5)</code>. <code>main</code> se queda <b>en pausa</b> en este renglón y llama.', 'ida');
    const c = T.marco('cuadruple', 'x = 5');
    T.foto('c1', 'Entra <b>cuadruple</b>. Su tarjeta se pone encima de la de main, con su propia variable <code>x = 5</code>.', 'ida');
    c.nota = 'espera a doble(5)'; c.estado = 'espera';
    T.foto('c2', 'Necesita <code>doble(x)</code>, o sea <code>doble(5)</code>. Ahora <b>cuadruple</b> también se pausa.', 'ida');
    const d1 = T.marco('doble', 'x = 5');
    T.foto('d1', 'Entra <b>doble</b> con <b>su propia</b> <code>x = 5</code>. Ya van tres tarjetas, y solo trabaja la de arriba.', 'ida');
    d1.nota = 'devuelve 10'; d1.estado = 'devuelve';
    T.foto('d2', '<code>return x * 2;</code> devuelve <b>10</b>. doble terminó, así que su tarjeta se va.', 'vuelta');
    T.sacar();
    c.args = 'x = 5 · d = 10'; c.nota = 'recibió 10'; c.estado = '';
    T.foto('c2', 'cuadruple sigue <b>justo donde se quedó</b>: guarda el 10 en su variable <code>d</code>.', 'vuelta');
    c.nota = 'espera a doble(10)'; c.estado = 'espera';
    T.foto('c3', 'Ahora llama a <code>doble(d)</code>, o sea <code>doble(10)</code>, y se vuelve a pausar.', 'ida');
    const d2 = T.marco('doble', 'x = 10');
    T.foto('d1', 'Entra <b>otra</b> llamada a doble, ahora con <code>x = 10</code>. Es una tarjeta nueva: la de antes ya no existe.', 'ida');
    d2.nota = 'devuelve 20'; d2.estado = 'devuelve';
    T.foto('d2', 'Devuelve <b>20</b> y se va.', 'vuelta');
    T.sacar();
    c.nota = 'devuelve 20'; c.estado = 'devuelve';
    T.foto('c3', 'cuadruple recibe el 20 y lo devuelve con su <code>return</code>. Su tarjeta también se va.', 'vuelta');
    T.sacar();
    main.nota = 'imprime 20'; main.estado = 'devuelve';
    T.salida.push('20');
    T.foto('m2', '<code>main</code> por fin continúa: <code>cuadruple(5)</code> valió 20, así que imprime <b>20</b>.', 'fin');
    T.sacar();
    T.foto('m3', 'main llega a su llave de cierre, su tarjeta se va y la pila queda vacía: fin del programa.', 'fin');
  },

  cuenta(T, n) {
    const f = T.marco('cuentaRegresiva', `n = ${n}`);
    T.foto('firma', `Entra <b>cuentaRegresiva(${n})</b>. Java apila su marco, con su propia <code>n = ${n}</code>.`, 'ida');
    if (n === 0) {
      f.estado = 'base';
      T.foto('if', '¿<code>n == 0</code>? n vale 0: <b>sí</b>. Llegamos al caso base.', 'base');
      T.salida.push('¡Despegue!'); f.nota = 'imprimió ¡Despegue!';
      T.foto('base', 'Imprime «¡Despegue!».', 'base');
      T.foto('baseRet', '<code>return;</code> sale del método sin devolver nada (es <code>void</code>). Su marco se quita y empieza la vuelta.', 'base');
      T.sacar(); return;
    }
    T.foto('if', `¿<code>n == 0</code>? n vale ${n}: <b>no</b>. Sigue de largo.`, 'ida');
    T.salida.push(String(n));
    T.foto('imp', `Imprime <b>${n}</b>. Fíjate: esto pasa <b>antes</b> de la llamada, en la ida.`, 'ida');
    f.nota = `espera a cuentaRegresiva(${n - 1})`; f.estado = 'espera';
    T.foto('rec', `Llama a <code>cuentaRegresiva(${n - 1})</code> y se queda esperando a que termine.`, 'ida');
    VIS_TRAZAS.cuenta(T, n - 1);
    f.nota = 'ya no le queda nada'; f.estado = 'devuelve';
    T.foto('fin', `Regresó cuentaRegresiva(${n - 1}). Después de la llamada ya no hay nada más: cuentaRegresiva(${n}) termina y se quita.`, 'vuelta');
    T.sacar();
  },

  idaVuelta(T, n) {
    const f = T.marco('idaYVuelta', `n = ${n}`);
    T.foto('firma', `Entra <b>idaYVuelta(${n})</b>, con <code>n = ${n}</code>.`, 'ida');
    if (n === 0) {
      f.estado = 'base'; f.nota = 'caso base';
      T.foto('if', '¿<code>n == 0</code>? <b>Sí</b>: caso base.', 'base');
      T.foto('base', '<code>return;</code> sin imprimir nada. Aquí da la vuelta: de ahora en adelante todo es de regreso.', 'base');
      T.sacar(); return;
    }
    T.foto('if', `¿<code>n == 0</code>? n vale ${n}: no.`, 'ida');
    T.salida.push('ida ' + n);
    T.foto('ida', `Imprime <b>ida ${n}</b>, <b>antes</b> de llamar.`, 'ida');
    f.nota = `espera a idaYVuelta(${n - 1})`; f.estado = 'espera';
    T.foto('rec', `Llama a <code>idaYVuelta(${n - 1})</code>. El renglón de «vuelta» se queda pendiente.`, 'ida');
    VIS_TRAZAS.idaVuelta(T, n - 1);
    f.nota = 'termina lo pendiente'; f.estado = 'devuelve';
    T.salida.push('vuelta ' + n);
    T.foto('vuelta', `Regresó la llamada, así que por fin ejecuta lo pendiente: imprime <b>vuelta ${n}</b>. Las vueltas salen en orden inverso al de las idas.`, 'vuelta');
    T.sacar();
  },

  suma(T, n) {
    const f = T.marco('suma', `n = ${n}`);
    T.foto('firma', `Entra <b>suma(${n})</b>, con su propia <code>n = ${n}</code>.`, 'ida');
    if (n === 0) {
      f.estado = 'base';
      T.foto('if', '¿<code>n == 0</code>? n vale 0: <b>sí</b>. Caso base.', 'base');
      f.nota = 'devuelve 0';
      T.foto('base', 'Devuelve <b>0</b> sin llamar a nadie. Empieza la vuelta.', 'base');
      T.sacar(); return 0;
    }
    T.foto('if', `¿<code>n == 0</code>? n vale ${n}: <b>no</b>.`, 'ida');
    f.nota = `${n} + espera a suma(${n - 1})`; f.estado = 'espera';
    T.foto('rec', `Para calcular <code>${n} + suma(${n - 1})</code> primero necesita saber cuánto vale suma(${n - 1}). La suma queda <b>en pausa</b> y llama.`, 'ida');
    const r = VIS_TRAZAS.suma(T, n - 1);
    f.nota = `${n} + ${r} = ${n + r}`; f.estado = 'devuelve';
    T.foto('rec', `Regresó suma(${n - 1}) con <b>${r}</b>. Termina la suma pendiente: ${n} + ${r} = <b>${n + r}</b>, y lo devuelve.`, 'vuelta');
    T.sacar(); return n + r;
  },

  factorial(T, n) {
    const f = T.marco('factorial', `n = ${n}`);
    T.foto('firma', `Entra <b>factorial(${n})</b>. Java apila su marco, con su propia <code>n = ${n}</code>.`, 'ida');
    if (n === 0) {
      f.estado = 'base';
      T.foto('if', '¿<code>n == 0</code>? n vale 0: <b>sí</b>. Llegamos al caso base.', 'base');
      f.nota = 'devuelve 1';
      T.foto('base', 'Caso base: devuelve <b>1</b> sin llamar a nadie. Aquí empieza la vuelta.', 'base');
      T.sacar(); return 1;
    }
    T.foto('if', `¿<code>n == 0</code>? n vale ${n}: <b>no</b>. Todavía no es el caso base.`, 'ida');
    f.nota = `${n} × espera a factorial(${n - 1})`; f.estado = 'espera';
    T.foto('rec', `Para calcular <code>${n} * factorial(${n - 1})</code> primero necesita saber cuánto vale factorial(${n - 1}). La multiplicación queda <b>en pausa</b> y llama.`, 'ida');
    const r = VIS_TRAZAS.factorial(T, n - 1);
    f.nota = `${n} × ${r} = ${n * r}`; f.estado = 'devuelve';
    T.foto('rec', `Regresó factorial(${n - 1}) con <b>${r}</b>. Termina la multiplicación pendiente: ${n} × ${r} = <b>${n * r}</b>, y lo devuelve.`, 'vuelta');
    T.sacar(); return n * r;
  },

  potencia(T, e) {
    const f = T.marco('potencia', `base = 2 · exp = ${e}`);
    T.foto('firma', `Entra <b>potencia(2, ${e})</b>. La base siempre es 2; lo que cambia es <code>exp</code>.`, 'ida');
    if (e === 0) {
      f.estado = 'base';
      T.foto('if', '¿<code>exp == 0</code>? <b>Sí</b>: caso base.', 'base');
      f.nota = 'devuelve 1';
      T.foto('base', 'Todo número elevado a la 0 vale 1: devuelve <b>1</b>.', 'base');
      T.sacar(); return 1;
    }
    T.foto('if', `¿<code>exp == 0</code>? exp vale ${e}: no.`, 'ida');
    f.nota = `2 × espera a potencia(2, ${e - 1})`; f.estado = 'espera';
    T.foto('rec', `Necesita <code>potencia(2, ${e - 1})</code>: la misma base, un exponente menos. La multiplicación espera.`, 'ida');
    const r = VIS_TRAZAS.potencia(T, e - 1);
    f.nota = `2 × ${r} = ${2 * r}`; f.estado = 'devuelve';
    T.foto('rec', `Regresó con <b>${r}</b>: 2 × ${r} = <b>${2 * r}</b>.`, 'vuelta');
    T.sacar(); return 2 * r;
  },

  fibonacci(T, n) {
    const f = T.marco('fibonacci', `n = ${n}`);
    T.foto('firma', `Entra <b>fibonacci(${n})</b>.`, 'ida');
    if (n <= 1) {
      f.estado = 'base';
      T.foto('if', `¿<code>n &lt;= 1</code>? n vale ${n}: <b>sí</b>. Caso base.`, 'base');
      f.nota = `devuelve ${n}`;
      T.foto('base', `Devuelve <b>${n}</b>, que es lo que vale n.`, 'base');
      T.sacar(); return n;
    }
    T.foto('if', `¿<code>n &lt;= 1</code>? n vale ${n}: no.`, 'ida');
    f.nota = `espera a fibonacci(${n - 1})`; f.estado = 'espera';
    T.foto('rec', `Hay <b>dos</b> llamadas. Primero resuelve <b>completa</b> fibonacci(${n - 1}); la suma y la segunda llamada esperan.`, 'ida');
    const a = VIS_TRAZAS.fibonacci(T, n - 1);
    f.nota = `tiene ${a} · espera a fibonacci(${n - 2})`; f.estado = 'espera';
    T.foto('rec', `Ya tiene fibonacci(${n - 1}) = <b>${a}</b>. Ahora hace la <b>segunda</b> llamada: fibonacci(${n - 2}).`, 'ida');
    const b = VIS_TRAZAS.fibonacci(T, n - 2);
    f.nota = `${a} + ${b} = ${a + b}`; f.estado = 'devuelve';
    T.foto('rec', `Ya tiene las dos: ${a} + ${b} = <b>${a + b}</b>. Lo devuelve.`, 'vuelta');
    T.sacar(); return a + b;
  },

  invertir(T, s) {
    const f = T.marco('invertir', `s = "${s}"`);
    T.foto('firma', `Entra <b>invertir("${s}")</b>.`, 'ida');
    if (s.length <= 1) {
      f.estado = 'base';
      T.foto('if', `¿<code>s.length() &lt;= 1</code>? "${s}" tiene ${s.length} letra: <b>sí</b>. Caso base.`, 'base');
      f.nota = `devuelve "${s}"`;
      T.foto('base', `Una sola letra ya está invertida: devuelve <b>"${s}"</b> tal cual.`, 'base');
      T.sacar(); return s;
    }
    T.foto('if', `¿<code>s.length() &lt;= 1</code>? "${s}" tiene ${s.length} letras: no.`, 'ida');
    f.nota = `espera a invertir("${s.slice(1)}") · luego + '${s[0]}'`; f.estado = 'espera';
    T.foto('rec', `<code>s.substring(1)</code> es "${s.slice(1)}" y <code>s.charAt(0)</code> es '${s[0]}'. Llama a invertir("${s.slice(1)}"); la '${s[0]}' espera para pegarse al final.`, 'ida');
    const r = VIS_TRAZAS.invertir(T, s.slice(1));
    f.nota = `"${r}" + '${s[0]}' = "${r + s[0]}"`; f.estado = 'devuelve';
    T.foto('rec', `Regresó <b>"${r}"</b>. Le pega la '${s[0]}' al final: <b>"${r + s[0]}"</b>.`, 'vuelta');
    T.sacar(); return r + s[0];
  },

  sinBase(T, n, prof = 1) {
    const f = T.marco('suma', `n = ${n}`);
    if (prof > 7) {
      f.estado = 'error'; f.nota = '…y miles más encima';
      T.foto('rec', `…y así sigue: suma(${n - 1}), suma(${n - 2}), suma(${n - 3})… Nada la detiene. Cada llamada apila un marco más y ninguno se quita.`, 'error');
      T.salida.push('Exception in thread "main" java.lang.StackOverflowError');
      T.foto(null, '<b>StackOverflowError.</b> Tras miles de llamadas pendientes la pila se llenó, y Java detuvo el programa. Nunca se devolvió nada: falta el caso base.', 'error');
      throw DESBORDE;
    }
    T.foto('firma', `Entra <b>suma(${n})</b>, con <code>n = ${n}</code>.`, 'ida');
    f.nota = `${n} + espera a suma(${n - 1})`; f.estado = 'espera';
    T.foto('rec', prof === 1
      ? `No hay ningún <code>if</code> que pregunte si ya terminamos: llama directo a suma(${n - 1}).`
      : `Otra vez, sin revisar nada, llama a suma(${n - 1})${n - 1 < 0 ? '. Ya van números negativos y nada la detiene' : ''}.`, 'ida');
    VIS_TRAZAS.sinBase(T, n - 1, prof + 1);
  }
};

function trazar(id, entrada) {
  const T = nuevaTraza();
  if (id === 'llamadas') { VIS_TRAZAS.llamadas(T); return T; }
  const llamada = VIS_LLAMADA[id](entrada);
  const esVoid = /\bvoid\b/.test(ED_VISUAL[id].lineas[0][1]);
  const main = T.marco('main', '');
  main.nota = `espera a ${llamada}`; main.estado = 'espera';
  T.foto(null, `El programa empieza en <code>main</code>, que llama a <b>${llamada}</b> y se queda esperando.`, 'inicio');
  try {
    const r = VIS_TRAZAS[id](T, entrada);
    main.estado = 'devuelve';
    if (esVoid) { main.nota = 'terminó'; T.foto(null, `Terminó ${llamada} y regresamos a <code>main</code>, que ya no tiene nada más que hacer. Fin del programa.`, 'fin'); }
    else {
      const txt = typeof r === 'string' ? r : String(r);
      T.salida.push(txt); main.nota = `imprime ${txt}`;
      T.foto(null, `${llamada} le devolvió <b>${typeof r === 'string' ? '"' + r + '"' : r}</b> a <code>main</code>, que lo imprime. La pila quedó como empezó: fin del programa.`, 'fin');
    }
  } catch (e) { if (e !== DESBORDE) throw e; }
  return T;
}

function initVisual(cont) {
  const ids = cont.dataset.programas.split(',').filter(id => ED_VISUAL[id]);
  if (!ids.length) return;
  const q = new URLSearchParams(location.search);
  let id = ids.includes(q.get('ver')) ? q.get('ver') : ids[0];
  let entrada = null, T = null, paso = 0, reloj = null, prevIds = [];
  const cuentaAvance = cont.id === 'visual';     // solo el de la página de la pila cuenta para el avance

  const FASES = { inicio: 'Inicio', ida: 'Ida: llamando', base: 'Caso base', vuelta: 'Vuelta: regresando', fin: 'Fin', error: 'Error' };

  cont.innerHTML = `
    ${ids.length > 1 ? `<div class="vis-progs" role="tablist" aria-label="Programa">${ids.map(x => `<button class="fbtn vis-prog" role="tab" data-id="${x}">${ED_VISUAL[x].nombre}</button>`).join('')}</div>` : ''}
    <div class="vis-grid">
      <div class="vis-codigo">
        <div class="vis-h"><span>Código</span><label class="vis-ent"></label></div>
        <div class="vis-code"></div>
      </div>
      <div class="vis-pila-col">
        <div class="vis-h"><span>Llamadas en curso</span><span class="vis-cuenta"></span></div>
        <div class="vis-pila" aria-live="polite"></div>
      </div>
      <div class="vis-msg"><span class="vis-fase"></span><p class="vis-txt"></p></div>
      <div class="vis-ctrl">
        <button class="btn btn-ghost btn-s vis-reset" aria-label="Volver al inicio"><i data-lucide="rotate-ccw"></i></button>
        <button class="btn btn-ghost btn-s vis-ant" aria-label="Paso anterior"><i data-lucide="step-back"></i> <span class="t">Anterior</span></button>
        <span class="counter vis-paso"></span>
        <button class="btn btn-yellow btn-s vis-sig">Siguiente <i data-lucide="step-forward"></i></button>
        <button class="btn btn-ghost btn-s vis-play" aria-label="Reproducir"><i data-lucide="play"></i> <span class="t">Reproducir</span></button>
      </div>
      <div class="vis-consola">
        <div class="vis-h"><span>Consola</span></div>
        <pre class="consola vis-out"><code></code></pre>
      </div>
    </div>`;

  const detener = () => {
    if (reloj) clearInterval(reloj);
    reloj = null;
    const b = $('.vis-play', cont); b.innerHTML = '<i data-lucide="play"></i> <span class="t">Reproducir</span>';
  };

  function cargar(nuevoId, nuevaEntrada, desdeSelect) {
    detener();
    id = nuevoId;
    const P = ED_VISUAL[id];
    const ent = $('.vis-ent', cont);
    if (!P.entrada) { entrada = null; ent.innerHTML = ''; }
    else {
      const ops = P.entrada.opciones || Array.from({ length: P.entrada.max - P.entrada.min + 1 }, (_, k) => P.entrada.min + k);
      entrada = nuevaEntrada != null && ops.map(String).includes(String(nuevaEntrada)) ? (P.entrada.opciones ? String(nuevaEntrada) : +nuevaEntrada) : P.entrada.def;
      // el select se arma solo al cambiar de programa: rehacerlo en cada cambio
      // de valor le quitaba el foco a quien lo mueve con las flechas
      if (!desdeSelect) {
        const etiqueta = id === 'invertir' ? 's' : id === 'potencia' ? 'exp' : 'n';
        ent.innerHTML = `<code>${etiqueta} =</code> <select>${ops.map(o => `<option value="${o}"${String(o) === String(entrada) ? ' selected' : ''}>${P.entrada.opciones ? '"' + o + '"' : o}</option>`).join('')}</select>`;
        $('select', ent).addEventListener('change', e => cargar(id, e.target.value, true));
      }
    }
    $$('.vis-prog', cont).forEach(b => { b.classList.toggle('on', b.dataset.id === id); b.setAttribute('aria-selected', b.dataset.id === id); });
    $('.vis-code', cont).innerHTML = `<pre class="codigo"><code>${P.lineas.map(([lbl, txt], k) =>
      `<span class="ln" data-l="${lbl}" data-n="${k + 1}">${resaltarJava(txt) || ' '}</span>`).join('')}</code></pre>`;
    T = trazar(id, entrada);
    paso = 0; prevIds = [];
    pintar();
  }

  function pintar() {
    const S = T.pasos[paso], ultimo = paso === T.pasos.length - 1;
    // renglón: el del marco de arriba (si es main en un programa de un solo método, no hay renglón que marcar)
    $$('.vis-code .ln', cont).forEach(l => l.classList.toggle('on', S.linea != null && l.dataset.l === S.linea));
    $$('.vis-code .ln', cont).forEach(l => l.classList.toggle('err', S.fase === 'error' && S.linea != null && l.dataset.l === S.linea));

    const pila = S.pila.slice().reverse();
    const ids2 = S.pila.map(f => f.id);
    $('.vis-pila', cont).innerHTML = (S.fase === 'error' ? '<div class="marco-mas">⋮ la pila sigue creciendo…</div>' : '') +
      (pila.length ? pila.map((f, k) => `
        <div class="marco${k === 0 ? ' arriba' : ''}${f.estado ? ' ' + f.estado : ''}${prevIds.includes(f.id) ? '' : ' nuevo'}${f.m === 'main' ? ' es-main' : ''}">
          <div class="marco-h"><b>${f.m}</b>${f.args ? `<code>${escHtml(f.args)}</code>` : ''}${k === 0 && S.fase !== 'error' && S.fase !== 'fin' ? '<span class="marco-tag">corriendo</span>' : ''}</div>
          ${f.nota ? `<div class="marco-nota">${escHtml(f.nota)}</div>` : ''}
        </div>`).join('') : '<div class="ph">La pila está vacía.</div>');
    prevIds = ids2;
    // en «Java desde cero» todavía no se explica qué es un marco: ahí son «tarjetas»
    const [uno, varios] = cont.dataset.unidad === 'tarjeta' ? [' tarjeta', ' tarjetas'] : [' marco', ' marcos'];
    $('.vis-cuenta', cont).textContent = S.pila.length + (S.pila.length === 1 ? uno : varios);

    const out = $('.vis-out code', cont);
    out.textContent = S.salida.length ? S.salida.join('\n') : ' ';
    out.parentElement.classList.toggle('con-error', S.fase === 'error');

    const msg = $('.vis-msg', cont);
    msg.className = 'vis-msg fase-' + S.fase;
    $('.vis-fase', cont).textContent = FASES[S.fase] || '';
    $('.vis-txt', cont).innerHTML = S.msg;
    $('.vis-paso', cont).innerHTML = contadorPaso(paso + 1, T.pasos.length);
    $('.vis-ant', cont).disabled = paso === 0;
    $('.vis-sig', cont).disabled = ultimo;
    if (ultimo) {
      detener();
      if (cuentaAvance && !store.get('ed_visual', false)) { store.set('ed_visual', true); progreso(); }
    }
  }

  const mover = d => {
    const n = Math.max(0, Math.min(T.pasos.length - 1, paso + d));
    if (n === paso) return;
    paso = n; sonarEd('tic'); pintar();
  };
  $('.vis-sig', cont).addEventListener('click', () => { detener(); mover(1); });
  $('.vis-ant', cont).addEventListener('click', () => { detener(); mover(-1); });
  $('.vis-reset', cont).addEventListener('click', () => { detener(); paso = 0; prevIds = []; pintar(); });
  $('.vis-play', cont).addEventListener('click', () => {
    if (reloj) return detener();
    if (paso === T.pasos.length - 1) { paso = 0; prevIds = []; pintar(); }
    $('.vis-play', cont).innerHTML = '<i data-lucide="pause"></i> <span class="t">Pausa</span>';
    reloj = setInterval(() => { if (paso < T.pasos.length - 1) mover(1); else detener(); }, 1400);
  });
  $$('.vis-prog', cont).forEach(b => b.addEventListener('click', () => { sonarEd('tic'); cargar(b.dataset.id); }));
  cont.addEventListener('keydown', e => {
    if (e.target.matches('select, input')) return;
    if (e.key === 'ArrowRight') { detener(); mover(1); }
    if (e.key === 'ArrowLeft') { detener(); mover(-1); }
  });
  cargar(id, q.get('n'));
}

/* ============================================================
   ¿QUÉ ES LA RECURSIVIDAD?
   ============================================================ */

/* La fila del cine */
function initFila() {
  const c = $('#fila');
  let paso = 0;
  const CODIGO = [
    '<b>¿En qué fila estoy?</b>',
    '   si no hay nadie adelante → respondo «1»',
    '   si no → le pregunto al de adelante y a su respuesta le sumo 1'
  ];
  c.innerHTML = `
    <div class="cine">
      <div class="cine-pantalla">Pantalla</div>
      <div class="cine-filas">${[1, 2, 3, 4, 5].map(f => `
        <div class="asiento" data-f="${f}">
          <span class="asiento-n">?</span>
          <span class="asiento-p"><i data-lucide="user-round"></i><small>${f === 5 ? 'tú' : 'fila ' + f}</small></span>
          <span class="burbuja"></span>
        </div>`).join('')}
      </div>
    </div>
    <div class="fila-lado">
      <div class="vis-ctrl">
        <button class="btn btn-ghost btn-s fila-reset" aria-label="Volver a empezar"><i data-lucide="rotate-ccw"></i></button>
        <button class="btn btn-ghost btn-s fila-ant" aria-label="Paso anterior"><i data-lucide="step-back"></i> <span class="t">Anterior</span></button>
        <span class="counter fila-paso"></span>
        <button class="btn btn-yellow btn-s fila-sig">Siguiente <i data-lucide="step-forward"></i></button>
      </div>
      <div class="vis-msg"><span class="vis-fase"></span><p class="vis-txt"></p></div>
      <pre class="fila-code"><code>${CODIGO.map((l, i) => `<span class="ln" data-i="${i}">${l}</span>`).join('')}</code></pre>
      <div class="fila-leyenda">
        <span><i class="lg-base"></i> caso base</span>
        <span><i class="lg-rec"></i> caso recursivo</span>
      </div>
    </div>`;
  const FASES = { inicio: 'La situación', ida: 'Ida: preguntando', base: 'Caso base', vuelta: 'Vuelta: respondiendo', fin: '¡Listo!' };

  function pintar() {
    const S = ED_FILA[paso];
    const conocidas = S.fase === 'base' || S.fase === 'vuelta' || S.fase === 'fin' ? S.quien : 0;
    $$('.asiento', c).forEach(a => {
      const f = +a.dataset.f;
      const habla = f === S.quien && S.burbuja;
      const esperando = S.fase === 'ida' ? f > S.quien : (S.fase === 'base' || S.fase === 'vuelta') ? f > S.quien : false;
      a.classList.toggle('habla', !!habla);
      a.classList.toggle('espera', esperando);
      a.classList.toggle('sabe', f <= conocidas);
      a.classList.toggle('base', S.fase === 'base' && f === 1);
      $('.asiento-n', a).textContent = f <= conocidas ? f : '?';
      const b = $('.burbuja', a);
      b.textContent = habla ? S.burbuja : esperando ? 'esperando…' : '';
      b.className = 'burbuja' + (habla ? ' on ' + S.fase : esperando ? ' mini' : '');
    });
    $$('.fila-code .ln', c).forEach(l => {
      const i = +l.dataset.i;
      l.classList.toggle('on', i === S.linea);
      l.classList.toggle('base', i === 1);
      l.classList.toggle('rec', i === 2);
    });
    $('.vis-msg', c).className = 'vis-msg fase-' + S.fase;
    $('.vis-fase', c).textContent = FASES[S.fase];
    $('.vis-txt', c).innerHTML = S.msg;
    $('.fila-paso', c).innerHTML = contadorPaso(paso + 1, ED_FILA.length);
    $('.fila-ant', c).disabled = paso === 0;
    $('.fila-sig', c).disabled = paso === ED_FILA.length - 1;
    if (paso === ED_FILA.length - 1 && !store.get('ed_fila', false)) { store.set('ed_fila', true); progreso(); sonarEd('fanfarria'); }
  }
  $('.fila-sig', c).addEventListener('click', () => { if (paso < ED_FILA.length - 1) { paso++; sonarEd('tic'); pintar(); } });
  $('.fila-ant', c).addEventListener('click', () => { if (paso > 0) { paso--; sonarEd('tic'); pintar(); } });
  $('.fila-reset', c).addEventListener('click', () => { paso = 0; pintar(); });
  pintar();
}

function renderReglasEd() {
  $('#reglasEd').innerHTML = ED_REGLAS.map(r => `<div class="rest-c${r.star ? ' star' : ''}">
    <div class="n2">${r.n}</div><h4>${r.t}${r.star ? ' <i data-lucide="star" class="ico-star"></i>' : ''}</h4><p>${r.d}</p><p class="say">${r.s}</p></div>`).join('');
}

/* Juego: ¿caso base o caso recursivo? */
function initClasifica() {
  const c = $('#clasif');
  const N = 8;
  let ronda = [], i = 0, aciertos = 0;
  const nueva = () => { ronda = shuffle(ED_CLASIFICA).slice(0, N); i = 0; aciertos = 0; pintar(); };
  function pintar() {
    if (i >= ronda.length) {
      const perfecto = aciertos === N;
      c.innerHTML = `
        <div class="cl-fin">
          <div class="q-score"><b>${aciertos}</b><span>/${N}</span></div>
          <h3>${perfecto ? '¡Perfecto! Ya los distingues sin pensar.' : aciertos >= 6 ? 'Muy bien. Uno o dos más y quedas.' : 'Todavía se confunden. La pista: ¿ese renglón vuelve a llamar al método?'}</h3>
          <button class="btn btn-yellow cl-otra"><i data-lucide="rotate-cw"></i> Otra ronda</button>
        </div>`;
      $('.cl-otra', c).addEventListener('click', () => { sonarEd('tic'); nueva(); });
      if (!store.get('ed_clasifica', false)) { store.set('ed_clasifica', true); progreso(); }
      sonarEd(perfecto ? 'fanfarria' : 'bien');
      return;
    }
    const it = ronda[i];
    c.innerHTML = `
      <div class="game-top">
        <span class="stat">Renglón <b>${i + 1}/${N}</b></span>
        <span class="stat">Aciertos <b>${aciertos}</b></span>
      </div>
      <pre class="codigo cl-code"><code>${resaltarJava(it.c)}</code></pre>
      <div class="cl-btns">
        <button class="qopt cl-op" data-r="base"><i data-lucide="octagon-x"></i> Caso base</button>
        <button class="qopt cl-op" data-r="rec"><i data-lucide="repeat"></i> Caso recursivo</button>
      </div>
      <div class="q-fb hidden"></div>
      <button class="btn btn-yellow hidden cl-sig">${i + 1 < N ? 'Siguiente' : 'Ver resultado'}</button>`;
    $$('.cl-op', c).forEach(b => b.addEventListener('click', () => {
      const ok = b.dataset.r === it.r;
      if (ok) aciertos++;
      $$('.cl-op', c).forEach(x => { x.disabled = true; if (x.dataset.r === it.r) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      const fb = $('.q-fb', c);
      fb.className = 'q-fb ' + (ok ? 'ok' : 'no');
      fb.innerHTML = (ok ? '<i data-lucide="circle-check"></i> <b>¡Eso!</b> ' : `<i data-lucide="circle-x"></i> <b>Es ${it.r === 'base' ? 'caso base' : 'caso recursivo'}.</b> `) + it.e;
      $('.cl-sig', c).classList.remove('hidden');
      sonarEd(ok ? 'bien' : 'mal');
    }));
    $('.cl-sig', c).addEventListener('click', () => { i++; pintar(); });
  }
  nueva();
}

function renderTiposRec() {
  $('#tiposRec').innerHTML = ED_TIPOS.map(t => `
    <div class="duel tipo-duel">
      <h4>${t.t}</h4>
      <div class="tipo-par">${t.r.map(x => `
        <div class="tipo">
          <b class="tipo-n">${x.n}</b>
          <p>${x.d}</p>
          <pre class="codigo"><code>${resaltarJava(x.code)}</code></pre>
        </div>`).join('')}
      </div>
    </div>`).join('');
}

/* ============================================================
   LA PILA DE LLAMADAS
   ============================================================ */

/* La pila de platos: push, pop y peek */
function initPlatos() {
  const c = $('#platos');
  const MAX = 6;
  let pila = [1, 2], sig = 3;
  c.innerHTML = `
    <div class="platos-demo">
      <div class="platos-pila" aria-live="polite"></div>
      <div class="platos-lado">
        <div class="platos-btns">
          <button class="btn btn-yellow btn-s pl-push"><i data-lucide="arrow-down"></i> Apilar <code>push</code></button>
          <button class="btn btn-ghost btn-s pl-pop"><i data-lucide="arrow-up"></i> Desapilar <code>pop</code></button>
          <button class="btn btn-ghost btn-s pl-peek"><i data-lucide="eye"></i> Ver la cima <code>peek</code></button>
        </div>
        <div class="platos-log"></div>
      </div>
    </div>`;
  const TONOS = ['az', 've', 'am', 'mo', 'ro', 'rs'];
  const pintar = (msg, animar) => {
    $('.platos-pila', c).innerHTML = pila.length
      ? pila.slice().reverse().map((p, k) => `<div class="plato tono-${TONOS[(p - 1) % TONOS.length]}${k === 0 ? ' cima' : ''}${k === 0 && animar === 'push' ? ' entra' : ''}${k === 0 && animar === 'peek' ? ' brilla' : ''}"><span>plato ${p}</span>${k === 0 ? '<small>cima</small>' : ''}</div>`).join('')
      : '<div class="ph">Vacía</div>';
    $('.platos-log', c).innerHTML = msg;
    $('.pl-pop', c).disabled = !pila.length;
    $('.pl-peek', c).disabled = !pila.length;
  };
  $('.pl-push', c).addEventListener('click', () => {
    if (pila.length >= MAX) { sonarEd('mal'); return pintar(`<b>Ya no cabe.</b> En este dibujo caben ${MAX} platos. Cuando la <b>pila de llamadas</b> de Java se llena así, el programa truena con <code>StackOverflowError</code>: lo vas a ver al final de esta página.`); }
    pila.push(sig); sonarEd('tic');
    pintar(`<code>push(${sig})</code>: el plato ${sig} entra <b>hasta arriba</b>. Es la nueva cima.`, 'push');
    sig++;
  });
  $('.pl-pop', c).addEventListener('click', () => {
    const p = pila.pop(); sonarEd('tic');
    pintar(pila.length
      ? `<code>pop()</code> sacó el plato ${p}: <b>el último que entró</b>. Ahora la cima es el plato ${pila[pila.length - 1]}.`
      : `<code>pop()</code> sacó el plato ${p}. La pila quedó <b>vacía</b>: un pop más ya no tendría qué sacar.`);
  });
  $('.pl-peek', c).addEventListener('click', () => {
    sonarEd('tic');
    pintar(`<code>peek()</code>: la cima es el plato ${pila[pila.length - 1]}. Solo se consulta, <b>no se quita</b>.`, 'peek');
  });
  pintar('Hay dos platos. Apila otro, o quita el de arriba. Solo se puede tocar la <b>cima</b>.');
}

/* Juego: completa el rastreo */
function initRastreo() {
  const c = $('#rastreoJuego');
  const TIPOS = [
    { id: 'suma', llamada: n => `suma(${n})`, paso: n => `${n} + suma(${n - 1})`, conValor: (n, v) => `${n} + ${v}`, base: 0, calc: (n, v) => n + v, codigo: 'if (n == 0) return 0;\nreturn n + suma(n - 1);' },
    { id: 'factorial', llamada: n => `factorial(${n})`, paso: n => `${n} * factorial(${n - 1})`, conValor: (n, v) => `${n} × ${v}`, base: 1, calc: (n, v) => n * v, codigo: 'if (n == 0) return 1;\nreturn n * factorial(n - 1);' },
    { id: 'potencia', llamada: n => `potencia(3, ${n})`, paso: n => `3 * potencia(3, ${n - 1})`, conValor: (n, v) => `3 × ${v}`, base: 1, calc: (n, v) => 3 * v, codigo: 'if (exp == 0) return 1;\nreturn base * potencia(base, exp - 1);' }
  ];
  // revelado: ya se vieron las respuestas de este ejercicio, así que no cuenta para el avance
  let T, N, valores, revelado = false;
  const nuevo = enfocar => {
    T = TIPOS[Math.floor(Math.random() * TIPOS.length)];
    N = 3 + Math.floor(Math.random() * 3);
    valores = [T.base];                                  // valores[k] = lo que devuelve la llamada con k
    for (let k = 1; k <= N; k++) valores[k] = T.calc(k, valores[k - 1]);
    revelado = false;
    pintar(enfocar);
  };
  function pintar(enfocar) {
    c.innerHTML = `
      <div class="game-top">
        <span class="stat">Calcula <b><code>${T.llamada(N)}</code></b></span>
        <button class="btn btn-ghost btn-s ra-otro"><i data-lucide="shuffle"></i> Otro ejercicio</button>
      </div>
      <pre class="codigo ra-code"><code>${resaltarJava(T.codigo)}</code></pre>
      <div class="ra-filas">${Array.from({ length: N + 1 }, (_, j) => {
        const k = N - j;
        return `<div class="ra-fila" data-k="${k}">
          <code class="ra-llamada">${T.llamada(k)}</code>
          <span class="ra-igual">=</span>
          <span class="ra-expr">${k === 0 ? '<span class="ra-base">caso base</span>' : `<code>${T.paso(k)}</code><small class="ra-pista"></small>`}</span>
          <span class="ra-igual">=</span>
          <input class="ra-in" type="text" inputmode="numeric" autocomplete="off" aria-label="Lo que devuelve ${T.llamada(k)}">
        </div>`;
      }).join('')}</div>
      <div class="game-msg ra-msg"></div>
      <div class="row-end"><button class="btn btn-ghost btn-s ra-ver">Ver las respuestas</button></div>`;
    $('.ra-otro', c).addEventListener('click', () => { sonarEd('tic'); nuevo(true); });
    $('.ra-ver', c).addEventListener('click', () => {
      revelado = true;
      $$('.ra-fila', c).forEach(f => { $('.ra-in', f).value = valores[+f.dataset.k]; });
      revisar();
    });
    $$('.ra-in', c).forEach(inp => inp.addEventListener('input', revisar));
    // solo al pedir otro ejercicio: al cargar la página, el foco la haría brincar hasta aquí
    const ultimo = $$('.ra-in', c).pop();
    if (enfocar && ultimo && window.matchMedia('(hover:hover)').matches) ultimo.focus({ preventScroll: true });
  }
  function revisar() {
    let bien = 0;
    $$('.ra-fila', c).forEach(f => {
      const k = +f.dataset.k, inp = $('.ra-in', f), v = inp.value.trim();
      const ok = v !== '' && Number(v) === valores[k];
      inp.classList.toggle('ok', ok);
      inp.classList.toggle('mal', v !== '' && !ok);
      if (ok) bien++;
      const pista = $('.ra-pista', f);
      if (pista) {
        const abajo = $(`.ra-fila[data-k="${k - 1}"] .ra-in`, c);
        const okAbajo = abajo && abajo.value.trim() !== '' && Number(abajo.value) === valores[k - 1];
        pista.textContent = okAbajo ? '→ ' + T.conValor(k, valores[k - 1]) : '';
      }
    });
    const m = $('.ra-msg', c);
    if (bien === N + 1) {
      m.innerHTML = revelado
        ? `Así queda: <b>${T.llamada(N)} = ${valores[N]}</b>. Ahora pica «Otro ejercicio» e inténtalo sin ver.`
        : `<i data-lucide="sparkles"></i> ¡Rastreo completo! <b>${T.llamada(N)} = ${valores[N]}</b>. Así se hace en la libreta.`;
      if (!revelado) {
        sonarEd('fanfarria');
        if (!store.get('ed_rastreo', false)) { store.set('ed_rastreo', true); progreso(); }
      }
    } else {
      const vacioAbajo = $$('.ra-fila', c).reverse().find(f => $('.ra-in', f).value.trim() === '');
      m.textContent = bien ? `${bien} de ${N + 1} bien. Sigue subiendo.` : vacioAbajo && +vacioAbajo.dataset.k === 0 ? 'Empieza por abajo: ¿qué devuelve el caso base?' : '';
    }
  }
  nuevo();
}

/* ============================================================
   EJEMPLOS RESUELTOS
   ============================================================ */
let ejI = 0;
function renderEjTabs() {
  $('#ejTabs').innerHTML = ED_EJEMPLOS.map((e, i) =>
    `<button class="gtab${i === ejI ? ' on' : ''}" data-i="${i}"><i data-lucide="${e.icono}"></i> ${e.n}</button>`).join('');
  $$('#ejTabs .gtab').forEach(b => b.addEventListener('click', () => elegirEjemplo(+b.dataset.i, true)));
  centrarTab();
  setTimeout(centrarTab, 200);     // otra vez cuando ya cargaron la letra y los iconos
}

/* Centra la pestaña activa moviendo solo la tira, no la página. Se mide con
   getBoundingClientRect: offsetLeft se mide contra el body, no contra la tira. */
function centrarTab() {
  const on = $('#ejTabs .gtab.on'), tabs = $('#ejTabs');
  if (!on || !tabs) return;
  const t = tabs.getBoundingClientRect(), o = on.getBoundingClientRect();
  tabs.scrollLeft += (o.left - t.left) - (t.width - o.width) / 2;
}

function elegirEjemplo(i, desdeTab) {
  ejI = i;
  store.set('ed_ejemplo', i);
  const vistos = store.get('ed_ejemplos', []);
  if (!vistos.includes(ED_EJEMPLOS[i].id)) { vistos.push(ED_EJEMPLOS[i].id); store.set('ed_ejemplos', vistos); progreso(); }
  if (desdeTab) { history.replaceState(null, '', '#' + ED_EJEMPLOS[i].id); sonarEd('tic'); }
  renderEjTabs(); renderEjemplo();
}

function renderEjemplo() {
  const x = ED_EJEMPLOS[ejI];
  const sig = ED_EJEMPLOS[ejI + 1];
  const nivel = { 'Fácil': 've', 'Medio': 'am', 'Reto': 'ro' }[x.nivel];
  $('#ej').innerHTML = `
    <div class="giro-t"><i class="e" data-lucide="${x.icono}"></i><h3>${x.n}</h3><span class="nivel tono-${nivel}">${x.nivel}</span></div>
    <p class="giro-s ej-enun">${x.enunciado}</p>

    <div class="gb"><h4>1 · La idea, en español</h4><p class="ej-idea">${x.idea}</p></div>

    <div class="gb"><h4>2 · Sus dos partes</h4>
      <div class="ej-partes">
        <div class="ej-parte base"><b>Caso base</b><span>${x.base}</span></div>
        <div class="ej-parte rec"><b>Caso recursivo</b><span>${x.rec}</span></div>
      </div></div>

    <div class="gb"><h4>3 · El código, renglón por renglón</h4>
      <div class="copy-r"><span class="counter">Toca una explicación para ver sus renglones</span>
        <button class="btn btn-ghost btn-s ej-copiar">Copiar</button></div>
      <div class="ej-codigo">${codigoConLineas(x.codigo)}</div>
      <ol class="ej-lineas">${x.lineas.map(([a, b, t]) => `<li data-a="${a}" data-b="${b}" tabindex="0" role="button"><span class="ej-ln">${a === b ? 'Renglón ' + a : `Renglones ${a} a ${b}`}</span> ${t}</li>`).join('')}</ol>
    </div>

    <div class="gb"><h4>4 · Prueba de escritorio</h4>
      <pre class="traza"><code>${escHtml(x.rastreo)}</code></pre>
      ${x.nota ? `<p class="ej-nota">${x.nota}</p>` : ''}
      ${x.extra ? codigoConLineas(x.extra) : ''}
    </div>

    <div class="gb"><h4>5 · Errores típicos</h4>
      <ul class="ej-errores">${x.errores.map(e => `<li><i data-lucide="triangle-alert"></i><span>${e}</span></li>`).join('')}</ul></div>

    <div class="gb"><h4>6 · El programa completo</h4>
      <details class="ej-prog">
        <summary><i data-lucide="file-code"></i> Ver el programa para copiar y correr</summary>
        <div class="copy-r"><span class="counter">Main.java</span><button class="btn btn-ghost btn-s ej-copiar-prog">Copiar programa</button></div>
        <pre class="java"><code>${resaltarJava(x.programa)}</code></pre>
        <p class="ej-imprime">Al correrlo imprime:</p>
        <pre class="consola"><code>${escHtml(x.salida)}</code></pre>
      </details>
    </div>

    <div class="row-end ej-pie">
      ${x.visual ? `<a class="btn btn-yellow" href="recursividad-pila.html?ver=${x.visual}#visualizador"><i data-lucide="play"></i> Verlo paso a paso</a>` : ''}
      ${sig ? `<button class="btn btn-ghost ej-sig">Siguiente: ${sig.n} <i data-lucide="arrow-right"></i></button>` : ''}
    </div>`;

  const lineas = $$('.ej-codigo .ln');
  $$('.ej-lineas li').forEach(li => {
    const marcar = () => {
      const a = +li.dataset.a, b = +li.dataset.b;
      $$('.ej-lineas li').forEach(o => o.classList.toggle('on', o === li));
      lineas.forEach(l => l.classList.toggle('on', +l.dataset.n >= a && +l.dataset.n <= b));
    };
    li.addEventListener('click', marcar);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); marcar(); } });
  });
  const bc = $('.ej-copiar'); bc.addEventListener('click', () => copiarTexto(x.codigo, bc, 'Copiar'));
  const bp = $('.ej-copiar-prog'); bp.addEventListener('click', () => copiarTexto(x.programa, bp, 'Copiar programa'));
  const bs = $('.ej-sig');
  if (bs) bs.addEventListener('click', () => { elegirEjemplo(ejI + 1, true); $('#ejemplos').scrollIntoView({ block: 'start', behavior: 'smooth' }); });
}

function renderEjResumen() {
  $('#ejResumen').innerHTML = '<thead><tr><th>Ejemplo</th><th>Caso base</th><th>Caso recursivo</th><th>Se acerca porque…</th></tr></thead><tbody>' +
    ED_EJEMPLOS.map(x => `<tr>
      <td><a href="#${x.id}" class="ej-link">${x.n}</a></td>
      <td><code>${escHtml(x.resumen.base)}</code></td>
      <td><code>${escHtml(x.resumen.rec)}</code></td>
      <td>${x.resumen.acerca}</td></tr>`).join('') + '</tbody>';
  // Se maneja el clic aquí y no con el #: si el ejemplo ya estaba abierto, el
  // ancla no cambia, no hay «hashchange» y el enlace no hacía nada.
  $$('#ejResumen .ej-link').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const k = ED_EJEMPLOS.findIndex(x => '#' + x.id === a.getAttribute('href'));
    if (k < 0) return;
    if (k !== ejI) elegirEjemplo(k, true);
    $('#ejemplos').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));
}

function initEjemplos() {
  const porAncla = () => ED_EJEMPLOS.findIndex(x => '#' + x.id === location.hash);
  const i = porAncla();
  ejI = i > -1 ? i : Math.min(store.get('ed_ejemplo', 0), ED_EJEMPLOS.length - 1);
  elegirEjemplo(ejI, false);
  if (i > -1) setTimeout(() => $('#ejemplos').scrollIntoView({ block: 'start' }), 80);
  renderEjResumen();
  window.addEventListener('hashchange', () => {
    const k = porAncla();
    if (k > -1 && k !== ejI) { elegirEjemplo(k, true); $('#ejemplos').scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  });
}

/* ============================================================
   LABORATORIO
   ============================================================ */

/* Un juego de opción múltiple sobre código: sirve para «¿qué imprime?»
   y para «encuentra el error». */
function juegoCodigo(c, items, { llaveAvance, conLineas, pintarExtra, titulo, repaso }) {
  let i = 0, aciertos = 0, orden = [];
  const empezar = () => { i = 0; aciertos = 0; pintar(); };
  function pintar() {
    if (i >= items.length) {
      const pct = aciertos / items.length;
      c.innerHTML = `
        <div class="cl-fin">
          <div class="q-score"><b>${aciertos}</b><span>/${items.length}</span></div>
          <h3>${pct === 1 ? 'Perfecto. Esto ya lo dominas.' : pct >= .75 ? 'Muy bien. Repasa las que fallaste y quedas.' : 'Vas bien, pero repásalo: ' + repaso}</h3>
          <button class="btn btn-yellow cl-otra"><i data-lucide="rotate-cw"></i> Otra vez</button>
        </div>`;
      $('.cl-otra', c).addEventListener('click', () => { sonarEd('tic'); empezar(); });
      if (!store.get(llaveAvance, false)) { store.set(llaveAvance, true); progreso(); }
      sonarEd(pct >= .75 ? 'fanfarria' : 'bien');
      return;
    }
    const it = items[i];
    orden = shuffle(it.o.map((_, k) => k));
    c.innerHTML = `
      <div class="q-top">
        <span class="counter">${i + 1} / ${items.length}</span>
        <div class="q-bar"><div class="jc-bar" style="width:${i / items.length * 100}%"></div></div>
        <span class="counter">${aciertos} <i data-lucide="check"></i></span>
      </div>
      <span class="q-tag">${it.nivel || titulo(it)}</span>
      <div class="jc-code">${conLineas ? codigoConLineas(it.code) : `<pre class="codigo"><code>${resaltarJava(it.code)}</code></pre>`}</div>
      <h3 class="q-q">${it.q || `¿Qué pasa con <code>${escHtml(it.llamada)}</code>?`}</h3>
      <div class="q-opts">${orden.map(k => `<button class="qopt" data-k="${k}">${it.o[k]}</button>`).join('')}</div>
      <div class="q-fb hidden"></div>
      <div class="jc-extra"></div>
      <button class="btn btn-yellow hidden jc-sig">${i + 1 < items.length ? 'Siguiente' : 'Ver resultado'}</button>`;
    $$('.qopt', c).forEach(b => b.addEventListener('click', () => {
      const k = +b.dataset.k, ok = k === it.r;
      if (ok) aciertos++;
      $$('.qopt', c).forEach(x => { x.disabled = true; if (+x.dataset.k === it.r) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      const fb = $('.q-fb', c);
      fb.className = 'q-fb ' + (ok ? 'ok' : 'no');
      fb.innerHTML = (ok ? '<i data-lucide="circle-check"></i> <b>¡Correcto!</b> ' : '<i data-lucide="circle-x"></i> <b>No era esa.</b> ') + it.e;
      if (pintarExtra) pintarExtra(it, c);
      $('.jc-sig', c).classList.remove('hidden');
      sonarEd(ok ? 'bien' : 'mal');
    }));
    $('.jc-sig', c).addEventListener('click', () => { i++; pintar(); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  }
  empezar();
}

/* Renglones (desde 1) de «despues» que no vienen de «antes». Se usa la
   subsecuencia común más larga: comparar renglón por renglón no sirve,
   porque una llave } que se agrega ya existía en otra parte del método. */
function renglonesNuevos(antes, despues) {
  const a = antes.split('\n').map(s => s.trim()), d = despues.split('\n').map(s => s.trim());
  const L = Array.from({ length: a.length + 1 }, () => new Array(d.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = d.length - 1; j >= 0; j--)
      L[i][j] = a[i] === d[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const nuevas = [];
  let i = 0, j = 0;
  while (j < d.length) {
    if (i < a.length && a[i] === d[j]) { i++; j++; }
    else if (i < a.length && L[i + 1][j] >= L[i][j + 1]) i++;
    else { nuevas.push(j + 1); j++; }
  }
  return nuevas;
}

function initImprime() {
  juegoCodigo($('#imprimeJuego'), ED_IMPRIME, {
    llaveAvance: 'ed_imprime', conLineas: false, titulo: () => '',
    repaso: 'la clave es la ida y la vuelta de la pila.'
  });
}

function initErrores() {
  juegoCodigo($('#errorJuego'), ED_ERRORES, {
    llaveAvance: 'ed_error', conLineas: true, titulo: it => it.t,
    repaso: 'revisa cada método contra las 3 reglas de oro.',
    pintarExtra(it, c) {
      $$('.jc-code .ln', c).forEach(l => l.classList.toggle('culpa', it.linea.includes(+l.dataset.n)));
      const nuevas = renglonesNuevos(it.code, it.arreglo);
      $('.jc-extra', c).innerHTML = `<p class="jc-arreglo-t"><i data-lucide="wrench"></i> <b>Así se arregla:</b></p>${codigoConLineas(it.arreglo, nuevas, 'arreglo')}`;
    }
  });
}

/* Arma tu método: se «corre» con n de 0 a 5 */
function initArmar() {
  const c = $('#armarEd');
  const A = { meta: 'factorial', cond: 'n == 0', valor: '0', rec: 'n + f(n - 1)' };
  const PROF = 60;

  function correr(n, prof) {
    if (prof > PROF) throw DESBORDE;
    const si = { 'n == 0': n === 0, 'n == 1': n === 1, 'n <= 1': n <= 1, 'n > 0': n > 0 }[A.cond];
    if (si) return { '0': 0, '1': 1, 'n': n }[A.valor];
    const f = m => correr(m, prof + 1);
    switch (A.rec) {
      case 'n * f(n - 1)': return n * f(n - 1);
      case 'n + f(n - 1)': return n + f(n - 1);
      case '2 * f(n - 1)': return 2 * f(n - 1);
      case 'f(n - 1)': return f(n - 1);
      case 'n * f(n)': return n * f(n);
      case 'n * f(n + 1)': return n * f(n + 1);
    }
  }

  function pintar() {
    const meta = ED_ARMAR.metas.find(m => m.id === A.meta);
    const recTxt = A.rec.replace(/f\(/g, meta.nombre + '(');
    const grupo = (k, titulo, ops, fmt) => `
      <div class="bgroup"><div class="bgroup-t">${titulo}</div>
        <div class="bblocks">${ops.map(o => `<button class="bblock${A[k] === o ? ' on' : ''}" data-k="${k}" data-v="${escHtml(o)}" aria-pressed="${A[k] === o}">${fmt ? fmt(o) : escHtml(o)}</button>`).join('')}</div></div>`;

    const filas = [0, 1, 2, 3, 4, 5].map(n => {
      let v;
      try { v = correr(n, 0); } catch (e) { if (e !== DESBORDE) throw e; v = null; }
      return { n, v, esp: meta.esperado(n), ok: v === meta.esperado(n) };
    });
    const todo = filas.every(f => f.ok);
    const desbordes = filas.filter(f => f.v === null);
    const malos = filas.filter(f => f.v !== null && !f.ok);

    const pistas = [];
    if (desbordes.length) {
      const n0 = desbordes[0].n;
      if (A.rec === 'n * f(n)') pistas.push('La llamada usa <b>el mismo n</b>: el problema nunca se hace más pequeño, así que nunca llega al caso base.');
      else if (A.rec === 'n * f(n + 1)') pistas.push('La llamada usa <code>n + 1</code>: n <b>crece</b> y se aleja del caso base.');
      else if (A.cond === 'n > 0') pistas.push('Tu caso base se activa con <code>n &gt; 0</code>, o sea con los positivos. Con n = 0 la llamada baja a −1, −2… y la condición ya nunca se cumple.');
      else pistas.push(`Con n = ${n0} la condición <code>${escHtml(A.cond)}</code> nunca se cumple: la llamada baja a ${n0 - 1}, ${n0 - 2}… y no para.`);
    }
    if (malos.length) {
      const nb = [0, 1, 2, 3, 4, 5].find(n => ({ 'n == 0': n === 0, 'n == 1': n === 1, 'n <= 1': n <= 1, 'n > 0': n > 0 })[A.cond]);
      const vb = nb == null ? null : { '0': 0, '1': 1, 'n': nb }[A.valor];
      if (nb != null && vb !== meta.esperado(nb)) pistas.push(`Revisa el caso base: con n = ${nb} devuelve <b>${vb}</b>, pero ${meta.nombre}(${nb}) vale <b>${meta.esperado(nb)}</b>.`);
      if (A.rec === 'f(n - 1)') pistas.push('El caso recursivo <b>no usa n</b> (ni el 2): lo que devuelve el caso base sube tal cual, sin cambiar.');
      else {
        const opOk = { factorial: 'n * f(n - 1)', suma: 'n + f(n - 1)', dosALa: '2 * f(n - 1)' }[A.meta];
        if (A.rec !== opOk && A.rec.includes('n - 1')) pistas.push(`La operación no corresponde (${meta.desc}). ¿Qué le haces al resultado de la llamada?`);
      }
      if (!pistas.length) pistas.push(`Con n = ${malos[0].n} tu método da ${malos[0].v} y debería dar ${malos[0].esp}.`);
    }

    c.innerHTML = `
      ${grupo('meta', '¿Qué quieres calcular?', ED_ARMAR.metas.map(m => m.id), id => { const m = ED_ARMAR.metas.find(x => x.id === id); return `${m.nombre}(n)`; })}
      <p class="lead ar-meta">${meta.desc}</p>
      <pre class="codigo ar-java"><code>${resaltarJava(`public static ${meta.tipo} ${meta.nombre}(int n) {\n    if (`)}<span class="hueco">${resaltarJava(A.cond)}</span>${resaltarJava(') {\n        return ')}<span class="hueco">${resaltarJava(A.valor)}</span>${resaltarJava(';\n    }\n    return ')}<span class="hueco">${resaltarJava(recTxt)}</span>${resaltarJava(';\n}')}</code></pre>
      ${grupo('cond', '1 · ¿Cuándo es el caso base?', ED_ARMAR.condiciones)}
      ${grupo('valor', '2 · ¿Qué devuelve el caso base?', ED_ARMAR.valores)}
      ${grupo('rec', '3 · ¿Qué devuelve el caso recursivo?', ED_ARMAR.recursivos, o => escHtml(o.replace(/f\(/g, meta.nombre + '(')))}
      <div class="build-verdict ${todo ? 'v-ok' : 'v-no'}">
        <b>${todo ? '<i data-lucide="circle-check"></i> ¡Funciona! Da lo correcto de 0 a 5' : '<i data-lucide="circle-x"></i> Todavía no'}</b>
        <div class="tscroll ar-tabla"><table>
          <thead><tr><th>n</th>${filas.map(f => `<th>${f.n}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><td><b>Tu método</b></td>${filas.map(f => `<td class="${f.ok ? 'ok' : 'mal'}">${f.v === null ? '<span title="StackOverflowError">💥</span>' : f.v}</td>`).join('')}</tr>
            <tr><td><b>Debería</b></td>${filas.map(f => `<td>${f.esp}</td>`).join('')}</tr>
          </tbody>
        </table></div>
        ${desbordes.length ? '<p class="ar-leyenda">💥 = StackOverflowError: nunca llegó al caso base.</p>' : ''}
        ${todo
          ? `<p>Tiene caso base, cada llamada se acerca a él con <code>n - 1</code> y usa lo que le devuelven. Las 3 reglas de oro.${A.meta === 'factorial' && A.cond === 'n <= 1' ? ' Y con <code>n &lt;= 1</code> te ahorras una llamada.' : ''}</p>`
          : `<ul>${pistas.map(p => `<li>${p}</li>`).join('')}</ul>`}
      </div>`;

    $$('.bblock', c).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = b.dataset.v;
      A[k] = v;
      sonarEd('tic');
      pintar();
      // todo se repintó: el foco regresa al bloque elegido, o con el teclado se perdería
      const nuevo = $$('.bblock', c).find(x => x.dataset.k === k && x.dataset.v === v);
      if (nuevo) nuevo.focus();
    }));
    if (todo) {
      if (!store.get('ed_armar', false)) { store.set('ed_armar', true); progreso(); sonarEd('fanfarria'); }
    }
  }
  pintar();
}

/* Torres de Hanoi: se juega a mano, o se ve la solución recursiva */
function initHanoi() {
  const c = $('#hanoiJuego');
  const POSTES = ['A', 'B', 'C'];
  // bloqueado: el tablero ya está resuelto (por ti o por la solución) y solo se
  // desbloquea con «Empezar de nuevo»; si no, mover un disco y regresarlo
  // contaba como partida ganada sin haberla jugado
  let n = 3, postes, sel = null, movs = 0, anim = null, solMovs = [], bloqueado = false;

  c.innerHTML = `
    <div class="game-top">
      <span class="stat">Discos
        <span class="hn-discos">${[3, 4, 5].map(k => `<button class="fbtn hn-n" data-n="${k}">${k}</button>`).join('')}</span></span>
      <span class="stat">Movimientos <b class="hn-movs">0</b></span>
      <span class="stat">Mínimo <b class="hn-min"></b></span>
      <span class="stat">Récord <b class="hn-best">–</b></span>
    </div>
    <div class="hn-tablero"></div>
    <div class="game-msg hn-msg"></div>
    <div class="row-end">
      <button class="btn btn-ghost btn-s hn-reset"><i data-lucide="rotate-ccw"></i> Empezar de nuevo</button>
      <button class="btn btn-yellow btn-s hn-sol"><i data-lucide="play"></i> Ver la solución recursiva</button>
    </div>
    <pre class="consola hn-log hidden"><code></code></pre>`;

  const TONOS = ['ro', 'am', 've', 'az', 'mo'];
  const reset = () => {
    detener();
    postes = [Array.from({ length: n }, (_, k) => n - k), [], []];
    sel = null; movs = 0; bloqueado = false;
    $('.hn-log', c).classList.add('hidden');
    $('.hn-log code', c).textContent = '';
    pintar('Toca el poste A para tomar su disco de arriba.');
  };
  function detener() {
    if (anim) clearTimeout(anim);
    anim = null;
    $('.hn-sol', c).innerHTML = '<i data-lucide="play"></i> Ver la solución recursiva';
    c.classList.remove('animando');
  }
  function pintar(msg) {
    $$('.hn-n', c).forEach(b => b.classList.toggle('on', +b.dataset.n === n));
    $('.hn-movs', c).textContent = movs;
    $('.hn-min', c).textContent = 2 ** n - 1;
    const best = store.get('ed_hanoiBest', {})[n];
    $('.hn-best', c).textContent = best ? best : '–';
    $('.hn-tablero', c).innerHTML = postes.map((p, k) => `
      <button class="hn-poste${sel === k ? ' sel' : ''}" data-k="${k}" aria-label="Poste ${POSTES[k]}${p.length ? ', disco de arriba: ' + p[p.length - 1] : ', vacío'}">
        <span class="hn-palo"></span>
        <span class="hn-pila">${p.slice().reverse().map((d, j) => `<span class="hn-disco tono-${TONOS[(d - 1) % TONOS.length]}${sel === k && j === 0 ? ' alzado' : ''}" style="width:${28 + d * 13}%">${d}</span>`).join('')}</span>
        <span class="hn-base">${POSTES[k]}</span>
      </button>`).join('');
    $$('.hn-poste', c).forEach(b => b.addEventListener('click', () => tocar(+b.dataset.k)));
    if (msg != null) $('.hn-msg', c).innerHTML = msg;
  }
  function tocar(k) {
    if (anim) return;
    if (bloqueado) { sonarEd('mal'); return pintar('Este tablero ya quedó resuelto. Pica «Empezar de nuevo» para jugarlo tú.'); }
    if (sel === null) {
      if (!postes[k].length) { sonarEd('mal'); return pintar(`El poste ${POSTES[k]} está vacío: no hay disco que tomar.`); }
      sel = k; sonarEd('tic');
      return pintar(`Tomaste el disco ${postes[k][postes[k].length - 1]}. Ahora toca el poste donde lo quieres dejar.`);
    }
    if (sel === k) { sel = null; return pintar('Lo regresaste a su lugar.'); }
    const d = postes[sel][postes[sel].length - 1], arriba = postes[k][postes[k].length - 1];
    if (arriba !== undefined && arriba < d) {
      sonarEd('mal');
      const s = sel; sel = null;
      return pintar(`No se vale: el disco ${d} es más grande que el ${arriba}. Un disco grande nunca va sobre uno chico. (Lo regresé al poste ${POSTES[s]}).`);
    }
    postes[k].push(postes[sel].pop());
    movs++; sel = null; sonarEd('tic');
    if (postes[2].length === n) {
      bloqueado = true;
      const min = 2 ** n - 1, bests = store.get('ed_hanoiBest', {});
      if (!bests[n] || movs < bests[n]) { bests[n] = movs; store.set('ed_hanoiBest', bests); }
      if (!store.get('ed_hanoi', false)) { store.set('ed_hanoi', true); progreso(); }
      sonarEd('fanfarria');
      return pintar(movs === min
        ? `<i data-lucide="sparkles"></i> ¡Perfecto! ${n} discos en <b>${movs}</b> movimientos, justo el mínimo: 2<sup>${n}</sup> − 1.`
        : `¡Lo lograste en ${movs} movimientos! El mínimo es ${min}. Pica «Ver la solución» para ver cómo lo hace la recursión.`);
    }
    pintar(`Movimiento ${movs}. Llevas ${postes[2].length} de ${n} en el poste C.`);
  }
  function solucion() {
    if (anim) { detener(); return pintar('Solución detenida. Pica «Empezar de nuevo» para jugarlo tú.'); }
    postes = [Array.from({ length: n }, (_, k) => n - k), [], []];
    sel = null; movs = 0; bloqueado = true;
    solMovs = [];
    (function hanoi(k, o, a, d) { if (k === 0) return; hanoi(k - 1, o, d, a); solMovs.push([k, o, d]); hanoi(k - 1, a, o, d); })(n, 0, 1, 2);
    const log = $('.hn-log', c), code = $('.hn-log code', c);
    log.classList.remove('hidden'); code.textContent = `hanoi(${n}, 'A', 'B', 'C') imprime:`;
    c.classList.add('animando');
    $('.hn-sol', c).innerHTML = '<i data-lucide="pause"></i> Detener';
    const mitad = (solMovs.length - 1) / 2;
    const paso = j => {
      if (j >= solMovs.length) {
        anim = null; detener();
        return pintar(`Listo: <b>${solMovs.length}</b> movimientos = 2<sup>${n}</sup> − 1. Fíjate en el movimiento ${mitad + 1}: justo a la mitad, el disco ${n} pasa de A a C.`);
      }
      const [k, o, d] = solMovs[j];
      postes[d].push(postes[o].pop()); movs++;
      code.textContent += `\nMueve el disco ${k} de ${POSTES[o]} a ${POSTES[d]}${j === mitad ? '     ← la mitad: el más grande' : ''}`;
      log.scrollTop = log.scrollHeight;
      sonarEd('tic');
      pintar(j === mitad ? `<b>Movimiento ${j + 1}:</b> el disco ${n}, el más grande, pasa directo de A a C. Lo de antes fue quitarle de encima los otros ${n - 1}; lo de después, ponérselos otra vez encima.` : `Movimiento ${j + 1} de ${solMovs.length}: disco ${k} de ${POSTES[o]} a ${POSTES[d]}.`);
      anim = setTimeout(() => paso(j + 1), n === 5 ? 420 : 650);
    };
    paso(0);
  }
  $$('.hn-n', c).forEach(b => b.addEventListener('click', () => { n = +b.dataset.n; sonarEd('tic'); reset(); }));
  $('.hn-reset', c).addEventListener('click', reset);
  $('.hn-sol', c).addEventListener('click', solucion);
  reset();
}

/* ============================================================
   INICIO DE LA MATERIA
   ============================================================ */
function renderCuentas() {
  const cuentas = { ejemplos: ED_EJEMPLOS.length, imprime: ED_IMPRIME.length, quiz: ED_QUIZ.length };
  $$('[data-cuenta]').forEach(n => { if (cuentas[n.dataset.cuenta] != null) n.textContent = cuentas[n.dataset.cuenta]; });
}

/* ============================================================
   HOJA IMPRIMIBLE DE RECURSIVIDAD
   Dos hojas, con el mismo estilo de apuntes que la de API REST.
   ============================================================ */
function hojaEd() {
  const tonos = ['az', 've', 'am', 'mo', 'ro'];
  const codigoHoja = src => `<pre class="hi-code"><code>${resaltarJava(src)}</code></pre>`;

  // la pila de factorial(3) dibujada: ida (se apila) y vuelta (se desapila)
  const marco = (x, y, txt, sub, col, w = 150) => `
    <rect x="${x}" y="${y}" width="${w}" height="29" rx="7" fill="${col}" stroke="#1a1712" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + 13}" text-anchor="middle" font-size="11" font-weight="800" fill="#1a1712">${txt}</text>
    <text x="${x + w / 2}" y="${y + 24}" text-anchor="middle" font-size="8.6" fill="#3d3a33">${sub}</text>`;
  const pila = [
    ['main', 'espera', '#e6e3db'], ['factorial(3)', 'espera 3 × ?', '#cfe0ff'],
    ['factorial(2)', 'espera 2 × ?', '#cfe0ff'], ['factorial(1)', 'espera 1 × ?', '#cfe0ff'], ['factorial(0)', 'caso base → 1', '#fff1c9']
  ];
  const vuelta = [['factorial(1)', '1 × 1 = 1'], ['factorial(2)', '2 × 1 = 2'], ['factorial(3)', '3 × 2 = 6'], ['main', 'imprime 6']];
  const svg = `
    <svg class="hi-svg" viewBox="0 0 760 184" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ptaEd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 z" fill="#1a1712"/></marker></defs>
      <text x="8" y="14" font-size="11" font-weight="800" fill="#1a1712">IDA: cada llamada apila un marco</text>
      ${pila.map((p, k) => marco(8, 152 - k * 32, p[0], p[1], p[2])).join('')}
      <path d="M176 176 V 28" stroke="#1a1712" stroke-width="2.2" marker-end="url(#ptaEd)"/>
      <text x="400" y="14" font-size="11" font-weight="800" fill="#1a1712">VUELTA: se desapilan, de la última a la primera</text>
      ${vuelta.map((v, k) => marco(236 + k * 132, 50, v[0], v[1], k === 3 ? '#c8f0d8' : '#e7e0ff', 118)).join('')}
      ${[0, 1, 2].map(k => `<path d="M${356 + k * 132} 64 h 10" stroke="#1a1712" stroke-width="2.2" marker-end="url(#ptaEd)"/>`).join('')}
      <text x="236" y="112" font-size="10.5" fill="#3d3a33">Solo corre el marco de hasta arriba. La última llamada en entrar,</text>
      <text x="236" y="126" font-size="10.5" fill="#3d3a33">factorial(0), es la primera en terminar: LIFO.</text>
      <text x="236" y="152" font-size="10.5" font-weight="800" fill="#1a1712">Si nunca hay caso base, la pila crece hasta llenarse:</text>
      <text x="236" y="166" font-size="10.5" font-weight="800" fill="#b3262c">java.lang.StackOverflowError</text>
    </svg>`;

  return `
  <!-- ===================== HOJA 1 ===================== -->
  <div class="hi-pg">
    <span class="hi-tape t1"></span><span class="hi-tape t2"></span>

    <header class="hi-head">
      <h1>Repaso <span class="hl ro">Recursividad</span></h1>
      <p class="hi-sub">Estructura de Datos · UTEZ · en Java</p>
      <p class="hi-mano">todo lo que cae, en dos hojas ✦</p>
    </header>

    <section class="hi-sec">
      <h2><span class="hi-tab az"></span>Lo mínimo que hay que saberse</h2>
      <div class="hi-notas">
        ${ED_CHEAT.filter(c => c.enHoja !== false).map((c, i) => `<div class="hi-nota ${tonos[i % 5]}"><b>${c.t}</b>${c.d.replace(/<br>/g, ' ')}</div>`).join('')}
      </div>
    </section>

    <section class="hi-sec hi-dos">
      <div>
        <h2><span class="hi-tab ve"></span>Anatomía de un método recursivo</h2>
        ${codigoHoja('public static long factorial(int n) {\n    if (n == 0) {       // CASO BASE: se contesta\n        return 1;       // directo, sin llamar\n    }\n    // CASO RECURSIVO: el mismo problema, más chico\n    return n * factorial(n - 1);\n}')}
        <p class="hi-mano hi-flecha">primero el caso base, <u>siempre</u></p>
      </div>
      <div>
        <h2><span class="hi-tab am"></span>Las 3 reglas de oro</h2>
        <ol class="hi-reglas-ed">
          ${ED_REGLAS.map(r => `<li><b>${r.t}.</b> ${r.s}</li>`).join('')}
        </ol>
        <div class="hi-sticky">
          <b>Cómo pensarlo en 4 pasos</b>
          1. ¿Cuál es el caso más fácil? · 2. Imagina resuelto el problema un poquito más chico ·
          3. Úsalo para armar el tuyo · 4. Revisa que siempre llegues al caso base.
        </div>
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab ro"></span>Cuando truena con StackOverflowError</h2>
      <div class="hi-causas">
        <div class="hi-nota ro"><b>1. No hay caso base</b>Nada detiene las llamadas: se apilan hasta que ya no cabe una más.</div>
        <div class="hi-nota ro"><b>2. No se acerca al caso base</b>Con <code>n + 1</code>, con el mismo <code>n</code>, o brincándoselo (<code>n - 2</code> con un impar y <code>n == 0</code>).</div>
        <div class="hi-nota ro"><b>3. Llama antes de revisar</b>La llamada recursiva quedó arriba del <code>if</code> del caso base.</div>
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab mo"></span>El Java que se olvida</h2>
      <div class="hi-java">
        <div><code>7 / 2</code> da <b>3</b> <span>· entre enteros se tiran los decimales</span></div>
        <div><code>7 % 2</code> da <b>1</b> <span>· el residuo</span></div>
        <div><code>n % 10</code> <span>último dígito ·</span> <code>n / 10</code> <span>lo quita</span></div>
        <div><code>n == 0</code> <span>compara ·</span> <code>n = 0</code> <span>guarda</span></div>
        <div><code>arr.length</code> <span>sin paréntesis ·</span> <code>s.length()</code> <span>con</span></div>
        <div><code>s.charAt(0)</code> <span>primera letra ·</span> <code>s.substring(1)</code> <span>sin ella</span></div>
        <div><code>return</code> <span>devuelve el valor y termina el método ahí mismo</span></div>
        <div><code>void</code> <span>no devuelve nada; puede salirse antes con</span> <code>return;</code></div>
        <div><code>int</code> <span>ya no alcanza para 13!: usa</span> <code>long</code></div>
      </div>
    </section>
  </div>

  <!-- ===================== HOJA 2 ===================== -->
  <div class="hi-pg">
    <span class="hi-tape t3"></span>

    <section class="hi-sec">
      <h2><span class="hi-tab mo"></span>La pila de llamadas: factorial(3)</h2>
      ${svg}
    </section>

    <section class="hi-sec hi-dos">
      <div>
        <h2><span class="hi-tab ro"></span>Ida y vuelta</h2>
        <table class="hi-t hi-iv">
          <tr><th>Dónde va el print</th><th>f(3) imprime</th></tr>
          <tr><td>antes de <code>f(n - 1)</code></td><td><b>3 2 1</b> (en la ida)</td></tr>
          <tr><td>después de <code>f(n - 1)</code></td><td><b>1 2 3</b> (en la vuelta)</td></tr>
          <tr><td>antes y después</td><td><b>3 2 1 1 2 3</b></td></tr>
        </table>
        <p class="hi-mano hi-flecha">lo de después sale en orden inverso</p>
        <div class="hi-sticky final">
          <b>Recursión vs ciclo</b>
          Todo lo recursivo se puede hacer con un ciclo. La recursión se lee más clara en problemas que se
          dividen en versiones más chicas de sí mismos; el ciclo gasta <u>menos memoria</u>: no apila un marco por llamada.
        </div>
      </div>
      <div>
        <h2><span class="hi-tab az"></span>Tipos de recursión</h2>
        <table class="hi-t hi-tipos">
          ${ED_TIPOS.map(t => t.r.map(x => `<tr><td><b>${x.n}</b></td><td>${escHtml(x.corto)}</td></tr>`).join('')).join('')}
        </table>
      </div>
    </section>

    <section class="hi-sec">
      <h2><span class="hi-tab ve"></span>Los clásicos</h2>
      <table class="hi-t hi-clasicos">
        <tr><th>Ejemplo</th><th>Caso base</th><th>Caso recursivo</th></tr>
        ${ED_EJEMPLOS.map(x => `<tr><td><b>${x.n}</b></td><td><code>${escHtml(x.resumen.base)}</code></td><td><code>${escHtml(x.resumen.rec)}</code></td></tr>`).join('')}
      </table>
    </section>

    <p class="hi-mano hi-url">skytoti.github.io/Aplicaciones-Web/estructura-datos.html</p>
  </div>`;
}

/* ============================================================
   ARRANQUE
   ============================================================ */
function initSeccionesEd() {
  if (typeof ED_EJEMPLOS === 'undefined') return;
  const hay = id => !!document.getElementById(id);

  // el código Java escrito directo en el HTML también lleva colores
  $$('pre.java code').forEach(c => { c.innerHTML = resaltarJava(c.textContent); });

  renderCuentas();
  $$('.anat[data-anatomia]').forEach(renderAnatomia);
  if (hay('tiposDato')) renderTiposDato();
  if (hay('calcDiv')) initCalcDiv();
  if (hay('strLab')) initStrLab();
  if (hay('javaCheck')) renderJavaCheck();
  $$('.visual[data-programas]').forEach(initVisual);

  if (hay('fila')) initFila();
  if (hay('reglasEd')) renderReglasEd();
  if (hay('clasif')) initClasifica();
  if (hay('tiposRec')) renderTiposRec();

  if (hay('platos')) initPlatos();
  if (hay('rastreoJuego')) initRastreo();

  if (hay('ejTabs')) initEjemplos();

  if (hay('imprimeJuego')) initImprime();
  if (hay('errorJuego')) initErrores();
  if (hay('armarEd')) initArmar();
  if (hay('hanoiJuego')) initHanoi();
}
