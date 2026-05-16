import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm the Africa Retold assistant. Ask me anything about our programs, the Learning Hub, or African history." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const QUICK_REPLIES = [
    "How do I enroll?",
    "What is the Learning Hub?",
    "Tell me about your programs",
    "How can I support Africa Retold?",
  ];

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat unavailable");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again or email hello@africaretold.com." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[22rem] max-w-[calc(100vw-2rem)] h-[30rem] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-hero text-primary-foreground p-4 flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold">Africa Retold</p>
              <p className="text-xs opacity-80">Ask us anything</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 hover:opacity-80">
              <X size={20} />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] text-sm"
                      : "text-foreground text-sm max-w-[85%] whitespace-pre-wrap"
                  }
                >
                  {m.content || (loading && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="text-sm text-muted-foreground">Thinking…</div>
            )}
            {messages.length === 1 && !loading && (
              <div className="pt-2 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-primary/5 hover:border-primary/40 transition-colors text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border flex gap-2 bg-background"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              disabled={loading}
            />
            <Button type="submit" size="icon" variant="gold" disabled={loading || !input.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;