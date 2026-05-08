import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Bot, Zap, Shield, BarChart3, ChevronRight, Globe, MessageSquare, Brain, Cpu, ArrowRight, Check } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  requirement: z.string().min(10, "Please describe your requirement (min 10 characters)"),
  referralSource: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const features = [
  {
    icon: Brain,
    title: "Intelligent Automation",
    desc: "AI agents that understand context and make smart decisions 24/7.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Process thousands of tasks simultaneously with sub-second response times.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Bank-grade encryption and compliance built into every workflow.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Live dashboards showing every action your AI agents take.",
  },
  {
    icon: Globe,
    title: "Global Integrations",
    desc: "Connect to 500+ apps — CRMs, ERPs, communication platforms.",
  },
  {
    icon: MessageSquare,
    title: "Multi-channel AI",
    desc: "Deploy across WhatsApp, Email, Slack, voice, and web simultaneously.",
  },
];

const stats = [
  { value: "10x", label: "Faster Operations" },
  { value: "85%", label: "Cost Reduction" },
  { value: "24/7", label: "Always On" },
  { value: "500+", label: "Integrations" },
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "India", "Singapore", "UAE", "Saudi Arabia", "Brazil", "Mexico", "Netherlands",
  "Spain", "Italy", "Japan", "South Korea", "South Africa", "Other",
];

const referralSources = [
  "Google Search", "LinkedIn", "Twitter / X", "YouTube", "Friend / Colleague",
  "Newsletter", "Podcast", "Conference / Event", "Other",
];

export default function Home() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        reset();
      } else {
        toast({
          title: "Something went wrong",
          description: json.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("get-access")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050914] text-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050914]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Cpu size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">NeuralAgent</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#get-access" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button
            onClick={scrollToForm}
            className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-medium"
          >
            Get Access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now in Early Access — Limited Spots
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Your Business on{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Autopilot
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deploy AI agents that handle sales, support, and operations — so your team can focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 transition-all font-semibold text-lg shadow-lg shadow-violet-500/20"
            >
              Get Early Access <ArrowRight size={20} />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all font-medium"
            >
              See Features <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything your business needs</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              One platform to automate your entire operation — from lead capture to customer success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition-colors">
                  <f.icon size={20} className="text-violet-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-white/50 text-lg">No code. No complexity. Just results.</p>
          </div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Tell us your workflow", desc: "Describe what you want automated — sales follow-ups, support tickets, data entry, or any repetitive task." },
              { step: "02", title: "We configure your agents", desc: "Our team sets up AI agents tailored to your tools, data sources, and business logic." },
              { step: "03", title: "Go live and scale", desc: "Your agents start working immediately. Monitor performance in real-time and expand as you grow." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-4xl font-extrabold text-white/10 shrink-0 w-12">{item.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Form */}
      <section id="get-access" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Early Access</h2>
            <p className="text-white/50 text-lg">
              Fill in your details and our team will reach out within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
              <p className="text-white/50">
                Thanks for your interest. We'll be in touch within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Company Name
                  </label>
                  <input
                    {...register("companyName")}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Email <span className="text-violet-400">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Phone <span className="text-violet-400">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+1 555 000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Country <span className="text-violet-400">*</span>
                </label>
                <select
                  {...register("country")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0d1120] border border-white/10 text-white focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  What do you want to automate? <span className="text-violet-400">*</span>
                </label>
                <textarea
                  {...register("requirement")}
                  rows={3}
                  placeholder="e.g. Automate lead follow-up via WhatsApp, sync data to our CRM, and send daily reports to Slack..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors text-sm resize-none"
                />
                {errors.requirement && (
                  <p className="text-red-400 text-xs mt-1">{errors.requirement.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  How did you hear about us?
                </label>
                <select
                  {...register("referralSource")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0d1120] border border-white/10 text-white focus:outline-none focus:border-violet-500/60 transition-colors text-sm"
                >
                  <option value="">Select an option</option>
                  {referralSources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Request Access <ArrowRight size={20} /></>
                )}
              </button>

              <p className="text-center text-xs text-white/30">
                No spam. Your data is never sold. We'll only contact you about your request.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Cpu size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">NeuralAgent</span>
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} NeuralAgent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
