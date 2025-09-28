"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function SignupPage(): React.ReactElement {
  const [status, setStatus] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formEl = e.currentTarget;        // <— capture once, sync
  setStatus("");
  setLoading(true);

  const form = new FormData(formEl);
  const payload = {
    name: String(form.get("name") || "").trim().slice(0, 200),
    company: String(form.get("company") || "").trim(),
    role: String(form.get("role") || "").trim(),
    audience: String(form.get("audience") || "").trim(),
    email: String(form.get("email") || "").trim(),
    hp: String(form.get("hp") || ""),
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

    setStatus("Thanks! We’ve recorded your info. ✅");
    formEl.reset();                      // <— use the captured element
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err ?? "Couldn’t submit. Please try again. ⚠️");
    setStatus(msg);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-blue-100"
      >
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          Sign up for CrowdX
        </h1>
        <p className="text-center text-slate-700 mb-6">
          Join a community where students showcase projects, get feedback from peers and industry professionals,
          and connect for collaborations, mentorship, and opportunities.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot (hidden from users) */}
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              name="company"
              placeholder="Company (or School/Team)"
              className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <input
            type="text"
            name="role"
            placeholder="Position or Major (e.g., Mechanical Eng., SWE)"
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <fieldset className="rounded-lg border border-gray-200 p-4">
            <legend className="px-2 text-sm font-medium text-gray-700">I am…</legend>
            <div className="mt-2 grid gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="audience" value="Engineering student" required className="h-4 w-4" />
                <span className="text-gray-800">an <strong>Engineering student</strong> looking to showcase my project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="audience" value="Engineering professional" className="h-4 w-4" />
                <span className="text-gray-800">an <strong>Engineering professional</strong> looking to connect with student engineers</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Request an Invite"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-700" role="status">
            {status}
          </p>
        )}

        <p className="mt-3 text-center text-xs text-gray-500">
          By submitting, you agree to be contacted about CrowdX for future updates to the project.
        </p>
      </motion.div>
    </div>
  );
}
