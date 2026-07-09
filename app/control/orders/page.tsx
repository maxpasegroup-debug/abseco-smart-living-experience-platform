"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  _id: string;
  order_number: string;
  lead_id: string;
  proposal_id: string;
  sales_executive?: string;
  status: string;
  amount: number;
  booking_amount: number;
  remaining_amount: number;
  payment_status: string;
  invoice_status: string;
  created_at: string;
};

export default function ControlOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/commerce/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-slate-400">
          Approved proposals converted into booking orders, payments, and invoices.
        </p>
      </div>

      <div className="glass-card overflow-x-auto p-5">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2">Order</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Booking</th>
              <th className="pb-2">Remaining</th>
              <th className="pb-2">Payment</th>
              <th className="pb-2">Invoice</th>
              <th className="pb-2">Sales</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-3">
                  <p className="font-medium text-white">{order.order_number}</p>
                  <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td className="py-3 text-slate-300">{order.status}</td>
                <td className="py-3 text-slate-300">INR {order.amount.toLocaleString()}</td>
                <td className="py-3 text-slate-300">INR {order.booking_amount.toLocaleString()}</td>
                <td className="py-3 text-slate-300">INR {order.remaining_amount.toLocaleString()}</td>
                <td className="py-3 text-slate-300">{order.payment_status}</td>
                <td className="py-3 text-slate-300">{order.invoice_status}</td>
                <td className="py-3 text-slate-300">{order.sales_executive || "-"}</td>
                <td className="py-3">
                  <Link href={`/control/orders/${order._id}`} className="text-xs font-semibold text-[#FF6A00]">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No orders yet.</p>}
      </div>
    </section>
  );
}
