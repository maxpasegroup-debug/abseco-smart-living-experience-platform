"use client";

import { useEffect, useState } from "react";

type PartnerRow = {
  partner: string;
  partner_id: string;
  leads: number;
  sales: number;
  commission: number;
};

type AdminPartnerResponse = {
  totalPartners: number;
  leadsByPartner: number;
  conversions: number;
  commissionPayable: number;
  rows: PartnerRow[];
};

export default function AdminPartnersPage() {
  const [data, setData] = useState<AdminPartnerResponse | null>(null);

  useEffect(() => {
    fetch("/api/admin/partners")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">BGOS Partner Engine</h1>
      <p className="text-sm text-slate-300">
        Admin visibility into partner onboarding, lead attribution, conversions, and commission payable.
      </p>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Total Partners</p>
          <p className="mt-1 text-xl font-semibold">{data?.totalPartners ?? "-"}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Leads by Partner</p>
          <p className="mt-1 text-xl font-semibold">{data?.leadsByPartner ?? "-"}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Conversions</p>
          <p className="mt-1 text-xl font-semibold">{data?.conversions ?? "-"}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400">Commission Payable</p>
          <p className="mt-1 text-xl font-semibold">
            ₹{typeof data?.commissionPayable === "number" ? data.commissionPayable.toLocaleString("en-IN") : "-"}
          </p>
        </div>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <p className="text-sm font-semibold">Partner | Leads | Sales | Commission</p>
        <table className="mt-3 min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2">Partner</th>
              <th className="pb-2">Leads</th>
              <th className="pb-2">Sales</th>
              <th className="pb-2">Commission</th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((row) => (
              <tr key={row.partner_id} className="border-t border-white/10">
                <td className="py-2">
                  {row.partner}
                  <span className="ml-2 text-xs text-slate-400">{row.partner_id}</span>
                </td>
                <td className="py-2">{row.leads}</td>
                <td className="py-2">{row.sales}</td>
                <td className="py-2">₹{row.commission.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
