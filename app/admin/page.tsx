"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Trash2, RefreshCw } from "lucide-react";

type Msg = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied" | "spam";
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [adminKey, setAdminKey] = useState("");
  const [items, setItems] = useState<Msg[]>([]);
  const [status, setStatus] = useState<"all" | Msg["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const filtered = useMemo(() => {
    if (status === "all") return items;
    return items.filter((x) => x.status === status);
  }, [items, status]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/messages?status=${status}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const setMsgStatus = async (id: string, st: Msg["status"]) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id, status: st }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setItems((prev) => prev.map((x) => (x.id === id ? data.item : x)));
    } catch (e: any) {
      alert(e?.message || "Error");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(e?.message || "Error");
    }
  };

  useEffect(() => {
    if (adminKey) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin • Contact Messages</h1>

        <div className="bg-white rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            className="w-full sm:w-80 px-4 py-3 rounded-xl border bg-gray-50"
            placeholder="ADMIN_KEY"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />

          <select
            className="px-4 py-3 rounded-xl border bg-gray-50"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="spam">Spam</option>
          </select>

          <button
            onClick={load}
            disabled={!adminKey || loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-black text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {err && <p className="text-red-600 font-semibold">{err}</p>}
        </div>

        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{m.name} <span className="text-gray-500 font-semibold">({m.email})</span></p>
                  <p className="text-gray-500 text-sm">{new Date(m.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMsgStatus(m.id, "read")}
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => setMsgStatus(m.id, "replied")}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Replied
                  </button>
                  <button
                    onClick={() => setMsgStatus(m.id, "spam")}
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    Spam
                  </button>
                  <button
                    onClick={() => del(m.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-gray-800">{m.message}</p>

              <div className="mt-4 text-sm">
                <span className="font-bold">Status:</span>{" "}
                <span className="px-2 py-1 rounded-lg bg-gray-100">{m.status}</span>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <div className="text-gray-500 bg-white border rounded-2xl p-8 text-center">
              No messages.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}