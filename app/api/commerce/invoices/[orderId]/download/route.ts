import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { Invoice } from "@/lib/models/Invoice";

export async function GET(_request: NextRequest, { params }: { params: { orderId: string } }) {
  await connectDb();
  const invoice = await Invoice.findOne({ order_id: params.orderId });
  const body =
    `ABSECO Invoice\n\n` +
    `Invoice: ${invoice?.invoice_number || "Pending"}\n` +
    `Order: ${params.orderId}\n` +
    `Amount: INR ${invoice?.amount || 0}\n` +
    `Booking: INR ${invoice?.booking_amount || 0}\n` +
    `Remaining: INR ${invoice?.remaining_amount || 0}\n`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${invoice?.invoice_number || "abseco-invoice"}.txt"`
    }
  });
}
