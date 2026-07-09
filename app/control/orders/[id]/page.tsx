"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderDetails = {
  order?: {
    _id: string;
    order_number: string;
    lead_id: string;
    proposal_id: string;
    customer_id?: string;
    sales_executive?: string;
    status: string;
    amount: number;
    booking_amount: number;
    remaining_amount: number;
    payment_status: string;
    invoice_status: string;
    package_name?: string;
  };
  payments?: Array<{ _id: string; provider: string; amount: number; status: string; reference?: string; created_at: string }>;
  invoice?: { invoice_number: string; status: string; download_url?: string };
  receipts?: Array<{ _id: string; receipt_number: string; amount: number; status: string }>;
  timeline?: Array<{ _id: string; title: string; event_name: string; created_at: string }>;
};

export default function ControlOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [details, setDetails] = useState<OrderDetails>({});

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/commerce/orders/${params.id}`)
      .then((response) => response.json())
      .then((data) => setDetails(data))
      .catch(() => setDetails({}));
  }, [params?.id]);

  const order = details.order;

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Order Details</h1>
        <p className="mt-1 text-sm text-slate-400">
          Payment, invoice, receipt, proposal, and sales timeline.
        </p>
      </div>

      <div className="glass-card space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{order?.order_number || "Order"}</h2>
            <p className="text-xs text-slate-500">{order?.package_name || "Smart Home Package"}</p>
          </div>
          {order?._id && (
            <Link href={`/checkout/${order._id}`} className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white">
              Checkout
            </Link>
          )}
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-4">
          <p><span className="text-slate-500">Status</span><br />{order?.status || "-"}</p>
          <p><span className="text-slate-500">Payment</span><br />{order?.payment_status || "-"}</p>
          <p><span className="text-slate-500">Invoice</span><br />{order?.invoice_status || "-"}</p>
          <p><span className="text-slate-500">Sales</span><br />{order?.sales_executive || "-"}</p>
          <p><span className="text-slate-500">Amount</span><br />INR {order?.amount?.toLocaleString() || 0}</p>
          <p><span className="text-slate-500">Booking</span><br />INR {order?.booking_amount?.toLocaleString() || 0}</p>
          <p><span className="text-slate-500">Remaining</span><br />INR {order?.remaining_amount?.toLocaleString() || 0}</p>
          <p><span className="text-slate-500">Proposal</span><br />{order?.proposal_id || "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Payments</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.payments || []).map((payment) => (
              <p key={payment._id}>{payment.provider} | INR {payment.amount.toLocaleString()} | {payment.status}</p>
            ))}
            {(details.payments || []).length === 0 && <p className="text-slate-500">No payments yet.</p>}
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Invoice</h2>
          <p className="mt-3 text-xs text-slate-300">
            {details.invoice?.invoice_number || "Not generated"} | {details.invoice?.status || "-"}
          </p>
          {details.invoice?.download_url && (
            <a href={details.invoice.download_url} className="mt-3 block text-xs font-semibold text-[#FF6A00]">
              Download
            </a>
          )}
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Receipts</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {(details.receipts || []).map((receipt) => (
              <p key={receipt._id}>{receipt.receipt_number} | INR {receipt.amount.toLocaleString()}</p>
            ))}
            {(details.receipts || []).length === 0 && <p className="text-slate-500">No receipts yet.</p>}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Timeline</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {(details.timeline || []).map((item) => (
            <p key={item._id}>{new Date(item.created_at).toLocaleString()} | {item.title}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
