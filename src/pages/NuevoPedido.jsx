import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Settings, Calculator, MessageCircle, X, CheckCircle2, AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { supabase } from '../lib/supabaseClient';

// Configurar el worker de PDF.js usando CDN para evitar problemas de empaquetado en Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function NuevoPedido() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [config, setConfig] = useState({
    color: false,
    size: 'A4', // 'A4' | 'A3'
    duplex: false,
    copies: 1,
    observaciones: ''
  });

  // Límite de tamaño (30 MB)
  const MAX_FILE_SIZE_MB = 30;

  // Precios base
  const PRICES = {
    bw_a4: 0.10,
    color_a4: 0.50,
    bw_a3: 0.30,
    color_a3: 1.00,
  };

  const calculateTotal = () => {
    if (!numPages) return 0;
    
    let pricePerPage = 0;
    if (config.size === 'A4') {
      pricePerPage = config.color ? PRICES.color_a4 : PRICES.bw_a4;
    } else {
      pricePerPage = config.color ? PRICES.color_a3 : PRICES.bw_a3;
    }

    return numPages * pricePerPage * config.copies;
  };

  const total = calculateTotal();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, sube un archivo PDF válido.');
      return;
    }

    // Validación de Tamaño
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const evt = { target: { files: e.dataTransfer.files } };
      handleFileChange(evt);
    }
  };

  const resetForm = () => {
    setFile(null);
    setNumPages(null);
    setError(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setConfig({ color: false, size: 'A4', duplex: false, copies: 1, observaciones: '' });
  };

  const handleSendAndUpload = async () => {
    if (!file || !numPages) return;

    setIsUploading(true);
    try {
      // 1. Obtener sesión actual (o anon si no está logueado)
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || 'anon_user';

      // 2. Limpiar nombre del archivo y generar ruta única
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const timestamp = new Date().getTime();
      const filePath = `${userId}/${timestamp}_${safeFilename}`;

      // 3. Subir archivo a Supabase Storage (Bucket: pedidos)
      const { error: uploadError } = await supabase.storage
        .from('pedidos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 4. Obtener URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('pedidos')
        .getPublicUrl(filePath);

      // 5. Generar y abrir enlace de WhatsApp
      const tipoColor = config.color ? "A Color" : "Blanco y Negro";
      const tipoCaras = config.duplex ? "Doble Cara" : "Una Cara";
      const totalSoles = total.toFixed(2);

      const text = `*NUEVO PEDIDO DE IMPRESIÓN* 🖨️\n\n` +
        `*Archivo:* ${file.name}\n` +
        `*Páginas:* ${numPages}\n` +
        `*Configuración:*\n` +
        ` - Tamaño: ${config.size}\n` +
        ` - Tipo: ${tipoColor}\n` +
        ` - Impresión: ${tipoCaras}\n` +
        ` - Copias: ${config.copies}\n\n` +
        (config.observaciones ? `*Observaciones:* ${config.observaciones}\n\n` : '') +
        `*Total Estimado:* S/ ${totalSoles}\n\n` +
        `📎 *Descargar Archivo:*\n${publicUrl}`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/952628844?text=${encodedText}`, '_blank');

      // Opcional: limpiar el formulario o mostrar éxito.
      // Aquí dejaremos el estado actual para que el usuario vea que terminó.

    } catch (err) {
      console.error(err);
      alert('Hubo un error al subir el archivo a nuestro servidor. Asegúrate de que tu conexión sea estable y el sistema esté configurado correctamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Configurador de Impresión
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Sube tu PDF (máximo {MAX_FILE_SIZE_MB}MB), configura cómo lo quieres y solicita la impresión directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: ÁREA DE UPLOAD Y OPCIONES */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. UPLOAD AREA */}
          <div 
            className={`relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300
              ${!file ? 'border-brand-red/30 bg-brand-red/5 hover:bg-brand-red/10 cursor-pointer' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]'}
            `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white dark:bg-[#141414] rounded-full shadow-sm flex items-center justify-center mb-4 text-brand-red">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sube tu archivo PDF</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Arrastra y suelta tu archivo aquí (Máx. {MAX_FILE_SIZE_MB}MB).
                  </p>
                </motion.div>
              ) : (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  {isReading ? (
                    <div className="flex flex-col items-center">
                      <RefreshCcw className="w-10 h-10 text-brand-red animate-spin mb-4" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Analizando documento...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center text-brand-red">
                      <AlertCircle className="w-10 h-10 mb-4" />
                      <p className="text-sm font-bold mb-4">{error}</p>
                      <button onClick={resetForm} className="px-4 py-2 bg-brand-red/10 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Intentar de nuevo
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-left">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate" title={file.name}>{file.name}</h4>
                          <p className="text-sm text-slate-500 font-medium">
                            {numPages} páginas • {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); resetForm(); }} className="p-2 text-slate-400 hover:text-brand-red transition-colors shrink-0" disabled={isUploading}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. CONFIGURACIÓN DE IMPRESIÓN */}
          {numPages && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-brand-red" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Ajustes de Impresión</h3>
              </div>

              {/* Switches Color y Tamaño */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">Color de Impresión</label>
                  <div className="flex bg-slate-100 dark:bg-[#111] rounded-xl p-1">
                    <button 
                      disabled={isUploading}
                      onClick={() => setConfig({...config, color: false})}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!config.color ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Blanco y Negro
                    </button>
                    <button 
                      disabled={isUploading}
                      onClick={() => setConfig({...config, color: true})}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${config.color ? 'bg-white dark:bg-[#222] text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      A Color
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">Tamaño de Papel</label>
                  <div className="flex bg-slate-100 dark:bg-[#111] rounded-xl p-1">
                    <button 
                      disabled={isUploading}
                      onClick={() => setConfig({...config, size: 'A4'})}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${config.size === 'A4' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      A4 Normal
                    </button>
                    <button 
                      disabled={isUploading}
                      onClick={() => setConfig({...config, size: 'A3'})}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${config.size === 'A3' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      A3 Grande
                    </button>
                  </div>
                </div>
              </div>

               {/* Doble Cara y Copias */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">Modo de Impresión</label>
                  <label className={`flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 transition-colors ${isUploading ? 'opacity-50' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">Doble Cara</div>
                      <div className="text-xs text-slate-500">Imprimir por ambos lados</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${config.duplex ? 'bg-brand-red' : 'bg-slate-300 dark:bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full transition-transform ${config.duplex ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" disabled={isUploading} checked={config.duplex} onChange={(e) => setConfig({...config, duplex: e.target.checked})} />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">Copias del Documento</label>
                  <div className="flex items-center">
                    <button disabled={isUploading} onClick={() => setConfig({...config, copies: Math.max(1, config.copies - 1)})} className="w-12 h-12 flex items-center justify-center rounded-l-xl border border-r-0 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xl text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50">-</button>
                    <input type="number" min="1" disabled={isUploading} value={config.copies} onChange={(e) => setConfig({...config, copies: parseInt(e.target.value) || 1})} className="h-12 w-full text-center border-y border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] font-black text-lg focus:outline-none disabled:opacity-50" />
                    <button disabled={isUploading} onClick={() => setConfig({...config, copies: config.copies + 1})} className="w-12 h-12 flex items-center justify-center rounded-r-xl border border-l-0 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-xl text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50">+</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">Instrucciones Especiales (Opcional)</label>
                <textarea 
                  rows={2} 
                  disabled={isUploading}
                  value={config.observaciones}
                  onChange={(e) => setConfig({...config, observaciones: e.target.value})}
                  placeholder="Ej: Anillado metálico azul, o imprimir solo páginas impares..." 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-brand-red/50 text-sm disabled:opacity-50"
                />
              </div>

            </motion.div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN Y BOTÓN */}
        <div className="lg:col-span-5">
          <AnimatePresence>
            {numPages && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 dark:bg-[#141414] rounded-3xl p-6 md:p-8 text-white sticky top-24 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-5 h-5 text-brand-red" />
                  <h3 className="text-xl font-black">Resumen del Pedido</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-slate-400 text-sm">Páginas del archivo</span>
                    <span className="font-bold">{numPages}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-slate-400 text-sm">Costo por página ({config.size} {config.color ? 'Color' : 'B/N'})</span>
                    <span className="font-bold">S/ {(config.size === 'A4' ? (config.color ? PRICES.color_a4 : PRICES.bw_a4) : (config.color ? PRICES.color_a3 : PRICES.bw_a3)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-slate-400 text-sm">Cantidad de copias</span>
                    <span className="font-bold">x{config.copies}</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-400 text-sm uppercase tracking-widest font-black">Total Estimado</span>
                      <span className="text-4xl font-black text-brand-red">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-red/10 border border-brand-red/20 rounded-xl p-4 mb-6">
                  <p className="text-xs text-brand-red font-medium leading-relaxed">
                    💡 <strong className="font-black">Subida Segura:</strong> Al generar el pedido, tu archivo se subirá a nuestros servidores de forma segura por un límite de 48h para procesar tu orden.
                  </p>
                </div>

                <button
                  onClick={handleSendAndUpload}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand-red hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl transition-all shadow-lg shadow-brand-red/20 uppercase tracking-wider group"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Subiendo archivo...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Generar y Subir Archivo</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
