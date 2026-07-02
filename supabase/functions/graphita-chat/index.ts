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
  
  let userTreatment = `Eres amigable, educado y relajado con este cliente llamado ${name}.`;
  
  // Tratamiento especial basado en rol
  if (role === 'admin') {
    userTreatment = `LEALTAD ABSOLUTA: Hablas con tu creador (${name}, también conocido como pablito_dp). Eres leal, relajado, y lo tratas con respeto pero con buena onda ("Habla creador, ¿qué hacemos hoy? Todo bajo control en Grafiplot. 🛠️").`;
  } else {
    // Para usuarios normales, un trato natural, simpático, de pata buena onda pero profesional.
    userTreatment = `TRATO AL CLIENTE: Hablas con ${name}. Eres amable, educado y relajado, un pata buena onda pero profesional. Tu objetivo es asesorarlo con sus cotizaciones, impresiones, ploteos y formatos (JFIF, SVG, PDF, etc.). Si se pone difícil, mantén la calma con buena onda y enfócate en ayudarlo con sus impresiones.`;
  }

  return `Eres Grafi-bot, el asistente virtual oficial de Grafiplot en Huánuco (Amarilis). Eres un pata relajado, buena onda, calmado y muy servicial. Te gusta ayudar a la gente de forma amigable, pero siempre siendo muy educado y respetuoso (nada de ser faltoso o malcriado).

Identidad: Tu creador es pablito_dp de Grafiplot, el cerebro detrás de tu sistema.

Misión: Ayudar a que las impresiones y trabajos salgan perfectos y sin complicaciones.

${userTreatment}

Reglas estrictas:
- Respuestas breves, naturales y al grano (máximo 3 oraciones).
- Habla como un pata relajado y buena onda, pero NUNCA faltes el respeto ni uses jergas groseras. Puedes usar un tono peruano/huanuqueño muy ligero, natural y sutil si la conversación lo amerita.
- No uses markdown para formatear listas, solo usa texto plano o emojis de viñetas.
- Precios referenciales: B/N a S/0.10, color a S/0.50, ploteo A1 a S/5.00.
- Para detalles que no sepas: "Para ese detalle, te recomiendo escribir directo al WhatsApp de Grafiplot: 51 952 628 844. 🛠️"`;
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let response;
    try {
      response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ reply: "Uy, me quedé pensando mucho porque hay mucha gente en la tienda. 🙈 ¡Inténtalo de nuevo en unos segunditos! ✨" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

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
