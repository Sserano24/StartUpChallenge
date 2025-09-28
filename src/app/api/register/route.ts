export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

type Payload = {
  name: string;
  company?: string;
  role?: string;
  audience: string;
  email: string;
  hp?: string;
};

function clamp(s: string, max = 200) {
  return s.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Payload>;

    // Honeypot: if bots fill this, pretend success but drop the submission
    const hp = String(body.hp ?? '').trim();
    if (hp) return NextResponse.json({ success: true }, { status: 200 });

    const name = clamp(String(body.name ?? ''));
    const company = String(body.company ?? '').trim();
    const role = String(body.role ?? '').trim();
    const audience = String(body.audience ?? '').trim();
    const email = String(body.email ?? '').trim();

    if (!name || !email || !audience) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, email, audience' }, { status: 400 });
    }

    const webhook = process.env.ZAPIER_HOOK_URL;
    if (!webhook) {
      return NextResponse.json({ success: false, error: 'ZAPIER_HOOK_URL not configured' }, { status: 500 });
    }

    const payload = { name, company, role, audience, email };

    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      return NextResponse.json({ success: true });
    }

    const text = await resp.text().catch(() => '');
    return NextResponse.json({ success: false, error: `Webhook error: ${resp.status} ${text}` }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
