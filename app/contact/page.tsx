"use client";

import { useState } from "react";
import { contactFormSchema, ContactFormValues } from "@/lib/contactSchema";
import AnimatedSection from "@/components/AnimatedSection";

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormValues, string>>
  >({});
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = contactFormSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      });
      return;
    }

    setErrors({});
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("Message sent!");
      setForm({ name: "", email: "", message: "" });
    } else {
      const data = await res.json();
      setStatus(data.error?.message || "Failed to send.");
    }
  }

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <AnimatedSection>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                className="w-full p-3 rounded bg-gray-800 text-white"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                className="w-full p-3 rounded bg-gray-800 text-white"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                className="w-full p-3 rounded bg-gray-800 text-white"
                rows={5}
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold cursor-pointer">
              Send Message
            </button>
          </form>

          {status && <p className="mt-4 text-sm text-green-400">{status}</p>}
        </div>
      </AnimatedSection>
    </section>
  );
}
