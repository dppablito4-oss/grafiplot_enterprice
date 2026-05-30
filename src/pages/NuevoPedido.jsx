import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Settings, Calculator, MessageCircle, X, AlertCircle, RefreshCcw, Loader2, Layers } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';
import { supabase } from '../lib/supabaseClient';
import { calculatePrice } from '../lib/pricing';

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

const MAX_FILE_SIZE_MB = 30;

export function NuevoPedido() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const fileInputRef = useRef(null);
  
  // Modal de Autenticación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState(1);
  const [authEmail, setAuthEmail] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [config, setConfig] = useState({
    size: 'A4',
    color: true,
    paper: 'normal',
    duplex: false,
    copies: 1,
    finish: 'ninguno',
    observaciones: ''
  });

  // Motor Matemático de Precios (Importado de pricing.js)
  const { printCost, finishCost, total, isWholesale, sheetsPerBook, totalSheets, totalPages } = useMemo(() => {
    return calculatePrice(config, numPages);
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
    setFile(null); setNumPages(null); setError(null); setIsUploading(false); setWhatsappLink(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setConfig({ size: 'A4', color: true, paper: 'normal', duplex: false, copies: 1, finish: 'ninguno', observaciones: '' });
  };

  const checkAuthAndSubmit = async () => {
    if (!file || !numPages) return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      handleSendAndUpload(data.session.user.id);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSendOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: authEmail.trim() });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthStep(2);
    }
  };

  const handleAuthVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: authEmail.trim(),
      token: authToken.trim(),
      type: 'email'
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message || 'Código inválido');
    } else if (data.session) {
      setShowAuthModal(false);
      handleSendAndUpload(data.session.user.id);
    }
  };

  const handleSendAndUpload = async (userId) => {
    if (!file || !numPages) return;
    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('pedidos').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('pedidos').getPublicUrl(filePath);

      // Guardar registro en Base de Datos para el Historial
      const { error: dbError } = await supabase.from('pedidos').insert({
        user_id: userId,
        file_name: file.name,
        pages: numPages,
        amount: total,
        status: 'Pendiente',
        details: {
          storagePath: filePath,
          size: config.size,
          color: config.color,
          paper: config.paper,
          duplex: config.duplex,
          copies: config.copies,
          finish: config.finish,
          totalSheets: totalSheets,
          isWholesale: isWholesale,
          observaciones: config.observaciones
        }
      });
      if (dbError) {
        console.error('Error guardando pedido en DB:', dbError);
        throw new Error('Hubo un problema al registrar el pedido en la base de datos.');
      }

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

      setWhatsappLink(`https://wa.me/952628844?text=${encodeURIComponent(text)}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Hubo un error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      {/* MODAL DE AUTENTICACIÓN */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-brand-red"><X className="w-5 h-5" /></button>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Inicia Sesión</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Para guardar tu pedido y hacerle seguimiento, necesitamos verificar tu correo.</p>
              
              {authStep === 1 ? (
                <form onSubmit={handleAuthSendOtp} className="space-y-4">
                  <input type="email" required placeholder="ejemplo@correo.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:outline-none" />
                  {authError && <p className="text-red-500 text-xs font-bold">{authError}</p>}
                  <button type="submit" disabled={authLoading} className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {authLoading ? 'Enviando...' : 'Enviar código al correo'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAuthVerifyOtp} className="space-y-4">
                  <p className="text-xs font-bold text-slate-400">Enviamos un código de 6 dígitos a {authEmail}</p>
                  <input type="text" required maxLength={6} placeholder="000000" value={authToken} onChange={e => setAuthToken(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white tracking-[0.5em] text-center font-mono focus:ring-2 focus:ring-brand-red focus:outline-none" />
                  {authError && <p className="text-red-500 text-xs font-bold">{authError}</p>}
                  <button type="submit" disabled={authLoading || authToken.length < 6} className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {authLoading ? 'Verificando...' : 'Verificar y Guardar Pedido'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

                {!whatsappLink ? (
                  <button onClick={checkAuthAndSubmit} disabled={isUploading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-red hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black rounded-xl transition-all uppercase text-sm">
                    {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</> : <><MessageCircle className="w-4 h-4" /> Finalizar Pedido</>}
                  </button>
                ) : (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all uppercase text-sm animate-pulse">
                    <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
