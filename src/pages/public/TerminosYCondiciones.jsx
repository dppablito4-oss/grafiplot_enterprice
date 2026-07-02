import { useEffect } from 'react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { PublicFooter } from '../../components/public/PublicFooter';
import { motion } from 'framer-motion';

export function TerminosYCondiciones() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <PublicNavbar onNavigateSection={() => window.location.href = '/'} />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-xl shadow-brand-red/5"
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mb-12">
              Última actualización: Abril 2026
            </p>

            <div className="space-y-8 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              
              {/* Sección 1: Introducción */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                  1. Introducción
                </h2>
                <p>
                  Bienvenido a Grafiplot Vasquez. Al utilizar nuestra plataforma web y nuestros servicios de impresión, diseño y ploteo, aceptas estar sujeto a los siguientes Términos y Condiciones. Por favor, léelos detenidamente antes de utilizar nuestros servicios.
                </p>
              </div>

              {/* Sección 2: Grafi-bot IA */}
              <div className="p-6 bg-brand-red/5 dark:bg-brand-red/10 rounded-2xl border border-brand-red/20">
                <h2 className="text-xl font-black text-brand-red dark:text-brand-yellow uppercase tracking-tight mb-3">
                  2. Uso de Grafi-bot IA y Privacidad de Archivos
                </h2>
                <p className="mb-3">
                  Nuestra plataforma cuenta con <strong>Grafi-bot</strong>, un asistente virtual impulsado por Inteligencia Artificial diseñado para facilitar cotizaciones, revisar formatos y asistir en pedidos.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Privacidad de Archivos:</strong> Los archivos (PDF, DWG, JPG, etc.) que subes a nuestra plataforma son analizados temporalmente por algoritmos de IA únicamente para calcular costos (ej. conteo de páginas, detección de color) y verificar la calidad de impresión.</li>
                  <li><strong>No entrenamiento de modelos:</strong> Grafiplot Vasquez garantiza que tus archivos, documentos académicos, planos y diseños <strong>NO</strong> serán utilizados para entrenar modelos de Inteligencia Artificial públicos ni serán compartidos con terceros.</li>
                  <li><strong>Almacenamiento:</strong> Los archivos se almacenan en servidores seguros (Supabase) y son eliminados de forma periódica tras la entrega del servicio impreso.</li>
                </ul>
              </div>

              {/* Sección 3: Cuentas */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                  3. Cuentas y Seguridad
                </h2>
                <p className="mb-2">
                  Para guardar el historial de tus pedidos, deberás ingresar tu correo electrónico. No utilizamos contraseñas; en su lugar, recibirás un código de acceso único (OTP) cada vez que necesites entrar. Eres responsable de mantener seguro tu acceso al correo.
                </p>
                <p>
                  <strong>Uso de Cookies y Tokens:</strong> Utilizamos <em>tokens de sesión</em> (una alternativa técnica a las cookies) guardados en tu navegador para mantener tu sesión activa de manera segura y no tener que pedirte el código constantemente. Al utilizar la plataforma e iniciar sesión, aceptas el uso de estas tecnologías estrictamente necesarias para el funcionamiento del servicio.
                </p>
              </div>

              {/* Sección 4: Pedidos */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                  4. Pedidos, Pagos y Devoluciones
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Las cotizaciones generadas por la IA son referenciales. El costo final podría variar si el archivo físico requiere ajustes manuales no detectados por el sistema.</li>
                  <li>Una vez iniciado el proceso de impresión o ploteo, no se aceptan cancelaciones ni devoluciones, dado que se trata de servicios personalizados.</li>
                  <li>En caso de errores de impresión atribuibles a nuestros equipos, procederemos a la reimpresión sin costo adicional.</li>
                </ul>
              </div>

              {/* Sección 5: Contacto */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                  5. Contacto
                </h2>
                <p>
                  Si tienes alguna duda sobre estos términos o sobre el manejo de tu información por parte de nuestra IA, puedes contactarnos directamente al WhatsApp: <strong>952 628 844</strong> o visitarnos en nuestro local frente a la UNHEVAL, Huánuco.
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
