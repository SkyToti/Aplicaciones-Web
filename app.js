/* ===========================================================
   API REST — Repaso Express · lógica y contenido
   =========================================================== */

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

const store = {
  get(k, d) { try { const v = localStorage.getItem('apirest_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('apirest_' + k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem('apirest_' + k); } catch (e) { } }
};

/* ===========================================================
   DATOS
   =========================================================== */

const CHEAT = [
  { t: 'API = contrato', d: 'Reglas que permiten que dos programas se hablen sin saber cómo está hecho el otro por dentro.' },
  { t: 'REST = estilo', d: 'No es un lenguaje ni una librería. Es una <b>forma de diseñar</b> APIs: recursos + verbos HTTP.' },
  { t: 'Recurso = sustantivo en PLURAL', d: '<code>/mascotas</code> ✅ &nbsp; <code>/getMascota</code> ❌. La URL nombra la cosa, nunca la acción.' },
  { t: 'Los 5 verbos', d: '<b>GET</b> leer · <b>POST</b> crear · <b>PUT</b> reemplazar · <b>PATCH</b> modificar un pedazo · <b>DELETE</b> borrar.' },
  { t: 'Las 5 familias', d: '<b>1xx</b> info · <b>2xx</b> éxito · <b>3xx</b> redirección · <b>4xx</b> error del cliente · <b>5xx</b> error del servidor.' },
  { t: 'Los 3 que siempre caen', d: '<b>200</b> OK (salió bien) · <b>201</b> Created (se creó algo) · <b>404</b> Not Found (no existe).' },
  { t: 'Stateless', d: 'El servidor <b>no recuerda</b> la petición anterior. Cada petición viaja completa y sola.' },
  { t: 'Idempotente', d: 'Repetirlo 10 veces da el mismo resultado que hacerlo 1. GET, PUT y DELETE sí. <b>POST no.</b>' },
  { t: 'Las capas', d: 'Cliente → Controlador → Servicio → Repositorio → Base de datos. Y la respuesta de regreso.' },
  { t: 'JSON', d: 'El formato en que viajan los datos: pares <code>"clave": valor</code> entre llaves. Texto plano que todos entienden.' }
];

const RESTO = [
  { emo: '🧑', nm: 'Tú, el cliente', eq: '= App / Frontend', txt: 'Quien <b>quiere algo</b> pero no sabe (ni le importa) cómo se cocina. En la vida real: tu app de celular, la página web, otro sistema. Solo sabe <b>pedir</b>.' },
  { emo: '📋', nm: 'El menú', eq: '= Documentación', txt: 'La lista de lo que <b>puedes pedir</b> y cómo se llama cada cosa. En una API es la documentación: los endpoints disponibles, qué datos mandar y qué te van a devolver.' },
  { emo: '🧑‍🍳', nm: 'El mesero', eq: '= LA API', txt: '<b>Aquí está la respuesta del examen.</b> El mesero recibe tu pedido en un formato acordado, lo lleva a la cocina y te trae el resultado. Nunca te deja entrar a la cocina. Eso es exactamente una API: el intermediario con reglas claras.' },
  { emo: '🍳', nm: 'La cocina', eq: '= Servidor / Lógica', txt: 'Donde <b>de verdad</b> pasa el trabajo. Tú no ves cómo lo hacen ni con qué. Puede cambiar de chef, de estufa o de receta y a ti no te afecta mientras el plato llegue igual.' },
  { emo: '🍝', nm: 'El plato', eq: '= La respuesta (JSON)', txt: 'Lo que te regresan. En una API es la respuesta: normalmente un <b>JSON</b> con los datos y un <b>código de estado</b> que dice si salió bien o mal.' }
];

const REST_RULES = [
  { n: 1, t: 'Cliente – Servidor', d: 'Están separados. El cliente pide, el servidor responde. Puedes cambiar uno sin tocar el otro.', say: 'Di: «separación de responsabilidades».' },
  { n: 2, t: 'Sin estado (Stateless)', d: 'El servidor no guarda memoria entre peticiones. Cada petición lleva TODO lo que necesita para entenderse sola.', say: 'Di: «cada petición es independiente y autocontenida».', star: true },
  { n: 3, t: 'Cacheable', d: 'Las respuestas pueden marcarse como guardables para no volver a pedir lo mismo y que todo vaya más rápido.', say: 'Di: «mejora el rendimiento y reduce carga».' },
  { n: 4, t: 'Interfaz uniforme', d: 'Todos los recursos se acceden igual: mismas URLs con sustantivos y los mismos verbos HTTP.', say: 'Di: «misma forma de acceder a todo».' },
  { n: 5, t: 'Sistema por capas', d: 'Entre el cliente y el servidor puede haber intermediarios (caché, balanceador, seguridad) y el cliente ni se entera.', say: 'Di: «el cliente no sabe con quién habla realmente».' },
  { n: 6, t: 'Código bajo demanda', d: 'La única OPCIONAL. El servidor puede mandar código ejecutable al cliente (por ejemplo, JavaScript).', say: 'Di: «es la única opcional» — con eso ganas puntos.' }
];

const URL_PARTS = [
  { txt: 'https://', nm: 'Protocolo', d: 'Cómo viajan los datos. <b>HTTPS</b> = HTTP cifrado. Siempre usa HTTPS en producción.' },
  { txt: 'api.veterinaria.com', nm: 'Host / dominio', d: 'La dirección del servidor donde vive la API. Muchas veces se usa el subdominio <code>api.</code> para separarla del sitio web.' },
  { txt: '/v1', nm: 'Versión', d: 'La versión de la API. Sirve para poder cambiarla en el futuro <b>sin romper</b> a quienes ya la usan. Buena práctica que suma puntos.' },
  { txt: '/mascotas', nm: 'Recurso (colección)', d: 'La <b>colección</b> de cosas. Va en <b>plural</b> y es un <b>sustantivo</b>. Este es el corazón de REST.' },
  { txt: '/42', nm: 'Identificador', d: 'Un elemento concreto dentro de la colección. <code>/mascotas/42</code> = la mascota con id 42.' },
  { txt: '/vacunas', nm: 'Subrecurso', d: 'Una relación. <code>/mascotas/42/vacunas</code> = las vacunas <b>de esa</b> mascota. Así se expresa la jerarquía.' },
  { txt: '?desde=2026-01-01', nm: 'Query params', d: 'Filtros, orden, paginación y búsqueda. Nunca metas filtros en la ruta: van después del <code>?</code>.' }
];

const METODOS = [
  { m: 'GET', color: '#38bdf8', qh: 'Leer / consultar', d: 'Pide información. Nunca modifica nada. Es el único que es "seguro".', ex: 'GET /mascotas/42', safe: true, idem: true, code: '200 OK' },
  { m: 'POST', color: '#34d399', qh: 'Crear', d: 'Crea un elemento nuevo dentro de una colección. El servidor le asigna el id.', ex: 'POST /mascotas', safe: false, idem: false, code: '201 Created' },
  { m: 'PUT', color: '#fbbf24', qh: 'Reemplazar completo', d: 'Sustituye el recurso entero. Lo que no mandes se pierde.', ex: 'PUT /mascotas/42', safe: false, idem: true, code: '200 OK' },
  { m: 'PATCH', color: '#a78bfa', qh: 'Modificar un pedazo', d: 'Cambia solo los campos que mandas. El resto queda intacto.', ex: 'PATCH /mascotas/42', safe: false, idem: false, code: '200 OK' },
  { m: 'DELETE', color: '#fb7185', qh: 'Borrar', d: 'Elimina el recurso. Si lo repites ya no hay nada que borrar: el resultado final es el mismo.', ex: 'DELETE /mascotas/42', safe: false, idem: true, code: '204 No Content' }
];

const FAMILIAS = [
  { num: '1xx', nm: 'Informativas', c: '#93a4c8', d: 'El servidor recibió la petición y sigue trabajando. Casi nunca las verás.', q: '«Espérame, ahí voy»', principal: false },
  { num: '2xx', nm: 'Éxito', c: '#34d399', d: 'Todo salió bien. La petición se recibió, se entendió y se procesó.', q: '«Listo, salió»', principal: true },
  { num: '3xx', nm: 'Redirección', c: '#38bdf8', d: 'Lo que pediste está en otro lado. Hay que hacer algo más para llegar.', q: '«Búscalo en otra dirección»', principal: false },
  { num: '4xx', nm: 'Error del CLIENTE', c: '#fbbf24', d: 'La culpa es de quien pidió: mandó mal la URL, faltaron datos o no tiene permiso.', q: '«Te equivocaste tú»', principal: true },
  { num: '5xx', nm: 'Error del SERVIDOR', c: '#fb7185', d: 'La petición estaba bien, pero el servidor falló al procesarla.', q: '«Me equivoqué yo»', principal: true }
];

const MNEMO = [
  '<b>1xx</b> — "un momento": todavía no hay resultado.',
  '<b>2xx</b> — "dos manos arriba": ✌️ todo bien.',
  '<b>3xx</b> — "te mando a otro lado": redirección.',
  '<b>4xx</b> — piensa en el <b>404</b>: <b>TÚ</b> escribiste mal la dirección. Culpa del cliente.',
  '<b>5xx</b> — piensa en el <b>500</b>: la página truena sola. Culpa del servidor.',
  '<b>Truco final:</b> <b>4</b> es de "<b>f</b>allaste tú", <b>5</b> es de "<b>s</b>e cayó el servidor".'
];

const CODIGOS = [
  { c: 200, n: 'OK', f: '2xx', star: true, d: 'Todo salió bien y aquí van los datos. Es la respuesta normal de un GET, y también de un PUT o PATCH que sí devuelven el recurso actualizado.', ex: 'GET /mascotas → 200 con la lista' },
  { c: 201, n: 'Created', f: '2xx', star: true, d: 'Se <b>creó</b> un recurso nuevo. Es la respuesta correcta de un POST. Normalmente incluye la cabecera <code>Location</code> con la URL del recurso nuevo.', ex: 'POST /mascotas → 201 + Location: /mascotas/43' },
  { c: 204, n: 'No Content', f: '2xx', star: true, d: 'Salió bien pero <b>no hay nada que devolver</b>. Es la respuesta típica de un DELETE.', ex: 'DELETE /mascotas/42 → 204 (cuerpo vacío)' },
  { c: 301, n: 'Moved Permanently', f: '3xx', star: false, d: 'El recurso <b>cambió de dirección para siempre</b>. Actualiza tus enlaces.', ex: 'La API se movió de /v1 a /v2' },
  { c: 302, n: 'Found', f: '3xx', star: false, d: 'Redirección <b>temporal</b>. Por ahora está en otro lado, pero no cambies tus enlaces.', ex: 'Mantenimiento temporal' },
  { c: 304, n: 'Not Modified', f: '3xx', star: false, d: 'No ha cambiado desde la última vez que lo pediste: usa tu copia en caché. Ahorra datos.', ex: 'GET con caché válida' },
  { c: 400, n: 'Bad Request', f: '4xx', star: true, d: 'La petición está <b>mal formada</b>: falta un campo, el JSON está roto, el tipo de dato no cuadra.', ex: 'POST /mascotas sin el campo "nombre"' },
  { c: 401, n: 'Unauthorized', f: '4xx', star: true, d: '<b>No sé quién eres.</b> Falta autenticarte o tu token es inválido. Mal nombrado: debería decir "no autenticado".', ex: 'Petición sin token' },
  { c: 403, n: 'Forbidden', f: '4xx', star: true, d: '<b>Sé quién eres, pero no puedes.</b> Estás autenticado pero no tienes permiso para eso.', ex: 'Un usuario normal intenta borrar a otro usuario' },
  { c: 404, n: 'Not Found', f: '4xx', star: true, d: '<b>No existe.</b> Ni la ruta ni el elemento con ese id. El más famoso de todos.', ex: 'GET /mascotas/9999 cuando no hay id 9999' },
  { c: 405, n: 'Method Not Allowed', f: '4xx', star: false, d: 'La ruta existe pero <b>ese método no se permite ahí</b>. Ej.: DELETE sobre una colección completa.', ex: 'DELETE /mascotas (sin id)' },
  { c: 409, n: 'Conflict', f: '4xx', star: false, d: 'Choca con el estado actual: duplicado, o alguien más ya lo modificó.', ex: 'Registrar un correo que ya existe' },
  { c: 422, n: 'Unprocessable Entity', f: '4xx', star: false, d: 'El JSON se entiende, pero los <b>valores no son válidos</b> (edad negativa, fecha imposible). Es un 400 más fino.', ex: 'POST con "edad": -3' },
  { c: 429, n: 'Too Many Requests', f: '4xx', star: false, d: 'Estás pidiendo demasiado rápido. Límite de velocidad (rate limit).', ex: '1000 peticiones en un minuto' },
  { c: 500, n: 'Internal Server Error', f: '5xx', star: true, d: '<b>Tronó el servidor.</b> Error no controlado del lado de la API. Tu petición estaba bien.', ex: 'Una excepción sin capturar en el código' },
  { c: 502, n: 'Bad Gateway', f: '5xx', star: false, d: 'Un servidor intermedio recibió una respuesta inválida de otro servidor.', ex: 'El proxy no pudo hablar con la app' },
  { c: 503, n: 'Service Unavailable', f: '5xx', star: true, d: 'El servidor <b>está caído o saturado</b>, normalmente temporal (mantenimiento).', ex: 'API en mantenimiento' },
  { c: 504, n: 'Gateway Timeout', f: '5xx', star: false, d: 'Un intermediario esperó la respuesta y se acabó el tiempo.', ex: 'La base de datos tardó demasiado' }
];

const VERSUS = [
  { t: '200 vs 201 vs 204', rows: [['200', 'Salió bien <b>y te devuelvo datos</b>. Típico de GET.'], ['201', 'Salió bien <b>y creé algo nuevo</b>. Típico de POST.'], ['204', 'Salió bien <b>y no hay nada que devolver</b>. Típico de DELETE.']] },
  { t: '401 vs 403', rows: [['401', '<b>No sé quién eres.</b> Te falta identificarte (sin token o token inválido).'], ['403', '<b>Sí sé quién eres, pero no puedes.</b> Estás identificado y aun así no tienes permiso.']] },
  { t: '400 vs 404 vs 422', rows: [['400', 'Mandaste <b>mal la petición</b> (JSON roto, falta un campo).'], ['404', 'La petición está bien pero <b>eso no existe</b>.'], ['422', 'Se entiende, pero los <b>valores no son válidos</b> (edad = -5).']] },
  { t: '500 vs 503', rows: [['500', '<b>Tronó</b> el código del servidor. Error inesperado.'], ['503', '<b>No está disponible</b> ahorita: apagado, saturado o en mantenimiento. Suele ser temporal.']] }
];

const RULES = [
  { t: 'Sustantivos, nunca verbos', good: '/mascotas', bad: '/obtenerMascotas', p: 'El <b>método HTTP</b> ya es el verbo. Poner el verbo en la URL es repetirlo mal.' },
  { t: 'Siempre en plural', good: '/mascotas/42', bad: '/mascota/42', p: 'La colección es plural. El id de adentro apunta a uno solo, pero la colección sigue siendo plural.' },
  { t: 'Minúsculas y guiones', good: '/historial-clinico', bad: '/HistorialClinico', p: 'Las URLs se escriben en minúsculas y, si hay dos palabras, se separan con guion medio.' },
  { t: 'Jerarquía para relaciones', good: '/mascotas/42/vacunas', bad: '/vacunasDeMascota?id=42', p: 'Si algo <b>pertenece</b> a otra cosa, se anida. Así se lee solo.' },
  { t: 'Filtros en query params', good: '/mascotas?especie=perro&page=2', bad: '/mascotas/filtrar/perro', p: 'Filtrar, ordenar, buscar y paginar van después del <code>?</code>. No inventes rutas para cada filtro.' },
  { t: 'Versiona desde el día uno', good: '/v1/mascotas', bad: '/mascotas', p: 'Te deja cambiar la API mañana sin romper a nadie. Es un punto gratis en el examen.' }
];

const LAYERS = [
  { emo: '📱', nm: '1. Cliente (Presentación)', sh: 'App móvil, página web u otro sistema', d: 'Es <b>quien pide</b>. Muestra la información y recoge lo que el usuario escribe. No tiene lógica de negocio ni toca la base de datos: solo habla con la API por HTTP.' },
  { emo: '🚪', nm: '2. Controlador (Rutas / API)', sh: 'Recibe la petición HTTP', d: 'La <b>puerta de entrada</b>. Recibe el método y la URL, valida que los datos vengan bien formados, llama a la capa de servicio y devuelve la respuesta con su <b>código de estado</b>. No calcula nada por su cuenta.' },
  { emo: '🧠', nm: '3. Servicio (Lógica de negocio)', sh: 'Las reglas del negocio', d: 'Donde viven <b>las reglas</b>: "no se puede agendar una cita en domingo", "un socio moroso no puede entrar". Es el cerebro. No sabe de HTTP ni de SQL.' },
  { emo: '🗄️', nm: '4. Repositorio (Acceso a datos)', sh: 'Habla con la base de datos', d: 'El <b>traductor</b>. Convierte "dame la mascota 42" en la consulta concreta a la base de datos. Si mañana cambias de base de datos, solo se toca esta capa.' },
  { emo: '💾', nm: '5. Base de datos', sh: 'Donde viven los datos', d: 'El <b>almacén</b>. Guarda la información de forma permanente. No decide nada: solo guarda y entrega.' }
];

const GIROS = [
  {
    id: 'veterinaria', emo: '🐶', nm: 'Veterinaria',
    sub: 'Una clínica que registra mascotas y sus citas médicas.',
    recursos: ['/mascotas', '/citas', '/veterinarios'],
    eps: [
      { m: 'GET', p: '/v1/mascotas', d: 'Lista todas las mascotas (con filtros y paginación).', c: [200] },
      { m: 'GET', p: '/v1/mascotas/{id}', d: 'Devuelve una mascota concreta.', c: [200, 404] },
      { m: 'POST', p: '/v1/mascotas', d: 'Registra una mascota nueva.', c: [201, 400] },
      { m: 'PUT', p: '/v1/mascotas/{id}', d: 'Actualiza todos los datos de la mascota.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/citas/{id}', d: 'Cancela una cita agendada.', c: [204, 404] }
    ],
    json: { recurso: 'POST /v1/mascotas', body: { nombre: 'Firulais', especie: 'perro', raza: 'labrador', edad: 4, duenoId: 17 } }
  },
  {
    id: 'gimnasio', emo: '💪', nm: 'Gimnasio',
    sub: 'Control de socios, membresías y clases.',
    recursos: ['/socios', '/membresias', '/clases'],
    eps: [
      { m: 'GET', p: '/v1/socios', d: 'Lista los socios registrados.', c: [200] },
      { m: 'GET', p: '/v1/socios/{id}/membresias', d: 'Membresías de un socio (activas e históricas).', c: [200, 404] },
      { m: 'POST', p: '/v1/socios', d: 'Da de alta a un socio nuevo.', c: [201, 400, 409] },
      { m: 'PATCH', p: '/v1/membresias/{id}', d: 'Renueva o cambia el estado de una membresía.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/clases/{id}', d: 'Cancela una clase programada.', c: [204, 404] }
    ],
    json: { recurso: 'POST /v1/socios', body: { nombre: 'Diego Benítez', correo: 'diego@correo.com', telefono: '7771234567', plan: 'mensual' } }
  },
  {
    id: 'cine', emo: '🎬', nm: 'Cine',
    sub: 'Cartelera, funciones y venta de boletos.',
    recursos: ['/peliculas', '/funciones', '/boletos'],
    eps: [
      { m: 'GET', p: '/v1/peliculas', d: 'Cartelera completa.', c: [200] },
      { m: 'GET', p: '/v1/peliculas/{id}/funciones', d: 'Horarios disponibles de una película.', c: [200, 404] },
      { m: 'POST', p: '/v1/boletos', d: 'Compra un boleto para una función.', c: [201, 400, 409] },
      { m: 'GET', p: '/v1/boletos/{id}', d: 'Consulta un boleto comprado.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/boletos/{id}', d: 'Cancela un boleto.', c: [204, 404] }
    ],
    json: { recurso: 'POST /v1/boletos', body: { funcionId: 88, asiento: 'F12', clienteId: 24, precio: 95.0 } }
  },
  {
    id: 'biblioteca', emo: '📚', nm: 'Biblioteca',
    sub: 'Acervo de libros y préstamos a usuarios.',
    recursos: ['/libros', '/prestamos', '/usuarios'],
    eps: [
      { m: 'GET', p: '/v1/libros', d: 'Lista el acervo (filtra por autor o disponibilidad).', c: [200] },
      { m: 'GET', p: '/v1/libros/{id}', d: 'Ficha de un libro.', c: [200, 404] },
      { m: 'POST', p: '/v1/prestamos', d: 'Registra un préstamo.', c: [201, 400, 409] },
      { m: 'PATCH', p: '/v1/prestamos/{id}', d: 'Marca la devolución del libro.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/libros/{id}', d: 'Da de baja un libro del acervo.', c: [204, 404] }
    ],
    json: { recurso: 'POST /v1/prestamos', body: { libroId: 301, usuarioId: 12, fechaPrestamo: '2026-09-14', fechaLimite: '2026-09-28' } }
  },
  {
    id: 'restaurante', emo: '🍕', nm: 'Restaurante',
    sub: 'Menú, pedidos y mesas.',
    recursos: ['/platillos', '/pedidos', '/mesas'],
    eps: [
      { m: 'GET', p: '/v1/platillos', d: 'Menú completo.', c: [200] },
      { m: 'POST', p: '/v1/pedidos', d: 'Crea un pedido nuevo.', c: [201, 400] },
      { m: 'GET', p: '/v1/pedidos/{id}', d: 'Estado de un pedido.', c: [200, 404] },
      { m: 'PATCH', p: '/v1/pedidos/{id}', d: 'Cambia el estado (en preparación, entregado).', c: [200, 404] },
      { m: 'DELETE', p: '/v1/pedidos/{id}', d: 'Cancela un pedido.', c: [204, 404, 409] }
    ],
    json: { recurso: 'POST /v1/pedidos', body: { mesaId: 7, items: [{ platilloId: 3, cantidad: 2 }, { platilloId: 11, cantidad: 1 }], notas: 'Sin cebolla' } }
  },
  {
    id: 'hospital', emo: '🏥', nm: 'Hospital',
    sub: 'Pacientes, expedientes y citas médicas.',
    recursos: ['/pacientes', '/citas', '/medicos'],
    eps: [
      { m: 'GET', p: '/v1/pacientes', d: 'Lista de pacientes registrados.', c: [200, 401] },
      { m: 'GET', p: '/v1/pacientes/{id}/citas', d: 'Citas de un paciente.', c: [200, 404] },
      { m: 'POST', p: '/v1/citas', d: 'Agenda una cita médica.', c: [201, 400, 409] },
      { m: 'PUT', p: '/v1/pacientes/{id}', d: 'Actualiza el expediente completo.', c: [200, 404] },
      { m: 'DELETE', p: '/v1/citas/{id}', d: 'Cancela una cita.', c: [204, 404] }
    ],
    json: { recurso: 'POST /v1/citas', body: { pacienteId: 55, medicoId: 9, fecha: '2026-09-18T10:30:00', motivo: 'Consulta general' } }
  }
];

const CHECKLIST = [
  'Mínimo <b>2 recursos en plural</b> (yo puse 3, mejor)',
  '<b>5 endpoints</b> principales, cada uno con su método HTTP',
  '<b>1 JSON de ejemplo</b> (petición o respuesta)',
  'Los <b>códigos de estado</b> esperados (200, 201, 404…)',
  '<b>Diagrama de arquitectura por capas</b> (las cajas y flechas)',
  'Está hecho <b>en la libreta</b> y le tomé fotos',
  '⚠️ <b>ESTÁ FIRMADO</b> (lo pide explícitamente)'
];

const QUIZ = [
  { tema: 'Concepto', q: '¿Qué es una API, en una frase?', o: ['Una base de datos en la nube', 'Un contrato que permite que dos programas se comuniquen', 'Un lenguaje de programación para web', 'El servidor donde se guarda la página'], r: 1, e: 'Una API es la <b>interfaz/contrato</b>: define cómo se le pide algo a un sistema y qué devuelve, sin exponer cómo está hecho por dentro.' },
  { tema: 'REST', q: 'REST significa...', o: ['Remote Estate Transfer', 'Representational State Transfer', 'Request Event Standard Transport', 'Relational Endpoint Service Type'], r: 1, e: '<b>RE</b>presentational <b>S</b>tate <b>T</b>ransfer. Es un <b>estilo de arquitectura</b>, no un protocolo ni una librería.' },
  { tema: 'REST', q: '¿Qué significa que una API REST sea "stateless"?', o: ['Que no guarda datos en la base de datos', 'Que el servidor no recuerda peticiones anteriores: cada petición viaja completa', 'Que no tiene estados de error', 'Que solo funciona con GET'], r: 1, e: 'Sin estado = el servidor <b>no guarda memoria</b> entre una petición y otra. Por eso el token o los datos necesarios van en <b>cada</b> petición.' },
  { tema: 'Recursos', q: '¿Cuál de estas rutas está bien diseñada en REST?', o: ['/obtenerMascotas', '/mascota/borrar/42', '/mascotas/42', '/API/GetMascota?id=42'], r: 2, e: 'Sustantivo, en <b>plural</b>, sin verbos y con el id como parte de la ruta. El verbo lo pone el método HTTP, no la URL.' },
  { tema: 'Métodos', q: '¿Qué método se usa para CREAR un recurso nuevo?', o: ['GET', 'POST', 'PUT', 'DELETE'], r: 1, e: '<b>POST</b> sobre la colección crea un elemento nuevo y normalmente responde <b>201 Created</b>.' },
  { tema: 'Métodos', q: 'Quieres cambiar SOLO el teléfono de un socio. ¿Qué método usas?', o: ['PUT', 'PATCH', 'POST', 'GET'], r: 1, e: '<b>PATCH</b> = cambio parcial. <b>PUT</b> reemplazaría el recurso completo y borraría lo que no mandes.' },
  { tema: 'Métodos', q: '¿Cuál de estos métodos NO es idempotente?', o: ['GET', 'PUT', 'DELETE', 'POST'], r: 3, e: '<b>POST no es idempotente</b>: si lo repites 5 veces creas 5 registros. GET, PUT y DELETE repetidos dejan el mismo estado final.' },
  { tema: 'Métodos', q: '¿Cuál es el único método considerado "seguro" (safe), porque no modifica nada?', o: ['POST', 'GET', 'PATCH', 'DELETE'], r: 1, e: '<b>GET</b> solo lee. Los demás modifican el estado del servidor.' },
  { tema: 'Códigos', q: 'Las familias de códigos HTTP son...', o: ['1xx, 2xx, 3xx, 4xx, 5xx', '100, 200, 300', '2xx, 4xx, 6xx', 'OK, ERROR, WARNING'], r: 0, e: 'Cinco familias: <b>1xx</b> informativas, <b>2xx</b> éxito, <b>3xx</b> redirección, <b>4xx</b> error del cliente, <b>5xx</b> error del servidor.' },
  { tema: 'Códigos', q: 'La familia <b>4xx</b> indica...', o: ['Error del servidor', 'Error del cliente', 'Éxito', 'Redirección'], r: 1, e: '<b>4xx = culpa del cliente</b>: pidió algo que no existe, mandó datos mal o no tiene permiso. Piensa en el 404.' },
  { tema: 'Códigos', q: 'La familia <b>5xx</b> indica...', o: ['Que el cliente mandó mal los datos', 'Que el recurso se movió', 'Que el servidor falló al procesar una petición válida', 'Que todo salió bien'], r: 2, e: '<b>5xx = culpa del servidor</b>. La petición estaba bien pero algo tronó del otro lado.' },
  { tema: 'Códigos', q: 'Haces <code>POST /v1/mascotas</code> y se registra correctamente. ¿Qué código esperas?', o: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'], r: 1, e: '<b>201 Created</b> es el código correcto cuando se crea un recurso nuevo. Suele venir con la cabecera <code>Location</code>.' },
  { tema: 'Códigos', q: 'Haces <code>GET /v1/mascotas/9999</code> y ese id no existe. ¿Qué código?', o: ['400', '403', '404', '500'], r: 2, e: '<b>404 Not Found</b>: la ruta es válida pero el elemento no existe.' },
  { tema: 'Códigos', q: 'Un <code>DELETE</code> exitoso que no devuelve nada en el cuerpo responde...', o: ['200 OK', '201 Created', '204 No Content', '404 Not Found'], r: 2, e: '<b>204 No Content</b>: salió bien y no hay nada que devolver.' },
  { tema: 'Códigos', q: 'Diferencia entre <b>401</b> y <b>403</b>:', o: ['Son lo mismo', '401 = no sé quién eres; 403 = sé quién eres pero no puedes', '401 = error del servidor; 403 = error del cliente', '401 = recurso movido; 403 = recurso borrado'], r: 1, e: '<b>401 Unauthorized</b> = falta autenticarte. <b>403 Forbidden</b> = estás autenticado pero no tienes permiso.' },
  { tema: 'Códigos', q: 'Mandas un POST con el JSON incompleto (falta un campo obligatorio). ¿Qué código?', o: ['400 Bad Request', '404 Not Found', '500 Internal Server Error', '201 Created'], r: 0, e: '<b>400 Bad Request</b>: la petición está mal formada. Es error del cliente, familia 4xx.' },
  { tema: 'Códigos', q: 'El código de la API lanza una excepción no controlada. ¿Qué devuelve?', o: ['400', '404', '500', '204'], r: 2, e: '<b>500 Internal Server Error</b>: falla inesperada del servidor. La petición del cliente estaba bien.' },
  { tema: 'Diseño', q: '¿Dónde van los filtros, como buscar solo perros?', o: ['En la ruta: /mascotas/filtrar/perro', 'En query params: /mascotas?especie=perro', 'En el método HTTP', 'En el código de estado'], r: 1, e: 'Filtrar, ordenar, buscar y paginar van en <b>query params</b>, después del <code>?</code>. La ruta nombra el recurso, no el filtro.' },
  { tema: 'Diseño', q: '¿Cómo expresas "las vacunas de la mascota 42"?', o: ['/vacunas?mascota=42&tipo=todas', '/mascotas/42/vacunas', '/getVacunasDeMascota/42', '/vacunas/mascotas/42'], r: 1, e: 'Las relaciones se expresan con <b>jerarquía</b>: <code>/mascotas/42/vacunas</code>. Se lee solo.' },
  { tema: 'Capas', q: '¿Cuál es el orden correcto de las capas?', o: ['Base de datos → Cliente → Servicio → Controlador', 'Cliente → Controlador → Servicio → Repositorio → Base de datos', 'Cliente → Base de datos → Servicio', 'Controlador → Cliente → Repositorio → Servicio'], r: 1, e: 'La petición baja: <b>Cliente → Controlador → Servicio → Repositorio → Base de datos</b>, y la respuesta sube por el mismo camino.' },
  { tema: 'Capas', q: '¿En qué capa viven las reglas del negocio (por ejemplo, "no se agenda en domingo")?', o: ['En el cliente', 'En el controlador', 'En la capa de servicio', 'En la base de datos'], r: 2, e: 'La <b>capa de servicio</b> es el cerebro: ahí viven las reglas. El controlador solo recibe y responde HTTP.' },
  { tema: 'Concepto', q: '¿En qué formato viajan normalmente los datos en una API REST moderna?', o: ['XML', 'JSON', 'CSV', 'HTML'], r: 1, e: '<b>JSON</b> es el estándar de facto: ligero, legible y lo entiende cualquier lenguaje.' },
  { tema: 'Diseño', q: '¿Para qué sirve poner <code>/v1/</code> en la URL?', o: ['Para que cargue más rápido', 'Para versionar la API y poder cambiarla sin romper a quien ya la usa', 'Es obligatorio en HTTP', 'Para indicar que usa HTTPS'], r: 1, e: '<b>Versionado</b>: te permite sacar una v2 con cambios sin tumbar a los clientes que siguen usando la v1.' },
  { tema: 'Códigos', q: 'Haces <code>GET /v1/mascotas</code> y no hay ninguna mascota registrada. ¿Qué responde?', o: ['404, porque no hay nada', '204, porque está vacío', '200 con una lista vacía []', '500'], r: 2, e: 'Truco clásico. La <b>colección sí existe</b>, solo está vacía: es <b>200 con un arreglo vacío</b>. El 404 sería si la ruta o el elemento no existieran.' }
];

/* ===========================================================
   RENDER
   =========================================================== */

/* ---- chuleta ---- */
function renderCheat() {
  const done = store.get('cheat', []);
  const g = $('#cheatGrid'); g.innerHTML = '';
  CHEAT.forEach((c, i) => {
    const n = el('div', 'cheat' + (done.includes(i) ? ' done' : ''), `<h4>${c.t}</h4><p>${c.d}</p>`);
    n.addEventListener('click', () => {
      const d = store.get('cheat', []);
      const idx = d.indexOf(i);
      if (idx > -1) d.splice(idx, 1); else d.push(i);
      store.set('cheat', d); renderCheat(); updateProgress();
    });
    g.appendChild(n);
  });
  $('#cheatCount').textContent = `${done.length} de ${CHEAT.length} dominadas`;
}

/* ---- restaurante ---- */
function renderResto() {
  const row = $('#restoRow'); row.innerHTML = '';
  RESTO.forEach((p, i) => {
    const n = el('div', 'resto-piece', `<span class="emo">${p.emo}</span><div class="nm">${p.nm}</div><div class="eq">${p.eq}</div>`);
    n.addEventListener('click', () => {
      $$('.resto-piece').forEach(x => x.classList.remove('on'));
      n.classList.add('on');
      $('#restoDetail').innerHTML = `<h4 style="margin-bottom:6px">${p.emo} ${p.nm} <span style="color:var(--cyan)">${p.eq}</span></h4><p style="margin:0">${p.txt}</p>`;
    });
    row.appendChild(n);
  });
}

/* ---- REST ---- */
function renderRest() {
  const g = $('#restGrid'); g.innerHTML = '';
  REST_RULES.forEach(r => {
    g.appendChild(el('div', 'rest-card' + (r.star ? ' star' : ''),
      `<div class="n">${r.n}</div><h4>${r.t}${r.star ? ' ⭐' : ''}</h4><p>${r.d}</p><p class="say">💬 ${r.say}</p>`));
  });
}

/* ---- URL ---- */
function renderUrl() {
  const b = $('#urlBox'); b.innerHTML = '';
  URL_PARTS.forEach(p => {
    const n = el('span', 'url-part', p.txt);
    n.addEventListener('click', () => {
      $$('.url-part').forEach(x => x.classList.remove('on'));
      n.classList.add('on');
      $('#urlDetail').innerHTML = `<h4 style="margin-bottom:6px;color:var(--cyan)">${p.nm}</h4><p style="margin:0"><code style="background:rgba(122,162,247,.15);padding:2px 7px;border-radius:6px">${p.txt}</code> — ${p.d}</p>`;
    });
    b.appendChild(n);
  });
}

/* ---- métodos ---- */
function renderMetodos() {
  const g = $('#metGrid'); g.innerHTML = '';
  METODOS.forEach(m => {
    g.appendChild(el('div', 'met', `
      <div class="tag" style="color:${m.color}">${m.m}</div>
      <div class="qh">${m.qh}</div>
      <p>${m.d}</p>
      <div class="ex">${m.ex}</div>
      <div class="flags">
        <span class="badge ${m.safe ? 'yes' : 'no'}">${m.safe ? '✓' : '✗'} Seguro</span>
        <span class="badge ${m.idem ? 'yes' : 'no'}">${m.idem ? '✓' : '✗'} Idempotente</span>
        <span class="badge code">${m.code}</span>
      </div>`)).style.borderTopColor = m.color;
  });
}

/* ---- familias ---- */
function renderFamilias() {
  const g = $('#famGrid'); g.innerHTML = '';
  FAMILIAS.forEach(f => {
    const n = el('div', 'fam', `
      ${f.principal ? '<span class="principal" style="color:' + f.c + '">PRINCIPAL</span>' : ''}
      <div class="num" style="color:${f.c}">${f.num}</div>
      <h4>${f.nm}</h4><p>${f.d}</p>
      <div class="quote" style="color:${f.c}">${f.q}</div>`);
    n.style.borderColor = f.c + '55';
    n.style.background = 'linear-gradient(160deg,' + f.c + '14, rgba(16,24,44,.6))';
    g.appendChild(n);
  });
  $('#mnemoList').innerHTML = MNEMO.map(m => `<li>${m}</li>`).join('');
}

/* ---- explorador de códigos ---- */
let codeFilter = 'todos';
const famColor = f => (FAMILIAS.find(x => x.num === f) || {}).c || '#38bdf8';

function renderCodeFilters() {
  const f = $('#codeFilters'); f.innerHTML = '';
  ['todos', '2xx', '3xx', '4xx', '5xx', '⭐ clave'].forEach(k => {
    const b = el('button', 'filter-btn' + (k === codeFilter ? ' on' : ''), k);
    b.addEventListener('click', () => { codeFilter = k; renderCodeFilters(); renderCodes(); });
    f.appendChild(b);
  });
}

function renderCodes() {
  const g = $('#codeGrid'); g.innerHTML = '';
  CODIGOS.filter(c => codeFilter === 'todos' || (codeFilter === '⭐ clave' ? c.star : c.f === codeFilter)).forEach(c => {
    const col = famColor(c.f);
    const n = el('div', 'code-chip', `${c.star ? '<span class="star">⭐</span>' : ''}<b style="color:${col}">${c.c}</b><span>${c.n}</span>`);
    n.dataset.col = col;
    n.style.borderColor = col + '55';
    n.addEventListener('click', () => {
      $$('.code-chip').forEach(x => { x.classList.remove('on'); x.style.borderColor = x.dataset.col + '55'; });
      n.classList.add('on'); n.style.borderColor = col;
      $('#codeDetail').innerHTML = `
        <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:8px">
          <span style="font-family:var(--mono);font-size:2rem;font-weight:900;color:${col}">${c.c}</span>
          <b style="font-size:1.1rem">${c.n}</b>
          <span class="badge code" style="color:${col};border-color:${col}66">familia ${c.f}</span>
          ${c.star ? '<span class="badge" style="color:var(--amber);border-color:rgba(251,191,36,.45)">⭐ cae en el examen</span>' : ''}
        </div>
        <p style="margin:0 0 8px">${c.d}</p>
        <div style="font-family:var(--mono);font-size:.85rem;background:#060a14;padding:9px 12px;border-radius:9px;border:1px solid var(--line)">Ejemplo: ${c.ex}</div>`;
      $('#codeDetail').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    g.appendChild(n);
  });
}

/* ---- flashcards ---- */
let flashIdx = 0;
const FLASH = CODIGOS.filter(c => c.star).concat(CODIGOS.filter(c => !c.star));
function renderFlash() {
  const c = FLASH[flashIdx];
  $('#flashcard').classList.remove('flipped');
  setTimeout(() => {
    $('#flashFront').textContent = c.c;
    $('#flashBackTitle').textContent = c.c + ' · ' + c.n;
    $('#flashBackDesc').innerHTML = c.d;
  }, 160);
  $('#flashCount').textContent = `${flashIdx + 1} / ${FLASH.length}`;
}

/* ---- versus ---- */
function renderVersus() {
  const g = $('#versus'); g.innerHTML = '';
  VERSUS.forEach(v => {
    g.appendChild(el('div', 'vs-card', `<h4>${v.t}</h4>` +
      v.rows.map(r => `<div class="vs-row"><span class="vs-code">${r[0]}</span><span class="vs-txt">${r[1]}</span></div>`).join('')));
  });
}

/* ---- reglas ---- */
function renderRules() {
  const g = $('#rules'); g.innerHTML = '';
  RULES.forEach(r => {
    g.appendChild(el('div', 'rule', `<h4>${r.t}</h4>
      <div class="good">✅ <span>${r.good}</span></div>
      <div class="bad">❌ <span>${r.bad}</span></div>
      <p>${r.p}</p>`));
  });
}

/* ---- validador de rutas ---- */
function validar(ruta) {
  const out = [];
  const r = (ruta || '').trim();
  if (!r) return [['warn', 'Escribe una ruta para revisarla.']];
  if (!r.startsWith('/')) out.push(['err', 'Debe empezar con <b>/</b>.']);

  const sinQuery = r.split('?')[0];
  const partes = sinQuery.split('/').filter(Boolean);

  if (/[A-Z]/.test(sinQuery)) out.push(['err', 'Tiene <b>mayúsculas</b>. Las URLs van en minúsculas.']);
  const verbos = ['get', 'post', 'obtener', 'crear', 'borrar', 'eliminar', 'actualizar', 'listar', 'buscar', 'consultar', 'agregar', 'insertar', 'update', 'delete', 'create', 'add', 'fetch', 'filtrar', 'guardar', 'editar', 'modificar', 'registrar', 'traer', 'ver'];
  const conVerbo = partes.find(p => verbos.some(v => p.toLowerCase() === v || p.toLowerCase().startsWith(v) && p.length > v.length && /[A-Z-]/.test(p[v.length] || '')));
  if (conVerbo) out.push(['err', `<b>«${conVerbo}»</b> parece un verbo. El verbo lo pone el método HTTP, no la URL. Usa solo el sustantivo.`]);

  if (/_/.test(sinQuery)) out.push(['warn', 'Usa <b>guion medio</b> (-) en vez de guion bajo (_) para separar palabras.']);

  const sustantivos = partes.filter(p => !/^\{?\d/.test(p) && !/^\{.*\}$/.test(p) && !/^v\d+$/.test(p) && !/^api$/i.test(p));
  const singular = sustantivos.find(p => !/s$|es$/.test(p.toLowerCase()) && !verbos.includes(p.toLowerCase()));
  if (singular && !conVerbo) out.push(['warn', `<b>«${singular}»</b> parece estar en <b>singular</b>. Los recursos van en plural: «${singular}s».`]);

  if (!partes.some(p => /^v\d+$/.test(p))) out.push(['warn', 'No veo versión (<b>/v1</b>). No es obligatorio, pero suma puntos.']);

  if (r.includes('?')) {
    const q = r.split('?')[1];
    out.push(['ok', `Query params detectados (<code>${q}</code>). Perfecto: los filtros van aquí, no en la ruta.`]);
  }

  const idx = partes.findIndex(p => /^\d+$|^\{.*\}$/.test(p));
  if (idx > 0) out.push(['ok', `Identificador <b>«${partes[idx]}»</b> bien colocado después de la colección «${partes[idx - 1]}».`]);

  if (!out.some(o => o[0] === 'err' || o[0] === 'warn')) out.unshift(['ok', '<b>¡Ruta correcta!</b> Cumple las reglas de nombrado REST.']);
  else if (!out.some(o => o[0] === 'err')) out.unshift(['ok', 'No hay errores graves, solo detalles que pulir.']);
  return out;
}

function pintarValidacion(ruta) {
  const res = validar(ruta);
  $('#valOut').innerHTML = res.map(([t, m]) =>
    `<div class="val-item val-${t === 'err' ? 'err' : t === 'warn' ? 'warn' : 'ok'}"><span>${t === 'err' ? '❌' : t === 'warn' ? '⚠️' : '✅'}</span><span>${m}</span></div>`).join('');
}

/* ---- capas ---- */
function renderLayers() {
  const g = $('#layers'); g.innerHTML = '';
  LAYERS.forEach((l, i) => {
    const n = el('div', 'layer', `<span class="emo">${l.emo}</span><div><div class="nm">${l.nm}</div><div class="sh">${l.sh}</div></div>`);
    n.addEventListener('click', () => {
      $$('.layer').forEach(x => x.classList.remove('on'));
      n.classList.add('on');
      $('#layerDetail').innerHTML = `<h4 style="margin-bottom:6px">${l.emo} ${l.nm}</h4><p style="margin:0">${l.d}</p>`;
    });
    g.appendChild(n);
    if (i < LAYERS.length - 1) g.appendChild(el('div', 'layer-arrow', '↓'));
  });
}

/* ---- giros ---- */
let giroActual = 0;
const mColor = m => (METODOS.find(x => x.m === m) || {}).color || '#38bdf8';

function renderGiroTabs() {
  const t = $('#giroTabs'); t.innerHTML = '';
  GIROS.forEach((g, i) => {
    const b = el('button', 'giro-tab' + (i === giroActual ? ' on' : ''), `<span>${g.emo}</span> ${g.nm}`);
    b.addEventListener('click', () => { giroActual = i; store.set('giro', i); renderGiroTabs(); renderGiro(); });
    t.appendChild(b);
  });
}

function renderGiro() {
  const g = GIROS[giroActual];
  const jsonTxt = JSON.stringify(g.json.body, null, 2);
  $('#giroBody').innerHTML = `
    <div class="giro-title"><span class="emo">${g.emo}</span><h3>API de ${g.nm}</h3></div>
    <p class="giro-sub">${g.sub}</p>

    <div class="gblock">
      <h4>1 · Recursos (sustantivos en plural)</h4>
      <div class="res-chips">${g.recursos.map(r => `<span class="res-chip">${r}</span>`).join('')}</div>
    </div>

    <div class="gblock">
      <h4>2 · Los 5 endpoints principales</h4>
      <div class="table-scroll"><table class="ep-table">
        <thead><tr><th>Método</th><th>Endpoint</th><th>Qué hace</th><th>Códigos</th></tr></thead>
        <tbody>${g.eps.map(e => `<tr>
          <td><span class="m-tag" style="background:${mColor(e.m)}22;color:${mColor(e.m)};border:1px solid ${mColor(e.m)}55">${e.m}</span></td>
          <td class="ep-path">${e.p}</td>
          <td>${e.d}</td>
          <td><div class="ep-codes">${e.c.map(c => `<span class="ep-code" style="background:${famColor(String(c)[0] + 'xx')}22;color:${famColor(String(c)[0] + 'xx')}">${c}</span>`).join('')}</div></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="gblock">
      <h4>3 · JSON de ejemplo</h4>
      <div class="copy-row">
        <span class="muted small" style="font-family:var(--mono)">${g.json.recurso}</span>
        <button class="btn btn-ghost btn-sm" id="copyJson">📋 Copiar</button>
      </div>
      <pre><code id="jsonTxt">${jsonTxt.replace(/</g, '&lt;')}</code></pre>
    </div>

    <div class="gblock">
      <h4>4 · Códigos de estado esperados</h4>
      <div class="ep-codes" style="gap:8px">
        <span class="ep-code" style="background:#34d39922;color:#34d399;padding:6px 12px;font-size:.85rem">200 OK — consultas correctas</span>
        <span class="ep-code" style="background:#34d39922;color:#34d399;padding:6px 12px;font-size:.85rem">201 Created — al registrar</span>
        <span class="ep-code" style="background:#34d39922;color:#34d399;padding:6px 12px;font-size:.85rem">204 No Content — al borrar</span>
        <span class="ep-code" style="background:#fbbf2422;color:#fbbf24;padding:6px 12px;font-size:.85rem">400 Bad Request — datos mal</span>
        <span class="ep-code" style="background:#fbbf2422;color:#fbbf24;padding:6px 12px;font-size:.85rem">404 Not Found — id inexistente</span>
        <span class="ep-code" style="background:#fb718522;color:#fb7185;padding:6px 12px;font-size:.85rem">500 Internal Error — falla del servidor</span>
      </div>
    </div>

    <div class="gblock" style="margin-bottom:0">
      <h4>5 · Diagrama de capas (cópialo tal cual)</h4>
      <div class="mini-layers">
        ${LAYERS.map(l => `<div class="mini-layer"><span>${l.emo}</span><b>${l.nm}</b><span class="muted">${l.sh}</span></div>`).join('<div style="text-align:center;color:var(--cyan);font-weight:900">↓</div>')}
      </div>
    </div>`;

  const cb = $('#copyJson');
  if (cb) cb.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(jsonTxt); cb.textContent = '✅ Copiado'; }
    catch (e) { cb.textContent = '⚠️ Selecciónalo a mano'; }
    setTimeout(() => cb.textContent = '📋 Copiar', 1800);
  });
}

/* ---- checklist ---- */
function renderChecklist() {
  const done = store.get('chk', []);
  const c = $('#checklist'); c.innerHTML = '';
  CHECKLIST.forEach((t, i) => {
    const n = el('div', 'chk' + (done.includes(i) ? ' done' : ''), `<div class="chk-box">✓</div><div class="chk-txt">${t}</div>`);
    n.addEventListener('click', () => {
      const d = store.get('chk', []); const ix = d.indexOf(i);
      if (ix > -1) d.splice(ix, 1); else d.push(i);
      store.set('chk', d); renderChecklist(); updateProgress();
    });
    c.appendChild(n);
  });
}

/* ===========================================================
   SIMULADOR
   =========================================================== */
const SIM_RECURSOS = ['mascotas', 'citas', 'socios', 'boletos', 'libros', 'pedidos', 'pacientes'];
const SIM_EJEMPLOS = {
  mascotas: { nombre: 'Firulais', especie: 'perro', edad: 4 },
  citas: { pacienteId: 55, fecha: '2026-09-18T10:30:00', motivo: 'Consulta' },
  socios: { nombre: 'Diego Benítez', plan: 'mensual', activo: true },
  boletos: { funcionId: 88, asiento: 'F12', precio: 95 },
  libros: { titulo: 'Clean Code', autor: 'Robert C. Martin', disponible: true },
  pedidos: { mesaId: 7, total: 245.5, estado: 'en preparación' },
  pacientes: { nombre: 'Ana López', edad: 31, sangre: 'O+' }
};

function initSim() {
  const ms = $('#simMetodo'), rs = $('#simRecurso');
  METODOS.forEach(m => { const o = el('option', '', m.m); o.value = m.m; ms.appendChild(o); });
  SIM_RECURSOS.forEach(r => { const o = el('option', '', '/' + r); o.value = r; rs.appendChild(o); });
  ['#simMetodo', '#simRecurso', '#simId', '#simCaso'].forEach(s => $(s).addEventListener('change', runSim));
  runSim();
}

function runSim() {
  const m = $('#simMetodo').value, rec = $('#simRecurso').value;
  const conId = $('#simId').value === 'si', caso = $('#simCaso').value;
  const ruta = '/v1/' + rec + (conId ? '/42' : '');
  const cuerpo = SIM_EJEMPLOS[rec];

  let req = `${m} ${ruta} HTTP/1.1\nHost: api.ejemplo.com\nAccept: application/json`;
  if (caso !== 'sintoken') req += `\nAuthorization: Bearer eyJhbGciOi...`;
  if (['POST', 'PUT', 'PATCH'].includes(m)) {
    req += `\nContent-Type: application/json\n\n` + JSON.stringify(caso === 'malos' ? { nombre: '' } : cuerpo, null, 2);
  }

  let code, nm, body, why;

  if (caso === 'sintoken') {
    code = 401; nm = 'Unauthorized'; body = { error: 'Token no proporcionado' };
    why = '<b>401</b> porque el servidor <b>no sabe quién eres</b>. Ojo: si supiera quién eres pero no te dejara, sería <b>403</b>.';
  } else if (caso === 'servidor') {
    code = 500; nm = 'Internal Server Error'; body = { error: 'Error inesperado en el servidor' };
    why = '<b>500</b>: familia <b>5xx</b>, la culpa es del <b>servidor</b>. Tu petición estaba bien formada; algo tronó del otro lado.';
  } else if (caso === 'malos' && ['POST', 'PUT', 'PATCH'].includes(m)) {
    code = 400; nm = 'Bad Request'; body = { error: 'El campo "nombre" es obligatorio' };
    why = '<b>400</b>: familia <b>4xx</b>, la culpa es del <b>cliente</b>. Mandaste el cuerpo incompleto o mal formado.';
  } else if (caso === 'malos') {
    code = 200; nm = 'OK'; body = { nota: 'GET y DELETE no llevan cuerpo, así que este escenario no aplica' };
    why = 'Los métodos <b>GET</b> y <b>DELETE</b> normalmente <b>no llevan cuerpo</b>, así que no puede haber "datos inválidos". Cambia a POST, PUT o PATCH para ver el 400.';
  } else if (caso === 'noexiste' && conId) {
    code = 404; nm = 'Not Found'; body = { error: `No existe ${rec.slice(0, -1)} con id 42` };
    why = '<b>404</b>: la ruta es correcta pero <b>ese elemento no existe</b>. Es error del cliente (4xx) porque pidió algo que no está.';
  } else if (caso === 'noexiste' && !conId) {
    code = 200; nm = 'OK'; body = { datos: [], total: 0 };
    why = '⚠️ <b>Trampa de examen.</b> Si pides la <b>colección completa</b> y está vacía, NO es 404: la colección sí existe. Es <b>200 con una lista vacía</b>.';
  } else if (m === 'GET') {
    code = 200; nm = 'OK';
    body = conId ? Object.assign({ id: 42 }, cuerpo) : { datos: [Object.assign({ id: 42 }, cuerpo)], total: 1, pagina: 1 };
    why = '<b>200 OK</b>: la lectura salió bien y te devuelve los datos. GET nunca modifica nada (es "seguro").';
  } else if (m === 'POST' && !conId) {
    code = 201; nm = 'Created'; body = Object.assign({ id: 43 }, cuerpo);
    why = '<b>201 Created</b> porque se <b>creó</b> un recurso nuevo. La respuesta suele traer la cabecera <code>Location: ' + ruta + '/43</code> con la URL del recurso nuevo.';
  } else if (m === 'POST' && conId) {
    code = 405; nm = 'Method Not Allowed'; body = { error: 'No se puede crear sobre un id existente' };
    why = '<b>405</b>: POST se usa sobre la <b>colección</b> (<code>/v1/' + rec + '</code>), no sobre un id concreto. El servidor le asigna el id, tú no.';
  } else if ((m === 'PUT' || m === 'PATCH') && conId) {
    code = 200; nm = 'OK'; body = Object.assign({ id: 42 }, cuerpo, { actualizado: true });
    why = m === 'PUT'
      ? '<b>200 OK</b>: PUT <b>reemplaza el recurso completo</b>. Lo que no mandes en el cuerpo se pierde.'
      : '<b>200 OK</b>: PATCH cambia <b>solo los campos que mandaste</b>. El resto queda igual.';
  } else if ((m === 'PUT' || m === 'PATCH') && !conId) {
    code = 405; nm = 'Method Not Allowed'; body = { error: 'Indica qué elemento quieres modificar' };
    why = '<b>405</b>: para modificar hay que decir <b>cuál</b>. ' + m + ' necesita un id: <code>' + ruta + '/42</code>.';
  } else if (m === 'DELETE' && conId) {
    code = 204; nm = 'No Content'; body = null;
    why = '<b>204 No Content</b>: se borró correctamente y <b>no hay nada que devolver</b>. Por eso el cuerpo va vacío.';
  } else {
    code = 405; nm = 'Method Not Allowed'; body = { error: 'No se permite borrar la colección completa' };
    why = '<b>405</b>: un DELETE sobre la colección borraría <b>todo</b>. Casi ninguna API lo permite.';
  }

  const col = famColor(String(code)[0] + 'xx');
  $('#simRequest').textContent = req;
  $('#simStatus').innerHTML = `<span style="color:${col}">${code} ${nm}</span>`;
  $('#simStatus').style.background = col + '14';
  $('#simResponse').textContent = body === null ? '(sin cuerpo)' : JSON.stringify(body, null, 2);
  $('#simWhy').innerHTML = '💡 ' + why;
}

/* ===========================================================
   QUIZ
   =========================================================== */
let qOrden = [], qIdx = 0, qScore = 0, qFallos = [];

function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; }

function quizStart(soloFallos) {
  qOrden = soloFallos && qFallos.length ? qFallos.slice() : shuffle(QUIZ.map((_, i) => i));
  qIdx = 0; qScore = 0; qFallos = [];
  $('#quizStart').classList.add('hidden');
  $('#quizEnd').classList.add('hidden');
  $('#quizRun').classList.remove('hidden');
  pintarPregunta();
}

function pintarPregunta() {
  const q = QUIZ[qOrden[qIdx]];
  $('#quizNum').textContent = `${qIdx + 1} / ${qOrden.length}`;
  $('#quizScore').textContent = `${qScore} ✓`;
  $('#quizBarFill').style.width = (qIdx / qOrden.length * 100) + '%';
  $('#quizTag').textContent = q.tema;
  $('#quizQ').innerHTML = q.q;
  $('#quizFb').classList.add('hidden');
  $('#quizNext').classList.add('hidden');

  const o = $('#quizOpts'); o.innerHTML = '';
  shuffle(q.o.map((t, i) => ({ t, i }))).forEach(op => {
    const b = el('button', 'qopt', op.t);
    b.addEventListener('click', () => responder(op.i, b, q));
    o.appendChild(b);
  });
}

function responder(elegida, boton, q) {
  $$('.qopt').forEach(b => { b.disabled = true; if (b.textContent === q.o[q.r]) b.classList.add('right'); });
  const ok = elegida === q.r;
  if (ok) { qScore++; $('#quizScore').textContent = `${qScore} ✓`; }
  else { boton.classList.add('wrong'); qFallos.push(qOrden[qIdx]); }

  const fb = $('#quizFb');
  fb.className = 'quiz-fb ' + (ok ? 'ok' : 'no');
  fb.innerHTML = (ok ? '✅ <b>¡Correcto!</b> ' : '❌ <b>No era esa.</b> ') + q.e;
  fb.classList.remove('hidden');
  $('#quizNext').classList.remove('hidden');
  $('#quizNext').textContent = qIdx + 1 >= qOrden.length ? 'Ver resultado →' : 'Siguiente →';
}

function quizSiguiente() {
  qIdx++;
  if (qIdx >= qOrden.length) return quizFin();
  pintarPregunta();
}

function quizFin() {
  $('#quizRun').classList.add('hidden');
  $('#quizEnd').classList.remove('hidden');
  const total = qOrden.length;
  $('#finalScore').textContent = qScore;
  $('#finalScore').nextElementSibling.textContent = '/' + total;
  const pct = qScore / total;
  $('#srFg').style.strokeDashoffset = 326.7 * (1 - pct);
  $('#srFg').style.stroke = pct >= .8 ? 'var(--green)' : pct >= .6 ? 'var(--amber)' : 'var(--red)';

  let msg;
  if (pct === 1) msg = '🏆 Perfecto. Vas blindado al examen.';
  else if (pct >= .85) msg = '🔥 Muy bien. Repasa lo poco que falló y listo.';
  else if (pct >= .6) msg = '💪 Vas bien, pero hay huecos. Otra vuelta y quedas.';
  else msg = '📚 Todavía no. Vuelve a la chuleta y a los códigos, luego repite.';
  $('#finalMsg').textContent = msg;

  const temas = [...new Set(qFallos.map(i => QUIZ[i].tema))];
  $('#finalWeak').innerHTML = temas.length
    ? '<p class="muted" style="margin:10px 0 4px">Repasa estos temas:</p>' + temas.map(t => `<span class="weak">${t}</span>`).join('')
    : '<p class="muted">No fallaste ningún tema. 👏</p>';
  $('#quizWrong').classList.toggle('hidden', qFallos.length === 0);

  const best = store.get('best', 0);
  if (qScore > best) store.set('best', qScore);
  store.set('quizHecho', true);
  updateProgress();
}

/* ===========================================================
   NAV, PROGRESO, COUNTDOWN
   =========================================================== */
function updateProgress() {
  const cheat = store.get('cheat', []).length / CHEAT.length;
  const chk = store.get('chk', []).length / CHECKLIST.length;
  const quiz = store.get('best', 0) / QUIZ.length;
  const pct = Math.round((cheat * 0.35 + chk * 0.25 + quiz * 0.4) * 100);
  $('#progressPct').textContent = pct + '%';
  $('#ringFg').style.strokeDashoffset = 97.4 * (1 - pct / 100);
}

function initNav() {
  const secs = $$('section[id]');
  const chips = $$('.chip');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        chips.forEach(c => c.classList.toggle('active', c.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => obs.observe(s));

  window.addEventListener('scroll', () => {
    $('#toTop').classList.toggle('show', window.scrollY > 700);
  }, { passive: true });

  chips.forEach(c => c.addEventListener('click', () => {
    setTimeout(() => c.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }), 400);
  }));
}

function initCountdown() {
  const tick = () => {
    const now = new Date();
    const t = new Date(now);
    const dias = (8 - now.getDay()) % 7 || 7;      // próximo lunes
    t.setDate(now.getDate() + dias);
    t.setHours(7, 0, 0, 0);
    if (now.getDay() === 1 && now.getHours() < 7) { t.setDate(t.getDate() - 7); }
    let ms = t - now;
    if (ms < 0) ms = 0;
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24,
      m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    $('#cdD').textContent = d; $('#cdH').textContent = String(h).padStart(2, '0');
    $('#cdM').textContent = String(m).padStart(2, '0'); $('#cdS').textContent = String(s).padStart(2, '0');
  };
  tick(); setInterval(tick, 1000);
}

/* ===========================================================
   ARRANQUE
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  $('#statQuiz').textContent = QUIZ.length;
  $('#quizTotal').textContent = QUIZ.length;

  renderCheat(); renderResto(); renderRest(); renderUrl(); renderMetodos();
  renderFamilias(); renderCodeFilters(); renderCodes(); renderFlash(); renderVersus();
  renderRules(); renderLayers();
  giroActual = store.get('giro', 0);
  renderGiroTabs(); renderGiro(); renderChecklist();
  initSim(); initNav(); initCountdown(); updateProgress();

  /* flashcards */
  $('#flashcard').addEventListener('click', () => $('#flashcard').classList.toggle('flipped'));
  $('#flashNext').addEventListener('click', () => { flashIdx = (flashIdx + 1) % FLASH.length; renderFlash(); });
  $('#flashPrev').addEventListener('click', () => { flashIdx = (flashIdx - 1 + FLASH.length) % FLASH.length; renderFlash(); });

  /* validador */
  $('#valBtn').addEventListener('click', () => pintarValidacion($('#valInput').value));
  $('#valInput').addEventListener('keydown', e => { if (e.key === 'Enter') pintarValidacion($('#valInput').value); });
  $$('.val-examples .pill').forEach(p => p.addEventListener('click', () => {
    $('#valInput').value = p.dataset.val; pintarValidacion(p.dataset.val);
  }));

  /* quiz */
  $('#quizStartBtn').addEventListener('click', () => quizStart(false));
  $('#quizNext').addEventListener('click', quizSiguiente);
  $('#quizAgain').addEventListener('click', () => quizStart(false));
  $('#quizWrong').addEventListener('click', () => quizStart(true));
  const best = store.get('best', 0);
  if (best) $('#quizLast').innerHTML = `Tu mejor resultado: <b style="color:var(--green)">${best}/${QUIZ.length}</b>`;

  /* chuleta reset */
  $('#resetCheat').addEventListener('click', () => { store.set('cheat', []); renderCheat(); updateProgress(); });

  /* borrar avance */
  $('#wipe').addEventListener('click', () => {
    ['cheat', 'chk', 'best', 'quizHecho', 'giro'].forEach(k => store.del(k));
    renderCheat(); renderChecklist(); updateProgress();
    $('#quizLast').textContent = '';
    $('#wipe').textContent = '✅ Listo, avance borrado';
    setTimeout(() => $('#wipe').textContent = 'Borrar mi avance', 2000);
  });
});
