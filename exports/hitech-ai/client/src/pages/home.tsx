import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle, Zap, BookOpen, Radio, Ticket, Search,
  Network, Languages, ChevronRight, ArrowRight, Check,
  Mic2, Volume2, Settings2, Star, ChevronDown, ExternalLink,
  Headphones, Cpu,
} from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  consoleModel: z.string().optional(),
  requirement: z.string().min(10, "Please describe your requirement"),
  referralSource: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

const features = [
  { icon: Zap, title: "AI Troubleshooting Assistant", desc: "Instant diagnosis and fixes for any DiGiCo console issue — from routing errors to Dante networking faults." },
  { icon: MessageCircle, title: "WhatsApp Integrated Support", desc: "Get live AI support directly on WhatsApp. No apps to install — just message and get answers instantly." },
  { icon: Settings2, title: "DiGiCo Workflow Guidance", desc: "Step-by-step guidance for complex workflows: console cloning, show file management, surface control mapping." },
  { icon: Radio, title: "Real-time Console Help", desc: "Ask about any parameter, module, or function on SD Range, Quantum, S Series, or Infinity consoles." },
  { icon: Ticket, title: "Smart Ticket Automation", desc: "Support requests logged and escalated automatically. Never lose track of a critical issue mid-show." },
  { icon: Search, title: "Knowledge Base Search", desc: "Instant AI-powered search across all DiGiCo manuals, firmware notes, and known-issue documentation." },
  { icon: Network, title: "Audio Networking Support", desc: "Dante, MADI, Optocore, SILK — get expert AI help for any DiGiCo digital audio network setup." },
  { icon: Languages, title: "Multi-language Assistance", desc: "Support in multiple languages for live sound engineers and technicians worldwide." },
];

const consoles = [
  "DiGiCo Quantum7", "DiGiCo Quantum5", "DiGiCo Quantum225", "DiGiCo Quantum338",
  "DiGiCo SD12", "DiGiCo SD10", "DiGiCo SD9", "DiGiCo SD7",
  "DiGiCo S21", "DiGiCo S31", "DiGiCo S41", "DiGiCo Infinity",
];

const testimonials = [
  { name: "James K.", role: "FOH Engineer, Stadium Tours", text: "Mid-show panic sorted in 60 seconds. The AI knew exactly which Quantum7 routing matrix was the issue. Lifesaving.", stars: 5 },
  { name: "Maria S.", role: "System Engineer, Broadcast", text: "I use it for Dante troubleshooting daily. No more waiting on hold — the AI walks you through everything step by step.", stars: 5 },
  { name: "Raj P.", role: "Audio Director, Live Events", text: "Our whole crew now uses HiTech AI on WhatsApp before calling support. It handles 90% of the questions instantly.", stars: 5 },
];

const faqs = [
  { q: "Which DiGiCo consoles are supported?", a: "All DiGiCo consoles — SD Range, Quantum series, S Series, Infinity, and all legacy models. Our AI is trained on the full DiGiCo knowledge base." },
  { q: "How does WhatsApp support work?", a: "Once you get access, you receive a WhatsApp number. Simply message your question and our AI responds instantly — text, images, even voice notes." },
  { q: "Is this an official DiGiCo service?", a: "HiTech AI Agent is an independent AI-powered support service built specifically for DiGiCo users. We are not affiliated with DiGiCo UK Ltd." },
  { q: "How fast are responses?", a: "AI responses are instant, typically under 3 seconds. For complex cases requiring human review, our team responds within 1 hour." },
  { q: "Is my data secure?", a: "All conversations are encrypted. We never share your show files or technical data with third parties." },
];

const countries = [
  "United States","United Kingdom","Canada","Australia","Germany","France","India",
  "Singapore","UAE","Saudi Arabia","Brazil","Netherlands","Spain","Japan","South Africa","Other",
];

const referralSources = ["Google","LinkedIn","Facebook","YouTube","Word of Mouth","Audio Forum","Event / Show","Other"];

// Waveform bars animation
function WaveformBars({ count = 32, className = "" }: { count?: number; className?: string }) {
  const [heights, setHeights] = useState(() => Array.from({ length: count }, () => Math.random() * 60 + 20));
  useEffect(() => {
    const t = setInterval(() => setHeights(Array.from({ length: count }, () => Math.random() * 60 + 20)), 120);
    return () => clearInterval(t);
  }, [count]);
  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-100"
          style={{
            height: `${h}%`,
            background: i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#00d4ff" : "#00cc6e",
            opacity: 0.6 + (h / 100) * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// WhatsApp chat preview
function WhatsAppPreview() {
  const messages = [
    { from: "user", text: "Hi! My Quantum7 is showing routing errors on Bus 7-8. Mid-show right now 😰", time: "21:14" },
    { from: "ai", text: "I'm on it. First — go to Busses > Bus 7-8 > check if the Output routing matrix has a duplicate assignment on MADI Ch 7. This causes the conflict you're seeing.", time: "21:14" },
    { from: "user", text: "Found it! Duplicate on MADI 7. Removing now...", time: "21:15" },
    { from: "ai", text: "✅ Perfect. After removing, reset the output gain to 0dB. Your bus should be clean. Let me know if the error clears!", time: "21:15" },
    { from: "user", text: "IT WORKED. You just saved the show. Thank you!! 🙌", time: "21:16" },
  ];
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full">
      <div className="bg-[#00a67e] px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Headphones size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">HiTech AI Support</div>
          <div className="text-xs text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
            Online · AI Active
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                m.from === "user"
                  ? "bg-[#00a67e] text-white rounded-br-sm"
                  : "bg-[#1a2035] text-white/90 rounded-bl-sm border border-white/5"
              }`}
            >
              {m.text}
              <span className={`block text-right mt-0.5 text-[10px] ${m.from === "user" ? "text-white/60" : "text-white/30"}`}>{m.time}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <div className="bg-[#1a2035] border border-white/5 px-3 py-2 rounded-xl rounded-bl-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) { setSubmitted(true); reset(); }
      else toast({ title: "Something went wrong", description: json.error || "Please try again.", variant: "destructive" });
    } catch {
      toast({ title: "Network error", description: "Please check your connection and try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => document.getElementById("get-access")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,136,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.025)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Headphones size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight">HiTech AI</span>
              <span className="text-[10px] text-emerald-400 ml-1.5 font-medium">DiGiCo Support</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#whatsapp" className="hover:text-white transition-colors">WhatsApp</a>
            <a href="#consoles" className="hover:text-white transition-colors">Consoles</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <button onClick={scrollToForm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-sm font-semibold">
            <MessageCircle size={15} /> Get Access
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-emerald-500/6 blur-[130px]" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Now Live · DiGiCo AI Support on WhatsApp
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                AI Powered{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  DiGiCo Support
                </span>{" "}
                on WhatsApp
              </h1>

              <p className="text-lg text-white/55 leading-relaxed mb-8 max-w-xl">
                Instant troubleshooting, console guidance, workflow assistance, and smart audio support — powered by AI, delivered straight to your WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={scrollToForm}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all font-bold text-base shadow-lg shadow-emerald-500/20">
                  Get Access <ArrowRight size={18} />
                </button>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all font-medium">
                  <MessageCircle size={18} className="text-emerald-400" /> Start WhatsApp Support
                </a>
              </div>

              {/* Waveform */}
              <div className="mt-10 flex items-end h-12 gap-0.5 max-w-xs">
                <WaveformBars count={40} className="h-full w-full" />
              </div>
              <p className="text-xs text-white/20 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Live AI engine · processing support requests
              </p>
            </div>

            {/* WhatsApp preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-3xl" />
                <div className="relative">
                  <WhatsAppPreview />
                  {/* Floating badge */}
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/30 animate-bounce">
                    ⚡ AI Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "< 3s", label: "Avg Response Time" },
            { value: "100+", label: "DiGiCo Console Models" },
            { value: "24/7", label: "Always Available" },
            { value: "Multi", label: "Language Support" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Everything a DiGiCo engineer needs</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">AI-powered support built for the real demands of live sound and broadcast.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title}
                className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <f.icon size={17} className="text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5 text-white">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp section */}
      <section id="whatsapp" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 mb-5">
              <MessageCircle size={13} /> WhatsApp AI Support
            </div>
            <h2 className="text-4xl font-bold mb-5">
              Get instant help,<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">mid-show or in rehearsal</span>
            </h2>
            <p className="text-white/50 mb-6 leading-relaxed">
              No ticket portals. No hold music. Just message on WhatsApp and our AI responds instantly — routing issues, MADI errors, Dante config, show file problems, anything.
            </p>
            <ul className="space-y-3">
              {[
                "Instant AI answers, 24/7",
                "Works on any phone or WhatsApp Web",
                "Human escalation when needed",
                "All DiGiCo models and firmware versions",
                "Conversation history saved automatically",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={scrollToForm}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors text-sm font-bold">
              Request Access <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex justify-center">
            <WhatsAppPreview />
          </div>
        </div>
      </section>

      {/* Supported Consoles */}
      <section id="consoles" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic2 size={20} className="text-emerald-400" />
            <h2 className="text-4xl font-bold">Supported Console Models</h2>
          </div>
          <p className="text-white/40 mb-12 text-lg">Full AI support for every console in the DiGiCo lineup.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {consoles.map((c) => (
              <div key={c}
                className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-sm text-white/70 hover:text-white font-medium">
                {c}
              </div>
            ))}
            <div className="px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 font-medium flex items-center justify-center gap-1.5">
              + All legacy models
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-white/40 mb-14 text-lg">Three steps to AI DiGiCo support on your phone.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Request Access", desc: "Fill in the form below with your details and console model. We review and approve within hours." },
              { step: "02", title: "Get Your WhatsApp Link", desc: "Once approved, you receive a WhatsApp link to our AI support agent. Save the number — that's it." },
              { step: "03", title: "Get Instant Support", desc: "Message any DiGiCo question, anytime. The AI responds in seconds with expert guidance." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left">
                <div className="text-5xl font-extrabold text-white/8 mb-4">{item.step}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <h2 className="text-4xl font-bold">From the engineers using it</h2>
            </div>
            <p className="text-white/40">Real engineers. Real shows. Real results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Frequently asked</h2>
            <p className="text-white/40 text-lg">Everything you need to know about HiTech AI DiGiCo Support.</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-sm text-white/90">{faq.q}</span>
                  <ChevronDown size={16} className={`text-white/40 transition-transform shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Form */}
      <section id="get-access" ref={formRef as React.RefObject<HTMLElement>} className="py-24 px-6 border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 mb-4">
              <Cpu size={13} /> Request WhatsApp Access
            </div>
            <h2 className="text-4xl font-bold mb-3">Get Access Now</h2>
            <p className="text-white/45 text-base">
              Fill in your details and we'll connect you to the AI support agent within hours.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Check size={26} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
              <p className="text-white/50 text-sm">We'll review your request and send your WhatsApp access link shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Submit another request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-xl p-7 space-y-4">

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">Full Name <span className="text-emerald-400">*</span></label>
                  <input {...register("fullName")} placeholder="James Smith"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                {/* Company */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">Company / Venue</label>
                  <input {...register("companyName")} placeholder="Live Events Co."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">Email <span className="text-emerald-400">*</span></label>
                  <input {...register("email")} type="email" placeholder="you@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">WhatsApp Number <span className="text-emerald-400">*</span></label>
                  <input {...register("phone")} type="tel" placeholder="+1 555 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">Country <span className="text-emerald-400">*</span></label>
                  <select {...register("country")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors">
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>}
                </div>
                {/* Console Model */}
                <div>
                  <label className="block text-xs font-medium text-white/55 mb-1.5">DiGiCo Console Model</label>
                  <select {...register("consoleModel")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors">
                    <option value="">Select console</option>
                    {consoles.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="Other / Legacy">Other / Legacy</option>
                  </select>
                </div>
              </div>

              {/* Requirement */}
              <div>
                <label className="block text-xs font-medium text-white/55 mb-1.5">What do you need help with? <span className="text-emerald-400">*</span></label>
                <textarea {...register("requirement")} rows={3}
                  placeholder="e.g. Dante routing issues on Quantum7, MADI configuration, show file problems, general console support..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" />
                {errors.requirement && <p className="text-red-400 text-xs mt-1">{errors.requirement.message}</p>}
              </div>

              {/* Referral */}
              <div>
                <label className="block text-xs font-medium text-white/55 mb-1.5">How did you hear about us?</label>
                <select {...register("referralSource")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors">
                  <option value="">Select an option</option>
                  {referralSources.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-60 font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                {submitting ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <>Request WhatsApp Access <ArrowRight size={18} /></>
                )}
              </button>
              <p className="text-center text-xs text-white/25">We review all requests personally. Expect a response within a few hours.</p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Headphones size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">HiTech AI Agent</span>
            <span className="text-xs text-white/30">— DiGiCo Support</span>
          </div>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} HiTech AI Agent. Not affiliated with DiGiCo UK Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors flex items-center gap-1">
              <ExternalLink size={12} /> Privacy Policy
            </a>
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors flex items-center gap-1">
              <MessageCircle size={12} className="text-emerald-400" /> WhatsApp Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
