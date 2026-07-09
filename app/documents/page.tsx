"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DocumentItem = {
  id: string;
  type: string;
  title: string;
  status: string;
  href: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    fetch("/api/customer/documents")
      .then((response) => response.json())
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]));
  }, []);

  function trackDownload(document: DocumentItem) {
    const eventName = document.type === "invoice" ? "invoice_download" : "document_download";
    fetch("/api/customer/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: eventName, metadata: { type: document.type, id: document.id } })
    }).catch(() => {});
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Document Center</h1>
        <p className="mt-1 text-sm text-slate-400">Proposals, invoices, receipts, and future warranty documents in one place.</p>
      </div>

      <div className="glass-card overflow-x-auto p-5">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2">Document</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="py-3 text-slate-200">{document.title}</td>
                <td className="py-3 text-slate-400">{document.type}</td>
                <td className="py-3 text-slate-400">{document.status}</td>
                <td className="py-3">
                  <Link href={document.href} onClick={() => trackDownload(document)} className="text-xs font-semibold text-[#FF6A00]">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No documents yet.</p>}
      </div>
    </section>
  );
}
