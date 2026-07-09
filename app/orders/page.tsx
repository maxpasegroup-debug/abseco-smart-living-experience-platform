"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrderTimeline } from "@/components/showroom/OrderTimeline";

type Order = {
  _id: string;
  order_number: string;
  status: string;
  payment_status: string;
  booking_amount: number;
  remaining_amount: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/commerce/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-12 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl font-semibold tracking-tight text-white"
      >
        Orders
      </motion.h1>
      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order._id} href={`/checkout/${order._id}`} className="glass-card block p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{order.order_number}</p>
                  <p className="text-xs text-slate-400">{order.status} | {order.payment_status}</p>
                </div>
                <p className="text-xs text-slate-300">
                  Booking INR {order.booking_amount.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <OrderTimeline />
      <Link href="/orders/plan" className="block">
        <motion.span
          whileHover={{ scale: 1.01, boxShadow: "0 0 24px rgba(59, 130, 246, 0.25)" }}
          whileTap={{ scale: 0.99 }}
          className="inline-block w-full rounded-full border border-white/20 bg-white/5 py-4 text-center font-display text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
        >
          View My Smart Home Plan
        </motion.span>
      </Link>
    </div>
  );
}
