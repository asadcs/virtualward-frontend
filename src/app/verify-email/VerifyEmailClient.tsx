"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      setMessage("");

      try {
        const res = await fetch(`${API_BASE}/users/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setStatus("error");
          setMessage(
            data?.detail ||
              data?.message ||
              `Verification failed (${res.status})`,
          );
          return;
        }

        setStatus("success");
        setMessage(data?.message || "Email verified successfully");
      } catch {
        setStatus("error");
        setMessage("Could not connect to backend");
      }
    };

    verify();
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="max-w-md w-full bg-white p-6 rounded shadow text-center space-y-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>

        {status === "idle" && (
          <p className="text-zinc-600">Preparing verification…</p>
        )}
        {status === "loading" && (
          <p className="text-zinc-600">Verifying your email…</p>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <p className="text-green-700 font-medium">{message}</p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-black text-white rounded"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <p className="text-red-600 font-medium">{message}</p>
            <div className="flex justify-center gap-3">
              <Link href="/register" className="px-4 py-2 border rounded">
                Register Again
              </Link>
              <Link href="/" className="px-4 py-2 border rounded">
                Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
