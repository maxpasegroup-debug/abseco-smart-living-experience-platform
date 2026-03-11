"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DeviceOverlay = {
  id: string;
  label: string;
  x: number;
  y: number;
  on: boolean;
  icon: string;
};

const initialDevices: DeviceOverlay[] = [
  { id: "switch", label: "Smart Switch", x: 15, y: 25, on: false, icon: "●" },
  { id: "light", label: "Light Strip", x: 70, y: 20, on: false, icon: "◆" },
  { id: "camera", label: "Camera", x: 75, y: 55, on: false, icon: "◉" },
  { id: "speaker", label: "Speaker", x: 20, y: 60, on: false, icon: "♪" }
];

export function CameraExperiencePanel() {
  const [permission, setPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [devices, setDevices] = useState<DeviceOverlay[]>(initialDevices);
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermission("granted");
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setPermission("denied");
    }
  }, []);

  const toggleDevice = useCallback((id: string, on: boolean) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, on } : d))
    );
  }, []);

  const anyOn = devices.some((d) => d.on);

  return (
    <div className="space-y-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/80 shadow-card-lift">
        {/* Subtle particle-style ambient overlay when devices are on */}
        <AnimatePresence>
          {anyOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,106,0,0.06) 0%, transparent 60%)"
              }}
            />
          )}
        </AnimatePresence>

        {permission === "prompt" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#020617]/98 p-8"
          >
            <p className="text-center font-light text-slate-400">
              See smart devices in your space
            </p>
            <motion.button
              type="button"
              onClick={requestCamera}
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255, 106, 0, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-[#FF6A00] px-8 py-4 font-display text-sm font-medium text-white shadow-[0_0_24px_rgba(255,106,0,0.4)]"
            >
              Allow Camera
            </motion.button>
          </motion.div>
        )}
        {permission === "denied" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#020617]/98 p-8"
          >
            <p className="text-center text-slate-400">Camera access was denied.</p>
            <motion.button
              type="button"
              onClick={() => setPermission("prompt")}
              whileHover={{ scale: 1.02 }}
              className="rounded-full border border-white/30 px-6 py-3 text-sm"
            >
              Try again
            </motion.button>
          </motion.div>
        )}
        {(permission === "granted" || permission === "denied") && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
            {permission === "denied" && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3)"
                }}
              />
            )}
            {devices.map((device) => (
              <motion.div
                key={device.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  boxShadow: device.on
                    ? "0 0 32px rgba(255, 106, 0, 0.45), 0 0 60px rgba(255, 106, 0, 0.15)"
                    : "0 0 0 1px rgba(255,255,255,0.1)",
                  borderColor: device.on ? "rgba(255, 106, 0, 0.6)" : "rgba(255,255,255,0.2)"
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute rounded-2xl border bg-slate-900/90 px-4 py-3 backdrop-blur-md"
                style={{
                  left: `${device.x}%`,
                  top: `${device.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-white">
                  {device.label}
                </p>
                <div className="mt-2 flex gap-2">
                  <motion.button
                    type="button"
                    onClick={() => toggleDevice(device.id, true)}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: device.on
                        ? "0 0 16px rgba(255, 106, 0, 0.5)"
                        : "none"
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      device.on
                        ? "bg-[#FF6A00] text-white"
                        : "bg-white/10 text-slate-400 hover:bg-white/20"
                    }`}
                  >
                    ON
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => toggleDevice(device.id, false)}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      !device.on
                        ? "bg-slate-600 text-white"
                        : "bg-white/5 text-slate-500 hover:bg-white/10"
                    }`}
                  >
                    OFF
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
      <p className="text-center text-sm font-light text-slate-500">
        Tap ON / OFF to see your space come to life.
      </p>
    </div>
  );
}
