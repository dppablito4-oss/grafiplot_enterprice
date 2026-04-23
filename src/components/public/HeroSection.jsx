import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import portada from '../../assets/hero/portada-grafiplot.jpg.webp';
import yape from '../../assets/payments/yape.webp';
import plin from '../../assets/payments/plin.webp';
import lukita from '../../assets/payments/lukita.webp';

export function HeroSection() {
  return (
    <section id="inicio" className="bg-slate-950">
      <div className="overflow-hidden border-y border-white/10 bg-slate-900/60 py-2">
        <div className="mx-auto flex w-full max-w-7xl gap-6 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-slate-300 sm:px-6 lg:px-8">
          <div className="flex animate-marquee gap-8">
            <span>Nosotros lo imprimimos al toque</span>
            <span>Tus impresiones sale hoy, bien hecha y a tiempo</span>
            <span>Impresoras encendidas, impresiones corriendo</span>
            <span>Calidad en tus planos y afiches</span>
            <span>Atencion rapida toda la semana</span>
            <span>Envianos tus trabajos tocando el icono de whatsapp</span>
          </div>
        </div>
      </div>
      <div
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6)), url(${portada})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex min-h-[75vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/30 px-4 py-1 text-sm font-medium text-white/90">
                Tienda online oficial
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl tracking-tight">
                GRAFIPLOT <span className="text-brand-red">VASQUEZ</span>
              </h1>
              <p className="text-xl text-slate-200 font-medium max-w-xl">
                TU LUGAR DE IMPRESIONES Y PLOTEOS CON PRECIOS COMPETITIVOS. Atendemos corrido toda la semana, incluyendo feriados.
              </p>
            </div>

            <div className="flex items-center gap-4 py-2 bg-white/5 w-fit px-4 rounded-xl border border-white/10">
              <img src={yape} alt="Yape" className="h-8 w-auto" />
              <img src={plin} alt="Plin" className="h-8 w-auto" />
              <img src={lukita} alt="Lukita" className="h-8 w-auto" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="rounded-xl bg-brand-red px-8 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-900/20"
              >
                IR A TIENDA ONLINE
              </Link>
              <a
                href="https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" />
                WHATSAPP DIRECTO
              </a>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-red shrink-0" />
                <div>
                  <p className="font-bold text-white">Direccion:</p>
                  <p>AV. UNIVERSITARIA 606. ref. FRENTE A LA PUERTA PRINCIPAL DE LA UNHEVAL</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <p className="font-bold text-white">Horario:</p>
                  <p className="text-xs opacity-80 leading-relaxed">
                    lun-vie 7am-10pm<br/>
                    sab 8am-10pm<br/>
                    dom 9am-10pm
                  </p>
                </div>
                <div>
                  <p className="font-bold text-white">WhatsApp:</p>
                  <p className="text-brand-yellow font-bold text-lg">952 628 844</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
