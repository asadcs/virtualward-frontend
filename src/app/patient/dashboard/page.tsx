// // // // "use client";

// // // // import { useEffect, useMemo, useState } from "react";
// // // // import { useRouter } from "next/navigation";

// // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // type MeResponse = {
// // // //   id: number;
// // // //   name: string;
// // // //   email: string;
// // // //   email_verified: boolean;
// // // //   roles: string[];
// // // // };

// // // // type DueItem = {
// // // //   assignment_id: number;
// // // //   template_id: number;
// // // //   template_name: string;
// // // //   status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
// // // //   instance_id?: number | null;
// // // // };

// // // // type DashboardResponse = {
// // // //   cutoff_time: string;
// // // //   today_status: "DUE" | "COMPLETED" | "NO_CHECKIN" | "MISSED" | string;
// // // //   time_left_seconds: number;
// // // //   missed_count: number;
// // // //   due_today: DueItem[];
// // // // };

// // // // type Attempt = {
// // // //   instance_id: number;
// // // //   template_id: number;
// // // //   template_name: string;
// // // //   scheduled_for: string;
// // // //   submitted_at: string | null;
// // // //   total_score: number;
// // // // };

// // // // function secondsToLabel(totalSeconds: number) {
// // // //   if (!totalSeconds || totalSeconds <= 0) return "Day ended";
// // // //   const h = Math.floor(totalSeconds / 3600);
// // // //   const m = Math.floor((totalSeconds % 3600) / 60);
// // // //   if (h <= 0) return `${m}m left today`;
// // // //   return `${h}h ${m}m left today`;
// // // // }

// // // // function humanDate(value?: string | null) {
// // // //   if (!value) return "—";
// // // //   const d = new Date(value);
// // // //   if (Number.isNaN(d.getTime())) return value;
// // // //   return d.toLocaleString();
// // // // }

// // // // export default function PatientDashboardPage() {
// // // //   const router = useRouter();

// // // //   const [me, setMe] = useState<MeResponse | null>(null);
// // // //   const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

// // // //   const [attempts, setAttempts] = useState<Attempt[]>([]);
// // // //   const [attemptsLoading, setAttemptsLoading] = useState(false);

// // // //   const [loading, setLoading] = useState(true);
// // // //   const [dashLoading, setDashLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const accessToken = useMemo(() => {
// // // //     if (typeof window === "undefined") return null;
// // // //     return localStorage.getItem("access_token");
// // // //   }, []);

// // // //   async function loadMe(access: string) {
// // // //     const res = await fetch(`${API_BASE}/users/me`, {
// // // //       headers: { Authorization: `Bearer ${access}` },
// // // //       cache: "no-store",
// // // //     });

// // // //     const body = await res.json().catch(() => null);
// // // //     if (!res.ok) throw new Error(body?.detail || "Failed to load profile");

// // // //     const roles: string[] = body?.roles || [];
// // // //     const isPatient =
// // // //       roles.includes("PATIENT_INTERNAL") || roles.includes("PATIENT");

// // // //     if (!isPatient) {
// // // //       router.replace("/dashboard");
// // // //       return;
// // // //     }

// // // //     setMe(body);
// // // //   }

// // // //   async function loadDashboard(access: string) {
// // // //     const res = await fetch(`${API_BASE}/patient/dashboard`, {
// // // //       headers: { Authorization: `Bearer ${access}` },
// // // //       cache: "no-store",
// // // //     });

// // // //     const body = await res.json().catch(() => null);
// // // //     if (!res.ok) throw new Error(body?.detail || "Failed to load dashboard");

// // // //     setDashboard(body);
// // // //   }

// // // //   async function loadAttempts(access: string) {
// // // //     setAttemptsLoading(true);
// // // //     try {
// // // //       // ✅ Backend endpoint you should add: GET /patient/attempts?limit=10
// // // //       const url = new URL(`${API_BASE}/patient/attempts`);
// // // //       url.searchParams.set("limit", "10");

// // // //       const res = await fetch(url.toString(), {
// // // //         headers: { Authorization: `Bearer ${access}` },
// // // //         cache: "no-store",
// // // //       });

// // // //       // If endpoint not implemented, fail gracefully.
// // // //       if (!res.ok) {
// // // //         setAttempts([]);
// // // //         return;
// // // //       }

// // // //       const body = await res.json().catch(() => []);
// // // //       setAttempts(Array.isArray(body) ? body : []);
// // // //     } finally {
// // // //       setAttemptsLoading(false);
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

// // // //   async function startCheckin(assignmentId: number) {
// // // //     setError(null);

// // // //     const access = localStorage.getItem("access_token");
// // // //     if (!access) {
// // // //       router.replace("/login");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const res = await fetch(`${API_BASE}/patient/checkins/start`, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${access}`,
// // // //         },
// // // //         body: JSON.stringify({ assignment_id: assignmentId }),
// // // //       });

// // // //       const body = await res.json().catch(() => null);
// // // //       if (!res.ok) {
// // // //         throw new Error(body?.detail || "Cannot start check-in");
// // // //       }

// // // //       const instanceId = body?.instance_id;
// // // //       if (!instanceId) throw new Error("No instance_id returned");

// // // //       router.push(`/patient/checkin/${instanceId}`);
// // // //     } catch (e: any) {
// // // //       setError(e?.message || "Failed to start check-in");
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     const access = localStorage.getItem("access_token");
// // // //     if (!access) {
// // // //       router.replace("/login");
// // // //       return;
// // // //     }

// // // //     (async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         setDashLoading(true);
// // // //         setError(null);

// // // //         await loadMe(access);
// // // //         await Promise.all([loadDashboard(access), loadAttempts(access)]);
// // // //       } catch (e: any) {
// // // //         localStorage.removeItem("access_token");
// // // //         localStorage.removeItem("refresh_token");
// // // //         router.replace("/login");
// // // //       } finally {
// // // //         setLoading(false);
// // // //         setDashLoading(false);
// // // //       }
// // // //     })();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [router]);

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // // //         <div className="text-lg">Loading dashboard...</div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (!me) return null;

// // // //   const now = new Date();
// // // //   const currentDate = now.toLocaleDateString("en-US", {
// // // //     weekday: "long",
// // // //     year: "numeric",
// // // //     month: "long",
// // // //     day: "numeric",
// // // //   });

// // // //   const currentTime = now.toLocaleTimeString("en-US", {
// // // //     hour: "numeric",
// // // //     minute: "2-digit",
// // // //   });

// // // //   const todayStatus = dashboard?.today_status ?? "NO_CHECKIN";
// // // //   const cutoffLabel = dashboard?.cutoff_time ? dashboard.cutoff_time : "23:59";

// // // //   const timeLeftLabel =
// // // //     todayStatus === "DUE"
// // // //       ? secondsToLabel(dashboard?.time_left_seconds ?? 0)
// // // //       : "";

// // // //   const canStart = todayStatus === "DUE";
// // // //   const dueItems = dashboard?.due_today ?? [];

// // // //   const checkinStatusLabel =
// // // //     todayStatus === "COMPLETED"
// // // //       ? "✅ COMPLETED"
// // // //       : todayStatus === "DUE"
// // // //       ? "🟡 DUE TODAY"
// // // //       : todayStatus === "MISSED"
// // // //       ? "❌ MISSED"
// // // //       : "⚪ NO CHECK-IN";

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
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
// // // //                   d="M12 4.5c-4.5 0-8 3.5-8 8 0 3.6 2.2 6.6 5.4 7.6V21l2.6-1.3 2.6 1.3v-.9c3.2-1 5.4-4 5.4-7.6 0-4.5-3.5-8-8-8z"
// // // //                 />
// // // //               </svg>
// // // //             </div>
// // // //             <div>
// // // //               <div className="text-lg font-bold text-gray-900">
// // // //                 Virtual Ward System
// // // //               </div>
// // // //               <div className="text-xs text-gray-500">Patient Dashboard</div>
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

// // // //       <main className="w-full px-6 py-6">
// // // //         <div className="mb-6">
// // // //           <h1 className="text-2xl font-bold text-gray-900">
// // // //             Welcome, {me.name} 👋
// // // //           </h1>
// // // //           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
// // // //             <span>📅</span>
// // // //             <span>
// // // //               {currentDate} | {currentTime}
// // // //             </span>
// // // //           </p>
// // // //         </div>

// // // //         {error && (
// // // //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         {dashboard?.missed_count && dashboard.missed_count > 0 && (
// // // //           <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
// // // //             You missed <b>{dashboard.missed_count}</b> check-in(s). If you feel
// // // //             unwell, contact your care team.
// // // //           </div>
// // // //         )}

// // // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // // //             <span>🏥</span>
// // // //             Your Summary
// // // //           </h2>

// // // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // // //             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
// // // //               <div className="text-xs font-medium opacity-90 mb-2">
// // // //                 📋 TODAY&apos;S CHECK-IN
// // // //               </div>
// // // //               <div className="text-xl font-bold mb-2">{checkinStatusLabel}</div>

// // // //               <div className="text-xs opacity-90 space-y-1">
// // // //                 <div>🗓️ Day ends: {cutoffLabel}</div>
// // // //                 <div>
// // // //                   ⏱️{" "}
// // // //                   {todayStatus === "DUE"
// // // //                     ? timeLeftLabel
// // // //                     : "No check-in due now"}
// // // //                 </div>
// // // //                 <div>🧾 Due questionnaires: {dueItems.length}</div>
// // // //               </div>

// // // //               {dashLoading ? (
// // // //                 <div className="mt-4 text-sm opacity-90">
// // // //                   Loading check-in...
// // // //                 </div>
// // // //               ) : dueItems.length === 0 ? (
// // // //                 <div className="mt-4 text-sm opacity-90">
// // // //                   No check-in assigned for today.
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="mt-4 space-y-2">
// // // //                   {dueItems.map((d) => (
// // // //                     <button
// // // //                       key={d.assignment_id}
// // // //                       onClick={() => startCheckin(d.assignment_id)}
// // // //                       disabled={!canStart}
// // // //                       className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors
// // // //                         ${
// // // //                           canStart
// // // //                             ? "bg-white/15 hover:bg-white/20"
// // // //                             : "bg-white/10 opacity-60 cursor-not-allowed"
// // // //                         }
// // // //                       `}
// // // //                       title={
// // // //                         !canStart
// // // //                           ? "No check-in due right now"
// // // //                           : "Start check-in"
// // // //                       }
// // // //                     >
// // // //                       {d.status === "COMPLETED"
// // // //                         ? `Completed: ${d.template_name}`
// // // //                         : `Start: ${d.template_name}`}
// // // //                     </button>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
// // // //               <div className="text-xs font-medium opacity-90 mb-2">
// // // //                 ⚠️ MISSED SESSIONS
// // // //               </div>
// // // //               <div className="text-4xl font-bold mb-1">
// // // //                 {dashboard?.missed_count ?? 0}
// // // //               </div>
// // // //               <div className="text-xs opacity-90 mb-2">
// // // //                 total missed check-ins
// // // //               </div>
// // // //               <div className="text-sm font-semibold">
// // // //                 Try to complete your daily check-in anytime today.
// // // //               </div>
// // // //             </div>

// // // //             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
// // // //               <div className="text-xs font-medium opacity-90 mb-2">
// // // //                 ✅ TODAY STATUS
// // // //               </div>
// // // //               <div className="text-xl font-bold mb-2">{todayStatus}</div>
// // // //               <div className="text-xs opacity-90">
// // // //                 {todayStatus === "DUE" && "You can submit anytime today."}
// // // //                 {todayStatus === "COMPLETED" && "You already submitted today."}
// // // //                 {todayStatus === "NO_CHECKIN" &&
// // // //                   "No monitoring plan active today."}
// // // //                 {todayStatus === "MISSED" &&
// // // //                   "A previous day was missed. Please continue with today's check-in."}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* ✅ Attempt History */}
// // // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // // //             <span>🧾</span>
// // // //             Your Attempt History
// // // //           </h2>

// // // //           {attemptsLoading ? (
// // // //             <div className="text-sm text-gray-600">Loading attempts...</div>
// // // //           ) : attempts.length === 0 ? (
// // // //             <div className="text-sm text-gray-600">No attempts yet.</div>
// // // //           ) : (
// // // //             <div className="overflow-auto">
// // // //               <table className="w-full text-sm">
// // // //                 <thead>
// // // //                   <tr className="text-left text-gray-600 border-b">
// // // //                     <th className="py-2 pr-4">Date</th>
// // // //                     <th className="py-2 pr-4">Questionnaire</th>
// // // //                     <th className="py-2 pr-4">Total Score</th>
// // // //                     <th className="py-2 pr-4">Status</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {attempts.map((a) => (
// // // //                     <tr key={a.instance_id} className="border-b">
// // // //                       <td className="py-2 pr-4">
// // // //                         {humanDate(a.submitted_at || a.scheduled_for)}
// // // //                       </td>
// // // //                       <td className="py-2 pr-4 font-semibold text-gray-900">
// // // //                         {a.template_name}
// // // //                       </td>
// // // //                       <td className="py-2 pr-4">
// // // //                         <span className="inline-flex items-center rounded-full border px-2 py-0.5 font-bold">
// // // //                           {a.total_score}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td className="py-2 pr-4">
// // // //                         {a.submitted_at ? (
// // // //                           <span className="text-green-700 font-semibold">
// // // //                             COMPLETED
// // // //                           </span>
// // // //                         ) : (
// // // //                           <span className="text-gray-500 font-semibold">
// // // //                             IN PROGRESS
// // // //                           </span>
// // // //                         )}
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Quick actions */}
// // // //         <div className="mb-4">
// // // //           <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
// // // //         </div>

// // // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //           <button
// // // //             onClick={() => router.push("/patient/dashboard")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // // //           >
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               🏠 Refresh Dashboard
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">Reload your check-in status</p>
// // // //           </button>

// // // //           <button
// // // //             onClick={() => alert("Later: Recovery plan")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // // //           >
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               📈 View Recovery Plan
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">Show schedule later</p>
// // // //           </button>

// // // //           <button
// // // //             onClick={() => alert("Later: Messages")}
// // // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // // //           >
// // // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // // //               💬 Messages
// // // //             </h3>
// // // //             <p className="text-sm text-gray-600">Care team chat later</p>
// // // //           </button>
// // // //         </div>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useEffect, useMemo, useState } from "react";
// // // import { useRouter } from "next/navigation";

// // // const API_BASE =
// // //   process.env.NEXT_PUBLIC_API_BASE ??
// // //   process.env.NEXT_PUBLIC_API_URL ??
// // //   "https://virtualwardbackend-production.up.railway.app";

// // // type MeResponse = {
// // //   id: number;
// // //   name: string;
// // //   email: string;
// // //   email_verified: boolean;
// // //   roles: string[];
// // // };

// // // type DueItem = {
// // //   assignment_id: number;
// // //   template_id: number;
// // //   template_name: string;
// // //   status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
// // //   instance_id?: number | null;
// // // };

// // // type DashboardResponse = {
// // //   cutoff_time: string;
// // //   today_status: "DUE" | "COMPLETED" | "NO_CHECKIN" | "MISSED" | string;
// // //   time_left_seconds: number;
// // //   missed_count: number;
// // //   due_today: DueItem[];
// // // };

// // // type Attempt = {
// // //   instance_id: number;
// // //   template_id: number;
// // //   template_name: string;
// // //   scheduled_for: string;
// // //   submitted_at: string | null;
// // //   total_score: number;
// // // };

// // // function secondsToLabel(totalSeconds: number) {
// // //   if (!totalSeconds || totalSeconds <= 0) return "Day ended";
// // //   const h = Math.floor(totalSeconds / 3600);
// // //   const m = Math.floor((totalSeconds % 3600) / 60);
// // //   if (h <= 0) return `${m}m left today`;
// // //   return `${h}h ${m}m left today`;
// // // }

// // // function humanDate(value?: string | null) {
// // //   if (!value) return "—";
// // //   const d = new Date(value);
// // //   if (Number.isNaN(d.getTime())) return value;
// // //   return d.toLocaleString();
// // // }

// // // export default function PatientDashboardPage() {
// // //   const router = useRouter();

// // //   const [me, setMe] = useState<MeResponse | null>(null);
// // //   const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

// // //   const [attempts, setAttempts] = useState<Attempt[]>([]);
// // //   const [attemptsLoading, setAttemptsLoading] = useState(false);

// // //   const [loading, setLoading] = useState(true);
// // //   const [dashLoading, setDashLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const accessToken = useMemo(() => {
// // //     if (typeof window === "undefined") return null;
// // //     return localStorage.getItem("access_token");
// // //   }, []);

// // //   async function loadMe(access: string) {
// // //     const res = await fetch(`${API_BASE}/users/me`, {
// // //       headers: { Authorization: `Bearer ${access}` },
// // //       cache: "no-store",
// // //     });

// // //     const body = await res.json().catch(() => null);
// // //     if (!res.ok) throw new Error(body?.detail || "Failed to load profile");

// // //     const roles: string[] = body?.roles || [];
// // //     const isPatient =
// // //       roles.includes("PATIENT_INTERNAL") || roles.includes("PATIENT");

// // //     if (!isPatient) {
// // //       router.replace("/dashboard");
// // //       return;
// // //     }

// // //     setMe(body);
// // //   }

// // //   async function loadDashboard(access: string) {
// // //     const res = await fetch(`${API_BASE}/patient/dashboard`, {
// // //       headers: { Authorization: `Bearer ${access}` },
// // //       cache: "no-store",
// // //     });

// // //     const body = await res.json().catch(() => null);
// // //     if (!res.ok) throw new Error(body?.detail || "Failed to load dashboard");

// // //     setDashboard(body);
// // //   }

// // //   // ✅ FIXED: backend returns { total, items }
// // //   async function loadAttempts(access: string) {
// // //     setAttemptsLoading(true);
// // //     try {
// // //       const url = new URL(`${API_BASE}/patient/attempts`);
// // //       url.searchParams.set("limit", "10");

// // //       const res = await fetch(url.toString(), {
// // //         headers: { Authorization: `Bearer ${access}` },
// // //         cache: "no-store",
// // //       });

// // //       if (!res.ok) {
// // //         setAttempts([]);
// // //         return;
// // //       }

// // //       const body = await res.json().catch(() => null);
// // //       setAttempts(Array.isArray(body?.items) ? body.items : []);
// // //     } finally {
// // //       setAttemptsLoading(false);
// // //     }
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

// // //   async function startCheckin(assignmentId: number) {
// // //     setError(null);

// // //     const access = localStorage.getItem("access_token");
// // //     if (!access) {
// // //       router.replace("/login");
// // //       return;
// // //     }

// // //     try {
// // //       const res = await fetch(`${API_BASE}/patient/checkins/start`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${access}`,
// // //         },
// // //         body: JSON.stringify({ assignment_id: assignmentId }),
// // //       });

// // //       const body = await res.json().catch(() => null);
// // //       if (!res.ok) throw new Error(body?.detail || "Cannot start check-in");

// // //       const instanceId = body?.instance_id;
// // //       if (!instanceId) throw new Error("No instance_id returned");

// // //       router.push(`/patient/checkin/${instanceId}`);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to start check-in");
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     const access = localStorage.getItem("access_token");
// // //     if (!access) {
// // //       router.replace("/login");
// // //       return;
// // //     }

// // //     (async () => {
// // //       try {
// // //         setLoading(true);
// // //         setDashLoading(true);
// // //         setError(null);

// // //         await loadMe(access);
// // //         await Promise.all([loadDashboard(access), loadAttempts(access)]);
// // //       } catch (e: any) {
// // //         localStorage.removeItem("access_token");
// // //         localStorage.removeItem("refresh_token");
// // //         router.replace("/login");
// // //       } finally {
// // //         setLoading(false);
// // //         setDashLoading(false);
// // //       }
// // //     })();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [router]);

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // //         <div className="text-lg">Loading dashboard...</div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!me) return null;

// // //   const now = new Date();
// // //   const currentDate = now.toLocaleDateString("en-US", {
// // //     weekday: "long",
// // //     year: "numeric",
// // //     month: "long",
// // //     day: "numeric",
// // //   });

// // //   const currentTime = now.toLocaleTimeString("en-US", {
// // //     hour: "numeric",
// // //     minute: "2-digit",
// // //   });

// // //   const todayStatus = dashboard?.today_status ?? "NO_CHECKIN";
// // //   const cutoffLabel = dashboard?.cutoff_time ? dashboard.cutoff_time : "23:59";

// // //   const timeLeftLabel =
// // //     todayStatus === "DUE"
// // //       ? secondsToLabel(dashboard?.time_left_seconds ?? 0)
// // //       : "";

// // //   const canStart = todayStatus === "DUE";
// // //   const dueItems = dashboard?.due_today ?? [];

// // //   const checkinStatusLabel =
// // //     todayStatus === "COMPLETED"
// // //       ? "✅ COMPLETED"
// // //       : todayStatus === "DUE"
// // //       ? "🟡 DUE TODAY"
// // //       : todayStatus === "MISSED"
// // //       ? "❌ MISSED"
// // //       : "⚪ NO CHECK-IN";

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
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
// // //                   d="M12 4.5c-4.5 0-8 3.5-8 8 0 3.6 2.2 6.6 5.4 7.6V21l2.6-1.3 2.6 1.3v-.9c3.2-1 5.4-4 5.4-7.6 0-4.5-3.5-8-8-8z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <div className="text-lg font-bold text-gray-900">
// // //                 Virtual Ward System
// // //               </div>
// // //               <div className="text-xs text-gray-500">Patient Dashboard</div>
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

// // //       <main className="w-full px-6 py-6">
// // //         <div className="mb-6">
// // //           <h1 className="text-2xl font-bold text-gray-900">
// // //             Welcome, {me.name} 👋
// // //           </h1>
// // //           <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
// // //             <span>📅</span>
// // //             <span>
// // //               {currentDate} | {currentTime}
// // //             </span>
// // //           </p>
// // //         </div>

// // //         {error && (
// // //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         )}

// // //         {dashboard?.missed_count && dashboard.missed_count > 0 && (
// // //           <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
// // //             You missed <b>{dashboard.missed_count}</b> check-in(s). If you feel
// // //             unwell, contact your care team.
// // //           </div>
// // //         )}

// // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //             <span>🏥</span>
// // //             Your Summary
// // //           </h2>

// // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // //             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
// // //               <div className="text-xs font-medium opacity-90 mb-2">
// // //                 📋 TODAY&apos;S CHECK-IN
// // //               </div>
// // //               <div className="text-xl font-bold mb-2">{checkinStatusLabel}</div>

// // //               <div className="text-xs opacity-90 space-y-1">
// // //                 <div>🗓️ Day ends: {cutoffLabel}</div>
// // //                 <div>
// // //                   ⏱️{" "}
// // //                   {todayStatus === "DUE"
// // //                     ? timeLeftLabel
// // //                     : "No check-in due now"}
// // //                 </div>
// // //                 <div>🧾 Due questionnaires: {dueItems.length}</div>
// // //               </div>

// // //               {dashLoading ? (
// // //                 <div className="mt-4 text-sm opacity-90">
// // //                   Loading check-in...
// // //                 </div>
// // //               ) : dueItems.length === 0 ? (
// // //                 <div className="mt-4 text-sm opacity-90">
// // //                   No check-in assigned for today.
// // //                 </div>
// // //               ) : (
// // //                 <div className="mt-4 space-y-2">
// // //                   {dueItems.map((d) => (
// // //                     <button
// // //                       key={d.assignment_id}
// // //                       onClick={() => startCheckin(d.assignment_id)}
// // //                       disabled={!canStart}
// // //                       className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors
// // //                         ${
// // //                           canStart
// // //                             ? "bg-white/15 hover:bg-white/20"
// // //                             : "bg-white/10 opacity-60 cursor-not-allowed"
// // //                         }
// // //                       `}
// // //                       title={
// // //                         !canStart
// // //                           ? "No check-in due right now"
// // //                           : "Start check-in"
// // //                       }
// // //                     >
// // //                       {d.status === "COMPLETED"
// // //                         ? `Completed: ${d.template_name}`
// // //                         : `Start: ${d.template_name}`}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
// // //               <div className="text-xs font-medium opacity-90 mb-2">
// // //                 ⚠️ MISSED SESSIONS
// // //               </div>
// // //               <div className="text-4xl font-bold mb-1">
// // //                 {dashboard?.missed_count ?? 0}
// // //               </div>
// // //               <div className="text-xs opacity-90 mb-2">
// // //                 total missed check-ins
// // //               </div>
// // //               <div className="text-sm font-semibold">
// // //                 Try to complete your daily check-in anytime today.
// // //               </div>
// // //             </div>

// // //             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
// // //               <div className="text-xs font-medium opacity-90 mb-2">
// // //                 ✅ TODAY STATUS
// // //               </div>
// // //               <div className="text-xl font-bold mb-2">{todayStatus}</div>
// // //               <div className="text-xs opacity-90">
// // //                 {todayStatus === "DUE" && "You can submit anytime today."}
// // //                 {todayStatus === "COMPLETED" && "You already submitted today."}
// // //                 {todayStatus === "NO_CHECKIN" &&
// // //                   "No monitoring plan active today."}
// // //                 {todayStatus === "MISSED" &&
// // //                   "A previous day was missed. Please continue with today's check-in."}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* ✅ Attempt History */}
// // //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// // //           <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //             <span>🧾</span>
// // //             Your Attempt History
// // //           </h2>

// // //           {attemptsLoading ? (
// // //             <div className="text-sm text-gray-600">Loading attempts...</div>
// // //           ) : attempts.length === 0 ? (
// // //             <div className="text-sm text-gray-600">No attempts yet.</div>
// // //           ) : (
// // //             <div className="overflow-auto">
// // //               <table className="w-full text-sm">
// // //                 <thead>
// // //                   <tr className="text-left text-gray-600 border-b">
// // //                     <th className="py-2 pr-4">Date</th>
// // //                     <th className="py-2 pr-4">Questionnaire</th>
// // //                     <th className="py-2 pr-4">Total Score</th>
// // //                     <th className="py-2 pr-4">Status</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {attempts.map((a) => (
// // //                     <tr key={a.instance_id} className="border-b">
// // //                       <td className="py-2 pr-4">
// // //                         {humanDate(a.submitted_at || a.scheduled_for)}
// // //                       </td>
// // //                       <td className="py-2 pr-4 font-semibold text-gray-900">
// // //                         {a.template_name}
// // //                       </td>
// // //                       <td className="py-2 pr-4">
// // //                         <span className="inline-flex items-center rounded-full border px-2 py-0.5 font-bold">
// // //                           {a.total_score}
// // //                         </span>
// // //                       </td>
// // //                       <td className="py-2 pr-4">
// // //                         {a.submitted_at ? (
// // //                           <span className="text-green-700 font-semibold">
// // //                             COMPLETED
// // //                           </span>
// // //                         ) : (
// // //                           <span className="text-gray-500 font-semibold">
// // //                             IN PROGRESS
// // //                           </span>
// // //                         )}
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Quick actions */}
// // //         <div className="mb-4">
// // //           <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
// // //         </div>

// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //           <button
// // //             onClick={() => router.push("/patient/dashboard")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // //           >
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               🏠 Refresh Dashboard
// // //             </h3>
// // //             <p className="text-sm text-gray-600">Reload your check-in status</p>
// // //           </button>

// // //           {/* ✅ NEW */}
// // //           <button
// // //             onClick={() => router.push("/patient/checkins")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // //           >
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               📚 View All Check-ins
// // //             </h3>
// // //             <p className="text-sm text-gray-600">
// // //               See all your questionnaire instances
// // //             </p>
// // //           </button>

// // //           <button
// // //             onClick={() => alert("Later: Messages")}
// // //             className="bg-white hover:bg-gray-50 rounded-lg border border-gray-200 p-6 text-left transition-all hover:shadow-md"
// // //           >
// // //             <h3 className="text-base font-semibold text-gray-900 mb-1">
// // //               💬 Messages
// // //             </h3>
// // //             <p className="text-sm text-gray-600">Care team chat later</p>
// // //           </button>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useRouter } from "next/navigation";

// // const API_BASE =
// //   process.env.NEXT_PUBLIC_API_BASE ??
// //   process.env.NEXT_PUBLIC_API_URL ??
// //   "https://virtualwardbackend-production.up.railway.app";

// // type MeResponse = {
// //   id: number;
// //   name: string;
// //   email: string;
// //   email_verified: boolean;
// //   roles: string[];
// // };

// // type DueItem = {
// //   assignment_id: number;
// //   flow_id: number;
// //   flow_name: string;
// //   status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DUE" | string;
// //   instance_id?: number | null;
// // };

// // type DashboardResponse = {
// //   cutoff_time: string;
// //   today_status: "DUE" | "COMPLETED" | "NO_CHECKIN" | "MISSED" | string;
// //   time_left_seconds: number;
// //   missed_count: number;
// //   due_today: DueItem[];
// // };

// // type Attempt = {
// //   instance_id: number;
// //   flow_id: number;
// //   flow_name: string;
// //   scheduled_for: string;
// //   submitted_at: string | null;
// //   total_score: number;
// // };

// // function secondsToLabel(totalSeconds: number) {
// //   if (!totalSeconds || totalSeconds <= 0) return "Day ended";
// //   const h = Math.floor(totalSeconds / 3600);
// //   const m = Math.floor((totalSeconds % 3600) / 60);
// //   if (h <= 0) return `${m}m left today`;
// //   return `${h}h ${m}m left today`;
// // }

// // function humanDate(value?: string | null) {
// //   if (!value) return "—";
// //   const d = new Date(value);
// //   if (Number.isNaN(d.getTime())) return value;
// //   return d.toLocaleString();
// // }

// // export default function PatientDashboardPage() {
// //   const router = useRouter();

// //   const [me, setMe] = useState<MeResponse | null>(null);
// //   const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

// //   const [attempts, setAttempts] = useState<Attempt[]>([]);
// //   const [attemptsLoading, setAttemptsLoading] = useState(false);

// //   const [loading, setLoading] = useState(true);
// //   const [dashLoading, setDashLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const accessToken = useMemo(() => {
// //     if (typeof window === "undefined") return null;
// //     return localStorage.getItem("access_token");
// //   }, []);

// //   async function loadMe(access: string) {
// //     const res = await fetch(`${API_BASE}/users/me`, {
// //       headers: { Authorization: `Bearer ${access}` },
// //       cache: "no-store",
// //     });

// //     const body = await res.json().catch(() => null);
// //     if (!res.ok) throw new Error(body?.detail || "Failed to load profile");

// //     const roles: string[] = body?.roles || [];
// //     const isPatient =
// //       roles.includes("PATIENT_INTERNAL") || roles.includes("PATIENT");

// //     if (!isPatient) {
// //       router.replace("/dashboard");
// //       return;
// //     }

// //     setMe(body);
// //   }

// //   async function loadDashboard(access: string) {
// //     const res = await fetch(`${API_BASE}/patient/dashboard`, {
// //       headers: { Authorization: `Bearer ${access}` },
// //       cache: "no-store",
// //     });

// //     const body = await res.json().catch(() => null);
// //     if (!res.ok) throw new Error(body?.detail || "Failed to load dashboard");

// //     // ✅ Enforce flow-only contract
// //     if (body?.due_today?.some((x: any) => !x.flow_name || !x.flow_id)) {
// //       throw new Error(
// //         "Backend returned non-flow due items. Update /patient/dashboard to return flow_id + flow_name.",
// //       );
// //     }

// //     setDashboard(body);
// //   }

// //   async function loadAttempts(access: string) {
// //     setAttemptsLoading(true);
// //     try {
// //       const url = new URL(`${API_BASE}/patient/attempts`);
// //       url.searchParams.set("limit", "10");

// //       const res = await fetch(url.toString(), {
// //         headers: { Authorization: `Bearer ${access}` },
// //         cache: "no-store",
// //       });

// //       const body = await res.json().catch(() => null);
// //       if (!res.ok) {
// //         setAttempts([]);
// //         return;
// //       }

// //       const items = Array.isArray(body?.items) ? body.items : [];

// //       // ✅ Enforce flow-only contract
// //       if (items.some((x: any) => !x.flow_name || !x.flow_id)) {
// //         throw new Error(
// //           "Backend returned template-based attempts. Update /patient/attempts to return flow_id + flow_name.",
// //         );
// //       }

// //       setAttempts(items);
// //     } finally {
// //       setAttemptsLoading(false);
// //     }
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

// //   async function startCheckin(assignmentId: number) {
// //     setError(null);

// //     const access = localStorage.getItem("access_token");
// //     if (!access) {
// //       router.replace("/login");
// //       return;
// //     }

// //     try {
// //       const res = await fetch(`${API_BASE}/patient/checkins/start`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${access}`,
// //         },
// //         body: JSON.stringify({ assignment_id: assignmentId }),
// //       });

// //       const body = await res.json().catch(() => null);
// //       if (!res.ok) throw new Error(body?.detail || "Cannot start check-in");

// //       const instanceId = body?.instance_id;
// //       if (!instanceId) throw new Error("No instance_id returned");

// //       router.push(`/patient/checkin/${instanceId}`);
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to start check-in");
// //     }
// //   }

// //   useEffect(() => {
// //     const access = localStorage.getItem("access_token");
// //     if (!access) {
// //       router.replace("/login");
// //       return;
// //     }

// //     (async () => {
// //       try {
// //         setLoading(true);
// //         setDashLoading(true);
// //         setError(null);

// //         await loadMe(access);
// //         await Promise.all([loadDashboard(access), loadAttempts(access)]);
// //       } catch (e: any) {
// //         setError(e?.message || "Failed to load dashboard");
// //       } finally {
// //         setLoading(false);
// //         setDashLoading(false);
// //       }
// //     })();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [router]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-lg">Loading dashboard...</div>
// //       </div>
// //     );
// //   }

// //   if (!me) return null;

// //   const now = new Date();
// //   const currentDate = now.toLocaleDateString("en-US", {
// //     weekday: "long",
// //     year: "numeric",
// //     month: "long",
// //     day: "numeric",
// //   });

// //   const currentTime = now.toLocaleTimeString("en-US", {
// //     hour: "numeric",
// //     minute: "2-digit",
// //   });

// //   const todayStatus = dashboard?.today_status ?? "NO_CHECKIN";
// //   const cutoffLabel = dashboard?.cutoff_time || "23:59";

// //   const timeLeftLabel =
// //     todayStatus === "DUE"
// //       ? secondsToLabel(dashboard?.time_left_seconds ?? 0)
// //       : "";

// //   const canStart = todayStatus === "DUE";
// //   const dueItems = dashboard?.due_today ?? [];

// //   const checkinStatusLabel =
// //     todayStatus === "COMPLETED"
// //       ? "✅ COMPLETED"
// //       : todayStatus === "DUE"
// //         ? "🟡 DUE TODAY"
// //         : todayStatus === "MISSED"
// //           ? "❌ MISSED"
// //           : "⚪ NO CHECK-IN";

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="w-full px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div>
// //               <div className="text-lg font-bold text-gray-900">
// //                 Virtual Ward System
// //               </div>
// //               <div className="text-xs text-gray-500">Patient Dashboard</div>
// //             </div>
// //           </div>

// //           <button
// //             onClick={logout}
// //             className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </header>

// //       <main className="w-full px-6 py-6">
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-bold text-gray-900">
// //             Welcome, {me.name} 👋
// //           </h1>
// //           <p className="text-sm text-gray-600 mt-1">
// //             {currentDate} | {currentTime}
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //             {error}
// //           </div>
// //         )}

// //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// //           <h2 className="text-base font-semibold text-gray-900 mb-4">
// //             Your Summary
// //           </h2>

// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //             <div className="bg-blue-600 rounded-lg p-5 text-white">
// //               <div className="text-xs font-medium opacity-90 mb-2">
// //                 TODAY&apos;S CHECK-IN
// //               </div>
// //               <div className="text-xl font-bold mb-2">{checkinStatusLabel}</div>

// //               <div className="text-xs opacity-90 space-y-1">
// //                 <div>Day ends: {cutoffLabel}</div>
// //                 <div>{todayStatus === "DUE" ? timeLeftLabel : ""}</div>
// //                 <div>Due questionnaires: {dueItems.length}</div>
// //               </div>

// //               {dashLoading ? (
// //                 <div className="mt-4 text-sm opacity-90">Loading...</div>
// //               ) : dueItems.length === 0 ? (
// //                 <div className="mt-4 text-sm opacity-90">No check-in due.</div>
// //               ) : (
// //                 <div className="mt-4 space-y-2">
// //                   {dueItems.map((d) => (
// //                     <button
// //                       key={d.assignment_id}
// //                       onClick={() => startCheckin(d.assignment_id)}
// //                       disabled={!canStart}
// //                       className={`w-full rounded-lg py-2 text-sm font-semibold
// //                         ${
// //                           canStart
// //                             ? "bg-white/20 hover:bg-white/30"
// //                             : "bg-white/10 opacity-60 cursor-not-allowed"
// //                         }`}
// //                     >
// //                       {d.status === "COMPLETED"
// //                         ? `Completed: ${d.flow_name}`
// //                         : `Start: ${d.flow_name}`}
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             <div className="bg-orange-600 rounded-lg p-5 text-white">
// //               <div className="text-xs font-medium opacity-90 mb-2">
// //                 MISSED SESSIONS
// //               </div>
// //               <div className="text-4xl font-bold mb-1">
// //                 {dashboard?.missed_count ?? 0}
// //               </div>
// //             </div>

// //             <div className="bg-green-600 rounded-lg p-5 text-white">
// //               <div className="text-xs font-medium opacity-90 mb-2">
// //                 TODAY STATUS
// //               </div>
// //               <div className="text-xl font-bold mb-2">{todayStatus}</div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
// //           <h2 className="text-base font-semibold text-gray-900 mb-4">
// //             Your Attempt History
// //           </h2>

// //           {attemptsLoading ? (
// //             <div className="text-sm text-gray-600">Loading attempts...</div>
// //           ) : attempts.length === 0 ? (
// //             <div className="text-sm text-gray-600">No attempts yet.</div>
// //           ) : (
// //             <div className="overflow-auto">
// //               <table className="w-full text-sm">
// //                 <thead>
// //                   <tr className="text-left text-gray-600 border-b">
// //                     <th className="py-2 pr-4">Date</th>
// //                     <th className="py-2 pr-4">Questionnaire</th>
// //                     <th className="py-2 pr-4">Total Score</th>
// //                     <th className="py-2 pr-4">Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {attempts.map((a) => (
// //                     <tr key={a.instance_id} className="border-b">
// //                       <td className="py-2 pr-4">
// //                         {humanDate(a.submitted_at || a.scheduled_for)}
// //                       </td>
// //                       <td className="py-2 pr-4 font-semibold text-gray-900">
// //                         {a.flow_name}
// //                       </td>
// //                       <td className="py-2 pr-4">{a.total_score}</td>
// //                       <td className="py-2 pr-4">
// //                         {a.submitted_at ? "COMPLETED" : "IN PROGRESS"}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ??
//   process.env.NEXT_PUBLIC_API_URL ??
//   "https://virtualwardbackend-production.up.railway.app";

// type MeResponse = {
//   id: number;
//   name: string;
//   email: string;
//   email_verified: boolean;
//   roles: string[];
// };

// type DueItem = {
//   assignment_id: number;
//   flow_id: number;
//   flow_name: string;
//   status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DUE" | string;
//   instance_id?: number | null;
// };

// type DashboardResponse = {
//   cutoff_time: string;
//   today_status: "DUE" | "COMPLETED" | "NO_CHECKIN" | "MISSED" | string;
//   time_left_seconds: number;
//   missed_count: number;
//   due_today: DueItem[];
// };

// type Attempt = {
//   instance_id: number;
//   flow_id: number;
//   flow_name: string;
//   scheduled_for: string;
//   submitted_at: string | null;
//   total_score: number;
// };

// function secondsToLabel(totalSeconds: number) {
//   if (!totalSeconds || totalSeconds <= 0) return "Day ended";
//   const h = Math.floor(totalSeconds / 3600);
//   const m = Math.floor((totalSeconds % 3600) / 60);
//   if (h <= 0) return `${m}m left today`;
//   return `${h}h ${m}m left today`;
// }

// function humanDate(value?: string | null) {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return d.toLocaleString();
// }

// export default function PatientDashboardPage() {
//   const router = useRouter();

//   const [me, setMe] = useState<MeResponse | null>(null);
//   const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

//   const [attempts, setAttempts] = useState<Attempt[]>([]);
//   const [attemptsLoading, setAttemptsLoading] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [dashLoading, setDashLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const accessToken = useMemo(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("access_token");
//   }, []);

//   async function loadMe(access: string) {
//     const res = await fetch(`${API_BASE}/users/me`, {
//       headers: { Authorization: `Bearer ${access}` },
//       cache: "no-store",
//     });

//     const body = await res.json().catch(() => null);
//     if (!res.ok) throw new Error(body?.detail || "Failed to load profile");

//     const roles: string[] = body?.roles || [];
//     const isPatient =
//       roles.includes("PATIENT_INTERNAL") || roles.includes("PATIENT");

//     if (!isPatient) {
//       router.replace("/admin");
//       return;
//     }

//     setMe(body);
//   }

//   async function loadDashboard(access: string) {
//     const res = await fetch(`${API_BASE}/patient/dashboard`, {
//       headers: { Authorization: `Bearer ${access}` },
//       cache: "no-store",
//     });

//     const body = await res.json().catch(() => null);
//     if (!res.ok) throw new Error(body?.detail || "Failed to load dashboard");

//     if (body?.due_today?.some((x: any) => !x.flow_name || !x.flow_id)) {
//       throw new Error(
//         "Backend returned non-flow due items. Update /patient/dashboard to return flow_id + flow_name.",
//       );
//     }

//     setDashboard(body);
//   }

//   async function loadAttempts(access: string) {
//     setAttemptsLoading(true);
//     try {
//       const url = new URL(`${API_BASE}/patient/attempts`);
//       url.searchParams.set("limit", "10");

//       const res = await fetch(url.toString(), {
//         headers: { Authorization: `Bearer ${access}` },
//         cache: "no-store",
//       });

//       const body = await res.json().catch(() => null);
//       if (!res.ok) {
//         setAttempts([]);
//         return;
//       }

//       const items = Array.isArray(body?.items) ? body.items : [];

//       if (items.some((x: any) => !x.flow_name || !x.flow_id)) {
//         throw new Error(
//           "Backend returned template-based attempts. Update /patient/attempts to return flow_id + flow_name.",
//         );
//       }

//       setAttempts(items);
//     } finally {
//       setAttemptsLoading(false);
//     }
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

//   async function startCheckin(assignmentId: number) {
//     setError(null);

//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/patient/checkins/start`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({ assignment_id: assignmentId }),
//       });

//       const body = await res.json().catch(() => null);
//       if (!res.ok) throw new Error(body?.detail || "Cannot start check-in");

//       const instanceId = body?.instance_id;
//       if (!instanceId) throw new Error("No instance_id returned");

//       router.push(`/patient/checkin/${instanceId}`);
//     } catch (e: any) {
//       setError(e?.message || "Failed to start check-in");
//     }
//   }

//   useEffect(() => {
//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       router.replace("/login");
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setDashLoading(true);
//         setError(null);

//         await loadMe(access);
//         await Promise.all([loadDashboard(access), loadAttempts(access)]);
//       } catch (e: any) {
//         setError(e?.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//         setDashLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//           <div className="text-lg text-gray-600">Loading dashboard...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!me) return null;

//   const now = new Date();
//   const currentDate = now.toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const currentTime = now.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//   });

//   const todayStatus = dashboard?.today_status ?? "NO_CHECKIN";
//   const cutoffLabel = dashboard?.cutoff_time || "23:59";

//   const timeLeftLabel =
//     todayStatus === "DUE"
//       ? secondsToLabel(dashboard?.time_left_seconds ?? 0)
//       : "";

//   const canStart = todayStatus === "DUE";
//   const dueItems = dashboard?.due_today ?? [];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg">
//         <div className="w-full px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                 <svg
//                   className="w-7 h-7 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <div className="text-white text-xl font-bold">
//                   Virtual Ward System
//                 </div>
//                 <div className="text-teal-100 text-sm">Patient Portal</div>
//               </div>
//             </div>

//             <button
//               onClick={logout}
//               className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                 />
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="w-full px-6 py-8 max-w-7xl mx-auto">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             Welcome back, {me.name}
//             <span className="text-4xl">👋</span>
//           </h1>
//           <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
//             <div className="flex items-center gap-2">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//               {currentDate}
//             </div>
//             <div className="flex items-center gap-2">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               {currentTime}
//             </div>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
//             <svg
//               className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <div className="text-sm text-red-700">{error}</div>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {/* Today's Check-in Card */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
//               <div className="flex items-center gap-3 text-white">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium opacity-90">
//                     Today's Status
//                   </div>
//                   <div className="text-xl font-bold">
//                     {todayStatus === "COMPLETED"
//                       ? "Completed"
//                       : todayStatus === "DUE"
//                         ? "Due Today"
//                         : todayStatus === "MISSED"
//                           ? "Missed"
//                           : "No Check-in"}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="space-y-3 text-sm mb-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Day ends at</span>
//                   <span className="font-semibold text-gray-900">
//                     {cutoffLabel}
//                   </span>
//                 </div>
//                 {todayStatus === "DUE" && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-600">Time left</span>
//                     <span className="font-semibold text-amber-600">
//                       {timeLeftLabel}
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Due questionnaires</span>
//                   <span className="font-semibold text-gray-900">
//                     {dueItems.length}
//                   </span>
//                 </div>
//               </div>

//               {dashLoading ? (
//                 <div className="text-sm text-gray-500 text-center py-4">
//                   Loading questionnaires...
//                 </div>
//               ) : dueItems.length === 0 ? (
//                 <div className="text-center py-6">
//                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <svg
//                       className="w-6 h-6 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     No check-in due today
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {dueItems.map((d) => (
//                     <button
//                       key={d.assignment_id}
//                       onClick={() => startCheckin(d.assignment_id)}
//                       disabled={!canStart || d.status === "COMPLETED"}
//                       className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
//                         d.status === "COMPLETED"
//                           ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
//                           : canStart
//                             ? "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
//                             : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{d.flow_name}</span>
//                         {d.status === "COMPLETED" ? (
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M5 13l4 4L19 7"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M14 5l7 7m0 0l-7 7m7-7H3"
//                             />
//                           </svg>
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Missed Sessions Card */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
//               <div className="flex items-center gap-3 text-white">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium opacity-90">
//                     Missed Sessions
//                   </div>
//                   <div className="text-3xl font-bold">
//                     {dashboard?.missed_count ?? 0}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-sm text-gray-600">
//                 {dashboard?.missed_count === 0
//                   ? "Great job! No missed check-ins."
//                   : "Try to complete all your daily check-ins on time."}
//               </p>
//             </div>
//           </div>

//           {/* Overall Status Card */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div
//               className={`px-6 py-4 ${
//                 todayStatus === "COMPLETED"
//                   ? "bg-gradient-to-r from-green-500 to-emerald-500"
//                   : todayStatus === "DUE"
//                     ? "bg-gradient-to-r from-blue-500 to-indigo-500"
//                     : "bg-gradient-to-r from-gray-500 to-slate-500"
//               }`}
//             >
//               <div className="flex items-center gap-3 text-white">
//                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium opacity-90">
//                     Current Status
//                   </div>
//                   <div className="text-xl font-bold">{todayStatus}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               <p className="text-sm text-gray-600">
//                 {todayStatus === "COMPLETED"
//                   ? "All questionnaires completed for today!"
//                   : todayStatus === "DUE"
//                     ? "You have pending questionnaires."
//                     : "No questionnaires scheduled for today."}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Attempt History */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <svg
//                 className="w-5 h-5 text-teal-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               Recent Check-in History
//             </h2>
//           </div>

//           <div className="p-6">
//             {attemptsLoading ? (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <div className="text-sm text-gray-600">Loading history...</div>
//               </div>
//             ) : attempts.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <svg
//                     className="w-8 h-8 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="text-gray-600 font-medium mb-2">
//                   No check-in history yet
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Your completed questionnaires will appear here
//                 </div>
//               </div>
//             ) : (
//               <div className="overflow-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-3 px-4 font-semibold text-gray-600">
//                         Date & Time
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-600">
//                         Questionnaire
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-600">
//                         Total Score
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-600">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {attempts.map((a) => (
//                       <tr key={a.instance_id} className="hover:bg-gray-50">
//                         <td className="py-4 px-4 text-gray-700">
//                           {humanDate(a.submitted_at || a.scheduled_for)}
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
//                             <span className="font-medium text-gray-900">
//                               {a.flow_name}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
//                             {a.total_score} points
//                           </span>
//                         </td>
//                         <td className="py-4 px-4">
//                           {a.submitted_at ? (
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
//                               <svg
//                                 className="w-3 h-3"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                               Completed
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
//                               In Progress
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://virtualwardbackend-production.up.railway.app";

type MeResponse = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  roles: string[];
};

type DueItem = {
  assignment_id: number;
  flow_id: number;
  flow_name: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DUE" | string;
  instance_id?: number | null;
};

type DashboardResponse = {
  cutoff_time: string;
  today_status: "DUE" | "COMPLETED" | "NO_CHECKIN" | "MISSED" | string;
  time_left_seconds: number;
  missed_count: number;
  due_today: DueItem[];
};

type Attempt = {
  instance_id: number;
  flow_id: number;
  flow_name: string;
  scheduled_for: string;
  submitted_at: string | null;
  total_score: number;
};

function secondsToLabel(totalSeconds: number) {
  if (!totalSeconds || totalSeconds <= 0) return "Day ended";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h <= 0) return `${m}m left today`;
  return `${h}h ${m}m left today`;
}

function humanDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function PatientDashboardPage() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  // ✅ NEW: reset/undo loading + tracking
  const [resetLoadingId, setResetLoadingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [dashLoading, setDashLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }, []);

  async function loadMe(access: string) {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.detail || "Failed to load profile");

    const roles: string[] = body?.roles || [];
    const isPatient =
      roles.includes("PATIENT_INTERNAL") || roles.includes("PATIENT");

    if (!isPatient) {
      router.replace("/admin");
      return;
    }

    setMe(body);
  }

  async function loadDashboard(access: string) {
    const res = await fetch(`${API_BASE}/patient/dashboard`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.detail || "Failed to load dashboard");

    if (body?.due_today?.some((x: any) => !x.flow_name || !x.flow_id)) {
      throw new Error(
        "Backend returned non-flow due items. Update /patient/dashboard to return flow_id + flow_name.",
      );
    }

    setDashboard(body);
  }

  async function loadAttempts(access: string) {
    setAttemptsLoading(true);
    try {
      const url = new URL(`${API_BASE}/patient/attempts`);
      url.searchParams.set("limit", "10");

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${access}` },
        cache: "no-store",
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setAttempts([]);
        return;
      }

      const items = Array.isArray(body?.items) ? body.items : [];

      if (items.some((x: any) => !x.flow_name || !x.flow_id)) {
        throw new Error(
          "Backend returned template-based attempts. Update /patient/attempts to return flow_id + flow_name.",
        );
      }

      setAttempts(items);
    } finally {
      setAttemptsLoading(false);
    }
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

  async function startCheckin(assignmentId: number) {
    setError(null);

    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/patient/checkins/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ assignment_id: assignmentId }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.detail || "Cannot start check-in");

      const instanceId = body?.instance_id;
      if (!instanceId) throw new Error("No instance_id returned");

      router.push(`/patient/checkin/${instanceId}`);
    } catch (e: any) {
      setError(e?.message || "Failed to start check-in");
    }
  }

  // ✅ NEW: open attempt detail page
  function openAttempt(instanceId: number) {
    router.push(`/patient/attempts/${instanceId}`);
  }

  // ✅ NEW: undo/reset attempt so user can re-attempt (testing feature)
  async function resetAttempt(instanceId: number) {
    setError(null);

    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    setResetLoadingId(instanceId);
    try {
      // Backend should expose this:
      // POST /patient/attempts/{instance_id}/reset
      const res = await fetch(
        `${API_BASE}/patient/attempts/${instanceId}/reset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.detail || "Reset failed");

      // refresh dashboard + attempts so Start buttons become available again
      await Promise.all([loadDashboard(access), loadAttempts(access)]);
    } catch (e: any) {
      setError(e?.message || "Failed to reset attempt");
    } finally {
      setResetLoadingId(null);
    }
  }

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setDashLoading(true);
        setError(null);

        await loadMe(access);
        await Promise.all([loadDashboard(access), loadAttempts(access)]);
      } catch (e: any) {
        setError(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
        setDashLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!me) return null;

  const now = new Date();
  const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const todayStatus = dashboard?.today_status ?? "NO_CHECKIN";
  const cutoffLabel = dashboard?.cutoff_time || "23:59";

  const timeLeftLabel =
    todayStatus === "DUE"
      ? secondsToLabel(dashboard?.time_left_seconds ?? 0)
      : "";

  const canStart = todayStatus === "DUE";
  const dueItems = dashboard?.due_today ?? [];

  // For "undo": if you want it only when something exists today
  const todaysAttempt =
    attempts.find(
      (a) =>
        a.scheduled_for?.slice(0, 10) === new Date().toISOString().slice(0, 10),
    ) ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
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
              <div>
                <div className="text-white text-xl font-bold">
                  Virtual Ward System
                </div>
                <div className="text-teal-100 text-sm">Patient Portal</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Welcome back, {me.name}
            <span className="text-4xl">👋</span>
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
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
              {currentDate}
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
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
              {currentTime}
            </div>
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Check-in Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">
                    Today's Status
                  </div>
                  <div className="text-xl font-bold">
                    {todayStatus === "COMPLETED"
                      ? "Completed"
                      : todayStatus === "DUE"
                        ? "Due Today"
                        : todayStatus === "MISSED"
                          ? "Missed"
                          : "No Check-in"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Day ends at</span>
                  <span className="font-semibold text-gray-900">
                    {cutoffLabel}
                  </span>
                </div>
                {todayStatus === "DUE" && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time left</span>
                    <span className="font-semibold text-amber-600">
                      {timeLeftLabel}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due questionnaires</span>
                  <span className="font-semibold text-gray-900">
                    {dueItems.length}
                  </span>
                </div>
              </div>

              {dashLoading ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading questionnaires...
                </div>
              ) : dueItems.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                  <div className="text-sm text-gray-600">
                    No check-in due today
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {dueItems.map((d) => (
                    <button
                      key={d.assignment_id}
                      onClick={() => startCheckin(d.assignment_id)}
                      disabled={!canStart || d.status === "COMPLETED"}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        d.status === "COMPLETED"
                          ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                          : canStart
                            ? "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{d.flow_name}</span>
                        {d.status === "COMPLETED" ? (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
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
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ✅ NEW: "Undo" quick button for testing (optional) */}
              {todaysAttempt?.instance_id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => resetAttempt(todaysAttempt.instance_id)}
                    disabled={resetLoadingId === todaysAttempt.instance_id}
                    className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                      resetLoadingId === todaysAttempt.instance_id
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    }`}
                    title="Testing only: allows you to re-attempt today's questionnaire"
                  >
                    {resetLoadingId === todaysAttempt.instance_id
                      ? "Resetting..."
                      : "Undo / Reset Today's Attempt (Testing)"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Missed Sessions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <div>
                  <div className="text-sm font-medium opacity-90">
                    Missed Sessions
                  </div>
                  <div className="text-3xl font-bold">
                    {dashboard?.missed_count ?? 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                {dashboard?.missed_count === 0
                  ? "Great job! No missed check-ins."
                  : "Try to complete all your daily check-ins on time."}
              </p>
            </div>
          </div>

          {/* Overall Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className={`px-6 py-4 ${
                todayStatus === "COMPLETED"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : todayStatus === "DUE"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-gray-500 to-slate-500"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
                  <div className="text-sm font-medium opacity-90">
                    Current Status
                  </div>
                  <div className="text-xl font-bold">{todayStatus}</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                {todayStatus === "COMPLETED"
                  ? "All questionnaires completed for today!"
                  : todayStatus === "DUE"
                    ? "You have pending questionnaires."
                    : "No questionnaires scheduled for today."}
              </p>
            </div>
          </div>
        </div>

        {/* Attempt History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Check-in History
            </h2>
            <div className="text-xs text-gray-500 mt-1">
              Click a row to view only questions & answers.
            </div>
          </div>

          <div className="p-6">
            {attemptsLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-sm text-gray-600">Loading history...</div>
              </div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                </div>
                <div className="text-gray-600 font-medium mb-2">
                  No check-in history yet
                </div>
                <div className="text-sm text-gray-500">
                  Your completed questionnaires will appear here
                </div>
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Questionnaire
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Total Score
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attempts.map((a) => (
                      <tr key={a.instance_id} className="hover:bg-gray-50">
                        <td
                          className="py-4 px-4 text-gray-700 cursor-pointer"
                          onClick={() => openAttempt(a.instance_id)}
                          title="Open attempt details"
                        >
                          {humanDate(a.submitted_at || a.scheduled_for)}
                        </td>
                        <td
                          className="py-4 px-4 cursor-pointer"
                          onClick={() => openAttempt(a.instance_id)}
                          title="Open attempt details"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">
                              {a.flow_name}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-4 px-4 cursor-pointer"
                          onClick={() => openAttempt(a.instance_id)}
                          title="Open attempt details"
                        >
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {a.total_score} points
                          </span>
                        </td>
                        <td
                          className="py-4 px-4 cursor-pointer"
                          onClick={() => openAttempt(a.instance_id)}
                          title="Open attempt details"
                        >
                          {a.submitted_at ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              In Progress
                            </span>
                          )}
                        </td>

                        {/* ✅ NEW: Reset button (testing) */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAttempt(a.instance_id)}
                              className="px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => resetAttempt(a.instance_id)}
                              disabled={resetLoadingId === a.instance_id}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                                resetLoadingId === a.instance_id
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              }`}
                              title="Testing only: reset so you can re-attempt"
                            >
                              {resetLoadingId === a.instance_id
                                ? "Resetting..."
                                : "Undo"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 text-xs text-gray-500">
                  Tip: “Undo” requires backend endpoint{" "}
                  <span className="font-mono">
                    POST /patient/attempts/&lt;instance_id&gt;/reset
                  </span>
                  .
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
