"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { WS_URL } from "./api";

export interface ChatMessage {
  id: string;
  caseId: string;
  sender: "CLIENT" | "LAWYER";
  body: string;
  createdAt: string;
}

interface UseChatOpts {
  reference?: string; // client mode
  token?: string; // lawyer mode
  caseId?: string; // lawyer mode: which case to open
}

type Conn = "connecting" | "ready" | "error";

interface CaseRef {
  status?: string;
}

export function useChat({ reference, token, caseId }: UseChatOpts) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Conn>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);
  const [caseStatus, setCaseStatus] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!reference && !token) return;
    const socket = io(WS_URL, {
      auth: reference ? { reference } : { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("chat:ready", (d: { history?: ChatMessage[]; case?: CaseRef }) => {
      setStatus("ready");
      if (d.case?.status) setCaseStatus(d.case.status);
      if (d.history) setMessages(d.history);
      if (token && caseId) {
        setLoadingHistory(true);
        socket.emit("chat:open", { caseId }, (res: { history?: ChatMessage[]; case?: CaseRef }) => {
          if (res?.case?.status) setCaseStatus(res.case.status);
          if (res?.history) setMessages(res.history);
          setLoadingHistory(false);
        });
      } else {
        setLoadingHistory(false);
      }
    });
    socket.on("chat:error", (d: { message: string }) => {
      setStatus("error");
      setError(d.message);
    });
    socket.on("chat:message", (m: ChatMessage) => {
      // In lawyer mode, only append messages for the open case.
      if (caseId && m.caseId !== caseId) return;
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
      setPeerTyping(false);
    });
    socket.on("chat:typing", () => {
      setPeerTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setPeerTyping(false), 2500);
    });
    socket.on("connect_error", () => {
      setStatus("error");
      setError("Connection failed");
    });

    return () => {
      socket.disconnect();
    };
  }, [reference, token, caseId]);

  const send = useCallback(
    (text: string) => {
      const s = socketRef.current;
      if (!s || !text.trim()) return;
      s.emit("chat:send", { text: text.trim(), caseId });
    },
    [caseId],
  );

  const notifyTyping = useCallback(() => {
    socketRef.current?.emit("chat:typing", { caseId });
  }, [caseId]);

  return { messages, status, error, peerTyping, send, notifyTyping, caseStatus, loadingHistory };
}
