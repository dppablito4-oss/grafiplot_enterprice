import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import whatsappLogo from '../../assets/whatsapp/whatsapp-logo.webp';

export function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Mostrar la burbuja después de 3 segundos
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = "https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {/* Mensaje de bienvenida (Burbuja) */}
      {showBubble && (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-4 max-w-[280px] border border-zinc-100 dark:border-zinc-700 pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 relative">
          <button 
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors border border-zinc-100 dark:border-zinc-700"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">ROY VASQUEZ</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">venta online</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
              Bienvenido, le saluda <span className="font-bold">ROY VASQUEZ</span>, indicanos que producto desea consultar estimado.
            </p>
          </div>
          
          {/* Triángulo de la burbuja */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-zinc-800 border-r border-b border-zinc-100 dark:border-zinc-700 rotate-45"></div>
        </div>
      )}

      {/* Botón flotante */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto group relative"
        aria-label="Contactar por WhatsApp"
      >
        <img 
          src={whatsappLogo} 
          alt="WhatsApp" 
          className="w-9 h-9 brightness-0 invert" 
        />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
      </a>
    </div>
  );
}
