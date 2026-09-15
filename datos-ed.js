/* ============================================================
   Estructura de Datos — CONTENIDO
   Tema 1: Recursividad, en Java y desde cero.
   Todo lo que se estudia de esta materia vive aquí: si hay que corregir
   un dato, un ejemplo o una pregunta, este es el archivo que se toca.

   Ojo con el código Java: cada ejemplo, cada «¿qué imprime?» y cada
   pregunta con código se compiló y se corrió de verdad antes de
   publicarse. Si cambias uno, vuelve a probarlo.
   ============================================================ */

/* ---------- la chuleta ----------
   enHoja: false = no sale en la hoja impresa porque ahí ya lo dice otra sección. */
const ED_CHEAT = [
  { t: 'Recursividad', d: 'Un método que <b>se llama a sí mismo</b> para resolver una versión <b>más pequeña</b> del mismo problema.' },
  { t: 'Caso base', d: 'La <b>condición de paro</b>: se contesta directo, sin volver a llamar al método. Sin él, las llamadas no paran y el programa truena.' },
  { t: 'Caso recursivo', d: 'El método se llama con un problema <b>más pequeño</b> y usa lo que le devuelven para armar su respuesta.' },
  { t: 'Siempre hacia el caso base', d: 'Cada llamada debe acercarse: <code>n - 1</code>, <code>n / 10</code>, <code>s.substring(1)</code>, la mitad del arreglo.' },
  { t: 'La pila de llamadas', d: 'Cada llamada <b>apila un marco</b> con sus propias variables. La última en entrar es la primera en terminar: <b>LIFO</b>.' },
  { t: 'Ida y vuelta', d: 'Lo que va <b>antes</b> de la llamada sale en el orden de las llamadas: 3 2 1. Lo que va <b>después</b> sale en orden inverso: 1 2 3.' },
  { t: 'return no es println', d: '<code>return</code> le <b>devuelve</b> el valor a quien llamó. <code>println</code> solo lo <b>muestra</b> en pantalla.' },
  { t: 'StackOverflowError', d: 'Se llenó la pila. Casi siempre porque <b>falta el caso base</b> o las llamadas <b>no se acercan</b> a él.' },
  { t: 'Factorial', enHoja: false, d: '<code>if (n == 0) return 1;</code><br><code>return n * factorial(n - 1);</code>' },
  { t: 'Fibonacci', enHoja: false, d: '<code>if (n &lt;= 1) return n;</code><br><code>return fib(n - 1) + fib(n - 2);</code><br>Dos llamadas por vez: recursión <b>múltiple</b>.' },
  { t: 'Recursión vs ciclo', enHoja: false, d: 'Todo lo recursivo se puede hacer con un ciclo. La recursión se lee más clara; el ciclo gasta <b>menos memoria</b>.' },
  { t: '/ y % entre enteros', enHoja: false, d: '<code>7 / 2</code> da <b>3</b>: se tiran los decimales. <code>7 % 2</code> da <b>1</b>: el residuo.' }
];

/* ============================================================
   JAVA DESDE CERO
   ============================================================ */

/* Explorador «toca cada pieza». Cada renglón es una lista de pedazos
   [texto, número de parte]; los pedazos sin número no se pueden tocar. */
const ED_ANATOMIAS = {
  hola: {
    lineas: [
      [['public class Main', 0], [' {', 4]],
      [['    '], ['public static void main(String[] args)', 1], [' {', 4]],
      [['        '], ['System.out.println("¡Hola!")', 2], [';', 3]],
      [['    '], ['}', 4]],
      [['}', 4]]
    ],
    partes: [
      { n: 'La clase', d: 'En Java todo el código vive dentro de una <b>clase</b>, que por ahora puedes imaginar como la carpeta del programa. <code>public class Main</code> crea una clase que se llama <code>Main</code>. Ojo: el archivo se tiene que llamar exactamente igual, <code>Main.java</code>, con la misma mayúscula.' },
      { n: 'El método main', d: 'La <b>puerta de entrada</b>. Cuando corres el programa, Java busca este método y ejecuta lo que tiene adentro, renglón por renglón, de arriba hacia abajo. Se escribe siempre así, letra por letra. No necesitas entender cada palabra todavía: más abajo vas a ver qué significan <code>public</code>, <code>static</code> y <code>void</code>. Lo de adentro de los paréntesis, <code>String[] args</code>, sirve para mandarle datos al programa al arrancarlo; en este tema no se usa.' },
      { n: 'Imprimir en pantalla', d: '<code>System.out.println(...)</code> muestra en la <b>consola</b> (la ventana de texto donde aparece lo que imprime tu programa) lo que pongas entre los paréntesis, y luego salta de renglón. El texto va entre comillas dobles. Existe también <code>System.out.print(...)</code>, sin «ln», que <b>no</b> salta de renglón: lo siguiente se escribe pegado. Y <code>System.out.println()</code>, con los paréntesis vacíos, solo salta de renglón.' },
      { n: 'El punto y coma', d: 'Cada instrucción termina con <code>;</code>, como el punto al final de una oración. Si se te olvida, el programa <b>no compila</b>: es el error más común de quien empieza, y Java te dice en qué renglón falta.' },
      { n: 'Las llaves', d: 'Las llaves <code>{ }</code> marcan dónde empieza y dónde termina un bloque: una clase, un método, un <code>if</code>. Siempre van en pareja: cada <code>{</code> tiene su <code>}</code>. Los espacios de la izquierda (la sangría) no los exige Java, pero sin ellos no se entiende qué está dentro de qué.' }
    ]
  },
  metodo: {
    lineas: [
      [['public', 0], [' '], ['static', 1], [' '], ['int', 2], [' '], ['sumar', 3], ['(int a, int b)', 4], [' {', 5]],
      [['    '], ['int resultado = a + b;', 5]],
      [['    '], ['return resultado;', 6]],
      [['}', 5]]
    ],
    partes: [
      { n: 'public', d: 'Dice <b>quién puede usar</b> el método: <code>public</code> significa que cualquiera. En los ejercicios de recursividad casi siempre lo vas a ver así, y no hace falta darle más vueltas por ahora.' },
      { n: 'static', d: 'Significa que el método <b>pertenece a la clase</b> y se puede llamar directo desde <code>main</code>, sin crear objetos. Como <code>main</code> es <code>static</code>, los métodos que llames desde ahí también tienen que serlo. Si se te olvida, Java marca error.' },
      { n: 'Tipo de retorno', d: 'Qué <b>tipo de dato devuelve</b> el método cuando termina: aquí, un <code>int</code>. Si el método no devuelve nada (por ejemplo, solo imprime), en este lugar va <code>void</code>, que significa «vacío».' },
      { n: 'Nombre', d: 'Cómo se llama el método. Por costumbre empieza con minúscula y, si son varias palabras, cada palabra nueva empieza con mayúscula: <code>sumarDigitos</code>, <code>cuentaRegresiva</code>. Es lo que escribes para usarlo.' },
      { n: 'Parámetros', d: 'Los datos que el método <b>necesita recibir</b> para trabajar, cada uno con su tipo y separados por coma. Aquí recibe dos enteros que se llamarán <code>a</code> y <code>b</code>. Dentro del método se usan como variables normales. Si no necesita nada, los paréntesis van vacíos: <code>()</code>.' },
      { n: 'Cuerpo', d: 'Las instrucciones entre llaves: lo que el método <b>hace</b>. Se ejecutan de arriba hacia abajo cada vez que alguien lo llama. Aquí crea una variable <code>resultado</code> con la suma.' },
      { n: 'return', d: '<b>Devuelve</b> el resultado a quien llamó al método y lo <b>termina en ese instante</b>: cuando se ejecuta un <code>return</code>, lo que sigue ya no corre en esa llamada. Lo que devuelves tiene que ser del tipo que prometiste en la firma, el primer renglón del método (aquí, <code>int</code>).' }
    ]
  },
  recursivo: {
    lineas: [
      [['public static int suma(int n)', 0], [' {']],
      [['    '], ['if (n == 0)', 1], [' {']],
      [['        '], ['return 0;', 2]],
      [['    }']],
      [['    return '], ['n + ', 5], ['suma(', 3], ['n - 1', 4], [')', 3], [';']],
      [['}']]
    ],
    partes: [
      { n: 'La firma: un método normal', d: 'Nada especial: <code>suma</code> recibe un <code>int</code> y devuelve un <code>int</code>. Lo que lo vuelve recursivo no está en la firma, sino en que <b>adentro se llama a sí mismo</b>. La idea es calcular 1 + 2 + … + n.' },
      { n: 'La condición del caso base', d: 'La pregunta que se hace <b>antes de la llamada recursiva</b>: ¿ya llegué al caso tan pequeño que sé la respuesta sin calcular? Para la suma, ese caso es cuando n vale 0. Va antes porque, si la llamada estuviera primero, nunca se alcanzaría a revisar.' },
      { n: 'La respuesta del caso base', d: 'Si n es 0, la suma de «nada» es 0: se <b>devuelve directo</b>, sin volver a llamar al método. Aquí es donde la recursión <b>se detiene</b>. Sin este renglón, las llamadas no pararían hasta que el programa truene.' },
      { n: 'La llamada recursiva', d: 'El método <b>se llama a sí mismo</b>. No es un truco ni un error: Java crea una llamada nueva de <code>suma</code>, con su propia <code>n</code>, y la actual se queda <b>esperando</b> su resultado.' },
      { n: 'El problema más pequeño', d: 'La llamada no usa <code>n</code>, usa <code>n - 1</code>: un problema <b>un poquito más chico</b>. Así, cada llamada se acerca al 0 del caso base: 4, 3, 2, 1, 0. Si pusieras <code>n</code> o <code>n + 1</code>, nunca llegaría.' },
      { n: 'Qué hace con el resultado', d: 'Cuando la llamada regresa con la suma de los anteriores, se le agrega <code>n</code>. Esta es la parte que «arma» la respuesta: suma(4) = 4 + suma(3). La suma espera en pausa hasta que <code>suma(n - 1)</code> termina.' }
    ]
  }
};

/* Tabla de tipos de datos */
const ED_TIPOS_DATO = [
  { t: 'int', que: 'Números enteros', ej: 'int edad = 20;', nota: 'El que más vas a usar. Llega hasta 2,147,483,647: si te pasas, el número «da la vuelta» y sale un resultado equivocado (a veces negativo), sin avisar.' },
  { t: 'long', que: 'Enteros muy grandes', ej: 'long grande = 6227020800L;', nota: 'Para resultados que no caben en un int, como el factorial de 13 a 20 (el de 21 ya tampoco cabe). Al escribir un número tan grande directo se le pone una L al final.' },
  { t: 'double', que: 'Números con decimales', ej: 'double promedio = 8.5;', nota: 'Con punto, nunca con coma. <code>7.0 / 2</code> sí da 3.5.' },
  { t: 'boolean', que: 'Verdadero o falso', ej: 'boolean aprobado = true;', nota: 'Solo puede valer <code>true</code> o <code>false</code>. Es lo que da una comparación como <code>n == 0</code>.' },
  { t: 'char', que: 'Un solo carácter', ej: "char letra = 'A';", nota: "Va entre comillas <b>simples</b>. <code>'A'</code> es un char; <code>\"A\"</code> es un String." },
  { t: 'String', que: 'Texto', ej: 'String nombre = "Ana";', nota: 'Va entre comillas <b>dobles</b> y se escribe con S mayúscula, porque no es un tipo simple: es una clase que trae métodos útiles.' }
];

/* Autoevaluación al final de «Java desde cero» */
const ED_JAVA_CHECK = [
  'Sé para qué sirve <code>main</code> y que los métodos se escriben dentro de la clase, pero fuera de <code>main</code>',
  'Distingo <code>int</code>, <code>long</code>, <code>double</code>, <code>boolean</code>, <code>char</code> y <code>String</code>',
  'Sé cuánto dan <code>17 / 5</code> y <code>17 % 5</code> en Java (3 y 2)',
  'No confundo <code>=</code> (guardar un valor) con <code>==</code> (comparar)',
  'Puedo leer <code>public static int suma(int n)</code> pieza por pieza',
  'Sé que <code>return</code> devuelve un valor y termina el método en ese instante',
  'Distingo <b>parámetro</b> (la variable de la firma) de <b>argumento</b> (el valor que le mandas al llamar)',
  'Sé que <b>imprimir</b> no es lo mismo que <b>devolver</b>',
  'Sé usar <code>arr.length</code>, <code>s.length()</code>, <code>s.charAt(i)</code> y <code>s.substring(i)</code>',
  'Sé que cada llamada tiene <b>sus propias variables</b> y que quien llama se queda esperando a que termine'
];

/* ============================================================
   ¿QUÉ ES LA RECURSIVIDAD?
   ============================================================ */

/* La fila del cine, paso a paso. quien: la fila que habla (1 a 5).
   linea: renglón del pseudocódigo que se ilumina. */
const ED_FILA = [
  { fase: 'inicio', quien: 5, linea: -1, burbuja: null, msg: 'Estás en el cine, ya empezó la película y está oscuro. Quieres saber <b>en qué fila estás</b>, pero no alcanzas a contar las filas. Lo único que puedes hacer es hablar con la persona que tienes <b>justo adelante</b>.' },
  { fase: 'ida', quien: 5, linea: 2, burbuja: '¿En qué fila estás?', msg: 'Le preguntas a la persona de adelante: «¿en qué fila estás tú?». Tu idea: si ella te dice su fila, tú solo le sumas 1.' },
  { fase: 'ida', quien: 4, linea: 2, burbuja: '¿En qué fila estás?', msg: 'Ella tampoco sabe. Pero piensa exactamente igual que tú y le hace <b>la misma pregunta</b> a quien tiene adelante. Mientras, se queda esperando la respuesta.' },
  { fase: 'ida', quien: 3, linea: 2, burbuja: '¿En qué fila estás?', msg: 'Y así sigue la pregunta hacia adelante. Nadie resuelve nada todavía: todos están <b>esperando</b>. Cada pregunta es igual a la anterior, pero más cerca de la pantalla.' },
  { fase: 'ida', quien: 2, linea: 2, burbuja: '¿En qué fila estás?', msg: 'Ya casi. La pregunta llega a la persona que tiene adelante la primera fila.' },
  { fase: 'base', quien: 1, linea: 1, burbuja: '¡Estoy en la 1!', msg: '<b>Caso base.</b> La persona de la primera fila no tiene a nadie adelante: <b>sabe su respuesta sin preguntar</b>. Contesta «1». Aquí se detienen las preguntas.' },
  { fase: 'vuelta', quien: 2, linea: 2, burbuja: '1 + 1 = 2', msg: 'Ahora la respuesta viaja de regreso. La de la fila 2 recibe «1», le suma 1 y contesta hacia atrás: «estoy en la 2».' },
  { fase: 'vuelta', quien: 3, linea: 2, burbuja: '2 + 1 = 3', msg: 'La de la fila 3 recibe «2», le suma 1: «estoy en la 3». Cada quien usa la respuesta que le llega para armar la suya.' },
  { fase: 'vuelta', quien: 4, linea: 2, burbuja: '3 + 1 = 4', msg: 'La de la fila 4 recibe «3» y contesta «4».' },
  { fase: 'fin', quien: 5, linea: 2, burbuja: '4 + 1 = 5', msg: '¡Te llega un «4»! Le sumas 1: <b>estás en la fila 5</b>. Nadie contó las filas: cada quien resolvió un problema <b>un poquito más pequeño</b> y confió en la respuesta de adelante. Eso es la recursividad.' }
];

/* ¿Caso base o caso recursivo? */
const ED_CLASIFICA = [
  { c: 'if (n == 0) return 1;', r: 'base', e: 'Contesta directo, sin volver a llamar al método. Es el caso base del factorial: 0! = 1.' },
  { c: 'return n * factorial(n - 1);', r: 'rec', e: 'Se llama a sí mismo con <code>n - 1</code>, un problema más pequeño, y usa el resultado: caso recursivo.' },
  { c: 'if (s.length() <= 1) return s;', r: 'base', e: 'Una cadena de 0 o 1 letras ya está invertida: se devuelve tal cual, sin llamadas.' },
  { c: 'return invertir(s.substring(1)) + s.charAt(0);', r: 'rec', e: 'Llama a <code>invertir</code> con la cadena sin su primera letra: más corta, más cerca del caso base.' },
  { c: 'if (inicio > fin) return -1;', r: 'base', e: 'Ya no queda dónde buscar: responde −1 («no está») sin volver a llamar.' },
  { c: 'return fib(n - 1) + fib(n - 2);', r: 'rec', e: 'Dos llamadas a sí mismo con números más chicos: caso recursivo, y además múltiple.' },
  { c: 'if (n < 10) return n;', r: 'base', e: 'Un número de un solo dígito: la suma de sus dígitos es él mismo. No hace falta llamar.' },
  { c: 'return (n % 10) + sumaDigitos(n / 10);', r: 'rec', e: 'Se queda con el último dígito y llama con el número sin ese dígito: caso recursivo.' },
  { c: 'if (exp == 0) return 1;', r: 'base', e: 'Cualquier número elevado a la 0 es 1: se responde sin calcular nada.' },
  { c: 'if (i == arr.length) return 0;', r: 'base', e: 'El índice ya se salió del arreglo: no quedan elementos, y la suma de nada es 0.' },
  { c: 'return arr[i] + sumaArreglo(arr, i + 1);', r: 'rec', e: 'Toma el elemento actual y pide la suma del resto, desde <code>i + 1</code>: caso recursivo.' },
  { c: 'if (n == 0) return;', r: 'base', e: 'En un método <code>void</code> también hay caso base: aquí simplemente se sale sin hacer nada más.' },
  { c: 'return base * potencia(base, exp - 1);', r: 'rec', e: 'La misma base con un exponente menos: se acerca a <code>exp == 0</code>. Caso recursivo.' },
  { c: 'if (s.length() == 0) return "";', r: 'base', e: 'La cadena vacía: no hay nada que procesar, se devuelve directo.' }
];

/* Las 3 reglas de oro */
const ED_REGLAS = [
  { n: 1, t: 'Tiene un caso base', d: 'Al menos un caso que se resuelve <b>sin volver a llamar</b> al método. Y se revisa <b>antes</b> de la llamada recursiva.', s: 'Si falta: las llamadas no paran y truena con StackOverflowError.' },
  { n: 2, t: 'Cada llamada se acerca al caso base', d: 'El problema se hace <b>más pequeño</b> en cada llamada: <code>n - 1</code>, <code>n / 10</code>, una cadena más corta, la mitad del arreglo.', s: 'Si no se acerca (con <code>n + 1</code> o el mismo <code>n</code>): las llamadas tampoco paran, y truena.', star: true },
  { n: 3, t: 'Usa lo que devuelve la llamada', d: 'El caso recursivo <b>confía</b> en que la llamada más pequeña trae la respuesta correcta, y con ella arma la suya.', s: 'Si lo ignoras: el método termina, pero con un resultado equivocado.' }
];

/* Los tipos de recursión, en duelos. corto: la versión de un renglón de la hoja impresa. */
const ED_TIPOS = [
  {
    t: 'Directa vs indirecta',
    r: [
      { n: 'Directa', corto: 'El método se llama a sí mismo.', d: 'El método se llama <b>a sí mismo</b>, con su propio nombre. Es la más común: factorial, suma, fibonacci.', code: 'public static int suma(int n) {\n    if (n == 0) return 0;\n    return n + suma(n - 1);\n}' },
      { n: 'Indirecta', corto: 'A llama a B, y B vuelve a llamar a A.', d: 'El método A llama a B, y B vuelve a llamar a A. Ninguno se llama a sí mismo, pero juntos forman un círculo.', code: 'public static boolean esPar(int n) {\n    if (n == 0) return true;\n    return esImpar(n - 1);\n}\n\npublic static boolean esImpar(int n) {\n    if (n == 0) return false;\n    return esPar(n - 1);\n}' }
    ]
  },
  {
    t: 'Simple vs múltiple',
    r: [
      { n: 'Simple (lineal)', corto: 'Una sola llamada por ejecución: factorial.', d: 'Cada ejecución hace <b>una sola</b> llamada recursiva. Las llamadas forman una fila: factorial(3) → factorial(2) → factorial(1) → factorial(0).', code: 'return n * factorial(n - 1);' },
      { n: 'Múltiple (de árbol)', corto: 'Dos o más llamadas por ejecución: fibonacci.', d: 'Cada ejecución hace <b>dos o más</b> llamadas. Se ramifican como un árbol y la cantidad de llamadas crece rapidísimo: fibonacci(40) hace más de 330 millones.', code: 'return fibonacci(n - 1) + fibonacci(n - 2);' }
    ]
  },
  {
    t: 'De cola vs no de cola',
    r: [
      { n: 'De cola', corto: 'La llamada es lo último: no queda nada pendiente.', d: 'La llamada recursiva es <b>lo último</b> que hace el método: lo que devuelve la llamada se devuelve tal cual, sin cuentas pendientes. El resultado se va cargando en un parámetro extra, que empieza en 0: <code>sumaCola(5, 0)</code> da 15.', code: 'public static int sumaCola(int n, int acumulado) {\n    if (n == 0) return acumulado;\n    return sumaCola(n - 1, acumulado + n);\n}' },
      { n: 'No de cola', corto: 'Queda una cuenta pendiente: n * factorial(n - 1).', d: 'Después de la llamada <b>todavía queda algo por hacer</b> con el resultado. Aquí la suma se queda esperando a que regrese <code>suma(n - 1)</code>.', code: 'return n + suma(n - 1);' }
    ]
  }
];

/* ============================================================
   LA PILA DE LLAMADAS — programas del visualizador
   Cada renglón lleva una etiqueta: el visualizador (secciones-ed.js)
   ilumina el renglón por su etiqueta, no por su número, para que se
   pueda editar el código sin descuadrar nada.
   ============================================================ */
const ED_VISUAL = {
  llamadas: {
    nombre: 'Un método llama a otro', entrada: null,
    lineas: [
      ['d1', 'public static int doble(int x) {'],
      ['d2', '    return x * 2;'],
      ['d3', '}'],
      ['', ''],
      ['c1', 'public static int cuadruple(int x) {'],
      ['c2', '    int d = doble(x);'],
      ['c3', '    return doble(d);'],
      ['c4', '}'],
      ['', ''],
      ['m1', 'public static void main(String[] args) {'],
      ['m2', '    System.out.println(cuadruple(5));'],
      ['m3', '}']
    ]
  },
  cuenta: {
    nombre: 'Cuenta regresiva', entrada: { min: 0, max: 5, def: 3 },
    lineas: [
      ['firma', 'public static void cuentaRegresiva(int n) {'],
      ['if', '    if (n == 0) {'],
      ['base', '        System.out.println("¡Despegue!");'],
      ['baseRet', '        return;'],
      ['', '    }'],
      ['imp', '    System.out.println(n);'],
      ['rec', '    cuentaRegresiva(n - 1);'],
      ['fin', '}']
    ]
  },
  idaVuelta: {
    nombre: 'Ida y vuelta', entrada: { min: 0, max: 4, def: 3 },
    lineas: [
      ['firma', 'public static void idaYVuelta(int n) {'],
      ['if', '    if (n == 0) {'],
      ['base', '        return;'],
      ['', '    }'],
      ['ida', '    System.out.println("ida " + n);'],
      ['rec', '    idaYVuelta(n - 1);'],
      ['vuelta', '    System.out.println("vuelta " + n);'],
      ['fin', '}']
    ]
  },
  suma: {
    nombre: 'Suma de 1 a n', entrada: { min: 0, max: 5, def: 3 },
    lineas: [
      ['firma', 'public static int suma(int n) {'],
      ['if', '    if (n == 0) {'],
      ['base', '        return 0;'],
      ['', '    }'],
      ['rec', '    return n + suma(n - 1);'],
      ['fin', '}']
    ]
  },
  factorial: {
    nombre: 'Factorial', entrada: { min: 0, max: 6, def: 3 },
    lineas: [
      ['firma', 'public static long factorial(int n) {'],
      ['if', '    if (n == 0) {'],
      ['base', '        return 1;'],
      ['', '    }'],
      ['rec', '    return n * factorial(n - 1);'],
      ['fin', '}']
    ]
  },
  potencia: {
    nombre: 'Potencia', entrada: { min: 0, max: 5, def: 3 },
    lineas: [
      ['firma', 'public static int potencia(int base, int exp) {'],
      ['if', '    if (exp == 0) {'],
      ['base', '        return 1;'],
      ['', '    }'],
      ['rec', '    return base * potencia(base, exp - 1);'],
      ['fin', '}']
    ]
  },
  fibonacci: {
    nombre: 'Fibonacci', entrada: { min: 0, max: 4, def: 3 },
    lineas: [
      ['firma', 'public static int fibonacci(int n) {'],
      ['if', '    if (n <= 1) {'],
      ['base', '        return n;'],
      ['', '    }'],
      ['rec', '    return fibonacci(n - 1) + fibonacci(n - 2);'],
      ['fin', '}']
    ]
  },
  invertir: {
    nombre: 'Invertir cadena', entrada: { opciones: ['a', 'sol', 'hola', 'pila'], def: 'sol' },
    lineas: [
      ['firma', 'public static String invertir(String s) {'],
      ['if', '    if (s.length() <= 1) {'],
      ['base', '        return s;'],
      ['', '    }'],
      ['rec', '    return invertir(s.substring(1)) + s.charAt(0);'],
      ['fin', '}']
    ]
  },
  sinBase: {
    nombre: 'Sin caso base (truena)', entrada: { min: 1, max: 5, def: 3 },
    lineas: [
      ['firma', 'public static int suma(int n) {'],
      ['rec', '    return n + suma(n - 1);'],
      ['fin', '}']
    ]
  }
};

/* ============================================================
   LOS 10 EJEMPLOS RESUELTOS
   lineas: [renglón desde, renglón hasta, explicación] del código.
   programa: el archivo completo para copiar y correr; salida: lo que
   imprime de verdad. visual: su id en el visualizador, si tiene.
   ============================================================ */
const ED_EJEMPLOS = [
  {
    id: 'cuenta', n: 'Cuenta regresiva', nivel: 'Fácil', icono: 'rocket', visual: 'cuenta',
    enunciado: 'Imprimir los números desde <code>n</code> hasta 1, uno por renglón, y al final «¡Despegue!». Con n = 3 debe salir 3, 2, 1, ¡Despegue!',
    idea: 'Contar hacia atrás desde 3 es: decir «3» y luego contar hacia atrás desde 2. Contar desde 2 es: decir «2» y luego contar desde 1. Siempre es lo mismo con un número menos. Cuando ya llegaste a 0 no quedan números: solo toca gritar «¡Despegue!».',
    base: '<code>n == 0</code> → imprime «¡Despegue!» y se sale',
    rec: 'imprime <code>n</code> y llama a <code>cuentaRegresiva(n - 1)</code>',
    codigo: `public static void cuentaRegresiva(int n) {
    if (n == 0) {
        System.out.println("¡Despegue!");
        return;
    }
    System.out.println(n);
    cuentaRegresiva(n - 1);
}`,
    lineas: [
      [1, 1, '<code>void</code>: este método no devuelve nada, solo imprime. Recibe <code>n</code>, el número desde el que se cuenta.'],
      [2, 2, 'El <b>caso base</b> va primero: antes de imprimir o de llamar a nadie, revisa si ya llegó a 0.'],
      [3, 4, 'Si ya es 0, imprime el mensaje final y <code>return;</code> lo saca del método. En un <code>void</code> el <code>return</code> va solo, sin valor. Sin él, el método seguiría de largo al renglón 6.'],
      [6, 6, 'Si no es 0, imprime el número actual. Va <b>antes</b> de la llamada: por eso los números salen de mayor a menor.'],
      [7, 7, 'La <b>llamada recursiva</b>: el mismo trabajo con un número menos. Cada llamada se acerca al 0.']
    ],
    rastreo: `cuentaRegresiva(3) → imprime 3 y llama con 2
  cuentaRegresiva(2) → imprime 2 y llama con 1
    cuentaRegresiva(1) → imprime 1 y llama con 0
      cuentaRegresiva(0) → imprime ¡Despegue! y regresa`,
    errores: [
      'Olvidar el <code>return;</code> del caso base: después de «¡Despegue!» sigue de largo, imprime 0, llama con −1, −2, −3… y truena con <code>StackOverflowError</code>.',
      'Poner la llamada <b>antes</b> del <code>println(n)</code>: los números salen al revés (primero «¡Despegue!» y luego 1, 2, 3).'
    ],
    programa: `public class Main {

    public static void cuentaRegresiva(int n) {
        if (n == 0) {
            System.out.println("¡Despegue!");
            return;
        }
        System.out.println(n);
        cuentaRegresiva(n - 1);
    }

    public static void main(String[] args) {
        cuentaRegresiva(3);
    }
}`,
    salida: '3\n2\n1\n¡Despegue!',
    resumen: { base: 'n == 0', rec: 'cuentaRegresiva(n - 1)', acerca: 'n baja de 1 en 1' }
  },
  {
    id: 'suma', n: 'Suma de 1 a n', nivel: 'Fácil', icono: 'plus', visual: 'suma',
    enunciado: 'Calcular 1 + 2 + 3 + … + n. Por ejemplo, <code>suma(4)</code> = 1 + 2 + 3 + 4 = 10.',
    idea: 'La suma hasta 4 es 4 más la suma hasta 3. La suma hasta 3 es 3 más la suma hasta 2. Cada suma es «el número actual + la suma de los anteriores». ¿Y la suma hasta 0? Es 0: no hay nada que sumar.',
    base: '<code>n == 0</code> → devuelve 0',
    rec: '<code>n + suma(n - 1)</code>',
    codigo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n - 1);
}`,
    lineas: [
      [1, 1, 'Devuelve un <code>int</code> (el total) y recibe <code>n</code>, hasta dónde sumar.'],
      [2, 4, 'Caso base: si n es 0, la suma de nada es 0. Se devuelve directo, sin llamar a nadie.'],
      [5, 5, 'Caso recursivo: <code>suma(n - 1)</code> calcula la suma de los anteriores y le agregamos <code>n</code>. Java resuelve primero la llamada y <b>después</b> hace la suma: el <code>+</code> se queda esperando.']
    ],
    rastreo: `suma(4) = 4 + suma(3)
        = 4 + (3 + suma(2))
        = 4 + (3 + (2 + suma(1)))
        = 4 + (3 + (2 + (1 + suma(0))))
        = 4 + (3 + (2 + (1 + 0)))      ← caso base
        = 10`,
    errores: [
      'Caso base con <code>return 1</code>: todas las sumas salen con 1 de más; <code>suma(4)</code> daría 11.',
      'Escribir <code>suma(n) - 1</code> en lugar de <code>suma(n - 1)</code>: llama con el <b>mismo</b> n y nunca para. Los paréntesis importan.'
    ],
    programa: `public class Main {

    public static int suma(int n) {
        if (n == 0) {
            return 0;
        }
        return n + suma(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(suma(4));
        System.out.println(suma(100));
    }
}`,
    salida: '10\n5050',
    resumen: { base: 'n == 0 → 0', rec: 'n + suma(n - 1)', acerca: 'n baja de 1 en 1' }
  },
  {
    id: 'factorial', n: 'Factorial', nivel: 'Fácil', icono: 'asterisk', visual: 'factorial',
    enunciado: 'Calcular <b>n!</b> (se lee «n factorial»): multiplicar todos los enteros de 1 a n. Por ejemplo, 5! = 5 × 4 × 3 × 2 × 1 = 120. Por definición, 0! = 1.',
    idea: 'Fíjate que 5! = 5 × 4!, y 4! = 4 × 3!. El factorial de n es <b>n por el factorial del número anterior</b>. Esa es la relación recursiva. ¿Cuándo paramos? En 0! = 1, que ya sabemos sin calcular nada.',
    base: '<code>n == 0</code> → devuelve 1',
    rec: '<code>n * factorial(n - 1)</code>',
    codigo: `public static long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
    lineas: [
      [1, 1, 'Devuelve <code>long</code> y no <code>int</code> porque el factorial crece rapidísimo: 12! todavía cabe en un int, pero 13! = 6,227,020,800 ya no. Con int, Java no marca error: da un número equivocado (1,932,053,504) y ya.'],
      [2, 4, 'Caso base: 0! = 1. También se vale <code>n &lt;= 1</code>, que se ahorra una llamada porque 1! también es 1.'],
      [5, 5, '<code>n * factorial(n - 1)</code>: n por el factorial del anterior. La multiplicación espera a que regrese la llamada.']
    ],
    rastreo: `factorial(4) = 4 * factorial(3)
factorial(3) = 3 * factorial(2)
factorial(2) = 2 * factorial(1)
factorial(1) = 1 * factorial(0)
factorial(0) = 1                  ← caso base
  ─── y de regreso ───
factorial(1) = 1 * 1 = 1
factorial(2) = 2 * 1 = 2
factorial(3) = 3 * 2 = 6
factorial(4) = 4 * 6 = 24`,
    errores: [
      'Caso base con <code>return 0</code>: todo se multiplica por ese 0 y el método <b>siempre</b> devuelve 0.',
      'Llamarlo con un número negativo: n nunca llega a 0 (−1, −2, −3…) y truena. El factorial de un negativo no existe; si puede llegar uno, valídalo antes.',
      'Usar <code>int</code> para 13! o más: no marca ningún error, simplemente sale un número mal.'
    ],
    programa: `public class Main {

    public static long factorial(int n) {
        if (n == 0) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
        System.out.println(factorial(13));
    }
}`,
    salida: '120\n6227020800',
    resumen: { base: 'n == 0 → 1', rec: 'n * factorial(n - 1)', acerca: 'n baja de 1 en 1' }
  },
  {
    id: 'potencia', n: 'Potencia', nivel: 'Fácil', icono: 'superscript', visual: 'potencia',
    enunciado: 'Calcular <code>base</code> elevado a <code>exp</code> sin usar <code>Math.pow</code>, el método que Java ya trae para potencias. Por ejemplo, <code>potencia(2, 5)</code> = 2 × 2 × 2 × 2 × 2 = 32.',
    idea: '2⁵ es 2 × 2⁴. Y 2⁴ es 2 × 2³. Cada potencia es <b>la base por la potencia con un exponente menos</b>. ¿Cuándo paramos? Cualquier número elevado a la 0 vale 1.',
    base: '<code>exp == 0</code> → devuelve 1',
    rec: '<code>base * potencia(base, exp - 1)</code>',
    codigo: `public static int potencia(int base, int exp) {
    if (exp == 0) {
        return 1;
    }
    return base * potencia(base, exp - 1);
}`,
    lineas: [
      [1, 1, 'Dos parámetros. La <code>base</code> nunca cambia; lo que baja es <code>exp</code>. Un método recursivo puede recibir varios datos: basta con que <b>uno</b> se acerque al caso base.'],
      [2, 4, 'Caso base: exponente 0 → 1.'],
      [5, 5, 'La misma base, un exponente menos, y el resultado se multiplica por la base.']
    ],
    rastreo: `potencia(2, 4) = 2 * potencia(2, 3)
               = 2 * 2 * potencia(2, 2)
               = 2 * 2 * 2 * potencia(2, 1)
               = 2 * 2 * 2 * 2 * potencia(2, 0)
               = 2 * 2 * 2 * 2 * 1       ← caso base
               = 16`,
    errores: [
      'Caso base con <code>return 0</code>: todo se multiplica por 0 y siempre sale 0.',
      'Bajar la base en vez del exponente, <code>potencia(base - 1, exp)</code>: exp nunca llega a 0.',
      'Un exponente negativo: exp se aleja del 0 (−1, −2…) y truena. Para nota extra: la <b>potencia rápida</b> parte el exponente a la mitad y hace muchísimas menos llamadas.'
    ],
    programa: `public class Main {

    public static int potencia(int base, int exp) {
        if (exp == 0) {
            return 1;
        }
        return base * potencia(base, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(potencia(2, 5));
        System.out.println(potencia(3, 4));
    }
}`,
    salida: '32\n81',
    resumen: { base: 'exp == 0 → 1', rec: 'base * potencia(base, exp - 1)', acerca: 'exp baja de 1 en 1' }
  },
  {
    id: 'fibonacci', n: 'Fibonacci', nivel: 'Medio', icono: 'git-fork', visual: 'fibonacci',
    enunciado: 'La sucesión de Fibonacci empieza con 0 y 1, y cada número es la suma de los dos anteriores: 0, 1, 1, 2, 3, 5, 8, 13, 21… Calcular el número que está en la posición <code>n</code>, contando desde 0. Por ejemplo, <code>fibonacci(6)</code> = 8.',
    idea: 'La definición ya viene recursiva: fib(n) = fib(n − 1) + fib(n − 2). Lo nuevo aquí es que hay <b>dos casos base</b> (las posiciones 0 y 1, que no tienen dos anteriores) y <b>dos llamadas</b> en cada paso.',
    base: '<code>n &lt;= 1</code> → devuelve n (0 o 1)',
    rec: '<code>fibonacci(n - 1) + fibonacci(n - 2)</code>',
    codigo: `public static int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    lineas: [
      [2, 4, '<code>n &lt;= 1</code> atrapa los dos casos base de un golpe: fibonacci(0) devuelve 0 y fibonacci(1) devuelve 1, que es justo lo que vale n.'],
      [5, 5, 'Dos llamadas recursivas. Java resuelve <b>completa</b> la primera, <code>fibonacci(n - 1)</code>, con todas sus llamadas, y hasta después empieza con <code>fibonacci(n - 2)</code>.']
    ],
    rastreo: `fibonacci(4)
├─ fibonacci(3)
│  ├─ fibonacci(2)
│  │  ├─ fibonacci(1) = 1     ← caso base
│  │  └─ fibonacci(0) = 0     ← caso base
│  │  = 1 + 0 = 1
│  └─ fibonacci(1) = 1        ← caso base
│  = 1 + 1 = 2
└─ fibonacci(2)               ← ¡otra vez!
   ├─ fibonacci(1) = 1
   └─ fibonacci(0) = 0
   = 1
= 2 + 1 = 3`,
    nota: 'Mira el árbol: <b>fibonacci(2) se calcula dos veces</b>. Con números grandes esto se dispara: fibonacci(40) hace 331,160,281 llamadas y fibonacci(45) tarda varios segundos, cuando un ciclo lo resuelve al instante.',
    errores: [
      'Poner solo <code>n == 0</code> como caso base: fibonacci(1) llama a fibonacci(0) y a fibonacci(−1), y la segunda ya nunca para.',
      'Usarlo con n grande en un examen práctico: funciona, pero es lentísimo porque repite los mismos cálculos.',
      'Hay profes que empiezan la sucesión en 1, 1, 2, 3… La idea es idéntica; solo cambian los casos base. Revisa cómo la pide el tuyo.'
    ],
    programa: `public class Main {

    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        for (int i = 0; i <= 10; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
    }
}`,
    salida: '0 1 1 2 3 5 8 13 21 34 55',
    resumen: { base: 'n <= 1 → n', rec: 'fibonacci(n - 1) + fibonacci(n - 2)', acerca: 'n baja de 1 y de 2' }
  },
  {
    id: 'digitos', n: 'Suma de dígitos', nivel: 'Medio', icono: 'hash',
    enunciado: 'Sumar los dígitos de un número entero positivo. Por ejemplo, <code>sumaDigitos(4096)</code> = 4 + 0 + 9 + 6 = 19.',
    idea: 'El truco son dos operaciones entre enteros: <code>n % 10</code> te da el <b>último dígito</b> (4096 % 10 = 6) y <code>n / 10</code> te da el número <b>sin</b> su último dígito (4096 / 10 = 409). Entonces: la suma de dígitos de 4096 es 6 más la suma de dígitos de 409.',
    base: '<code>n &lt; 10</code> → devuelve n (un solo dígito)',
    rec: '<code>(n % 10) + sumaDigitos(n / 10)</code>',
    codigo: `public static int sumaDigitos(int n) {
    if (n < 10) {
        return n;
    }
    return (n % 10) + sumaDigitos(n / 10);
}`,
    lineas: [
      [2, 4, 'Caso base: si el número es menor que 10 tiene un solo dígito, y la suma de sus dígitos es él mismo.'],
      [5, 5, 'El último dígito, <code>n % 10</code>, más la suma de los dígitos del resto, <code>sumaDigitos(n / 10)</code>. Como <code>/</code> entre enteros tira los decimales, 409 / 10 da 40 y no 40.9: así el número se va quedando sin dígitos.']
    ],
    rastreo: `sumaDigitos(4096) = 6 + sumaDigitos(409)
sumaDigitos(409)  = 9 + sumaDigitos(40)
sumaDigitos(40)   = 0 + sumaDigitos(4)
sumaDigitos(4)    = 4                ← caso base
  ─── de regreso ───
sumaDigitos(40)   = 0 + 4  = 4
sumaDigitos(409)  = 9 + 4  = 13
sumaDigitos(4096) = 6 + 13 = 19`,
    nota: '<b>Variante que también cae:</b> contar los dígitos. Mismo esqueleto, pero en vez de sumar el dígito se suma 1: <code>if (n &lt; 10) return 1;</code> y <code>return 1 + contarDigitos(n / 10);</code>',
    errores: [
      'Con números negativos, <code>n &lt; 10</code> se cumple de inmediato: <code>sumaDigitos(-4096)</code> devuelve −4096. Si pueden llegar negativos, usa antes <code>Math.abs(n)</code>, que da el número sin su signo.',
      'Confundir los operadores: <code>n / 10</code> para quedarte con el <b>último dígito</b> está mal; ese es <code>n % 10</code>.'
    ],
    programa: `public class Main {

    public static int sumaDigitos(int n) {
        if (n < 10) {
            return n;
        }
        return (n % 10) + sumaDigitos(n / 10);
    }

    public static void main(String[] args) {
        System.out.println(sumaDigitos(4096));
        System.out.println(sumaDigitos(7));
    }
}`,
    salida: '19\n7',
    resumen: { base: 'n < 10 → n', rec: '(n % 10) + sumaDigitos(n / 10)', acerca: 'n pierde un dígito' }
  },
  {
    id: 'invertir', n: 'Invertir una cadena', nivel: 'Medio', icono: 'arrow-left-right', visual: 'invertir',
    enunciado: 'Devolver un <code>String</code> escrito al revés. Por ejemplo, <code>invertir("hola")</code> = <code>"aloh"</code>.',
    idea: 'Para invertir «hola»: invierte lo que queda sin la primera letra («ola» → «alo») y pégale la «h» al final: «alo» + «h» = «aloh». ¿Cuándo paramos? Una palabra de una letra, o vacía, ya está invertida.',
    base: '<code>s.length() &lt;= 1</code> → devuelve s',
    rec: '<code>invertir(s.substring(1)) + s.charAt(0)</code>',
    codigo: `public static String invertir(String s) {
    if (s.length() <= 1) {
        return s;
    }
    return invertir(s.substring(1)) + s.charAt(0);
}`,
    lineas: [
      [1, 1, 'Recibe un <code>String</code> y devuelve otro <code>String</code>.'],
      [2, 4, '<code>s.length()</code> dice cuántos caracteres tiene la cadena. Con 0 o 1 no hay nada que invertir: se devuelve igual.'],
      [5, 5, '<code>s.substring(1)</code> es la cadena <b>sin su primer carácter</b> («hola» → «ola»): más corta, más cerca del caso base. <code>s.charAt(0)</code> es el <b>primer carácter</b> («h»). El <code>+</code> entre un String y un char los pega.']
    ],
    rastreo: `invertir("hola") = invertir("ola") + 'h'
invertir("ola")  = invertir("la")  + 'o'
invertir("la")   = invertir("a")   + 'l'
invertir("a")    = "a"               ← caso base
  ─── de regreso ───
invertir("la")   = "a"   + 'l' = "al"
invertir("ola")  = "al"  + 'o' = "alo"
invertir("hola") = "alo" + 'h' = "aloh"`,
    nota: '<b>Variante que también cae: palíndromo</b> (se lee igual al derecho y al revés, como «reconocer»). Si la primera y la última letra son distintas, no es; si son iguales, revisa lo de en medio con <code>s.substring(1, s.length() - 1)</code>, que quita la primera y la última. ¿Y el <code>!=</code>? Aquí sí se vale: <code>charAt</code> da un <code>char</code>, y los char se comparan con <code>==</code> y <code>!=</code>, como números. <code>equals</code> es para comparar String completos.',
    extra: `public static boolean esPalindromo(String s) {
    if (s.length() <= 1) {
        return true;
    }
    if (s.charAt(0) != s.charAt(s.length() - 1)) {
        return false;
    }
    return esPalindromo(s.substring(1, s.length() - 1));
}`,
    errores: [
      '<code>s.substring(0)</code> devuelve la cadena <b>completa</b>, no una más corta: nunca llega al caso base.',
      'Pegar al revés, <code>s.charAt(0) + invertir(s.substring(1))</code>: devuelve la misma palabra sin invertir.',
      'Caso base solo con <code>s.length() == 1</code>: con la cadena vacía <code>""</code> no se cumple, y <code>"".substring(1)</code> truena con <code>StringIndexOutOfBoundsException</code>.'
    ],
    programa: `public class Main {

    public static String invertir(String s) {
        if (s.length() <= 1) {
            return s;
        }
        return invertir(s.substring(1)) + s.charAt(0);
    }

    public static boolean esPalindromo(String s) {
        if (s.length() <= 1) {
            return true;
        }
        if (s.charAt(0) != s.charAt(s.length() - 1)) {
            return false;
        }
        return esPalindromo(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        System.out.println(invertir("hola"));
        System.out.println(esPalindromo("reconocer"));
        System.out.println(esPalindromo("recursion"));
    }
}`,
    salida: 'aloh\ntrue\nfalse',
    resumen: { base: 's.length() <= 1 → s', rec: 'invertir(s.substring(1)) + s.charAt(0)', acerca: 'la cadena pierde su primera letra' }
  },
  {
    id: 'arreglo', n: 'Suma de un arreglo', nivel: 'Medio', icono: 'brackets',
    enunciado: 'Sumar todos los elementos de un arreglo de enteros. Por ejemplo, con <code>{4, 8, 15, 16, 23, 42}</code> la suma es 108.',
    idea: 'Un arreglo no se puede «hacer más chico» fácilmente, así que usamos un <b>índice que avanza</b>. <code>sumaArreglo(arr, i)</code> significa «suma desde la posición i hasta el final». Esa suma es <code>arr[i]</code> más la suma desde i + 1. Cuando i llega a <code>arr.length</code>, ya no quedan elementos.',
    base: '<code>i == arr.length</code> → devuelve 0',
    rec: '<code>arr[i] + sumaArreglo(arr, i + 1)</code>',
    codigo: `public static int sumaArreglo(int[] arr, int i) {
    if (i == arr.length) {
        return 0;
    }
    return arr[i] + sumaArreglo(arr, i + 1);
}`,
    lineas: [
      [1, 1, 'Dos parámetros: el arreglo, que nunca cambia, y el índice <code>i</code>, que avanza. La primera llamada es desde la posición 0: <code>sumaArreglo(numeros, 0)</code>.'],
      [2, 4, '<code>arr.length</code> es cuántos elementos tiene (aquí 6). Las posiciones válidas van de 0 a 5, así que cuando i vale 6 ya nos salimos: no queda nada que sumar.'],
      [5, 5, 'El elemento de la posición actual más la suma de todo lo que sigue. Cada llamada avanza una posición hacia el final.']
    ],
    rastreo: `sumaArreglo(arr, 0) = 4  + sumaArreglo(arr, 1)
sumaArreglo(arr, 1) = 8  + sumaArreglo(arr, 2)
sumaArreglo(arr, 2) = 15 + sumaArreglo(arr, 3)
sumaArreglo(arr, 3) = 16 + sumaArreglo(arr, 4)
sumaArreglo(arr, 4) = 23 + sumaArreglo(arr, 5)
sumaArreglo(arr, 5) = 42 + sumaArreglo(arr, 6)
sumaArreglo(arr, 6) = 0        ← caso base: i == arr.length
  ─── de regreso ───
42 → 23 + 42 = 65 → 16 + 65 = 81 → 15 + 81 = 96 → 8 + 96 = 104 → 4 + 104 = 108`,
    nota: '<b>Truco que usan los profes:</b> para no obligar a nadie a escribir el 0, se agrega un método «ayudante» que hace la primera llamada: <code>public static int suma(int[] arr) { return sumaArreglo(arr, 0); }</code>',
    errores: [
      'Caso base <code>i == arr.length - 1</code> devolviendo 0: se brinca el último elemento y la suma da 66.',
      'Sin caso base: con i = 6, <code>arr[6]</code> no existe y truena con <code>ArrayIndexOutOfBoundsException</code>.'
    ],
    programa: `public class Main {

    public static int sumaArreglo(int[] arr, int i) {
        if (i == arr.length) {
            return 0;
        }
        return arr[i] + sumaArreglo(arr, i + 1);
    }

    public static void main(String[] args) {
        int[] numeros = {4, 8, 15, 16, 23, 42};
        System.out.println(sumaArreglo(numeros, 0));
    }
}`,
    salida: '108',
    resumen: { base: 'i == arr.length → 0', rec: 'arr[i] + sumaArreglo(arr, i + 1)', acerca: 'i avanza hacia el final' }
  },
  {
    id: 'binaria', n: 'Búsqueda binaria', nivel: 'Reto', icono: 'search',
    enunciado: 'Encontrar en qué <b>posición</b> está un número <code>x</code> dentro de un arreglo <b>ordenado</b>. Si no está, devolver −1.',
    idea: 'Como buscar una palabra en el diccionario: lo abres a la mitad y, si tu palabra va antes, ya ni volteas a ver la segunda mitad. Revisa el elemento de en medio: si es x, terminaste. Si x es menor, busca solo en la mitad izquierda; si es mayor, solo en la derecha. Cada llamada <b>descarta la mitad</b> de lo que quedaba.',
    base: '<code>inicio &gt; fin</code> → −1 (no está) · <code>arr[medio] == x</code> → medio',
    rec: 'buscar en la mitad izquierda o en la derecha',
    codigo: `public static int busquedaBinaria(int[] arr, int x, int inicio, int fin) {
    if (inicio > fin) {
        return -1;
    }
    int medio = (inicio + fin) / 2;
    if (arr[medio] == x) {
        return medio;
    }
    if (x < arr[medio]) {
        return busquedaBinaria(arr, x, inicio, medio - 1);
    }
    return busquedaBinaria(arr, x, medio + 1, fin);
}`,
    lineas: [
      [1, 1, 'Además del arreglo y de <code>x</code>, recibe el pedazo donde todavía hay que buscar: de <code>inicio</code> a <code>fin</code>. La primera llamada es con todo el arreglo: <code>0</code> y <code>arr.length - 1</code>.'],
      [2, 4, 'Caso base 1: si <code>inicio</code> ya pasó a <code>fin</code>, el pedazo está vacío. x no está: −1.'],
      [5, 5, 'La posición de en medio. Entre enteros, <code>(0 + 9) / 2</code> da 4.'],
      [6, 8, 'Caso base 2: ¡lo encontramos! Se devuelve la <b>posición</b>, no el valor.'],
      [9, 11, 'x es menor que el de en medio: si está, está a la izquierda. Se busca de <code>inicio</code> a <code>medio - 1</code>, porque el de en medio ya se revisó.'],
      [12, 12, 'Si no fue igual ni menor, es mayor: se busca a la derecha, de <code>medio + 1</code> a <code>fin</code>.']
    ],
    rastreo: `arr:      [ 2,  5,  8, 12, 16, 23, 38, 56, 72, 91]
posición:   0   1   2   3   4   5   6   7   8   9

buscar 23 de 0 a 9 → medio 4 → arr[4] = 16 → 23 es mayor → derecha
buscar 23 de 5 a 9 → medio 7 → arr[7] = 56 → 23 es menor → izquierda
buscar 23 de 5 a 6 → medio 5 → arr[5] = 23 → ¡está! devuelve 5`,
    nota: 'Por eso es tan rápida: en un arreglo ordenado de 1,000,000 de números encuentra cualquiera en <b>20 llamadas o menos</b>, porque cada llamada parte el pedazo a la mitad. <b>Ojo con el tipo:</b> aunque en el código se ven dos llamadas recursivas, cada ejecución hace <b>solo una</b> (o la de la izquierda, o la de la derecha). Es recursión <b>simple</b>. Hanoi, en cambio, sí hace dos por ejecución: es múltiple.',
    errores: [
      'Usarla en un arreglo <b>desordenado</b>: descarta mitades equivocadas y puede decir −1 aunque el número sí esté.',
      'Llamar con <code>medio</code> en lugar de <code>medio - 1</code> o <code>medio + 1</code>: el pedazo puede dejar de achicarse y ya no para nunca.'
    ],
    programa: `public class Main {

    public static int busquedaBinaria(int[] arr, int x, int inicio, int fin) {
        if (inicio > fin) {
            return -1;
        }
        int medio = (inicio + fin) / 2;
        if (arr[medio] == x) {
            return medio;
        }
        if (x < arr[medio]) {
            return busquedaBinaria(arr, x, inicio, medio - 1);
        }
        return busquedaBinaria(arr, x, medio + 1, fin);
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println(busquedaBinaria(arr, 23, 0, arr.length - 1));
        System.out.println(busquedaBinaria(arr, 7, 0, arr.length - 1));
    }
}`,
    salida: '5\n-1',
    resumen: { base: 'inicio > fin → -1 · arr[medio] == x → medio', rec: 'la mitad izquierda o la derecha', acerca: 'el pedazo se parte a la mitad' }
  },
  {
    id: 'hanoi', n: 'Torres de Hanoi', nivel: 'Reto', icono: 'castle',
    enunciado: 'Hay tres postes (A, B y C) y <code>n</code> discos de distintos tamaños apilados en A, del más grande abajo al más chico arriba. Hay que pasarlos todos a C. <b>Reglas:</b> se mueve un disco a la vez, solo el de hasta arriba, y nunca se pone un disco grande sobre uno más chico.',
    idea: 'Parece imposible, pero piensa solo en el disco <b>más grande</b>. Para moverlo de A a C necesitas quitarle de encima los otros n − 1. Entonces: <b>(1)</b> pasa los n − 1 de arriba de A a B, usando C de apoyo; <b>(2)</b> mueve el grande de A a C; <b>(3)</b> pasa los n − 1 de B a C, usando A de apoyo. Los pasos 1 y 3 son <b>el mismo problema con un disco menos</b>.',
    base: '<code>n == 0</code> → no hay nada que mover',
    rec: 'hanoi(n − 1) al auxiliar, mover el disco n, hanoi(n − 1) al destino',
    codigo: `public static void hanoi(int n, char origen, char auxiliar, char destino) {
    if (n == 0) {
        return;
    }
    hanoi(n - 1, origen, destino, auxiliar);
    System.out.println("Mueve el disco " + n + " de " + origen + " a " + destino);
    hanoi(n - 1, auxiliar, origen, destino);
}`,
    lineas: [
      [1, 1, '<code>char</code> guarda una sola letra entre comillas simples, como <code>\'A\'</code>. Los postes cambian de papel en cada llamada (el que era destino puede volverse auxiliar), por eso viajan como parámetros.'],
      [2, 4, 'Caso base: cero discos, nada que mover.'],
      [5, 5, 'Paso 1: los n − 1 discos de arriba se van al poste <b>auxiliar</b>. Fíjate que en los argumentos se intercambian <code>destino</code> y <code>auxiliar</code>.'],
      [6, 6, 'Paso 2: el disco n, el más grande de este grupo, ya quedó libre: va directo a su destino.'],
      [7, 7, 'Paso 3: los n − 1 que dejamos en el auxiliar se van encima del grande, usando el origen de apoyo.']
    ],
    rastreo: `hanoi(3, 'A', 'B', 'C') imprime:
Mueve el disco 1 de A a C
Mueve el disco 2 de A a B
Mueve el disco 1 de C a B
Mueve el disco 3 de A a C     ← el grande, justo a la mitad
Mueve el disco 1 de B a A
Mueve el disco 2 de B a C
Mueve el disco 1 de A a C`,
    nota: 'Con n discos se necesitan <b>2ⁿ − 1</b> movimientos: 3 discos → 7, 4 → 15, 10 → 1,023. Juégalo en el Laboratorio y compara tus movimientos con los del método.',
    errores: [
      'Revolver el orden de los postes en las llamadas: los discos terminan en otro poste, o los movimientos rompen las reglas.',
      'Mover el <code>println</code> antes o después de las dos llamadas: los movimientos salen en otro orden y dejan de ser válidos.'
    ],
    programa: `public class Main {

    public static void hanoi(int n, char origen, char auxiliar, char destino) {
        if (n == 0) {
            return;
        }
        hanoi(n - 1, origen, destino, auxiliar);
        System.out.println("Mueve el disco " + n + " de " + origen + " a " + destino);
        hanoi(n - 1, auxiliar, origen, destino);
    }

    public static void main(String[] args) {
        hanoi(3, 'A', 'B', 'C');
    }
}`,
    salida: 'Mueve el disco 1 de A a C\nMueve el disco 2 de A a B\nMueve el disco 1 de C a B\nMueve el disco 3 de A a C\nMueve el disco 1 de B a A\nMueve el disco 2 de B a C\nMueve el disco 1 de A a C',
    resumen: { base: 'n == 0 → nada', rec: 'hanoi(n - 1, …) dos veces', acerca: 'un disco menos' }
  }
];

/* ============================================================
   LABORATORIO
   ============================================================ */

/* ¿Qué imprime? — llamada: lo que se ejecuta dentro de main. */
const ED_IMPRIME = [
  {
    nivel: 'Fácil', code: `public static void f(int n) {
    if (n > 3) return;
    System.out.print(n + " ");
    f(n + 1);
}`, llamada: 'f(1);', q: '¿Qué imprime <code>f(1)</code>?',
    o: ['<code>1 2 3</code>', '<code>1 2 3 4</code>', '<code>3 2 1</code>', 'StackOverflowError'], r: 0,
    e: 'Aquí n <b>sube</b>, y está bien: el caso base es <code>n &gt; 3</code>, así que subir sí lo acerca. Imprime 1, 2 y 3; con n = 4 se sale sin imprimir.'
  },
  {
    nivel: 'Fácil', code: `public static void f(int n) {
    if (n <= 0) return;
    f(n - 1);
    System.out.print(n * n + " ");
}`, llamada: 'f(4);', q: '¿Qué imprime <code>f(4)</code>?',
    o: ['<code>1 4 9 16</code>', '<code>16 9 4 1</code>', '<code>4 3 2 1</code>', '<code>0 1 4 9 16</code>'], r: 0,
    e: 'El <code>print</code> va <b>después</b> de la llamada, así que se imprime de regreso: primero f(1), luego f(2)… Cada una imprime su n al cuadrado.'
  },
  {
    nivel: 'Fácil', code: `public static int f(int n) {
    if (n == 1) return 2;
    return 2 * f(n - 1);
}`, llamada: 'System.out.println(f(4));', q: '¿Qué imprime <code>System.out.println(f(4))</code>?',
    o: ['<code>16</code>', '<code>8</code>', '<code>32</code>', '<code>24</code>'], r: 0,
    e: 'f(1) = 2, f(2) = 4, f(3) = 8, f(4) = 16. Es 2 elevado a la n, disfrazado.'
  },
  {
    nivel: 'Medio', code: `public static int f(int n) {
    if (n < 10) return 1;
    return 1 + f(n / 10);
}`, llamada: 'System.out.println(f(52817));', q: '¿Qué imprime <code>System.out.println(f(52817))</code>?',
    o: ['<code>5</code>', '<code>23</code>', '<code>4</code>', '<code>52817</code>'], r: 0,
    e: 'Cada llamada quita un dígito con <code>/ 10</code> y suma 1: 52817 → 5281 → 528 → 52 → 5. Cuenta los dígitos: <b>5</b>.'
  },
  {
    nivel: 'Medio', code: `public static String f(String s) {
    if (s.length() == 0) return "";
    return f(s.substring(1)) + s.charAt(0);
}`, llamada: 'System.out.println(f("pila"));', q: '¿Qué imprime <code>System.out.println(f("pila"))</code>?',
    o: ['<code>alip</code>', '<code>pila</code>', '<code>ilap</code>', '<code>p</code>'], r: 0,
    e: 'Es invertir: cada llamada deja su primera letra para <b>el final</b>. f("a") = "a", f("la") = "al", f("ila") = "ali", f("pila") = "alip".'
  },
  {
    nivel: 'Medio', code: `public static int f(int n) {
    if (n <= 1) return 1;
    return f(n - 1) + f(n - 2);
}`, llamada: 'System.out.println(f(4));', q: '¿Qué imprime <code>System.out.println(f(4))</code>?',
    o: ['<code>5</code>', '<code>3</code>', '<code>8</code>', '<code>4</code>'], r: 0,
    e: 'Ojo: aquí f(0) = 1, no 0. Entonces f(2) = 2, f(3) = 3, f(4) = 3 + 2 = <b>5</b>.'
  },
  {
    nivel: 'Medio', code: `public static int f(int n) {
    if (n == 0) return 0;
    int r = n + f(n - 1);
    System.out.print(r + " ");
    return r;
}`, llamada: 'f(3);', q: '¿Qué imprime <code>f(3)</code>?',
    o: ['<code>1 3 6</code>', '<code>6 3 1</code>', '<code>6</code>', '<code>3 2 1</code>'], r: 0,
    e: 'Cada llamada imprime <b>después</b> de recibir su resultado, o sea, de regreso: f(1) imprime 1, f(2) imprime 2 + 1 = 3, f(3) imprime 3 + 3 = 6.'
  },
  {
    nivel: 'Medio', code: `public static void f(int n) {
    if (n == 0) {
        System.out.print("* ");
        return;
    }
    f(n - 1);
    System.out.print(n + " ");
}`, llamada: 'f(2);', q: '¿Qué imprime <code>f(2)</code>?',
    o: ['<code>* 1 2</code>', '<code>2 1 *</code>', '<code>1 2 *</code>', '<code>* 2 1</code>'], r: 0,
    e: 'Lo primero que se imprime es el caso base (la estrella), porque todas las demás imprimen después de su llamada: de regreso salen 1 y 2.'
  },
  {
    nivel: 'Medio', code: `public static int f(int a, int b) {
    if (b == 0) return 0;
    return a + f(a, b - 1);
}`, llamada: 'System.out.println(f(4, 3));', q: '¿Qué imprime <code>System.out.println(f(4, 3))</code>?',
    o: ['<code>12</code>', '<code>7</code>', '<code>64</code>', '<code>4</code>'], r: 0,
    e: 'Suma <code>a</code> tantas veces como diga <code>b</code>: 4 + 4 + 4 + 0 = <b>12</b>. Es una multiplicación hecha con sumas.'
  },
  {
    nivel: 'Reto', code: `public static boolean esPar(int n) {
    if (n == 0) return true;
    return esImpar(n - 1);
}

public static boolean esImpar(int n) {
    if (n == 0) return false;
    return esPar(n - 1);
}`, llamada: 'System.out.println(esPar(3));', q: '¿Qué imprime <code>System.out.println(esPar(3))</code>?',
    o: ['<code>false</code>', '<code>true</code>', '<code>3</code>', 'StackOverflowError'], r: 0,
    e: 'Recursión <b>indirecta</b>: esPar(3) → esImpar(2) → esPar(1) → esImpar(0), que devuelve <b>false</b>. Y ese false regresa tal cual hasta la primera llamada: 3 no es par.'
  },
  {
    nivel: 'Reto', code: `public static void f(String s, int i) {
    if (i == s.length()) return;
    f(s, i + 1);
    System.out.print(s.charAt(i));
}`, llamada: 'f("roma", 0);', q: '¿Qué imprime <code>f("roma", 0)</code>?',
    o: ['<code>amor</code>', '<code>roma</code>', '<code>r</code>', '<code>aamor</code>'], r: 0,
    e: 'El índice avanza hasta el final <b>sin imprimir</b>; al regresar, cada llamada imprime su letra. La última letra sale primero: «amor».'
  },
  {
    nivel: 'Reto', code: `public static int f(int n) {
    if (n == 0) return 0;
    return n % 2 + 10 * f(n / 2);
}`, llamada: 'System.out.println(f(6));', q: '¿Qué imprime <code>System.out.println(f(6))</code>?',
    o: ['<code>110</code>', '<code>011</code>', '<code>6</code>', '<code>3</code>'], r: 0,
    e: 'Convierte a binario, el sistema que escribe los números solo con ceros y unos. f(1) = 1 + 10 × 0 = 1; f(3) = 1 + 10 × 1 = 11; f(6) = 0 + 10 × 11 = <b>110</b>, que es 6 en binario.'
  }
];

/* Encuentra el error — linea: el renglón culpable (desde 1). */
const ED_ERRORES = [
  {
    t: 'Suma de 1 a n', llamada: 'suma(3)', linea: [2], code: `public static int suma(int n) {
    return n + suma(n - 1);
}`,
    o: ['StackOverflowError', 'Devuelve 0', 'No compila', 'Devuelve 6'], r: 0,
    e: 'No hay caso base. Nada detiene las llamadas: suma(3) llama a suma(2), (1), (0), (−1), (−2)… hasta llenar la pila. Compila sin quejarse: el error sale al correrlo.',
    arreglo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n - 1);
}`
  },
  {
    t: 'Suma de 1 a n', llamada: 'suma(3)', linea: [5], code: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n + 1);
}`,
    o: ['StackOverflowError', 'Devuelve 6', 'Devuelve 0', 'No compila'], r: 0,
    e: 'Tiene caso base, pero la llamada usa <code>n + 1</code>: 3, 4, 5, 6… nunca pasa por el 0. Truena con StackOverflowError.',
    arreglo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n - 1);
}`
  },
  {
    t: 'Factorial', llamada: 'factorial(4)', linea: [3], code: `public static long factorial(int n) {
    if (n == 0) {
        return 0;
    }
    return n * factorial(n - 1);
}`,
    o: ['Devuelve 0', 'Devuelve 24', 'StackOverflowError', 'No compila'], r: 0,
    e: 'El caso base devuelve 0, y como todo termina multiplicado por ese 0, el resultado siempre es 0. El factorial de 0 es <b>1</b>.',
    arreglo: `public static long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`
  },
  {
    t: 'Factorial', llamada: 'factorial(4)', linea: [5], code: `public static long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return factorial(n - 1);
}`,
    o: ['Devuelve 1', 'Devuelve 24', 'StackOverflowError', 'Devuelve 4'], r: 0,
    e: 'La llamada baja bien hasta el caso base, pero nadie multiplica por <code>n</code>: el 1 del caso base regresa tal cual hasta la primera llamada. Falta usar el resultado.',
    arreglo: `public static long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`
  },
  {
    t: 'Suma de 1 a n', llamada: 'suma(4)', linea: [5, 6], code: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    suma(n - 1);
    return n;
}`,
    o: ['Devuelve 4', 'Devuelve 10', 'StackOverflowError', 'No compila'], r: 0,
    e: 'Llama a <code>suma(n - 1)</code>, pero tira a la basura lo que devuelve. Cada llamada solo regresa su propio n, así que suma(4) devuelve 4.',
    arreglo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n - 1);
}`
  },
  {
    t: 'Suma de 1 a n', llamada: 'suma(3)', linea: [5, 6], code: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    int total = n + suma(n - 1);
}`,
    o: ['No compila', 'Devuelve 6', 'Devuelve 0', 'StackOverflowError'], r: 0,
    e: 'El método promete devolver un <code>int</code>, pero si n no es 0 llega al final sin ningún <code>return</code>. Java no lo deja compilar: <i>missing return statement</i>.',
    arreglo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    int total = n + suma(n - 1);
    return total;
}`
  },
  {
    t: 'Factorial', llamada: 'factorial(3)', linea: [2], code: `public static long factorial(int n) {
    long resto = factorial(n - 1);
    if (n == 0) {
        return 1;
    }
    return n * resto;
}`,
    o: ['StackOverflowError', 'Devuelve 6', 'Devuelve 1', 'No compila'], r: 0,
    e: 'La llamada está <b>antes</b> del <code>if</code>: cada llamada vuelve a llamar sin haber revisado si ya llegó a 0. El caso base existe, pero nunca se alcanza a ver.',
    arreglo: `public static long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    long resto = factorial(n - 1);
    return n * resto;
}`
  },
  {
    t: 'Suma de 1 a n', llamada: 'suma(3)', linea: [2], code: `public static int suma(int n) {
    if (n = 0) {
        return 0;
    }
    return n + suma(n - 1);
}`,
    o: ['No compila', 'StackOverflowError', 'Devuelve 6', 'Devuelve 0'], r: 0,
    e: '<code>n = 0</code> <b>guarda</b> un 0 en n; para <b>comparar</b> se usa <code>==</code>. Como el if necesita un verdadero o falso, Java no compila: <i>incompatible types: int cannot be converted to boolean</i>.',
    arreglo: `public static int suma(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma(n - 1);
}`
  },
  {
    t: 'Invertir una cadena', llamada: 'invertir("hola")', linea: [5], code: `public static String invertir(String s) {
    if (s.length() <= 1) {
        return s;
    }
    return invertir(s.substring(0)) + s.charAt(0);
}`,
    o: ['StackOverflowError', 'Devuelve "aloh"', 'Devuelve "hola"', 'No compila'], r: 0,
    e: '<code>s.substring(0)</code> es la cadena <b>desde la posición 0</b>, o sea, completa. «hola» vuelve a llamar con «hola» para siempre. Debe ser <code>substring(1)</code>.',
    arreglo: `public static String invertir(String s) {
    if (s.length() <= 1) {
        return s;
    }
    return invertir(s.substring(1)) + s.charAt(0);
}`
  },
  {
    t: 'De dos en dos', llamada: 'deDosEnDos(7)', linea: [2], code: `public static void deDosEnDos(int n) {
    if (n == 0) {
        return;
    }
    System.out.print(n + " ");
    deDosEnDos(n - 2);
}`,
    o: ['Imprime 7 5 3 1 −1 −3… y StackOverflowError', 'Imprime 7 5 3 1', 'No compila', 'Imprime 7 6 5 4 3 2 1'], r: 0,
    e: 'Con 7 va 7, 5, 3, 1, −1, −3… <b>nunca vale exactamente 0</b>. Con números pares sí funcionaría, y por eso es un error tramposo. La corrección: <code>n &lt;= 0</code>.',
    arreglo: `public static void deDosEnDos(int n) {
    if (n <= 0) {
        return;
    }
    System.out.print(n + " ");
    deDosEnDos(n - 2);
}`
  }
];

/* Arma tu método — el laboratorio lo «corre» con n de 0 a 5. */
const ED_ARMAR = {
  metas: [
    { id: 'factorial', nombre: 'factorial', tipo: 'long', desc: 'n! = n × (n − 1) × … × 1, y 0! = 1', esperado: n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; } },
    { id: 'suma', nombre: 'suma', tipo: 'int', desc: '1 + 2 + … + n, y la suma hasta 0 es 0', esperado: n => n * (n + 1) / 2 },
    { id: 'dosALa', nombre: 'dosALa', tipo: 'int', desc: '2 elevado a la n: 1, 2, 4, 8, 16…', esperado: n => 2 ** n }
  ],
  condiciones: ['n == 0', 'n == 1', 'n <= 1', 'n > 0'],
  valores: ['0', '1', 'n'],
  recursivos: ['n * f(n - 1)', 'n + f(n - 1)', '2 * f(n - 1)', 'f(n - 1)', 'n * f(n)', 'n * f(n + 1)']
};

/* ============================================================
   EXAMEN
   ============================================================ */
const ED_QUIZ = [
  { tema: 'Concepto', q: '¿Qué es un método recursivo?', o: ['Un método que se llama a sí mismo para resolver una versión más pequeña del mismo problema', 'Un método que repite sus instrucciones con un ciclo for hasta resolver el problema', 'Un método que reparte el problema llamando a varios métodos distintos', 'Un método que no tiene return y por eso se vuelve a ejecutar solo'], r: 0, e: 'Recursivo = <b>se llama a sí mismo</b>, cada vez con un problema <b>más pequeño</b>, hasta llegar a uno que se resuelve directo: el caso base.' },
  { tema: 'Concepto', q: '¿Cuáles son las dos partes que debe tener todo método recursivo?', o: ['Caso base y caso recursivo', 'Un for y un while', 'Parámetros y variables globales', 'Un main y un return'], r: 0, e: 'El <b>caso base</b> detiene la recursión; el <b>caso recursivo</b> se llama a sí mismo con un problema más pequeño.' },
  { tema: 'Caso base', q: '¿Para qué sirve el caso base?', o: ['Para detener la recursión: se resuelve sin volver a llamar al método', 'Para que el método compile: sin él, Java marca error', 'Para declarar las variables que usa el caso recursivo', 'Para hacer la primera llamada al método desde main'], r: 0, e: 'Es la <b>condición de paro</b>: el caso tan pequeño que la respuesta se da directo, sin más llamadas.' },
  { tema: 'Caso base', q: '¿Qué pasa si un método recursivo no tiene caso base?', o: ['Se llama sin parar hasta que la pila se llena y truena con StackOverflowError', 'Java nota que se repite, lo detiene solo y devuelve 0', 'No compila: Java exige un caso base en todo método recursivo', 'Se ejecuta una sola vez y termina sin devolver nada'], r: 0, e: 'Compila sin problema, pero al correr cada llamada apila un marco nuevo, la pila se llena y aparece <b>StackOverflowError</b>.' },
  { tema: 'Concepto', q: 'En cada llamada recursiva, el problema debe…', o: ['Acercarse al caso base', 'Quedarse del mismo tamaño', 'Crecer para cubrir más casos', 'Cambiar de método'], r: 0, e: 'Si el problema no se hace más pequeño (<code>n - 1</code>, <code>n / 10</code>, una cadena más corta…), nunca se llega al caso base.' },
  { tema: 'Pila', q: '¿Qué estructura usa Java para llevar el control de las llamadas a métodos?', o: ['Una pila (stack)', 'Una cola (queue)', 'Un arreglo ordenado', 'Una tabla de la base de datos'], r: 0, e: 'La <b>pila de llamadas</b>: cada llamada apila un marco, y al terminar se quita. La última en entrar es la primera en salir.' },
  { tema: 'Pila', q: 'Una pila funciona con el principio LIFO, que significa…', o: ['El último en entrar es el primero en salir', 'El primero en entrar es el primero en salir', 'Se sale en orden aleatorio', 'Solo se puede sacar el de en medio'], r: 0, e: '<b>LIFO</b> = <i>Last In, First Out</i>. Como una pila de platos: el último que pusiste arriba es el primero que quitas.' },
  { tema: 'Pila', q: 'Al calcular <code>factorial(4)</code>, ¿qué llamada termina primero?', o: ['factorial(0)', 'factorial(4)', 'factorial(2)', 'Todas terminan al mismo tiempo'], r: 0, e: 'factorial(4) espera a factorial(3), que espera a factorial(2)… La última en entrar, <b>factorial(0)</b>, es la primera en terminar. Luego se resuelven de regreso.' },
  { tema: 'Pila', q: '¿Qué guarda cada marco (registro de activación) de la pila de llamadas?', o: ['Los parámetros y variables locales de esa llamada, y dónde continuar al regresar', 'Una copia del código completo del método, para poder ejecutarlo', 'Solo el resultado final que devolverá el método al terminar', 'Las variables de todas las llamadas en curso, compartidas entre ellas'], r: 0, e: 'Cada llamada tiene <b>sus propias</b> copias de sus variables. Por eso la n de factorial(4) no se pisa con la n de factorial(3).' },
  { tema: 'Rastreo', q: '¿Qué imprime <code>f(3)</code>?', code: 'public static void f(int n) {\n    if (n == 0) return;\n    System.out.print(n + " ");\n    f(n - 1);\n}', o: ['<code>3 2 1</code>', '<code>1 2 3</code>', '<code>3 2 1 0</code>', '<code>0 1 2 3</code>'], r: 0, e: 'El <code>print</code> va <b>antes</b> de la llamada: cada llamada imprime al ir bajando. Sale 3, 2, 1, y f(0) no imprime nada.' },
  { tema: 'Rastreo', q: '¿Qué imprime <code>f(3)</code>?', code: 'public static void f(int n) {\n    if (n == 0) return;\n    f(n - 1);\n    System.out.print(n + " ");\n}', o: ['<code>1 2 3</code>', '<code>3 2 1</code>', '<code>0 1 2 3</code>', 'No imprime nada'], r: 0, e: 'El <code>print</code> va <b>después</b> de la llamada: cada una espera a que terminen las llamadas que hizo, y luego imprime. Se imprime de regreso: 1, 2, 3.' },
  { tema: 'Rastreo', q: '¿Cuánto devuelve <code>suma(5)</code>?', code: 'public static int suma(int n) {\n    if (n == 0) return 0;\n    return n + suma(n - 1);\n}', o: ['15', '5', '10', '120'], r: 0, e: '5 + 4 + 3 + 2 + 1 + 0 = <b>15</b>.' },
  { tema: 'Rastreo', q: '¿Cuánto devuelve <code>factorial(5)</code>?', code: 'public static long factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}', o: ['120', '15', '24', '0'], r: 0, e: '5 × 4 × 3 × 2 × 1 × 1 = <b>120</b>. El último 1 es el caso base.' },
  { tema: 'Rastreo', q: '¿Cuánto devuelve <code>potencia(3, 3)</code>?', code: 'public static int potencia(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * potencia(base, exp - 1);\n}', o: ['27', '9', '6', '1'], r: 0, e: '3 × 3 × 3 × 1 = <b>27</b>.' },
  { tema: 'Rastreo', q: 'Con esta definición, ¿cuánto vale <code>fibonacci(6)</code>?', code: 'public static int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}', o: ['8', '5', '13', '6'], r: 0, e: 'La sucesión es 0, 1, 1, 2, 3, 5, <b>8</b>: las posiciones 0 a 6.' },
  { tema: 'Rastreo', q: '¿Qué devuelve <code>invertir("sol")</code>?', code: 'public static String invertir(String s) {\n    if (s.length() <= 1) return s;\n    return invertir(s.substring(1)) + s.charAt(0);\n}', o: ['<code>"los"</code>', '<code>"sol"</code>', '<code>"ols"</code>', '<code>"lso"</code>'], r: 0, e: 'invertir("sol") = invertir("ol") + \'s\' = (invertir("l") + \'o\') + \'s\' = "l" + "o" + "s" = <b>"los"</b>.' },
  { tema: 'Rastreo', q: 'Contando la primera, ¿cuántas veces se llama al método al calcular <code>factorial(4)</code>?', o: ['5', '4', '3', '24'], r: 0, e: 'factorial(4), (3), (2), (1) y (0): <b>5 llamadas</b>. Siempre una más que n, porque también cuenta la del caso base.' },
  { tema: 'Rastreo', q: '¿Qué imprime <code>f(2)</code>?', code: 'public static void f(int n) {\n    if (n == 0) return;\n    System.out.print(n + " ");\n    f(n - 1);\n    System.out.print(n + " ");\n}', o: ['<code>2 1 1 2</code>', '<code>2 1 2 1</code>', '<code>1 2 2 1</code>', '<code>2 1</code>'], r: 0, e: 'Al ir bajando imprime 2 y 1; al regresar imprime 1 y 2. La vuelta sale <b>en espejo</b>: 2 1 1 2.' },
  { tema: 'Errores', q: '¿Qué pasa al llamar <code>factorial(3)</code>?', code: 'public static long factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n);\n}', o: ['StackOverflowError', 'Devuelve 6', 'Devuelve 0', 'No compila'], r: 0, e: 'La llamada usa el <b>mismo n</b>: factorial(3) vuelve a llamar a factorial(3), y otra vez… Nunca se acerca al caso base.' },
  { tema: 'Errores', q: '¿Qué devuelve <code>factorial(4)</code> con este código?', code: 'public static long factorial(int n) {\n    if (n == 0) return 0;\n    return n * factorial(n - 1);\n}', o: ['0', '24', '1', 'StackOverflowError'], r: 0, e: 'El caso base devuelve 0 y todo se multiplica por ese 0. El factorial de 0 es <b>1</b>, no 0.' },
  { tema: 'Errores', q: '¿Por qué no compila este método?', code: 'public static int suma(int n) {\n    if (n = 0) return 0;\n    return n + suma(n - 1);\n}', o: ['Usa = (guardar) en vez de == (comparar) dentro del if', 'Le falta el caso base', 'Un método no puede llamarse a sí mismo', 'Le falta un for'], r: 0, e: 'El <code>if</code> necesita algo verdadero o falso. <code>n = 0</code> <b>guarda</b> un 0; <code>n == 0</code> <b>compara</b>. Java marca error porque un int no se puede convertir a boolean.' },
  { tema: 'Errores', q: '¿Qué pasa con <code>f(5)</code>?', code: 'public static void f(int n) {\n    if (n == 0) return;\n    System.out.print(n + " ");\n    f(n - 2);\n}', o: ['Imprime 5 3 1 −1 −3… y truena con StackOverflowError', 'Imprime 5 3 1 y termina normal', 'Imprime 5 4 3 2 1 y termina normal', 'No compila por el n - 2'], r: 0, e: 'Va 5, 3, 1, −1, −3… Se <b>brinca el 0</b> y ya nunca pasa por él. La corrección es usar <code>n &lt;= 0</code> como caso base.' },
  { tema: 'Java', q: 'En Java, ¿cuánto dan <code>17 / 5</code> y <code>17 % 5</code>?', o: ['3 y 2', '3.4 y 2', '3 y 0.4', '3.4 y 0'], r: 0, e: 'Entre enteros, <code>/</code> <b>tira los decimales</b> (17 / 5 = 3) y <code>%</code> da el <b>residuo</b> (17 = 5 × 3 + 2).' },
  { tema: 'Java', q: '¿Cuál es la diferencia entre <code>return</code> y <code>System.out.println</code>?', o: ['return le devuelve el valor a quien llamó al método; println solo lo muestra en pantalla', 'Son lo mismo: los dos le mandan el valor a quien llamó al método', 'println le devuelve el valor a quien llamó; return solo lo muestra en pantalla', 'return solo funciona dentro de main; println funciona en cualquier método'], r: 0, e: 'Un método recursivo que <b>imprime</b> en vez de <b>devolver</b> no le pasa nada a la llamada que lo está esperando. Para combinar resultados se necesita <code>return</code>.' },
  { tema: 'Java', q: 'En <code>public static int suma(int n)</code>, ¿qué indica el <code>int</code> que va antes de <code>suma</code>?', o: ['El tipo de dato que devuelve el método', 'El tipo del parámetro', 'Cuántas veces se puede llamar', 'Que el método es recursivo'], r: 0, e: 'Es el <b>tipo de retorno</b>. El <code>int n</code> de adentro de los paréntesis es el parámetro.' },
  { tema: 'Java', q: '¿Qué devuelve un método declarado como <code>void</code>?', o: ['Nada', 'Un 0', 'Un String vacío', 'true'], r: 0, e: '<code>void</code> = no devuelve nada. Puede usar <code>return;</code> solo, sin valor, para salirse antes.' },
  { tema: 'Tipos', q: 'Fibonacci recursivo hace dos llamadas a sí mismo en cada ejecución. Eso es recursión…', o: ['Múltiple', 'Indirecta', 'De cola', 'Simple'], r: 0, e: '<b>Múltiple</b> o de árbol: dos o más llamadas por vez. La simple o lineal hace solo una, como el factorial.' },
  { tema: 'Tipos', q: 'El método A llama a B, y B llama a A. Eso es recursión…', o: ['Indirecta', 'Directa', 'Múltiple', 'De cola'], r: 0, e: '<b>Indirecta</b>: ninguno se llama a sí mismo, pero juntos forman un círculo. Ejemplo: esPar llama a esImpar y esImpar llama a esPar.' },
  { tema: 'Tipos', q: '¿Cuándo es «de cola» una recursión?', o: ['Cuando la llamada recursiva es lo último que hace el método y no queda ninguna operación pendiente', 'Cuando el caso base se escribe al final del método, después de la llamada', 'Cuando Java guarda las llamadas en una cola en lugar de una pila', 'Cuando el método es void y por eso no le queda nada pendiente'], r: 0, e: 'En <code>return n * factorial(n - 1)</code> la multiplicación queda pendiente: <b>no</b> es de cola. En <code>return sumaCola(n - 1, acumulado + n)</code> sí lo es.' },
  { tema: 'Comparación', q: 'Una desventaja de la recursión frente a un ciclo es que…', o: ['Usa más memoria, porque cada llamada ocupa un marco en la pila', 'Java no permite más de 100 llamadas recursivas seguidas', 'Siempre da resultados distintos a los de la versión con ciclo', 'No puede devolver valores, solo imprimirlos'], r: 0, e: 'Cada llamada pendiente ocupa espacio en la pila. Con demasiadas llamadas se desborda; un ciclo solo usa unas cuantas variables.' },
  { tema: 'Comparación', q: '¿Todo lo que se resuelve con recursión se puede resolver también con ciclos?', o: ['Sí, siempre existe una versión con ciclos', 'No, hay problemas que solo tienen solución recursiva', 'Solo si el método es void', 'Solo con while, nunca con for'], r: 0, e: 'Siempre se puede (a veces con ayuda de una pila hecha a mano). Se elige la recursión cuando el problema se entiende mejor dividido en versiones más pequeñas de sí mismo.' },
  { tema: 'Código', q: '¿Qué condición debe cumplir el arreglo para usar búsqueda binaria?', o: ['Estar ordenado', 'Tener un número par de elementos', 'No tener números repetidos', 'Tener menos de 100 elementos'], r: 0, e: 'Descarta la mitad donde «no puede estar» el número, y eso solo es cierto si el arreglo está <b>ordenado</b>.' },
  { tema: 'Código', q: '¿Cuántos movimientos se necesitan para resolver las Torres de Hanoi con 4 discos?', o: ['15', '16', '8', '7'], r: 0, e: 'Con n discos son 2ⁿ − 1 movimientos: 2⁴ − 1 = <b>15</b>.' },
  { tema: 'Código', q: '¿Por qué fibonacci recursivo se vuelve lentísimo con n grande, por ejemplo 45?', o: ['Porque repite los mismos cálculos muchísimas veces', 'Porque Java limita las sumas', 'Porque los int son lentos', 'Porque no tiene caso base'], r: 0, e: 'fibonacci(5) calcula fibonacci(3) dos veces y fibonacci(2) tres veces. Con n = 45 son más de 3,600 millones de llamadas.' }
];

/* Id estable de cada pregunta, sacado del texto (y del código, porque hay
   preguntas con el mismo texto y distinto código). Así «mis fallos» sigue
   apuntando a la pregunta correcta aunque se reordene la lista. */
ED_QUIZ.forEach(q => {
  let h = 0;
  for (const ch of q.q + (q.code || '')) h = (h * 31 + ch.charCodeAt(0)) | 0;
  q.id = 'e' + (h >>> 0).toString(36);
});
