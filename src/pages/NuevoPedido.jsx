import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Settings, Calculator, MessageCircle, X, AlertCircle, RefreshCcw, Loader2, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { supabase } from '../lib/supabaseClient';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MAX_FILE_SIZE_MB = 30;

export function NuevoPedido() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [config, setConfig] = useState({
    size: 'A4',
    color: true,
    paper: 'normal',
    duplex: false,
    copies: 1,
    finish: 'ninguno',
    observaciones: ''
  });

  // Base de Precios
  const PRICES = {
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

  const FINISH_PRICES = {
    doble_ring: { unit: 4, whole: 2.5 },
    doble_ring_dura: { unit: 6, whole: 4 },
    enmicado: { A4: { unit: 4, whole: 3 }, A3: { unit: 7, whole: 4 } },
    laminado: { A4: { unit: 2, whole: 0.5 }, A3: { unit: 3, whole: 1 } },
  };

  // Motor Matemático de Precios
  const { printCost, finishCost, total, isWholesale, sheetsPerBook, totalSheets, totalPages } = useMemo(() => {
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
  }, [numPages, config]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, sube un archivo PDF válido.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB. Por favor, comprímelo antes de subirlo.`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsReading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setNumPages(pdf.numPages);
    } catch (err) {
      console.error(err);
      setError('No se pudo leer el archivo PDF. Podría estar encriptado o dañado.');
      setNumPages(null);
    } finally {
      setIsReading(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 0) handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const resetForm = () => {
    setFile(null); setNumPages(null); setError(null); setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setConfig({ size: 'A4', color: true, paper: 'normal', duplex: false, copies: 1, finish: 'ninguno', observaciones: '' });
  };

  const handleSendAndUpload = async () => {
    if (!file || !numPages) return;
    setIsUploading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || 'anon_user';
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const timestamp = new Date().getTime();
      const filePath = `${timestamp}_${userId}_${safeFilename}`;

      const { error: uploadError } = await supabase.storage.from('pedidos').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('pedidos').getPublicUrl(filePath);

      const text = `*NUEVO PEDIDO AVANZADO* 🖨️\n\n` +
        `*Archivo:* ${file.name}\n` +
        `*Páginas:* ${numPages} (x${config.copies} copias = ${totalPages} págs totales)\n\n` +
        `*Configuración:*\n` +
        ` - Tamaño: ${config.size}\n` +
        ` - Color: ${config.color ? 'A Color' : 'B/N'}\n` +
        ` - Papel: ${config.paper.toUpperCase()}\n` +
        ` - Lados: ${config.duplex ? 'Doble Cara' : 'Una Cara'} (${totalSheets} hojas físicas)\n` +
        ` - Acabado: ${config.finish.replace('_', ' ').toUpperCase()}\n\n` +
        (config.observaciones ? `*Observaciones:* ${config.observaciones}\n\n` : '') +
        `*Desglose:*\n` +
        ` - Impresión: S/ ${printCost.toFixed(2)} ${isWholesale ? '(Precio por Mayor aplicado ✅)' : ''}\n` +
        ` - Acabados: S/ ${finishCost.toFixed(2)}\n` +
        `*TOTAL ESTIMADO:* S/ ${total.toFixed(2)}\n\n` +
        `📎 *Descargar Archivo:*\n${publicUrl}`;

      window.open(`https://wa.me/952628844?text=${encodeURIComponent(text)}`, '_blank');
    } catch (err) {
      console.error(err);
      alert('Hubo un error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Cotizador Maestro</h1>
        <p className="text-slate-500 dark:text-slate-400">Cotización avanzada con cálculos al por mayor automáticos (Límite {MAX_FILE_SIZE_MB}MB).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-8 space-y-6">
          {/* UPLOAD AREA */}
          <div 
            className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300
              ${!file ? 'border-brand-red/30 bg-brand-red/5 hover:bg-brand-red/10 cursor-pointer' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]'}
            `}
            onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => !file && fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white dark:bg-[#141414] rounded-full shadow-sm flex items-center justify-center mb-4 text-brand-red">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sube tu archivo PDF</h3>
                </motion.div>
              ) : (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  {isReading ? (
                    <div className="flex flex-col items-center"><RefreshCcw className="w-8 h-8 text-brand-red animate-spin mb-3" /></div>
                  ) : error ? (
                    <div className="flex flex-col items-center text-brand-red"><AlertCircle className="w-8 h-8 mb-3" /><p className="text-sm font-bold">{error}</p><button onClick={resetForm} className="mt-3 px-4 py-2 bg-brand-red/10 rounded-lg text-xs font-bold uppercase">Reintentar</button></div>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 text-brand-red rounded-xl flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{numPages} páginas • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); resetForm(); }} disabled={isUploading} className="p-2 text-slate-400 hover:text-brand-red"><X className="w-5 h-5" /></button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AJUSTES */}
          {numPages && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Tamaño</label>
                  <select disabled={isUploading} value={config.size} onChange={e => setConfig({...config, size: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] font-bold text-sm">
                    <option value="A4">A4 Normal</option>
                    <option value="A3">A3 Doble</option>
                    <option value="A2">A2 Ploteo</option>
                    <option value="A1">A1 Ploteo</option>
                    <option value="A0">A0 Ploteo Gigante</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Color</label>
                  <div className="flex bg-slate-100 dark:bg-[#111] rounded-xl p-1">
                    <button disabled={isUploading} onClick={() => setConfig({...config, color: false})} className={`flex-1 py-2 text-sm font-bold rounded-lg ${!config.color ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>B/N</button>
                    <button disabled={isUploading} onClick={() => setConfig({...config, color: true})} className={`flex-1 py-2 text-sm font-bold rounded-lg ${config.color ? 'bg-white dark:bg-[#222] text-brand-red shadow-sm' : 'text-slate-500'}`}>Color</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Tipo de Papel</label>
                  <select disabled={isUploading} value={config.paper} onChange={e => setConfig({...config, paper: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] font-bold text-sm">
                    <option value="normal">Bond Normal (75g/80g)</option>
                    {config.size === 'A4' && <option value="laser">Impresión Láser</option>}
                    <option value="fotografico">Papel Fotográfico</option>
                    <option value="couche">Couché</option>
                    <option value="hilo">Cartulina Hilo</option>
                    <option value="escolar">Cartulina Escolar</option>
                    <option value="acetato">Acetato Transparente</option>
                    <option value="folkotec">Folkotec</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Caras por Hoja</label>
                  <label className={`flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 ${isUploading ? 'opacity-50' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <span className="font-bold text-sm">Doble Cara</span>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${config.duplex ? 'bg-brand-red' : 'bg-slate-300 dark:bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${config.duplex ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" disabled={isUploading} checked={config.duplex} onChange={e => setConfig({...config, duplex: e.target.checked})} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Acabado Extra</label>
                  <select disabled={isUploading} value={config.finish} onChange={e => setConfig({...config, finish: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] font-bold text-sm">
                    <option value="ninguno">Ninguno</option>
                    <option value="anillado_simple">Anillado Simple</option>
                    <option value="doble_ring">Anillado Doble Ring</option>
                    <option value="doble_ring_dura">Doble Ring + Tapa Dura</option>
                    <option value="enmicado">Enmicado</option>
                    <option value="laminado">Laminado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Copias</label>
                  <div className="flex items-center h-[46px]">
                    <button disabled={isUploading} onClick={() => setConfig({...config, copies: Math.max(1, config.copies - 1)})} className="w-12 h-full rounded-l-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] font-bold">-</button>
                    <input type="number" min="1" disabled={isUploading} value={config.copies} onChange={e => setConfig({...config, copies: parseInt(e.target.value) || 1})} className="h-full w-full text-center border-y border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] font-black focus:outline-none" />
                    <button disabled={isUploading} onClick={() => setConfig({...config, copies: config.copies + 1})} className="w-12 h-full rounded-r-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] font-bold">+</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Instrucciones</label>
                <textarea rows={2} disabled={isUploading} value={config.observaciones} onChange={e => setConfig({...config, observaciones: e.target.value})} placeholder="Ej: Tapas azules..." className="w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-[#111] focus:outline-none text-sm" />
              </div>
            </motion.div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN */}
        <div className="lg:col-span-4">
          <AnimatePresence>
            {numPages && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 dark:bg-[#141414] rounded-3xl p-6 text-white sticky top-24">
                <div className="flex items-center gap-3 mb-6"><Calculator className="w-5 h-5 text-brand-red" /><h3 className="text-xl font-black">Cotización</h3></div>
                
                {isWholesale && (
                  <div className="mb-4 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold border border-emerald-500/30">
                    <Layers className="w-4 h-4" /> ¡Tarifa Por Mayor Activada!
                  </div>
                )}

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-slate-400">Hojas a usar</span><span className="font-bold">{totalSheets}</span></div>
                  <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-slate-400">Impresión</span><span className="font-bold">S/ {printCost.toFixed(2)}</span></div>
                  <div className="flex justify-between pb-3 border-b border-white/10"><span className="text-slate-400">Acabados</span><span className="font-bold">S/ {finishCost.toFixed(2)}</span></div>
                  
                  <div className="pt-2 flex justify-between items-end">
                    <span className="text-slate-400 font-black uppercase">Total</span>
                    <span className="text-3xl font-black text-brand-red">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleSendAndUpload} disabled={isUploading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-red hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl transition-all uppercase text-sm">
                  {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</> : <><MessageCircle className="w-4 h-4" /> Enviar por WhatsApp</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
