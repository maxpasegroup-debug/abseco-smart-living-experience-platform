import { connectDb } from "@/lib/db/connect";
import { MessageQueue } from "@/lib/models/MessageQueue";
import { apiOk, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    await connectDb();
    const pending = await MessageQueue.countDocuments({ status: "pending" });
    return apiOk({ pending });
  } catch (e) {
    return handleApiError(e);
  }
}
