import { createServerFn } from "@tanstack/react-start";

export const classifyTicket = createServerFn({ method: "POST" })
  .inputValidator((input: { systemPrompt: string; userMessage: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "LOVABLE_API_KEY not configured" };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: data.systemPrompt },
            { role: "user", content: data.userMessage },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status === 429) return { ok: false as const, error: "Rate limited. Try again shortly." };
        if (res.status === 402) return { ok: false as const, error: "AI credits exhausted." };
        return { ok: false as const, error: `Gateway ${res.status}: ${text.slice(0, 200)}` };
      }
      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "";
      const cleaned = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return { ok: true as const, parsed };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });