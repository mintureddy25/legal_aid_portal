"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useChat } from "@/lib/useChat";

/**
 * Reusable chat surface. `me` is the role of the current viewer so we can align
 * bubbles (client view: CLIENT on the right; lawyer view: LAWYER on the right).
 */
export function ChatBox({
  reference,
  token,
  caseId,
  me,
  closed = false,
  className = "",
}: {
  reference?: string;
  token?: string;
  caseId?: string;
  me: "CLIENT" | "LAWYER";
  closed?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const { messages, status, error, peerTyping, send, notifyTyping, caseStatus, loadingHistory } =
    useChat({ reference, token, caseId });
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Closed via the prop (caller already knows) or detected from the live case status.
  const isClosed = closed || caseStatus === "CLOSED";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, peerTyping]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isClosed) return;
    send(text);
    setText("");
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line ${className}`}>
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-canvas p-4"
        aria-live="polite"
      >
        {status === "connecting" && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {t("chat.connecting")}
          </div>
        )}
        {status === "error" && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</div>
        )}
        {status === "ready" && loadingHistory && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {t("chat.loading")}
          </div>
        )}
        {status === "ready" && !loadingHistory && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">{t("chat.empty")}</p>
        )}
        {messages.map((m) => {
          const mine = m.sender === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed ${
                  mine
                    ? "bg-brand-500 text-white rounded-br-sm"
                    : "bg-white text-ink ring-1 ring-line rounded-bl-sm"
                }`}
              >
                {m.body}
                <div className={`mt-0.5 text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {peerTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-line">
              <span className="flex gap-1">
                <Dot /> <Dot /> <Dot />
              </span>
            </div>
          </div>
        )}
      </div>

      {isClosed ? (
        <div className="flex items-center justify-center gap-2 border-t border-line bg-slate-50 p-4 text-center text-sm text-muted">
          <Lock className="size-4 shrink-0" aria-hidden />
          {t("chat.closed")}
        </div>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-line bg-white p-3">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              notifyTyping();
            }}
            placeholder={t("chat.placeholder")}
            aria-label={t("chat.placeholder")}
            disabled={status !== "ready"}
            className="min-h-11 flex-1 rounded-lg bg-canvas px-3.5 text-[15px] outline-none ring-1 ring-inset ring-line focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status !== "ready" || !text.trim()}
            className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 [touch-action:manipulation]"
            aria-label={t("chat.send")}
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      )}
    </div>
  );
}

function Dot() {
  return <span className="inline-block size-1.5 animate-bounce rounded-full bg-slate-400" />;
}
