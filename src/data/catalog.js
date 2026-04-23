// ============================================================
// Grafiplot Vasquez — Catálogo de datos
// Migrado del legacy/script.js a módulo ES
// ============================================================

// ---- Constantes de negocio ----
export const BULK_THRESHOLD = 100;
export const BINDING_BLOCK_SIZE = 200;
export const BINDING_BLOCK_PRICE = 6;

export const BUSINESS_INFO = {
  name: 'Grafiplot Vasquez',
  tagline: 'Impresiones, ploteos y acabados con atención extendida todos los días',
  whatsappStore: '952628844',
  whatsappPablo: '918165428',
  address: 'AV. UNIVERSITARIA 606, frente a la puerta principal de la UNHEVAL',
  mapsUrl: 'https://maps.app.goo.gl/xVdKmLRH2RPNoTJW9',
  schedule: {
    weekday: { open: '7am', close: '10pm' },
    saturday: { open: '8am', close: '10pm' },
    sunday: { open: '9am', close: '10pm' },
  },
  scheduleMinutes: {
    0: { open: 9 * 60, close: 22 * 60, label: 'Domingos' },
    1: { open: 7 * 60, close: 22 * 60, label: 'Lunes a viernes' },
    2: { open: 7 * 60, close: 22 * 60, label: 'Lunes a viernes' },
    3: { open: 7 * 60, close: 22 * 60, label: 'Lunes a viernes' },
    4: { open: 7 * 60, close: 22 * 60, label: 'Lunes a viernes' },
    5: { open: 7 * 60, close: 22 * 60, label: 'Lunes a viernes' },
    6: { open: 8 * 60, close: 22 * 60, label: 'Sábados' },
  },
  payments: ['Yape', 'Plin', 'Lukita'],
};

// ---- Configuración del print-configurator ----
export const PRINT_CONFIG = {
  sizes: ['a4', 'a3', 'a2', 'a1', 'a0'],
  lockedSingleSideSizes: ['a2', 'a1', 'a0'],
  paperRestrictedSizes: ['a2', 'a1', 'a0'],
  bindingAllowedSizes: ['a4', 'a3'],
  sideLabels: { single: 'Una sola cara', duplex: 'Ambas caras (Duplex)' },
  styleLabels: { bn: 'Blanco y Negro', color: 'Color' },
};

export const PAPER_OPTIONS = {
  'bond-75': { label: 'Papel bond 75g', absolutePriceBySize: { any: null } },
  fotografico: { label: 'Papel fotográfico', absolutePriceBySize: { a4: 1.5, a3: 3 } },
  couche: { label: 'Papel couché', absolutePriceBySize: { a4: 2, a3: 4 } },
  'cartulina-escolar': { label: 'Cartulina escolar', absolutePriceBySize: { a4: 0.5, a3: 1 } },
  'cartulina-hilo': { label: 'Cartulina de hilo', absolutePriceBySize: { a4: 1, a3: 2 } },
};

export const PRICE_MATRIX = {
  a4: {
    single: {
      color: { unit: 0.10, bulk: 0.09, name: 'A4 una cara - Color' },
      bn:    { unit: 0.10, bulk: 0.08, name: 'A4 una cara - Blanco y Negro' },
    },
    duplex: {
      color: { unit: 0.15, bulk: 0.12, name: 'A4 ambas caras (duplex) - Color' },
      bn:    { unit: 0.10, bulk: 0.09, name: 'A4 ambas caras (duplex) - Blanco y Negro' },
    },
  },
  a3: {
    single: {
      color: { unit: 0.50, bulk: 0.50, name: 'Ploteo formato A3 - Color' },
      bn:    { unit: 0.50, bulk: 0.50, name: 'Ploteo formato A3 - Blanco y Negro' },
    },
    duplex: {
      color: { unit: 0.50, bulk: 0.50, name: 'A3 ambas caras (duplex) - Color' },
      bn:    { unit: 0.50, bulk: 0.50, name: 'A3 ambas caras (duplex) - Blanco y Negro' },
    },
  },
  a2: {
    single: {
      color: { unit: 1.50, bulk: 1.40, name: 'Ploteo formato A2 - Color' },
      bn:    { unit: 1.50, bulk: 1.40, name: 'Ploteo formato A2 - Blanco y Negro' },
    },
  },
  a1: {
    single: {
      color: { unit: 2.00, bulk: 1.90, name: 'Ploteo formato A1 - Color' },
      bn:    { unit: 2.00, bulk: 1.90, name: 'Ploteo formato A1 - Blanco y Negro' },
    },
  },
  a0: {
    single: {
      color: { unit: 4.00, bulk: 3.80, name: 'Ploteo formato A0 - Color' },
      bn:    { unit: 4.00, bulk: 3.80, name: 'Ploteo formato A0 - Blanco y Negro' },
    },
  },
};

// ---- Productos rápidos ----
export const QUICK_PRODUCTS = [
  { id: 'laminado-dni', tag: 'Enmicado / Laminado', name: 'Tamaño DNI', price: 4, note: 'Precio mínimo por medida DNI.', icon: 'servi-enmicado-dni' },
  { id: 'laminado-a4', tag: 'Enmicado / Laminado', name: 'Tamaño A4', price: 6, note: 'Laminado para hojas, guías y carátulas.', icon: 'servi-enmicado-a4' },
  { id: 'laminado-a3', tag: 'Enmicado / Laminado', name: 'Tamaño A3', price: 8, note: 'Acabado para formatos grandes.', icon: 'servi-enmicado-a3' },
  { id: 'dvd-tesis', tag: 'Tesis / Universidad', name: 'Quemado de DVD y Membretado', price: 2.50, note: 'Entrega de tesis y respaldo en DVD.', icon: 'servi-quemado-dvd' },
  { id: 'cd-tesis', tag: 'Tesis / Universidad', name: 'Quemado de CD y Membretado', price: 8, note: 'Versión compacta para tus tesis.', icon: 'servi-quemado-cd' },
  { id: 'scan-a4', tag: 'Digitalización', name: 'Escaneo A4', price: 0.10, note: 'Por hoja escaneada en formato A4.', icon: 'servi-escaneo-a4' },
  { id: 'scan-a3', tag: 'Digitalización', name: 'Escaneo A3', price: 0.30, note: 'Escaneo de planos y documentos A3.', icon: 'servi-escaneo-a3' },
  { id: 'foto-fotografico', tag: 'Impresión de Fotos', name: 'Papel Fotográfico', price: null, note: 'Configurable por tamaño.', icon: 'servi-foto-papel-fotografico', isConfigurable: true },
  { id: 'foto-adhesivo', tag: 'Impresión de Fotos', name: 'Fotográfico Adhesivo', price: null, note: 'Ideal para stickers y rotulado rápido.', icon: 'servi-foto-fotografico-adhesivo', isConfigurable: true },
  { id: 'diploma-hilo', tag: 'Diplomas', name: 'Cartulina de Hilo', price: null, note: 'Impresión premium de diploma.', icon: 'servi-diploma-cartulina-hilo', isConfigurable: true },
];

// ---- Servicios de tesis ----
export const THESIS_SERVICES = [
  {
    id: 'tesis-formato',
    title: 'Formato APA 7ma',
    subtitle: 'Estructura completa y presentación profesional.',
    detail: 'Configuramos portada, dedicatoria, índice, numeración, títulos y subtítulos según normas APA o reglamento de tu facultad.',
    icon: 'mono-formato',
  },
  {
    id: 'tesis-ajustes',
    title: 'Ajustes de márgenes e índices',
    subtitle: 'Corrección técnica de documentos largos.',
    detail: 'Corregimos interlineado, sangrías, saltos, tablas, figuras y actualizamos índices automáticos para que todo quede limpio y consistente.',
    icon: 'mono-citas',
  },
  {
    id: 'tesis-revision',
    title: 'Revisión visual final',
    subtitle: 'Lista para sustentación y entrega final.',
    detail: 'Hacemos control visual completo de tipografía, espaciado, consistencia de capítulos y orden de anexos antes de imprimir o empastar.',
    icon: 'mono-diagrama',
  },
];

// ---- Servicios monográficos ----
export const MONOGRAPH_SERVICES = [
  { title: 'Formato Académico', description: 'Ajuste de portada, títulos, márgenes, numeración y estructura final.', icon: 'mono-formato' },
  { title: 'Citas y Referencias', description: 'Revisión visual de citas APA 7ma, bibliografía y consistencia de fuentes.', icon: 'mono-citas' },
  { title: 'Diagramación Pro', description: 'Tablas, gráficos, alineación y limpieza visual para exposición.', icon: 'mono-diagrama' },
  { title: 'Impresión + espiralado', description: 'Entrega final en alta calidad con opciones de espiralados y carátula.', icon: 'mono-impresion' },
];

// ---- Soporte técnico PC ----
export const TECH_SERVICES = [
  {
    id: 'limpieza',
    title: 'Limpieza Profunda',
    description: 'Mantenimiento preventivo integral para prolongar vida útil.',
    price: 30,
    detail: 'Desarmado técnico, limpieza interna antiestática, ventiladores y disipadores para mejorar temperaturas y estabilidad.',
    image: 'pc-limpieza',
  },
  {
    id: 'pasta',
    title: 'Cambio de Pasta Térmica',
    description: 'Control térmico para CPU y GPU, menos calor y mejor rendimiento.',
    price: 15,
    detail: 'Retiro de compuesto antiguo y aplicación de pasta térmica de alta conductividad (Arctic MX-4 con conductividad de 8.5W/mK), para reducir picos de temperatura.',
    image: 'pc-pasta',
  },
  {
    id: 'optimizacion',
    title: 'Optimización de Sistema',
    description: 'Ajustes para que tu equipo responda más rápido en tareas diarias.',
    price: 35,
    detail: 'Depuración de arranque, procesos y servicios para mejorar velocidad sin sacrificar estabilidad.',
    image: 'pc-optimizacion',
  },
  {
    id: 'formateo',
    title: 'Formateo e Instalación de software',
    description: 'Para que tus trabajos corran a full.',
    price: 25,
    detail: 'Formateo simple o profundo para un sistema limpio, con Windows, drivers y tus programas favoritos actualizados listos para ser usados.',
    image: 'pc-formateo',
  },
  {
    id: 'upgrade',
    title: 'Upgrade de Hardware',
    description: 'Mejoras reales con SSD, RAM y componentes compatibles.',
    price: 10,
    detail: 'Te asesoramos para que las tiendas no te cobren precios actuales por piezas antiguas, además una evaluación de compatibilidad y montaje profesional para tu nueva PC.',
    image: 'pc-upgrade',
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico General',
    description: 'Detección de fallas para definir la solución exacta.',
    price: 30,
    detail: 'Revisión de disco, memoria, temperaturas y eventos del sistema para identificar la causa real del problema.',
    image: 'pc-diagnostico',
  },
];

// ---- Imágenes del carrusel de producción ----
export const PRODUCTION_SLIDES = [
  { label: 'Copias para clases', image: 'coll_1' },
  { label: 'Impresiones por volumen', image: 'coll_2' },
  { label: 'Ploteos de alta nitidez', image: 'coll_3' },
  { label: 'Separatas y guías', image: 'coll_4' },
  { label: 'Material para oficina', image: 'coll_5' },
  { label: 'Acabados para entrega final', image: 'coll_6' },
];

// ---- Frases del promo ribbon ----
export const PROMO_PHRASES = [
  'Nosotros lo imprimimos al toque',
  'Tus impresiones salen hoy, bien hechas y a tiempo',
  'Impresoras encendidas, impresiones corriendo',
  'Calidad en tus planos y afiches',
  'Atención rápida toda la semana',
  'Envíanos tus trabajos tocando el icono de WhatsApp',
];
