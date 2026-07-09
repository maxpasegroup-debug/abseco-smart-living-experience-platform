import { phoneSchema } from "@/lib/validation";

type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const store = new Map<string, OtpRecord>();
const OTP_TTL_MS = 5 * 60 * 1000;

export function issueOtp(phone: string) {
  const normalized = phoneSchema.parse(phone).replace(/\D/g, "");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  store.set(normalized, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  return { phone: normalized, code, expiresAt: Date.now() + OTP_TTL_MS };
}

export function verifyOtp(phone: string, code: string) {
  const normalized = phoneSchema.parse(phone).replace(/\D/g, "");
  const record = store.get(normalized);
  if (!record || record.expiresAt <= Date.now()) {
    store.delete(normalized);
    return false;
  }
  record.attempts += 1;
  if (record.attempts > 5) {
    store.delete(normalized);
    return false;
  }
  const valid = record.code === code;
  if (valid) store.delete(normalized);
  return valid;
}
