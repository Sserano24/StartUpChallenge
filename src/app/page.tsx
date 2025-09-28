"use client";

import React, { useMemo, useState, ReactNode, ReactElement, isValidElement } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Rocket, GraduationCap, Coins, CreditCard, Users2, Share2, Shield,
  Briefcase, Search, Star, ArrowRight, Globe
} from "lucide-react";

/* -------------------- MOCK DATA -------------------- */
type Project = {
  id: string;
  title: string;
  school: string;
  blurb: string;
  goal: number;
  raised: number;
  tags: string[];
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
  active_projects: 128,
  funds_raised_k: 312,
  active_creators: 487,
} as const;

const MOCK_PROJECTS: Project[] = [
  // Mechanical Engineering
  {
    id: "p-mech-01",
    title: "Human-Powered Water Purifier Cart",
    school: "CSUS",
    blurb:
      "Pedal-driven pump and inline multi-stage filter mounted on a welded steel frame for campus event hydration and emergency use.",
    goal: 4800,
    raised: 3100,
    tags: ["Mechanical", "CAD/CAM", "Manufacturing"],
  },
  // Electrical & Computer Engineering
  {
    id: "p-ece-01",
    title: "Solar Microinverter with MPPT",
    school: "CSUS",
    blurb:
      "200W DC–AC microinverter featuring synchronous rectification and perturb-and-observe MPPT on an STM32 with isolated gate drivers.",
    goal: 6200,
    raised: 4025,
    tags: ["Electrical", "Power Electronics", "Embedded"],
  },
  // Software Engineering
  {
    id: "p-soft-01",
    title: "Campus Navigation App with Indoor Positioning",
    school: "CSUS",
    blurb:
      "Next.js + Expo app using BLE beacons and graph routing to guide students to classrooms, labs, and accessible entrances.",
    goal: 3500,
    raised: 2140,
    tags: ["Software", "Mobile", "Next.js"],
  },
  // Civil Engineering
  {
    id: "p-civil-01",
    title: "Smart Concrete Curing Monitor",
    school: "CSUS",
    blurb:
      "Low-cost sensor nodes log humidity/temperature in curing slabs; data dashboards estimate strength gain to optimize pour schedules.",
    goal: 5400,
    raised: 2875,
    tags: ["Civil", "IoT", "Data Logging"],
  },
  // Biomedical Engineering
  {
    id: "p-bme-01",
    title: "Open-Source EMG Forearm Trainer",
    school: "CSUS",
    blurb:
      "3D-printed exosleeve with surface EMG, Teensy MCU, and biofeedback game to aid rehab and grip-strength training.",
    goal: 7800,
    raised: 5660,
    tags: ["Biomedical", "3D Printing", "Embedded"],
  },
  // Environmental Engineering
  {
    id: "p-env-01",
    title: "LoRa Air Quality Mesh for Campus",
    school: "CSUS",
    blurb:
      "Distributed PM2.5/NO₂ sensors report via LoRaWAN to a public map; enclosure designed for year-round Sacramento weather.",
    goal: 4200,
    raised: 1980,
    tags: ["Environmental", "LoRaWAN", "Sensors"],
  },
  // Aerospace / Mechatronics
  {
    id: "p-aero-01",
    title: "VTOL Drone for Roof Inspection",
    school: "CSUS",
    blurb:
      "Tilt-rotor VTOL with carbon arms, PX4 flight stack, and YOLOv8 edge inference for detecting cracked shingles and pooling water.",
    goal: 9600,
    raised: 6125,
    tags: ["Aerospace", "Robotics", "Computer Vision"],
  },
  // Industrial & Systems
  {
    id: "p-ind-01",
    title: "Smart Kanban Shelves for the Machine Shop",
    school: "CSUS",
    blurb:
      "Load cells + ESP32 track inventory of fasteners and cutters; webhook to auto-reorder and visualize stockouts.",
    goal: 2700,
    raised: 1530,
    tags: ["Industrial", "IoT", "Operations"],
  },
  // Materials / Electrical
  {
    id: "p-mat-01",
    title: "Flexible OLED Repair Station",
    school: "CSUS",
    blurb:
      "Budget glovebox with nitrogen purge, hot-plate reflow profile, and microscope mount to practice flex-OLED trace repair.",
    goal: 6900,
    raised: 3220,
    tags: ["Materials", "Electronics", "Lab Equipment"],
  },
];

const MOCK_USERS: UserCard[] = [
  {
    id: "u1",
    name: "Avery Lin",
    school: "CSUS",
    headline: "Robotics + Controls",
    skills: ["ROS2", "SLAM", "C++"],
    avatar: "/Bob.jpg",
  },
  {
    id: "u2",
    name: "Marcus Ortiz",
    school: "CSUS",
    headline: "Full-Stack + Web3",
    skills: ["Next.js", "Solidity", "Postgres"],
    avatar: "/Bob1.jpg",
  },
  {
    id: "u3",
    name: "Priya Sharma",
    school: "CSUS",
    headline: "Computer Vision Engineer",
    skills: ["PyTorch", "OpenCV", "TensorRT"],
    avatar: "/Bob2.jpg",
  },
  {
    id: "u4",
    name: "Diego Ruiz",
    school: "CSUS",
    headline: "Embedded + DSP",
    skills: ["STM32", "FreeRTOS", "C"],
    avatar: "/Bob3.jpg",
  },
];

const SKILL_FILTERS = ["Embedded Systems", "AI/ML", "Robotics", "Computer Vision", "Web3", "Cloud & DevOps"] as const;

/* -------------------- SMALL INLINE UI (LIGHT) -------------------- */
const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden" aria-label="progress">
    <div className="h-full bg-blue-600" style={{ width: `${value}%` }} />
  </div>
);

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
};
const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
  const styles =
    variant === "secondary"
      ? "bg-slate-100 text-slate-900 border-transparent"
      : variant === "outline"
      ? "bg-white text-slate-900 border-slate-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode | ReactElement;
  asChild?: boolean;
  variant?: "default" | "secondary";
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
  const base = "inline-flex items-center justify-center font-medium rounded-2xl transition-colors";
  const sizes = { md: "h-10 px-4", lg: "h-12 px-6 text-base" } as const;
  const variants =
    variant === "secondary"
      ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const classes = `${base} ${sizes[size]} ${variants} ${className}`;

  if (asChild && isValidElement(children)) {
    // Strongly type child to expose an optional className
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
    className={`h-10 w-full rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    {...props}
  />
);

/* Spotlight user inline */
const SpotlightUsersInline: React.FC<{ users: UserCard[] }> = ({ users }) => (
  <CardContent className="grid sm:grid-cols-2 gap-4">
    {users.map((u) => (
      <div key={u.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-white">
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
              <Badge key={s} variant="outline" className="text-[10px] px-2 py-0.5">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ))}
  </CardContent>
);

/* Project card inline */
const ProjectCard: React.FC<{ p: Project }> = ({ p }) => {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{p.title}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> {p.school}
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
          <span className="font-medium text-slate-900">${p.raised.toLocaleString()} raised</span>
          <span className="text-slate-600">of ${p.goal.toLocaleString()} goal</span>
        </div>
      </CardContent>
      <CardFooter>
        {/* always go to /signup */}
        <Button asChild className="w-full gap-2" aria-label={`View project ${p.title}`}>
          <Link href="/signup">
            View Project <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

/* -------------------- PAGE -------------------- */
export default function CrowdXLandingDemoSimple() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="space-y-10"
          >
            <Badge className="w-fit" variant="secondary">
              Designed for Students · Driven by Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              <span className="block">Fund Innovation</span>
              <span className="block text-blue-700">Fuel Student Projects</span>
              <span className="block">Discover Talent</span>
            </h1>
            <p className="text-slate-600 text-lg">
              A platform where students can showcase their projects, receive feedback from peers and industry professionals, and connect with potential collaborators, mentors, or partners. The community also serves as a gateway to funding opportunities, investments, and valuable resources that help bring innovative ideas to life.
              <br />
              <br />
              Currently in BETA PHASE 0. Sign ups are encouraged.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2" onClick={() => router.push("/signup")}>
                <Rocket className="w-4 h-4" /> Engineering Student
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/signup")}>
                <Users2 className="w-4 h-4" /> Join as a Contributor
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <Stat label="Active Projects" value={MOCK_STATS.active_projects} />
              <Stat label="Funds Raised" value={`${MOCK_STATS.funds_raised_k}k`} />
              <Stat label="Active Creators" value={MOCK_STATS.active_creators} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Card className="rounded-3xl border-slate-200 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-700" /> Project Spotlight
                </CardTitle>
                <CardDescription>Standout campaigns from across campuses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {MOCK_PROJECTS.slice(0, 3).map((p) => (
                    <Link key={p.id} href="/signup" className="block" aria-label={`Open ${p.title} (requires signup)`}>
                      <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
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
                  <Button className="flex-1" onClick={() => router.push("/signup")}>See All</Button>
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
              <Button onClick={() => router.push("/signup")}>
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
            <Button className="gap-2" onClick={() => router.push("/signup")}>
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
              <p className="text-slate-600">
                Browse by skills, technology, impact, and campus. Track progress, request interviews, and sponsor capstone teams.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {SKILL_FILTERS.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>
                ))}
              </div>
              <div className="pt-4 flex gap-3">
                <Button className="gap-2" onClick={() => router.push("/signup")}><Search className="w-4 h-4" /> Explore Talent</Button>
                <Button variant="secondary" className="gap-2" onClick={() => router.push("/signup")}><Star className="w-4 h-4" /> Sponsor a Team</Button>
              </div>
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
          <Card className="rounded-3xl border-blue-200 bg-blue-50">
            <CardContent className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="mt-6 text-2xl font-bold">Ready to launch your project?</h4>
                <p className="text-slate-700">Create a campaign in minutes. Share progress. Get funded. Get noticed.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button size="lg" className="gap-2" onClick={() => router.push("/signup")}>
                  <Rocket className="w-4 h-4" /> Start a Campaign
                </Button>
                <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/signup")}>
                  <Coins className="w-4 h-4" /> Fund a Project
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
            <p className="text-slate-600">Answers to common questions about payments, safety, and eligibility.</p>
          </div>
          <div className="space-y-4">
            <Card><CardHeader><CardTitle className="text-base">How do payments work?</CardTitle><CardDescription>Fiat via Stripe; crypto via online wallets.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">Who can launch a campaign?</CardTitle><CardDescription>Current students and recent grads with verifiable projects.</CardDescription></CardHeader></Card>
            <Card><CardHeader><CardTitle className="text-base">Is CrowdX safe?</CardTitle><CardDescription>We use escrow, milestone payouts, and project verification to reduce risk.</CardDescription></CardHeader></Card>
          </div>
        </div>
      </section>
    </div>
  );
}
