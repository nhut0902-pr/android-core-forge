import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "motion/react";
import { DotLottiePlayer } from "@dotlottie/react-player";
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
  Smartphone,
  Terminal,
  X,
  Zap,
  Monitor,
  Layers,
  Terminal as TerminalIcon,
  Search,
  Maximize2,
  Download,
  ShieldCheck,
  LucideIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/hero-scene";
import { useGithubRelease } from "@/hooks/use-github-release";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

gsap.registerPlugin(ScrollTrigger);

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
    snippet:
      'from telethon import TelegramClient\n\nclient = TelegramClient("session", api_id, api_hash)\nclient.start()',
  },
  {
    icon: Terminal,
    label: "Terminal Mini",
    copy: "A focused shell for scripts, files, processes and package management.",
    code: "SHELL",
    snippet: "pip install telethon\npip install fastapi\npython bot.py\nserver start\nstatus",
  },
  {
    icon: Bot,
    label: "Telegram Bots",
    copy: "Keep polling and webhook-based bots online around the clock.",
    code: "24 / 7",
    snippet: "# Runtime Online\n# Python 3.12\n# RAM Usage: 148 MB\n# Background Service: Active",
  },
  {
    icon: Activity,
    label: "Background Service",
    copy: "Persistent jobs survive app switches with clear health telemetry.",
    code: "ACTIVE",
    snippet: "server.start()",
  },
  {
    icon: Globe2,
    label: "HTTP API Server",
    copy: "Ship FastAPI, Flask and custom endpoints over your local network.",
    code: ": 8080",
    snippet:
      'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef home():\n    return {"status":"running"}',
  },
  {
    icon: Package,
    label: "Package Manager",
    copy: "Install, inspect and update dependencies without touching Termux.",
    code: "PIP",
    snippet: "pip install -r requirements.txt",
  },
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
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500"
      >
        {copy}
      </motion.p>
    </div>
  );
}

function WarpTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullLogs = useMemo(
    () => [
      "$ pip install telethon fastapi",
      "Collecting telethon...",
      "  Downloading Telethon-1.35.0-py3-none-any.whl (604 kB)",
      "Collecting fastapi...",
      "  Downloading fastapi-0.111.0-py3-none-any.whl (91 kB)",
      "Installing collected packages: telethon, fastapi",
      "Successfully installed telethon-1.35.0 fastapi-0.111.0",
      "",
      "$ python bot.py",
      "Connecting to Telegram API...",
      "Bot engine initialized. Session: 'android_server'",
      "Listening for updates...",
      "",
      "$ server start",
      "Spinning up ASGI worker...",
      "Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)",
      "",
      "$ status",
      "Runtime: Python 3.12.3",
      "Uptime: 0d 0h 14m",
      "CPU: 12.4% | RAM: 156.2 MB",
      "Status: All systems operational",
    ],
    [],
  );

  useEffect(() => {
    let i = 0;
    let interval: NodeJS.Timeout;

    const startInterval = () => {
      interval = setInterval(() => {
        if (i < fullLogs.length) {
          const currentLog = fullLogs[i];
          if (currentLog !== undefined) {
            setLogs((prev) => [...prev, currentLog]);
          }
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setLogs([]);
            i = 0;
            startInterval();
          }, 5000);
        }
      }, 600);
    };

    startInterval();
    return () => clearInterval(interval);
  }, [fullLogs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all hover:border-emerald-200">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-white px-2 py-1 border border-slate-200">
            <TerminalIcon className="h-3 w-3 text-slate-400" />
            <span className="font-mono text-[10px] text-slate-500">main — android-server</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Search className="h-3.5 w-3.5 cursor-pointer hover:text-slate-900" />
          <Maximize2 className="h-3.5 w-3.5 cursor-pointer hover:text-slate-900" />
        </div>
      </div>
      <div
        ref={containerRef}
        className="h-[400px] overflow-y-auto p-6 font-mono text-xs leading-relaxed bg-[#1c1c1c] scrollbar-hide"
      >
        <div className="space-y-1.5">
          {logs.map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={log?.startsWith("$") ? "text-emerald-400" : "text-zinc-400"}
            >
              {log?.startsWith("$") ? (
                <span className="flex gap-2">
                  <span className="text-emerald-500/50">~</span>
                  <span>{log}</span>
                </span>
              ) : (
                log
              )}
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-4 w-2 bg-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}

interface ArchNodeProps {
  icon: LucideIcon;
  title: string;
  status: string;
  x: string;
  y: string;
  delay?: number;
}

function ArchNode({ icon: Icon, title, status, x, y, delay = 0 }: ArchNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="absolute z-10 flex flex-col items-center gap-3"
      style={{ left: x, top: y }}
    >
      <div className="group relative">
        <div className="absolute -inset-4 rounded-full bg-emerald-100 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all group-hover:border-emerald-300 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Icon className="h-8 w-8 text-emerald-600" />
        </div>
      </div>
      <div className="text-center">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600/70">
          {status}
        </span>
      </div>
    </motion.div>
  );
}

function ArchFlow() {
  return (
    <div className="reveal relative mx-auto h-[600px] max-w-5xl">
      <svg className="absolute inset-0 h-full w-full">
        {/* Paths */}
        <g
          className="text-emerald-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
        >
          <path d="M 512 80 L 512 180" />
          <path d="M 512 244 L 512 300" />
          <path d="M 512 364 L 300 450" />
          <path d="M 512 364 L 724 450" />
          <path d="M 300 514 L 512 560" />
          <path d="M 724 514 L 512 560" />
        </g>

        {/* Animated Particles */}
        <motion.circle r="3" fill="#059669">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 512 80 L 512 180" />
        </motion.circle>
        <motion.circle r="3" fill="#059669">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 512 364 L 300 450" />
        </motion.circle>
        <motion.circle r="3" fill="#059669">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M 512 364 L 724 450" />
        </motion.circle>
      </svg>

      <ArchNode
        icon={Smartphone}
        title="Android Device"
        status="Hardware Host"
        x="462px"
        y="20px"
        delay={0.1}
      />
      <ArchNode
        icon={Box}
        title="Python Runtime"
        status="CPython 3.12"
        x="462px"
        y="180px"
        delay={0.2}
      />
      <ArchNode
        icon={Layers}
        title="Service Mesh"
        status="Process Manager"
        x="462px"
        y="300px"
        delay={0.3}
      />
      <ArchNode
        icon={Bot}
        title="Telegram Engine"
        status="Telethon Core"
        x="250px"
        y="450px"
        delay={0.4}
      />
      <ArchNode
        icon={Globe2}
        title="HTTP API Server"
        status="FastAPI Stack"
        x="674px"
        y="450px"
        delay={0.5}
      />
      <ArchNode
        icon={Activity}
        title="Background Service"
        status="Persistent"
        x="462px"
        y="540px"
        delay={0.6}
      />
    </div>
  );
}

const mockData = Array.from({ length: 20 }, (_, i) => ({
  name: i,
  value: 15 + Math.random() * 20,
}));

interface PerformanceCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  status: string;
  color: string;
}

function PerformanceCard({ icon: Icon, label, value, unit, status, color }: PerformanceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass-panel group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-emerald-400 hover:shadow-xl"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 blur-2xl transition-all group-hover:bg-emerald-100" />

      <div className="mb-8 flex items-center justify-between">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-50 border border-slate-100 ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600/80">
            Live
          </span>
        </div>
      </div>

      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-slate-900">{value}</span>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
      </div>

      <div className="mt-6 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="100%">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              fillOpacity={1}
              fill={`url(#color${label})`}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 font-mono text-[10px] text-slate-400">{status}</p>
    </motion.div>
  );
}

function PhoneMockup({ screen, title, desc }: { screen: number; title: string; desc: string }) {
  const screens = [
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-bold">Terminal</h4>
        <div className="flex gap-1.5">
          <CircleDot className="h-3 w-3 text-emerald-500" />
          <Activity className="h-3 w-3 text-emerald-400" />
        </div>
      </div>
      <div className="space-y-4 font-mono text-[10px]">
        <div className="rounded-lg border border-white/5 bg-black/90 p-3">
          <span className="text-emerald-400">$</span> pip install telethon
          <div className="mt-2 leading-relaxed text-zinc-500">
            Downloading... [OK]
            <br />
            Unpacking... [OK]
            <br />
            Successfully installed.
          </div>
        </div>
        <div className="rounded-lg border border-white/5 bg-black/90 p-3">
          <span className="text-emerald-400">$</span> python bot.py
          <div className="mt-2 text-emerald-400">
            {" > Service started."}
            <br />
            {" > Bot ID: 7122..."}
          </div>
        </div>
      </div>
    </div>,
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-bold">Services</h4>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[9px] border-emerald-200 text-emerald-700 bg-emerald-50"
        >
          NEW
        </Button>
      </div>
      {[
        { n: "Telegram Bot", s: "Running", p: 12, c: "text-emerald-600" },
        { n: "FastAPI Server", s: "Active", p: 80, c: "text-emerald-500" },
        { n: "Cron Worker", s: "Sleeping", p: 0, c: "text-slate-400" },
      ].map((item, i) => (
        <div key={i} className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">{item.n}</span>
            <span className={`text-[9px] uppercase font-mono ${item.c}`}>{item.s}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${item.p}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      ))}
    </div>,
    <div className="p-6 text-slate-900">
      <div className="mb-6">
        <h4 className="text-lg font-bold">Analytics</h4>
        <p className="text-[10px] text-slate-500">Resource usage over 24h</p>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="text-[9px] uppercase text-slate-500">Battery</span>
          <p className="text-xl font-bold">84%</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <span className="text-[9px] uppercase text-slate-500">Temp</span>
          <p className="text-xl font-bold">32°C</p>
        </div>
      </div>
      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <div className="absolute inset-0 flex items-end gap-1 p-2">
          {[40, 60, 45, 90, 65, 80, 55, 70, 40, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-emerald-100" style={{ height: `${h}%` }}>
              <div
                className="w-full rounded-t-sm bg-emerald-500"
                style={{ height: `${h * 0.4}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <motion.div
      whileHover={{ y: -10, rotateX: 5, rotateY: -5 }}
      className="relative mx-auto w-full max-w-[280px]"
    >
      <div className="absolute -inset-4 opacity-0 transition-opacity rounded-[3rem] bg-emerald-100 blur-2xl group-hover:opacity-100" />
      <div className="relative aspect-[9/19] overflow-hidden rounded-[3rem] border-8 border-slate-900 bg-slate-900 shadow-2xl">
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
        <div className="h-full w-full bg-slate-50 pt-6 text-slate-900">{screens[screen]}</div>
      </div>
      <div className="mt-8 text-center lg:hidden">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{desc}</p>
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  copy: string;
  code: string;
  snippet: string;
  index: number;
}

function FeatureCard({ icon: Icon, label, copy, code, snippet, index }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
    cardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      whileHover={{ scale: 1.02 }}
      className="reveal group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-emerald-400 hover:shadow-lg"
    >
      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(16,185,129,0.1),transparent_40%)] group-hover:opacity-100" />

      <div className="relative z-20 mb-12 flex items-start justify-between">
        <motion.div
          animate={isHovered ? { y: [0, -5, 0], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="grid h-12 w-12 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-all group-hover:bg-emerald-100 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          <Icon className="h-6 w-6" />
        </motion.div>
        <span className="font-mono text-[9px] uppercase tracking-[.2em] text-slate-400 opacity-50">
          0{index + 1} // {code}
        </span>
      </div>

      <h3 className="relative z-20 text-xl font-bold tracking-tight text-slate-900">{label}</h3>
      <p className="relative z-20 mt-4 text-sm leading-relaxed text-slate-500 transition-colors group-hover:text-slate-700">
        {copy}
      </p>

      <div className="relative z-20 mt-8">
        <pre className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-3 font-mono text-[10px] leading-tight text-emerald-600/60">
          {snippet}
        </pre>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 z-20 h-1 w-0 bg-emerald-500 transition-all group-hover:w-full"
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: release } = useGithubRelease();

  const repoUrl = "https://github.com/nhut0902-pr/SEVER-MINI-APP-BOT";
  const apkAsset = release?.assets.find((asset) => asset.name.endsWith(".apk"));
  const downloadUrl = apkAsset?.browser_download_url || `${repoUrl}/releases/latest`;
  const version = release?.tag_name || "v1.0";
  const fileSize = apkAsset ? `${(apkAsset.size / (1024 * 1024)).toFixed(1)} MB` : "14 MB";

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) =>
        gsap.from(element, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-emerald-200"
    >
      <motion.div
        style={{ scaleX: springScroll }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-emerald-500"
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-2xl">
        <nav
          className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center px-5 lg:px-8"
          aria-label="Main navigation"
        >
          <a href="#top" className="group flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white transition-all group-hover:border-emerald-500 group-hover:shadow-lg">
              <img
                src="/logo-web.png"
                alt="Android Server Mini Logo"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="truncate font-mono text-sm font-bold tracking-tight text-slate-900">
              ANDROID SERVER <i className="not-italic text-emerald-600">MINI</i>
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Terminal", "Architecture", "Performance"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-mono text-[10px] uppercase tracking-widest text-slate-400 transition-colors hover:text-emerald-600"
              >
                {item}
              </a>
            ))}
            <Button
              asChild
              className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <a href="#download">
                <ArrowDownToLine className="h-4 w-4" /> Download
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
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-200 bg-white p-5 md:hidden"
            >
              {["Features", "Terminal", "Architecture", "Performance", "Download"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-slate-100 py-4 font-mono text-sm uppercase tracking-widest text-slate-500"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <HeroScene />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-slate-50" />

          <div className="relative z-20 mx-auto w-full max-w-7xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-3xl lg:max-w-[650px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-700 backdrop-blur-md"
              >
                <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                Runtime online · {version}
              </motion.div>
              <h1 className="text-6xl font-bold leading-[0.95] tracking-[-0.06em] text-slate-900 sm:text-8xl lg:text-[6rem]">
                Your Android is <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                  More Powerful
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
                Run production-grade Python scripts, Telegram bots and HTTP APIs directly from your
                pocket.
                <span className="text-slate-900 font-semibold">
                  {" "}
                  No VPS required. No compromises.
                </span>
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl"
                >
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5" /> Download APK{" "}
                    <span className="ml-2 font-mono text-xs font-normal opacity-60">{version}</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 border-slate-200 px-8 text-base hover:bg-slate-100"
                >
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" /> GitHub
                  </a>
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Open source
                </span>
                <span className="flex items-center gap-2.5">
                  <Smartphone className="h-4 w-4 text-emerald-600" /> Android 8+
                </span>
                <span className="flex items-center gap-2.5">
                  <Zap className="h-4 w-4 text-emerald-600" /> {fileSize}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="font-mono text-[9px] uppercase tracking-[.4em] text-slate-400"
            >
              Scroll to explore
              <span className="mx-auto mt-4 block h-12 w-px bg-gradient-to-b from-emerald-500 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="relative z-10 px-5 py-32 lg:px-8 lg:py-48 bg-white">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Capabilities"
              title="A complete server stack."
              copy="Purpose-built components designed for maximum performance on mobile hardware."
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* TERMINAL SECTION */}
        <section
          id="terminal"
          className="relative overflow-hidden border-y border-slate-100 bg-slate-50 px-5 py-32 lg:px-8 lg:py-48"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-[1fr_1.2fr]">
            <div className="reveal">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                <TerminalIcon className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Warp-speed <br />
                <span className="text-emerald-600">Control Center.</span>
              </h2>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-600">
                Manage your services with a professional-grade terminal. Real-time feedback,
                interactive commands, and zero latency.
              </p>
              <div className="mt-12 space-y-6">
                {[
                  {
                    t: "Isolated Environment",
                    d: "Each script runs in a protected workspace.",
                    i: ShieldCheck,
                  },
                  { t: "Live Logs", d: "Watch your code execute in real-time.", i: Activity },
                  {
                    t: "Package Management",
                    d: "Standard pip support for all libraries.",
                    i: Package,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <item.i className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.t}</h4>
                      <p className="text-sm text-slate-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal perspective-[2000px]">
              <motion.div
                whileHover={{ rotateY: -10, rotateX: 5 }}
                className="transition-all duration-500"
              >
                <WarpTerminal />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE SECTION */}
        <section
          id="architecture"
          className="relative overflow-hidden px-5 py-32 lg:px-8 lg:py-48 bg-white"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)]" />
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Architecture"
              title="Built for the Edge."
              copy="A modular service-oriented architecture that bridges native Android power with Python flexibility."
            />
            <ArchFlow />
          </div>
        </section>

        {/* PERFORMANCE SECTION */}
        <section
          id="performance"
          className="relative border-y border-slate-100 bg-slate-50 px-5 py-32 lg:px-8 lg:py-48"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Telemetry"
              title="Real-time Vitals."
              copy="Monitor every resource with sub-second precision. No overhead, just pure visibility."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              <PerformanceCard
                icon={Cpu}
                label="CPU Usage"
                value="12.4"
                unit="%"
                status="4 Cores Active"
                color="text-emerald-600"
              />
              <PerformanceCard
                icon={HardDrive}
                label="RAM Usage"
                value="156"
                unit="MB"
                status="System Limit: 8GB"
                color="text-amber-500"
              />
              <PerformanceCard
                icon={Network}
                label="Network"
                value="1.8"
                unit="MB/s"
                status="Latency: 14ms"
                color="text-blue-500"
              />
              <PerformanceCard
                icon={BatteryCharging}
                label="Power"
                value="84"
                unit="%"
                status="Optimized Drain"
                color="text-emerald-500"
              />
              <PerformanceCard
                icon={Radio}
                label="Uptime"
                value="14"
                unit="d"
                status="SLA: 99.99%"
                color="text-purple-500"
              />
            </div>
          </div>
        </section>

        {/* SCREENSHOTS SECTION */}
        <section className="relative overflow-hidden px-5 py-32 lg:px-8 lg:py-48 bg-white">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Interface"
              title="Designed for Clarity."
              copy="A minimalist, powerful UI that puts your server's status front and center."
            />
            <div className="reveal grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <PhoneMockup
                screen={0}
                title="Unified Terminal"
                desc="Run commands and view logs in one place."
              />
              <PhoneMockup
                screen={1}
                title="Service Manager"
                desc="Control multiple background processes."
              />
              <PhoneMockup
                screen={2}
                title="Live Analytics"
                desc="Understand hardware impact at a glance."
              />
            </div>
          </div>
        </section>

        {/* DOWNLOAD SECTION */}
        <section
          id="download"
          className="relative overflow-hidden px-5 py-48 lg:px-8 lg:py-64 bg-slate-50"
        >
          <div className="reveal relative z-10 mx-auto max-w-4xl text-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-10 grid h-24 w-24 place-items-center rounded-3xl border border-emerald-200 bg-white text-emerald-600 shadow-xl"
            >
              <Box className="h-10 w-10" />
            </motion.div>
            <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              Ready to <span className="text-emerald-600">Deploy?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-slate-600">
              Join thousands of developers running production workloads on Android. Start your first
              server in minutes.
            </p>
            <div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-16 px-10 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl"
              >
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-3 h-6 w-6 transition-transform group-hover:translate-y-1" />{" "}
                  Get APK Now
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 border-slate-200 bg-white px-10 text-lg hover:bg-slate-50"
              >
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-3 h-6 w-6" /> Source Code
                </a>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
              <span>{version}</span>
              <span className="h-1 w-1 rounded-full bg-slate-200" />
              <span>ARM64 ONLY</span>
              <span className="h-1 w-1 rounded-full bg-slate-200" />
              <span>{fileSize}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-slate-200 bg-white px-5 py-20 lg:px-8 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
            <div className="space-y-8">
              <a href="#top" className="group flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white transition-all group-hover:border-emerald-500">
                  <img src="/logo-web.png" alt="" className="h-full w-full object-cover" />
                </span>
                <span className="font-mono text-sm font-bold uppercase tracking-tighter text-slate-900">
                  Android Server <span className="text-emerald-600">Mini</span>
                </span>
              </a>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                The ultimate toolkit for mobile server infrastructure. Built for stability,
                performance, and simplicity.
              </p>
              <div className="flex gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                  onClick={() => window.open(repoUrl, "_blank")}
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                  onClick={() => window.open("https://nhutcoder.com", "_blank")}
                >
                  <Globe2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-20 sm:grid-cols-2">
              {[
                {
                  t: "Platform",
                  l: [
                    { n: "Features", h: "#features" },
                    { n: "Terminal", h: "#terminal" },
                    { n: "Download", h: "#download" },
                  ],
                },
                {
                  t: "Resources",
                  l: [
                    { n: "GitHub", h: repoUrl },
                    { n: "Releases", h: `${repoUrl}/releases` },
                  ],
                },
              ].map((group, i) => (
                <div key={i}>
                  <h4 className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-900">
                    {group.t}
                  </h4>
                  <ul className="space-y-4">
                    {group.l.map((link, j) => (
                      <li key={j}>
                        <a
                          href={link.h}
                          target={link.h.startsWith("http") ? "_blank" : "_self"}
                          className="text-xs text-slate-500 transition-colors hover:text-emerald-600 flex items-center gap-1"
                        >
                          {link.n}{" "}
                          {link.h.startsWith("http") && <ExternalLink className="w-2.5 h-2.5" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-10 border-t border-slate-100 pt-12 sm:flex-row">
            <div className="flex items-center gap-5">
              <img src="/logo-powered.png" alt="Nhutcoder Team Logo" className="h-10 w-auto" />
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                  Powered By
                </p>
                <p className="text-xs font-bold text-slate-700">Nhutcoder Team</p>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              © 2024 Android Server Mini · Made with passion by Nhutcoder Team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
