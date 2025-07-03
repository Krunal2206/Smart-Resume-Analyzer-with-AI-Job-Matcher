"use client";

import { useToastStore } from "@/lib/useToast";
import { useState } from "react";

interface Props {
  user: {
    name: string;
    email: string;
    preferredRole: string;
    preferredLocation: string;
  };
}

export default function SettingsForm({ user }: Props) {
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);

  const { trigger } = useToastStore();

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      trigger("Profile updated successfully!");
    } catch (err: any) {
      trigger(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          readOnly
          className="w-full p-2 rounded bg-gray-800 text-gray-400 border border-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Preferred Job Role</label>
        <input
          type="text"
          value={form.preferredRole}
          onChange={(e) => updateField("preferredRole", e.target.value)}
          placeholder="e.g., Frontend Developer"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Preferred Location</label>
        <input
          type="text"
          value={form.preferredLocation}
          onChange={(e) => updateField("preferredLocation", e.target.value)}
          placeholder="e.g., Toronto, Remote"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-semibold cursor-pointer"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
