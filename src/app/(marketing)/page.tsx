"use client";

import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import {
  Search,
  ArrowRight,
  TrendingDown,
  Bell,
  ShieldCheck,
  BarChart3,
  Heart,
  Zap,
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UTILITIES
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function useCountUp(end: number, duration = 1200, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const started = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!startOnView || !inView || started.current) return;
    started.current = true;
    if (shouldReduceMotion) {
      setCount(end);
      return;
    }

    const startTime = performance.now();
    let frameId = 0;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, end, duration, startOnView, shouldReduceMotion]);

  return { count, ref };
}

const motionEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, delay, ease: motionEase },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-[#fafbff]">
      <HeroSection />
      <TrustedBySection />
      <ProductDemoSection />
      <ComparisonSection />
      <PriceHistorySection />
      <AlertSection />
      <DashboardSection />
      <FeatureGridSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -88]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.18]);
  const heroScale = useTransform(scrollYProgress, [0, 0.78], [1, 0.985]);
  const shouldReduceMotion = useReducedMotion();
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointer = () => setSupportsFinePointer(pointerQuery.matches);
    updatePointer();
    pointerQuery.addEventListener("change", updatePointer);
    return () => pointerQuery.removeEventListener("change", updatePointer);
  }, []);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (shouldReduceMotion || !supportsFinePointer) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 48);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 48);
    },
    [mouseX, mouseY, shouldReduceMotion, supportsFinePointer]
  );

  return (
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={shouldReduceMotion ? undefined : { y: heroY, opacity: heroOpacity, scale: heroScale }}
      className="relative min-h-[100vh] flex flex-col items-center justify-center pt-28 pb-24 overflow-hidden"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial gradient spotlight */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,rgba(0,80,203,0.08)_0%,transparent_55%)]"
      />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-20 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-40 w-96 h-96 rounded-full bg-blue-400/5 blur-[100px]" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">Intelligence-Driven Shopping</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={0.1}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-bold tracking-[-0.04em] leading-[1.05] text-[#0f1117]"
        >
          Know the Price.
          <br />
          <span className="bg-gradient-to-r from-[#0050cb] via-[#0066ff] to-[#3b82f6] bg-clip-text text-transparent">
            Before You Buy.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={0.2}
          className="mt-6 text-lg md:text-xl text-[#64748b] max-w-2xl mx-auto leading-relaxed"
        >
          DealScope aggregates prices across every marketplace, predicts trends
          with AI, and alerts you at the perfect moment to buy.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} custom={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0050cb] text-white font-semibold text-[15px] shadow-[0_4px_24px_rgba(0,80,203,0.3)] hover:shadow-[0_8px_40px_rgba(0,80,203,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Start Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0f1117] font-semibold text-[15px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Watch Demo
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating UI Preview */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.64, ease: motionEase }}
        className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-6"
      >
        <HeroDashboardPreview mouseX={springX} mouseY={springY} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#94a3b8] font-medium">Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* Hero Dashboard Preview */
function HeroDashboardPreview({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const cardX = useTransform(mouseX, (v: number) => v * -0.5);
  const cardY = useTransform(mouseY, (v: number) => v * -0.5);

  return (
    <div className="relative">
      {/* Main dashboard card */}
      <motion.div
        style={{ x: cardX, y: cardY }}
        className="relative rounded-2xl border border-[#e2e8f0] bg-white/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        {/* Fake browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f1f5f9] bg-[#fafbff]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fcd34d]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#86efac]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-lg bg-[#f1f5f9] text-[11px] text-[#94a3b8] font-mono">
              app.dealscope.io/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 grid grid-cols-12 gap-4">
          {/* Left: Search + Results */}
          <div className="col-span-12 md:col-span-8 space-y-4">
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fafbff]">
              <Search className="w-4 h-4 text-[#94a3b8]" />
              <TypingAnimation text="NVIDIA GeForce RTX 5070" />
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-3 gap-3">
              <HeroProductCard
                name="ASUS ROG Strix"
                price="$749.99"
                change="-12%"
                score={94}
                marketplace="Amazon"
                delay={1.2}
                best
              />
              <HeroProductCard
                name="MSI Ventus 3X"
                price="$829.99"
                change="-5%"
                score={68}
                marketplace="Best Buy"
                delay={1.4}
              />
              <HeroProductCard
                name="Gigabyte Eagle"
                price="$799.00"
                change="-8%"
                score={72}
                marketplace="Newegg"
                delay={1.6}
              />
            </div>

            {/* Mini chart */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0f1117] uppercase tracking-wider">90-Day Price History</span>
                <span className="text-xs text-[#10b981] font-semibold">↓ $102 from peak</span>
              </div>
              <AnimatedChart />
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-3">
            <HeroMetricCard label="Tracked Products" value="2,847" icon={<BarChart3 className="w-4 h-4" />} delay={1.0} />
            <HeroMetricCard label="Active Alerts" value="12" icon={<Bell className="w-4 h-4" />} delay={1.2} />
            <HeroMetricCard label="Avg. Savings" value="$312" icon={<TrendingDown className="w-4 h-4" />} delay={1.4} accent />

            {/* Notification popup */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.6, ease: "backOut" }}
              className="rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 p-3 flex items-start gap-3"
            >
              <div className="p-1.5 rounded-lg bg-[#10b981]/10">
                <Bell className="w-3.5 h-3.5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f1117]">Price Drop Alert!</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">RTX 5070 dropped 12% on Amazon</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements around the dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute -left-12 top-1/3 hidden lg:block"
      >
        <div className="px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-xs font-bold text-[#10b981] shadow-sm">
          <Zap className="w-3 h-3 inline mr-1" />Best Deal Found
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute -right-8 top-1/4 hidden lg:block"
      >
        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary shadow-sm">
          <ShieldCheck className="w-3 h-3 inline mr-1" />99% Trust Score
        </div>
      </motion.div>
    </div>
  );
}

/* Typing Animation */
function TypingAnimation({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span className="text-sm text-[#0f1117] font-medium">
      {displayed}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

/* Hero Product Card */
interface HeroProductCardProps {
  name: string;
  price: string;
  change: string;
  score: number;
  marketplace: string;
  delay: number;
  best?: boolean;
}
function HeroProductCard({ name, price, change, score, marketplace, delay, best = false }: HeroProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "rounded-xl border p-3 space-y-2 transition-shadow",
        best ? "border-[#10b981]/30 bg-[#10b981]/[0.03] shadow-sm" : "border-[#e2e8f0] bg-white"
      )}
    >
      {best && <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-widest">Best Deal</span>}
      <p className="text-xs font-bold text-[#0f1117] truncate">{name}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-mono font-bold text-[#0f1117]">{price}</span>
        <span className="text-xs font-bold text-[#10b981]">{change}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#94a3b8]">{marketplace}</span>
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
          score >= 80 ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#f59e0b]/10 text-[#f59e0b]"
        )}>
          {score}/100
        </span>
      </div>
    </motion.div>
  );
}

/* Hero Metric Card */
interface HeroMetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delay: number;
  accent?: boolean;
}
function HeroMetricCard({ label, value, icon, delay, accent = false }: HeroMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "rounded-xl border p-3 flex items-center gap-3",
        accent
          ? "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
          : "border-[#e2e8f0] bg-white"
      )}
    >
      <div className={cn("p-2 rounded-lg", accent ? "bg-primary/10 text-primary" : "bg-[#f1f5f9] text-[#64748b]")}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold font-mono text-[#0f1117]">{value}</p>
      </div>
    </motion.div>
  );
}

/* Animated SVG Chart */
function AnimatedChart() {
  return (
    <svg viewBox="0 0 400 80" className="w-full h-20">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0050cb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0050cb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 60 Q50 55 80 50 T160 45 T240 35 T300 25 T360 30 T400 20"
        fill="none"
        stroke="#0050cb"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.8, duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M0 60 Q50 55 80 50 T160 45 T240 35 T300 25 T360 30 T400 20 L400 80 L0 80 Z"
        fill="url(#chartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      />
    </svg>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TRUSTED BY SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function TrustedBySection() {
  const logos = ["Amazon", "Best Buy", "Newegg", "eBay", "Walmart", "Target", "B&H Photo", "Costco"];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 border-y border-[#f1f5f9] bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-bold text-[#94a3b8] uppercase tracking-[0.15em] mb-8"
        >
          Tracking prices across 50+ marketplaces
        </motion.p>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {logos.map((name) => (
            <motion.span
              key={name}
              variants={fadeUp}
              className="text-sm font-semibold text-[#cbd5e1] hover:text-[#64748b] transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INTERACTIVE PRODUCT DEMO
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function ProductDemoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45 });
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setStep(4);
      return;
    }
    if (!inView || step >= 4) return;
    const timer = window.setTimeout(() => setStep((currentStep) => currentStep + 1), 1700);
    return () => window.clearTimeout(timer);
  }, [inView, step, shouldReduceMotion]);

  const products = [
    { name: "iPhone 16 Pro 256GB", marketplace: "Amazon", price: "$1,099", trust: "99%", best: true },
    { name: "iPhone 16 Pro 256GB", marketplace: "Best Buy", price: "$1,099", trust: "98%", best: false },
    { name: "iPhone 16 Pro 256GB", marketplace: "Walmart", price: "$1,129", trust: "95%", best: false },
  ];

  return (
    <section id="demo" ref={ref} className="py-28 bg-[#fafbff]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Interactive Demo</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Watch DealScope Work
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-[#64748b] max-w-xl mx-auto">
            A real-time look at how we find the best deal in seconds.
          </motion.p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.52, ease: motionEase }}
          className="relative rounded-2xl border border-[#e2e8f0] bg-white shadow-xl overflow-hidden"
        >
          <div className="p-8 space-y-6">
            {/* Step 1: Search */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-[#e2e8f0] bg-[#fafbff]">
              <Search className="w-5 h-5 text-[#94a3b8]" />
              <AnimatePresence mode="wait">
                {step >= 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base text-[#0f1117] font-medium"
                  >
                    {step === 0 ? <TypingAnimation text="iPhone 16 Pro" /> : "iPhone 16 Pro"}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                initial={{ opacity: 0 }}
                animate={step >= 1 ? { opacity: 1 } : {}}
                className="ml-auto px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold"
              >
                Analyze
              </motion.button>
            </div>

            {/* Step 2: Results */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.46, ease: motionEase }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {products.map((p, i) => (
                    <motion.div
                      key={p.marketplace}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.46, ease: motionEase }}
                      className={cn(
                        "p-5 rounded-xl border transition-all",
                        p.best
                          ? "border-[#10b981]/30 bg-[#10b981]/5 ring-2 ring-[#10b981]/20 shadow-md"
                          : "border-[#e2e8f0] bg-white"
                      )}
                    >
                      {p.best && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10b981] uppercase tracking-wider mb-2">
                          <Zap className="w-3 h-3" /> Best Deal
                        </span>
                      )}
                      <p className="text-sm font-bold text-[#0f1117]">{p.marketplace}</p>
                      <p className="text-2xl font-mono font-bold text-[#0f1117] mt-1">{p.price}</p>
                      <p className="text-xs text-[#64748b] mt-2">Trust Score: <span className="text-[#10b981] font-bold">{p.trust}</span></p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Alert + Chart */}
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
                    <p className="text-xs font-bold text-[#0f1117] uppercase tracking-wider mb-3">Price History (90 days)</p>
                    <AnimatedChart />
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-[#0f1117]">Price Alert Enabled</span>
                    </div>
                    <p className="text-xs text-[#64748b]">We&apos;ll notify you when the price drops below <span className="font-mono font-bold text-primary">$1,049</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Notification */}
            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20"
                >
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f1117]">🎉 Price Drop Detected!</p>
                    <p className="text-xs text-[#64748b]">iPhone 16 Pro dropped to <span className="font-mono font-bold text-[#10b981]">$1,029</span> on Amazon — 6% below your target.</p>
                  </div>
                  <Link href="/register" className="ml-auto px-4 py-2 rounded-lg bg-[#10b981] text-white text-xs font-bold shrink-0 hover:bg-[#059669] transition-colors">
                    Buy Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COMPARISON SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function ComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });
  const offers = [
    { marketplace: "Amazon", seller: "Amazon.com", price: "$749.99", trust: "99%", action: "View Deal" },
    { marketplace: "Best Buy", seller: "Best Buy Official", price: "$759.99", trust: "98%", action: "View Deal" },
    { marketplace: "Newegg", seller: "Newegg Global", price: "$784.50", trust: "92%", action: "View Deal" },
    { marketplace: "B&H Photo", seller: "B&H Photo", price: "$769.00", trust: "97%", action: "View Deal" },
  ];

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-14">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Marketplace Intelligence</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Every Price. One View.
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-[#64748b] max-w-xl mx-auto">
            Side-by-side comparison across every retailer, ranked by deal quality.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-[1fr_1fr_100px_80px_100px] gap-0 px-6 py-3 bg-[#f8fafc] border-b border-[#f1f5f9] text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
            <span>Marketplace</span><span>Seller</span><span>Price</span><span>Trust</span><span></span>
          </div>
          {offers.map((offer, i) => (
            <motion.div
              key={offer.marketplace}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className={cn(
                "grid grid-cols-[1fr_1fr_100px_80px_100px] gap-0 px-6 py-4 items-center border-b border-[#f1f5f9] hover:bg-[#fafbff] transition-colors",
                i === 0 && "bg-[#10b981]/[0.02]"
              )}
            >
              <span className="text-sm font-bold text-[#0f1117] flex items-center gap-2">
                {i === 0 && <span className="w-2 h-2 rounded-full bg-[#10b981]" />}
                {offer.marketplace}
              </span>
              <span className="text-sm text-[#64748b]">{offer.seller}</span>
              <span className="text-sm font-mono font-bold text-[#0f1117]">{offer.price}</span>
              <span className="text-xs font-bold text-[#10b981]">{offer.trust}</span>
              <span className="text-xs font-bold text-primary cursor-pointer hover:underline">{offer.action}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PRICE HISTORY SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function PriceHistorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="py-28 bg-[#fafbff]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}>
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Price Intelligence</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            See the Full Picture
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-[#64748b]">
            90-day price trends, historical lows, and AI predictions â€” all in one chart. Know exactly when to buy.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.3} className="mt-8 space-y-4">
            {["Historical price tracking across marketplaces", "AI-powered price predictions", "Identify seasonal trends and flash sales"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                <span className="text-sm text-[#475569]">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">RTX 5070 â€” Price History</p>
              <p className="text-2xl font-bold font-mono text-[#0f1117] mt-1">$749.99</p>
            </div>
            <div className="flex gap-1">
              {["7D", "30D", "90D", "1Y"].map((t, i) => (
                <button key={t} className={cn("px-2.5 py-1 rounded-md text-xs font-bold", i === 2 ? "bg-primary text-white" : "text-[#94a3b8] hover:bg-[#f1f5f9]")}>{t}</button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 400 120" className="w-full h-32">
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0050cb" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0050cb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 80 C30 85, 60 70, 90 75 S150 50, 180 60 S240 40, 270 35 S330 45, 360 30 L400 25"
              fill="none" stroke="#0050cb" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0 80 C30 85, 60 70, 90 75 S150 50, 180 60 S240 40, 270 35 S330 45, 360 30 L400 25 L400 120 L0 120Z"
              fill="url(#histGrad)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.5, duration: 1 }}
            />
            {/* Price markers */}
            <motion.circle cx="270" cy="35" r="4" fill="#0050cb" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 2, type: "spring" }} />
            <motion.text x="275" y="28" fontSize="10" fill="#0050cb" fontWeight="700" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>$749</motion.text>
          </svg>
          <div className="flex items-center justify-between mt-3 text-xs text-[#94a3b8]">
            <span>Jun 1</span><span>Jul 15</span><span>Today</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ALERT SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function AlertSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.52, ease: motionEase }}
          className="order-2 lg:order-1 relative"
        >
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#fafbff] p-6 shadow-lg space-y-4">
            {/* Phone notification mock */}
            <div className="mx-auto max-w-xs">
              <div className="rounded-2xl bg-[#0f1117] p-4 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/60">9:41 AM</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 rounded-sm bg-white/40" />
                    <div className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded bg-primary/80 flex items-center justify-center">
                      <TrendingDown className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold">DealScope</span>
                    <span className="text-[10px] text-white/50 ml-auto">now</span>
                  </div>
                  <p className="text-xs">ðŸŽ¯ Price target hit! MacBook Air M4 dropped to <span className="font-mono font-bold text-[#34d399]">$999</span> on Amazon.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded bg-[#f59e0b]/80 flex items-center justify-center">
                      <Bell className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold">DealScope</span>
                    <span className="text-[10px] text-white/50 ml-auto">2h ago</span>
                  </div>
                  <p className="text-xs">âš¡ Low stock alert â€” RTX 5070 has only 3 units left at Best Buy.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="order-1 lg:order-2">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Smart Alerts</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Never Miss a Deal
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-[#64748b]">
            Set your target price and DealScope watches 24/7. Get notified the instant prices drop below your threshold.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.3} className="mt-8 space-y-4">
            {["Custom price targets per product", "Real-time push notifications", "Email & SMS alerts", "Low stock warnings"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-[#475569]">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DASHBOARD SECTION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

interface StatItemData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ReactNode;
}

function StatItem({ stat }: { stat: StatItemData }) {
  const { count, ref: countRef } = useCountUp(stat.value);
  return (
    <motion.div
      variants={fadeUp}
      className="motion-interactive rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-sm hover:shadow-md"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4">
        {stat.icon}
      </div>
      <p ref={countRef} className="text-3xl font-bold font-mono text-[#0f1117]">
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-xs text-[#94a3b8] font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
    </motion.div>
  );
}

function DashboardSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });

  const stats = [
    { label: "Products Tracked", value: 14847, suffix: "+", icon: <Globe className="w-5 h-5" /> },
    { label: "Avg. User Savings", value: 312, prefix: "$", icon: <TrendingDown className="w-5 h-5" /> },
    { label: "Marketplaces", value: 52, suffix: "+", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Trust Score Accuracy", value: 99, suffix: "%", icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <section ref={ref} className="py-28 bg-[#fafbff]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Intelligence Hub</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Your Shopping Command Center
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FEATURE GRID
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function FeatureGridSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: <Search className="w-5 h-5" />, title: "Neural Search", desc: "AI-powered product matching across 50+ marketplaces in milliseconds." },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Price Analytics", desc: "90-day price trends, volatility analysis, and buy/wait recommendations." },
    { icon: <Bell className="w-5 h-5" />, title: "Smart Alerts", desc: "Set custom price targets and get instant push, email, or SMS notifications." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Seller Trust", desc: "Entity-level verification of sellers with NLP-driven sentiment analysis." },
    { icon: <Heart className="w-5 h-5" />, title: "Monitored Wishlist", desc: "Track unlimited products with automated intelligence briefings." },
    { icon: <Sparkles className="w-5 h-5" />, title: "AI Advisor", desc: "Get personalized buy/wait recommendations powered by market intelligence." },
  ];

  return (
    <section id="features" ref={ref} className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Platform Features</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Enterprise Analysis for Everyone
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-[#64748b] max-w-xl mx-auto">
            Professional-grade shopping intelligence, available to every user.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group rounded-2xl border border-[#e2e8f0] bg-white p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] group-hover:bg-primary/10 flex items-center justify-center text-[#64748b] group-hover:text-primary transition-colors">
                {f.icon}
              </div>
              <h3 className="mt-5 text-base font-bold text-[#0f1117]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#64748b] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HOW IT WORKS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { num: "01", title: "Search", desc: "Enter any product â€” we scan 50+ marketplaces instantly.", icon: <Search className="w-6 h-6" /> },
    { num: "02", title: "Compare", desc: "See every price, trust score, and availability side by side.", icon: <BarChart3 className="w-6 h-6" /> },
    { num: "03", title: "Track", desc: "Add to your wishlist and set your target price.", icon: <Heart className="w-6 h-6" /> },
    { num: "04", title: "Save", desc: "Get alerted the instant prices drop. Buy at the best moment.", icon: <Zap className="w-6 h-6" /> },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-28 bg-[#fafbff]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">How It Works</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Four Steps to Smarter Shopping
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp} className="relative text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                {step.icon}
              </div>
              <span className="text-xs font-mono font-bold text-primary">{step.num}</span>
              <h3 className="mt-1 text-lg font-bold text-[#0f1117]">{step.title}</h3>
              <p className="mt-2 text-sm text-[#64748b]">{step.desc}</p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute top-7 -right-5 w-5 h-5 text-[#cbd5e1]" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TESTIMONIALS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { name: "Sarah Chen", role: "Hardware Enthusiast", text: "DealScope saved me $400 on my RTX 5070 build. The price history chart showed me it was at an all-time low.", stars: 5 },
    { name: "Marcus Rivera", role: "Tech Journalist", text: "The seller trust scores are a game changer. I finally know which third-party sellers I can actually trust.", stars: 5 },
    { name: "Emily Watkins", role: "Smart Shopper", text: "I set a price alert for the MacBook Air and got notified within 3 days. Saved $200 without lifting a finger.", stars: 5 },
  ];

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Testimonials</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Loved by Smart Shoppers
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-7 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                ))}
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1117]">{t.name}</p>
                  <p className="text-xs text-[#94a3b8]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FAQ
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    { q: "Is DealScope free?", a: "Yes! Our Essential plan is completely free with up to 5 concurrent monitors, 12-month history, and basic alerts." },
    { q: "What marketplaces do you track?", a: "We track 50+ marketplaces including Amazon, Best Buy, Newegg, eBay, Walmart, B&H Photo, Target, Costco, and many more." },
    { q: "How accurate are the price predictions?", a: "Our AI models achieve 92% directional accuracy on 14-day price forecasts, trained on 5+ years of historical pricing data." },
    { q: "Can I sell products on DealScope?", a: "No. DealScope is a Shopping Intelligence Platform, not a marketplace. We help you find the best deal, then redirect you to the original retailer." },
    { q: "How do Trust Scores work?", a: "We analyze seller history, review sentiment, return rates, and fulfillment speed using NLP to generate a composite trust score from 0-100." },
  ];

  return (
    <section id="faq" ref={ref} className="py-28 bg-[#fafbff]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-[0.15em]">FAQ</motion.span>
          <motion.h2 variants={fadeUp} custom={0.1} className="mt-3 text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#0f1117]">
            Common Questions
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-[#e2e8f0] bg-white overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#fafbff] transition-colors"
      >
        <span className="text-sm font-bold text-[#0f1117]">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-[#64748b] leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FINAL CTA
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function FinalCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.52, ease: motionEase }}
          className="relative rounded-3xl bg-gradient-to-br from-[#0050cb] via-[#0066ff] to-[#3b82f6] p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em]">
              Ready to Shop Smarter?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
              Join thousands of users who never overpay. Start tracking prices, comparing deals, and saving money â€” completely free.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0050cb] font-bold text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get Started Free
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/50 font-medium">No credit card required Â· Free forever plan available</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

