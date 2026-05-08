import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Construction size={24} className="text-white/30" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white/60">{title}</h2>
        <p className="text-sm text-white/30 mt-1">Coming soon</p>
      </div>
    </div>
  );
}
