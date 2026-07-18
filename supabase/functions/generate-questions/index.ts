const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY secret not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Strip HTML tags and clean up whitespace to reduce token count
    const plainText = content
      .replace(/<[^>]*>/g, " ")           // remove all HTML tags
      .replace(/&nbsp;/g, " ")            // decode common entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")               // collapse whitespace
      .trim()
      .slice(0, 3000);                     // hard cap at 3000 chars (~750 tokens)

    const prompt = `You are an expert African history educator. Based on the following module content, generate exactly 30 multiple choice trivia questions.

Module title: "${title}"

Content:
${plainText}

Requirements:
- Each question must be directly answerable from the content above
- Each question has exactly 4 options
- Only one option is correct
- Questions should test understanding, not just memorisation
- Vary difficulty across all 30: first 10 easy, next 10 medium, last 10 hard
- No trick questions
- No repeated questions

Return ONLY a valid JSON array of exactly 30 objects, no explanation, no markdown, no code fences:
[
  {
    "id": "q1",
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  }
]

correctIndex is 0-based (0 = first option is correct).`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: `Groq API error: ${text}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "[]";

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Extract JSON array — find first [ to last ]
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    const jsonStr = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;

    let questions;
    try {
      questions = JSON.parse(jsonStr);
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse questions JSON", raw }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
