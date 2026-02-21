// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ??
//   process.env.NEXT_PUBLIC_API_URL ??
//   "https://virtualwardbackend-production.up.railway.app";

// type MonitoringRow = {
//   patient_id: number;
//   patient_name: string;
//   patient_email: string;
//   today_status: "DUE" | "COMPLETED" | "MISSED" | "NO_CHECKIN" | string;
//   submitted_at?: string | null;
//   total_score: number;
//   severity: "GREEN" | "AMBER" | "RED";
// };

// type AlertRow = {
//   patient_id: number;
//   patient_name: string;
//   severity: "AMBER" | "RED";
//   reason: string;
// };

// export default function AdminMonitoringPage() {
//   const router = useRouter();

//   const [rows, setRows] = useState<MonitoringRow[]>([]);
//   const [alerts, setAlerts] = useState<AlertRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const accessToken = useMemo(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("access_token");
//   }, []);

//   function sevBadge(sev: MonitoringRow["severity"]) {
//     if (sev === "RED")
//       return (
//         <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
//           RED
//         </span>
//       );
//     if (sev === "AMBER")
//       return (
//         <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
//           AMBER
//         </span>
//       );
//     return (
//       <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
//         GREEN
//       </span>
//     );
//   }

//   async function load() {
//     setLoading(true);
//     setError(null);

//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const [mRes, aRes] = await Promise.all([
//         fetch(`${API_BASE}/admin/monitoring/today`, {
//           headers: { Authorization: `Bearer ${access}` },
//           cache: "no-store",
//         }),
//         fetch(`${API_BASE}/admin/alerts`, {
//           headers: { Authorization: `Bearer ${access}` },
//           cache: "no-store",
//         }),
//       ]);

//       const mBody = await mRes.json().catch(() => null);
//       if (!mRes.ok)
//         throw new Error(mBody?.detail || "Failed to load monitoring");

//       const aBody = await aRes.json().catch(() => null);
//       if (!aRes.ok) throw new Error(aBody?.detail || "Failed to load alerts");

//       setRows(mBody ?? []);
//       setAlerts(aBody ?? []);
//     } catch (e: any) {
//       setError(e?.message || "Failed to load monitoring");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!accessToken) {
//       router.replace("/login");
//       return;
//     }
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div>
//             <div className="text-lg font-bold text-gray-900">
//               Monitoring Dashboard
//             </div>
//             <div className="text-xs text-gray-500">
//               Today’s submissions, scores and alerts
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={load}
//               className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//             >
//               Refresh
//             </button>
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="px-6 py-6">
//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {alerts.length > 0 && (
//           <div className="mb-6 bg-white rounded-lg border border-gray-200 p-5">
//             <div className="text-sm font-bold text-gray-900 mb-3">
//               ⚠️ Alerts
//             </div>
//             <div className="space-y-2">
//               {alerts.map((a) => (
//                 <div
//                   key={`${a.patient_id}-${a.severity}`}
//                   className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
//                 >
//                   <div className="text-sm">
//                     <span className="font-semibold">{a.patient_name}</span> ·{" "}
//                     {a.reason}
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-bold ${
//                       a.severity === "RED"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-amber-100 text-amber-800"
//                     }`}
//                   >
//                     {a.severity}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg border border-gray-200 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm font-bold text-gray-900">
//               Patients expected today
//             </div>
//             <div className="text-xs text-gray-500">
//               {new Date().toLocaleString()}
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-sm text-gray-600">Loading...</div>
//           ) : rows.length === 0 ? (
//             <div className="text-sm text-gray-600">
//               No patients expected today.
//             </div>
//           ) : (
//             <div className="overflow-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="text-left text-xs text-gray-500">
//                     <th className="py-2 border-b">Patient</th>
//                     <th className="py-2 border-b">Email</th>
//                     <th className="py-2 border-b">Status</th>
//                     <th className="py-2 border-b">Submitted</th>
//                     <th className="py-2 border-b">Score</th>
//                     <th className="py-2 border-b">Severity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((r) => (
//                     <tr key={r.patient_id} className="text-sm">
//                       <td className="py-3 border-b font-semibold text-gray-900">
//                         {r.patient_name}
//                       </td>
//                       <td className="py-3 border-b text-gray-700">
//                         {r.patient_email}
//                       </td>
//                       <td className="py-3 border-b">{r.today_status}</td>
//                       <td className="py-3 border-b">
//                         {r.submitted_at
//                           ? new Date(r.submitted_at).toLocaleString()
//                           : "—"}
//                       </td>
//                       <td className="py-3 border-b">{r.total_score}</td>
//                       <td className="py-3 border-b">{sevBadge(r.severity)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://virtualwardbackend-production.up.railway.app";

type MonitoringRow = {
  patient_id: number;
  patient_name: string;
  patient_email: string;
  today_status: "DUE" | "COMPLETED" | "MISSED" | "NO_CHECKIN" | string;
  submitted_at?: string | null;
  total_score: number;
  severity: "GREEN" | "AMBER" | "RED";
};

type AlertRow = {
  patient_id: number;
  patient_name: string;
  severity: "AMBER" | "RED";
  reason: string;
};

export default function AdminMonitoringPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rows, setRows] = useState<MonitoringRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }, []);

  function sevBadge(sev: MonitoringRow["severity"]) {
    if (sev === "RED")
      return (
        <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
          RED
        </span>
      );
    if (sev === "AMBER")
      return (
        <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          AMBER
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-200">
        GREEN
      </span>
    );
  }

  function statusBadge(status: string) {
    const cls =
      status === "COMPLETED"
        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
        : status === "DUE"
          ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
          : status === "MISSED"
            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
            : "bg-gray-50 text-gray-700 ring-1 ring-gray-200";

    return (
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
      >
        {status}
      </span>
    );
  }

  async function load() {
    setLoading(true);
    setError(null);

    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    try {
      const [mRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/admin/monitoring/today`, {
          headers: { Authorization: `Bearer ${access}` },
          cache: "no-store",
        }),
        fetch(`${API_BASE}/admin/alerts`, {
          headers: { Authorization: `Bearer ${access}` },
          cache: "no-store",
        }),
      ]);

      const mBody = await mRes.json().catch(() => null);
      if (!mRes.ok)
        throw new Error(mBody?.detail || "Failed to load monitoring");

      const aBody = await aRes.json().catch(() => null);
      if (!aRes.ok) throw new Error(aBody?.detail || "Failed to load alerts");

      setRows(mBody ?? []);
      setAlerts(aBody ?? []);
    } catch (e: any) {
      setError(e?.message || "Failed to load monitoring");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                A
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Monitoring Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Today's submissions, scores and alerts
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Alerts Card */}
          {alerts.length > 0 && (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-amber-600"
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Active Alerts
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {alerts.map((a, idx) => (
                    <div
                      key={`${a.patient_id}-${a.severity}-${idx}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                          {a.patient_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {a.patient_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {a.reason}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                          a.severity === "RED"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        }`}
                      >
                        {a.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Patients Expected Today
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Submitted At</th>
                    <th className="px-5 py-4">Total Score</th>
                    <th className="px-5 py-4">Severity</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        Loading monitoring data...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        No patients expected today.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.patient_id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                              {r.patient_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-semibold text-gray-900">
                              {r.patient_name}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {r.patient_email}
                        </td>

                        <td className="px-5 py-4">
                          {statusBadge(r.today_status)}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {r.submitted_at
                            ? new Date(r.submitted_at).toLocaleString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {r.total_score}
                          </div>
                        </td>

                        <td className="px-5 py-4">{sevBadge(r.severity)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
              <span>
                Showing {rows.length} patient{rows.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
