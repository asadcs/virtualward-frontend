// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // type LoginResponse = { access_token: string; refresh_token: string };

// // type MeResponse = {
// //   id: number;
// //   name: string;
// //   email: string;
// //   email_verified: boolean;
// //   roles: string[];
// // };

// // function getTokens() {
// //   if (typeof window === "undefined") return { access: null, refresh: null };
// //   return {
// //     access: localStorage.getItem("access_token"),
// //     refresh: localStorage.getItem("refresh_token"),
// //   };
// // }

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const [submitting, setSubmitting] = useState(false);
// //   const [loadingMe, setLoadingMe] = useState(false);

// //   const [error, setError] = useState<string | null>(null);
// //   const [me, setMe] = useState<MeResponse | null>(null);

// //   const canSubmit = useMemo(() => {
// //     return email.trim().length > 0 && password.length > 0 && !submitting;
// //   }, [email, password, submitting]);

// //   async function fetchMe(accessToken: string) {
// //     setLoadingMe(true);
// //     setError(null);
// //     try {
// //       const res = await fetch(`${API_BASE}/users/me`, {
// //         method: "GET",
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //         },
// //         cache: "no-store",
// //       });

// //       const body = await res.json().catch(() => null);
// //       if (!res.ok) {
// //         const msg =
// //           body?.detail || body?.message || `Failed to load /me (${res.status})`;
// //         throw new Error(msg);
// //       }

// //       setMe(body as MeResponse);
// //     } catch (e: any) {
// //       setMe(null);
// //       setError(e?.message ?? "Failed to load current user");
// //     } finally {
// //       setLoadingMe(false);
// //     }
// //   }

// //   // Auto-load /me if tokens already exist
// //   useEffect(() => {
// //     const { access } = getTokens();
// //     if (access) fetchMe(access);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   async function onLogin(e: React.FormEvent) {
// //     e.preventDefault();
// //     setError(null);
// //     setMe(null);

// //     setSubmitting(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/users/login`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           email: email.trim(),
// //           password,
// //         }),
// //       });

// //       const body = await res.json().catch(() => null);

// //       if (!res.ok) {
// //         const msg =
// //           body?.detail || body?.message || `Login failed (${res.status})`;
// //         throw new Error(msg);
// //       }

// //       const data = body as LoginResponse;

// //       localStorage.setItem("access_token", data.access_token);
// //       localStorage.setItem("refresh_token", data.refresh_token);
// //       router.push("/dashboard");

// //       await fetchMe(data.access_token);
// //     } catch (e: any) {
// //       setError(e?.message ?? "Login failed");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }

// //   async function onLogout() {
// //     setError(null);

// //     const { refresh } = getTokens();
// //     const refreshToken = refresh;

// //     try {
// //       if (refreshToken) {
// //         await fetch(`${API_BASE}/users/logout`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ refresh_token: refreshToken }),
// //         }).catch(() => null);
// //       }
// //     } finally {
// //       localStorage.removeItem("access_token");
// //       localStorage.removeItem("refresh_token");
// //       setMe(null);
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
// //       <div className="mx-auto max-w-xl px-6 py-14">
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
// //           <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
// //             Sign in using your email and password.
// //           </p>
// //         </div>

// //         <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
// //           {error && (
// //             <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
// //               {error}
// //             </div>
// //           )}

// //           {!me ? (
// //             <form onSubmit={onLogin} className="space-y-4">
// //               <div>
// //                 <label className="text-sm font-medium">Email</label>
// //                 <input
// //                   className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   placeholder="you@example.com"
// //                   autoComplete="email"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium">Password</label>
// //                 <input
// //                   className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   placeholder="Your password"
// //                   type="password"
// //                   autoComplete="current-password"
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={!canSubmit}
// //                 className="w-full rounded-xl bg-black px-4 py-2 text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
// //               >
// //                 {submitting ? "Signing in..." : "Login"}
// //               </button>

// //               <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
// //                 <Link
// //                   className="underline text-zinc-900 dark:text-zinc-50"
// //                   href="/forgot-password"
// //                 >
// //                   Forgot password?
// //                 </Link>
// //                 <Link
// //                   className="underline text-zinc-900 dark:text-zinc-50"
// //                   href="/register"
// //                 >
// //                   Create account
// //                 </Link>
// //               </div>
// //             </form>
// //           ) : (
// //             <div className="space-y-4">
// //               <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
// //                 <div className="font-medium">You are logged in ✅</div>
// //                 <div className="mt-2 space-y-1 text-zinc-700 dark:text-zinc-200">
// //                   <div>
// //                     <span className="font-medium">Name:</span> {me.name}
// //                   </div>
// //                   <div>
// //                     <span className="font-medium">Email:</span> {me.email}
// //                   </div>
// //                   <div>
// //                     <span className="font-medium">Email verified:</span>{" "}
// //                     {me.email_verified ? "Yes" : "No"}
// //                   </div>
// //                   <div>
// //                     <span className="font-medium">Roles:</span>{" "}
// //                     {me.roles?.length ? me.roles.join(", ") : "—"}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex flex-col gap-2 sm:flex-row">
// //                 <Link
// //                   href="/"
// //                   className="w-full rounded-xl border border-black/10 px-4 py-2 text-center hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
// //                 >
// //                   Home
// //                 </Link>

// //                 <Link
// //                   href="/change-password"
// //                   className="w-full rounded-xl border border-black/10 px-4 py-2 text-center hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
// //                 >
// //                   Change password
// //                 </Link>

// //                 <button
// //                   onClick={onLogout}
// //                   className="w-full rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>

// //               {loadingMe && (
// //                 <div className="text-xs text-zinc-600 dark:text-zinc-400">
// //                   Loading profile...
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// type LoginResponse = { access_token: string; refresh_token: string };

// type MeResponse = {
//   id: number;
//   name: string;
//   email: string;
//   email_verified: boolean;
//   roles: string[];
// };

// function getTokens() {
//   if (typeof window === "undefined") return { access: null, refresh: null };
//   return {
//     access: localStorage.getItem("access_token"),
//     refresh: localStorage.getItem("refresh_token"),
//   };
// }

// function isPatientRole(roles: string[] | undefined | null) {
//   const r = roles ?? [];
//   return r.includes("PATIENT_INTERNAL") || r.includes("PATIENT");
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [submitting, setSubmitting] = useState(false);
//   const [loadingMe, setLoadingMe] = useState(false);

//   const [error, setError] = useState<string | null>(null);
//   const [me, setMe] = useState<MeResponse | null>(null);

//   const canSubmit = useMemo(() => {
//     return email.trim().length > 0 && password.length > 0 && !submitting;
//   }, [email, password, submitting]);

//   async function fetchMe(accessToken: string) {
//     setLoadingMe(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/users/me`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache: "no-store",
//       });

//       const body = await res.json().catch(() => null);
//       if (!res.ok) {
//         const msg =
//           body?.detail || body?.message || `Failed to load /me (${res.status})`;
//         throw new Error(msg);
//       }

//       const profile = body as MeResponse;
//       setMe(profile);
//       return profile;
//     } catch (e: any) {
//       setMe(null);
//       setError(e?.message ?? "Failed to load current user");
//       return null;
//     } finally {
//       setLoadingMe(false);
//     }
//   }

//   // If tokens exist, auto-load /me and route user to correct dashboard
//   useEffect(() => {
//     const { access } = getTokens();
//     if (!access) return;

//     (async () => {
//       const profile = await fetchMe(access);
//       if (!profile) return;

//       const target = isPatientRole(profile.roles)
//         ? "/patient/dashboard"
//         : "/dashboard";
//       router.replace(target);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function onLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setMe(null);

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/users/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim(),
//           password,
//         }),
//       });

//       const body = await res.json().catch(() => null);

//       if (!res.ok) {
//         const msg =
//           body?.detail || body?.message || `Login failed (${res.status})`;
//         throw new Error(msg);
//       }

//       const data = body as LoginResponse;

//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);

//       // Fetch /me first, then route based on role
//       const profile = await fetchMe(data.access_token);

//       // If /me failed for any reason, send to login again
//       if (!profile) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         router.replace("/login");
//         return;
//       }

//       const target = isPatientRole(profile.roles)
//         ? "/patient/dashboard"
//         : "/dashboard";
//       router.push(target);
//     } catch (e: any) {
//       setError(e?.message ?? "Login failed");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function onLogout() {
//     setError(null);

//     const { refresh } = getTokens();
//     const refreshToken = refresh;

//     try {
//       if (refreshToken) {
//         await fetch(`${API_BASE}/users/logout`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh_token: refreshToken }),
//         }).catch(() => null);
//       }
//     } finally {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       setMe(null);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
//       <div className="mx-auto max-w-xl px-6 py-14">
//         <div className="mb-8">
//           <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
//           <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//             Sign in using your email and password.
//           </p>
//         </div>

//         <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
//           {error && (
//             <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
//               {error}
//             </div>
//           )}

//           {!me ? (
//             <form onSubmit={onLogin} className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium">Email</label>
//                 <input
//                   className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   autoComplete="email"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Password</label>
//                 <input
//                   className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Your password"
//                   type="password"
//                   autoComplete="current-password"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={!canSubmit}
//                 className="w-full rounded-xl bg-black px-4 py-2 text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
//               >
//                 {submitting ? "Signing in..." : "Login"}
//               </button>

//               <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
//                 <Link
//                   className="underline text-zinc-900 dark:text-zinc-50"
//                   href="/forgot-password"
//                 >
//                   Forgot password?
//                 </Link>
//                 <Link
//                   className="underline text-zinc-900 dark:text-zinc-50"
//                   href="/register"
//                 >
//                   Create account
//                 </Link>
//               </div>
//             </form>
//           ) : (
//             <div className="space-y-4">
//               <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
//                 <div className="font-medium">You are logged in ✅</div>
//                 <div className="mt-2 space-y-1 text-zinc-700 dark:text-zinc-200">
//                   <div>
//                     <span className="font-medium">Name:</span> {me.name}
//                   </div>
//                   <div>
//                     <span className="font-medium">Email:</span> {me.email}
//                   </div>
//                   <div>
//                     <span className="font-medium">Email verified:</span>{" "}
//                     {me.email_verified ? "Yes" : "No"}
//                   </div>
//                   <div>
//                     <span className="font-medium">Roles:</span>{" "}
//                     {me.roles?.length ? me.roles.join(", ") : "—"}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 sm:flex-row">
//                 <Link
//                   href="/"
//                   className="w-full rounded-xl border border-black/10 px-4 py-2 text-center hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
//                 >
//                   Home
//                 </Link>

//                 <Link
//                   href="/change-password"
//                   className="w-full rounded-xl border border-black/10 px-4 py-2 text-center hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
//                 >
//                   Change password
//                 </Link>

//                 <button
//                   onClick={onLogout}
//                   className="w-full rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
//                 >
//                   Logout
//                 </button>
//               </div>

//               {loadingMe && (
//                 <div className="text-xs text-zinc-600 dark:text-zinc-400">
//                   Loading profile...
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ??
//   "https://virtualwardbackend-production.up.railway.app";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

type LoginResponse = { access_token: string; refresh_token: string };

type MeResponse = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  roles: string[];
};

function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

function isPatientRole(roles: string[] | undefined | null) {
  const r = roles ?? [];
  return r.includes("PATIENT_INTERNAL") || r.includes("PATIENT");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [loadingMe, setLoadingMe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  async function fetchMe(accessToken: string) {
    setLoadingMe(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          body?.detail || body?.message || `Failed to load /me (${res.status})`;
        throw new Error(msg);
      }

      const profile = body as MeResponse;
      setMe(profile);
      return profile;
    } catch (e: any) {
      setMe(null);
      setError(e?.message ?? "Failed to load current user");
      return null;
    } finally {
      setLoadingMe(false);
    }
  }

  // If tokens exist, auto-load /me and route user to correct dashboard
  useEffect(() => {
    const { access } = getTokens();
    if (!access) return;

    (async () => {
      const profile = await fetchMe(access);
      if (!profile) return;

      const target = isPatientRole(profile.roles)
        ? "/patient/dashboard"
        : "/dashboard";
      router.replace(target);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMe(null);

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          body?.detail || body?.message || `Login failed (${res.status})`;
        throw new Error(msg);
      }

      const data = body as LoginResponse;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Fetch /me first, then route based on role
      const profile = await fetchMe(data.access_token);

      // If /me failed for any reason, send to login again
      if (!profile) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.replace("/login");
        return;
      }

      const target = isPatientRole(profile.roles)
        ? "/patient/dashboard"
        : "/dashboard";
      router.push(target);
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onLogout() {
    setError(null);

    const { refresh } = getTokens();
    const refreshToken = refresh;

    try {
      if (refreshToken) {
        await fetch(`${API_BASE}/users/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }).catch(() => null);
      }
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setMe(null);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Teal Background */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-teal-500 to-teal-600 p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg text-teal-50 mb-8">
            Sign in to access your Virtual Ward System dashboard
          </p>
          <div className="space-y-4 text-teal-50">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">Secure Access</div>
                <div className="text-sm">
                  Your data is encrypted and protected
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">Fast & Reliable</div>
                <div className="text-sm">
                  Quick access to all your healthcare tools
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">
                  Multi-Role Support
                </div>
                <div className="text-sm">
                  Access tailored to your specific role
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {!me ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <form onSubmit={onLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-teal-600 hover:text-teal-700"
                >
                  Create one here
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Logged In State */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-green-900">
                        You are logged in
                      </div>
                      <div className="text-sm text-green-700">
                        Welcome back to your dashboard
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-green-800">
                    <div>
                      <span className="font-medium">Name:</span> {me.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {me.email}
                    </div>
                    <div>
                      <span className="font-medium">Email verified:</span>{" "}
                      {me.email_verified ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-amber-600">✗ No</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Roles:</span>{" "}
                      {me.roles?.length ? me.roles.join(", ") : "—"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/"
                    className="w-full block px-6 py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Go to Home
                  </Link>

                  <Link
                    href="/change-password"
                    className="w-full block px-6 py-3 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Change Password
                  </Link>

                  <button
                    onClick={onLogout}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>

                {loadingMe && (
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Loading profile...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
