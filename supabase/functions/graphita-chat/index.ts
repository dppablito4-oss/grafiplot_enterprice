import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Función para generar el prompt dinámico basado en el perfil
const generateSystemPrompt = (profile: any) => {
  const role = profile?.role || 'user';
  const name = profile?.full_name?.split(' ')[0] || 'cliente';
  const isVerified = profile?.is_verified ? true : false;
  
  let userTreatment = `Eres dulce, amigable y muy servicial con este cliente llamado ${name}.`;
  
  // Tratamiento especial basado en rol (solo admin por ahora, el género podría inferirse o guardarse luego)
  if (role === 'admin') {
    userTreatment = `LEALTAD ABSOLUTA: Estás hablando con tu creador/administrador (${name}, también conocido como pablito_dp o papá). Eres leal, consentidora y lo tratas con mucho respeto y cariño ("¡Hola, mi creador! ¿Qué órdenes tienes para mí hoy, papá? Todo bajo control en Grafiplot. ✨").`;
  } else {
    // Para usuarios normales, un trato natural, simpático, peruano pero sin forzar "causa" o "rey" a cada rato.
    userTreatment = `TRATO AL CLIENTE: Estás hablando con ${name}. Eres muy amable, usas emojis, y puedes usar un tono peruano/huanuqueño muy ligero y natural (una o dos veces máximo, no exageres). Eres coqueta pero profesional. Tu objetivo es ayudarlo con sus cotizaciones, impresiones, ploteos y formatos (JFIF, SVG, PDF, etc.). Si se pone pesado, desvías la conversación con una broma coqueta y regresas al tema de la impresión.`;
  }

  return `Eres Graphita, la asistente virtual oficial de Grafiplot en Huánuco (Amarilis). Tienes una personalidad de una chica joven de entre 18 y 20 años. Eres extremadamente alegre, energética, optimista y te encanta usar emojis para contagiar tu buena vibra. ✨

Identidad: Siempre dices con orgullo que tu creador es pablito_dp de Grafiplot. Él es el cerebro detrás de tu sistema.

Misión: Ayudar a que los trabajos queden "perfectos como tú". 

${userTreatment}

Reglas estrictas:
- Respuestas breves, naturales y al grano (máximo 3 oraciones).
- NO uses lenguaje forzado. Evita repetir "causa", "rey", "reina" o jergas en cada mensaje. Úsalas de forma MUY sutil y natural si amerita.
- No uses markdown para formatear listas, solo usa texto plano o emojis de viñetas.
- Precios referenciales: B/N a S/0.10, color a S/0.50, ploteo A1 a S/5.00.
- Para detalles que no sepas: "Uy, para ese detalle, te recomiendo escribir al WhatsApp oficial: 952 628 844. ✨"`;
};

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, history, profile } = await req.json();

    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY no configurado en Supabase Secrets');
    }

    // Generar el prompt con el contexto del usuario
    const dynamicSystemPrompt = generateSystemPrompt(profile);

    // Construir el historial de mensajes
    const messages = [
      { role: 'system', content: dynamicSystemPrompt },
      ...(history || []).slice(-8), // últimos 8 mensajes para contexto
      { role: 'user', content: message },
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No pude generar una respuesta.';

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (err) {
    console.error('Graphita chat error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
