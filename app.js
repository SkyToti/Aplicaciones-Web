/* ============================================================
   Repaso API REST — lógica y contenido
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; };

const store = {
  get(k, d) { try { const v = localStorage.getItem('rest_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('rest_' + k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem('rest_' + k); } catch (e) { } }
};

/* ============================================================
   DATOS
   ============================================================ */

const CHEAT = [
  { t: 'API = contrato', d: 'Reglas que dejan que dos programas se hablen sin saber cómo está hecho el otro por dentro.' },
  { t: 'REST = estilo', d: 'No es un lenguaje ni una librería. Es una <b>forma de diseñar</b> APIs: recursos + verbos HTTP.' },
  { t: 'Recurso = sustantivo en plural', d: '<code>/mascotas</code> sí. <code>/getMascota</code> no. La URL nombra la cosa, nunca la acción.' },
  { t: 'Los 5 verbos', d: '<b>GET</b> leer · <b>POST</b> crear · <b>PUT</b> reemplazar · <b>PATCH</b> modificar un pedazo · <b>DELETE</b> borrar.' },
  { t: 'Las 5 familias', d: '<b>1xx</b> info · <b>2xx</b> éxito · <b>3xx</b> redirección · <b>4xx</b> error del cliente · <b>5xx</b> error del servidor.' },
  { t: 'Los 3 que siempre caen', d: '<b>200</b> OK · <b>201</b> Created (se creó algo) · <b>404</b> Not Found (no existe).' },
  { t: 'Stateless', d: 'El servidor <b>no recuerda</b> la petición anterior. Cada una viaja completa y sola.' },
  { t: 'Idempotente', d: 'Repetirlo 10 veces deja lo mismo que hacerlo 1. GET, PUT y DELETE sí. <b>POST no.</b>' },
  { t: 'Las capas', d: 'Cliente → Controlador → Servicio → Repositorio → Base de datos. Y la respuesta de regreso.' },
  { t: 'JSON', d: 'El formato en que viajan los datos: pares <code>"clave": valor</code> entre llaves.' }
];

const RESTO = [
  { e: '🧑', n: 'Tú, el cliente', q: 'App / Frontend', d: 'Quien <b>quiere algo</b> y no sabe (ni le importa) cómo se cocina. En la vida real: tu app, la página web u otro sistema. Solo sabe <b>pedir</b>.' },
  { e: '📋', n: 'El menú', q: 'Documentación', d: 'La lista de lo que <b>puedes pedir</b> y cómo se llama cada cosa. En una API es la documentación: qué endpoints hay, qué mandar y qué te devuelven.' },
  { e: '🧑‍🍳', n: 'El mesero', q: 'LA API', d: '<b>Aquí está la respuesta del examen.</b> Recibe tu pedido en un formato acordado, lo lleva a la cocina y te trae el resultado. Nunca te deja entrar a la cocina. Eso es una API: el intermediario con reglas claras.' },
  { e: '🍳', n: 'La cocina', q: 'Servidor / Lógica', d: 'Donde <b>de verdad</b> pasa el trabajo. Tú no ves cómo lo hacen. Pueden cambiar de chef o de receta y a ti no te afecta mientras el plato llegue igual.' },
  { e: '🍝', n: 'El plato', q: 'La respuesta', d: 'Lo que te regresan: normalmente un <b>JSON</b> con los datos, más un <b>código de estado</b> que dice si salió bien o mal.' }
];

const REST_RULES = [
  { n: 1, t: 'Cliente – Servidor', d: 'Están separados. El cliente pide, el servidor responde. Puedes cambiar uno sin tocar el otro.', s: 'Di: «separación de responsabilidades».' },
  { n: 2, t: 'Sin estado', d: 'El servidor no guarda memoria entre peticiones. Cada petición lleva todo lo que necesita para entenderse sola.', s: 'Di: «cada petición es independiente y autocontenida».', star: true },
  { n: 3, t: 'Cacheable', d: 'Las respuestas pueden marcarse como guardables, para no volver a pedir lo mismo.', s: 'Di: «mejora el rendimiento y baja la carga».' },
  { n: 4, t: 'Interfaz uniforme', d: 'Todos los recursos se acceden igual: mismas URLs con sustantivos y los mismos verbos HTTP.', s: 'Di: «misma forma de acceder a todo».' },
  { n: 5, t: 'Sistema por capas', d: 'Entre cliente y servidor puede haber intermediarios (caché, seguridad) y el cliente ni se entera.', s: 'Di: «el cliente no sabe con quién habla realmente».' },
  { n: 6, t: 'Código bajo demanda', d: 'La única opcional. El servidor puede mandarle código ejecutable al cliente.', s: 'Di: «es la única opcional» y ganas un punto.' }
];

const URLP = [
  { t: 'https://', n: 'Protocolo', d: 'Cómo viajan los datos. <b>HTTPS</b> es HTTP cifrado. En producción, siempre HTTPS.' },
  { t: 'api.veterinaria.com', n: 'Host o dominio', d: 'La dirección del servidor donde vive la API. Suele usarse el subdominio <code>api.</code> para separarla del sitio web.' },
  { t: '/v1', n: 'Versión', d: 'La versión de la API. Sirve para cambiarla en el futuro <b>sin romper</b> a quien ya la usa.' },
  { t: '/mascotas', n: 'Recurso (colección)', d: 'La <b>colección</b> de cosas. Va en <b>plural</b> y es un <b>sustantivo</b>. Es el corazón de REST.' },
  { t: '/42', n: 'Identificador', d: 'Un elemento concreto de la colección. <code>/mascotas/42</code> es la mascota con id 42.' },
  { t: '/vacunas', n: 'Subrecurso', d: 'Una relación. <code>/mascotas/42/vacunas</code> son las vacunas <b>de esa</b> mascota.' },
  { t: '?desde=2026-01-01', n: 'Query params', d: 'Filtros, orden, búsqueda y paginación. Nunca los metas en la ruta: van después del <code>?</code>.' }
];

const METODOS = [
  { m: 'GET', bg: '#cfe0ff', t: 'Leer o consultar', d: 'Pide información y nunca modifica nada. Es el único "seguro".', ex: 'GET /v1/mascotas/42', safe: true, idem: true, c: '200' },
  { m: 'POST', bg: '#c8f0d8', t: 'Crear', d: 'Crea un elemento nuevo dentro de una colección. El servidor le asigna el id.', ex: 'POST /v1/mascotas', safe: false, idem: false, c: '201' },
  { m: 'PUT', bg: '#fff1c9', t: 'Reemplazar completo', d: 'Sustituye el recurso entero. Lo que no mandes se pierde.', ex: 'PUT /v1/mascotas/42', safe: false, idem: true, c: '200' },
  { m: 'PATCH', bg: '#e7e0ff', t: 'Modificar un pedazo', d: 'Cambia solo los campos que mandas. El resto queda intacto.', ex: 'PATCH /v1/mascotas/42', safe: false, idem: false, c: '200' },
  { m: 'DELETE', bg: '#ffd9da', t: 'Borrar', d: 'Elimina el recurso. Si lo repites ya no hay nada que borrar: el resultado final es el mismo.', ex: 'DELETE /v1/mascotas/42', safe: false, idem: true, c: '204' }
];

const FAMILIAS = [
  { n: '1xx', t: 'Informativas', bg: '#e6e3db', d: 'El servidor recibió la petición y sigue trabajando. Casi nunca las verás.', q: '«Espérame, ahí voy»', pr: false },
  { n: '2xx', t: 'Éxito', bg: '#c8f0d8', d: 'Todo salió bien: se recibió, se entendió y se procesó.', q: '«Listo, salió»', pr: true },
  { n: '3xx', t: 'Redirección', bg: '#cfe0ff', d: 'Lo que pediste está en otro lado. Hay que hacer algo más para llegar.', q: '«Búscalo en otra dirección»', pr: false },
  { n: '4xx', t: 'Error del CLIENTE', bg: '#fff1c9', d: 'La culpa es de quien pidió: URL mal escrita, datos incompletos o sin permiso.', q: '«Te equivocaste tú»', pr: true },
  { n: '5xx', t: 'Error del SERVIDOR', bg: '#ffd9da', d: 'La petición estaba bien, pero el servidor falló al procesarla.', q: '«Me equivoqué yo»', pr: true }
];

const MNEMO = [
  '<b>1xx</b> — «un momento»: todavía no hay resultado.',
  '<b>2xx</b> — «dos manos arriba»: todo bien.',
  '<b>3xx</b> — «te mando a otro lado»: redirección.',
  '<b>4xx</b> — piensa en el <b>404</b>: <b>tú</b> escribiste mal la dirección.',
  '<b>5xx</b> — piensa en el <b>500</b>: la página truena sola.',
  '<b>Y el truco final:</b> el <b>4</b> es de «<b>f</b>allaste tú», el <b>5</b> es de «<b>s</b>e cayó el servidor».'
];

const CODIGOS = [
  { c: 200, n: 'OK', f: '2xx', star: true, corto: 'Salió bien y aquí van los datos', d: 'Todo salió bien y te devuelvo la información. Es la respuesta normal de un GET, y también de un PUT o PATCH que devuelven el recurso actualizado.', ex: 'GET /v1/mascotas → 200 con la lista' },
  { c: 201, n: 'Created', f: '2xx', star: true, corto: 'Se creó un recurso nuevo', d: 'Se <b>creó</b> algo nuevo. Es la respuesta correcta de un POST. Suele traer la cabecera <code>Location</code> con la URL del recurso nuevo.', ex: 'POST /v1/mascotas → 201 + Location: /v1/mascotas/43' },
  { c: 204, n: 'No Content', f: '2xx', star: true, corto: 'Salió bien y no hay nada que devolver', d: 'Correcto, pero <b>sin cuerpo</b> en la respuesta. Es lo típico de un DELETE.', ex: 'DELETE /v1/mascotas/42 → 204' },
  { c: 301, n: 'Moved Permanently', f: '3xx', star: false, corto: 'Cambió de dirección para siempre', d: 'El recurso se movió <b>definitivamente</b>. Actualiza tus enlaces.', ex: 'La API pasó de /v1 a /v2' },
  { c: 302, n: 'Found', f: '3xx', star: false, corto: 'Redirección temporal', d: 'Por ahora está en otro lado, pero no cambies tus enlaces.', ex: 'Mantenimiento temporal' },
  { c: 304, n: 'Not Modified', f: '3xx', star: false, corto: 'No cambió, usa tu caché', d: 'No ha cambiado desde la última vez: usa tu copia guardada. Ahorra datos.', ex: 'GET con caché todavía válida' },
  { c: 400, n: 'Bad Request', f: '4xx', star: true, corto: 'La petición está mal formada', d: 'Falta un campo, el JSON está roto o el tipo de dato no cuadra.', ex: 'POST /v1/mascotas sin el campo "nombre"' },
  { c: 401, n: 'Unauthorized', f: '4xx', star: true, corto: 'No sé quién eres: autentícate', d: '<b>No sé quién eres.</b> Falta autenticarte o tu token no sirve. Está mal nombrado: debería decir «no autenticado».', ex: 'Petición sin token' },
  { c: 403, n: 'Forbidden', f: '4xx', star: true, corto: 'Sé quién eres, pero no puedes', d: '<b>Sé quién eres y aun así no te dejo.</b> Estás autenticado pero sin permiso para eso.', ex: 'Un usuario normal intenta borrar a otro' },
  { c: 404, n: 'Not Found', f: '4xx', star: true, corto: 'Eso no existe', d: '<b>No existe.</b> Ni la ruta ni el elemento con ese id. El más famoso de todos.', ex: 'GET /v1/mascotas/9999 sin ese id' },
  { c: 405, n: 'Method Not Allowed', f: '4xx', star: false, corto: 'Ese método no se permite ahí', d: 'La ruta existe, pero no con ese método. Por ejemplo, un DELETE sobre la colección completa.', ex: 'DELETE /v1/mascotas (sin id)' },
  { c: 409, n: 'Conflict', f: '4xx', star: false, corto: 'Choca con lo que ya existe', d: 'Conflicto con el estado actual: un duplicado, o alguien más ya lo modificó.', ex: 'Registrar un correo que ya existe' },
  { c: 422, n: 'Unprocessable', f: '4xx', star: false, corto: 'Se entiende, pero los valores no valen', d: 'El JSON se entiende, pero los <b>valores no son válidos</b> (edad negativa, fecha imposible). Es un 400 más fino.', ex: 'POST con "edad": -3' },
  { c: 429, n: 'Too Many Requests', f: '4xx', star: false, corto: 'Vas demasiado rápido', d: 'Estás pidiendo de más. Límite de velocidad.', ex: '1000 peticiones en un minuto' },
  { c: 500, n: 'Internal Server Error', f: '5xx', star: true, corto: 'Tronó el servidor', d: '<b>Falla del servidor.</b> Error no controlado. Tu petición estaba bien.', ex: 'Una excepción sin capturar' },
  { c: 502, n: 'Bad Gateway', f: '5xx', star: false, corto: 'Un intermedio recibió basura', d: 'Un servidor intermedio recibió una respuesta inválida de otro servidor.', ex: 'El proxy no pudo hablar con la app' },
  { c: 503, n: 'Service Unavailable', f: '5xx', star: true, corto: 'No está disponible ahorita', d: 'El servidor está <b>caído o saturado</b>, normalmente temporal.', ex: 'API en mantenimiento' },
  { c: 504, n: 'Gateway Timeout', f: '5xx', star: false, corto: 'Se acabó el tiempo de espera', d: 'Un intermediario esperó la respuesta y se le acabó el tiempo.', ex: 'La base de datos tardó demasiado' }
];

const DUELS = [
  { t: '200 vs 201 vs 204', r: [['200', 'Salió bien <b>y te devuelvo datos</b>. Típico de GET.'], ['201', 'Salió bien <b>y creé algo nuevo</b>. Típico de POST.'], ['204', 'Salió bien <b>y no hay nada que devolver</b>. Típico de DELETE.']] },
  { t: '401 vs 403', r: [['401', '<b>No sé quién eres.</b> Falta identificarte.'], ['403', '<b>Sé quién eres, pero no puedes.</b> Identificado y sin permiso.']] },
  { t: '400 vs 404 vs 422', r: [['400', 'Mandaste <b>mal la petición</b>.'], ['404', 'La petición está bien, pero <b>eso no existe</b>.'], ['422', 'Se entiende, pero los <b>valores no son válidos</b>.']] },
  { t: '500 vs 503', r: [['500', '<b>Tronó</b> el código del servidor.'], ['503', '<b>No está disponible</b>: apagado, saturado o en mantenimiento.']] }
];

const RULES = [
  { t: 'Sustantivos, nunca verbos', g: '/mascotas', b: '/obtenerMascotas', p: 'El <b>método HTTP</b> ya es el verbo. Ponerlo también en la URL es repetirlo mal.' },
  { t: 'Siempre en plural', g: '/mascotas/42', b: '/mascota/42', p: 'La colección es plural. El id de adentro apunta a uno solo, pero la colección sigue siendo plural.' },
  { t: 'Minúsculas y guiones', g: '/historial-clinico', b: '/HistorialClinico', p: 'Las URLs van en minúsculas y, si hay dos palabras, se separan con guion medio.' },
  { t: 'Jerarquía para relaciones', g: '/mascotas/42/vacunas', b: '/vacunasDeMascota?id=42', p: 'Si algo <b>pertenece</b> a otra cosa, se anida. Así se lee solo.' },
  { t: 'Filtros en query params', g: '/mascotas?especie=perro', b: '/mascotas/filtrar/perro', p: 'Filtrar, ordenar, buscar y paginar van después del <code>?</code>. No inventes rutas por filtro.' },
  { t: 'Versiona desde el día uno', g: '/v1/mascotas', b: '/mascotas', p: 'Te deja cambiar la API mañana sin romperle nada a nadie. Punto gratis en el examen.' }
];

const LAYERS = [
  { e: '📱', n: 'Cliente', s: 'App móvil, web u otro sistema', d: 'Es <b>quien pide</b>. Muestra la información y recoge lo que el usuario escribe. No tiene lógica de negocio ni toca la base de datos: solo habla con la API por HTTP.' },
  { e: '🚪', n: 'Controlador', s: 'Recibe la petición HTTP', d: 'La <b>puerta de entrada</b>. Recibe método y URL, valida que los datos vengan bien formados, llama al servicio y devuelve la respuesta con su <b>código de estado</b>. No calcula nada por su cuenta.' },
  { e: '🧠', n: 'Servicio', s: 'Las reglas del negocio', d: 'Donde viven <b>las reglas</b>: «no se agenda en domingo», «un socio moroso no entra». Es el cerebro. No sabe de HTTP ni de SQL.' },
  { e: '🗄️', n: 'Repositorio', s: 'Habla con la base de datos', d: 'El <b>traductor</b>. Convierte «dame la mascota 42» en la consulta concreta. Si mañana cambias de base de datos, solo se toca esta capa.' },
  { e: '💾', n: 'Base de datos', s: 'Donde viven los datos', d: 'El <b>almacén</b>. Guarda la información de forma permanente. No decide nada: guarda y entrega.' }
];

const GIROS = [
  {
    id: 'veterinaria', e: '🐶', n: 'Veterinaria', s: 'Una clínica que registra mascotas y sus citas médicas.',
    res: ['/mascotas', '/citas', '/veterinarios'],
    eps: [
      { m: 'GET', p: '/v1/mascotas', d: 'Lista todas las mascotas, con filtros y paginación.', c: [200] },
      { m: 'GET', p: '/v1/mascotas/{id}', d: 'Devuelve una mascota concreta.', c: [200, 404] },
      { m: 'POST', p: '/v1/mascotas', d: 'Registra una mascota nueva.', c: [201, 400] },
      { m: 'PUT', p: '/v1/mascotas/{id}', d: 'Actualiza todos los datos de la mascota.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/citas/{id}', d: 'Cancela una cita agendada.', c: [204, 404] }
    ],
    j: { r: 'POST /v1/mascotas', b: { nombre: 'Firulais', especie: 'perro', raza: 'labrador', edad: 4, duenoId: 17 } }
  },
  {
    id: 'gimnasio', e: '💪', n: 'Gimnasio', s: 'Control de socios, membresías y clases.',
    res: ['/socios', '/membresias', '/clases'],
    eps: [
      { m: 'GET', p: '/v1/socios', d: 'Lista los socios registrados.', c: [200] },
      { m: 'GET', p: '/v1/socios/{id}/membresias', d: 'Membresías de un socio.', c: [200, 404] },
      { m: 'POST', p: '/v1/socios', d: 'Da de alta a un socio nuevo.', c: [201, 400, 409] },
      { m: 'PATCH', p: '/v1/membresias/{id}', d: 'Renueva o cambia el estado de una membresía.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/clases/{id}', d: 'Cancela una clase programada.', c: [204, 404] }
    ],
    j: { r: 'POST /v1/socios', b: { nombre: 'Ana Rivera', correo: 'ana.rivera@correo.com', telefono: '7771234567', plan: 'mensual' } }
  },
  {
    id: 'cine', e: '🎬', n: 'Cine', s: 'Cartelera, funciones y venta de boletos.',
    res: ['/peliculas', '/funciones', '/boletos'],
    eps: [
      { m: 'GET', p: '/v1/peliculas', d: 'Cartelera completa.', c: [200] },
      { m: 'GET', p: '/v1/peliculas/{id}/funciones', d: 'Horarios de una película.', c: [200, 404] },
      { m: 'POST', p: '/v1/boletos', d: 'Compra un boleto para una función.', c: [201, 400, 409] },
      { m: 'GET', p: '/v1/boletos/{id}', d: 'Consulta un boleto comprado.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/boletos/{id}', d: 'Cancela un boleto.', c: [204, 404] }
    ],
    j: { r: 'POST /v1/boletos', b: { funcionId: 88, asiento: 'F12', clienteId: 24, precio: 95 } }
  },
  {
    id: 'biblioteca', e: '📚', n: 'Biblioteca', s: 'Acervo de libros y préstamos a usuarios.',
    res: ['/libros', '/prestamos', '/usuarios'],
    eps: [
      { m: 'GET', p: '/v1/libros', d: 'Lista el acervo, filtrable por autor o disponibilidad.', c: [200] },
      { m: 'GET', p: '/v1/libros/{id}', d: 'Ficha de un libro.', c: [200, 404] },
      { m: 'POST', p: '/v1/prestamos', d: 'Registra un préstamo.', c: [201, 400, 409] },
      { m: 'PATCH', p: '/v1/prestamos/{id}', d: 'Marca la devolución del libro.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/libros/{id}', d: 'Da de baja un libro del acervo.', c: [204, 404] }
    ],
    j: { r: 'POST /v1/prestamos', b: { libroId: 301, usuarioId: 12, fechaPrestamo: '2026-09-14', fechaLimite: '2026-09-28' } }
  },
  {
    id: 'restaurante', e: '🍕', n: 'Restaurante', s: 'Menú, pedidos y mesas.',
    res: ['/platillos', '/pedidos', '/mesas'],
    eps: [
      { m: 'GET', p: '/v1/platillos', d: 'Menú completo.', c: [200] },
      { m: 'POST', p: '/v1/pedidos', d: 'Crea un pedido nuevo.', c: [201, 400] },
      { m: 'GET', p: '/v1/pedidos/{id}', d: 'Estado de un pedido.', c: [200, 404] },
      { m: 'PATCH', p: '/v1/pedidos/{id}', d: 'Cambia el estado: en preparación, entregado.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/pedidos/{id}', d: 'Cancela un pedido.', c: [204, 404, 409] }
    ],
    j: { r: 'POST /v1/pedidos', b: { mesaId: 7, items: [{ platilloId: 3, cantidad: 2 }, { platilloId: 11, cantidad: 1 }], notas: 'Sin cebolla' } }
  },
  {
    id: 'hospital', e: '🏥', n: 'Hospital', s: 'Pacientes, expedientes y citas médicas.',
    res: ['/pacientes', '/citas', '/medicos'],
    eps: [
      { m: 'GET', p: '/v1/pacientes', d: 'Lista de pacientes registrados.', c: [200, 401] },
      { m: 'GET', p: '/v1/pacientes/{id}/citas', d: 'Citas de un paciente.', c: [200, 404] },
      { m: 'POST', p: '/v1/citas', d: 'Agenda una cita médica.', c: [201, 400, 409] },
      { m: 'PUT', p: '/v1/pacientes/{id}', d: 'Actualiza el expediente completo.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/citas/{id}', d: 'Cancela una cita.', c: [204, 404] }
    ],
    j: { r: 'POST /v1/citas', b: { pacienteId: 55, medicoId: 9, fecha: '2026-09-18T10:30:00', motivo: 'Consulta general' } }
  }
];

const CHECK = [
  'Mínimo <b>2 recursos en plural</b> (aquí van 3, mejor)',
  '<b>5 endpoints</b> principales, cada uno con su método HTTP',
  '<b>1 JSON de ejemplo</b> (petición o respuesta)',
  'Los <b>códigos de estado</b> esperados (200, 201, 404…)',
  '<b>Diagrama de arquitectura por capas</b>',
  'Hecho <b>en la libreta</b> y con fotos tomadas',
  '<b>FIRMADO</b> — lo piden explícitamente'
];

const QUIZ = [
  { tema: 'Concepto', q: '¿Qué es una API, en una frase?', o: ['Una base de datos en la nube', 'Un contrato que permite que dos programas se comuniquen', 'Un lenguaje de programación para web', 'El servidor donde se guarda la página'], r: 1, e: 'Una API es la <b>interfaz o contrato</b>: define cómo se le pide algo a un sistema y qué devuelve, sin exponer cómo está hecho por dentro.' },
  { tema: 'REST', q: 'REST significa…', o: ['Remote Estate Transfer', 'Representational State Transfer', 'Request Event Standard Transport', 'Relational Endpoint Service Type'], r: 1, e: '<b>RE</b>presentational <b>S</b>tate <b>T</b>ransfer. Es un <b>estilo de arquitectura</b>, no un protocolo ni una librería.' },
  { tema: 'REST', q: '¿Qué significa que una API REST sea «stateless»?', o: ['Que no guarda datos en la base de datos', 'Que el servidor no recuerda peticiones anteriores: cada petición viaja completa', 'Que no tiene estados de error', 'Que solo funciona con GET'], r: 1, e: 'Sin estado = el servidor <b>no guarda memoria</b> entre una petición y otra. Por eso el token va en <b>cada</b> petición.' },
  { tema: 'Recursos', q: '¿Cuál de estas rutas está bien diseñada en REST?', o: ['/obtenerMascotas', '/mascota/borrar/42', '/mascotas/42', '/API/GetMascota?id=42'], r: 2, e: 'Sustantivo, en <b>plural</b>, sin verbos, con el id como parte de la ruta. El verbo lo pone el método HTTP.' },
  { tema: 'Métodos', q: '¿Qué método se usa para CREAR un recurso nuevo?', o: ['GET', 'POST', 'PUT', 'DELETE'], r: 1, e: '<b>POST</b> sobre la colección crea un elemento nuevo y responde <b>201 Created</b>.' },
  { tema: 'Métodos', q: 'Quieres cambiar SOLO el teléfono de un socio. ¿Qué método usas?', o: ['PUT', 'PATCH', 'POST', 'GET'], r: 1, e: '<b>PATCH</b> es el cambio parcial. <b>PUT</b> reemplazaría el recurso completo y borraría lo que no mandes.' },
  { tema: 'Métodos', q: '¿Cuál de estos métodos NO es idempotente?', o: ['GET', 'PUT', 'DELETE', 'POST'], r: 3, e: '<b>POST no es idempotente</b>: si lo repites 5 veces creas 5 registros. Los otros tres dejan el mismo estado final.' },
  { tema: 'Métodos', q: '¿Cuál es el único método «seguro» (safe), porque no modifica nada?', o: ['POST', 'GET', 'PATCH', 'DELETE'], r: 1, e: '<b>GET</b> solo lee. Los demás modifican el estado del servidor.' },
  { tema: 'Códigos', q: 'Las familias de códigos HTTP son…', o: ['1xx, 2xx, 3xx, 4xx, 5xx', '100, 200, 300', '2xx, 4xx, 6xx', 'OK, ERROR, WARNING'], r: 0, e: 'Cinco: <b>1xx</b> informativas, <b>2xx</b> éxito, <b>3xx</b> redirección, <b>4xx</b> error del cliente, <b>5xx</b> error del servidor.' },
  { tema: 'Códigos', q: 'La familia <b>4xx</b> indica…', o: ['Error del servidor', 'Error del cliente', 'Éxito', 'Redirección'], r: 1, e: '<b>4xx es culpa del cliente</b>: pidió algo que no existe, mandó datos mal o no tiene permiso. Piensa en el 404.' },
  { tema: 'Códigos', q: 'La familia <b>5xx</b> indica…', o: ['Que el cliente mandó mal los datos', 'Que el recurso se movió', 'Que el servidor falló al procesar una petición válida', 'Que todo salió bien'], r: 2, e: '<b>5xx es culpa del servidor</b>. La petición estaba bien, pero algo tronó del otro lado.' },
  { tema: 'Códigos', q: 'Haces <code>POST /v1/mascotas</code> y se registra bien. ¿Qué código esperas?', o: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'], r: 1, e: '<b>201 Created</b> es el correcto al crear un recurso nuevo. Suele venir con la cabecera <code>Location</code>.' },
  { tema: 'Códigos', q: 'Haces <code>GET /v1/mascotas/9999</code> y ese id no existe. ¿Qué código?', o: ['400', '403', '404', '500'], r: 2, e: '<b>404 Not Found</b>: la ruta es válida pero el elemento no existe.' },
  { tema: 'Códigos', q: 'Un <code>DELETE</code> exitoso que no devuelve nada en el cuerpo responde…', o: ['200 OK', '201 Created', '204 No Content', '404 Not Found'], r: 2, e: '<b>204 No Content</b>: salió bien y no hay nada que devolver.' },
  { tema: 'Códigos', q: 'Diferencia entre <b>401</b> y <b>403</b>:', o: ['Son lo mismo', '401 = no sé quién eres; 403 = sé quién eres pero no puedes', '401 = error del servidor; 403 = error del cliente', '401 = recurso movido; 403 = recurso borrado'], r: 1, e: '<b>401</b> = falta autenticarte. <b>403</b> = estás autenticado pero sin permiso.' },
  { tema: 'Códigos', q: 'Mandas un POST con el JSON incompleto: falta un campo obligatorio. ¿Qué código?', o: ['400 Bad Request', '404 Not Found', '500 Internal Server Error', '201 Created'], r: 0, e: '<b>400 Bad Request</b>: la petición está mal formada. Error del cliente, familia 4xx.' },
  { tema: 'Códigos', q: 'El código de la API lanza una excepción no controlada. ¿Qué devuelve?', o: ['400', '404', '500', '204'], r: 2, e: '<b>500 Internal Server Error</b>: falla inesperada del servidor. La petición del cliente estaba bien.' },
  { tema: 'Diseño', q: '¿Dónde van los filtros, como buscar solo perros?', o: ['En la ruta: /mascotas/filtrar/perro', 'En query params: /mascotas?especie=perro', 'En el método HTTP', 'En el código de estado'], r: 1, e: 'Filtrar, ordenar, buscar y paginar van en <b>query params</b>, después del <code>?</code>.' },
  { tema: 'Diseño', q: '¿Cómo expresas «las vacunas de la mascota 42»?', o: ['/vacunas?mascota=42&tipo=todas', '/mascotas/42/vacunas', '/getVacunasDeMascota/42', '/vacunas/mascotas/42'], r: 1, e: 'Las relaciones se expresan con <b>jerarquía</b>: <code>/mascotas/42/vacunas</code>.' },
  { tema: 'Capas', q: '¿Cuál es el orden correcto de las capas?', o: ['Base de datos → Cliente → Servicio → Controlador', 'Cliente → Controlador → Servicio → Repositorio → Base de datos', 'Cliente → Base de datos → Servicio', 'Controlador → Cliente → Repositorio → Servicio'], r: 1, e: 'La petición baja: <b>Cliente → Controlador → Servicio → Repositorio → Base de datos</b>, y la respuesta sube por el mismo camino.' },
  { tema: 'Capas', q: '¿En qué capa viven las reglas del negocio, por ejemplo «no se agenda en domingo»?', o: ['En el cliente', 'En el controlador', 'En la capa de servicio', 'En la base de datos'], r: 2, e: 'La <b>capa de servicio</b> es el cerebro: ahí viven las reglas. El controlador solo recibe y responde HTTP.' },
  { tema: 'Concepto', q: '¿En qué formato viajan normalmente los datos en una API REST moderna?', o: ['XML', 'JSON', 'CSV', 'HTML'], r: 1, e: '<b>JSON</b> es el estándar: ligero, legible y lo entiende cualquier lenguaje.' },
  { tema: 'Diseño', q: '¿Para qué sirve poner <code>/v1/</code> en la URL?', o: ['Para que cargue más rápido', 'Para versionar la API y poder cambiarla sin romper a quien ya la usa', 'Es obligatorio en HTTP', 'Para indicar que usa HTTPS'], r: 1, e: '<b>Versionado</b>: te deja sacar una v2 con cambios sin tumbar a los clientes de la v1.' },
  { tema: 'Códigos', q: 'Haces <code>GET /v1/mascotas</code> y no hay ninguna registrada. ¿Qué responde?', o: ['404, porque no hay nada', '204, porque está vacío', '200 con una lista vacía []', '500'], r: 2, e: 'Trampa clásica. La <b>colección sí existe</b>, solo está vacía: es <b>200 con un arreglo vacío</b>. El 404 sería si la ruta o el elemento no existieran.' }
];

/* ============================================================
   TEMA
   ============================================================ */
function initTema() {
  const guardado = store.get('tema', null);
  const oscuro = guardado != null ? guardado : window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(oscuro);
  $('#themeBtn').addEventListener('click', () => {
    const ahora = document.documentElement.getAttribute('data-theme') !== 'dark';
    aplicarTema(ahora); store.set('tema', ahora);
  });
}
function aplicarTema(oscuro) {
  document.documentElement.setAttribute('data-theme', oscuro ? 'dark' : 'light');
  $('#themeBtn').textContent = oscuro ? '☀️' : '🌙';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', oscuro ? '#1b1a21' : '#f7f1e3');
}

/* ============================================================
   RENDER
   ============================================================ */
const famBg = f => (FAMILIAS.find(x => x.n === f) || {}).bg || '#e6e3db';
const metBg = m => (METODOS.find(x => x.m === m) || {}).bg || '#e6e3db';

function renderCheat() {
  const done = store.get('cheat', []);
  const g = $('#cheats'); g.innerHTML = '';
  CHEAT.forEach((c, i) => {
    const n = el('div', 'cheat' + (done.includes(i) ? ' done' : ''), `<span class="mark">✓</span><h4>${c.t}</h4><p>${c.d}</p>`);
    n.addEventListener('click', () => {
      const d = store.get('cheat', []); const k = d.indexOf(i);
      if (k > -1) d.splice(k, 1); else d.push(i);
      store.set('cheat', d); renderCheat(); progreso();
    });
    g.appendChild(n);
  });
  $('#cheatCount').textContent = `${done.length} de ${CHEAT.length} dominadas`;
}

function renderResto() {
  const g = $('#resto'); g.innerHTML = '';
  RESTO.forEach(p => {
    const n = el('div', 'resto-p', `<span class="e">${p.e}</span><div class="n">${p.n}</div><div class="q">${p.q}</div>`);
    n.addEventListener('click', () => {
      $$('.resto-p').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#restoOut').innerHTML = `<h4>${p.e} ${p.n} → ${p.q}</h4><p>${p.d}</p>`;
    });
    g.appendChild(n);
  });
}

function renderRest() {
  const g = $('#rest'); g.innerHTML = '';
  REST_RULES.forEach(r => g.appendChild(el('div', 'rest-c' + (r.star ? ' star' : ''),
    `<div class="n2">${r.n}</div><h4>${r.t}${r.star ? ' ⭐' : ''}</h4><p>${r.d}</p><p class="say">💬 ${r.s}</p>`)));
}

function renderUrl() {
  const g = $('#url'); g.innerHTML = '';
  URLP.forEach(p => {
    const n = el('span', 'u-part', p.t);
    n.addEventListener('click', () => {
      $$('.u-part').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#urlOut').innerHTML = `<h4>${p.n}</h4><p><code>${p.t}</code> — ${p.d}</p>`;
    });
    g.appendChild(n);
  });
}

function renderMets() {
  const g = $('#mets'); g.innerHTML = '';
  METODOS.forEach(m => {
    const n = el('div', 'met', `
      <div class="met-h" style="background:${m.bg}"><span class="m">${m.m}</span><span class="c">${m.c}</span></div>
      <div class="met-b">
        <div class="t">${m.t}</div><p>${m.d}</p>
        <div class="ex">${m.ex}</div>
        <div class="flags">
          <span class="flag ${m.safe ? 'y' : 'n'}">${m.safe ? '✓' : '✗'} Seguro</span>
          <span class="flag ${m.idem ? 'y' : 'n'}">${m.idem ? '✓' : '✗'} Idempotente</span>
        </div>
      </div>`);
    g.appendChild(n);
  });
}

function renderFams() {
  const g = $('#fams'); g.innerHTML = '';
  FAMILIAS.forEach(f => {
    const n = el('div', 'fam', `${f.pr ? '<span class="pr">PRINCIPAL</span>' : ''}
      <div class="nn">${f.n}</div><h4>${f.t}</h4><p>${f.d}</p><div class="q">${f.q}</div>`);
    n.style.background = f.bg;
    g.appendChild(n);
  });
  $('#mnemo').innerHTML = MNEMO.map(m => `<li>${m}</li>`).join('');
}

let filtro = 'todos';
function renderFilters() {
  const g = $('#filters'); g.innerHTML = '';
  ['todos', '2xx', '3xx', '4xx', '5xx', '⭐ clave'].forEach(k => {
    const b = el('button', 'fbtn' + (k === filtro ? ' on' : ''), k);
    b.addEventListener('click', () => { filtro = k; renderFilters(); renderCodes(); });
    g.appendChild(b);
  });
}

function renderCodes() {
  const g = $('#codes'); g.innerHTML = '';
  CODIGOS.filter(c => filtro === 'todos' || (filtro === '⭐ clave' ? c.star : c.f === filtro)).forEach(c => {
    const n = el('div', 'code', `${c.star ? '<span class="st">⭐</span>' : ''}<b>${c.c}</b><span>${c.n}</span>`);
    n.style.background = famBg(c.f);
    n.addEventListener('click', () => {
      $$('.code').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#codeOut').innerHTML = `
        <h4><span style="font-family:var(--mono)">${c.c}</span> · ${c.n} ${c.star ? '⭐' : ''}</h4>
        <p>${c.d}</p>
        <p style="margin:0"><span style="background:${famBg(c.f)};color:#1a1712;border:2px solid var(--line);border-radius:7px;padding:2px 9px;font-weight:800;font-size:.8rem">familia ${c.f}</span>
        &nbsp; <span style="font-family:var(--mono);font-size:.85rem">${c.ex}</span></p>`;
    });
    g.appendChild(n);
  });
}

function renderDuels() {
  const g = $('#duels'); g.innerHTML = '';
  DUELS.forEach(d => g.appendChild(el('div', 'duel', `<h4>${d.t}</h4>` +
    d.r.map(r => `<div class="duel-r"><span class="duel-c">${r[0]}</span><span class="duel-t">${r[1]}</span></div>`).join(''))));
}

function renderRules() {
  const g = $('#rules'); g.innerHTML = '';
  RULES.forEach(r => g.appendChild(el('div', 'rule',
    `<h4>${r.t}</h4><div class="ok-line">✅ <span>${r.g}</span></div><div class="bad-line">❌ <span>${r.b}</span></div><p>${r.p}</p>`)));
}

function renderLayers() {
  const g = $('#layers'); g.innerHTML = '';
  LAYERS.forEach((l, i) => {
    const n = el('div', 'layer', `<span class="e">${l.e}</span><div><div class="nm">${i + 1}. ${l.n}</div><div class="sh2">${l.s}</div></div>`);
    n.addEventListener('click', () => {
      $$('.layer').forEach(x => x.classList.remove('on')); n.classList.add('on');
      $('#layerOut').innerHTML = `<h4>${l.e} ${l.n}</h4><p>${l.d}</p>`;
    });
    g.appendChild(n);
    if (i < LAYERS.length - 1) g.appendChild(el('div', 'arrow', '↓'));
  });
}

/* ---------- juego: ordena las capas ---------- */
let ordState = [];
function nuevoOrden() {
  do { ordState = shuffle(LAYERS.map((_, i) => i)); } while (ordState.every((v, i) => v === i));
  $('#ordMsg').textContent = '';
  pintarOrden();
}
function pintarOrden(marcar) {
  const g = $('#order'); g.innerHTML = '';
  ordState.forEach((idx, pos) => {
    const l = LAYERS[idx];
    const cls = marcar ? (idx === pos ? ' good' : ' bad') : '';
    const n = el('div', 'ord' + cls, `<span class="e">${l.e}</span><span class="t">${l.n}</span>
      <span class="ord-btns"><button data-d="-1" aria-label="Subir">↑</button><button data-d="1" aria-label="Bajar">↓</button></span>`);
    $$('button', n).forEach(b => b.addEventListener('click', () => {
      const d = +b.dataset.d, np = pos + d;
      if (np < 0 || np >= ordState.length) return;
      [ordState[pos], ordState[np]] = [ordState[np], ordState[pos]];
      pintarOrden();
    }));
    g.appendChild(n);
  });
}
function comprobarOrden() {
  const bien = ordState.every((v, i) => v === i);
  pintarOrden(true);
  $('#ordMsg').textContent = bien ? '🎉 ¡Exacto! Ese es el orden.' : 'Todavía no. Las verdes están en su lugar.';
  if (window.Sonido) bien ? Sonido.fanfarria() : Sonido.mal();
  if (bien) { store.set('orden', true); progreso(); }
}

/* ---------- juego: parejas ---------- */
let mSel = null, mHits = 0, mTries = 0, mLock = false;
function nuevaRonda() {
  const elegidos = shuffle(CODIGOS.filter(c => c.star)).slice(0, 6);
  const cartas = shuffle(
    elegidos.map(c => ({ id: c.c, cara: String(c.c), tipo: 'code' }))
      .concat(elegidos.map(c => ({ id: c.c, cara: c.corto, tipo: 'txt' })))
  );
  mSel = null; mHits = 0; mTries = 0; mLock = false;
  $('#mPairs').textContent = '0/6'; $('#mTries').textContent = '0'; $('#mMsg').textContent = '';
  const g = $('#match'); g.innerHTML = '';
  cartas.forEach(c => {
    const n = el('div', 'm-card' + (c.tipo === 'code' ? ' code-face' : ''), c.cara);
    n.dataset.id = c.id; n.dataset.tipo = c.tipo;
    n.addEventListener('click', () => tocarCarta(n));
    g.appendChild(n);
  });
  const best = store.get('mBest', null);
  $('#mBest').textContent = best == null ? '–' : best + ' intentos';
}
function tocarCarta(n) {
  if (mLock || n.classList.contains('hit') || n === mSel) return;
  if (window.Sonido) Sonido.tic();
  if (!mSel) { mSel = n; n.classList.add('sel'); return; }
  if (mSel.dataset.tipo === n.dataset.tipo) { mSel.classList.remove('sel'); mSel = n; n.classList.add('sel'); return; }

  mTries++; $('#mTries').textContent = mTries;
  if (mSel.dataset.id === n.dataset.id) {
    mSel.classList.remove('sel'); mSel.classList.add('hit'); n.classList.add('hit');
    mSel = null; mHits++; $('#mPairs').textContent = mHits + '/6';
    if (window.Sonido) mHits === 6 ? Sonido.fanfarria() : Sonido.pareja();
    if (mHits === 6) {
      const best = store.get('mBest', null);
      const record = best == null || mTries < best;
      if (record) { store.set('mBest', mTries); $('#mBest').textContent = mTries + ' intentos'; }
      $('#mMsg').textContent = record ? `🏆 ¡Ronda completa en ${mTries} intentos! Nuevo récord.` : `✅ Ronda completa en ${mTries} intentos.`;
      store.set('parejas', true); progreso();
    } else {
      $('#mMsg').textContent = '✅ ¡Va!';
    }
  } else {
    mLock = true;
    const a = mSel, b = n;
    if (window.Sonido) Sonido.mal();
    a.classList.remove('sel'); a.classList.add('miss'); b.classList.add('miss');
    $('#mMsg').textContent = '❌ Esa no.';
    setTimeout(() => { a.classList.remove('miss'); b.classList.remove('miss'); mLock = false; }, 420);
    mSel = null;
  }
}

/* ---------- constructor de endpoints ---------- */
const B = {
  metodo: 'GET',
  version: '/v1',
  recurso: '/mascotas',
  id: '',
  sub: '',
  query: ''
};
const BGROUPS = [
  { k: 'metodo', t: 'Método', op: [['GET', 'GET'], ['POST', 'POST'], ['PUT', 'PUT'], ['PATCH', 'PATCH'], ['DELETE', 'DELETE']] },
  { k: 'version', t: 'Versión', op: [['/v1', '/v1'], ['', 'sin versión']] },
  { k: 'recurso', t: 'Recurso', op: [['/mascotas', '/mascotas'], ['/citas', '/citas'], ['/mascota', '/mascota'], ['/getMascotas', '/getMascotas']] },
  { k: 'id', t: 'Identificador', op: [['', 'sin id'], ['/42', '/42']] },
  { k: 'sub', t: 'Subrecurso', op: [['', 'ninguno'], ['/vacunas', '/vacunas']] },
  { k: 'query', t: 'Query params', op: [['', 'ninguno'], ['?especie=perro', '?especie=perro']] }
];

function renderBuilder() {
  const g = $('#bGroups'); g.innerHTML = '';
  BGROUPS.forEach(gr => {
    const box = el('div', 'bgroup', `<div class="bgroup-t">${gr.t}</div>`);
    const row = el('div', 'bblocks');
    gr.op.forEach(([val, lbl]) => {
      const b = el('button', 'bblock' + (B[gr.k] === val ? ' on' : ''), lbl);
      b.addEventListener('click', () => { B[gr.k] = val; renderBuilder(); });
      row.appendChild(b);
    });
    box.appendChild(row); g.appendChild(box);
  });
  evaluarBuilder();
}

function evaluarBuilder() {
  const ruta = B.version + B.recurso + B.id + B.sub + B.query;
  $('#bMet').textContent = B.metodo;
  $('#bMet').style.background = metBg(B.metodo);
  $('#bPath').textContent = ruta || '/';

  const problemas = [];
  if (B.recurso === '/getMascotas') problemas.push('<b>/getMascotas</b> lleva un verbo dentro. El verbo ya lo pone el método HTTP: debe ser <b>/mascotas</b>.');
  if (B.recurso === '/mascota') problemas.push('<b>/mascota</b> está en singular. Los recursos van en <b>plural</b>: <b>/mascotas</b>.');
  if (B.sub && !B.id) problemas.push('Pusiste un subrecurso sin id. <b>/mascotas/vacunas</b> no dice de cuál mascota: falta el <b>/42</b>.');
  if (B.query && B.id) problemas.push('Con un id ya estás pidiendo <b>uno solo</b>: el filtro del <code>?</code> sobra, sirve para filtrar colecciones.');
  if (!B.version) problemas.push('Sin versión funciona, pero <b>/v1</b> te deja cambiar la API mañana sin romper nada. (Detalle, no error grave.)');

  if (B.metodo === 'POST' && B.id) problemas.push('<b>POST</b> va sobre la colección, no sobre un id: el servidor asigna el id, tú no. Devolvería <b>405</b>.');
  if ((B.metodo === 'PUT' || B.metodo === 'PATCH' || B.metodo === 'DELETE') && !B.id) problemas.push(`<b>${B.metodo}</b> necesita saber <b>cuál</b> elemento. Sin id devolvería <b>405</b>.`);

  const grave = problemas.some((p, i) => !p.startsWith('Sin versión'));
  const v = $('#bVerdict');

  if (grave) {
    v.className = 'build-verdict v-no';
    v.innerHTML = '<b>❌ Algo no cuadra</b><ul style="margin:6px 0 0">' + problemas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    return;
  }

  const plural = B.recurso.replace('/', '');
  const cosa = B.sub ? B.sub.replace('/', '') : plural;
  let hace, codigo;
  if (B.metodo === 'GET' && !B.id) { hace = `Devuelve la colección completa de <b>/${cosa}</b>${B.query ? ', filtrada por especie' : ''}.`; codigo = '200 OK · y 200 con lista vacía si no hay ninguno'; }
  else if (B.metodo === 'GET' && B.id && !B.sub) { hace = `Devuelve el elemento con id 42 de <b>/${plural}</b>.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'GET' && B.sub) { hace = `Devuelve los elementos de <b>/${cosa}</b> que pertenecen al 42 de /${plural}.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'POST') { hace = `Crea un elemento nuevo dentro de <b>/${cosa}</b>.`; codigo = '201 Created · 400 si el cuerpo viene mal'; }
  else if (B.metodo === 'PUT') { hace = `Reemplaza <b>por completo</b> el elemento 42. Lo que no mandes se pierde.`; codigo = '200 OK · 404 si no existe'; }
  else if (B.metodo === 'PATCH') { hace = `Cambia <b>solo los campos que mandes</b> del elemento 42.`; codigo = '200 OK · 404 si no existe'; }
  else { hace = `Borra el elemento 42.`; codigo = '204 No Content · 404 si no existe'; }

  v.className = 'build-verdict v-ok';
  v.innerHTML = `<b>✅ Bien formado</b>
    <p style="margin:6px 0 4px">${hace}</p>
    <p style="margin:0"><b>Códigos esperados:</b> <span style="font-family:var(--mono)">${codigo}</span></p>
    ${problemas.length ? '<p style="margin:8px 0 0;font-size:.87rem">💡 ' + problemas[0] + '</p>' : ''}`;
}

/* ---------- validador ---------- */
function validar(ruta) {
  const out = [], r = (ruta || '').trim();
  if (!r) return [['warn', 'Escribe una ruta para revisarla.']];
  if (!r.startsWith('/')) out.push(['err', 'Debe empezar con <b>/</b>.']);
  const sq = r.split('?')[0], partes = sq.split('/').filter(Boolean);
  if (/[A-Z]/.test(sq)) out.push(['err', 'Tiene <b>mayúsculas</b>. Las URLs van en minúsculas.']);
  const verbos = ['get', 'post', 'obtener', 'crear', 'borrar', 'eliminar', 'actualizar', 'listar', 'buscar', 'consultar', 'agregar', 'insertar', 'update', 'delete', 'create', 'add', 'filtrar', 'guardar', 'editar', 'modificar', 'registrar', 'traer', 'ver'];
  const cv = partes.find(p => verbos.some(v => p.toLowerCase() === v || (p.toLowerCase().startsWith(v) && p.length > v.length && /[A-Z-]/.test(p[v.length] || ''))));
  if (cv) out.push(['err', `<b>«${cv}»</b> parece un verbo. El verbo lo pone el método HTTP, no la URL.`]);
  if (/_/.test(sq)) out.push(['warn', 'Usa <b>guion medio</b> (-) en vez de guion bajo (_).']);
  const sust = partes.filter(p => !/^\{?\d/.test(p) && !/^\{.*\}$/.test(p) && !/^v\d+$/.test(p) && !/^api$/i.test(p));
  const sing = sust.find(p => !/s$|es$/.test(p.toLowerCase()) && !verbos.includes(p.toLowerCase()));
  if (sing && !cv) out.push(['warn', `<b>«${sing}»</b> parece estar en <b>singular</b>. Los recursos van en plural.`]);
  if (!partes.some(p => /^v\d+$/.test(p))) out.push(['warn', 'No veo versión (<b>/v1</b>). No es obligatorio, pero suma puntos.']);
  if (r.includes('?')) out.push(['ok', `Query params detectados. Perfecto: los filtros van ahí, no en la ruta.`]);
  const i = partes.findIndex(p => /^\d+$|^\{.*\}$/.test(p));
  if (i > 0) out.push(['ok', `Identificador <b>«${partes[i]}»</b> bien colocado después de «${partes[i - 1]}».`]);
  if (!out.some(o => o[0] !== 'ok')) out.unshift(['ok', '<b>¡Ruta correcta!</b> Cumple las reglas de nombrado REST.']);
  else if (!out.some(o => o[0] === 'err')) out.unshift(['ok', 'Sin errores graves, solo detalles que pulir.']);
  return out;
}
function pintarVal(r) {
  $('#valOut').innerHTML = validar(r).map(([t, m]) =>
    `<div class="v-item ${t === 'err' ? 'err' : t === 'warn' ? 'warn' : 'ok'}"><span>${t === 'err' ? '❌' : t === 'warn' ? '⚠️' : '✅'}</span><span>${m}</span></div>`).join('');
}

/* ---------- giros ---------- */
let giroI = 0;
function renderGiroTabs() {
  const g = $('#giroTabs'); g.innerHTML = '';
  GIROS.forEach((x, i) => {
    const b = el('button', 'gtab' + (i === giroI ? ' on' : ''), `<span>${x.e}</span> ${x.n}`);
    b.addEventListener('click', () => { giroI = i; store.set('giro', i); renderGiroTabs(); renderGiro(); });
    g.appendChild(b);
  });
}
function renderGiro() {
  const x = GIROS[giroI], js = JSON.stringify(x.j.b, null, 2);
  $('#giro').innerHTML = `
    <div class="giro-t"><span class="e">${x.e}</span><h3>API de ${x.n}</h3></div>
    <p class="giro-s">${x.s}</p>

    <div class="gb"><h4>1 · Recursos, en plural</h4>
      <div class="res">${x.res.map(r => `<span>${r}</span>`).join('')}</div></div>

    <div class="gb"><h4>2 · Los 5 endpoints</h4>
      <div class="tscroll"><table>
        <thead><tr><th>Método</th><th>Endpoint</th><th>Qué hace</th><th>Códigos</th></tr></thead>
        <tbody>${x.eps.map(e => `<tr>
          <td><span class="mtag" style="background:${metBg(e.m)}">${e.m}</span></td>
          <td class="epath">${e.p}</td><td>${e.d}</td>
          <td>${e.c.map(c => `<span class="ecode" style="background:${famBg(String(c)[0] + 'xx')}">${c}</span>`).join('')}</td>
        </tr>`).join('')}</tbody></table></div></div>

    <div class="gb"><h4>3 · JSON de ejemplo</h4>
      <div class="copy-r"><span class="counter" style="font-family:var(--mono)">${x.j.r}</span>
        <button class="btn btn-ghost btn-s" id="copyJson">Copiar</button></div>
      <pre><code>${js.replace(/</g, '&lt;')}</code></pre></div>

    <div class="gb"><h4>4 · Códigos esperados</h4>
      <div>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">200 · consultas correctas</span>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">201 · al registrar</span>
        <span class="ecode" style="background:#c8f0d8;padding:5px 11px;font-size:.82rem">204 · al borrar</span>
        <span class="ecode" style="background:#fff1c9;padding:5px 11px;font-size:.82rem">400 · datos mal</span>
        <span class="ecode" style="background:#fff1c9;padding:5px 11px;font-size:.82rem">404 · id inexistente</span>
        <span class="ecode" style="background:#ffd9da;padding:5px 11px;font-size:.82rem">500 · falla del servidor</span>
      </div></div>

    <div class="gb"><h4>5 · Diagrama de capas</h4>
      <div class="mini">${LAYERS.map(l => `<div>${l.e} &nbsp;<b>${l.n}</b> — ${l.s}</div>`).join('<div class="arrow">↓</div>')}</div></div>`;

  const cb = $('#copyJson');
  cb.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(js); cb.textContent = '✅ Copiado'; }
    catch (e) { cb.textContent = 'Selecciónalo a mano'; }
    setTimeout(() => cb.textContent = 'Copiar', 1700);
  });
}

function renderCheck() {
  const done = store.get('chk', []);
  const g = $('#check'); g.innerHTML = '';
  CHECK.forEach((t, i) => {
    const n = el('div', 'chk' + (done.includes(i) ? ' done' : ''), `<div class="chk-b">✓</div><div class="chk-t">${t}</div>`);
    n.addEventListener('click', () => {
      const d = store.get('chk', []); const k = d.indexOf(i);
      if (k > -1) d.splice(k, 1); else d.push(i);
      store.set('chk', d); renderCheck(); progreso();
    });
    g.appendChild(n);
  });
}

/* ============================================================
   SIMULADOR
   ============================================================ */
const SIM_R = ['mascotas', 'citas', 'socios', 'boletos', 'libros', 'pedidos', 'pacientes'];
const SIM_EJ = {
  mascotas: { nombre: 'Firulais', especie: 'perro', edad: 4 },
  citas: { pacienteId: 55, fecha: '2026-09-18T10:30:00', motivo: 'Consulta' },
  socios: { nombre: 'Ana Rivera', plan: 'mensual', activo: true },
  boletos: { funcionId: 88, asiento: 'F12', precio: 95 },
  libros: { titulo: 'Clean Code', autor: 'Robert C. Martin', disponible: true },
  pedidos: { mesaId: 7, total: 245.5, estado: 'en preparación' },
  pacientes: { nombre: 'Ana López', edad: 31, sangre: 'O+' }
};

function initSim() {
  const ms = $('#simMetodo'), rs = $('#simRecurso');
  METODOS.forEach(m => { const o = el('option', '', m.m); o.value = m.m; ms.appendChild(o); });
  SIM_R.forEach(r => { const o = el('option', '', '/' + r); o.value = r; rs.appendChild(o); });
  ['#simMetodo', '#simRecurso', '#simId', '#simCaso'].forEach(s => $(s).addEventListener('change', runSim));
  runSim();
}

function runSim() {
  const m = $('#simMetodo').value, rec = $('#simRecurso').value;
  const conId = $('#simId').value === 'si', caso = $('#simCaso').value;
  const ruta = '/v1/' + rec + (conId ? '/42' : ''), cuerpo = SIM_EJ[rec];

  let req = `${m} ${ruta} HTTP/1.1\nHost: api.ejemplo.com\nAccept: application/json`;
  if (caso !== 'sintoken') req += `\nAuthorization: Bearer eyJhbGciOi...`;
  if (['POST', 'PUT', 'PATCH'].includes(m)) req += `\nContent-Type: application/json\n\n` + JSON.stringify(caso === 'malos' ? { nombre: '' } : cuerpo, null, 2);

  let code, nm, body, why;
  if (caso === 'sintoken') { code = 401; nm = 'Unauthorized'; body = { error: 'Token no proporcionado' }; why = '<b>401</b> porque el servidor <b>no sabe quién eres</b>. Si supiera quién eres pero no te dejara, sería <b>403</b>.'; }
  else if (caso === 'servidor') { code = 500; nm = 'Internal Server Error'; body = { error: 'Error inesperado en el servidor' }; why = '<b>500</b>: familia <b>5xx</b>, culpa del <b>servidor</b>. Tu petición estaba bien; algo tronó del otro lado.'; }
  else if (caso === 'malos' && ['POST', 'PUT', 'PATCH'].includes(m)) { code = 400; nm = 'Bad Request'; body = { error: 'El campo "nombre" es obligatorio' }; why = '<b>400</b>: familia <b>4xx</b>, culpa del <b>cliente</b>. Mandaste el cuerpo incompleto o mal formado.'; }
  else if (caso === 'malos') { code = 200; nm = 'OK'; body = { nota: 'GET y DELETE no llevan cuerpo' }; why = '<b>GET</b> y <b>DELETE</b> normalmente no llevan cuerpo, así que no puede haber datos inválidos. Cambia a POST, PUT o PATCH para ver el 400.'; }
  else if (caso === 'noexiste' && conId) { code = 404; nm = 'Not Found'; body = { error: `No existe ${rec.slice(0, -1)} con id 42` }; why = '<b>404</b>: la ruta es correcta pero <b>ese elemento no existe</b>. Es 4xx porque el cliente pidió algo que no está.'; }
  else if (caso === 'noexiste' && !conId) { code = 200; nm = 'OK'; body = { datos: [], total: 0 }; why = '⚠️ <b>Trampa de examen.</b> Si pides la <b>colección completa</b> y está vacía, NO es 404: la colección sí existe. Es <b>200 con lista vacía</b>.'; }
  else if (m === 'GET') { code = 200; nm = 'OK'; body = conId ? Object.assign({ id: 42 }, cuerpo) : { datos: [Object.assign({ id: 42 }, cuerpo)], total: 1, pagina: 1 }; why = '<b>200 OK</b>: la lectura salió bien. GET nunca modifica nada, por eso es el único «seguro».'; }
  else if (m === 'POST' && !conId) { code = 201; nm = 'Created'; body = Object.assign({ id: 43 }, cuerpo); why = `<b>201 Created</b> porque se <b>creó</b> un recurso nuevo. Suele traer <code>Location: ${ruta}/43</code>.`; }
  else if (m === 'POST' && conId) { code = 405; nm = 'Method Not Allowed'; body = { error: 'No se puede crear sobre un id existente' }; why = `<b>405</b>: POST va sobre la <b>colección</b> (<code>/v1/${rec}</code>), no sobre un id. El servidor asigna el id, tú no.`; }
  else if ((m === 'PUT' || m === 'PATCH') && conId) { code = 200; nm = 'OK'; body = Object.assign({ id: 42 }, cuerpo, { actualizado: true }); why = m === 'PUT' ? '<b>200 OK</b>: PUT <b>reemplaza el recurso completo</b>. Lo que no mandes se pierde.' : '<b>200 OK</b>: PATCH cambia <b>solo los campos que mandaste</b>.'; }
  else if (m === 'PUT' || m === 'PATCH') { code = 405; nm = 'Method Not Allowed'; body = { error: 'Indica qué elemento modificar' }; why = `<b>405</b>: para modificar hay que decir <b>cuál</b>. ${m} necesita un id: <code>${ruta}/42</code>.`; }
  else if (m === 'DELETE' && conId) { code = 204; nm = 'No Content'; body = null; why = '<b>204 No Content</b>: se borró bien y <b>no hay nada que devolver</b>. Por eso el cuerpo va vacío.'; }
  else { code = 405; nm = 'Method Not Allowed'; body = { error: 'No se permite borrar la colección completa' }; why = '<b>405</b>: un DELETE sobre la colección borraría <b>todo</b>. Casi ninguna API lo permite.'; }

  $('#simReq').textContent = req;
  $('#simStatus').textContent = `${code} ${nm}`;
  $('#simStatus').style.background = famBg(String(code)[0] + 'xx');
  $('#simRes').textContent = body === null ? '(sin cuerpo)' : JSON.stringify(body, null, 2);
  $('#simWhy').innerHTML = '💡 ' + why;
}

/* ============================================================
   QUIZ
   ============================================================ */
let qOrd = [], qI = 0, qSc = 0, qBad = [], qGrid = [];

function qGo(soloFallos) {
  qOrd = soloFallos && qBad.length ? qBad.slice() : shuffle(QUIZ.map((_, i) => i));
  qI = 0; qSc = 0; qBad = []; qGrid = [];
  $('#qStart').classList.add('hidden'); $('#qEnd').classList.add('hidden'); $('#qRun').classList.remove('hidden');
  qPinta();
}
function qPinta() {
  const q = QUIZ[qOrd[qI]];
  $('#qNum').textContent = `${qI + 1} / ${qOrd.length}`;
  $('#qScore').textContent = `${qSc} ✓`;
  $('#qBar').style.width = (qI / qOrd.length * 100) + '%';
  $('#qTag').textContent = q.tema;
  $('#qQ').innerHTML = q.q;
  $('#qFb').classList.add('hidden'); $('#qNext').classList.add('hidden');
  const o = $('#qOpts'); o.innerHTML = '';
  shuffle(q.o.map((t, i) => ({ t, i }))).forEach(op => {
    const b = el('button', 'qopt', op.t);
    b.addEventListener('click', () => qResp(op.i, b, q));
    o.appendChild(b);
  });
}
function qResp(elegida, boton, q) {
  $$('.qopt').forEach(b => { b.disabled = true; if (b.textContent === q.o[q.r]) b.classList.add('right'); });
  const ok = elegida === q.r;
  qGrid.push(ok);
  if (window.Sonido) ok ? Sonido.bien() : Sonido.mal();
  if (ok) { qSc++; $('#qScore').textContent = `${qSc} ✓`; } else { boton.classList.add('wrong'); qBad.push(qOrd[qI]); }
  const fb = $('#qFb');
  fb.className = 'q-fb ' + (ok ? 'ok' : 'no');
  fb.innerHTML = (ok ? '✅ <b>¡Correcto!</b> ' : '❌ <b>No era esa.</b> ') + q.e;
  fb.classList.remove('hidden');
  $('#qNext').classList.remove('hidden');
  $('#qNext').textContent = qI + 1 >= qOrd.length ? 'Ver resultado' : 'Siguiente';
}
function qSig() { qI++; if (qI >= qOrd.length) return qFin(); qPinta(); }
function qFin() {
  $('#qRun').classList.add('hidden'); $('#qEnd').classList.remove('hidden');
  const total = qOrd.length, pct = qSc / total;
  $('#qFinal').textContent = qSc; $('#qFinalOf').textContent = '/' + total;
  $('#qMsg').textContent = pct === 1 ? '🏆 Perfecto. Vas blindado.' :
    pct >= .85 ? '🔥 Muy bien. Repasa lo poco que falló y listo.' :
      pct >= .6 ? '💪 Vas bien, pero hay huecos. Otra vuelta y quedas.' :
        '📚 Todavía no. Vuelve a la chuleta y a los códigos, y repite.';
  const temas = [...new Set(qBad.map(i => QUIZ[i].tema))];
  $('#qWeak').innerHTML = temas.length
    ? '<p class="counter" style="margin:8px 0 4px">Repasa estos temas:</p>' + temas.map(t => `<span class="weak">${t}</span>`).join('')
    : '<p class="counter">No fallaste ningún tema.</p>';
  $('#qWrong').classList.toggle('hidden', qBad.length === 0);
  if (qSc > store.get('best', 0)) store.set('best', qSc);
  $('#qShareTxt').textContent = textoResultado();
  if (window.Sonido && pct >= .8) Sonido.fanfarria();
  progreso();
}

/* Resultado en cuadritos, para pegarlo en el grupo */
function textoResultado() {
  const filas = [];
  for (let i = 0; i < qGrid.length; i += 8) {
    filas.push(qGrid.slice(i, i + 8).map(ok => ok ? '🟩' : '🟥').join(''));
  }
  const temas = [...new Set(qBad.map(i => QUIZ[i].tema))];
  return `Repaso API REST — Aplicaciones Web\n${qSc}/${qGrid.length}\n${filas.join('\n')}` +
    (temas.length ? `\nMe falta: ${temas.join(', ')}` : '\nSin fallos 🏆') +
    `\nhttps://skytoti.github.io/Aplicaciones-Web/`;
}

async function compartirResultado() {
  const t = textoResultado(), b = $('#qShare');
  try {
    if (navigator.share) await navigator.share({ text: t });
    else await navigator.clipboard.writeText(t);
    b.textContent = '✅ Listo';
  } catch (e) {
    try { await navigator.clipboard.writeText(t); b.textContent = '✅ Copiado'; }
    catch (e2) { b.textContent = 'Cópialo de arriba'; }
  }
  setTimeout(() => b.textContent = '📤 Compartir resultado', 2000);
}

/* ============================================================
   NAV · PROGRESO · CUENTA REGRESIVA
   ============================================================ */
function progreso() {
  const a = store.get('cheat', []).length / CHEAT.length;
  const b = store.get('chk', []).length / CHECK.length;
  const c = store.get('best', 0) / QUIZ.length;
  const d = (store.get('parejas', false) ? .5 : 0) + (store.get('orden', false) ? .5 : 0);
  const pct = Math.round((a * .28 + b * .2 + c * .37 + d * .15) * 100);
  $('#progPct').textContent = pct + '%';
  $('#progFill').style.width = pct + '%';
}

/* ---------- panel de sonido ---------- */
function initSonido() {
  if (!window.Sonido) return;
  const btn = $('#sndBtn'), panel = $('#sndPanel');
  const swFx = $('#swFx'), swRain = $('#swRain'), vol = $('#sndVol');

  const pinta = () => {
    const fx = Sonido.efectosActivos(), rain = Sonido.lluviaActiva();
    swFx.classList.toggle('on', fx); swFx.setAttribute('aria-checked', fx);
    swRain.classList.toggle('on', rain); swRain.setAttribute('aria-checked', rain);
    btn.textContent = (fx || rain) ? '🔊' : '🔇';
  };

  btn.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('hidden'); pinta(); });
  document.addEventListener('click', e => {
    if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== btn) panel.classList.add('hidden');
  });

  swFx.addEventListener('click', () => { Sonido.alternarEfectos(); pinta(); });
  swRain.addEventListener('click', () => { Sonido.alternarLluvia(); pinta(); });
  vol.value = Sonido.volumen();
  vol.addEventListener('input', e => Sonido.ponerVolumen(+e.target.value));
  pinta();
}

function initNav() {
  const tabs = $$('.tab');
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) tabs.forEach(t => t.classList.toggle('on', t.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => obs.observe(s));
  window.addEventListener('scroll', () => $('#up').classList.toggle('show', window.scrollY > 700), { passive: true });
  tabs.forEach(t => t.addEventListener('click', () => setTimeout(() => t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }), 400)));
}

function initCd() {
  const tick = () => {
    const now = new Date(), t = new Date(now);
    const dias = (8 - now.getDay()) % 7 || 7;
    t.setDate(now.getDate() + dias); t.setHours(7, 0, 0, 0);
    if (now.getDay() === 1 && now.getHours() < 7) t.setDate(t.getDate() - 7);
    let ms = t - now; if (ms < 0) ms = 0;
    $('#cdD').textContent = Math.floor(ms / 86400000);
    $('#cdH').textContent = String(Math.floor(ms / 3600000) % 24).padStart(2, '0');
    $('#cdM').textContent = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
    $('#cdS').textContent = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
}

/* ============================================================
   ARRANQUE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTema();
  $('#statQuiz').textContent = QUIZ.length;
  $('#qTotal').textContent = QUIZ.length;

  renderCheat(); renderResto(); renderRest(); renderUrl(); renderMets();
  renderFams(); renderFilters(); renderCodes(); renderDuels(); renderRules();
  renderLayers(); renderBuilder(); nuevaRonda(); nuevoOrden();
  giroI = store.get('giro', 0); renderGiroTabs(); renderGiro(); renderCheck();
  initSim(); initNav(); initCd(); initSonido(); progreso();

  $('#resetCheat').addEventListener('click', () => { store.set('cheat', []); renderCheat(); progreso(); });
  $('#mNew').addEventListener('click', nuevaRonda);
  $('#ordCheck').addEventListener('click', comprobarOrden);
  $('#ordNew').addEventListener('click', nuevoOrden);

  $('#valBtn').addEventListener('click', () => pintarVal($('#valInput').value));
  $('#valInput').addEventListener('keydown', e => { if (e.key === 'Enter') pintarVal($('#valInput').value); });
  $$('.val-ex .tagbtn').forEach(p => p.addEventListener('click', () => { $('#valInput').value = p.dataset.val; pintarVal(p.dataset.val); }));

  $('#qStartBtn').addEventListener('click', () => qGo(false));
  $('#qNext').addEventListener('click', qSig);
  $('#qAgain').addEventListener('click', () => qGo(false));
  $('#qWrong').addEventListener('click', () => qGo(true));
  $('#qShare').addEventListener('click', compartirResultado);
  const best = store.get('best', 0);
  if (best) $('#qLast').innerHTML = `Tu mejor resultado: <b>${best}/${QUIZ.length}</b>`;

  $('#wipe').addEventListener('click', () => {
    ['cheat', 'chk', 'best', 'giro', 'mBest', 'parejas', 'orden'].forEach(k => store.del(k));
    renderCheat(); renderCheck(); progreso(); nuevaRonda();
    $('#qLast').textContent = '';
    $('#wipe').textContent = 'Listo, avance borrado';
    setTimeout(() => $('#wipe').textContent = 'Borrar mi avance', 1800);
  });
});
