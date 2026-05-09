import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [bars] = useState(() => Array.from({ length: 28 }, (_, i) => ({
    delay: i * 40,
    height: 20 + Math.random() * 60,
    speed: 300 + Math.random() * 400,
  })));

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-500 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[120px] pointer-events-none" />

      <div className={`relative flex flex-col items-center gap-8 transition-all duration-500 ${phase === "in" ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"}`}>
        {/* Logo mark */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#gr)" strokeWidth="1.5" />
              <path d="M10 20 Q14 12 20 20 Q26 28 30 20" stroke="url(#gr)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl border border-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        {/* Brand */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white tracking-tight">
            HiTech <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </div>
          <div className="text-sm text-white/40 mt-1 tracking-widest uppercase">DiGiCo Support</div>
        </div>

        {/* Audio waveform bars */}
        <div className="flex items-end gap-1 h-10">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 opacity-80"
              style={{
                height: `${bar.height}%`,
                animation: `splashBar ${bar.speed}ms ease-in-out infinite alternate`,
                animationDelay: `${bar.delay}ms`,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      <style>{`
        @keyframes splashBar {
          from { transform: scaleY(0.3); opacity: 0.4; }
          to { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
