// src/app/campaigns/[id]/page.jsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Coins,
  CreditCard,
  GraduationCap,
  Shield,
  Tag,
  Calendar,
  Users2,
  Sparkles,
} from "lucide-react";

/* -------------------- Inline UI primitives (no external component imports) -------------------- */
/* -------------------- Inline UI primitives (typed) -------------------- */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-2xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<ButtonProps> = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-2xl font-medium transition-colors bg-slate-200 text-slate-900 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

type CardProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm ${className}`}>{children}</div>
);

export const CardHeader: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ className = "", children }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<CardProps> = ({ className = "", children }) => (
  <p className={`text-sm text-slate-600 ${className}`}>{children}</p>
);

export const CardContent: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

type BadgeProps = {
  className?: string;
  variant?: "default" | "secondary" | "outline";
  children?: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({ className = "", variant = "default", children }) => {
  const styles =
    variant === "secondary"
      ? "bg-slate-100 text-slate-900 border-transparent"
      : variant === "outline"
      ? "bg-white text-slate-900 border-slate-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${styles} ${className}`}>
      {children}
    </span>
  );
};

/* -------------------- Small helpers (typed) -------------------- */
type ProgressBarProps = { value: number };

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden" aria-label="progress">
    <div className="h-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

export function formatMoney(n: number | string | undefined): string {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(1)}k`;
  return `$${x.toLocaleString()}`;
}

// simple avatar (initials)
type AvatarProps = { name?: string };

export function Avatar({ name = "User" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center text-sm font-semibold text-blue-900">
      {initials || "?"}
    </div>
  );
}

/* -------------------- Static project (no API calls) -------------------- */
const STATIC_PROJECT = {
  id: "p-cpe-01",
  title: "Outdoor Fire Detection System",
  school: "CSUS",
  description:
    "An outdoor fire detection system using AI and IoT to monitor and alert for wildfires in real-time.",
  goal_amount: 2000,
  current_amount: 200,
  tags: ["Computer", "Circuit Design", "CAD Modeling"],
  // Images served from /public
  images: ["/images/image1.jpg", "/images/image2.jpg", "/images/circuits.jpg"],
  creator: { id: 10, name: "Alex Student" },
  team_members: [
    { id: 11, name: "Maya Vision" },
    { id: 12, name: "Drew Controls" },
  ],
  is_sponsored: false,
  sponsored_by: "",
  start_date: "2025-08-15",
  end_date: "2025-12-10",
  milestones: [
    { title: "Data Pipeline & Sensors", done: true },
    { title: "Model Training & Inference", done: false },
    { title: "Edge Deployment & Alerts", done: false },
  ],
  verified: true,
};

type CampaignPageProps = {
  params: {
    id: string;
  };
};

export default function CampaignPage({ params }: CampaignPageProps) {
  // In a client component we can't call notFound(); render a friendly fallback instead
  const isWrongId = params?.id && params.id !== STATIC_PROJECT.id;

  const c = STATIC_PROJECT;
  const pct =
    c.goal_amount > 0
      ? Math.round((Number(c.current_amount) / Number(c.goal_amount)) * 100)
      : 0;

  if (isWrongId) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-white to-slate-50">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-center">Project not found</CardTitle>
            <CardDescription className="text-center">
              The campaign you’re looking for doesn’t exist. Try the demo project: <code>{c.id}</code>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-600">
              <Sparkles className="w-3.5 h-3.5" /> Campaign
            </div>
            <h1 className="text-2xl md:text-3xl text-black font-bold tracking-tight">{c.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> {c.school ?? "—"}
              </Badge>
              {c.verified && (
                <Badge className="gap-1" variant="outline">
                  <Shield className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
              {c.is_sponsored && (
                <Badge className="gap-1">
                  <Tag className="w-3.5 h-3.5" /> Sponsored{c.sponsored_by ? ` by ${c.sponsored_by}` : ""}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              Fund with <CreditCard className="w-4 h-4" />
            </Button>
            <SecondaryButton>
              Fund with <Coins className="w-4 h-4" />
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Left: Gallery + About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-0">
                <CardTitle className="text-base text-black">Gallery</CardTitle>
                <CardDescription>Project images & prototypes</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {Array.isArray(c.images) && c.images.length > 0 ? (
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-8 overflow-hidden rounded-xl relative">
                      <Image
                        src={c.images[0]}
                        alt={`${c.title} image 1`}
                        width={1200}
                        height={320}
                        className="w-full h-[320px] object-cover"
                        priority
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                      {c.images.slice(1, 3).map((src, i) => (
                        <div key={i} className="overflow-hidden rounded-xl">
                          <Image
                            src={src}
                            alt={`${c.title} image ${i + 2}`}
                            width={600}
                            height={158}
                            className="w-full h-[158px] object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 grid place-items-center text-slate-500">No images yet</div>
                )}
              </CardContent>
            </Card>

            {/* About */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>About this project</CardTitle>
                <CardDescription>Overview, goals, and approach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 leading-6">{c.description}</p>

                {/* Tags */}
                {Array.isArray(c.tags) && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="outline" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                  {c.start_date && (
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Start: {new Date(c.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {c.end_date && (
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> End: {new Date(c.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Track progress across key deliverables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.isArray(c.milestones) && c.milestones.length > 0 ? (
                  c.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input type="checkbox" checked={!!m.done} readOnly className="w-4 h-4 accent-blue-600" />
                      <span className={`text-sm ${m.done ? "line-through text-slate-500" : ""}`}>{m.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-600">No milestones yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Funding + Team */}
          <div className="lg:col-span-1 space-y-6">
            {/* Funding panel */}
            <Card className="rounded-2xl border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Fund this project</CardTitle>
                <CardDescription>Milestone-based payouts. Transparent updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressBar value={pct} />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatMoney(c.current_amount)} raised</span>
                  <span className="text-slate-600">of {formatMoney(c.goal_amount)} goal</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button>
                    <CreditCard className="w-4 h-4" /> Fund (Fiat)
                  </Button>
                  <SecondaryButton>
                    <Coins className="w-4 h-4" /> Fund (Crypto)
                  </SecondaryButton>
                </div>
                {c.is_sponsored && (
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-medium">Sponsored</span>
                    {c.sponsored_by ? ` by ${c.sponsored_by}` : ""}. Sponsorships highlight projects and may unlock perks.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5" /> Creators & Team
                </CardTitle>
                <CardDescription className="h-5">
                  Reach out to the team to know more about the project & connect!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator */}
                <div>
                  <div className="text-xs text-slate-600 mb-1">Creator</div>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.creator?.name} />
                    <div className="text-sm">
                      <div className="font-medium">{c.creator?.name ?? "—"}</div>
                      <div className="text-slate-600">Project lead</div>
                    </div>
                  </div>
                </div>
                {/* Team members */}
                <div>
                  <div className="text-xs text-slate-600 mb-1">Team Members</div>
                  {Array.isArray(c.team_members) && c.team_members.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {c.team_members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3">
                          <Avatar name={m.name} />
                          <div className="text-sm">
                            <div className="font-medium">{m.name}</div>
                            <div className="text-slate-600">Contributor</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">No team members listed.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety / Transparency */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Safety & Transparency
                </CardTitle>
                <CardDescription>How funds are handled</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p className="font-medium">How payments work</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Direct payouts:</span> Payments are processed by our payment provider and
                    transferred directly to the verified creator’s connected account. CrowdX never takes custody of funds or
                    holds pooled balances.
                  </li>
                  <li>
                    <span className="font-medium">Milestone releases:</span> Contributions authorize funding that is released
                    only when a milestone is approved. If a milestone isn’t approved, the release is paused or refunded per our
                    policy.
                  </li>
                  <li>
                    <span className="font-medium">Identity verification (KYC):</span> Project creators are identity-verified.
                    We require .edu email verification or partner validation.
                  </li>
                </ul>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Creators are responsible for using funds for stated educational/project purposes and for any tax
                    obligations related to funds they receive.
                  </li>
                </ul>

                <p className="text-xs text-slate-500 pt-2">
                  By contributing, you agree to CrowdX’s Terms, Acceptable Use, and Refund Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Keep if you want the page to always be dynamic (no caching). */
export const dynamic = "force-dynamic";
