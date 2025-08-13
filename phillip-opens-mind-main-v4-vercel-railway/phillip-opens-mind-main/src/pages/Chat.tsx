import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INTAKE_QUESTIONS = [
  "To begin, how have your mood and energy been over the past two weeks?",
  "Have you noticed changes in your sleep (trouble falling asleep, staying asleep, or sleeping too much)?",
  "How is your appetite or weight compared to usual?",
  "Have you been feeling worried, on edge, or having trouble concentrating?",
  "Do you notice intrusive thoughts or urges to repeat actions to feel less anxious?",
  "Have you had sudden intense fear or panic (heart racing, shortness of breath, dizziness)?",
  "Have there been times of unusually high energy, needing less sleep, or feeling overly driven?",
  "Have you experienced a traumatic event and now have nightmares, flashbacks, or feel on guard?",
  "Has alcohol, cannabis, medications, or other substances been a concern or changed recently?",
  "Have you noticed seeing or hearing things others don’t, or strong beliefs others find unusual?",
  "Do you struggle with attention, organization, or impulsivity (since childhood or recently)?",
  "Any medical conditions, pain, or medications that might affect your mood or sleep?",
  "Any recent major stressors or life changes (work, school, relationships, finances)?",
  "How are your daily activities, relationships, and responsibilities being affected?",
  "Have you had thoughts of harming yourself or feeling life isn’t worth living? If yes, are you safe right now?",
];

const Chat = () => {
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

  async function sendToAI(history: Message[], mode: 'general' | 'evaluation') {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, mode })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'AI request failed');
    }
    const data = await res.json();
    return data as { reply: string, crisis?: boolean };
  }

  const { toast } = useToast();
  const [search] = useSearchParams();
  const evaluationMode = search.get("mode") === "evaluation";

  const [messages, setMessages] = useState<Message[]>(() =>
    evaluationMode
      ? [
          {
            role: "assistant",
            content:
              "I’m Phillip, an AI therapist. I’ll guide a short, professional check‑in based on DSM‑5 guidelines and common mental health questionnaires so we get a clear picture together.",
          },
          { role: "assistant", content: INTAKE_QUESTIONS[0] },
        ]
      : [
          {
            role: "assistant",
            content:
              "I’m Phillip, an AI therapist. Share what’s on your mind and I’ll respond with clear, supportive guidance.",
          },
        ]
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [freeRemaining, setFreeRemaining] = useState<number>(evaluationMode ? 15 : 5);
  const [qIndex, setQIndex] = useState<number>(evaluationMode ? 1 : 0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = evaluationMode ? "Free evaluation – Chat with Phillip" : "Chat with Phillip";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        evaluationMode
          ? "Free mental health check‑in with Phillip, an AI therapist trained on DSM‑5 guidelines."
          : "Private, friendly AI therapy chat with Phillip."
      );
  }, [evaluationMode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const tokenBalance = 0; // Will be wired to Supabase after integration

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (tokenBalance <= 0 && freeRemaining <= 0) {
      toast({
        title: "Free messages used",
        description: "Buy tokens to continue or come back later. I’ll enable Stripe after you connect Supabase.",
      });
      return;
    }

    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    // Consume free interaction only when no tokens are available
    if (tokenBalance <= 0) setFreeRemaining((n) => Math.max(0, n - 1));

    setTimeout(() => {
      setMessages((m) => {
        const next: Message[] = [...m];
        if (evaluationMode) {
          if (qIndex < INTAKE_QUESTIONS.length) {
            next.push({ role: "assistant", content: INTAKE_QUESTIONS[qIndex] });
            setQIndex(qIndex + 1);
          } else {
            next.push({
              role: "assistant",
              content:
                "Thanks for completing the check‑in. Based on what you shared, here are areas to keep an eye on (not a diagnosis): mood and energy, sleep and focus, and any anxiety or safety concerns. If things persist or get worse, consider speaking with a licensed clinician. Would you like a brief summary with next steps and coping ideas?",
            });
          }
        } else {
          next.push({
            role: "assistant",
            content:
              "Thanks for sharing. To understand the full picture, what felt most intense, when did it start, and what’s helped even a little? I can suggest practical, therapy‑informed steps if you’d like.",
          });
        }
        return next;
      });
      setLoading(false);
    }, 500);
  };

  const saveConversation = () => {
    toast({
      title: "Connect Supabase to save",
      description: "Please connect Supabase to enable auth and secure conversation storage.",
    });
  };

  return (
    <main className="container mx-auto py-8">
      <section className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{evaluationMode ? "Free evaluation" : "Chat with Phillip"}</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Tokens: {tokenBalance}</div>
            <Button variant="soft" onClick={saveConversation}>Save conversation</Button>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {evaluationMode ? (
            <span>Free evaluation messages remaining: {freeRemaining}</span>
          ) : (
            <span>Free messages remaining: {freeRemaining}</span>
          )}
        </div>
      </section>

      <section className="grid grid-rows-[1fr,auto] h-[70vh] border rounded-lg">
        <div ref={scrollRef} className="overflow-y-auto p-4 space-y-4 bg-card rounded-t-lg">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "assistant" ? "" : "text-right"}>
              <div
                className={
                  m.role === "assistant"
                    ? "inline-block max-w-[85%] rounded-md bg-secondary px-4 py-3 text-sm"
                    : "inline-block max-w-[85%] rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-muted-foreground">Phillip is thinking…</div>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 p-3 border-t bg-background rounded-b-lg"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={evaluationMode ? "Answer here…" : "Share what’s on your mind…"}
            aria-label="Message Phillip"
          />
          <Button type="submit">Send</Button>
        </form>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Phillip provides supportive, clinically informed guidance and is not a substitute for professional diagnosis or treatment. If you’re in crisis, contact local emergency services.
      </p>
    </main>
  );
};

export default Chat;

