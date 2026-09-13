/* ============================================================
   Repaso API REST — CONTENIDO
   Todo lo que se estudia vive aquí: si hay que corregir un dato o
   agregar una pregunta, este es el único archivo que se toca.
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
  { e: 'user', n: 'Tú, el cliente', q: 'App / Frontend', d: 'Quien <b>quiere algo</b> y no sabe (ni le importa) cómo se cocina. En la vida real: tu app, la página web u otro sistema. Solo sabe <b>pedir</b>.' },
  { e: 'clipboard-list', n: 'El menú', q: 'Documentación', d: 'La lista de lo que <b>puedes pedir</b> y cómo se llama cada cosa. En una API es la documentación: qué endpoints hay, qué mandar y qué te devuelven.' },
  { e: 'chef-hat', n: 'El mesero', q: 'LA API', d: '<b>Aquí está la respuesta del examen.</b> Recibe tu pedido en un formato acordado, lo lleva a la cocina y te trae el resultado. Nunca te deja entrar a la cocina. Eso es una API: el intermediario con reglas claras.' },
  { e: 'cooking-pot', n: 'La cocina', q: 'Servidor / Lógica', d: 'Donde <b>de verdad</b> pasa el trabajo. Tú no ves cómo lo hacen. Pueden cambiar de chef o de receta y a ti no te afecta mientras el plato llegue igual.' },
  { e: 'utensils', n: 'El plato', q: 'La respuesta', d: 'Lo que te regresan: normalmente un <b>JSON</b> con los datos, más un <b>código de estado</b> que dice si salió bien o mal.' }
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
  { e: 'smartphone', n: 'Cliente', s: 'App móvil, web u otro sistema', d: 'Es <b>quien pide</b>. Muestra la información y recoge lo que el usuario escribe. No tiene lógica de negocio ni toca la base de datos: solo habla con la API por HTTP.' },
  { e: 'door-open', n: 'Controlador', s: 'Recibe la petición HTTP', d: 'La <b>puerta de entrada</b>. Recibe método y URL, valida que los datos vengan bien formados, llama al servicio y devuelve la respuesta con su <b>código de estado</b>. No calcula nada por su cuenta.' },
  { e: 'brain', n: 'Servicio', s: 'Las reglas del negocio', d: 'Donde viven <b>las reglas</b>: «no se agenda en domingo», «un socio moroso no entra». Es el cerebro. No sabe de HTTP ni de SQL.' },
  { e: 'database', n: 'Repositorio', s: 'Habla con la base de datos', d: 'El <b>traductor</b>. Convierte «dame la mascota 42» en la consulta concreta. Si mañana cambias de base de datos, solo se toca esta capa.' },
  { e: 'hard-drive', n: 'Base de datos', s: 'Donde viven los datos', d: 'El <b>almacén</b>. Guarda la información de forma permanente. No decide nada: guarda y entrega.' }
];

const GIROS = [
  {
    id: 'veterinaria', e: 'dog', n: 'Veterinaria', s: 'Una clínica que registra mascotas y sus citas médicas.',
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
    id: 'gimnasio', e: 'dumbbell', n: 'Gimnasio', s: 'Control de socios, membresías y clases.',
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
    id: 'cine', e: 'clapperboard', n: 'Cine', s: 'Cartelera, funciones y venta de boletos.',
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
    id: 'biblioteca', e: 'book-open', n: 'Biblioteca', s: 'Acervo de libros y préstamos a usuarios.',
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
    id: 'restaurante', e: 'pizza', n: 'Restaurante', s: 'Menú, pedidos y mesas.',
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
    id: 'hospital', e: 'stethoscope', n: 'Hospital', s: 'Pacientes, expedientes y citas médicas.',
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

/* ---------- simulador ---------- */
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

/* ---------- constructor de endpoints ---------- */
const BGROUPS = [
  { k: 'metodo', t: 'Método', op: [['GET', 'GET'], ['POST', 'POST'], ['PUT', 'PUT'], ['PATCH', 'PATCH'], ['DELETE', 'DELETE']] },
  { k: 'version', t: 'Versión', op: [['/v1', '/v1'], ['', 'sin versión']] },
  { k: 'recurso', t: 'Recurso', op: [['/mascotas', '/mascotas'], ['/citas', '/citas'], ['/mascota', '/mascota'], ['/getMascotas', '/getMascotas']] },
  { k: 'id', t: 'Identificador', op: [['', 'sin id'], ['/42', '/42']] },
  { k: 'sub', t: 'Subrecurso', op: [['', 'ninguno'], ['/vacunas', '/vacunas']] },
  { k: 'query', t: 'Query params', op: [['', 'ninguno'], ['?especie=perro', '?especie=perro']] }
];

/* Id estable de cada pregunta, sacado del texto. Así «mis fallos» sigue
   apuntando a la pregunta correcta aunque se reordene la lista. */
QUIZ.forEach(q => {
  let h = 0;
  for (const ch of q.q) h = (h * 31 + ch.charCodeAt(0)) | 0;
  q.id = "q" + (h >>> 0).toString(36);
});
