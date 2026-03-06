export type WhatsAppBot = "RIO" | "TARA" | "NEXA";

export type WhatsAppPayload = {
  to: string;
  message: string;
  context?: Record<string, string>;
};

const endpointMap: Record<WhatsAppBot, string> = {
  RIO: process.env.WHATSAPP_RIO_ENDPOINT || "",
  TARA: process.env.WHATSAPP_TARA_ENDPOINT || "",
  NEXA: process.env.WHATSAPP_NEXA_ENDPOINT || ""
};

export async function dispatchWhatsApp(bot: WhatsAppBot, payload: WhatsAppPayload) {
  const endpoint = endpointMap[bot];
  if (!endpoint) {
    return { ok: false, reason: `${bot} endpoint is not configured.` };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_API_KEY || ""}`
    },
    body: JSON.stringify(payload)
  });

  return {
    ok: response.ok,
    status: response.status
  };
}
