/* ============================================================
   Sonido — todo generado en el navegador con Web Audio.
   Cero archivos, cero derechos de autor, cero KB descargados.
   Arranca apagado: mucha gente abre esto en el salón.
   ============================================================ */

const Sonido = (() => {
  let ctx = null;
  let maestro = null;          // volumen general de efectos
  let lluvia = null;           // { fuente, gain, filtro, lfo }
  const cfg = {
    efectos: leer('snd_fx', false),
    lluviaOn: false,           // nunca se restaura sola: iOS exige un toque
    vol: leer('snd_vol', 0.5)
  };

  function leer(k, d) { try { const v = localStorage.getItem('rest_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function guardar(k, v) { try { localStorage.setItem('rest_' + k, JSON.stringify(v)); } catch (e) { } }

  /* El AudioContext solo puede crearse tras un toque del usuario (regla de iOS). */
  function arrancar() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      maestro = ctx.createGain();
      maestro.gain.value = cfg.vol;
      maestro.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  /* ---------- efectos cortos ---------- */
  function tono(freq, dur, tipo = 'sine', vol = 0.22, desliz = 0) {
    if (!cfg.efectos || !arrancar()) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t);
    if (desliz) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + desliz), t + dur);
    // envolvente suave: sin clics al empezar ni al terminar
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(maestro);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  const api = {
    /* un toque cualquiera */
    tic() { tono(1400, 0.035, 'sine', 0.07); },
    /* acertaste: dos notas que suben */
    bien() { tono(660, 0.11, 'sine', 0.2); setTimeout(() => tono(990, 0.16, 'sine', 0.18), 85); },
    /* fallaste: una nota grave que baja, sin ser agresiva */
    mal() { tono(300, 0.22, 'triangle', 0.16, -110); },
    /* encontraste una pareja: pluck cortito */
    pareja() { tono(880, 0.07, 'triangle', 0.16); setTimeout(() => tono(1320, 0.1, 'sine', 0.13), 60); },
    /* terminaste algo */
    fanfarria() {
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tono(f, 0.22, 'sine', 0.17), i * 105));
    },

    /* ---------- lluvia ---------- */
    lluviaActiva() { return !!lluvia; },

    /* La lluvia son TRES capas. Una sola capa de ruido filtrado grave suena a
       tormenta lejana, que es justo lo que no queremos:
         1. Siseo  — ruido agudo y parejo. Es el «shhh» del agua.
         2. Cuerpo — un colchón grave muy bajito, para que no suene a estática.
         3. Gotas  — golpecitos sueltos al azar. Esto es lo que el oído
                     reconoce como LLUVIA y no como ruido blanco.
       Las dos primeras son estéreo con ruido distinto en cada canal, que es
       lo que hace que suene ancho y relajado en vez de plano. */
    alternarLluvia() {
      if (lluvia) { this.pararLluvia(); return false; }
      if (!arrancar()) return false;

      const sr = ctx.sampleRate, seg = 6, n = sr * seg;

      // --- buffer de ruido estéreo, canales independientes ---
      const buf = ctx.createBuffer(2, n, sr);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      }

      const salida = ctx.createGain();
      salida.gain.value = 0.0001;
      salida.connect(ctx.destination);

      // --- 1) siseo: se le quita el retumbe grave y el filo agudo ---
      const siseo = ctx.createBufferSource();
      siseo.buffer = buf; siseo.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 900; hp.Q.value = 0.5;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 5200; lp.Q.value = 0.4;
      const gSiseo = ctx.createGain(); gSiseo.gain.value = 0.5;
      siseo.connect(hp); hp.connect(lp); lp.connect(gSiseo); gSiseo.connect(salida);

      // --- 2) cuerpo: colchón grave discreto, para que tenga calidez ---
      const cuerpo = ctx.createBufferSource();
      cuerpo.buffer = buf; cuerpo.loop = true;
      cuerpo.playbackRate.value = 0.8;          // desfasado del siseo
      const lpB = ctx.createBiquadFilter();
      lpB.type = 'lowpass'; lpB.frequency.value = 420; lpB.Q.value = 0.3;
      const gCuerpo = ctx.createGain(); gCuerpo.gain.value = 0.16;
      cuerpo.connect(lpB); lpB.connect(gCuerpo); gCuerpo.connect(salida);

      // --- vaivén lentísimo: la lluvia arrecia y se calma sola ---
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.035;               // un ciclo cada ~28 s
      lfoG.gain.value = 0.09;
      lfo.connect(lfoG); lfoG.connect(gSiseo.gain);

      siseo.start(); cuerpo.start(); lfo.start();

      // --- 3) gotas sueltas ---
      let vivo = true;
      const gota = () => {
        if (!vivo || !lluvia) return;
        const t = ctx.currentTime;
        const dur = 0.02 + Math.random() * 0.03;
        const src = ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        src.playbackRate.value = 0.9 + Math.random() * 0.5;

        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1400 + Math.random() * 3200;   // tono de cada gota
        bp.Q.value = 6 + Math.random() * 7;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.05, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        let destino = salida;
        if (ctx.createStereoPanner) {                       // cae a mono si no existe
          const pan = ctx.createStereoPanner();
          pan.pan.value = Math.random() * 1.6 - 0.8;        // cada gota en un lado
          pan.connect(salida); destino = pan;
        }
        src.connect(bp); bp.connect(g); g.connect(destino);
        src.start(t); src.stop(t + dur + 0.03);

        setTimeout(gota, 45 + Math.random() * 260);
      };
      setTimeout(gota, 120);

      // entra despacio: 2.5 s de fundido
      salida.gain.exponentialRampToValueAtTime(Math.max(0.02, cfg.vol * 0.4), ctx.currentTime + 2.5);

      lluvia = { siseo, cuerpo, lfo, salida, parar: () => { vivo = false; } };
      cfg.lluviaOn = true;
      return true;
    },

    pararLluvia() {
      if (!lluvia) return;
      const { siseo, cuerpo, lfo, salida, parar } = lluvia;
      parar();                                   // deja de programar gotas
      const t = ctx.currentTime;
      salida.gain.cancelScheduledValues(t);
      salida.gain.setValueAtTime(salida.gain.value, t);
      salida.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);   // se aleja suave
      setTimeout(() => { try { siseo.stop(); cuerpo.stop(); lfo.stop(); } catch (e) { } }, 1500);
      lluvia = null;
      cfg.lluviaOn = false;
    },

    /* ---------- ajustes ---------- */
    efectosActivos() { return cfg.efectos; },
    alternarEfectos() {
      cfg.efectos = !cfg.efectos;
      guardar('snd_fx', cfg.efectos);
      if (cfg.efectos) { arrancar(); this.tic(); }
      return cfg.efectos;
    },
    volumen() { return cfg.vol; },
    ponerVolumen(v) {
      cfg.vol = v; guardar('snd_vol', v);
      if (maestro) maestro.gain.value = v;
      if (lluvia) lluvia.salida.gain.setTargetAtTime(Math.max(0.02, v * 0.4), ctx.currentTime, 0.15);
    }
  };

  return api;
})();

/* Ojo: `const` a nivel de script NO crea una propiedad en window, y el resto
   del código pregunta por `window.Sonido` antes de sonar. Sin esta línea los
   ganchos de sonido quedan mudos sin marcar ningún error. */
window.Sonido = Sonido;
