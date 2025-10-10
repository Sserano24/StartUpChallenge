export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

type StudentPayload = {
  // required
  fullName: string;
  school: string;
  major: string;
  year: string;
  schoolEmail: string;

  // optional
  projectTitle?: string;
  projectDescription?: string;
  projectNeeds?: string;
  collaborators?: number;

  // meta
  audience: "Engineering student";
  hp?: string;
};

function clamp(s: string, max = 200) {
  return s.trim().slice(0, max);
}
function clampOrEmpty(v: unknown, max = 200) {
  return clamp(String(v ?? ""), max);
}
function toPosInt(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<StudentPayload>;

    // --- Honeypot: if bots fill this, pretend success but drop the submission
    const hp = String(body.hp ?? "").trim();
    if (hp) return NextResponse.json({ success: true }, { status: 200 });

    // --- Extract + clamp required fields
    const fullName = clampOrEmpty(body.fullName, 200);
    const school = clampOrEmpty(body.school, 200);
    const major = clampOrEmpty(body.major, 200);
    const year = clampOrEmpty(body.year, 50);
    const schoolEmail = clampOrEmpty(body.schoolEmail, 200);
    const audience = (body.audience as string) || "Engineering student";

    if (!fullName || !school || !major || !year || !schoolEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: fullName, school, major, year, schoolEmail",
        },
        { status: 400 }
      );
    }

    // --- Optional project fields (with longer limits)
    const projectTitle = clampOrEmpty(body.projectTitle, 200);
    const projectDescription = clampOrEmpty(body.projectDescription, 4000);
    const projectNeeds = clampOrEmpty(body.projectNeeds, 2000);
    const collaborators = toPosInt(body.collaborators);

    // --- Build payload to Zapier
    const payload = {
      type: "student_signup",
      audience,
      fullName,
      school,
      major,
      year,
      schoolEmail,

      project: {
        title: projectTitle || null,
        description: projectDescription || null,
        needs: projectNeeds || null,
        collaborators, // 0 if not provided
      },

      // Helpful metadata (nice to have in Zapier)
      submittedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "",
      referer: req.headers.get("referer") || "",
    };

    const webhook = process.env.ZAPIER_HOOK_URL1;
    if (!webhook) {
      return NextResponse.json(
        { success: false, error: "ZAPIER_HOOK_URL not configured" },
        { status: 500 }
      );
    }

    const resp = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      return NextResponse.json({ success: true });
    }

    const text = await resp.text().catch(() => "");
    return NextResponse.json(
      { success: false, error: `Webhook error: ${resp.status} ${text}` },
      { status: 500 }
    );
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : String(err ?? "Unknown error");
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
