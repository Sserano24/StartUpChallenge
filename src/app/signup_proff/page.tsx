"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function ProRecruiterSignupPage(): React.ReactElement {
  const [status, setStatus] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("");
    setLoading(true);

    const form = new FormData(formEl);

    const payload = {
      // required
      fullName: String(form.get("fullName") || "").trim().slice(0, 200),
      company: String(form.get("company") || "").trim().slice(0, 200),
      professionalEmail: String(form.get("professionalEmail") || "").trim().slice(0, 200),

      // interests (checkboxes)
      interests: {
        exploreProjects: Boolean(form.get("exploreProjects")),
        recruitTalent: Boolean(form.get("recruitTalent")),
        mentorCollaborate: Boolean(form.get("mentorCollaborate")),
      },

      // optional
      roleTitle: String(form.get("roleTitle") || "").trim().slice(0, 200),
      expertise: String(form.get("expertise") || "").trim().slice(0, 1000),
      linkedin: String(form.get("linkedin") || "").trim().slice(0, 300),

      // honeypot
      hp: String(form.get("hp") || ""),
      audience: "Professional/Recruiter",
    };

    try {
      const res = await fetch("/api/register_proff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Could not submit right now.");
      }

      setStatus("Thanks! We’ve recorded your info.");
      formEl.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "Couldn’t submit. Please try again. ⚠️");
      setStatus(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-slate-200"
      >
        <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-2">
          Join CrowdX (Professionals)
        </h1>
        <p className="text-center text-slate-700 mb-6">
          Discover student engineering projects, recruit by real outcomes, and mentor the next generation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot (hidden from users) */}
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />

          {/* Required: Name + Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              required
              placeholder="Full name"
              aria-label="Full name"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="text"
              name="company"
              required
              placeholder="Current company"
              aria-label="Current company"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Optional: Role/Title */}
          <input
            type="text"
            name="roleTitle"
            required
            placeholder="Role / Title "
            aria-label="Role or title"
            className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {/* Required: Pro Email */}
          <input
            type="email"
            name="professionalEmail"
            required
            placeholder="Professional email (required for verification)"
            aria-label="Professional email"
            inputMode="email"
            className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {/* Interests */}
          <fieldset className="rounded-lg border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-800">I’m interested in…</legend>
            <div className="mt-3 grid gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="exploreProjects" className="h-4 w-4 accent-emerald-700" />
                <span className="text-slate-800">Exploring innovative student projects</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="recruitTalent" className="h-4 w-4 accent-emerald-700" />
                <span className="text-slate-800">Discovering talent for recruiting</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="mentorCollaborate" className="h-4 w-4 accent-emerald-700" />
                <span className="text-slate-800">Reaching out to collaborate / share expertise</span>
              </label>
            </div>
          </fieldset>

          {/* Optional: Expertise & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="expertise"
              placeholder="Expertise / focus areas (optional)"
              aria-label="Expertise"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn or portfolio URL (optional)"
              aria-label="LinkedIn or portfolio URL"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 text-lg rounded-md
              border border-emerald-700 text-emerald-900 bg-white
              hover:bg-emerald-700 hover:text-white
              transition-all disabled:opacity-60
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600
            "
          >
            {loading ? "Submitting…" : "Request Access"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-slate-800" role="status">
            {status}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">
          By submitting, you agree to be contacted about CrowdX updates and early access.
        </p>
      </motion.div>
    </div>
  );
}
