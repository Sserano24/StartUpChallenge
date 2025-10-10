export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

type Interests = {
  exploreProjects: boolean;
  recruitTalent: boolean;
  mentorCollaborate: boolean;
};

type ProRecruiterPayload = {
  // required
  fullName: string;
  company: string;
  professionalEmail: string;

  // interests
  interests: Interests;

  // optional
  roleTitle?: string;
  expertise?: string;
  linkedin?: string;
  /** Optional free-text CSV, e.g., "SWE, Firmware, ML" */
  preferredRoles?: string;

  // meta
  audience: "Professional/Recruiter";
  hp?: string; // honeypot
};

function clamp(s: string, max = 200) {
  return s.trim().slice(0, max);
}
function clampOrEmpty(v: unknown, max = 200) {
  return clamp(String(v ?? ""), max);
}
function bool(v: unknown) {
  // accepts true/false booleans or "on"/"true"/"1" from form posts
  const s = String(v ?? "").toLowerCase();
  return v === true || s === "true" || s === "on" || s === "1";
}
function parsePreferredRoles(input?: string) {
  const raw = (input ?? "").trim();
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20); // keep it reasonable
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ProRecruiterPayload>;

    // --- Honeypot: if filled, pretend success and drop it
    const hp = String(body.hp ?? "").trim();
    if (hp) return NextResponse.json({ success: true }, { status: 200 });

    // Required
    const fullName = clampOrEmpty(body.fullName, 200);
    const company = clampOrEmpty(body.company, 200);
    const professionalEmail = clampOrEmpty(body.professionalEmail, 200);
    const audience: string = body.audience || "Professional/Recruiter";

    if (!fullName || !company || !professionalEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: fullName, company, professionalEmail",
        },
        { status: 400 }
      );
    }

    // Interests (checkboxes)
    const interests: Interests = {
      exploreProjects: bool(body?.interests?.exploreProjects),
      recruitTalent: bool(body?.interests?.recruitTalent),
      mentorCollaborate: bool(body?.interests?.mentorCollaborate),
    };

    // Optional
    const roleTitle = clampOrEmpty(body.roleTitle, 200);
    const expertise = clampOrEmpty(body.expertise, 1000);
    const linkedin = clampOrEmpty(body.linkedin, 300);
    const preferredRolesText = clampOrEmpty(body.preferredRoles, 500);
    const preferredRoles = parsePreferredRoles(preferredRolesText);

    // Build payload for Zapier
    const payload = {
      type: "pro_recruiter_signup",
      audience,
      fullName,
      company,
      professionalEmail,
      interests,
      optional: {
        roleTitle: roleTitle || null,
        expertise: expertise || null,
        linkedin: linkedin || null,
        preferredRoles, // [] if none
      },

      // Helpful metadata
      submittedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||

        "",
      referer: req.headers.get("referer") || "",
    };

    // Use a dedicated hook if available, else fall back to the default one
    const webhook =
      process.env.ZAPIER_HOOK_URL_PROFESSIONAL || process.env.ZAPIER_HOOK_URL2;

    if (!webhook) {
      return NextResponse.json(
        { success: false, error: "Zapier hook URL not configured" },
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
