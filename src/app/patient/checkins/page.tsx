// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ??
//   process.env.NEXT_PUBLIC_API_URL ??
//   "https://virtualwardbackend-production.up.railway.app";

// type CheckinRow = {
//   instance_id: number;
//   assignment_id: number;

//   // ✅ NEW (flows)
//   flow_id: number;
//   flow_name: string;

//   scheduled_for: string;
//   status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
//   submitted_at: string | null;
//   total_score: number;
// };

// function humanDate(value?: string | null) {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return d.toLocaleString();
// }

// function statusBadge(status: CheckinRow["status"]) {
//   const base =
//     "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold";
//   if (status === "COMPLETED")
//     return (
//       <span className={`${base} bg-green-50 text-green-800 border-green-200`}>
//         COMPLETED
//       </span>
//     );
//   if (status === "IN_PROGRESS")
//     return (
//       <span className={`${base} bg-blue-50 text-blue-800 border-blue-200`}>
//         IN PROGRESS
//       </span>
//     );
//   return (
//     <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>
//       {status}
//     </span>
//   );
// }

// export default function PatientCheckinsListPage() {
//   const router = useRouter();

//   const [rows, setRows] = useState<CheckinRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const accessToken = useMemo(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("access_token");
//   }, []);

//   async function api<T>(path: string, opts?: RequestInit): Promise<T> {
//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       router.replace("/login");
//       throw new Error("Not logged in");
//     }

//     const res = await fetch(`${API_BASE}${path}`, {
//       ...opts,
//       headers: {
//         ...(opts?.headers || {}),
//         Authorization: `Bearer ${access}`,
//       },
//       cache: "no-store",
//     });

//     const body = await res.json().catch(() => null);
//     if (!res.ok)
//       throw new Error(body?.detail || body?.message || "Request failed");
//     return body as T;
//   }

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await api<any>(`/patient/checkins?limit=200`);

//       // backend could return list OR {items}
//       const list: any[] = Array.isArray(data) ? data : data?.items || [];

//       // ✅ enforce flow-only
//       const bad = list.find((x) => !x.flow_name || !x.flow_id);
//       if (bad) {
//         throw new Error(
//           "Backend is still returning template-based checkins. Update /patient/checkins to return flow_id + flow_name.",
//         );
//       }

//       setRows(list as CheckinRow[]);
//     } catch (e: any) {
//       setError(e?.message || "Failed to load check-ins");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function goToInstance(r: CheckinRow) {
//     router.push(`/patient/checkin/${r.instance_id}`);
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
//               Your Check-ins
//             </div>
//             <div className="text-xs text-gray-500">
//               All submitted and in-progress questionnaires
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
//               onClick={() => router.push("/patient/dashboard")}
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

//         <div className="bg-white rounded-lg border border-gray-200 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm font-bold text-gray-900">
//               Check-in instances
//             </div>
//             <div className="text-xs text-gray-500">{rows.length} total</div>
//           </div>

//           {loading ? (
//             <div className="text-sm text-gray-600">Loading...</div>
//           ) : rows.length === 0 ? (
//             <div className="text-sm text-gray-600">
//               No check-ins yet. Start a questionnaire from your dashboard.
//             </div>
//           ) : (
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-600 border-b">
//                     <th className="py-2 pr-4">Scheduled</th>
//                     <th className="py-2 pr-4">Questionnaire</th>
//                     <th className="py-2 pr-4">Status</th>
//                     <th className="py-2 pr-4">Submitted</th>
//                     <th className="py-2 pr-4">Score</th>
//                     <th className="py-2 pr-4"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((r) => (
//                     <tr key={r.instance_id} className="border-b">
//                       <td className="py-2 pr-4">
//                         {humanDate(r.scheduled_for)}
//                       </td>
//                       <td className="py-2 pr-4 font-semibold text-gray-900">
//                         {r.flow_name}
//                       </td>
//                       <td className="py-2 pr-4">{statusBadge(r.status)}</td>
//                       <td className="py-2 pr-4">{humanDate(r.submitted_at)}</td>
//                       <td className="py-2 pr-4">
//                         <span className="inline-flex items-center rounded-full border px-2 py-0.5 font-bold">
//                           {r.total_score}
//                         </span>
//                       </td>
//                       <td className="py-2 pr-4">
//                         <button
//                           onClick={() => goToInstance(r)}
//                           className="rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800"
//                         >
//                           {r.status === "COMPLETED" ? "View" : "Open"}
//                         </button>
//                       </td>
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://virtualwardbackend-production.up.railway.app";

type CheckinRow = {
  instance_id: number;
  assignment_id: number;

  // ✅ flow-only
  flow_id: number;
  flow_name: string;

  scheduled_for: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
  submitted_at: string | null;
  total_score: number;
};

function humanDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function statusBadge(status: CheckinRow["status"]) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold";
  if (status === "COMPLETED")
    return (
      <span className={`${base} bg-green-50 text-green-800 border-green-200`}>
        COMPLETED
      </span>
    );
  if (status === "IN_PROGRESS")
    return (
      <span className={`${base} bg-blue-50 text-blue-800 border-blue-200`}>
        IN PROGRESS
      </span>
    );
  return (
    <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>
      {status}
    </span>
  );
}

export default function PatientCheckinsListPage() {
  const router = useRouter();

  const [rows, setRows] = useState<CheckinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }, []);

  async function api<T>(path: string, opts?: RequestInit): Promise<T> {
    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      throw new Error("Not logged in");
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers: {
        ...(opts?.headers || {}),
        Authorization: `Bearer ${access}`,
      },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok)
      throw new Error(body?.detail || body?.message || "Request failed");
    return body as T;
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api<any>(`/patient/checkins?limit=200`);

      // backend returns List[CheckinRowOut]
      const list: any[] = Array.isArray(data) ? data : data?.items || [];

      // ✅ strict flow-only enforcement
      const bad = list.find((x) => !x.flow_name || !x.flow_id);
      if (bad) {
        throw new Error(
          "Backend is still returning non-flow checkins. Expected flow_id + flow_name from /patient/checkins.",
        );
      }

      setRows(list as CheckinRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load check-ins");
    } finally {
      setLoading(false);
    }
  }

  function goToInstance(r: CheckinRow) {
    // ✅ UI route stays singular
    router.push(`/patient/checkin/${r.instance_id}`);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              Your Check-ins
            </div>
            <div className="text-xs text-gray-500">
              All submitted and in-progress questionnaires
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-gray-900">
              Check-in instances
            </div>
            <div className="text-xs text-gray-500">{rows.length} total</div>
          </div>

          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-gray-600">
              No check-ins yet. Start a questionnaire from your dashboard.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-4">Scheduled</th>
                    <th className="py-2 pr-4">Questionnaire</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Submitted</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.instance_id} className="border-b">
                      <td className="py-2 pr-4">
                        {humanDate(r.scheduled_for)}
                      </td>
                      <td className="py-2 pr-4 font-semibold text-gray-900">
                        {r.flow_name}
                      </td>
                      <td className="py-2 pr-4">{statusBadge(r.status)}</td>
                      <td className="py-2 pr-4">{humanDate(r.submitted_at)}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 font-bold">
                          {r.total_score}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          onClick={() => goToInstance(r)}
                          className="rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800"
                        >
                          {r.status === "COMPLETED" ? "View" : "Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
