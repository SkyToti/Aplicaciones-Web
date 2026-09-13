# Repaso API REST — Aplicaciones Web

Sitio de repaso para el examen de **Aplicaciones Web** (UTEZ), pensado para estudiar desde el iPad o el celular.

**https://skytoti.github.io/Aplicaciones-Web/**

## Páginas

La ruta de estudio va en este orden; cada página lleva a la siguiente.

| Página | Qué tiene |
|---|---|
| **Inicio** | Cuenta regresiva, dónde te quedaste, tus fallos pendientes, la ruta de estudio con tu avance y la chuleta. |
| **Fundamentos** | Qué es una API (la analogía del restaurante), REST en 6 reglas, las partes de un endpoint, los métodos HTTP y la arquitectura por capas con su juego de ordenar. |
| **Códigos HTTP** | Las 5 familias, explorador de 18 códigos, los duelos que confunden (401 vs 403…) y el juego de parejas. |
| **Laboratorio** | Simulador de peticiones, constructor de endpoints por bloques y validador de rutas. |
| **El ejercicio** | Reglas de nombrado, los 6 giros de la actividad resueltos, taller para armar tu propia API y el checklist de la entrega. |
| **Examen** | Simulacro cronometrado, práctica libre y repaso de tus fallos. |

## El examen

- **Simulacro** — 10 preguntas repartidas entre todos los temas y 6 minutos de reloj. No ves si acertaste
  hasta entregar, puedes regresar a cambiar respuestas y, si se acaba el tiempo, se entrega solo.
  Al final: calificación, tiempo, revisión pregunta por pregunta e historial de tus últimos intentos.
- **Práctica libre** — las 24 preguntas sin tiempo, con la explicación después de cada una.
- **Mis fallos** — toda pregunta que falles, en cualquier modo, se guarda aquí. Sale de la lista cuando
  la contestas bien **dos veces seguidas**: una sola puede ser suerte.
- **Compartir resultado** — genera el marcador en cuadritos para pegarlo en el grupo.

Los enlaces pueden abrir un modo directo: `examen.html#fallos`, `examen.html#practica`.
El simulacro nunca arranca solo.

## Detalles

- **Tema claro y oscuro**, que se aplica antes de pintar la página para que no haya destello al navegar.
- **Sonido opcional**, apagado por defecto: efectos cortos, el tic de los últimos 10 segundos del simulacro
  y lluvia en tres capas (siseo, cuerpo y gotas). Todo generado con Web Audio: cero archivos.
  Si la lluvia venía sonando, sigue en la página nueva con el primer toque.
- **Hoja imprimible estilo apuntes**: «Imprimir la chuleta» saca un PDF de 2 páginas con papel de
  cuadrícula, resaltador, notas adhesivas y el diagrama de capas dibujado. Lleva
  `print-color-adjust: exact`, que es lo que hace que los fondos de color salgan en el PDF.
- **Iconos de [Lucide](https://lucide.dev)** (ISC).
- **Tu avance se guarda en este dispositivo** (`localStorage`). Nadie más lo ve.
- Los enlaces de la versión anterior (una sola página con `#quiz`, `#giros`…) redirigen a su página nueva.

## Cómo está hecho

HTML, CSS y JavaScript puros: sin frameworks, sin dependencias y sin paso de compilación.

| Archivo | Para qué |
|---|---|
| `datos.js` | **Todo el contenido**: teoría, códigos, giros y preguntas. Para corregir un dato o agregar una pregunta, solo se toca este. |
| `nucleo.js` | Lo común a todas las páginas: menú, pie, tema, iconos, sonido, avance y la hoja imprimible. El menú vive aquí, en un solo lugar. |
| `secciones.js` | Cada bloque interactivo. Se enciende solo si su contenedor existe en la página. |
| `examen.js` | Los tres modos del examen y la memoria de fallos. |
| `armar.js` | El taller «Arma tu propia API». |
| `sonido.js` | Los sonidos, generados en el navegador. |
| `styles.css` | Todos los estilos, incluida la hoja imprimible. |

### Ver en local

```bash
node dev-server.js
```

Y entrar a <http://localhost:4321>. Para probar el fin de tiempo del simulacro sin esperar 6 minutos:
<http://localhost:4321/examen.html?seg=15>.
