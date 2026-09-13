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

    alternarLluvia() {
      if (lluvia) { this.pararLluvia(); return false; }
      if (!arrancar()) return false;

      // ruido marrón: más grave y parejo que el blanco, es el que de verdad
      // ayuda a concentrarse. Se genera un buffer de 4 s y se pone en bucle.
      const seg = 4, n = ctx.sampleRate * seg;
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let ultimo = 0;
      for (let i = 0; i < n; i++) {
        const blanco = Math.random() * 2 - 1;
        ultimo = (ultimo + 0.02 * blanco) / 1.02;
        d[i] = ultimo * 3.2;
      }

      const fuente = ctx.createBufferSource();
      fuente.buffer = buf; fuente.loop = true;

      const filtro = ctx.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.value = 1100;
      filtro.Q.value = 0.6;

      const g = ctx.createGain();
      g.gain.value = 0.0001;

      // un vaivén lentísimo de volumen, para que suene a olas y no a estática
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.07;
      lfoG.gain.value = 0.06;
      lfo.connect(lfoG); lfoG.connect(g.gain);

      fuente.connect(filtro); filtro.connect(g); g.connect(ctx.destination);
      fuente.start(); lfo.start();
      g.gain.exponentialRampToValueAtTime(Math.max(0.02, cfg.vol * 0.34), ctx.currentTime + 1.2);

      lluvia = { fuente, g, filtro, lfo };
      cfg.lluviaOn = true;
      return true;
    },

    pararLluvia() {
      if (!lluvia) return;
      const { fuente, g, lfo } = lluvia;
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);   // se apaga suave
      setTimeout(() => { try { fuente.stop(); lfo.stop(); } catch (e) { } }, 900);
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
      if (lluvia) lluvia.g.gain.setTargetAtTime(Math.max(0.02, v * 0.34), ctx.currentTime, 0.1);
    }
  };

  return api;
})();

/* Ojo: `const` a nivel de script NO crea una propiedad en window, y el resto
   del código pregunta por `window.Sonido` antes de sonar. Sin esta línea los
   ganchos de sonido quedan mudos sin marcar ningún error. */
window.Sonido = Sonido;
