"use client";

import React, { useMemo, useState, ReactNode, ReactElement, isValidElement, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Rocket, GraduationCap, Coins, CreditCard, Users2, Share2, Shield,
  Briefcase, Search, Star, ArrowRight, Globe, CalendarClock, Info, Sparkles,
  Menu, X
} from "lucide-react";


/* -------------------- CONSTANTS -------------------- */
const LAUNCH_WINDOW = "Launching Winter 2025";
const BETA_PHASE = "Beta Phase 0 (invite-only)";

/* -------------------- MOCK DATA -------------------- */
type Project = {
  id: string;
  title: string;
  school: string;
  blurb: string;
  goal: number;
  raised: number;
  tags: string[];
  href: string;
};

type UserCard = {
  id: string;
  name: string;
  school: string;
  headline: string;
  skills: string[];
  avatar: string;
};

const MOCK_STATS = {
  active_projects: 70,
  funds_raised_k: 10,
  active_users: 200,
} as const;

const MOCK_PROJECTS: Project[] = [
  {
    id: "p-cpe-01",
    title: "Autonomous Home Robotic Assistant",
    school: "CSUS",
    blurb: "An autonomous robot designed to assist with household tasks using computer vision and AI.",
    goal: 2000,
    raised: 200,
    tags: ["Computer", "Circuit Design", "CAD Modeling"],
    href: "/",
  },
  {
    id: "p-ece-01",
    title: "Enviroment Monitoring Drone",
    school: "CSUS",
    blurb: "A drone equipped with sensors to monitor air quality and environmental conditions in urban areas.",
    goal: 3000,
    raised: 550,
    tags: ["Electrical", "AI", "Embedded"],
    href: "/",
  },
  {
    id: "p-soft-01",
    title: "Inventory Management System",
    school: "CSUS",
    blurb: "A web-based inventory management system for businesses to track stock levels, orders, and deliveries.",
    goal: 2000,
    raised: 2000,
    tags: ["Software", "Cloud Architecture", "Python"],
    href: "/",
  },
];

const MOCK_USERS: UserCard[] = [
  { id: "u1", name: "Avery Lin", school: "CSUS", headline: "Robotics + Controls", skills: ["ROS2", "SLAM", "C++"], avatar: "/Bob.jpg" },
  { id: "u2", name: "Marcus Ortiz", school: "CSUS", headline: "Full-Stack + Web3", skills: ["Next.js", "Solidity", "Postgres"], avatar: "/Bob1.jpg" },
  { id: "u3", name: "Priya Sharma", school: "CSUS", headline: "Computer Vision Engineer", skills: ["PyTorch", "OpenCV", "TensorRT"], avatar: "/Bob2.jpg" },
  { id: "u4", name: "Diego Ruiz", school: "CSUS", headline: "Embedded + DSP", skills: ["STM32", "FreeRTOS", "C"], avatar: "/Bob3.jpg" },
];

const SKILL_FILTERS = ["Embedded Systems", "AI/ML", "Robotics", "Computer Vision", "Web3", "Cloud & DevOps"] as const;

/* -------------------- SMALL INLINE UI (light-only, forest-green accents) -------------------- */
const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden" aria-label="progress">
    <div className="h-full bg-emerald-700" style={{ width: `${value}%` }} />
  </div>
);

type BadgeProps = { children: ReactNode; variant?: "default" | "secondary" | "outline" | "school"; className?: string; };

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
  const styles =
    variant === "secondary"
      ? "bg-slate-100 text-slate-900 border-transparent"
      : variant === "outline"
      ? "bg-white text-slate-900 border-slate-200"
      : variant === "school"
      ? "bg-emerald-700 text-yellow-300 border-emerald-800"
      : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
};


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode | ReactElement;
  asChild?: boolean;
  variant?: "default" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600";
  const sizes = { md: "h-10 px-4", lg: "h-12 px-6 text-base" } as const;
  const variants =
    variant === "secondary"
      ? "border-slate-300 text-slate-900 hover:bg-slate-300"
      : variant === "ghost"
      ? "border-transparent text-slate-900 hover:bg-slate-100"
      : "border-emerald-700 text-emerald-800 hover:bg-green-200";
  const classes = `${base} ${sizes[size]} ${variants} ${className}`;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: `${classes} ${child.props.className ?? ""}`,
      ...props,
    });
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};


const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm ${className}`}>{children}</div>
);
const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => <p className={`text-sm text-slate-600 ${className}`}>{children}</p>;
const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input
    className={`h-10 w-full rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${className}`}
    {...props}
  />
);

/* Spotlight user inline */
const SpotlightUsersInline: React.FC<{ users: UserCard[] }> = ({ users }) => (
  <CardContent className="grid sm:grid-cols-2 gap-4">
    {users.map((u) => (
      <div
        key={u.id}
        className="
          flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-white
          transition-all duration-200 ease-in-out
          hover:border-emerald-600 hover:shadow-md
        "
      >
        <Image
          src={u.avatar}
          alt={`${u.name} avatar`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover border border-slate-200"
        />
        <div className="min-w-0">
          <div className="font-medium text-slate-900 truncate">{u.name}</div>
          <div className="text-xs text-slate-600 truncate">
            {u.school} · {u.headline}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {u.skills.slice(0, 3).map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="text-[10px] px-2 py-0.5"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ))}
  </CardContent>
);


const ProjectCard: React.FC<{ p: Project }> = ({ p }) => {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));

  return (
    <Link
      href={p.href}
      className="block focus:outline-none"
      aria-label={`View ${p.title}`}
    >
      <Card
        className={`
          border border-emerald-200 
          hover:border-emerald-700 
          hover:shadow-lg 
          transition-all 
          duration-200 
          ease-in-out
        `}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{p.title}</CardTitle>
            <Badge variant="school" className="gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-yellow-300" /> {p.school}
            </Badge>
          </div>
          <CardDescription className="mt-4">{p.blurb}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <ProgressBar value={pct} />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-900">
              ${p.raised.toLocaleString()} raised
            </span>
            <span className="text-slate-600">
              of ${p.goal.toLocaleString()} goal
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full gap-2">
            View Project <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

/* -------------------- PAGE -------------------- */
export default function CrowdXLandingDemoSimple() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [hash, setHash] = useState<string>(typeof window !== "undefined" ? window.location.hash : "");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isActive = (target: string) => (target.startsWith("#") ? hash === target : pathname === target);

  const searchedProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_PROJECTS;
    return MOCK_PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const noResults = searchedProjects.length === 0;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
           <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-slate-200">

        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="size-8 grid place-items-center rounded-xl bg-emerald-600/10">
              <Sparkles className="w-4 h-4 text-emerald-800" />
            </div>
            <Link href="/" className="font-extrabold tracking-tight text-slate-900 text-lg">
              CrowdX
            </Link>
          </div>

          {/* Center: Nav Links (desktop) */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex gap-8 text-base font-medium">
              <Link
                href="/#features"
                className={`text-slate-900/90 hover:text-emerald-800 ${
                  isActive("#features") ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                Students
              </Link>

              <Link
                href="/#recruiters"
                className={`text-slate-900/90 hover:text-emerald-800 ${
                  isActive("#recruiters") ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                Recruiters
              </Link>
              <Link
                href="/#faq"
                className={`text-slate-900/90 hover:text-emerald-800 ${
                  isActive("#faq") ? "text-emerald-800 font-semibold" : ""
                }`}
              >
                FAQ
              </Link>
            </div>
          </nav>

          {/* Right: Buttons (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            
            <Button className="gap-1" asChild>
              <Link href="/signup_proff">
                Reserve Your Spot <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-slate-200 ${
            mobileOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-2">
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-100 ${
                isActive("#features") ? "text-emerald-800" : ""
              }`}
            >
              Students
            </Link>

            <Link
              href="/#recruiters"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-100 ${
                isActive("#recruiters") ? "text-emerald-800" : ""
              }`}
            >
              Recruiters
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-100 ${
                isActive("#faq") ? "text-emerald-800" : ""
              }`}
            >
              FAQ
            </Link>

            <div className="pt-2 flex items-center gap-2">

              <Button asChild className="flex-1">
                <Link href="/signup_proff" onClick={() => setMobileOpen(false)}>
                  Reserve Your Spot <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Launch banner (single accent strip) */}
      <div className="w-full bg-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
          <CalendarClock className="w-4 h-4" aria-hidden />
          <span><strong> {LAUNCH_WINDOW}</strong> — Early users get priority access</span>
        </div>
      </div>



      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-10">
            <div className="flex flex-wrap gap-2">
              <Badge className="w-fit" variant="secondary">Designed for Students · Driven by Community</Badge>
              <Badge className="w-fit"><CalendarClock className="w-3.5 h-3.5 mr-1" /> {LAUNCH_WINDOW}</Badge>
            </div>

            <h1 className="text-6xl md:text-5xl font-extrabold leading-tight tracking-tight text-center md:text-left">
              <span className="block">Mentor & Inspire</span>
              <span className="block text-emerald-800">Showcase Your Build</span>
              <span className="block">Recruit by Results</span>
            </h1>


            <p className="text-slate-700 text-lg">
              A platform where students showcase projects, prove their skills, and connect with student collaborators and professionals.
              The community brings together opportunities, funding, and recognition.
              <br /><br />
              <strong className="text-slate-900">We’re preparing for Winter 2025.</strong> Currently in Beta Phase 1, we’re inviting engineering students and professionals to join our initial launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2" onClick={() => router.push("/signup")}>
                <Rocket className="w-4 h-4" /> Engineering Student
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/signup_proff")}>
                <Users2 className="w-4 h-4" /> Join as a Professional
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <Stat label="Projected Projects" value={`${MOCK_STATS.active_projects}+`} />
              <Stat label="Projected Funds Raised" value={`${MOCK_STATS.funds_raised_k}k`} />
              <Stat label="Projected Active Users" value={`${MOCK_STATS.active_users}+`} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Card className="rounded-3xl border-slate-200 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-800" /> Project Spotlight
                </CardTitle>
                <CardDescription>Standout campaigns from across campuses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {MOCK_PROJECTS.slice(0, 3).map((p) => (
                    <Link key={p.id} href={p.href} className="block" aria-label={`Open ${p.title}`}>
                      <div
                        className={`
                          p-4 rounded-2xl border border-gray-300 bg-white 
                          hover:border-emerald-700 
                          hover:shadow-lg 
                          transition-all 
                          duration-200 
                          ease-in-out 
                          cursor-pointer
                        `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{p.title}</div>
                            <div className="text-sm text-slate-600">{p.blurb}</div>
                          </div>
                          <Badge variant="secondary">{p.tags[0]}</Badge>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={Math.round((p.raised / p.goal) * 100)} />
                          <div className="mt-2 text-xs text-slate-600 flex justify-between">
                            <span>${p.raised.toLocaleString()} raised</span>
                            <span>${p.goal.toLocaleString()} goal</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button className="flex-1" onClick={() => router.push("/signup_proff")}>See All</Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Badge className="gap-1" variant="outline"><Coins className="w-3.5 h-3.5" /> Crypto</Badge>
                <Badge className="gap-1" variant="outline"><CreditCard className="w-3.5 h-3.5" /> Fiat</Badge>
                <Badge className="gap-1" variant="outline"><Shield className="w-3.5 h-3.5" /> Secure</Badge>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How the Beta Works */}
      <section id="beta" className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="rounded-3xl">
            <CardHeader className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-800" />
              <div>
                <CardTitle>How the Beta Phase 1 Works</CardTitle>
                <CardDescription>Transparent expectations before launch</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-sm text-slate-700">
              <div>
                <div className="font-semibold mb-1">1) Collection of Projects</div>
                <p>Students will be able to upload basic information about their projects. We will filter and showcase projects with clearly defined goals, descriptions, and demonstrated skills.</p>
              </div>
              <div>
                <div className="font-semibold mb-1">2) Network of Professionals</div>
                <p>We are building a community of engineers and industry professionals who want to mentor, support, or explore student inovation. </p>
              </div>
              <div>
                <div className="font-semibold mb-1">3) Platform Launch Access </div>
                <p>Early participants will gain access to explore talent, connect with teams, and experience how real innovation comes to life on CrowdX.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2 flex-1" onClick={() => router.push("/signup")}>
                <Rocket className="w-4 h-4" /> Join as Student
              </Button>
              <Button size="lg" variant="secondary" className="gap-2 flex-1" onClick={() => router.push("/signup_proff")}>
                <Briefcase className="w-4 h-4" /> Join as Professional 
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Share2 className="w-5 h-5" /> Showcase Your Build</CardTitle>
                <CardDescription>Post updates, demos, and current progress</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Turn your senior design project into a living portfolio where the world can see what you’re working on.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5" /> Fund with Cash or Crypto</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Supporters can fuel your project with credit/debit cards or popular crypto wallets—fast, easy, secure.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Get Discovered by Recruiters</CardTitle>
                <CardDescription>Talent-first project profiles</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Your project deserves an audience. Let recruiters and peers see what you’ve created.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search projects, skills, tech…"
                className="w-72"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search projects"
              />
              <Button onClick={() => router.push("/signup_proff")}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {noResults && <div className="text-sm text-slate-600 mb-4">No matching results.</div>}

          <div className="grid md:grid-cols-3 gap-6">
            {searchedProjects.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 p-6 animate-pulse h-48 bg-white" />
                ))
              : searchedProjects.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>

          <div className="mt-6 flex md:hidden items-center gap-2">
            <Input
              placeholder="Search projects, skills, tech…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search projects"
            />
            <Button className="gap-2" onClick={() => router.push("/signup_proff")}>
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>
      </section>

      {/* Recruiters hub */}
      <section id="recruiters" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">Recruiters Hub</Badge>
              <h3 className="text-3xl font-bold tracking-tight">Discover emerging talent by real shipped projects.</h3>
              <p className="text-slate-700">
                Explore projects by skill, technology, and impact. Engage with students, follow their progress, and contribute your expertise to help them grow.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {SKILL_FILTERS.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>
                ))}
              </div>
              <div className="pt-4 flex gap-2">
                <Button className="gap-2" onClick={() => router.push("/signup_proff")}><Search className="w-10 h-4" />Explore Talent</Button>
              </div>
              <p className="text-xs text-slate-500 pt-2">Reserve your space as a professional before our Winter 2025 launch.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Candidate Spotlight</CardTitle>
                <CardDescription>Signal over noise—projects prove skills.</CardDescription>
              </CardHeader>
              <SpotlightUsersInline users={MOCK_USERS} />
            </Card>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="rounded-3xl border-emerald-200 bg-emerald-50">
            <CardContent className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="mt-6 text-2xl font-bold">Ready to launch your project?</h4>
                <p className="text-slate-700">Create a campaign in minutes. Share progress. Get funded. Get noticed.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button size="lg" className="gap-2" onClick={() => router.push("/signup")}>
                  <Rocket className="w-4 h-4" /> Share Your Project
                </Button>
                <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/signup_proff")}>
                  <Coins className="w-4 h-4" /> Explore Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h3>
            <p className="text-slate-700">Answers to common questions about payments, safety, and eligibility.</p>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How do payments work?</CardTitle>
                <CardDescription>Payments are securely processed through Stripe. Cryptocurrency transactions will also be supported through verified digital wallets.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Who can launch a campaign?</CardTitle>
                <CardDescription>Current students and recent grads with verifiable projects.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Is CrowdX safe?</CardTitle>
                <CardDescription>CrowdX verifies both student and professional identities before allowing users to create or join an organization.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">When is launch?</CardTitle>
                <CardDescription>We’re targeting <strong>{LAUNCH_WINDOW}</strong>. Join today for earlier access.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
