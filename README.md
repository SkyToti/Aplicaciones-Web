# Repaso API REST — Aplicaciones Web

Página interactiva de repaso para el examen de **Aplicaciones Web** (UTEZ).
Pensada para estudiar desde el iPad: todo cabe en una sola página y funciona sin internet una vez cargada.

## Qué trae

- **Chuleta** — lo mínimo que hay que saberse de memoria, marcable.
- **¿Qué es una API?** — la analogía del restaurante, interactiva.
- **REST en 6 reglas** — con la frase exacta que conviene decir en el examen.
- **Anatomía de un endpoint** — toca cada parte de la URL y te dice cómo se llama.
- **Métodos HTTP** — GET, POST, PUT, PATCH, DELETE, con "seguro" e "idempotente".
- **Simulador de peticiones** — arma una petición y mira qué código responde y **por qué**.
- **Códigos de estado** — las 5 familias, explorador de 18 códigos y flashcards.
- **Reglas de diseño + validador de rutas** — escribe una ruta y te dice qué está mal.
- **Diagrama de capas** — el que hay que dibujar en la libreta.
- **Los 6 giros resueltos** — veterinaria, gimnasio, cine, biblioteca, restaurante y hospital,
  cada uno con recursos, 5 endpoints, JSON de ejemplo, códigos y diagrama.
- **Quiz de 24 preguntas** con explicación de cada respuesta.

El avance se guarda en el navegador (`localStorage`), en ese dispositivo.

## Ver la página

Publicada con GitHub Pages. También se puede abrir en local:

```bash
node dev-server.js
```

Y entrar a <http://localhost:4321>.

## Cómo está hecho

HTML, CSS y JavaScript puros. Sin frameworks, sin dependencias, sin build.
Tres archivos: `index.html`, `styles.css` y `app.js`.
