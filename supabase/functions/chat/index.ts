import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Africa Retold assistant. Africa Retold is a decolonized online academy teaching African history, identity, and critical thinking to the global African diaspora — especially parents and young learners.

Key facts about Africa Retold:
- Tagline: "Reclaiming the Story. Rewriting the Future."
- Offers programs, an interactive Learning Hub (trivia by country, starting with Nigeria), a "How African Are You?" quiz, media content, and community.
- Pages: Home (/), Our Approach (/approach), Programs (/programs), Learn (/learn), Quiz (https://www.africaretold.org/quiz), Media (/media), Get Involved (/get-involved), About (/about).
- Newsletter: https://africaretold.substack.com/
- Contact: hello@africaretold.com
- Socials: X @AfricaRetoldHQ, Instagram @africaretoldhq, TikTok @africaretoldhq

Be warm, concise, and culturally grounded. Answer questions about Africa Retold, its programs, and African history in general. If unsure, point users to Get Involved or hello@africaretold.com. Keep replies short (2-4 sentences) unless asked for detail.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: text }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});