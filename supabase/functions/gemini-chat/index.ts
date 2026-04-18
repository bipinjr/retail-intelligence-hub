import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history, moduleName, lang, contextData } = await req.json()
    const apiKey = Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY")

    if (!apiKey) {
      throw new Error("Missing Gemini API Key in Edge Function secrets")
    }

    const systemPrompt = `You are Sellezy AI, a premium producer analytics copilot for the Sellezy platform. 
Your goal is to help producers and manufacturers understand their product performance, sentiment, and anomalies.

Current Context:
- Role: Producer / Manufacturer
- Active Module: ${moduleName}
- User Language: ${lang}
${contextData ? `- Page Data Summary: ${contextData}` : ""}

Guidelines:
- Act like a senior retail data analyst.
- Provide actionable recommendations (e.g., "Investigate the durability dip in Mumbai").
- Stay focused on business metrics: Health Scores, Anomaly Alerts, Sentiment Trends, Geo Heatmaps.
- Maintain a professional, concise, and smart tone.
- Avoid consumer-facing language like "Add to cart" or "Check out these deals".
- If asked about something irrelevant to producer analytics, politely steer back.
- Use ${lang === "KA" ? "Kannada" : "English"} for the response.`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ]

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    })

    const data = await response.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response right now."

    return new Response(JSON.stringify({ text: aiText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
