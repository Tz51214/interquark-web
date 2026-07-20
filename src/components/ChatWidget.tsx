import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm the Interquark assistant. Ask me about services, pricing, or timelines.",
    },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    const { ok, data } = await apiFetch<{ reply?: string; message?: string }>(
      "/support/chat",
      {
        method: "POST",
        body: JSON.stringify({ message: text, history }),
      },
    );

    if (!ok || !data.reply) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.message ||
            "Sorry, I ran into a problem answering that. Please try again or use the contact form.",
        },
      ]);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    }
    setSending(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-signal text-2xl text-white shadow-lg shadow-signal/30 transition-transform hover:scale-105 hover:bg-signal-dark"
        aria-label="Open chat assistant"
      >
        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange-500" />
        💬
      </button>

      <div
        className={`fixed bottom-24 right-6 z-50 flex h-[440px] w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between bg-signal px-4 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              Z
            </div>
            <div>
              <b className="block text-sm">Interquark Assistant</b>
              <span className="text-[11px] opacity-85">Usually replies instantly</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-lg opacity-85" aria-label="Close chat">
            &times;
          </button>
        </div>

        <div ref={bodyRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-slate-50 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-xl px-3.5 py-2 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "self-end rounded-br-sm bg-signal text-white"
                  : "self-start rounded-bl-sm border border-slate-200 bg-white"
              }`}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div className="flex w-fit gap-1 self-start rounded-xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-grow rounded-full border border-slate-300 px-3.5 py-2 text-[13px] focus:border-signal focus:outline-none"
          />
          <button
            onClick={send}
            disabled={sending}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-signal text-white disabled:opacity-60"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
        <div className="bg-white py-1.5 text-center text-[10px] text-slate-400">
          Powered by Claude · replies may take a moment
        </div>
      </div>
    </>
  );
}
