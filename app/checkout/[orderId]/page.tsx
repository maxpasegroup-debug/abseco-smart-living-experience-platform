"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type CheckoutData = {
  order?: {
    _id: string;
    order_number: string;
    amount: number;
    booking_amount: number;
    remaining_amount: number;
    payment_status: string;
    package_name?: string;
  };
  summary?: {
    orderAmount: number;
    bookingAmount: number;
    remainingAmount: number;
    gstAmount: number;
    discountAmount: number;
    payableAmount: number;
    currency: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: (response: Record<string, unknown>) => void): void;
    };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const params = useParams<{ orderId: string }>();
  const [data, setData] = useState<CheckoutData>({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.orderId) return;
    const token = new URLSearchParams(window.location.search).get("token");
    setCheckoutToken(token);
    const tokenQuery = token ? `&checkout_token=${encodeURIComponent(token)}` : "";
    fetch(`/api/commerce/checkout?order_id=${encodeURIComponent(params.orderId)}${tokenQuery}`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch(() => setMessage("Unable to load checkout."));
  }, [params?.orderId]);

  async function startCheckout() {
    if (!accepted) {
      setMessage("Please accept the terms before continuing.");
      return;
    }
    setLoading(true);
    setMessage(null);
    fetch("/api/customer/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "payment_click", metadata: { order_id: params.orderId } })
    }).catch(() => {});
    try {
      const response = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: params.orderId, terms_accepted: accepted, checkout_token: checkoutToken || undefined })
      });
      const checkout = await response.json();
      if (!response.ok) {
        setMessage(checkout.error?.message || "Unable to create payment.");
        return;
      }
      const loaded = await loadRazorpay();
      const Razorpay = window.Razorpay;
      if (!loaded || !checkout.providerOrder?.keyId || !Razorpay) {
        setMessage("Payment gateway is not available. Please contact ABSECO.");
        return;
      }
      const razorpay = new Razorpay({
        key: checkout.providerOrder.keyId,
        amount: checkout.providerOrder.amount * 100,
        currency: checkout.providerOrder.currency,
        name: "ABSECO",
        description: `Booking for ${checkout.order.order_number}`,
        order_id: checkout.providerOrder.providerOrderId,
        handler: async (payment: Record<string, string>) => {
          const verify = await fetch("/api/commerce/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payment, checkout_token: checkoutToken || undefined })
          });
          const result = await verify.json();
          if (!verify.ok) {
            setMessage(result.error?.message || "Payment verification failed.");
            return;
          }
          setMessage("Payment verified. Invoice and receipt generated.");
          setData((prev) => ({
            ...prev,
            order: result.order || prev.order
          }));
        },
        modal: {
          ondismiss: () => setMessage("Payment window closed. You can retry anytime.")
        }
      });
      razorpay.on("payment.failed", async (failure) => {
        await fetch("/api/commerce/payments/failure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: params.orderId,
            checkout_token: checkoutToken || undefined,
            reason: String((failure.error as { description?: string } | undefined)?.description || "Payment failed."),
            raw_response: failure
          })
        }).catch(() => {});
        setMessage("Payment failed. You can retry from this checkout page.");
      });
      razorpay.open();
    } finally {
      setLoading(false);
    }
  }

  const order = data.order;
  const summary = data.summary;

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Checkout</h1>
        <p className="mt-1 text-sm text-slate-400">Pay the booking amount to confirm your ABSECO order.</p>
      </div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Order</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{order?.order_number || "Loading"}</h2>
            <p className="text-sm text-slate-400">{order?.package_name || "Smart Home Package"}</p>
          </div>
          <p className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {order?.payment_status || "pending"}
          </p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-slate-500">Order amount</span>
            <br />
            INR {summary?.orderAmount?.toLocaleString() || 0}
          </p>
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-slate-500">Booking amount</span>
            <br />
            INR {summary?.bookingAmount?.toLocaleString() || 0}
          </p>
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-slate-500">GST</span>
            <br />
            INR {summary?.gstAmount?.toLocaleString() || 0}
          </p>
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-slate-500">Remaining</span>
            <br />
            INR {summary?.remainingAmount?.toLocaleString() || 0}
          </p>
        </div>

        <label className="flex items-start gap-3 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1"
          />
          I accept the booking terms and understand that the remaining amount is payable as per the final ABSECO order schedule.
        </label>

        {message && <p className="text-xs text-slate-300">{message}</p>}

        <button
          type="button"
          disabled={loading || order?.payment_status === "paid"}
          onClick={startCheckout}
          className="w-full rounded-full bg-[#FF6A00] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Preparing payment..." : order?.payment_status === "paid" ? "Booking Paid" : "Pay Booking Amount"}
        </button>
      </div>
    </section>
  );
}
