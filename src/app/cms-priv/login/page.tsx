"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuLock } from "react-icons/lu";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/cms-priv/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      const from = searchParams.get("from");
      router.push(from && from !== "/" ? from : window.location.pathname.replace("/login", ""));
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        autoFocus
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#5a5a5a] transition-colors"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full px-4 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Checking..." : "Enter"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-6">
          <LuLock className="w-5 h-5 text-primary" />
          <h1 className="font-bold font-rethink text-lg">Admin Access</h1>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
