export const PRICES = {
  normal: {
    A1: { unit_bw: 2, unit_color: 2, whole_bw: 1.9, whole_color: 1.9 },
    A2: { unit_bw: 1.5, unit_color: 1.5, whole_bw: 1.3, whole_color: 1.3 },
    A0: { unit_bw: 4, unit_color: 4, whole_bw: 3.7, whole_color: 3.7 },
    A3: { unit_bw: 0.5, unit_color: 0.5, whole_bw: 0.3, whole_color: 0.5 },
    A4: { unit_bw: 0.1, unit_color: 0.1, whole_bw: 0.08, whole_color: 0.1 },
  },
  fotografico: { unit: 1.5, whole: 1.0 },
  couche: { unit: 1.5, whole: 1.0 },
  hilo: { unit: 1.5, whole: 1.0 },
  escolar: { unit: 0.5, whole: 0.3 },
  acetato: { unit: 4.0, whole: 2.0 },
  folkotec: { unit: 4.0, whole: 2.0 },
};

export const FINISH_PRICES = {
  doble_ring: { unit: 4, whole: 2.5 },
  doble_ring_dura: { unit: 6, whole: 4 },
  enmicado: { A4: { unit: 4, whole: 3 }, A3: { unit: 7, whole: 4 } },
  laminado: { A4: { unit: 2, whole: 0.5 }, A3: { unit: 3, whole: 1 } },
};

export function calculatePrice(config, numPages) {
  if (!numPages) return { printCost: 0, finishCost: 0, total: 0, isWholesale: false, sheetsPerBook: 0, totalSheets: 0, totalPages: 0 };

  const cTotalPages = numPages * config.copies;
  const cSheetsPerBook = config.duplex ? Math.ceil(numPages / 2) : numPages;
  const cTotalSheets = cSheetsPerBook * config.copies;
  const wholesale = cTotalSheets >= 100;

  let pCost = 0;

  // 1. Costo de Impresión
  if (config.paper === 'normal') {
    const p = PRICES.normal[config.size] || PRICES.normal['A4'];
    
    // Regla especial A4 Color Doble Cara Mayor a 100
    if (config.size === 'A4' && config.color && config.duplex && wholesale) {
      pCost = cTotalSheets * 0.13; // 0.13 por HOJA (ambas caras)
    } else {
      const costPerFace = config.color ? (wholesale ? p.whole_color : p.unit_color) : (wholesale ? p.whole_bw : p.unit_bw);
      pCost = cTotalPages * costPerFace; // Por cada página del PDF
    }
  } else if (config.paper === 'laser') {
    if (config.duplex) {
      pCost = cTotalSheets * (wholesale ? 0.60 : 1.00);
    } else {
      pCost = cTotalSheets * (wholesale ? 0.35 : 0.50);
    }
  } else {
    // Otros papeles especiales (fotográfico, couché, etc)
    const p = PRICES[config.paper];
    const costPerSheet = wholesale ? p.whole : p.unit;
    pCost = cTotalSheets * costPerSheet;
  }

  // 2. Costo de Acabados
  let fCost = 0;
  if (config.finish !== 'ninguno') {
    if (config.finish === 'anillado_simple') {
      let costPerBook = 0;
      if (cSheetsPerBook <= 100) costPerBook = 1.5;
      else if (cSheetsPerBook <= 300) costPerBook = 2.5;
      else costPerBook = 5.0;
      fCost = costPerBook * config.copies;
    } 
    else if (config.finish === 'doble_ring') {
      fCost = config.copies * (wholesale ? FINISH_PRICES.doble_ring.whole : FINISH_PRICES.doble_ring.unit);
    }
    else if (config.finish === 'doble_ring_dura') {
      fCost = config.copies * (wholesale ? FINISH_PRICES.doble_ring_dura.whole : FINISH_PRICES.doble_ring_dura.unit);
    }
    else if (config.finish === 'enmicado') {
      const p = FINISH_PRICES.enmicado[config.size === 'A3' ? 'A3' : 'A4'];
      fCost = cTotalSheets * (wholesale ? p.whole : p.unit);
    }
    else if (config.finish === 'laminado') {
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
    totalPages: cTotalPages
  };
}
