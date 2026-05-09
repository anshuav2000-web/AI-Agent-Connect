import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { BookOpen, Plus, Trash2, Save, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem { q: string; a: string; }

export default function KnowledgePage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const DEFAULT_FAQS: FaqItem[] = [
    { q: "What DiGiCo consoles are supported?", a: "All major DiGiCo models including Quantum7, Quantum5, SD12, SD10, SD9, SD7, SD5, S21, and Infinity series." },
    { q: "Is this an official DiGiCo service?", a: "HiTech AI is an independent AI support service, not affiliated with DiGiCo. We are authorised DiGiCo specialists." },
    { q: "How fast is the response time?", a: "The AI responds instantly 24/7. For complex issues requiring human escalation, our team responds within 2 hours." },
    { q: "Can I get support mid-show?", a: "Absolutely. Our AI is optimised for live environment troubleshooting — fast, precise, no fluff." },
    { q: "How do I get access?", a: "Fill in the access request form on our website. We review all requests and grant access within 24 hours." },
  ];

  useEffect(() => {
    adminApi.siteSettings.get().then(s => {
      try {
        const parsed = s.faqItems ? JSON.parse(s.faqItems) : DEFAULT_FAQS;
        setFaqs(Array.isArray(parsed) ? parsed : DEFAULT_FAQS);
      } catch { setFaqs(DEFAULT_FAQS); }
      setLoading(false);
    });
  }, []);

  const update = (i: number, field: keyof FaqItem, val: string) =>
    setFaqs(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const add = () => setFaqs(p => [...p, { q: "", a: "" }]);
  const remove = (i: number) => setFaqs(p => p.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    await adminApi.siteSettings.save({ faqItems: JSON.stringify(faqs) });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Knowledge Base</h1>
          <p className="text-sm text-white/40 mt-0.5">Edit FAQ items displayed on the website</p>
        </div>
        <button
          onClick={add}
          className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={15} /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <span className="flex-1 text-sm font-medium text-white truncate">{faq.q || "New FAQ item"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); remove(i); }}
                  className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} />
                </button>
                {expanded === i ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-5 pb-5 space-y-3 border-t border-white/5">
                <div className="pt-4">
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Question</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={e => update(i, "q", e.target.value)}
                    placeholder="What is your question?"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Answer</label>
                  <textarea
                    rows={4}
                    value={faq.a}
                    onChange={e => update(i, "a", e.target.value)}
                    placeholder="Write the answer..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/40 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
          <BookOpen size={14} className="text-emerald-400" /> Summary
        </h3>
        <div className="text-sm text-white/40">{faqs.length} FAQ items configured and will appear on the website.</div>
      </div>

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
        {saved ? "Knowledge Base Saved!" : "Save Knowledge Base"}
      </button>
    </div>
  );
}
