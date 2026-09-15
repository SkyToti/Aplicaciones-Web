# Cuaderno de repaso — UTEZ

Sitio de repaso para dos materias, pensado para estudiar desde el iPad o el celular:
**Aplicaciones Web** (API REST) y **Estructura de Datos** (por ahora, Recursividad en Java).

**https://skytoti.github.io/Aplicaciones-Web/**

La portada (`index.html`) muestra las dos materias con el avance de cada una. Cada materia tiene su
inicio, su ruta de estudio, su chuleta imprimible y su propio examen, y guarda su avance por separado.

## Aplicaciones Web · API REST

La ruta de estudio va en este orden; cada página lleva a la siguiente.

| Página | Qué tiene |
|---|---|
| **Inicio** (`aplicaciones-web.html`) | Cuenta regresiva, dónde te quedaste, tus fallos pendientes, la ruta de estudio con tu avance y la chuleta. |
| **Fundamentos** | Qué es una API (la analogía del restaurante), REST en 6 reglas, las partes de un endpoint, los métodos HTTP y la arquitectura por capas con su juego de ordenar. |
| **Códigos HTTP** | Las 5 familias, explorador de 18 códigos, los duelos que confunden (401 vs 403…) y el juego de parejas. |
| **Laboratorio** | Simulador de peticiones, constructor de endpoints por bloques y validador de rutas. |
| **El ejercicio** | Reglas de nombrado, los 6 giros de la actividad resueltos, taller para armar tu propia API y el checklist de la entrega. |
| **Examen** | Simulacro cronometrado, práctica libre y repaso de tus fallos. |

## Estructura de Datos · Recursividad

Explicada desde cero y en Java: no da nada por sabido, ni siquiera el lenguaje.

| Página | Qué tiene |
|---|---|
| **Inicio** (`estructura-datos.html`) | Dónde te quedaste, tus fallos pendientes, la ruta del tema y la chuleta de recursividad. |
| **Java desde cero** (`java-basico.html`) | Primer programa pieza por pieza, variables y tipos, `/` y `%` con calculadora, if y ciclos, métodos (parámetro vs argumento, imprimir no es devolver), arreglos y String con laboratorio, una llamada que espera a otra y autoevaluación. |
| **¿Qué es la recursividad?** (`recursividad.html`) | La fila del cine paso a paso, caso base y caso recursivo, las 3 reglas de oro, la receta para pensar un método recursivo, juego «¿caso base o recursivo?», tipos de recursión y recursión vs ciclos. |
| **La pila de llamadas** (`recursividad-pila.html`) | Qué es una pila (con platos), qué guarda un marco, **visualizador paso a paso** de 8 programas, ida y vuelta, prueba de escritorio con juego y StackOverflowError. |
| **Ejemplos resueltos** (`recursividad-ejemplos.html`) | 10 clásicos (de cuenta regresiva a Torres de Hanoi) con la idea en español, el código renglón por renglón, prueba de escritorio, errores típicos y el programa completo. |
| **Laboratorio** (`recursividad-laboratorio.html`) | ¿Qué imprime?, encuentra el error, arma tu propio método con bloques y Torres de Hanoi jugables. |
| **Examen** (`estructura-datos-examen.html`) | Los mismos tres modos que en Aplicaciones Web, con preguntas que traen código para leer. |

Enlaces directos que sirven para compartir: `recursividad-ejemplos.html#hanoi` abre ese ejemplo y
`recursividad-pila.html?ver=fibonacci&n=4#visualizador` abre el visualizador con ese programa.

### Todo el Java se probó

Cada ejemplo, cada «¿qué imprime?», cada «encuentra el error» (y su arreglo), cada pregunta con código y
cada bloque de Java escrito en las páginas se compiló y se corrió con Java 17 antes de publicarse: las
salidas que dice el sitio son las reales. **Si cambias un fragmento de Java, vuelve a probarlo.**

## El examen

- **Simulacro** — 10 preguntas repartidas entre todos los temas, con reloj (6 minutos en Aplicaciones Web,
  10 en Estructura de Datos). No ves si acertaste hasta entregar, puedes regresar a cambiar respuestas y,
  si se acaba el tiempo, se entrega solo. Al final: calificación, tiempo, revisión pregunta por pregunta e
  historial de tus últimos intentos.
- **Práctica libre** — todas las preguntas sin tiempo, con la explicación después de cada una.
- **Mis fallos** — toda pregunta que falles, en cualquier modo, se guarda aquí. Sale de la lista cuando
  la contestas bien **dos veces seguidas**: una sola puede ser suerte.
- **Compartir resultado** — genera el marcador en cuadritos para pegarlo en el grupo.

Los enlaces pueden abrir un modo directo: `examen.html#fallos`, `estructura-datos-examen.html#practica`.
El simulacro nunca arranca solo.

## Detalles

- **Cada materia tiene su color**: amarillo Aplicaciones Web, rosa Estructura de Datos. El botón junto al
  logo cambia de materia y lista todas las páginas de la materia en la que estás.
- **Tema claro y oscuro**, que se aplica antes de pintar la página para que no haya destello al navegar.
- **Sonido opcional**, apagado por defecto: efectos cortos, el tic de los últimos 10 segundos del simulacro
  y lluvia en tres capas (siseo, cuerpo y gotas). Todo generado con Web Audio: cero archivos.
  Si la lluvia venía sonando, sigue en la página nueva con el primer toque.
- **Hojas imprimibles estilo apuntes**: «Imprimir la chuleta» saca un PDF de 2 páginas de la materia en la
  que estás, con papel de cuadrícula, resaltador, notas adhesivas y diagramas dibujados. Lleva
  `print-color-adjust: exact`, que es lo que hace que los fondos de color salgan en el PDF.
- **Iconos de [Lucide](https://lucide.dev)** (ISC).
- **Tu avance se guarda en este dispositivo** (`localStorage`). Nadie más lo ve. «Borrar mi avance» borra
  solo el de la materia en la que estás.
- Los enlaces de versiones anteriores (una sola página con `#quiz`, `#giros`…, o `index.html#chuleta` de
  cuando la portada era la de API REST) redirigen a su página nueva.

## Cómo está hecho

HTML, CSS y JavaScript puros: sin frameworks, sin dependencias y sin paso de compilación.

| Archivo | Para qué |
|---|---|
| `datos.js` | **El contenido de Aplicaciones Web**: teoría, códigos, giros y preguntas. |
| `datos-ed.js` | **El contenido de Estructura de Datos**: chuleta, ejemplos, programas del visualizador, juegos y preguntas. |
| `nucleo.js` | Lo común a todas las páginas: las materias y sus páginas, menú, pie, tema, iconos, sonido, avance, el resaltador de Java y la hoja imprimible. El menú vive aquí, en un solo lugar. |
| `secciones.js` | Los bloques interactivos de Aplicaciones Web y los inicios de cada materia. Cada uno se enciende solo si su contenedor existe en la página. |
| `secciones-ed.js` | Los bloques interactivos de Estructura de Datos (visualizador, fila del cine, juegos, Hanoi…) y su hoja imprimible. |
| `examen.js` | Los tres modos del examen y la memoria de fallos, para la materia de la página. |
| `armar.js` | El taller «Arma tu propia API». |
| `sonido.js` | Los sonidos, generados en el navegador. |
| `styles.css` | Todos los estilos, incluidas las hojas imprimibles. |
| `versionar.js` | Le pone `?v=<huella>` a cada CSS y JS en las páginas. **Se corre después de cambiar cualquier `.css` o `.js`, antes del commit.** |

### Para agregar un tema a Estructura de Datos

1. Sus páginas se agregan a `PAGINAS` en `nucleo.js`, con `materia: 'ed'`, en el orden de estudio.
2. Su contenido va en `datos-ed.js` y sus bloques interactivos en `secciones-ed.js`.
3. Cada página nueva lleva `data-pagina` y `data-materia="ed"` en el `<body>`, y carga los mismos scripts que las demás.
4. Si guarda avance, sus llaves llevan el prefijo `ed_` y se agregan a `LLAVES_AVANCE.ed`, y su cálculo a `avancePagina`.

Las llaves de Aplicaciones Web no llevan prefijo porque son las de la primera versión del sitio:
**no se cambian**, o tus compañeros pierden su avance.

### Por qué existe `versionar.js`

GitHub Pages deja que el navegador guarde cada archivo 10 minutos. Si se publica un HTML nuevo y el navegador
todavía tiene el `styles.css` viejo, la página nueva se pinta con estilos que no conocen sus clases y sale sin
diseño: links azules subrayados y todo en un solo renglón. Pasó en la publicación del sitio de 6 páginas.
Con la huella en la URL, un archivo que cambió es otra dirección para el navegador, y uno que no cambió se sigue
aprovechando de la caché.

```bash
node versionar.js
```

Aun así, GitHub Pages no respeta el `?v=` (sirve el archivo más nuevo sea cual sea la huella), así que durante
esos 10 minutos una página vieja todavía puede juntar archivos viejos y nuevos. Por eso `examen.js` y
`secciones.js` revisan si el `nucleo.js` que tienen al lado ya conoce las materias y, si no, se portan como
Aplicaciones Web. Y la hoja imprimible se activa por omisión (`body.sin-hoja` la apaga), para que un
`nucleo.js` viejo siga imprimiendo la suya.

### Ver en local

```bash
node dev-server.js
```

Y entrar a <http://localhost:4321>. Para probar el fin de tiempo del simulacro sin esperar:
<http://localhost:4321/examen.html?seg=15> (o `estructura-datos-examen.html?seg=15`).
