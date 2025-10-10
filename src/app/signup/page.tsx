"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function StudentSignupPage(): React.ReactElement {
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
      school: String(form.get("school") || "").trim().slice(0, 200),
      major: String(form.get("major") || "").trim().slice(0, 200),
      year: String(form.get("year") || "").trim().slice(0, 50),
      schoolEmail: String(form.get("schoolEmail") || "").trim().slice(0, 200),

      // optional
      projectTitle: String(form.get("projectTitle") || "").trim().slice(0, 200),
      projectDescription: String(form.get("projectDescription") || "").trim().slice(0, 4000),
      projectNeeds: String(form.get("projectNeeds") || "").trim().slice(0, 2000),
      collaborators: Number(form.get("collaborators") || 0),

      // honeypot
      hp: String(form.get("hp") || ""),
      audience: "Engineering student",
    };

    try {
      const res = await fetch("/api/register", {
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
      const msg =
        err instanceof Error ? err.message : String(err ?? "Couldn’t submit. Please try again. ⚠️");
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
          Join CrowdX (Students)
        </h1>
        <p className="text-center text-slate-700 mb-6">
          Showcase your project, get feedback from professionals, and connect with collaborators and
          opportunities.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot (hidden from users) */}
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />

          {/* Required: Name + School */}
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
              name="school"
              required
              placeholder="School name"
              aria-label="School name"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Required: Major + Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="major"
              required
              placeholder="Current major (e.g., Mechanical Eng., SWE)"
              aria-label="Current major"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <select
              name="year"
              required
              aria-label="Current year"
              className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              defaultValue=""
            >
              <option value="" disabled>
                Current year
              </option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Graduate</option>
              <option>Other</option>
            </select>
          </div>

          {/* Required: School Email */}
          <input
            type="email"
            name="schoolEmail"
            required
            placeholder="School email (required for verification)"
            aria-label="School email"
            inputMode="email"
            className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {/* Optional Project Fields */}
          <fieldset className="rounded-lg border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-800">Project (optional)</legend>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <input
                type="text"
                name="projectTitle"
                placeholder="Project title"
                aria-label="Project title"
                className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <textarea
                name="projectDescription"
                placeholder="Project description (what it does, tech stack, progress)"
                aria-label="Project description"
                rows={4}
                className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <textarea
                name="projectNeeds"
                placeholder="What do you need to reach your next milestone? (e.g., components, mentorship, funding)"
                aria-label="Project needs"
                rows={3}
                className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="number"
                  name="collaborators"
                  min={0}
                  step={1}
                  placeholder="Number of collaborators"
                  aria-label="Number of collaborators"
                  className="w-full px-4 py-3 rounded-md bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </fieldset>

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
            {loading ? "Submitting…" : "Request an Invite"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-slate-800" role="status">
            {status}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">
          By submitting, you agree to be contacted about CrowdX updates.
        </p>
      </motion.div>
    </div>
  );
}
