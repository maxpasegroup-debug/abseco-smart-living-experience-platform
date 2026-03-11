/**
 * ABSECO WhatsApp Sales Engine — Provider abstraction
 * Supports: Meta WhatsApp Cloud API, Twilio, Gupshup, MSG91
 * Configure via env: WHATSAPP_PROVIDER, WHATSAPP_API_KEY, WHATSAPP_PHONE_ID, etc.
 */

export type WhatsAppProvider = "meta" | "twilio" | "gupshup" | "msg91";

export type SendMessageOptions = {
  to: string;
  message: string;
  media_url?: string;
  media_type?: "image" | "video" | "document";
};

export type SendResult = { ok: boolean; message_id?: string; error?: string };

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function sendWhatsAppMessage(options: SendMessageOptions): Promise<SendResult> {
  const provider = (process.env.WHATSAPP_PROVIDER || "meta") as WhatsAppProvider;
  const to = normalizePhone(options.to);

  switch (provider) {
    case "meta":
      return sendViaMeta(to, options);
    case "twilio":
      return sendViaTwilio(to, options);
    case "gupshup":
      return sendViaGupshup(to, options);
    case "msg91":
      return sendViaMsg91(to, options);
    default:
      return sendViaMeta(to, options);
  }
}

async function sendViaMeta(to: string, options: SendMessageOptions): Promise<SendResult> {
  const token = process.env.WHATSAPP_API_KEY || process.env.META_WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID || process.env.META_WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    return { ok: false, error: "Meta WhatsApp token or phone_id not configured." };
  }
  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
  const body: Record<string, unknown> = {
    messaging_product: "whatsapp",
    to: to.replace(/^91/, ""),
    type: "text",
    text: { body: options.message }
  };
  if (options.media_url && options.media_type) {
    body.type = options.media_type;
    body[options.media_type] = { link: options.media_url };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (data as { error?: { message?: string } }).error?.message || res.statusText };
    return { ok: true, message_id: (data as { messages?: { id?: string }[] }).messages?.[0]?.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function sendViaTwilio(to: string, options: SendMessageOptions): Promise<SendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!accountSid || !authToken || !from) {
    return { ok: false, error: "Twilio credentials not configured." };
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: `whatsapp:${to}`,
    From: from,
    Body: options.message
  });
  if (options.media_url) body.set("MediaUrl", options.media_url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64")
      },
      body: body.toString()
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (data as { message?: string }).message || res.statusText };
    return { ok: true, message_id: (data as { sid?: string }).sid };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function sendViaGupshup(to: string, options: SendMessageOptions): Promise<SendResult> {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const appName = process.env.GUPSHUP_APP_NAME;
  if (!apiKey || !appName) {
    return { ok: false, error: "Gupshup API key or app name not configured." };
  }
  const url = "https://api.gupshup.io/sm/api/v1/msg";
  const body = {
    channel: "whatsapp",
    source: appName,
    destination: to,
    message: { type: "text", text: options.message }
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: apiKey },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (data as { message?: string }).message || res.statusText };
    return { ok: true, message_id: (data as { messageId?: string }).messageId };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function sendViaMsg91(to: string, options: SendMessageOptions): Promise<SendResult> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const sender = process.env.MSG91_WHATSAPP_SENDER;
  if (!authKey || !sender) {
    return { ok: false, error: "MSG91 auth key or sender not configured." };
  }
  const url = "https://api.msg91.com/api/v5/flow/";
  const body = {
    template_id: process.env.MSG91_TEMPLATE_ID || "default",
    short_url: "0",
    recipients: [{ whatsappNumber: to }],
    data: { message: options.message }
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "authkey": authKey },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (data as { message?: string }).message || res.statusText };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
