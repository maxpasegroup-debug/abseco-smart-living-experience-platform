"use client";

import { FormEvent, useEffect, useState } from "react";

type Template = {
  _id: string;
  name: string;
  title: string;
  body: string;
  category?: string;
  channel: string;
  status: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => setTemplates([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, body, category, channel: "whatsapp" })
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates((prev) => [data.template, ...prev]);
        setName("");
        setTitle("");
        setBody("");
        setCategory("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">WhatsApp Templates</h1>
        <p className="text-sm text-slate-300">
          Store and reuse high-performing messages for welcomes, consultations and offers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Create template
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Internal name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-400">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-400">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="welcome / consultation / offer"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-1 rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save template"}
        </button>
      </form>

      <div className="glass-card p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Saved templates
        </p>
        <div className="mt-3 space-y-3 text-xs">
          {templates.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <p className="font-semibold text-slate-100">{t.name}</p>
              <p className="text-[11px] text-slate-400">{t.title}</p>
              <p className="mt-2 whitespace-pre-wrap text-slate-200">{t.body}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {t.channel} · {t.category || "uncategorized"} · {t.status}
              </p>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-xs text-slate-500">No templates yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

