import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowDownToLine,
  BatteryCharging,
  Bot,
  Box,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CloudOff,
  Code2,
  Cpu,
  Github,
  Globe2,
  HardDrive,
  Menu,
  Network,
  Package,
  Play,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/hero-scene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Android Server Mini — Run Python on Android" },
      {
        name: "description",
        content:
          "Turn your Android into a mini server for Python scripts, bots, APIs and background services. No Termux required.",
      },
      { property: "og:title", content: "Android Server Mini" },
      { property: "og:description", content: "Your Android is more powerful than you think." },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Braces,
    label: "Python Runtime",
    copy: "CPython-ready environment with isolated workspaces and pip support.",
    code: "PY 3.12",
  },
  {
    icon: Terminal,
    label: "Terminal Mini",
    copy: "A focused shell for scripts, files, processes and package management.",
    code: "SHELL",
  },
  {
    icon: Bot,
    label: "Telegram Bots",
    copy: "Keep polling and webhook-based bots online around the clock.",
    code: "24 / 7",
  },
  {
    icon: Activity,
    label: "Background Service",
    copy: "Persistent jobs survive app switches with clear health telemetry.",
    code: "ACTIVE",
  },
  {
    icon: Globe2,
    label: "HTTP API Server",
    copy: "Ship FastAPI, Flask and custom endpoints over your local network.",
    code: ": 8080",
  },
  {
    icon: Package,
    label: "Package Manager",
    copy: "Install, inspect and update dependencies without touching Termux.",
    code: "PIP",
  },
];

const terminalLines = [
  ["$ ", "asm init telegram-bot"],
  ["→ ", "Creating isolated Python 3.12 runtime..."],
  ["✓ ", "Installed 18 packages in 2.4s"],
  ["$ ", "python bot.py --daemon"],
  ["● ", "Bot engine connected · @server_mini_bot"],
  ["● ", "HTTP health probe listening on :8080"],
  ["✓ ", "Service deployed · PID 2481 · 12 MB RAM"],
];

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="reveal mx-auto mb-14 max-w-2xl text-center">
      <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">{copy}</p>
    </div>
  );
}

function TerminalDemo() {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    const timer = window.setInterval(
      () => setShown((current) => (current >= terminalLines.length ? 1 : current + 1)),
      800,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-destructive" />
            <i className="h-2.5 w-2.5 rounded-full bg-amber" />
            <i className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <span className="truncate font-mono text-xs text-muted-foreground">
            server-mini — bot-workspace
          </span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
          <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> live
        </span>
      </div>
      <div className="relative min-h-80 overflow-hidden p-5 font-mono text-xs leading-8 sm:p-7 sm:text-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-scan bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        {terminalLines.slice(0, shown).map(([prefix, line], index) => (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            key={`${line}-${shown > index}`}
            className="flex gap-3"
          >
            <span
              className={
                prefix === "✓ " || prefix === "● "
                  ? "text-primary"
                  : prefix === "→ "
                    ? "text-amber"
                    : "text-muted-foreground"
              }
            >
              {prefix}
            </span>
            <span className={prefix === "$ " ? "text-foreground" : "text-muted-foreground"}>
              {line}
            </span>
          </motion.div>
        ))}
        <span className="mt-2 inline-block h-4 w-2 animate-pulse bg-primary" />
      </div>
    </div>
  );
}

function PhoneMockup({ screen }: { screen: number }) {
  const screens = [
    <>
      <div className="mb-5 flex items-center justify-between">
        <b>Services</b>
        <i className="h-2 w-2 animate-pulse rounded-full bg-primary" />
      </div>
      {["telegram_bot.py", "api_server.py", "watcher.py"].map((x, i) => (
        <div key={x} className="mb-3 rounded-xl border border-border bg-secondary/50 p-3">
          <div className="flex justify-between">
            <span className="font-mono text-[10px]">{x}</span>
            <span className="text-[9px] text-primary">{i === 2 ? "IDLE" : "RUNNING"}</span>
          </div>
          <div className="mt-2 h-1 rounded bg-muted">
            <div className={`h-full rounded bg-primary ${["w-4/5", "w-3/5", "w-2/5"][i]}`} />
          </div>
        </div>
      ))}
    </>,
    <>
      <div className="mb-4 font-mono text-xs text-primary">Terminal Mini</div>
      <div className="space-y-2 font-mono text-[9px] text-muted-foreground">
        <p>
          <span className="text-primary">$</span> python main.py
        </p>
        <p>Starting API server...</p>
        <p className="text-foreground">Uvicorn running on</p>
        <p className="text-amber">http://0.0.0.0:8080</p>
        <p className="pt-3 text-primary">✓ Application ready</p>
      </div>
    </>,
    <>
      <div className="mb-5 font-semibold">Device health</div>
      {[
        ["CPU", "18%"],
        ["Memory", "242 MB"],
        ["Network", "1.2 MB/s"],
        ["Battery", "84%"],
      ].map(([a, b], i) => (
        <div key={a} className="mb-4">
          <div className="mb-2 flex justify-between text-[10px]">
            <span className="text-muted-foreground">{a}</span>
            <b>{b}</b>
          </div>
          <div className="h-1 rounded bg-muted">
            <div
              className={`h-full rounded bg-primary ${["w-1/4", "w-2/5", "w-3/5", "w-4/5"][i]}`}
            />
          </div>
        </div>
      ))}
    </>,
  ];
  return (
    <div className="mx-auto w-[245px] rounded-[2.7rem] border border-border bg-surface p-2 shadow-[0_40px_100px_var(--glow-primary)]">
      <div className="relative min-h-[480px] overflow-hidden rounded-[2.25rem] border border-border bg-background p-5 pt-12">
        <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-muted" />
        {screens[screen]}
      </div>
    </div>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [screen, setScreen] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) =>
        gsap.from(element, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%" },
        }),
      );
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((element) =>
        gsap.to(element, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: element, scrub: true },
        }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-background text-foreground selection:bg-primary/25">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/55 backdrop-blur-2xl">
        <nav
          className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-5 lg:px-8"
          aria-label="Main navigation"
        >
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Server className="h-4 w-4" />
            </span>
            <span className="truncate font-mono text-sm font-semibold tracking-tight">
              ANDROID SERVER <i className="not-italic text-primary">MINI</i>
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Terminal", "Architecture", "Performance"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
            <Button asChild variant="launch" size="sm">
              <a href="#download">
                <ArrowDownToLine /> Download
              </a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </nav>
        {menuOpen && (
          <div className="border-t border-border bg-background p-5 md:hidden">
            {["Features", "Terminal", "Architecture", "Performance", "Download"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border py-3 text-sm text-muted-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        <section
          id="top"
          className="grid-field relative flex min-h-screen items-center overflow-hidden pt-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-y-0 right-0 w-full opacity-80 lg:w-[62%]">
            <HeroScene />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl lg:max-w-[650px]"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                <CircleDot className="h-3 w-3 animate-pulse" /> Runtime online · v1.0
              </div>
              <h1 className="text-glow text-5xl font-semibold leading-[0.97] tracking-[-0.06em] sm:text-7xl lg:text-[5.5rem]">
                Turn Your Android Into A <span className="text-primary">Mini Server</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Run Python scripts, Telegram bots and APIs directly on your Android device. No
                Termux. No VPS. Just deploy.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="launch" size="lg">
                  <a href="#download">
                    <ArrowDownToLine /> Download APK{" "}
                    <span className="font-mono text-[10px] opacity-60">v1.0</span>
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <a href="#architecture">
                    <Code2 /> View Documentation
                  </a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Open source
                </span>
                <span className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5 text-primary" /> Android 8+
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" /> 14 MB
                </span>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[.28em] text-muted-foreground">
            <span className="mb-2 block">Explore system</span>
            <span className="mx-auto block h-10 w-px bg-gradient-to-b from-primary to-transparent" />
          </div>
        </section>

        <section id="features" className="px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Runtime capabilities"
              title="Everything you need. Nothing you don't."
              copy="A compact, purpose-built server environment designed for the computer already in your pocket."
            />
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, label, copy, code }, index) => (
                <motion.article
                  key={label}
                  whileHover={{ y: -5 }}
                  className="reveal group relative bg-background p-7 sm:p-8"
                >
                  <div className="mb-10 flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/20 bg-primary/5 text-primary transition-all group-hover:shadow-[0_0_28px_var(--glow-primary)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[.18em] text-muted-foreground">
                      0{index + 1} / {code}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="terminal"
          className="border-y border-border bg-surface/30 px-5 py-28 lg:px-8 lg:py-36"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div className="reveal">
              <p className="font-mono text-xs uppercase tracking-[.22em] text-cyan">
                Deploy in seconds
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
                Your pocket-sized command center.
              </h2>
              <p className="mt-6 max-w-md leading-7 text-muted-foreground">
                Create an isolated runtime, install your dependencies and launch a persistent
                service through one precise interface.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Automatic dependency resolution",
                  "Real-time process logs",
                  "One-tap service controls",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal parallax">
              <TerminalDemo />
            </div>
          </div>
        </section>

        <section
          id="architecture"
          className="grid-field overflow-hidden px-5 py-28 lg:px-8 lg:py-36"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="System architecture"
              title="One device. A complete stack."
              copy="Every workload runs in its own managed layer, connected through a low-overhead local service mesh."
            />
            <div className="reveal relative mx-auto min-h-[520px] max-w-5xl [perspective:1000px]">
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  whileHover={{ rotateY: 12, rotateX: -8, scale: 1.04 }}
                  className="glass-panel grid h-40 w-40 place-items-center rounded-[2rem] border-primary/30 shadow-[0_0_80px_var(--glow-primary)]"
                >
                  <div className="text-center">
                    <Smartphone className="mx-auto h-9 w-9 text-primary" />
                    <b className="mt-3 block text-sm">Android Device</b>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      CORE / ONLINE
                    </span>
                  </div>
                </motion.div>
              </div>
              {[
                { x: "left-[3%] top-[12%]", i: Braces, t: "Python Runtime" },
                { x: "right-[3%] top-[12%]", i: Bot, t: "Bot Engine" },
                { x: "left-[3%] bottom-[12%]", i: Globe2, t: "API Server" },
                { x: "right-[3%] bottom-[12%]", i: Activity, t: "Background Service" },
              ].map(({ x, i: Icon, t }, index) => (
                <motion.div
                  key={t}
                  animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity }}
                  className={`glass-panel absolute ${x} z-10 w-40 rounded-xl p-4 sm:w-52 sm:p-5`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <b className="block text-xs sm:text-sm">{t}</b>
                      <span className="font-mono text-[8px] text-primary">CONNECTED</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-primary/25">
                <line
                  x1="20%"
                  y1="25%"
                  x2="50%"
                  y2="50%"
                  stroke="currentColor"
                  strokeDasharray="5 8"
                />
                <line
                  x1="80%"
                  y1="25%"
                  x2="50%"
                  y2="50%"
                  stroke="currentColor"
                  strokeDasharray="5 8"
                />
                <line
                  x1="20%"
                  y1="75%"
                  x2="50%"
                  y2="50%"
                  stroke="currentColor"
                  strokeDasharray="5 8"
                />
                <line
                  x1="80%"
                  y1="75%"
                  x2="50%"
                  y2="50%"
                  stroke="currentColor"
                  strokeDasharray="5 8"
                />
              </svg>
            </div>
          </div>
        </section>

        <section
          id="performance"
          className="border-y border-border bg-surface/30 px-5 py-28 lg:px-8 lg:py-36"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Live telemetry"
              title="Quietly powerful. Remarkably efficient."
              copy="Track every important resource at a glance with real-time, on-device monitoring."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { i: Cpu, l: "CPU", v: "18", u: "%", s: "4 cores" },
                { i: HardDrive, l: "RAM", v: "242", u: "MB", s: "of 6 GB" },
                { i: Network, l: "Network", v: "1.2", u: "MB/s", s: "18 ms" },
                { i: BatteryCharging, l: "Battery", v: "84", u: "%", s: "~9h left" },
                { i: Radio, l: "Uptime", v: "12", u: "d", s: "99.98%" },
              ].map(({ i: Icon, l, v, u, s }, index) => (
                <motion.article
                  whileHover={{ y: -4 }}
                  key={l}
                  className="glass-panel reveal rounded-xl p-5"
                >
                  <div className="mb-7 flex justify-between">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[9px] text-primary">LIVE</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {l}
                  </span>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {v}
                    <small className="ml-1 text-xs font-normal text-muted-foreground">{u}</small>
                  </p>
                  <div className="mt-5 flex h-10 items-end gap-1">
                    {[25, 60, 45, 78, 50, 84, 66, 90, 55, 72].map((h, i) => (
                      <i
                        key={i}
                        className={`w-full rounded-sm ${i > 7 - index ? "bg-primary" : "bg-primary/20"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-[9px] text-muted-foreground">{s}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why Server Mini"
              title="A server that goes where you go."
              copy="No cloud bill, no fragile terminal setup—just your hardware doing more."
            />
            <div className="grid gap-8 md:grid-cols-5">
              {[
                { i: CloudOff, t: "No VPS", c: "Your hardware. Zero monthly bill." },
                { i: X, t: "No Termux", c: "A focused native experience." },
                { i: Smartphone, t: "Portable", c: "Deploy from anywhere." },
                { i: Zap, t: "Lightweight", c: "Tiny footprint, low power." },
                { i: Play, t: "Easy Deploy", c: "From code to running in taps." },
              ].map(({ i: Icon, t, c }) => (
                <div className="reveal text-center" key={t}>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-border bg-secondary/50 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold">{t}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-border bg-surface/30 px-5 py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Built for focus"
              title="Full control. Right in your hand."
              copy="A native interface for creating, deploying and monitoring every service."
            />
            <div className="reveal grid items-center gap-10 lg:grid-cols-[1fr_1.1fr_1fr]">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous screenshot"
                onClick={() => setScreen((screen + 2) % 3)}
                className="hidden justify-self-end lg:inline-flex"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <PhoneMockup screen={screen} />
              </motion.div>
              <div>
                <p className="font-mono text-xs text-primary">0{screen + 1} / 03</p>
                <h3 className="mt-4 text-2xl font-semibold">
                  {["Service control", "Terminal Mini", "Device telemetry"][screen]}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                  {
                    [
                      "Start, stop and inspect all running workloads from one calm dashboard.",
                      "Run commands and watch logs stream in real time without a separate terminal app.",
                      "Understand CPU, memory, network and battery impact before it matters.",
                    ][screen]
                  }
                </p>
                <div className="mt-8 flex gap-3">
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={() => setScreen((screen + 2) % 3)}
                    aria-label="Previous"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="launch"
                    size="icon"
                    onClick={() => setScreen((screen + 1) % 3)}
                    aria-label="Next"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="download"
          className="grid-field relative overflow-hidden px-5 py-32 lg:px-8 lg:py-44"
        >
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="reveal relative mx-auto max-w-3xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_50px_var(--glow-primary)]">
              <Box className="h-7 w-7" />
            </span>
            <p className="mt-8 font-mono text-xs uppercase tracking-[.23em] text-primary">
              Ready to deploy?
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
              Your Android is more powerful than you think.
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">
              Put idle hardware to work. Launch your first Python service in less than two minutes.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="launch" size="lg">
                <ArrowDownToLine /> Download APK
              </Button>
              <Button variant="glass" size="lg">
                <Github /> GitHub Repository
              </Button>
              <Button variant="glass" size="lg">
                <Code2 /> Documentation
              </Button>
            </div>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              v1.0.0 · Android 8+ · arm64 · 14.2 MB
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
          <div className="min-w-0">
            <a href="#top" className="flex items-center gap-2 font-mono text-xs font-semibold">
              <Server className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">ANDROID SERVER MINI</span>
            </a>
            <p className="mt-2 text-[10px] text-muted-foreground">
              © 2026 Android Server Mini. Built for builders.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Website">
              <Globe2 />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
