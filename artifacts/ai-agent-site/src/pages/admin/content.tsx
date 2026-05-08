import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { Save, Loader2, CheckCircle, FileText, Megaphone, LayoutTemplate, HelpCircle } from "lucide-react";

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

function Field({ label, value, onChange, placeholder, multiline = false, note }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; note?: string;
}) {
  const cls = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40 resize-none";
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
      {note && <p className="text-xs text-white/30 mt-1">{note}</p>}
    </div>
  );
}

function Toggle({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <div className="text-sm font-medium text-white/80">{label}</div>
        {sub && <div className="text-xs text-white/40 mt-0.5">{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-white/10"}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export default function ContentEditor() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.siteSettings.get().then(s => { setSettings(s); setLoading(false); });
  }, []);

  const set = (key: string) => (val: string) => setSettings(p => ({ ...p, [key]: val }));
  const bool = (key: string) => settings[key] === "true";
  const setBool = (key: string) => (val: boolean) => set(key)(val ? "true" : "false");

  const save = async () => {
    setSaving(true);
    await adminApi.siteSettings.save(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Editor</h1>
        <p className="text-sm text-white/40 mt-0.5">Edit all website text and copy from here</p>
      </div>

      <Section title="Announcement Banner" icon={Megaphone}>
        <Toggle
          label="Show Announcement Banner"
          sub="Displays the top bar strip on the landing page"
          value={bool("announcementEnabled")}
          onChange={setBool("announcementEnabled")}
        />
        <Field
          label="Banner Text"
          value={settings.announcementText ?? ""}
          onChange={set("announcementText")}
          placeholder="Now Live · DiGiCo AI Support on WhatsApp"
        />
      </Section>

      <Section title="Hero Section" icon={LayoutTemplate}>
        <Field
          label="Main Headline"
          value={settings.heroHeadline ?? ""}
          onChange={set("heroHeadline")}
          placeholder="AI Powered DiGiCo Support on WhatsApp"
        />
        <Field
          label="Subtext / Description"
          value={settings.heroSubtext ?? ""}
          onChange={set("heroSubtext")}
          placeholder="Describe your service..."
          multiline
        />
        <Field
          label="CTA Button Text"
          value={settings.heroCta ?? ""}
          onChange={set("heroCta")}
          placeholder="Get Access"
        />
      </Section>

      <Section title="Section Titles" icon={FileText}>
        <Field label="Features Section Title" value={settings.featuresTitle ?? ""} onChange={set("featuresTitle")} placeholder="Everything you need for DiGiCo mastery" />
        <Field label="Consoles Section Title" value={settings.consolesTitle ?? ""} onChange={set("consolesTitle")} placeholder="Supported DiGiCo Consoles" />
        <Field label="FAQ Section Title" value={settings.faqTitle ?? ""} onChange={set("faqTitle")} placeholder="Frequently Asked Questions" />
      </Section>

      <Section title="Contact & Support" icon={HelpCircle}>
        <Field label="Support Email" value={settings.contactEmail ?? ""} onChange={set("contactEmail")} placeholder="support@hitechaudio.com" />
        <Field label="Support Hours" value={settings.supportHours ?? ""} onChange={set("supportHours")} placeholder="24/7 AI Support" />
        <Field label="Footer Tagline" value={settings.footerTagline ?? ""} onChange={set("footerTagline")} placeholder="AI-powered DiGiCo console support" />
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
        {saved ? "Content Saved!" : "Save All Content"}
      </button>
    </div>
  );
}
