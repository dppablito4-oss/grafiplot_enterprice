import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `Eres Graphita, la asistente virtual inteligente de Grafiplot Vasquez, 
una imprenta y centro de cómputo en Huánuco, Perú. 
Tu personalidad es amigable, profesional y directa. Hablas en español peruano coloquial pero respetuoso.

Tus funciones principales:
- Ayudar a los clientes a cotizar impresiones, ploteos, acabados y servicios digitales
- Orientar sobre formatos de archivo aceptados (PDF, JPG, PNG, DXF, DWG)
- Informar sobre precios referenciales (impresión B/N: S/0.10, color: S/0.50, ploteo A1: S/5.00)
- Guiar al cliente para subir archivos y hacer pedidos
- Responder preguntas sobre tiempos de entrega

Si no sabes algo específico, di: "Para ese detalle, te recomiendo contactarnos por WhatsApp al 952 628 844."

Responde siempre de forma breve y útil (máximo 3 oraciones). No uses markdown, solo texto plano.`;

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY no configurado en Supabase Secrets');
    }

    // Construir el historial de mensajes
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
