import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { useAuth } from "../context/AuthContext";
import { apiUpload, API_BASE } from "../lib/api";

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
  createdAt: string;
}

export default function MessageThread({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authedFetch = useAuthedFetch();
  const { user, token } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await authedFetch<Message[]>(`/messages/project/${projectId}`);
    if (ok && Array.isArray(data)) setMessages(data);
    setLoading(false);
  }, [authedFetch, projectId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  async function send() {
    if (!text.trim()) return;
    const { ok } = await authedFetch("/messages", {
      method: "POST",
      body: JSON.stringify({ projectId, content: text }),
    });
    if (ok) {
      setText("");
      load();
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("Only PDF and JPG files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", String(projectId));
    formData.append("content", text || `Shared a file: ${file.name}`);

    const { ok } = await apiUpload("/messages/with-attachment", formData, token);
    setUploading(false);
    e.target.value = "";
    if (ok) {
      setText("");
      load();
    } else {
      alert("Could not upload the file. Please try again.");
    }
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-semibold text-signal hover:underline"
      >
        {open ? "Hide messages" : "View messages"}
      </button>

      {open && (
        <div className="mt-3">
          {loading ? (
            <p className="text-xs text-slate-400">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-slate-400">No messages yet.</p>
          ) : (
            <div className="mb-3 flex max-h-56 flex-col gap-2 overflow-y-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs ${
                    m.senderId === user?.id
                      ? "self-end bg-signal text-white"
                      : "self-start bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  {m.senderName && m.senderId !== user?.id && (
                    <b className="mb-0.5 block text-[10px] opacity-70">{m.senderName}</b>
                  )}
                  {m.content}
                  {m.attachmentUrl && (
                    <div className="mt-1.5">
                      {m.attachmentType?.startsWith("image/") ? (
                        <a href={`${API_BASE}${m.attachmentUrl}`} target="_blank" rel="noreferrer">
                          <img
                            src={`${API_BASE}${m.attachmentUrl}`}
                            alt={m.attachmentName || "attachment"}
                            className="max-h-40 rounded-lg border border-white/20"
                          />
                        </a>
                      ) : (
                        <a
                          href={`${API_BASE}${m.attachmentUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-semibold underline ${
                            m.senderId === user?.id
                              ? "border-white/30"
                              : "border-slate-300 dark:border-slate-500"
                          }`}
                        >
                          📄 {m.attachmentName || "Download file"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Write a message..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-signal focus:outline-none dark:border-slate-600 dark:bg-slate-800"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Attach PDF or JPG"
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              {uploading ? "..." : "📎"}
            </button>
            <button
              onClick={send}
              className="rounded-lg bg-signal px-3 py-1.5 text-xs font-semibold text-white hover:bg-signal-dark"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
