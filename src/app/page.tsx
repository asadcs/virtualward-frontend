"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  roles: string[];
};

export default function HomePage() {
  const [apiMessage, setApiMessage] = useState<string>("Loading...");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE;

  // Fetch backend root
  useEffect(() => {
    fetch(`${API}/`)
      .then((r) => r.json())
      .then((d) => setApiMessage(d.message))
      .catch(() => setApiMessage("Backend not reachable"));
  }, [API]);

  // Fetch current user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${API}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
  }, [API]);

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      await fetch(`${API}/users/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });
    }

    localStorage.clear();
    setUser(null);
  };

  return (
    <main className="min-h-screen p-10 bg-zinc-50">
      <h1 className="text-3xl font-bold mb-6">VirtualWard</h1>

      {/* Backend status */}
      <div className="mb-6 p-4 rounded bg-white shadow">
        <p className="font-semibold">Backend status:</p>
        <p className="text-green-700">{apiMessage}</p>
      </div>

      {/* Logged out */}
      {!user && (
        <div className="p-6 bg-white rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Get Started</h2>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 border border-black rounded"
            >
              Register
            </Link>
          </div>

          <Link href="/forgot-password" className="text-sm underline">
            Forgot password?
          </Link>
        </div>
      )}

      {/* Logged in */}
      {user && (
        <div className="p-6 bg-white rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Your Session</h2>

          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Email verified:</b> {user.email_verified ? "Yes" : "No"}
          </p>

          <div>
            <b>Roles:</b>
            <div className="flex gap-2 mt-1">
              {user.roles.map((r) => (
                <span key={r} className="px-2 py-1 text-sm bg-blue-100 rounded">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/change-password" className="px-4 py-2 border rounded">
              Change Password
            </Link>

            {user.roles.includes("ADMIN") && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
