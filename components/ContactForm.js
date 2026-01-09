"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  function validate() {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return "Please enter a valid email.";
    if (!mobile.trim() || !/^\+?[0-9\s-]{7,15}$/.test(mobile))
      return "Please enter a valid mobile number.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, experience }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to submit");
      setSuccess(
        "Thanks — we received your details. We will contact you soon."
      );
      setName("");
      setEmail("");
      setMobile("");
      setExperience("Fresher");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email ID
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number
        </label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience
        </label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option>Fresher</option>
          <option>Experienced</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Select "Experienced" if you have more than 2 years of experience.
        </p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary inline-block"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
