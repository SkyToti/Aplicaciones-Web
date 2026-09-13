// Pone ?v=<huella> a cada CSS y JS propio que cargan las páginas. Sin dependencias.
// Uso: node versionar.js   (después de cambiar cualquier .css o .js, antes del commit)
//
// Por qué: GitHub Pages deja que el navegador guarde cada archivo 10 minutos.
// Si se publica un HTML nuevo y el navegador aún tiene el styles.css viejo, la
// página nueva se pinta con estilos que no conocen sus clases y sale sin diseño.
// Con la huella en la URL, un archivo que cambió es otra dirección para el
// navegador, y uno que no cambió se sigue aprovechando de la caché.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const huella = archivo =>
  crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, archivo))).digest('hex').slice(0, 8);

let cambios = 0;
for (const pagina of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const ruta = path.join(ROOT, pagina);
  const antes = fs.readFileSync(ruta, 'utf8');
  // Solo archivos locales ("styles.css", "nucleo.js"): las URLs de CDN llevan https:// y no entran.
  const despues = antes.replace(/(href|src)="([\w-]+\.(?:css|js))(?:\?v=\w*)?"/g, (todo, attr, archivo) =>
    fs.existsSync(path.join(ROOT, archivo)) ? `${attr}="${archivo}?v=${huella(archivo)}"` : todo);
  if (despues !== antes) {
    fs.writeFileSync(ruta, despues);
    cambios++;
    console.log('actualizada', pagina);
  }
}
console.log(cambios ? `${cambios} página(s) con versiones nuevas` : 'todo al día');
