"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Msg = {
  id: number;
  room_slug: string;
  username: string;
  text: string;
  created_at: string;
};

export default function ChatPage() {
  const roomSlug = "general";
  const sb = useMemo(() => supabaseBrowser(), []);
  const [username, setUsername] = useState<string>("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [err, setErr] = useState<string>("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // local nickname
  useEffect(() => {
    const saved = localStorage.getItem("em_chat_username");
    if (saved) setUsername(saved);
    else setUsername("Anon" + Math.floor(Math.random() * 9000 + 1000));
  }, []);

  useEffect(() => {
    if (username) localStorage.setItem("em_chat_username", username);
  }, [username]);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("messages")
        .select("*")
        .eq("room_slug", roomSlug)
        .order("created_at", { ascending: true })
        .limit(200);

      if (!cancelled) {
        if (error) setErr(error.message);
        else setMessages((data as Msg[]) || []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sb, roomSlug]);

  // Realtime subscribe
  useEffect(() => {
    const channel = sb
      .channel(`room:${roomSlug}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_slug=eq.${roomSlug}` },
        (payload) => {
          const m = payload.new as Msg;
          setMessages((prev) => {
            // küçük duplicate koruması
            if (prev.length && prev[prev.length - 1]?.id === m.id) return prev;
            return [...prev, m].slice(-300);
          });
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [sb, roomSlug]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    setErr("");
    const u = username.trim();
    const t = text.trim();
    if (!t) return;

    setSending(true);
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomSlug, username: u || "Anon", text: t }),
      });

      const j = await res.json();
      if (!j.ok) setErr(j.error || "Gönderilemedi");
      else setText("");
    } catch (e: any) {
      setErr(e?.message || "Hata");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>EnglishMeter • Genel Sohbet</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Kurallar: Saygı + spam yok. (Anon nick ile giriş)
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>Nick</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
        <button
          onClick={() => {
            const n = "Anon" + Math.floor(Math.random() * 9000 + 1000);
            setUsername(n);
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Rastgele
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          height: "60vh",
          overflowY: "auto",
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.15)",
          padding: 12,
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              <b style={{ opacity: 0.95 }}>{m.username}</b>{" "}
              <span>
                • {new Date(m.created_at).toLocaleString("tr-TR")}
              </span>
            </div>
            <div style={{ fontSize: 15, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {err ? (
        <div style={{ marginTop: 10, color: "crimson", fontSize: 13 }}>{err}</div>
      ) : null}

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Mesaj yaz… (Enter gönderir)"
          maxLength={300}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
        <button
          onClick={send}
          disabled={sending}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: sending ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {sending ? "Gönderiliyor…" : "Gönder"}
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        İpucu: İstersen “YDS / Speaking / A1-A2” gibi odalar için roomSlug’ı route ile dinamik yaparız.
      </div>
    </div>
  );
}
