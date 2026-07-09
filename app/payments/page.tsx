"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentData = {
  orders?: Array<{ _id: string; order_number: string; payment_status: string; booking_amount: number; remaining_amount: number }>;
  payments?: Array<{ _id: string; provider: string; amount: number; status: string; created_at: string }>;
  invoices?: Array<{ _id: string; invoice_number: string; status: string; download_url?: string }>;
  receipts?: Array<{ _id: string; receipt_number: string; amount: number; status: string }>;
};

export default function MyPaymentsPage() {
  const [data, setData] = useState<PaymentData>({});

  useEffect(() => {
    fetch("/api/customer/payments")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch(() => setData({}));
  }, []);

  const currentOrder = data.orders?.[0];

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">My Payments</h1>
        <p className="mt-1 text-sm text-slate-400">Booking paid, remaining amount, invoices, receipts, and payment history.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Booking Paid</p>
          <p className="mt-2 text-2xl font-semibold text-white">{currentOrder?.payment_status === "paid" ? "Yes" : "No"}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Remaining</p>
          <p className="mt-2 text-2xl font-semibold text-white">INR {currentOrder?.remaining_amount?.toLocaleString() || 0}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming</p>
          <p className="mt-2 text-2xl font-semibold text-white">Final balance</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Payment History</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {(data.payments || []).map((payment) => (
            <p key={payment._id}>{payment.provider} | INR {payment.amount.toLocaleString()} | {payment.status}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Invoices</h2>
          {(data.invoices || []).map((invoice) => (
            <Link key={invoice._id} href={invoice.download_url || "#"} className="mt-2 block text-xs text-slate-300">
              {invoice.invoice_number} | {invoice.status}
            </Link>
          ))}
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Receipts</h2>
          {(data.receipts || []).map((receipt) => (
            <p key={receipt._id} className="mt-2 text-xs text-slate-300">{receipt.receipt_number} | INR {receipt.amount.toLocaleString()}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
