// Datos centralizados de servicios para uso en tarjetas y páginas de detalle
import { Printer, Scissors, Scan, Maximize2, FileText, Cpu } from 'lucide-react';

import imgImpresion from '../assets/services_2/servi-foto-papel-fotografico.svg';
import imgPloteo from '../assets/services/monografico.svg';
import imgAcabados from '../assets/services_2/servi-enmicado-a3.svg';
import imgDigitalizacion from '../assets/services_2/servi-escaneo-a3.svg';
import imgAPA from '../assets/services/tesis.svg';
import imgSoporte from '../assets/computo/pc-diagnostico.webp';

export const servicesData = [
  {
    id: 'impresiones',
    title: 'Impresión Alta Fidelidad',
    shortDesc: 'Documentos, tesis y separatas con nitidez láser.',
    fullDesc: 'Documentos, tesis y separatas con nitidez láser y colores vibrantes en diversos gramajes. Ideal para presentaciones profesionales y académicas. Contamos con impresoras láser de última generación que garantizan una calidad de impresión superior en cada página.',
    icon: Printer,
    image: imgImpresion,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-600/5 dark:bg-blue-400/10',
    borderColor: 'border-blue-200 dark:border-blue-500/30',
    accentHex: '#2563eb',
    features: [
      'Impresión a color y blanco/negro',
      'Papel bond 75g, 80g y 90g',
      'Papel couché brillante y mate',
      'Tamaños A4, A3, Oficio y Letter',
      'Impresión a doble cara automática',
    ],
    pricing: [
      { item: 'Impresión B/N A4', price: 'S/ 0.10' },
      { item: 'Impresión Color A4', price: 'S/ 0.50' },
      { item: 'Impresión Color A3', price: 'S/ 1.00' },
      { item: 'Papel Fotográfico A4', price: 'S/ 2.00' },
    ]
  },
  {
    id: 'ploteos',
    title: 'Ploteo Técnico & Planos',
    shortDesc: 'Precisión absoluta para ingeniería y arquitectura.',
    fullDesc: 'Precisión absoluta para ingeniería y arquitectura en tamaños A2, A1 y A0. Calidad de línea impecable para tus proyectos técnicos. Nuestros plotters de gran formato aseguran la fidelidad de cada trazo en tus planos profesionales.',
    icon: Maximize2,
    image: imgPloteo,
    color: 'text-brand-red dark:text-brand-yellow',
    bg: 'bg-brand-red/5 dark:bg-brand-yellow/10',
    borderColor: 'border-brand-red/20 dark:border-brand-yellow/30',
    accentHex: '#dc2626',
    features: [
      'Ploteo en blanco/negro y color',
      'Formatos A2, A1 y A0',
      'Papel bond, couché y fotográfico',
      'Alta resolución para detalles técnicos',
      'Entrega rápida para proyectos urgentes',
    ],
    pricing: [
      { item: 'Ploteo B/N A2', price: 'S/ 3.00' },
      { item: 'Ploteo B/N A1', price: 'S/ 5.00' },
      { item: 'Ploteo B/N A0', price: 'S/ 8.00' },
      { item: 'Ploteo Color A1', price: 'S/ 12.00' },
    ]
  },
  {
    id: 'acabados',
    title: 'Acabados Especiales',
    shortDesc: 'Encuadernación, laminado y cortes de precisión.',
    fullDesc: 'Encuadernación, laminado y cortes de precisión para una presentación profesional. Dale el toque final perfecto a tus trabajos. Ofrecemos múltiples opciones de acabado para que tu proyecto luzca impecable.',
    icon: Scissors,
    image: imgAcabados,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-600/5 dark:bg-amber-400/10',
    borderColor: 'border-amber-200 dark:border-amber-500/30',
    accentHex: '#d97706',
    features: [
      'Anillado metálico y plástico',
      'Encuadernación tapa dura',
      'Laminado mate y brillante',
      'Enmicado A4 y A3',
      'Corte y guillotina de precisión',
    ],
    pricing: [
      { item: 'Anillado simple', price: 'S/ 3.00' },
      { item: 'Enmicado A4', price: 'S/ 1.50' },
      { item: 'Enmicado A3', price: 'S/ 3.00' },
      { item: 'Laminado por metro', price: 'S/ 5.00' },
    ]
  },
  {
    id: 'digitalizacion',
    title: 'Digitalización Inteligente',
    shortDesc: 'Escaneo de alta resolución y conversión digital.',
    fullDesc: 'Escaneo de alta resolución y conversión a formatos editables para tus archivos. Preserva tus documentos físicos en formato digital con la máxima calidad y organización.',
    icon: Scan,
    image: imgDigitalizacion,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-600/5 dark:bg-emerald-400/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30',
    accentHex: '#059669',
    features: [
      'Escaneo a 300, 600 y 1200 DPI',
      'Formatos PDF, JPG, PNG y TIFF',
      'Escaneo de documentos tamaño A3',
      'OCR (reconocimiento de texto)',
      'Digitalización de planos antiguos',
    ],
    pricing: [
      { item: 'Escaneo A4', price: 'S/ 0.50' },
      { item: 'Escaneo A3', price: 'S/ 1.00' },
      { item: 'Escaneo + OCR', price: 'S/ 2.00' },
      { item: 'Lote 50+ páginas', price: 'Consultar' },
    ]
  },
  {
    id: 'normativa-apa',
    title: 'Normativa Académica APA',
    shortDesc: 'Asesoría técnica en diagramación universitaria.',
    fullDesc: 'Asesoría técnica en diagramación y márgenes según reglamentos universitarios. Asegura que tu tesis cumpla con todos los estándares requeridos por tu universidad.',
    icon: FileText,
    image: imgAPA,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600/5 dark:bg-indigo-400/10',
    borderColor: 'border-indigo-200 dark:border-indigo-500/30',
    accentHex: '#4f46e5',
    features: [
      'Formato APA 7ma edición',
      'Márgenes según reglamento UNHEVAL',
      'Tabla de contenidos automática',
      'Numeración de páginas',
      'Revisión de citas y referencias',
    ],
    pricing: [
      { item: 'Formateo básico', price: 'S/ 15.00' },
      { item: 'Formateo completo + índice', price: 'S/ 30.00' },
      { item: 'Revisión APA', price: 'S/ 10.00' },
      { item: 'Empastado de tesis', price: 'S/ 25.00' },
    ]
  },
  {
    id: 'soporte-tecnico',
    title: 'Soporte y Hardware',
    shortDesc: 'Mantenimiento y optimización de equipos.',
    fullDesc: 'Mantenimiento, optimización y actualización de equipos para tu productividad. Servicio técnico de confianza para tus herramientas de trabajo, tanto laptops como PCs de escritorio.',
    icon: Cpu,
    image: imgSoporte,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-600/5 dark:bg-orange-400/10',
    borderColor: 'border-orange-200 dark:border-orange-500/30',
    accentHex: '#ea580c',
    features: [
      'Diagnóstico completo de hardware',
      'Mantenimiento preventivo y correctivo',
      'Instalación de sistemas operativos',
      'Cambio de pasta térmica y limpieza',
      'Actualización de RAM y almacenamiento',
    ],
    pricing: [
      { item: 'Diagnóstico', price: 'S/ 10.00' },
      { item: 'Mantenimiento básico', price: 'S/ 30.00' },
      { item: 'Formateo + drivers', price: 'S/ 40.00' },
      { item: 'Mantenimiento completo', price: 'S/ 50.00' },
    ]
  },
];
