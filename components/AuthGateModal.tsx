"use client";

import { PrimaryButton } from "@/ui/PrimaryButton";

type AuthGateModalProps = {
  isOpen: boolean;
  actionLabel: string;
  onClose: () => void;
};

export function AuthGateModal({ isOpen, actionLabel, onClose }: AuthGateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto mt-20 max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold">Sign in to continue</h3>
        <p className="mt-2 text-sm text-slate-300">
          Use OTP login with your phone to {actionLabel}. Google login can be enabled later.
        </p>
        <div className="mt-4 grid gap-2">
          <input
            placeholder="Phone number"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-abseco-orange"
          />
          <PrimaryButton>Send OTP</PrimaryButton>
          <button onClick={onClose} className="text-sm text-slate-400">
            Continue exploring
          </button>
        </div>
      </div>
    </div>
  );
}
