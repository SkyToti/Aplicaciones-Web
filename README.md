# Repaso API REST — Aplicaciones Web

Cuaderno interactivo para repasar antes del examen de **Aplicaciones Web** (UTEZ).
Una sola página, pensada para estudiar desde el iPad.

## Qué trae

**Teoría**
- **La chuleta** — lo mínimo que hay que saberse, marcable.
- **¿Qué es una API?** — la analogía del restaurante, pieza por pieza.
- **REST en 6 reglas** — con la frase exacta que conviene decir en el examen.
- **Anatomía de un endpoint** — tocas cada parte de la URL y te dice cómo se llama.
- **Métodos HTTP** — los 5, con *seguro* e *idempotente*, y el duelo PUT vs PATCH.
- **Códigos de estado** — las 5 familias, explorador de 18 códigos y los duelos
  que más se confunden (401 vs 403, 400 vs 404 vs 422, 500 vs 503).
- **Arquitectura por capas** — el diagrama que va en la libreta.

**Práctica**
- **Simulador de peticiones** — armas una petición y ves qué código responde y por qué.
- **Juego de parejas** — empareja cada código con su significado, con récord de intentos.
- **Constructor de endpoints** — armas una ruta con bloques y te dice si está bien,
  qué hace y qué códigos devuelve.
- **Validador de rutas** — escribes una ruta tuya y te marca los errores.
- **Ordena las capas** — puzzle para fijar el orden de la arquitectura.
- **Quiz de 24 preguntas** con explicación de cada respuesta y diagnóstico final,
  con botón para compartir el resultado en cuadritos (estilo Wordle).
- **Arma tu propia API** — el alumno diseña la suya paso a paso, con validación en
  vivo de recursos y endpoints, y al final genera la hoja lista para la libreta.

**Los 6 giros de la actividad, resueltos** — veterinaria, gimnasio, cine, biblioteca,
restaurante y hospital. Cada uno con recursos en plural, 5 endpoints con su método,
JSON de ejemplo, códigos esperados y diagrama de capas.

## Detalles

- **Tema claro y oscuro**, con el botón de la barra. Arranca según el sistema.
- **Sonido opcional**, apagado por defecto: efectos cortos y lluvia en tres capas
  (siseo, cuerpo y gotas sueltas al azar) generada con Web Audio — cero archivos,
  cero descargas, cero derechos de autor.
- **Iconos de [Lucide](https://lucide.dev)** (ISC), no emojis.
- **Hoja imprimible**: el botón «Imprimir la chuleta» saca un PDF de 2 páginas con
  lo mínimo, los métodos, los códigos, las reglas y el diagrama. El resto de la
  página no se imprime.
- El avance se guarda en `localStorage`, en ese dispositivo.
- Diseño estilo cuaderno: tinta gruesa, sombras duras, color plano.
  Cada método HTTP y cada familia de códigos tiene su color, y siempre el mismo.

## Ver la página en local

```bash
node dev-server.js
```

Y entrar a <http://localhost:4321>.

## Cómo está hecho

HTML, CSS y JavaScript puros. Sin frameworks, sin dependencias, sin build.
Cinco archivos: `index.html`, `styles.css`, `app.js`, `sonido.js` y `armar.js`.
Lo único externo son dos tipografías de Google Fonts, con respaldo del sistema si no cargan.
