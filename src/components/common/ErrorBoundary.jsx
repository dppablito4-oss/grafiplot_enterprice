import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">¡Ups! Algo salió mal.</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
              Hubo un problema al cargar la aplicación. Esto suele ocurrir por un fallo temporal en la conexión a internet.
            </p>
            <button 
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
