"use client";

import { FormEvent, useEffect, useState } from "react";

type CommerceSettings = {
  booking_mode: "fixed" | "percentage";
  booking_value: number;
  gst_percentage?: number;
  coupons_enabled?: boolean;
  discounts_enabled?: boolean;
};

type Analytics = {
  metrics?: Record<string, number>;
  revenueBySource?: Array<{ _id?: string; orders: number; booking_collected: number }>;
  revenueBySalesExecutive?: Array<{ _id?: string; orders: number; booking_collected: number }>;
};

const metricLabels: Record<string, string> = {
  orders: "Orders",
  booking_amount_collected: "Booking Collected",
  revenue: "Revenue",
  payment_success_pct: "Payment Success",
  payment_failure_pct: "Payment Failure",
  pending_payments: "Pending Payments",
  average_booking: "Average Booking"
};
const currencyMetrics = new Set(["booking_amount_collected", "revenue", "average_booking"]);

export default function ControlCommercePage() {
  const [settings, setSettings] = useState<CommerceSettings | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/commerce/settings")
      .then((response) => response.json())
      .then((data) => setSettings(data.settings || null))
      .catch(() => setSettings(null));
    fetch("/api/commerce/analytics")
      .then((response) => response.json())
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics({}));
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      booking_mode: form.get("booking_mode"),
      booking_value: Number(form.get("booking_value")),
      gst_percentage: Number(form.get("gst_percentage") || 0),
      coupons_enabled: form.get("coupons_enabled") === "on",
      discounts_enabled: form.get("discounts_enabled") === "on"
    };
    const response = await fetch("/api/commerce/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error?.message || "Unable to save settings.");
      return;
    }
    setSettings(data.settings);
    setMessage("Booking settings saved.");
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Commerce</h1>
        <p className="mt-1 text-sm text-slate-400">
          Booking configuration, payment analytics, and revenue performance.
        </p>
      </div>

      <form onSubmit={saveSettings} className="glass-card grid gap-3 p-5 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Booking Mode</label>
          <select
            name="booking_mode"
            defaultValue={settings?.booking_mode || "fixed"}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Booking Value</label>
          <input
            name="booking_value"
            type="number"
            min={0}
            defaultValue={settings?.booking_value || 0}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400">GST %</label>
          <input
            name="gst_percentage"
            type="number"
            min={0}
            max={100}
            defaultValue={settings?.gst_percentage || 0}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input name="coupons_enabled" type="checkbox" defaultChecked={settings?.coupons_enabled} />
          Coupons ready
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input name="discounts_enabled" type="checkbox" defaultChecked={settings?.discounts_enabled} />
          Discounts ready
        </label>
        <button type="submit" className="rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-semibold text-white">
          Save Settings
        </button>
        {message && <p className="text-xs text-slate-300 sm:col-span-3">{message}</p>}
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(analytics.metrics || {}).map(([key, value]) => (
          <div key={key} className="glass-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metricLabels[key] || key}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {key.includes("pct") ? `${value}%` : currencyMetrics.has(key) ? `INR ${value.toLocaleString()}` : value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Revenue by Source</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(analytics.revenueBySource || []).map((item) => (
              <p key={item._id || "unknown"}>{item._id || "Unknown"} | Orders {item.orders} | INR {item.booking_collected.toLocaleString()}</p>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Revenue by Sales Executive</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(analytics.revenueBySalesExecutive || []).map((item) => (
              <p key={item._id || "unknown"}>{item._id || "Unassigned"} | Orders {item.orders} | INR {item.booking_collected.toLocaleString()}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
