/**
 * pricing.js — Fuente única de verdad para todos los precios de Grafiplot Vasquez.
 * 
 * IMPORTANTE: Este archivo es la ÚNICA fuente de precios.
 * Todos los componentes (NuevoPedido, cartStore, servicesData, etc.)
 * deben importar de aquí. NO duplicar precios en otros archivos.
 */

// ---- Constantes de negocio ----
export const BULK_THRESHOLD = 100;
export const BINDING_BLOCK_SIZE = 200;
export const BINDING_BLOCK_PRICE = 6;

// ---- Precios de Impresión por Tipo de Papel ----
export const PRICES = {
  normal: {
    A0: { unit_bw: 4, unit_color: 4, whole_bw: 3.80, whole_color: 3.80 },
    A1: { unit_bw: 2, unit_color: 2, whole_bw: 1.90, whole_color: 1.90 },
    A2: { unit_bw: 1.5, unit_color: 1.5, whole_bw: 1.40, whole_color: 1.40 },
    A3: { unit_bw: 0.5, unit_color: 0.5, whole_bw: 0.50, whole_color: 0.50 },
    A4: { unit_bw: 0.1, unit_color: 0.1, whole_bw: 0.08, whole_color: 0.09 },
  },
  laser: {
    single: { unit: 0.50, whole: 0.35 },
    duplex: { unit: 1.00, whole: 0.60 },
  },
  fotografico: { unit: 1.5, whole: 1.0 },
  couche: { unit: 1.5, whole: 1.0 },
  hilo: { unit: 1.5, whole: 1.0 },
  escolar: { unit: 0.5, whole: 0.3 },
  acetato: { unit: 4.0, whole: 2.0 },
  folkotec: { unit: 4.0, whole: 2.0 },
};

// ---- Precios de Acabados ----
export const FINISH_PRICES = {
  anillado_simple: [
    { maxSheets: 100, price: 1.5 },
    { maxSheets: 300, price: 2.5 },
    { maxSheets: Infinity, price: 5.0 },
  ],
  doble_ring: { unit: 4, whole: 2.5 },
  doble_ring_dura: { unit: 6, whole: 4 },
  enmicado: {
    A4: { unit: 4, whole: 3 },
    A3: { unit: 7, whole: 4 },
  },
  laminado: {
    A4: { unit: 2, whole: 0.5 },
    A3: { unit: 3, whole: 1 },
  },
};

// ---- Regla especial: A4 Color Doble Cara Mayoreo ----
const A4_COLOR_DUPLEX_WHOLESALE_PER_SHEET = 0.13;

/**
 * calculatePrice — Motor de cálculo de precios.
 * 
 * @param {object} config - Configuración de impresión
 * @param {string} config.size - Tamaño: 'A4', 'A3', 'A2', 'A1', 'A0'
 * @param {boolean} config.color - true = a color, false = blanco y negro
 * @param {string} config.paper - Tipo de papel
 * @param {boolean} config.duplex - true = doble cara
 * @param {number} config.copies - Número de copias
 * @param {string} config.finish - Acabado: 'ninguno', 'anillado_simple', etc.
 * @param {number} numPages - Número de páginas del documento
 * @returns {object} Desglose de costos
 */
export function calculatePrice(config, numPages) {
  const empty = { printCost: 0, finishCost: 0, total: 0, isWholesale: false, sheetsPerBook: 0, totalSheets: 0, totalPages: 0 };
  if (!numPages) return empty;

  const cTotalPages = numPages * config.copies;
  const cSheetsPerBook = config.duplex ? Math.ceil(numPages / 2) : numPages;
  const cTotalSheets = cSheetsPerBook * config.copies;
  const wholesale = cTotalSheets >= BULK_THRESHOLD;

  let pCost = 0;

  // 1. Costo de Impresión
  if (config.paper === 'normal') {
    const p = PRICES.normal[config.size] || PRICES.normal['A4'];

    // Regla especial: A4 Color Doble Cara Mayoreo
    if (config.size === 'A4' && config.color && config.duplex && wholesale) {
      pCost = cTotalSheets * A4_COLOR_DUPLEX_WHOLESALE_PER_SHEET;
    } else {
      const costPerFace = config.color
        ? (wholesale ? p.whole_color : p.unit_color)
        : (wholesale ? p.whole_bw : p.unit_bw);
      pCost = cTotalPages * costPerFace;
    }
  } else if (config.paper === 'laser') {
    const mode = config.duplex ? PRICES.laser.duplex : PRICES.laser.single;
    pCost = cTotalSheets * (wholesale ? mode.whole : mode.unit);
  } else {
    // Papeles especiales (fotográfico, couché, hilo, escolar, acetato, folkotec)
    const p = PRICES[config.paper];
    if (p) {
      const costPerSheet = wholesale ? p.whole : p.unit;
      pCost = cTotalSheets * costPerSheet;
    }
  }

  // 2. Costo de Acabados
  let fCost = 0;
  if (config.finish && config.finish !== 'ninguno') {
    if (config.finish === 'anillado_simple') {
      const tier = FINISH_PRICES.anillado_simple.find(t => cSheetsPerBook <= t.maxSheets);
      fCost = (tier?.price || 5.0) * config.copies;
    } else if (config.finish === 'doble_ring') {
      fCost = config.copies * (wholesale ? FINISH_PRICES.doble_ring.whole : FINISH_PRICES.doble_ring.unit);
    } else if (config.finish === 'doble_ring_dura') {
      fCost = config.copies * (wholesale ? FINISH_PRICES.doble_ring_dura.whole : FINISH_PRICES.doble_ring_dura.unit);
    } else if (config.finish === 'enmicado') {
      const p = FINISH_PRICES.enmicado[config.size === 'A3' ? 'A3' : 'A4'];
      fCost = cTotalSheets * (wholesale ? p.whole : p.unit);
    } else if (config.finish === 'laminado') {
      const p = FINISH_PRICES.laminado[config.size === 'A3' ? 'A3' : 'A4'];
      fCost = cTotalSheets * (wholesale ? p.whole : p.unit);
    }
  }

  return {
    printCost: pCost,
    finishCost: fCost,
    total: pCost + fCost,
    isWholesale: wholesale,
    sheetsPerBook: cSheetsPerBook,
    totalSheets: cTotalSheets,
    totalPages: cTotalPages,
  };
}

/**
 * getAutoBindingTotal — Calcula el costo de encuadernación automática
 * Usado por el cartStore para el cálculo rápido de anillados.
 * 
 * @param {number} pages - Número de páginas
 * @returns {number} Costo total de encuadernación
 */
export function getAutoBindingTotal(pages) {
  if (pages <= 100) return 1.5;
  if (pages <= 200) return 2;
  if (pages <= 499) return 3;
  return Math.ceil(pages / 250) * 3;
}
