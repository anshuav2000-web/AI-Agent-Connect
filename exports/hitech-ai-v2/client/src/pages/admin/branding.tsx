import { useState, useEffect, useRef } from "react";
import { adminApi } from "@/lib/admin-api";
import { Save, Loader2, CheckCircle, Palette, Image, Type, ExternalLink } from "lucide-react";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
        <Icon size={16} className="text-emerald-400" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, note }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; note?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      <input
        type="text" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40"
      />
      {note && <p className="text-xs text-white/30 mt-1">{note}</p>}
    </div>
  );
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi.siteSettings.get().then(s => { setSettings(s); setLoading(false); });
  }, []);

  const set = (key: string) => (val: string) => setSettings(p => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    await adminApi.siteSettings.save(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const logoUrl = settings.logoUrl ?? "";
  const logoText = settings.logoText ?? "HiTech AI";
  const siteName = settings.siteName ?? "HiTech AI";
  const tagline = settings.tagline ?? "AI Powered DiGiCo Support on WhatsApp";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Logo & Branding</h1>
        <p className="text-sm text-white/40 mt-0.5">Customise your brand identity across the site</p>
      </div>

      {/* Live preview */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <ExternalLink size={16} className="text-emerald-400" />
          Live Preview
        </h2>
        <div className="flex items-center gap-4 p-4 bg-[#030712] rounded-xl border border-white/5">
          {/* Logo preview */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl && !previewError ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <span className="text-emerald-400 font-bold text-lg">{logoText.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{siteName}</div>
            <div className="text-xs text-white/40">{tagline}</div>
          </div>
        </div>
        <p className="text-xs text-white/30 mt-3">This is how your logo + brand name appears in the navigation bar.</p>
      </div>

      <Section title="Logo" icon={Image}>
        <Field
          label="Logo Image URL"
          value={logoUrl}
          onChange={(v) => { set("logoUrl")(v); setPreviewError(false); }}
          placeholder="https://yourdomain.com/logo.png"
          note="Use a PNG or SVG with transparent background. Recommended: 128×128px minimum."
        />
        <Field
          label="Logo Fallback Letter / Short Name"
          value={logoText}
          onChange={set("logoText")}
          placeholder="HiTech AI"
          note="Shown when no logo URL is set, or if the image fails to load."
        />
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400/80">
          Tip: host your logo on a CDN (e.g. Cloudinary, ImgBB, or your own server) and paste the direct link above.
        </div>
      </Section>

      <Section title="Site Identity" icon={Type}>
        <Field label="Brand Name" value={siteName} onChange={set("siteName")} placeholder="HiTech AI" />
        <Field label="Tagline / Sub-brand" value={tagline} onChange={set("tagline")} placeholder="AI Powered DiGiCo Support on WhatsApp" />
      </Section>

      <Section title="Colour Scheme" icon={Palette}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Primary Accent", key: "colorPrimary", def: "#10b981" },
            { label: "Secondary Accent", key: "colorSecondary", def: "#06b6d4" },
          ].map(({ label, key, def }) => {
            const val = settings[key] ?? def;
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={val}
                    onChange={e => set(key)(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={val}
                    onChange={e => set(key)(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-1">
          <div className="h-8 flex-1 rounded-lg" style={{ background: `linear-gradient(135deg, ${settings.colorPrimary ?? "#10b981"}, ${settings.colorSecondary ?? "#06b6d4"})` }} />
          <span className="text-xs text-white/30 self-center">Gradient preview</span>
        </div>
      </Section>

      <button
        onClick={save}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? "Branding Saved!" : "Save Branding"}
      </button>
    </div>
  );
}
