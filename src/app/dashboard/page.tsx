// // // // // "use client";

// // // // // import { useEffect, useState } from "react";
// // // // // import { useRouter } from "next/navigation";

// // // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // // type MeResponse = {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   email_verified: boolean;
// // // // //   roles: string[];
// // // // // };

// // // // // export default function DashboardPage() {
// // // // //   const router = useRouter();

// // // // //   const [me, setMe] = useState<MeResponse | null>(null);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   async function loadMe(accessToken: string) {
// // // // //     try {
// // // // //       const res = await fetch(`${API_BASE}/users/me`, {
// // // // //         headers: {
// // // // //           Authorization: `Bearer ${accessToken}`,
// // // // //         },
// // // // //         cache: "no-store",
// // // // //       });

// // // // //       const body = await res.json().catch(() => null);

// // // // //       if (!res.ok) {
// // // // //         throw new Error(body?.detail || "Failed to load profile");
// // // // //       }

// // // // //       setMe(body);
// // // // //     } catch (e: any) {
// // // // //       localStorage.removeItem("access_token");
// // // // //       localStorage.removeItem("refresh_token");
// // // // //       router.replace("/login");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   }

// // // // //   async function logout() {
// // // // //     const refresh = localStorage.getItem("refresh_token");

// // // // //     try {
// // // // //       if (refresh) {
// // // // //         await fetch(`${API_BASE}/users/logout`, {
// // // // //           method: "POST",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //           body: JSON.stringify({ refresh_token: refresh }),
// // // // //         });
// // // // //       }
// // // // //     } finally {
// // // // //       localStorage.removeItem("access_token");
// // // // //       localStorage.removeItem("refresh_token");
// // // // //       router.push("/login");
// // // // //     }
// // // // //   }

// // // // //   useEffect(() => {
// // // // //     const access = localStorage.getItem("access_token");
// // // // //     if (!access) {
// // // // //       router.replace("/login");
// // // // //       return;
// // // // //     }
// // // // //     loadMe(access);
// // // // //   }, [router]);

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center">
// // // // //         Loading dashboard...
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (!me) return null;

// // // // //   return (
// // // // //     <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
// // // // //       {/* Top Bar */}
// // // // //       <header className="flex items-center justify-between px-8 py-4 border-b border-black/10 dark:border-white/10">
// // // // //         <div className="text-lg font-semibold">VirtualWard Dashboard</div>

// // // // //         <div className="flex items-center gap-4">
// // // // //           <div className="text-sm text-right">
// // // // //             <div className="font-medium">{me.name}</div>
// // // // //             <div className="text-xs text-zinc-600 dark:text-zinc-400">
// // // // //               {me.roles.join(", ") || "No roles"}
// // // // //             </div>
// // // // //           </div>

// // // // //           <button
// // // // //             onClick={logout}
// // // // //             className="rounded-xl bg-black px-4 py-2 text-white text-sm dark:bg-white dark:text-black"
// // // // //           >
// // // // //             Logout
// // // // //           </button>
// // // // //         </div>
// // // // //       </header>

// // // // //       {/* Main Content */}
// // // // //       <main className="px-8 py-10">
// // // // //         <h1 className="text-3xl font-semibold tracking-tight">
// // // // //           Welcome, {me.name} 👋
// // // // //         </h1>

// // // // //         <p className="mt-2 text-zinc-600 dark:text-zinc-400">
// // // // //           You are logged in as <strong>{me.email}</strong>
// // // // //         </p>

// // // // //         <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
// // // // //           <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
// // // // //             <div className="text-sm text-zinc-600 dark:text-zinc-400">
// // // // //               Account status
// // // // //             </div>
// // // // //             <div className="mt-2 text-lg font-medium">
// // // // //               {me.email_verified
// // // // //                 ? "Email verified ✅"
// // // // //                 : "Email not verified ❌"}
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
// // // // //             <div className="text-sm text-zinc-600 dark:text-zinc-400">
// // // // //               Roles
// // // // //             </div>
// // // // //             <div className="mt-2 text-lg font-medium">
// // // // //               {me.roles.length ? me.roles.join(", ") : "None"}
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
// // // // //             <div className="text-sm text-zinc-600 dark:text-zinc-400">
// // // // //               User ID
// // // // //             </div>
// // // // //             <div className="mt-2 text-lg font-medium">{me.id}</div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </main>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import { useRouter } from "next/navigation";

// // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // type MeResponse = {
// // // //   id: number;
// // // //   name: string;
// // // //   email: string;
// // // //   email_verified: boolean;
// // // //   roles: string[];
// // // // };

// // // // type DashboardStats = {
// // // //   activePatients: number;
// // // //   internalPatients: number;
// // // //   externalPatients: number;
// // // //   pendingRegistrations: number;
// // // //   todaySubmissions: number;
// // // //   totalExpected: number;
// // // //   redAlerts: number;
// // // //   amberAlerts: number;
// // // // };

// // // // export default function DashboardPage() {
// // // //   const router = useRouter();

// // // //   const [me, setMe] = useState<MeResponse | null>(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [stats, setStats] = useState<DashboardStats>({
// // // //     activePatients: 58,
// // // //     internalPatients: 52,
// // // //     externalPatients: 6,
// // // //     pendingRegistrations: 3,
// // // //     todaySubmissions: 45,
// // // //     totalExpected: 58,
// // // //     redAlerts: 2,
// // // //     amberAlerts: 5,
// // // //   });

// // // //   async function loadMe(accessToken: string) {
// // // //     try {
// // // //       const res = await fetch(`${API_BASE}/users/me`, {
// // // //         headers: {
// // // //           Authorization: `Bearer ${accessToken}`,
// // // //         },
// // // //         cache: "no-store",
// // // //       });

// // // //       const body = await res.json().catch(() => null);

// // // //       if (!res.ok) {
// // // //         throw new Error(body?.detail || "Failed to load profile");
// // // //       }

// // // //       setMe(body);
// // // //     } catch (e: any) {
// // // //       localStorage.removeItem("access_token");
// // // //       localStorage.removeItem("refresh_token");
// // // //       router.replace("/login");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function logout() {
// // // //     const refresh = localStorage.getItem("refresh_token");

// // // //     try {
// // // //       if (refresh) {
// // // //         await fetch(`${API_BASE}/users/logout`, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({ refresh_token: refresh }),
// // // //         });
// // // //       }
// // // //     } finally {
// // // //       localStorage.removeItem("access_token");
// // // //       localStorage.removeItem("refresh_token");
// // // //       router.push("/login");
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     const access = localStorage.getItem("access_token");
// // // //     if (!access) {
// // // //       router.replace("/login");
// // // //       return;
// // // //     }
// // // //     loadMe(access);
// // // //   }, [router]);

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <div className="text-lg">Loading dashboard...</div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (!me) return null;

// // // //   const currentDate = new Date().toLocaleDateString("en-US", {
// // // //     weekday: "long",
// // // //     year: "numeric",
// // // //     month: "long",
// // // //     day: "numeric",
// // // //   });

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       {/* Top Bar */}
// // // //       <header className="bg-white shadow-sm border-b border-gray-200">
// // // //         <div className="w-full px-6 py-4 flex items-center justify-between">
// // // //           <div className="flex items-center gap-3">
// // // //             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// // // //               <svg
// // // //                 className="w-6 h-6 text-white"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <div>
// // // //               <div className="text-lg font-bold text-gray-900">
// // // //                 Virtual Ward System
// // // //               </div>
// // // //               <div className="text-xs text-gray-500">Admin Dashboard</div>
// // // //             </div>
// // // //           </div>

// // // //           <button
// // // //             onClick={logout}
// // // //             className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
// // // //           >
// // // //             Logout
// // // //           </button>
// // // //         </div>
// // // //       </header>

// // // //       {/* Main Content */}
// // // //       <main className="w-full px-6 py-6">
// // // //         {/* Welcome Section */}
// // // //         <div className="mb-6">
// // // //           <h1 className="text-2xl font-bold text-gray-900">
// // // //             Welcome, {me.name} 👋
// // // //           </h1>
// // // //           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
// // // //             <span>📅</span>
// // // //             <span>{currentDate}</span>
// // // //           </p>
// // // //         </div>

// // // //         {/* Quick Stats */}
// // // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // // //             <span>📊</span>
// // // //             Quick Stats
// // // //           </h2>

// // // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// // // //             {/* Active Patients */}
// // // //             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
// // // //               <div className="flex items-center justify-between mb-2">
// // // //                 <div className="text-xs font-medium opacity-90">
// // // //                   Active Patients
// // // //                 </div>
// // // //                 <svg
// // // //                   className="w-6 h-6 opacity-80"
// // // //                   fill="none"
// // // //                   stroke="currentColor"
// // // //                   viewBox="0 0 24 24"
// // // //                 >
// // // //                   <path
// // // //                     strokeLinecap="round"
// // // //                     strokeLinejoin="round"
// // // //                     strokeWidth={2}
// // // //                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// // // //                   />
// // // //                 </svg>
// // // //               </div>
// // // //               <div className="text-3xl font-bold mb-1">
// // // //                 {stats.activePatients}
// // // //               </div>
// // // //               <div className="text-xs opacity-90">
// // // //                 {stats.internalPatients} Internal, {stats.externalPatients}{" "}
// // // //                 External
// // // //               </div>
// // // //             </div>

// // // //             {/* Today's Submissions */}
// // // //             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
// // // //               <div className="flex items-center justify-between mb-2">
// // // //                 <div className="text-xs font-medium opacity-90">
// // // //                   Today's Submissions
// // // //                 </div>
// // // //                 <svg
// // // //                   className="w-6 h-6 opacity-80"
// // // //                   fill="none"
// // // //                   stroke="currentColor"
// // // //                   viewBox="0 0 24 24"
// // // //                 >
// // // //                   <path
// // // //                     strokeLinecap="round"
// // // //                     strokeLinejoin="round"
// // // //                     strokeWidth={2}
// // // //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
// // // //                   />
// // // //                 </svg>
// // // //               </div>
// // // //               <div className="text-3xl font-bold mb-1">
// // // //                 {stats.todaySubmissions}/{stats.totalExpected}
// // // //               </div>
// // // //               <div className="text-xs opacity-90">
// // // //                 {Math.round(
// // // //                   (stats.todaySubmissions / stats.totalExpected) * 100
// // // //                 )}
// // // //                 % completion rate
// // // //               </div>
// // // //             </div>

// // // //             {/* Pending Registrations */}
// // // //             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
// // // //               <div className="flex items-center justify-between mb-2">
// // // //                 <div className="text-xs font-medium opacity-90">
// // // //                   Pending Registrations
// // // //                 </div>
// // // //                 <svg
// // // //                   className="w-6 h-6 opacity-80"
// // // //                   fill="none"
// // // //                   stroke="currentColor"
// // // //                   viewBox="0 0 24 24"
// // // //                 >
// // // //                   <path
// // // //                     strokeLinecap="round"
// // // //                     strokeLinejoin="round"
// // // //                     strokeWidth={2}
// // // //                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
// // // //                   />
// // // //                 </svg>
// // // //               </div>
// // // //               <div className="text-3xl font-bold mb-1">
// // // //                 {stats.pendingRegistrations}
// // // //               </div>
// // // //               <div className="text-xs opacity-90">
// // // //                 {stats.pendingRegistrations > 0
// // // //                   ? "Requires review ⚠️"
// // // //                   : "All caught up ✓"}
// // // //               </div>
// // // //             </div>

// // // //             {/* Alerts */}
// // // //             <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white">
// // // //               <div className="flex items-center justify-between mb-2">
// // // //                 <div className="text-xs font-medium opacity-90">Alerts</div>
// // // //                 <svg
// // // //                   className="w-6 h-6 opacity-80"
// // // //                   fill="none"
// // // //                   stroke="currentColor"
// // // //                   viewBox="0 0 24 24"
// // // //                 >
// // // //                   <path
// // // //                     strokeLinecap="round"
// // // //                     strokeLinejoin="round"
// // // //                     strokeWidth={2}
// // // //                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// // // //                   />
// // // //                 </svg>
// // // //               </div>
// // // //               <div className="flex items-center gap-3 mb-1">
// // // //                 <div className="text-2xl font-bold">🔴 {stats.redAlerts}</div>
// // // //                 <div className="text-2xl font-bold">🟡 {stats.amberAlerts}</div>
// // // //               </div>
// // // //               <div className="text-xs opacity-90">RED | AMBER alerts</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Main Menu */}
// // // //         <div className="mb-4">
// // // //           <h2 className="text-lg font-semibold text-gray-900">Main Menu</h2>
// // // //         </div>

// // // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //           {/* Register Internal Patient */}
// // // //           <button
// // // //             onClick={() => router.push("/admin/register-internal")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // // //           >
// // // //             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-blue-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               ➕ Register Internal Patient
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">
// // // //               Register hospital discharged patient
// // // //             </p>
// // // //           </button>

// // // //           {/* Manage Questionnaires */}
// // // //           <button
// // // //             onClick={() =>
// // // //               router.push("/admin/QuestionnaireTemplateManagement")
// // // //             }
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // // //           >
// // // //             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-green-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               📋 Manage Questionnaires Template
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">
// // // //               Create & edit questionnaires templates
// // // //             </p>
// // // //           </button>

// // // //           {/* External Registrations */}
// // // //           <button
// // // //             onClick={() => router.push("/admin/external-registrations")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group relative"
// // // //           >
// // // //             {stats.pendingRegistrations > 0 && (
// // // //               <div className="absolute top-4 right-4 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
// // // //                 {stats.pendingRegistrations}
// // // //               </div>
// // // //             )}
// // // //             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-orange-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               👥 External Registrations
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">
// // // //               Review & approve applications
// // // //               {stats.pendingRegistrations > 0 && (
// // // //                 <span className="block mt-1 text-orange-600 font-medium">
// // // //                   {stats.pendingRegistrations} pending ⚠️
// // // //                 </span>
// // // //               )}
// // // //             </p>
// // // //           </button>

// // // //           {/* View All Patients */}
// // // //           <button
// // // //             onClick={() => router.push("/admin/patients")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // // //           >
// // // //             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-purple-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               📊 View All Patients
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">Search & manage patients</p>
// // // //           </button>

// // // //           {/* Monitoring Dashboard */}
// // // //           <button
// // // //             onClick={() => router.push("/admin/monitoring")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // // //           >
// // // //             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-red-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               🔔 Monitoring Dashboard
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">View alerts & submissions</p>
// // // //           </button>

// // // //           {/* Reports */}
// // // //           <button
// // // //             onClick={() => router.push("/admin/reports")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // // //           >
// // // //             <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
// // // //               <svg
// // // //                 className="w-6 h-6 text-indigo-600"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 viewBox="0 0 24 24"
// // // //               >
// // // //                 <path
// // // //                   strokeLinecap="round"
// // // //                   strokeLinejoin="round"
// // // //                   strokeWidth={2}
// // // //                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               📈 Reports
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">View statistics & analytics</p>
// // // //           </button>
// // // //         </div>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useEffect, useMemo, useState } from "react";
// // // import { useRouter } from "next/navigation";

// // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // type MeResponse = {
// // //   id: number;
// // //   name: string;
// // //   email: string;
// // //   email_verified: boolean;
// // //   roles: string[];
// // // };

// // // type DashboardStats = {
// // //   activePatients: number;
// // //   internalPatients: number;
// // //   externalPatients: number;
// // //   pendingRegistrations: number;
// // //   todaySubmissions: number;
// // //   totalExpected: number;
// // //   redAlerts: number;
// // //   amberAlerts: number;
// // // };

// // // export default function DashboardPage() {
// // //   const router = useRouter();

// // //   const [me, setMe] = useState<MeResponse | null>(null);
// // //   const [loading, setLoading] = useState(true);

// // //   const [stats, setStats] = useState<DashboardStats>({
// // //     activePatients: 0,
// // //     internalPatients: 0,
// // //     externalPatients: 0,
// // //     pendingRegistrations: 0,
// // //     todaySubmissions: 0,
// // //     totalExpected: 0,
// // //     redAlerts: 0,
// // //     amberAlerts: 0,
// // //   });

// // //   async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// // //     const res = await fetch(url, {
// // //       headers: { Authorization: `Bearer ${accessToken}` },
// // //       cache: "no-store",
// // //     });

// // //     const body = await res.json().catch(() => null);
// // //     if (!res.ok) {
// // //       throw new Error(body?.detail || body?.message || "Request failed");
// // //     }
// // //     return body as T;
// // //   }

// // //   async function loadMe(accessToken: string) {
// // //     const body = await apiGet<MeResponse>(`${API_BASE}/users/me`, accessToken);
// // //     setMe(body);
// // //   }

// // //   async function loadDashboardStats(accessToken: string) {
// // //     const body = await apiGet<DashboardStats>(
// // //       `${API_BASE}/admin/dashboard-stats`,
// // //       accessToken
// // //     );
// // //     setStats(body);
// // //   }

// // //   async function logout() {
// // //     const refresh = localStorage.getItem("refresh_token");

// // //     try {
// // //       if (refresh) {
// // //         await fetch(`${API_BASE}/users/logout`, {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ refresh_token: refresh }),
// // //         });
// // //       }
// // //     } finally {
// // //       localStorage.removeItem("access_token");
// // //       localStorage.removeItem("refresh_token");
// // //       router.push("/login");
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     const access = localStorage.getItem("access_token");
// // //     if (!access) {
// // //       router.replace("/login");
// // //       return;
// // //     }

// // //     let intervalId: any;

// // //     (async () => {
// // //       try {
// // //         await loadMe(access);
// // //         await loadDashboardStats(access);

// // //         // ✅ auto-refresh stats every 60 seconds (optional)
// // //         intervalId = setInterval(() => {
// // //           loadDashboardStats(access).catch(() => {});
// // //         }, 60_000);
// // //       } catch (e) {
// // //         localStorage.removeItem("access_token");
// // //         localStorage.removeItem("refresh_token");
// // //         router.replace("/login");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();

// // //     return () => {
// // //       if (intervalId) clearInterval(intervalId);
// // //     };
// // //   }, [router]);

// // //   const currentDate = useMemo(() => {
// // //     return new Date().toLocaleDateString("en-US", {
// // //       weekday: "long",
// // //       year: "numeric",
// // //       month: "long",
// // //       day: "numeric",
// // //     });
// // //   }, []);

// // //   const completionRate = useMemo(() => {
// // //     if (!stats.totalExpected || stats.totalExpected <= 0) return 0;
// // //     return Math.round((stats.todaySubmissions / stats.totalExpected) * 100);
// // //   }, [stats.todaySubmissions, stats.totalExpected]);

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // //         <div className="text-lg">Loading dashboard...</div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!me) return null;

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       {/* Top Bar */}
// // //       <header className="bg-white shadow-sm border-b border-gray-200">
// // //         <div className="w-full px-6 py-4 flex items-center justify-between">
// // //           <div className="flex items-center gap-3">
// // //             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// // //               <svg
// // //                 className="w-6 h-6 text-white"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <div className="text-lg font-bold text-gray-900">
// // //                 Virtual Ward System
// // //               </div>
// // //               <div className="text-xs text-gray-500">Admin Dashboard</div>
// // //             </div>
// // //           </div>

// // //           <button
// // //             onClick={logout}
// // //             className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>
// // //       </header>

// // //       {/* Main Content */}
// // //       <main className="w-full px-6 py-6">
// // //         {/* Welcome Section */}
// // //         <div className="mb-6">
// // //           <h1 className="text-2xl font-bold text-gray-900">
// // //             Welcome, {me.name} 👋
// // //           </h1>
// // //           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
// // //             <span>📅</span>
// // //             <span>{currentDate}</span>
// // //           </p>
// // //         </div>

// // //         {/* Quick Stats */}
// // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //             <span>📊</span>
// // //             Quick Stats
// // //           </h2>

// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// // //             {/* Active Patients */}
// // //             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
// // //               <div className="flex items-center justify-between mb-2">
// // //                 <div className="text-xs font-medium opacity-90">
// // //                   Active Patients
// // //                 </div>
// // //                 <svg
// // //                   className="w-6 h-6 opacity-80"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   viewBox="0 0 24 24"
// // //                 >
// // //                   <path
// // //                     strokeLinecap="round"
// // //                     strokeLinejoin="round"
// // //                     strokeWidth={2}
// // //                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// // //                   />
// // //                 </svg>
// // //               </div>
// // //               <div className="text-3xl font-bold mb-1">
// // //                 {stats.activePatients}
// // //               </div>
// // //               <div className="text-xs opacity-90">
// // //                 {stats.internalPatients} Internal, {stats.externalPatients}{" "}
// // //                 External
// // //               </div>
// // //             </div>

// // //             {/* Today's Submissions */}
// // //             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
// // //               <div className="flex items-center justify-between mb-2">
// // //                 <div className="text-xs font-medium opacity-90">
// // //                   Today's Submissions
// // //                 </div>
// // //                 <svg
// // //                   className="w-6 h-6 opacity-80"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   viewBox="0 0 24 24"
// // //                 >
// // //                   <path
// // //                     strokeLinecap="round"
// // //                     strokeLinejoin="round"
// // //                     strokeWidth={2}
// // //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
// // //                   />
// // //                 </svg>
// // //               </div>
// // //               <div className="text-3xl font-bold mb-1">
// // //                 {stats.todaySubmissions}/{stats.totalExpected}
// // //               </div>
// // //               <div className="text-xs opacity-90">
// // //                 {completionRate}% completion rate
// // //               </div>
// // //             </div>

// // //             {/* Pending Registrations */}
// // //             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
// // //               <div className="flex items-center justify-between mb-2">
// // //                 <div className="text-xs font-medium opacity-90">
// // //                   Pending Registrations
// // //                 </div>
// // //                 <svg
// // //                   className="w-6 h-6 opacity-80"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   viewBox="0 0 24 24"
// // //                 >
// // //                   <path
// // //                     strokeLinecap="round"
// // //                     strokeLinejoin="round"
// // //                     strokeWidth={2}
// // //                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
// // //                   />
// // //                 </svg>
// // //               </div>
// // //               <div className="text-3xl font-bold mb-1">
// // //                 {stats.pendingRegistrations}
// // //               </div>
// // //               <div className="text-xs opacity-90">
// // //                 {stats.pendingRegistrations > 0
// // //                   ? "Requires review ⚠️"
// // //                   : "All caught up ✓"}
// // //               </div>
// // //             </div>

// // //             {/* Alerts */}
// // //             <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white">
// // //               <div className="flex items-center justify-between mb-2">
// // //                 <div className="text-xs font-medium opacity-90">Alerts</div>
// // //                 <svg
// // //                   className="w-6 h-6 opacity-80"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   viewBox="0 0 24 24"
// // //                 >
// // //                   <path
// // //                     strokeLinecap="round"
// // //                     strokeLinejoin="round"
// // //                     strokeWidth={2}
// // //                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// // //                   />
// // //                 </svg>
// // //               </div>
// // //               <div className="flex items-center gap-3 mb-1">
// // //                 <div className="text-2xl font-bold">🔴 {stats.redAlerts}</div>
// // //                 <div className="text-2xl font-bold">🟡 {stats.amberAlerts}</div>
// // //               </div>
// // //               <div className="text-xs opacity-90">RED | AMBER alerts</div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Main Menu */}
// // //         <div className="mb-4">
// // //           <h2 className="text-lg font-semibold text-gray-900">Main Menu</h2>
// // //         </div>

// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //           {/* Register Internal Patient */}
// // //           <button
// // //             onClick={() => router.push("/admin/register-internal")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // //           >
// // //             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-blue-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               ➕ Register Internal Patient
// // //             </h3>
// // //             <p className="text-sm text-gray-600">
// // //               Register hospital discharged patient
// // //             </p>
// // //           </button>

// // //           {/* Manage Questionnaires */}
// // //           <button
// // //             onClick={() =>
// // //               router.push("/admin/QuestionnaireTemplateManagement")
// // //             }
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // //           >
// // //             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-green-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               📋 Manage Questionnaires Template
// // //             </h3>
// // //             <p className="text-sm text-gray-600">
// // //               Create & edit questionnaires templates
// // //             </p>
// // //           </button>

// // //           {/* External Registrations */}
// // //           <button
// // //             onClick={() => router.push("/admin/external-registrations")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group relative"
// // //           >
// // //             {stats.pendingRegistrations > 0 && (
// // //               <div className="absolute top-4 right-4 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
// // //                 {stats.pendingRegistrations}
// // //               </div>
// // //             )}
// // //             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-orange-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               👥 External Registrations
// // //             </h3>
// // //             <p className="text-sm text-gray-600">
// // //               Review & approve applications
// // //               {stats.pendingRegistrations > 0 && (
// // //                 <span className="block mt-1 text-orange-600 font-medium">
// // //                   {stats.pendingRegistrations} pending ⚠️
// // //                 </span>
// // //               )}
// // //             </p>
// // //           </button>

// // //           {/* View All Patients */}
// // //           <button
// // //             onClick={() => router.push("/admin/patients")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // //           >
// // //             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-purple-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               📊 View All Patients
// // //             </h3>
// // //             <p className="text-sm text-gray-600">Search & manage patients</p>
// // //           </button>

// // //           {/* Monitoring Dashboard */}
// // //           <button
// // //             onClick={() => router.push("/admin/monitoring")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // //           >
// // //             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-red-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               🔔 Monitoring Dashboard
// // //             </h3>
// // //             <p className="text-sm text-gray-600">View alerts & submissions</p>
// // //           </button>

// // //           {/* Reports */}
// // //           <button
// // //             onClick={() => router.push("/admin/reports")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// // //           >
// // //             <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
// // //               <svg
// // //                 className="w-6 h-6 text-indigo-600"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth={2}
// // //                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               📈 Reports
// // //             </h3>
// // //             <p className="text-sm text-gray-600">View statistics & analytics</p>
// // //           </button>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { useRouter } from "next/navigation";

// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // type MeResponse = {
// //   id: number;
// //   name: string;
// //   email: string;
// //   email_verified: boolean;
// //   roles: string[];
// // };

// // type DashboardStats = {
// //   activePatients: number;
// //   internalPatients: number;
// //   externalPatients: number;
// //   pendingRegistrations: number;
// //   todaySubmissions: number;
// //   totalExpected: number;
// //   redAlerts: number;
// //   amberAlerts: number;

// //   // ✅ NEW (from admin_monitoring.py)
// //   unseenNotifications?: number;
// //   newSubmissionsToday?: number;
// // };

// // type NotificationCount = {
// //   unseen: number;
// // };

// // type AdminNotification = {
// //   id: number;
// //   type: string;
// //   severity: string;
// //   patient_id: number;
// //   patient_name: string;
// //   instance_id?: number | null;
// //   message: string;
// //   created_at: string;
// //   seen_at?: string | null;
// // };

// // function humanDate(value?: string | null) {
// //   if (!value) return "";
// //   const d = new Date(value);
// //   if (Number.isNaN(d.getTime())) return "";
// //   return d.toLocaleString(undefined, {
// //     year: "numeric",
// //     month: "short",
// //     day: "2-digit",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   });
// // }

// // export default function DashboardPage() {
// //   const router = useRouter();

// //   const [me, setMe] = useState<MeResponse | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   const [stats, setStats] = useState<DashboardStats>({
// //     activePatients: 0,
// //     internalPatients: 0,
// //     externalPatients: 0,
// //     pendingRegistrations: 0,
// //     todaySubmissions: 0,
// //     totalExpected: 0,
// //     redAlerts: 0,
// //     amberAlerts: 0,
// //     unseenNotifications: 0,
// //     newSubmissionsToday: 0,
// //   });

// //   // ✅ Notifications state
// //   const [notifOpen, setNotifOpen] = useState(false);
// //   const [notifLoading, setNotifLoading] = useState(false);
// //   const [notifError, setNotifError] = useState<string | null>(null);
// //   const [unseenCount, setUnseenCount] = useState(0);
// //   const [notifications, setNotifications] = useState<AdminNotification[]>([]);

// //   const notifRef = useRef<HTMLDivElement | null>(null);

// //   async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// //     const res = await fetch(url, {
// //       headers: { Authorization: `Bearer ${accessToken}` },
// //       cache: "no-store",
// //     });

// //     const body = await res.json().catch(() => null);
// //     if (!res.ok) {
// //       throw new Error(body?.detail || body?.message || "Request failed");
// //     }
// //     return body as T;
// //   }

// //   async function apiPost(url: string, accessToken: string, body?: any) {
// //     const res = await fetch(url, {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: body ? JSON.stringify(body) : undefined,
// //     });
// //     const data = await res.json().catch(() => ({}));
// //     if (!res.ok)
// //       throw new Error(data?.detail || data?.message || "Request failed");
// //     return data;
// //   }

// //   async function loadMe(accessToken: string) {
// //     const body = await apiGet<MeResponse>(`${API_BASE}/users/me`, accessToken);
// //     setMe(body);
// //   }

// //   async function loadDashboardStats(accessToken: string) {
// //     const body = await apiGet<DashboardStats>(
// //       `${API_BASE}/admin/dashboard-stats`,
// //       accessToken,
// //     );
// //     setStats(body);

// //     // if backend returns unseenNotifications, keep bell in sync
// //     if (typeof body.unseenNotifications === "number") {
// //       setUnseenCount(body.unseenNotifications);
// //     }
// //   }

// //   async function loadNotificationCount(accessToken: string) {
// //     const body = await apiGet<NotificationCount>(
// //       `${API_BASE}/admin/notifications/count`,
// //       accessToken,
// //     );
// //     setUnseenCount(body.unseen ?? 0);
// //   }

// //   async function loadNotifications(accessToken: string) {
// //     setNotifLoading(true);
// //     setNotifError(null);
// //     try {
// //       // Show unseen first for “alert” feel
// //       const url = new URL(`${API_BASE}/admin/notifications`);
// //       url.searchParams.set("unseen_only", "1");
// //       url.searchParams.set("limit", "10");

// //       const body = await apiGet<AdminNotification[]>(
// //         url.toString(),
// //         accessToken,
// //       );
// //       setNotifications(body ?? []);
// //     } catch (e: any) {
// //       setNotifError(e?.message || "Failed to load notifications");
// //     } finally {
// //       setNotifLoading(false);
// //     }
// //   }

// //   async function markSeen(accessToken: string, notificationId: number) {
// //     await apiPost(
// //       `${API_BASE}/admin/notifications/${notificationId}/mark-seen`,
// //       accessToken,
// //     );
// //     // refresh list + counts
// //     await Promise.all([
// //       loadNotificationCount(accessToken),
// //       loadNotifications(accessToken),
// //       loadDashboardStats(accessToken),
// //     ]);
// //   }

// //   async function markAllSeen(accessToken: string) {
// //     await apiPost(`${API_BASE}/admin/notifications/mark-all-seen`, accessToken);
// //     await Promise.all([
// //       loadNotificationCount(accessToken),
// //       loadNotifications(accessToken),
// //       loadDashboardStats(accessToken),
// //     ]);
// //   }

// //   async function logout() {
// //     const refresh = localStorage.getItem("refresh_token");

// //     try {
// //       if (refresh) {
// //         await fetch(`${API_BASE}/users/logout`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ refresh_token: refresh }),
// //         });
// //       }
// //     } finally {
// //       localStorage.removeItem("access_token");
// //       localStorage.removeItem("refresh_token");
// //       router.push("/login");
// //     }
// //   }

// //   // Close dropdown on outside click
// //   useEffect(() => {
// //     function onDocClick(e: MouseEvent) {
// //       if (!notifOpen) return;
// //       if (!notifRef.current) return;
// //       const target = e.target as Node;
// //       if (!notifRef.current.contains(target)) setNotifOpen(false);
// //     }
// //     document.addEventListener("mousedown", onDocClick);
// //     return () => document.removeEventListener("mousedown", onDocClick);
// //   }, [notifOpen]);

// //   useEffect(() => {
// //     const access = localStorage.getItem("access_token");
// //     if (!access) {
// //       router.replace("/login");
// //       return;
// //     }

// //     let intervalId: any;

// //     (async () => {
// //       try {
// //         await loadMe(access);
// //         await Promise.all([
// //           loadDashboardStats(access),
// //           loadNotificationCount(access),
// //         ]);

// //         // ✅ Auto refresh stats + notification count every 30s
// //         intervalId = setInterval(() => {
// //           loadDashboardStats(access).catch(() => {});
// //           loadNotificationCount(access).catch(() => {});
// //           // if dropdown is open, refresh list too
// //           if (notifOpen) loadNotifications(access).catch(() => {});
// //         }, 30_000);
// //       } catch (e) {
// //         localStorage.removeItem("access_token");
// //         localStorage.removeItem("refresh_token");
// //         router.replace("/login");
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       if (intervalId) clearInterval(intervalId);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [router, notifOpen]);

// //   const currentDate = useMemo(() => {
// //     return new Date().toLocaleDateString("en-US", {
// //       weekday: "long",
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     });
// //   }, []);

// //   const completionRate = useMemo(() => {
// //     if (!stats.totalExpected || stats.totalExpected <= 0) return 0;
// //     return Math.round((stats.todaySubmissions / stats.totalExpected) * 100);
// //   }, [stats.todaySubmissions, stats.totalExpected]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-lg">Loading dashboard...</div>
// //       </div>
// //     );
// //   }

// //   if (!me) return null;

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Top Bar */}
// //       <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="w-full px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// //               <svg
// //                 className="w-6 h-6 text-white"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// //                 />
// //               </svg>
// //             </div>
// //             <div>
// //               <div className="text-lg font-bold text-gray-900">
// //                 Virtual Ward System
// //               </div>
// //               <div className="text-xs text-gray-500">Admin Dashboard</div>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-3">
// //             {/* ✅ Notifications bell */}
// //             <div className="relative" ref={notifRef}>
// //               <button
// //                 onClick={async () => {
// //                   const access = localStorage.getItem("access_token");
// //                   if (!access) return;
// //                   const next = !notifOpen;
// //                   setNotifOpen(next);
// //                   if (next) {
// //                     await loadNotifications(access);
// //                   }
// //                 }}
// //                 className="relative rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
// //                 title="Notifications"
// //               >
// //                 <span className="mr-2">🔔</span>
// //                 Notifications
// //                 {unseenCount > 0 && (
// //                   <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
// //                     {unseenCount > 99 ? "99+" : unseenCount}
// //                   </span>
// //                 )}
// //               </button>

// //               {notifOpen && (
// //                 <div className="absolute right-0 mt-2 w-[420px] max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-xl">
// //                   <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
// //                     <div>
// //                       <div className="text-sm font-bold text-gray-900">
// //                         New submissions / notifications
// //                       </div>
// //                       <div className="text-xs text-gray-500">
// //                         Unseen: {unseenCount}
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center gap-2">
// //                       <button
// //                         onClick={async () => {
// //                           const access = localStorage.getItem("access_token");
// //                           if (!access) return;
// //                           await loadNotifications(access);
// //                           await loadNotificationCount(access);
// //                         }}
// //                         className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
// //                       >
// //                         Refresh
// //                       </button>

// //                       <button
// //                         onClick={async () => {
// //                           const access = localStorage.getItem("access_token");
// //                           if (!access) return;
// //                           await markAllSeen(access);
// //                         }}
// //                         className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
// //                         disabled={unseenCount === 0}
// //                         title="Mark all as seen"
// //                       >
// //                         Mark all seen
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div className="max-h-[420px] overflow-auto">
// //                     {notifLoading ? (
// //                       <div className="px-4 py-6 text-sm text-gray-600">
// //                         Loading notifications...
// //                       </div>
// //                     ) : notifError ? (
// //                       <div className="px-4 py-6 text-sm text-red-600">
// //                         {notifError}
// //                       </div>
// //                     ) : notifications.length === 0 ? (
// //                       <div className="px-4 py-6 text-sm text-gray-600">
// //                         No new notifications 🎉
// //                       </div>
// //                     ) : (
// //                       <div className="divide-y divide-gray-100">
// //                         {notifications.map((n) => (
// //                           <div
// //                             key={n.id}
// //                             className="px-4 py-3 hover:bg-gray-50"
// //                           >
// //                             <div className="flex items-start justify-between gap-3">
// //                               <div className="min-w-0">
// //                                 <div className="text-sm font-semibold text-gray-900">
// //                                   {n.type === "NEW_SUBMISSION"
// //                                     ? "✅ New questionnaire submission"
// //                                     : n.type}
// //                                 </div>
// //                                 <div className="mt-0.5 text-xs text-gray-600">
// //                                   <span className="font-semibold text-gray-800">
// //                                     {n.patient_name}
// //                                   </span>{" "}
// //                                   · {humanDate(n.created_at)}
// //                                 </div>
// //                                 <div className="mt-1 text-sm text-gray-700">
// //                                   {n.message}
// //                                 </div>

// //                                 {/* Optional: deep-link to patient */}
// //                                 <button
// //                                   onClick={() => {
// //                                     setNotifOpen(false);
// //                                     router.push(
// //                                       `/admin/patients/${n.patient_id}`,
// //                                     );
// //                                   }}
// //                                   className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-800"
// //                                 >
// //                                   View patient →
// //                                 </button>
// //                               </div>

// //                               <button
// //                                 onClick={async () => {
// //                                   const access =
// //                                     localStorage.getItem("access_token");
// //                                   if (!access) return;
// //                                   await markSeen(access, n.id);
// //                                 }}
// //                                 className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
// //                                 title="Mark seen"
// //                               >
// //                                 Seen
// //                               </button>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>

// //                   <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
// //                     Tip: This shows unseen notifications only. Mark them seen to
// //                     clear.
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <button
// //               onClick={logout}
// //               className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="w-full px-6 py-6">
// //         {/* Welcome Section */}
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-bold text-gray-900">
// //             Welcome, {me.name} 👋
// //           </h1>
// //           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
// //             <span>📅</span>
// //             <span>{currentDate}</span>
// //           </p>
// //         </div>

// //         {/* Quick Stats */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //             <span>📊</span>
// //             Quick Stats
// //           </h2>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //             {/* Active Patients */}
// //             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
// //               <div className="flex items-center justify-between mb-2">
// //                 <div className="text-xs font-medium opacity-90">
// //                   Active Patients
// //                 </div>
// //                 <svg
// //                   className="w-6 h-6 opacity-80"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// //                   />
// //                 </svg>
// //               </div>
// //               <div className="text-3xl font-bold mb-1">
// //                 {stats.activePatients}
// //               </div>
// //               <div className="text-xs opacity-90">
// //                 {stats.internalPatients} Internal, {stats.externalPatients}{" "}
// //                 External
// //               </div>
// //             </div>

// //             {/* Today's Submissions */}
// //             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
// //               <div className="flex items-center justify-between mb-2">
// //                 <div className="text-xs font-medium opacity-90">
// //                   Today's Submissions
// //                 </div>
// //                 <svg
// //                   className="w-6 h-6 opacity-80"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
// //                   />
// //                 </svg>
// //               </div>
// //               <div className="text-3xl font-bold mb-1">
// //                 {stats.todaySubmissions}/{stats.totalExpected}
// //               </div>
// //               <div className="text-xs opacity-90">
// //                 {completionRate}% completion rate
// //               </div>

// //               {/* ✅ optional extra line if backend sends newSubmissionsToday */}
// //               {typeof stats.newSubmissionsToday === "number" && (
// //                 <div className="mt-2 text-xs opacity-90">
// //                   New submissions (notif): {stats.newSubmissionsToday}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Pending Registrations */}
// //             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
// //               <div className="flex items-center justify-between mb-2">
// //                 <div className="text-xs font-medium opacity-90">
// //                   Pending Registrations
// //                 </div>
// //                 <svg
// //                   className="w-6 h-6 opacity-80"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
// //                   />
// //                 </svg>
// //               </div>
// //               <div className="text-3xl font-bold mb-1">
// //                 {stats.pendingRegistrations}
// //               </div>
// //               <div className="text-xs opacity-90">
// //                 {stats.pendingRegistrations > 0
// //                   ? "Requires review ⚠️"
// //                   : "All caught up ✓"}
// //               </div>
// //             </div>

// //             {/* Alerts */}
// //             <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white">
// //               <div className="flex items-center justify-between mb-2">
// //                 <div className="text-xs font-medium opacity-90">Alerts</div>
// //                 <svg
// //                   className="w-6 h-6 opacity-80"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// //                   />
// //                 </svg>
// //               </div>
// //               <div className="flex items-center gap-3 mb-1">
// //                 <div className="text-2xl font-bold">🔴 {stats.redAlerts}</div>
// //                 <div className="text-2xl font-bold">🟡 {stats.amberAlerts}</div>
// //               </div>
// //               <div className="text-xs opacity-90">RED | AMBER alerts</div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main Menu */}
// //         <div className="mb-4">
// //           <h2 className="text-lg font-semibold text-gray-900">Main Menu</h2>
// //         </div>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {/* Register Internal Patient */}
// //           <button
// //             onClick={() => router.push("/admin/register-internal")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-blue-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               ➕ Register Internal Patient
// //             </h3>
// //             <p className="text-sm text-gray-600">
// //               Register hospital discharged patient
// //             </p>
// //           </button>

// //           {/* Manage Questionnaires */}
// //           <button
// //             onClick={() =>
// //               router.push("/admin/QuestionnaireTemplateManagement")
// //             }
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-green-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               📋 Manage Questionnaires Template
// //             </h3>
// //             <p className="text-sm text-gray-600">
// //               Create & edit questionnaires templates
// //             </p>
// //           </button>

// //           {/* Manage Questionnaires */}
// //           <button
// //             onClick={() => router.push("/admin/questionnaires")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-green-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// //                 />
// //               </svg>
// //             </div>

// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               📋 Questionnaire Management
// //             </h3>
// //             <p className="text-sm text-gray-600">
// //               View, create, and manage questionnaire flows
// //             </p>
// //           </button>

// //           {/* External Registrations */}
// //           <button
// //             onClick={() => router.push("/admin/external-registrations")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group relative"
// //           >
// //             {stats.pendingRegistrations > 0 && (
// //               <div className="absolute top-4 right-4 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
// //                 {stats.pendingRegistrations}
// //               </div>
// //             )}
// //             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-orange-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               👥 External Registrations
// //             </h3>
// //             <p className="text-sm text-gray-600">
// //               Review & approve applications
// //               {stats.pendingRegistrations > 0 && (
// //                 <span className="block mt-1 text-orange-600 font-medium">
// //                   {stats.pendingRegistrations} pending ⚠️
// //                 </span>
// //               )}
// //             </p>
// //           </button>

// //           {/* View All Patients */}
// //           <button
// //             onClick={() => router.push("/admin/patients")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-purple-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               📊 View All Patients
// //             </h3>
// //             <p className="text-sm text-gray-600">Search & manage patients</p>
// //           </button>

// //           {/* Monitoring Dashboard */}
// //           <button
// //             onClick={() => router.push("/admin/monitoring")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-red-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               🔔 Monitoring Dashboard
// //             </h3>
// //             <p className="text-sm text-gray-600">View alerts & submissions</p>
// //           </button>

// //           {/* Reports */}
// //           <button
// //             onClick={() => router.push("/admin/reports")}
// //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md group"
// //           >
// //             <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
// //               <svg
// //                 className="w-6 h-6 text-indigo-600"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
// //                 />
// //               </svg>
// //             </div>
// //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// //               📈 Reports
// //             </h3>
// //             <p className="text-sm text-gray-600">View statistics & analytics</p>
// //           </button>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// type MeResponse = {
//   id: number;
//   name: string;
//   email: string;
//   email_verified: boolean;
//   roles: string[];
// };

// type DashboardStats = {
//   activePatients: number;
//   internalPatients: number;
//   externalPatients: number;
//   pendingRegistrations: number;
//   todaySubmissions: number;
//   totalExpected: number;
//   redAlerts: number;
//   amberAlerts: number;
//   unseenNotifications?: number;
//   newSubmissionsToday?: number;
// };

// type NotificationCount = {
//   unseen: number;
// };

// type AdminNotification = {
//   id: number;
//   type: string;
//   severity: string;
//   patient_id: number;
//   patient_name: string;
//   instance_id?: number | null;
//   message: string;
//   created_at: string;
//   seen_at?: string | null;
// };

// function humanDate(value?: string | null) {
//   if (!value) return "";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toLocaleString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function DashboardPage() {
//   const router = useRouter();

//   const [me, setMe] = useState<MeResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const [stats, setStats] = useState<DashboardStats>({
//     activePatients: 0,
//     internalPatients: 0,
//     externalPatients: 0,
//     pendingRegistrations: 0,
//     todaySubmissions: 0,
//     totalExpected: 0,
//     redAlerts: 0,
//     amberAlerts: 0,
//     unseenNotifications: 0,
//     newSubmissionsToday: 0,
//   });

//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifLoading, setNotifLoading] = useState(false);
//   const [notifError, setNotifError] = useState<string | null>(null);
//   const [unseenCount, setUnseenCount] = useState(0);
//   const [notifications, setNotifications] = useState<AdminNotification[]>([]);

//   const notifRef = useRef<HTMLDivElement | null>(null);

//   async function apiGet<T>(url: string, accessToken: string): Promise<T> {
//     const res = await fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       cache: "no-store",
//     });

//     const body = await res.json().catch(() => null);
//     if (!res.ok) {
//       throw new Error(body?.detail || body?.message || "Request failed");
//     }
//     return body as T;
//   }

//   async function apiPost(url: string, accessToken: string, body?: any) {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: body ? JSON.stringify(body) : undefined,
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok)
//       throw new Error(data?.detail || data?.message || "Request failed");
//     return data;
//   }

//   async function loadMe(accessToken: string) {
//     const body = await apiGet<MeResponse>(`${API_BASE}/users/me`, accessToken);
//     setMe(body);
//   }

//   async function loadDashboardStats(accessToken: string) {
//     const body = await apiGet<DashboardStats>(
//       `${API_BASE}/admin/dashboard-stats`,
//       accessToken,
//     );
//     setStats(body);

//     if (typeof body.unseenNotifications === "number") {
//       setUnseenCount(body.unseenNotifications);
//     }
//   }

//   async function loadNotificationCount(accessToken: string) {
//     const body = await apiGet<NotificationCount>(
//       `${API_BASE}/admin/notifications/count`,
//       accessToken,
//     );
//     setUnseenCount(body.unseen ?? 0);
//   }

//   async function loadNotifications(accessToken: string) {
//     setNotifLoading(true);
//     setNotifError(null);
//     try {
//       const url = new URL(`${API_BASE}/admin/notifications`);
//       url.searchParams.set("unseen_only", "1");
//       url.searchParams.set("limit", "10");

//       const body = await apiGet<AdminNotification[]>(
//         url.toString(),
//         accessToken,
//       );
//       setNotifications(body ?? []);
//     } catch (e: any) {
//       setNotifError(e?.message || "Failed to load notifications");
//     } finally {
//       setNotifLoading(false);
//     }
//   }

//   async function markSeen(accessToken: string, notificationId: number) {
//     await apiPost(
//       `${API_BASE}/admin/notifications/${notificationId}/mark-seen`,
//       accessToken,
//     );
//     await Promise.all([
//       loadNotificationCount(accessToken),
//       loadNotifications(accessToken),
//       loadDashboardStats(accessToken),
//     ]);
//   }

//   async function markAllSeen(accessToken: string) {
//     await apiPost(`${API_BASE}/admin/notifications/mark-all-seen`, accessToken);
//     await Promise.all([
//       loadNotificationCount(accessToken),
//       loadNotifications(accessToken),
//       loadDashboardStats(accessToken),
//     ]);
//   }

//   async function logout() {
//     const refresh = localStorage.getItem("refresh_token");

//     try {
//       if (refresh) {
//         await fetch(`${API_BASE}/users/logout`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh_token: refresh }),
//         });
//       }
//     } finally {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       router.push("/login");
//     }
//   }

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       if (!notifOpen) return;
//       if (!notifRef.current) return;
//       const target = e.target as Node;
//       if (!notifRef.current.contains(target)) setNotifOpen(false);
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [notifOpen]);

//   useEffect(() => {
//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       router.replace("/login");
//       return;
//     }

//     let intervalId: any;

//     (async () => {
//       try {
//         await loadMe(access);
//         await Promise.all([
//           loadDashboardStats(access),
//           loadNotificationCount(access),
//         ]);

//         intervalId = setInterval(() => {
//           loadDashboardStats(access).catch(() => {});
//           loadNotificationCount(access).catch(() => {});
//           if (notifOpen) loadNotifications(access).catch(() => {});
//         }, 30_000);
//       } catch (e) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         router.replace("/login");
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [router, notifOpen]);

//   const currentDate = useMemo(() => {
//     return new Date().toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   }, []);

//   const completionRate = useMemo(() => {
//     if (!stats.totalExpected || stats.totalExpected <= 0) return 0;
//     return Math.round((stats.todaySubmissions / stats.totalExpected) * 100);
//   }, [stats.todaySubmissions, stats.totalExpected]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f4f5fa]">
//         <div className="text-lg text-gray-700">Loading dashboard...</div>
//       </div>
//     );
//   }

//   if (!me) return null;

//   return (
//     <div className="min-h-screen bg-[#f4f5fa] flex">
//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-20"
//         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
//       >
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200 flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//             <svg
//               className="w-6 h-6 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           </div>
//           {sidebarOpen && (
//             <span className="text-xl font-bold text-purple-600">MATERIO</span>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-1">
//           <div className="mb-3">
//             {sidebarOpen && (
//               <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
//                 Pages
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => router.push("/dashboard")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-purple-50 text-purple-600 font-medium hover:bg-purple-100 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//               />
//             </svg>
//             {sidebarOpen && <span>Dashboard</span>}
//           </button>

//           <button
//             onClick={() => router.push("/admin/patients")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//               />
//             </svg>
//             {sidebarOpen && <span>Patients</span>}
//           </button>

//           <button
//             onClick={() => router.push("/admin/register-internal")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//               />
//             </svg>
//             {sidebarOpen && <span>Register</span>}
//           </button>

//           <div className="mt-6 mb-3">
//             {sidebarOpen && (
//               <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
//                 User Interface
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => router.push("/admin/questionnaires")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             {sidebarOpen && <span>Questionnaires</span>}
//           </button>

//           <button
//             onClick={() => router.push("/admin/monitoring")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//               />
//             </svg>
//             {sidebarOpen && <span>Monitoring</span>}
//           </button>

//           <button
//             onClick={() => router.push("/admin/reports")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//               />
//             </svg>
//             {sidebarOpen && <span>Reports</span>}
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Bar */}
//         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <svg
//                 className="w-6 h-6 text-gray-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
//               />
//               <svg
//                 className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Theme Toggle */}
//             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               <svg
//                 className="w-5 h-5 text-gray-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                 />
//               </svg>
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notifRef}>
//               <button
//                 onClick={async () => {
//                   const access = localStorage.getItem("access_token");
//                   if (!access) return;
//                   const next = !notifOpen;
//                   setNotifOpen(next);
//                   if (next) {
//                     await loadNotifications(access);
//                   }
//                 }}
//                 className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   className="w-5 h-5 text-gray-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                   />
//                 </svg>
//                 {unseenCount > 0 && (
//                   <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//                     {unseenCount > 9 ? "9+" : unseenCount}
//                   </span>
//                 )}
//               </button>

//               {notifOpen && (
//                 <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//                   <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-gray-900">
//                         Notifications
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         You have {unseenCount} unread messages
//                       </div>
//                     </div>
//                     <button
//                       onClick={async () => {
//                         const access = localStorage.getItem("access_token");
//                         if (!access) return;
//                         await markAllSeen(access);
//                       }}
//                       className="text-xs text-purple-600 hover:text-purple-700 font-medium"
//                       disabled={unseenCount === 0}
//                     >
//                       Mark all read
//                     </button>
//                   </div>

//                   <div className="max-h-96 overflow-y-auto">
//                     {notifLoading ? (
//                       <div className="p-4 text-sm text-gray-600">
//                         Loading...
//                       </div>
//                     ) : notifError ? (
//                       <div className="p-4 text-sm text-red-600">
//                         {notifError}
//                       </div>
//                     ) : notifications.length === 0 ? (
//                       <div className="p-8 text-center text-gray-500">
//                         No new notifications
//                       </div>
//                     ) : (
//                       notifications.map((n) => (
//                         <div
//                           key={n.id}
//                           className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="flex-1">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {n.type === "NEW_SUBMISSION"
//                                   ? "New questionnaire submission"
//                                   : n.type}
//                               </div>
//                               <div className="text-xs text-gray-600 mt-1">
//                                 {n.patient_name} · {humanDate(n.created_at)}
//                               </div>
//                               <div className="text-sm text-gray-700 mt-1">
//                                 {n.message}
//                               </div>
//                               <button
//                                 onClick={() => {
//                                   setNotifOpen(false);
//                                   router.push(
//                                     `/admin/patients/${n.patient_id}`,
//                                   );
//                                 }}
//                                 className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-2"
//                               >
//                                 View patient →
//                               </button>
//                             </div>
//                             <button
//                               onClick={async () => {
//                                 const access =
//                                   localStorage.getItem("access_token");
//                                 if (!access) return;
//                                 await markSeen(access, n.id);
//                               }}
//                               className="text-xs text-gray-500 hover:text-gray-700"
//                             >
//                               ✓
//                             </button>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* User Profile */}
//             <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
//                 {me.name.charAt(0).toUpperCase()}
//               </div>
//               <button
//                 onClick={logout}
//                 className="text-sm text-gray-700 hover:text-gray-900"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 p-6 overflow-auto">
//           {/* Page Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
//             <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
//           </div>

//           {/* Grid Layout */}
//           <div className="grid grid-cols-12 gap-6">
//             {/* Congratulations Card */}
//             <div className="col-span-12 md:col-span-4">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden">
//                 <div className="relative z-10">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                     Congratulations {me.name}! 🎉
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Best seller of the month
//                   </p>
//                   <div className="text-3xl font-bold text-purple-600 mb-3">
//                     ${((stats.activePatients * 42.8) / 10).toFixed(1)}k
//                   </div>
//                   <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
//                     VIEW SALES
//                   </button>
//                 </div>
//                 <div className="absolute right-4 bottom-4 opacity-10">
//                   <svg
//                     className="w-32 h-32 text-purple-600"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Statistics Cards */}
//             <div className="col-span-12 md:col-span-8">
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-purple-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 mb-1">Sales</div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {stats.todaySubmissions}k
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-green-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 mb-1">Customers</div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {stats.activePatients}.{stats.internalPatients}k
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-orange-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 mb-1">Products</div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     1.{stats.externalPatients}k
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-blue-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 mb-1">Revenue</div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     ${stats.redAlerts + stats.amberAlerts}8k
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Weekly Overview */}
//             <div className="col-span-12 md:col-span-4">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Weekly Overview
//                 </h3>
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-sm text-gray-600">Sales</div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       {completionRate}%
//                     </div>
//                   </div>
//                   <div className="w-full h-32 flex items-end gap-2">
//                     {[70, 45, 85, 40, 60, 35, 90].map((height, i) => (
//                       <div
//                         key={i}
//                         className="flex-1 bg-purple-600 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
//                         style={{ height: `${height}%` }}
//                       />
//                     ))}
//                   </div>
//                   <div className="flex items-center justify-between mt-2">
//                     <div className="text-xs text-gray-500">Mon</div>
//                     <div className="text-xs text-gray-500">Sun</div>
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold text-gray-900 mb-1">
//                   {completionRate}%
//                 </div>
//                 <div className="text-sm text-gray-600 mb-4">
//                   Your sales performance is {completionRate}% 😎 better compared
//                   to last month
//                 </div>
//                 <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
//                   DETAILS
//                 </button>
//               </div>
//             </div>

//             {/* Total Earning */}
//             <div className="col-span-12 md:col-span-4">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Total Earning
//                 </h3>
//                 <div className="mb-4">
//                   <div className="w-40 h-40 mx-auto">
//                     <svg viewBox="0 0 100 100" className="transform -rotate-90">
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="40"
//                         fill="none"
//                         stroke="#e5e7eb"
//                         strokeWidth="12"
//                       />
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="40"
//                         fill="none"
//                         stroke="#9333ea"
//                         strokeWidth="12"
//                         strokeDasharray={`${completionRate * 2.51} ${251 - completionRate * 2.51}`}
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                         <svg
//                           className="w-5 h-5 text-purple-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Zipcar
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Vuejs, React & HTML
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       $24,895.65
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                         <svg
//                           className="w-5 h-5 text-orange-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Bitbank
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Sketch, Figma & XD
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       $8,650.20
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                         <svg
//                           className="w-5 h-5 text-blue-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Aviato
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           HTML & Angular
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       $1,245.80
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Small Stats Cards */}
//             <div className="col-span-12 md:col-span-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                       <svg
//                         className="w-5 h-5 text-green-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                         />
//                       </svg>
//                     </div>
//                     <span className="text-xs font-semibold text-green-600">
//                       +42%
//                     </span>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-1">
//                     $25.6k
//                   </div>
//                   <div className="text-xs text-gray-600">Total Profit</div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     Weekly Profit
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//                       <svg
//                         className="w-5 h-5 text-gray-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </div>
//                     <span className="text-xs font-semibold text-red-600">
//                       -15%
//                     </span>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-1">
//                     ${stats.redAlerts + stats.amberAlerts}
//                   </div>
//                   <div className="text-xs text-gray-600">Refunds</div>
//                   <div className="text-xs text-gray-500 mt-1">Past Month</div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                       <svg
//                         className="w-5 h-5 text-purple-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <span className="text-xs font-semibold text-red-600">
//                       -18%
//                     </span>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-1">
//                     {stats.pendingRegistrations}62
//                   </div>
//                   <div className="text-xs text-gray-600">New Project</div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     Yearly Project
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                       <svg
//                         className="w-5 h-5 text-orange-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </div>
//                     <span className="text-xs font-semibold text-red-600">
//                       -18%
//                     </span>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-1">
//                     {stats.totalExpected}
//                   </div>
//                   <div className="text-xs text-gray-600">Sales Queries</div>
//                   <div className="text-xs text-gray-500 mt-1">Last Week</div>
//                 </div>
//               </div>
//             </div>

//             {/* Sales by Countries */}
//             <div className="col-span-12 md:col-span-4">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Sales by Countries
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
//                         US
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           $8,656k
//                         </div>
//                         <div className="text-xs text-gray-500">USA</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-semibold text-green-600">
//                         +25.8%
//                       </div>
//                       <div className="text-xs text-gray-500">894k Sales</div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
//                         UK
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           $2,415k
//                         </div>
//                         <div className="text-xs text-gray-500">UK</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-semibold text-red-600">
//                         -6.2%
//                       </div>
//                       <div className="text-xs text-gray-500">645k Sales</div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
//                         IN
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           $865k
//                         </div>
//                         <div className="text-xs text-gray-500">India</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-semibold text-green-600">
//                         +12.4%
//                       </div>
//                       <div className="text-xs text-gray-500">148k Sales</div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//                         JA
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           $745k
//                         </div>
//                         <div className="text-xs text-gray-500">Japan</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-semibold text-red-600">
//                         -11.9%
//                       </div>
//                       <div className="text-xs text-gray-500">86k Sales</div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
//                         KO
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           $512k
//                         </div>
//                         <div className="text-xs text-gray-500">Korea</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm font-semibold text-green-600">
//                         +16.2%
//                       </div>
//                       <div className="text-xs text-gray-500">42k Sales</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Deposit & Withdraw */}
//             <div className="col-span-12 md:col-span-8">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Deposit
//                     </h3>
//                   </div>
//                   <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
//                     View All
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Gumroad Account
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Sell UI Kit
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-green-600">
//                         +$4,650
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-red-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Mastercard
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Wallet deposit
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-green-600">
//                         +$92,705
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-blue-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Stripe Account
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             iOS Application
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-green-600">
//                         +$957
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-green-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             American Bank
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Bank Transfer
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-green-600">
//                         +$6,837
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         Withdraw
//                       </h3>
//                       <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
//                         View All
//                       </button>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-orange-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Google Adsense
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Paypal deposit
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-red-600">
//                         -$145
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-purple-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Github Enterprise
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Security & compliance
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-red-600">
//                         -$1870
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-blue-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Upgrade Slack Plan
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Debit card deposit
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-red-600">
//                         -$450
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-pink-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             Digital Ocean
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Cloud Hosting
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-semibold text-red-600">
//                         -$540
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Data Table */}
//             <div className="col-span-12">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-6 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Recent Activity
//                   </h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           ID
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Patient
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Submissions
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           #1001
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs mr-3">
//                               JD
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 John Doe
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 john@example.com
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {stats.todaySubmissions}/{stats.totalExpected}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {currentDate}
//                         </td>
//                       </tr>
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           #1002
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs mr-3">
//                               JS
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 Jane Smith
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 jane@example.com
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
//                             Pending
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {stats.pendingRegistrations}/7
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {currentDate}
//                         </td>
//                       </tr>
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           #1003
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs mr-3">
//                               RJ
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 Robert Johnson
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 robert@example.com
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Alert
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {stats.redAlerts}/{stats.totalExpected}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {currentDate}
//                         </td>
//                       </tr>
//                       <tr className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           #1004
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs mr-3">
//                               EB
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 Emily Brown
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 emily@example.com
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {stats.activePatients}/7
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {currentDate}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Showing 1 to 4 of {stats.activePatients} results
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
//                       Previous
//                     </button>
//                     <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
//                       1
//                     </button>
//                     <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
//                       2
//                     </button>
//                     <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

type MeResponse = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  roles: string[];
};

type DashboardStats = {
  activePatients: number;
  internalPatients: number;
  externalPatients: number;
  pendingRegistrations: number;
  todaySubmissions: number;
  totalExpected: number;
  redAlerts: number;
  amberAlerts: number;
  unseenNotifications?: number;
  newSubmissionsToday?: number;
};

type NotificationCount = {
  unseen: number;
};

type AdminNotification = {
  id: number;
  type: string;
  severity: string;
  patient_id: number;
  patient_name: string;
  instance_id?: number | null;
  message: string;
  created_at: string;
  seen_at?: string | null;
};

function humanDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    activePatients: 0,
    internalPatients: 0,
    externalPatients: 0,
    pendingRegistrations: 0,
    todaySubmissions: 0,
    totalExpected: 0,
    redAlerts: 0,
    amberAlerts: 0,
    unseenNotifications: 0,
    newSubmissionsToday: 0,
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [unseenCount, setUnseenCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const notifRef = useRef<HTMLDivElement | null>(null);

  async function apiGet<T>(url: string, accessToken: string): Promise<T> {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(body?.detail || body?.message || "Request failed");
    }
    return body as T;
  }

  async function apiPost(url: string, accessToken: string, body?: any) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data?.detail || data?.message || "Request failed");
    return data;
  }

  async function loadMe(accessToken: string) {
    const body = await apiGet<MeResponse>(`${API_BASE}/users/me`, accessToken);
    setMe(body);
  }

  async function loadDashboardStats(accessToken: string) {
    const body = await apiGet<DashboardStats>(
      `${API_BASE}/admin/dashboard-stats`,
      accessToken,
    );
    setStats(body);

    if (typeof body.unseenNotifications === "number") {
      setUnseenCount(body.unseenNotifications);
    }
  }

  async function loadNotificationCount(accessToken: string) {
    const body = await apiGet<NotificationCount>(
      `${API_BASE}/admin/notifications/count`,
      accessToken,
    );
    setUnseenCount(body.unseen ?? 0);
  }

  async function loadNotifications(accessToken: string) {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const url = new URL(`${API_BASE}/admin/notifications`);
      url.searchParams.set("unseen_only", "1");
      url.searchParams.set("limit", "10");

      const body = await apiGet<AdminNotification[]>(
        url.toString(),
        accessToken,
      );
      setNotifications(body ?? []);
    } catch (e: any) {
      setNotifError(e?.message || "Failed to load notifications");
    } finally {
      setNotifLoading(false);
    }
  }

  async function markSeen(accessToken: string, notificationId: number) {
    await apiPost(
      `${API_BASE}/admin/notifications/${notificationId}/mark-seen`,
      accessToken,
    );
    await Promise.all([
      loadNotificationCount(accessToken),
      loadNotifications(accessToken),
      loadDashboardStats(accessToken),
    ]);
  }

  async function markAllSeen(accessToken: string) {
    await apiPost(`${API_BASE}/admin/notifications/mark-all-seen`, accessToken);
    await Promise.all([
      loadNotificationCount(accessToken),
      loadNotifications(accessToken),
      loadDashboardStats(accessToken),
    ]);
  }

  async function logout() {
    const refresh = localStorage.getItem("refresh_token");

    try {
      if (refresh) {
        await fetch(`${API_BASE}/users/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });
      }
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/login");
    }
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!notifOpen) return;
      if (!notifRef.current) return;
      const target = e.target as Node;
      if (!notifRef.current.contains(target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen]);

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    let intervalId: any;

    (async () => {
      try {
        await loadMe(access);
        await Promise.all([
          loadDashboardStats(access),
          loadNotificationCount(access),
        ]);

        intervalId = setInterval(() => {
          loadDashboardStats(access).catch(() => {});
          loadNotificationCount(access).catch(() => {});
          if (notifOpen) loadNotifications(access).catch(() => {});
        }, 30_000);
      } catch (e) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router, notifOpen]);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const completionRate = useMemo(() => {
    if (!stats.totalExpected || stats.totalExpected <= 0) return 0;
    return Math.round((stats.todaySubmissions / stats.totalExpected) * 100);
  }, [stats.todaySubmissions, stats.totalExpected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5fa]">
        <div className="text-lg text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          {sidebarOpen && (
            <span className="text-xl font-bold text-teal-600">
              VIRTUAL WARD
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-3">
            {sidebarOpen && (
              <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
                Pages
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => router.push("/admin/patients")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {sidebarOpen && <span>Patients</span>}
          </button>

          <button
            onClick={() => router.push("/admin/register-internal")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
            {sidebarOpen && <span>Register</span>}
          </button>

          <div className="mt-6 mb-3">
            {sidebarOpen && (
              <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
                User Interface
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/admin/questionnaires")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {sidebarOpen && <span>Questionnaires</span>}
          </button>

          <button
            onClick={() => router.push("/admin/monitoring")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {sidebarOpen && <span>Monitoring</span>}
          </button>

          <button
            onClick={() => router.push("/admin/reports")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {sidebarOpen && <span>Reports</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={async () => {
                  const access = localStorage.getItem("access_token");
                  if (!access) return;
                  const next = !notifOpen;
                  setNotifOpen(next);
                  if (next) {
                    await loadNotifications(access);
                  }
                }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unseenCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unseenCount > 9 ? "9+" : unseenCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Notifications
                      </div>
                      <div className="text-xs text-gray-500">
                        You have {unseenCount} unread messages
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        const access = localStorage.getItem("access_token");
                        if (!access) return;
                        await markAllSeen(access);
                      }}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                      disabled={unseenCount === 0}
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifLoading ? (
                      <div className="p-4 text-sm text-gray-600">
                        Loading...
                      </div>
                    ) : notifError ? (
                      <div className="p-4 text-sm text-red-600">
                        {notifError}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {n.type === "NEW_SUBMISSION"
                                  ? "New questionnaire submission"
                                  : n.type}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {n.patient_name} · {humanDate(n.created_at)}
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {n.message}
                              </div>
                              <button
                                onClick={() => {
                                  setNotifOpen(false);
                                  router.push(
                                    `/admin/patients/${n.patient_id}`,
                                  );
                                }}
                                className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-2"
                              >
                                View patient →
                              </button>
                            </div>
                            <button
                              onClick={async () => {
                                const access =
                                  localStorage.getItem("access_token");
                                if (!access) return;
                                await markSeen(access, n.id);
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                {me.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Congratulations Card */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Excellent System Health! 🎉
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Completion rate this month
                  </p>
                  <div className="text-3xl font-bold text-teal-600 mb-3">
                    {completionRate}%
                  </div>
                  <button
                    onClick={() => router.push("/admin/monitoring")}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    VIEW DETAILS
                  </button>
                </div>
                <div className="absolute right-4 bottom-4 opacity-10">
                  <svg
                    className="w-32 h-32 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Today's Submissions
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.todaySubmissions}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Active Patients
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activePatients}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Pending Registrations
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.pendingRegistrations}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Total Alerts</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.redAlerts + stats.amberAlerts}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Overview */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Weekly Submission Rate
                </h3>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Submissions</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {completionRate}%
                    </div>
                  </div>
                  <div className="w-full h-32 flex items-end gap-2">
                    {[70, 45, 85, 40, 60, 35, 90].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-teal-600 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">Mon</div>
                    <div className="text-xs text-gray-500">Sun</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {completionRate}%
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Your submission rate is{" "}
                  {completionRate >= 85
                    ? "😊 excellent"
                    : completionRate >= 70
                      ? "👍 good"
                      : "⚠️ needs improvement"}{" "}
                  compared to last week
                </div>
                <button
                  onClick={() => router.push("/admin/monitoring")}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  DETAILS
                </button>
              </div>
            </div>

            {/* Patient Activity Overview */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Patient Activity
                </h3>
                <div className="mb-4">
                  <div className="w-40 h-40 mx-auto">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="12"
                        strokeDasharray={`${completionRate * 2.51} ${251 - completionRate * 2.51}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center -mt-28">
                      <div className="text-2xl font-bold text-gray-900">
                        {completionRate}%
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-teal-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Daily Submissions
                        </div>
                        <div className="text-xs text-gray-500">
                          Completed today
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stats.todaySubmissions}/{stats.totalExpected}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Pending Reviews
                        </div>
                        <div className="text-xs text-gray-500">
                          Awaiting approval
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stats.pendingRegistrations}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Active Patients
                        </div>
                        <div className="text-xs text-gray-500">
                          Currently enrolled
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stats.activePatients}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Stats Cards */}
            <div className="col-span-12 md:col-span-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-green-600">
                      +
                      {Math.round(
                        (stats.todaySubmissions / stats.totalExpected) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {completionRate}%
                  </div>
                  <div className="text-xs text-gray-600">Completion Rate</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.todaySubmissions}/{stats.totalExpected} today
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-red-600">
                      Urgent
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.redAlerts}
                  </div>
                  <div className="text-xs text-gray-600">Red Alerts</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last 24 hours
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-teal-600"
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
                    </div>
                    <span className="text-xs font-semibold text-green-600">
                      +{stats.internalPatients}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.internalPatients + stats.externalPatients}
                  </div>
                  <div className="text-xs text-gray-600">New Patients</div>
                  <div className="text-xs text-gray-500 mt-1">This week</div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-orange-600">
                      Overdue
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalExpected - stats.todaySubmissions}
                  </div>
                  <div className="text-xs text-gray-600">
                    Missed Submissions
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Expected today
                  </div>
                </div>
              </div>
            </div>

            {/* Patients by Ward/Department */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patients by Ward
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                        CA
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(stats.activePatients * 0.35)}
                        </div>
                        <div className="text-xs text-gray-500">Cardiology</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        +15.3%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(stats.activePatients * 0.35 * 5.7)}{" "}
                        submissions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-xs">
                        RE
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(stats.activePatients * 0.25)}
                        </div>
                        <div className="text-xs text-gray-500">Respiratory</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        -8.2%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(stats.activePatients * 0.25 * 4.1)}{" "}
                        submissions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xs">
                        OR
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(stats.activePatients * 0.2)}
                        </div>
                        <div className="text-xs text-gray-500">Orthopedic</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        +10.4%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(stats.activePatients * 0.2 * 3.5)}{" "}
                        submissions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                        GM
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(stats.activePatients * 0.15)}
                        </div>
                        <div className="text-xs text-gray-500">
                          General Medicine
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        -5.9%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(stats.activePatients * 0.15 * 3.1)}{" "}
                        submissions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-xs">
                        PS
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(stats.activePatients * 0.05)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Post-Surgery
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        +12.1%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(stats.activePatients * 0.05 * 2.7)}{" "}
                        submissions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Admissions & Alerts */}
            <div className="col-span-12 md:col-span-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Admissions & Completions
                    </h3>
                  </div>
                  <button
                    onClick={() => router.push("/admin/patients")}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            John Smith
                          </div>
                          <div className="text-xs text-gray-500">
                            Completed Week 1
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-teal-600">
                        2h ago
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
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
                          <div className="text-sm font-medium text-gray-900">
                            Sarah Johnson
                          </div>
                          <div className="text-xs text-gray-500">
                            Successfully Discharged
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        Today 10:30
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Mike Davis
                          </div>
                          <div className="text-xs text-gray-500">
                            All vitals normal
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        Yesterday
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Emily Brown
                          </div>
                          <div className="text-xs text-gray-500">
                            Registered to Ward
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        2 days ago
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Alerts & Issues
                      </h3>
                      <button
                        onClick={() => router.push("/admin/monitoring")}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        View All
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Robert Johnson
                          </div>
                          <div className="text-xs text-gray-500">
                            Red Alert: Missed 2 submissions
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        3h ago
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Lisa Anderson
                          </div>
                          <div className="text-xs text-gray-500">
                            Amber Alert: Late submission
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-orange-600">
                        5h ago
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            James Wilson
                          </div>
                          <div className="text-xs text-gray-500">
                            Requested early discharge
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        Today 9:00
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Maria Garcia
                          </div>
                          <div className="text-xs text-gray-500">
                            Appointment rescheduled
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        Yesterday
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="col-span-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #1001
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs mr-3">
                              JD
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                John Doe
                              </div>
                              <div className="text-xs text-gray-500">
                                john@example.com
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.todaySubmissions}/{stats.totalExpected}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentDate}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #1002
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs mr-3">
                              JS
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Jane Smith
                              </div>
                              <div className="text-xs text-gray-500">
                                jane@example.com
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.pendingRegistrations}/7
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentDate}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #1003
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs mr-3">
                              RJ
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Robert Johnson
                              </div>
                              <div className="text-xs text-gray-500">
                                robert@example.com
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Alert
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.redAlerts}/{stats.totalExpected}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentDate}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #1004
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs mr-3">
                              EB
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Emily Brown
                              </div>
                              <div className="text-xs text-gray-500">
                                emily@example.com
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stats.activePatients}/7
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentDate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing 1 to 4 of {stats.activePatients} results
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
