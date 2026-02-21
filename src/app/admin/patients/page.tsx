// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import Link from "next/link";

// // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // type PatientRow = {
// // // //   patient_id: number;
// // // //   name: string;
// // // //   email: string;
// // // //   mrn: string;
// // // //   procedure?: string | null;
// // // //   surgery_date?: string | null;
// // // //   discharge_date?: string | null;
// // // //   status: "Verified" | "Pending" | "Rejected" | string;
// // // // };

// // // // function StatusBadge({ status }: { status: string }) {
// // // //   const cls =
// // // //     status.toLowerCase() === "verified"
// // // //       ? "bg-green-50 text-green-700 ring-1 ring-green-200"
// // // //       : status.toLowerCase() === "pending"
// // // //       ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
// // // //       : "bg-red-50 text-red-700 ring-1 ring-red-200";

// // // //   return (
// // // //     <span
// // // //       className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
// // // //     >
// // // //       {status}
// // // //     </span>
// // // //   );
// // // // }

// // // // export default function PatientsPage() {
// // // //   const [query, setQuery] = useState("");
// // // //   const [sort, setSort] = useState<"name" | "mrn" | "created_at">("name");
// // // //   const [order, setOrder] = useState<"asc" | "desc">("asc");
// // // //   const [items, setItems] = useState<PatientRow[]>([]);
// // // //   const [total, setTotal] = useState(0);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const [accessToken, setAccessToken] = useState<string | null>(null);

// // // //   useEffect(() => {
// // // //     // Read token on client after mount
// // // //     setAccessToken(localStorage.getItem("access_token"));
// // // //   }, []);

// // // //   async function load() {
// // // //     setLoading(true);
// // // //     setError(null);

// // // //     try {
// // // //       // IMPORTANT: trailing slash to avoid FastAPI 307 redirect
// // // //       const url = new URL(`${API_BASE}/patients/`);
// // // //       if (query.trim()) url.searchParams.set("q", query.trim());
// // // //       url.searchParams.set("skip", "0");
// // // //       url.searchParams.set("limit", "50");
// // // //       url.searchParams.set("sort", sort);
// // // //       url.searchParams.set("order", order);

// // // //       const res = await fetch(url.toString(), {
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
// // // //         },
// // // //         cache: "no-store",
// // // //       });

// // // //       const data = await res.json().catch(() => ({}));
// // // //       if (!res.ok) throw new Error(data.detail || "Failed to load patients");

// // // //       setItems(data.items ?? []);
// // // //       setTotal(data.total ?? 0);
// // // //     } catch (e: any) {
// // // //       setError(e.message || "Failed to load patients");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     if (accessToken !== null) load();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [accessToken, sort, order]);

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       <div className="mx-auto max-w-6xl px-4 py-8">
// // // //         <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
// // // //           {/* Top bar */}
// // // //           <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
// // // //             <div className="flex w-full items-center gap-3 md:max-w-md">
// // // //               <div className="relative w-full">
// // // //                 <input
// // // //                   value={query}
// // // //                   onChange={(e) => setQuery(e.target.value)}
// // // //                   placeholder="Search patients..."
// // // //                   className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-teal-400"
// // // //                 />
// // // //               </div>
// // // //               <button
// // // //                 onClick={load}
// // // //                 className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
// // // //               >
// // // //                 Search
// // // //               </button>
// // // //             </div>

// // // //             <div className="flex items-center gap-3">
// // // //               <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
// // // //                 <span className="text-sm text-gray-600">Sort by</span>
// // // //                 <select
// // // //                   value={sort}
// // // //                   onChange={(e) => setSort(e.target.value as any)}
// // // //                   className="bg-transparent text-sm font-semibold outline-none"
// // // //                 >
// // // //                   <option value="name">Patient Name</option>
// // // //                   <option value="mrn">MRN</option>
// // // //                   <option value="created_at">Created</option>
// // // //                 </select>
// // // //                 <button
// // // //                   onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
// // // //                   className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
// // // //                   title="Toggle order"
// // // //                 >
// // // //                   {order === "asc" ? "↑" : "↓"}
// // // //                 </button>
// // // //               </div>

// // // //               <Link
// // // //                 href="/admin/register-internal"
// // // //                 className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// // // //               >
// // // //                 + Add Patient
// // // //               </Link>
// // // //             </div>
// // // //           </div>

// // // //           {/* Table */}
// // // //           <div className="overflow-x-auto">
// // // //             <table className="min-w-full text-left text-sm">
// // // //               <thead className="text-xs font-semibold text-gray-600">
// // // //                 <tr className="border-b border-gray-100">
// // // //                   <th className="px-5 py-4">MRN</th>
// // // //                   <th className="px-5 py-4">Patient</th>
// // // //                   <th className="px-5 py-4">Procedure</th>
// // // //                   <th className="px-5 py-4">Status</th>
// // // //                   <th className="px-5 py-4 text-right">Actions</th>
// // // //                 </tr>
// // // //               </thead>

// // // //               <tbody className="divide-y divide-gray-100">
// // // //                 {loading ? (
// // // //                   <tr>
// // // //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// // // //                       Loading...
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : error ? (
// // // //                   <tr>
// // // //                     <td colSpan={5} className="px-5 py-8 text-red-600">
// // // //                       {error}
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : items.length === 0 ? (
// // // //                   <tr>
// // // //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// // // //                       No patients found.
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : (
// // // //                   items.map((p) => (
// // // //                     <tr key={p.patient_id} className="hover:bg-gray-50/50">
// // // //                       <td className="px-5 py-4 font-semibold text-gray-900">
// // // //                         {p.mrn}
// // // //                       </td>
// // // //                       <td className="px-5 py-4">
// // // //                         <div className="font-semibold text-gray-900">
// // // //                           {p.name}
// // // //                         </div>
// // // //                         <div className="text-xs text-gray-500">{p.email}</div>
// // // //                       </td>
// // // //                       <td className="px-5 py-4 text-gray-700">
// // // //                         {p.procedure ?? "-"}
// // // //                       </td>
// // // //                       <td className="px-5 py-4">
// // // //                         <StatusBadge status={p.status} />
// // // //                       </td>
// // // //                       <td className="px-5 py-4">
// // // //                         <div className="flex items-center justify-end gap-3 text-gray-600">
// // // //                           <Link
// // // //                             href={`/admin/patients/${p.patient_id}`}
// // // //                             className="hover:text-gray-900"
// // // //                             title="View patient"
// // // //                           >
// // // //                             👁
// // // //                           </Link>

// // // //                           <Link
// // // //                             href={`/admin/patients/${p.patient_id}?tab=assign`}
// // // //                             className="hover:text-blue-600"
// // // //                             title="Assign protocol"
// // // //                           >
// // // //                             ➕
// // // //                           </Link>
// // // //                         </div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>

// // // //           {/* Footer */}
// // // //           <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
// // // //             <span>
// // // //               Showing {items.length} of {total} patients
// // // //             </span>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useEffect, useMemo, useState } from "react";
// // // import Link from "next/link";

// // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // type PatientAssignment = {
// // //   id: number;
// // //   questionnaire_template_id: number;
// // //   questionnaire_template_name: string;
// // //   start_date: string | null; // ISO
// // //   end_date: string | null; // ISO
// // //   status?: string | null;
// // // };

// // // type PatientRow = {
// // //   patient_id: number;
// // //   name: string;
// // //   email: string;
// // //   mrn: string;
// // //   procedure?: string | null;
// // //   surgery_date?: string | null;
// // //   discharge_date?: string | null;
// // //   status: "Verified" | "Pending" | "Rejected" | string;

// // //   // ✅ NEW (needs API support)
// // //   created_at?: string | null; // registered date
// // //   assignments?: PatientAssignment[]; // assigned questionnaires list
// // // };

// // // function StatusBadge({ status }: { status: string }) {
// // //   const cls =
// // //     status.toLowerCase() === "verified"
// // //       ? "bg-green-50 text-green-700 ring-1 ring-green-200"
// // //       : status.toLowerCase() === "pending"
// // //       ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
// // //       : "bg-red-50 text-red-700 ring-1 ring-red-200";

// // //   return (
// // //     <span
// // //       className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
// // //     >
// // //       {status}
// // //     </span>
// // //   );
// // // }

// // // function formatHumanDate(value?: string | null) {
// // //   if (!value) return "-";
// // //   const d = new Date(value);
// // //   if (Number.isNaN(d.getTime())) return "-";
// // //   // “human format”
// // //   return d.toLocaleString(undefined, {
// // //     year: "numeric",
// // //     month: "short",
// // //     day: "2-digit",
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //   });
// // // }

// // // function formatHumanDateOnly(value?: string | null) {
// // //   if (!value) return "-";
// // //   const d = new Date(value);
// // //   if (Number.isNaN(d.getTime())) return "-";
// // //   return d.toLocaleDateString(undefined, {
// // //     year: "numeric",
// // //     month: "short",
// // //     day: "2-digit",
// // //   });
// // // }

// // // export default function PatientsPage() {
// // //   const [query, setQuery] = useState("");
// // //   const [sort, setSort] = useState<
// // //     "name" | "mrn" | "created_at" | "assigned_count"
// // //   >("name");
// // //   const [order, setOrder] = useState<"asc" | "desc">("asc");
// // //   const [items, setItems] = useState<PatientRow[]>([]);
// // //   const [total, setTotal] = useState(0);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const [accessToken, setAccessToken] = useState<string | null>(null);

// // //   // delete confirm modal state
// // //   const [deleting, setDeleting] = useState<{
// // //     open: boolean;
// // //     patient?: PatientRow;
// // //   }>({ open: false });

// // //   useEffect(() => {
// // //     // Read token on client after mount
// // //     setAccessToken(localStorage.getItem("access_token"));
// // //   }, []);

// // //   const headers = useMemo(
// // //     () => ({
// // //       "Content-Type": "application/json",
// // //       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
// // //     }),
// // //     [accessToken]
// // //   );

// // //   async function load() {
// // //     setLoading(true);
// // //     setError(null);

// // //     try {
// // //       // IMPORTANT: trailing slash to avoid FastAPI 307 redirect
// // //       const url = new URL(`${API_BASE}/patients/`);
// // //       if (query.trim()) url.searchParams.set("q", query.trim());
// // //       url.searchParams.set("skip", "0");
// // //       url.searchParams.set("limit", "50");
// // //       url.searchParams.set("sort", sort);
// // //       url.searchParams.set("order", order);

// // //       // ✅ NEW: ask backend to include assignments (if you implement it)
// // //       // If backend ignores it, UI still works.
// // //       url.searchParams.set("include_assignments", "1");

// // //       const res = await fetch(url.toString(), {
// // //         headers,
// // //         cache: "no-store",
// // //       });

// // //       const data = await res.json().catch(() => ({}));
// // //       if (!res.ok) throw new Error(data.detail || "Failed to load patients");

// // //       setItems(data.items ?? []);
// // //       setTotal(data.total ?? 0);
// // //     } catch (e: any) {
// // //       setError(e.message || "Failed to load patients");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function deletePatient(patientId: number) {
// // //     // assumes you have DELETE /patients/{id}
// // //     const res = await fetch(`${API_BASE}/patients/${patientId}`, {
// // //       method: "DELETE",
// // //       headers,
// // //     });
// // //     const data = await res.json().catch(() => ({}));
// // //     if (!res.ok) throw new Error(data.detail || "Failed to delete patient");
// // //   }

// // //   useEffect(() => {
// // //     if (accessToken !== null) load();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [accessToken, sort, order]);

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <div className="mx-auto max-w-7xl px-4 py-8">
// // //         <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
// // //           {/* Top bar */}
// // //           <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
// // //             <div className="flex w-full items-center gap-3 md:max-w-md">
// // //               <div className="relative w-full">
// // //                 <input
// // //                   value={query}
// // //                   onChange={(e) => setQuery(e.target.value)}
// // //                   placeholder="Search patients..."
// // //                   className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-teal-400"
// // //                 />
// // //               </div>
// // //               <button
// // //                 onClick={load}
// // //                 className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
// // //               >
// // //                 Search
// // //               </button>
// // //             </div>

// // //             <div className="flex items-center gap-3">
// // //               <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
// // //                 <span className="text-sm text-gray-600">Sort by</span>
// // //                 <select
// // //                   value={sort}
// // //                   onChange={(e) => setSort(e.target.value as any)}
// // //                   className="bg-transparent text-sm font-semibold outline-none"
// // //                 >
// // //                   <option value="name">Patient Name</option>
// // //                   <option value="mrn">MRN</option>
// // //                   <option value="created_at">Registered</option>
// // //                   <option value="assigned_count">Assigned count</option>
// // //                 </select>
// // //                 <button
// // //                   onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
// // //                   className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
// // //                   title="Toggle order"
// // //                 >
// // //                   {order === "asc" ? "↑" : "↓"}
// // //                 </button>
// // //               </div>

// // //               <Link
// // //                 href="/admin/register-internal"
// // //                 className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// // //               >
// // //                 + Add Patient
// // //               </Link>
// // //             </div>
// // //           </div>

// // //           {/* Table */}
// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full text-left text-sm">
// // //               <thead className="text-xs font-semibold text-gray-600">
// // //                 <tr className="border-b border-gray-100">
// // //                   <th className="px-5 py-4">MRN</th>
// // //                   <th className="px-5 py-4">Patient</th>
// // //                   <th className="px-5 py-4">Registered</th>
// // //                   <th className="px-5 py-4">Procedure</th>
// // //                   <th className="px-5 py-4">Assigned Questionnaires</th>
// // //                   <th className="px-5 py-4">Status</th>
// // //                   <th className="px-5 py-4 text-right">Actions</th>
// // //                 </tr>
// // //               </thead>

// // //               <tbody className="divide-y divide-gray-100">
// // //                 {loading ? (
// // //                   <tr>
// // //                     <td colSpan={7} className="px-5 py-8 text-gray-600">
// // //                       Loading...
// // //                     </td>
// // //                   </tr>
// // //                 ) : error ? (
// // //                   <tr>
// // //                     <td colSpan={7} className="px-5 py-8 text-red-600">
// // //                       {error}
// // //                     </td>
// // //                   </tr>
// // //                 ) : items.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan={7} className="px-5 py-8 text-gray-600">
// // //                       No patients found.
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   items.map((p) => (
// // //                     <tr key={p.patient_id} className="hover:bg-gray-50/50">
// // //                       <td className="px-5 py-4 font-semibold text-gray-900">
// // //                         {p.mrn}
// // //                       </td>

// // //                       <td className="px-5 py-4">
// // //                         <div className="font-semibold text-gray-900">
// // //                           {p.name}
// // //                         </div>
// // //                         <div className="text-xs text-gray-500">{p.email}</div>
// // //                       </td>

// // //                       <td className="px-5 py-4 text-gray-700">
// // //                         {formatHumanDate(p.created_at)}
// // //                       </td>

// // //                       <td className="px-5 py-4 text-gray-700">
// // //                         {p.procedure ?? "-"}
// // //                       </td>

// // //                       <td className="px-5 py-4 text-gray-700">
// // //                         {!p.assignments || p.assignments.length === 0 ? (
// // //                           <span className="text-gray-500">—</span>
// // //                         ) : (
// // //                           <div className="flex flex-col gap-1">
// // //                             {p.assignments
// // //                               .slice()
// // //                               .sort((a, b) => {
// // //                                 const ad = a.start_date
// // //                                   ? new Date(a.start_date).getTime()
// // //                                   : 0;
// // //                                 const bd = b.start_date
// // //                                   ? new Date(b.start_date).getTime()
// // //                                   : 0;
// // //                                 return bd - ad; // latest first
// // //                               })
// // //                               .map((a) => (
// // //                                 <div
// // //                                   key={a.id}
// // //                                   className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1"
// // //                                 >
// // //                                   <div className="font-semibold text-gray-900">
// // //                                     {a.questionnaire_template_name}
// // //                                   </div>
// // //                                   <div className="text-xs text-gray-600">
// // //                                     Start: {formatHumanDateOnly(a.start_date)} ·
// // //                                     End: {formatHumanDateOnly(a.end_date)}
// // //                                     {a.status ? ` · ${a.status}` : ""}
// // //                                   </div>
// // //                                 </div>
// // //                               ))}
// // //                           </div>
// // //                         )}
// // //                       </td>

// // //                       <td className="px-5 py-4">
// // //                         <StatusBadge status={p.status} />
// // //                       </td>

// // //                       <td className="px-5 py-4">
// // //                         <div className="flex items-center justify-end gap-3 text-gray-600">
// // //                           <Link
// // //                             href={`/admin/patients/${p.patient_id}`}
// // //                             className="hover:text-gray-900"
// // //                             title="View patient"
// // //                           >
// // //                             👁
// // //                           </Link>

// // //                           {/* ✅ NEW: Edit patient */}
// // //                           <Link
// // //                             href={`/admin/patients/${p.patient_id}/edit`}
// // //                             className="hover:text-blue-600"
// // //                             title="Edit patient"
// // //                           >
// // //                             ✏️
// // //                           </Link>

// // //                           {/* Existing: Assign protocol */}
// // //                           <Link
// // //                             href={`/admin/patients/${p.patient_id}?tab=assign`}
// // //                             className="hover:text-blue-600"
// // //                             title="Assign questionnaire"
// // //                           >
// // //                             ➕
// // //                           </Link>

// // //                           {/* ✅ NEW: Delete patient */}
// // //                           <button
// // //                             className="hover:text-red-600"
// // //                             title="Delete patient"
// // //                             onClick={() =>
// // //                               setDeleting({ open: true, patient: p })
// // //                             }
// // //                           >
// // //                             🗑️
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Footer */}
// // //           <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
// // //             <span>
// // //               Showing {items.length} of {total} patients
// // //             </span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Delete confirm modal */}
// // //       {deleting.open ? (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // //           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-200">
// // //             <div className="text-lg font-bold text-gray-900">
// // //               Delete patient?
// // //             </div>
// // //             <div className="mt-2 text-sm text-gray-600">
// // //               This will delete{" "}
// // //               <span className="font-semibold text-gray-900">
// // //                 {deleting.patient?.name}
// // //               </span>{" "}
// // //               (MRN: {deleting.patient?.mrn}). This action may be irreversible
// // //               depending on backend implementation.
// // //             </div>

// // //             <div className="mt-5 flex justify-end gap-3">
// // //               <button
// // //                 className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
// // //                 onClick={() => setDeleting({ open: false })}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
// // //                 onClick={async () => {
// // //                   if (!deleting.patient) return;
// // //                   try {
// // //                     setLoading(true);
// // //                     setError(null);
// // //                     await deletePatient(deleting.patient.patient_id);
// // //                     setDeleting({ open: false });
// // //                     await load();
// // //                   } catch (e: any) {
// // //                     setError(e?.message || "Failed to delete patient");
// // //                     setDeleting({ open: false });
// // //                   } finally {
// // //                     setLoading(false);
// // //                   }
// // //                 }}
// // //               >
// // //                 Delete
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       ) : null}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import Link from "next/link";

// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // ✅ Match assignments.py response
// // type PatientAssignment = {
// //   id: number;
// //   patient_id: number;
// //   template_id: number;
// //   template_name: string;
// //   template_type: string;
// //   start_date: string; // YYYY-MM-DD
// //   end_date: string; // YYYY-MM-DD
// //   frequency: string;
// //   is_active: boolean;
// //   created_at: string;
// // };

// // type PatientRow = {
// //   patient_id: number;
// //   name: string;
// //   email: string;
// //   mrn: string;
// //   procedure?: string | null;
// //   surgery_date?: string | null;
// //   discharge_date?: string | null;
// //   status: "Verified" | "Pending" | "Rejected" | string;

// //   created_at?: string | null;

// //   // ✅ filled by calling /assignments/patient/{id}
// //   assignments?: PatientAssignment[];
// // };

// // function StatusBadge({ status }: { status: string }) {
// //   const cls =
// //     status.toLowerCase() === "verified"
// //       ? "bg-green-50 text-green-700 ring-1 ring-green-200"
// //       : status.toLowerCase() === "pending"
// //         ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
// //         : "bg-red-50 text-red-700 ring-1 ring-red-200";

// //   return (
// //     <span
// //       className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
// //     >
// //       {status}
// //     </span>
// //   );
// // }

// // function formatHumanDate(value?: string | null) {
// //   if (!value) return "-";
// //   const d = new Date(value);
// //   if (Number.isNaN(d.getTime())) return "-";
// //   return d.toLocaleString(undefined, {
// //     year: "numeric",
// //     month: "short",
// //     day: "2-digit",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   });
// // }

// // function formatHumanDateOnly(value?: string | null) {
// //   if (!value) return "-";
// //   const d = new Date(value);
// //   if (Number.isNaN(d.getTime())) return "-";
// //   return d.toLocaleDateString(undefined, {
// //     year: "numeric",
// //     month: "short",
// //     day: "2-digit",
// //   });
// // }

// // // small concurrency limiter
// // async function mapWithConcurrency<T, R>(
// //   items: T[],
// //   limit: number,
// //   fn: (item: T, idx: number) => Promise<R>,
// // ): Promise<R[]> {
// //   const results: R[] = new Array(items.length);
// //   let i = 0;

// //   async function worker() {
// //     while (i < items.length) {
// //       const idx = i++;
// //       results[idx] = await fn(items[idx], idx);
// //     }
// //   }

// //   await Promise.all(
// //     Array.from({ length: Math.min(limit, items.length) }, () => worker()),
// //   );
// //   return results;
// // }

// // export default function PatientsPage() {
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<
// //     "name" | "mrn" | "created_at" | "assigned_count"
// //   >("name");
// //   const [order, setOrder] = useState<"asc" | "desc">("asc");

// //   const [items, setItems] = useState<PatientRow[]>([]);
// //   const [total, setTotal] = useState(0);

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const [accessToken, setAccessToken] = useState<string | null>(null);

// //   const [deleting, setDeleting] = useState<{
// //     open: boolean;
// //     patient?: PatientRow;
// //   }>({ open: false });

// //   useEffect(() => {
// //     setAccessToken(localStorage.getItem("access_token"));
// //   }, []);

// //   const headers = useMemo(
// //     () => ({
// //       "Content-Type": "application/json",
// //       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
// //     }),
// //     [accessToken],
// //   );

// //   async function apiFetch(url: string, init?: RequestInit) {
// //     const res = await fetch(url, {
// //       ...init,
// //       headers: {
// //         ...(init?.headers || {}),
// //         ...headers,
// //       },
// //       cache: "no-store",
// //     });
// //     const data = await res.json().catch(() => ({}));
// //     if (!res.ok)
// //       throw new Error(data.detail || data.message || "Request failed");
// //     return data;
// //   }

// //   async function fetchAssignments(
// //     patientId: number,
// //   ): Promise<PatientAssignment[]> {
// //     const data = await apiFetch(
// //       `${API_BASE}/assignments/patient/${patientId}?active_only=false&skip=0&limit=200`,
// //     );
// //     return (data.items ?? []) as PatientAssignment[];
// //   }

// //   async function load() {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       // ✅ Patients list (no old include_assignments)
// //       const url = new URL(`${API_BASE}/patients/`);
// //       if (query.trim()) url.searchParams.set("q", query.trim());
// //       url.searchParams.set("skip", "0");
// //       url.searchParams.set("limit", "50");
// //       url.searchParams.set("sort", sort);
// //       url.searchParams.set("order", order);

// //       const res = await fetch(url.toString(), { headers, cache: "no-store" });
// //       const data = await res.json().catch(() => ({}));
// //       if (!res.ok) throw new Error(data.detail || "Failed to load patients");

// //       const basePatients: PatientRow[] = data.items ?? [];
// //       setTotal(data.total ?? basePatients.length);

// //       // ✅ Attach assignments (from flows-based assignments API)
// //       const withAssignments = await mapWithConcurrency(
// //         basePatients,
// //         6,
// //         async (p) => {
// //           try {
// //             const a = await fetchAssignments(p.patient_id);
// //             return { ...p, assignments: a };
// //           } catch {
// //             return { ...p, assignments: [] };
// //           }
// //         },
// //       );

// //       // ✅ if sorting by assigned_count, sort client-side
// //       let finalList = withAssignments.slice();
// //       if (sort === "assigned_count") {
// //         finalList.sort((a, b) => {
// //           const ac = a.assignments?.length ?? 0;
// //           const bc = b.assignments?.length ?? 0;
// //           return order === "asc" ? ac - bc : bc - ac;
// //         });
// //       }

// //       setItems(finalList);
// //     } catch (e: any) {
// //       setError(e.message || "Failed to load patients");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function deletePatient(patientId: number) {
// //     const res = await fetch(`${API_BASE}/patients/${patientId}`, {
// //       method: "DELETE",
// //       headers,
// //     });
// //     const data = await res.json().catch(() => ({}));
// //     if (!res.ok) throw new Error(data.detail || "Failed to delete patient");
// //   }

// //   useEffect(() => {
// //     if (accessToken !== null) load();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [accessToken, sort, order]);

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="mx-auto max-w-7xl px-4 py-8">
// //         <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
// //           {/* Top bar */}
// //           <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
// //             <div className="flex w-full items-center gap-3 md:max-w-md">
// //               <div className="relative w-full">
// //                 <input
// //                   value={query}
// //                   onChange={(e) => setQuery(e.target.value)}
// //                   placeholder="Search patients..."
// //                   className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-teal-400"
// //                 />
// //               </div>
// //               <button
// //                 onClick={load}
// //                 className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
// //               >
// //                 Search
// //               </button>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
// //                 <span className="text-sm text-gray-600">Sort by</span>
// //                 <select
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as any)}
// //                   className="bg-transparent text-sm font-semibold outline-none"
// //                 >
// //                   <option value="name">Patient Name</option>
// //                   <option value="mrn">MRN</option>
// //                   <option value="created_at">Registered</option>
// //                   <option value="assigned_count">Assigned count</option>
// //                 </select>
// //                 <button
// //                   onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
// //                   className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
// //                   title="Toggle order"
// //                 >
// //                   {order === "asc" ? "↑" : "↓"}
// //                 </button>
// //               </div>

// //               <Link
// //                 href="/admin/register-internal"
// //                 className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// //               >
// //                 + Add Patient
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Table */}
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full text-left text-sm">
// //               <thead className="text-xs font-semibold text-gray-600">
// //                 <tr className="border-b border-gray-100">
// //                   <th className="px-5 py-4">MRN</th>
// //                   <th className="px-5 py-4">Patient</th>
// //                   <th className="px-5 py-4">Registered</th>
// //                   <th className="px-5 py-4">Procedure</th>
// //                   <th className="px-5 py-4">Assigned Questionnaires</th>
// //                   <th className="px-5 py-4">Status</th>
// //                   <th className="px-5 py-4 text-right">Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody className="divide-y divide-gray-100">
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan={7} className="px-5 py-8 text-gray-600">
// //                       Loading...
// //                     </td>
// //                   </tr>
// //                 ) : error ? (
// //                   <tr>
// //                     <td colSpan={7} className="px-5 py-8 text-red-600">
// //                       {error}
// //                     </td>
// //                   </tr>
// //                 ) : items.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={7} className="px-5 py-8 text-gray-600">
// //                       No patients found.
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   items.map((p) => (
// //                     <tr key={p.patient_id} className="hover:bg-gray-50/50">
// //                       <td className="px-5 py-4 font-semibold text-gray-900">
// //                         {p.mrn}
// //                       </td>

// //                       <td className="px-5 py-4">
// //                         <div className="font-semibold text-gray-900">
// //                           {p.name}
// //                         </div>
// //                         <div className="text-xs text-gray-500">{p.email}</div>
// //                       </td>

// //                       <td className="px-5 py-4 text-gray-700">
// //                         {formatHumanDate(p.created_at)}
// //                       </td>

// //                       <td className="px-5 py-4 text-gray-700">
// //                         {p.procedure ?? "-"}
// //                       </td>

// //                       {/* ✅ FIX: show template_name correctly */}
// //                       <td className="px-5 py-4 text-gray-700">
// //                         {!p.assignments || p.assignments.length === 0 ? (
// //                           <span className="text-gray-500">—</span>
// //                         ) : (
// //                           <div className="flex flex-col gap-1">
// //                             {p.assignments
// //                               .slice()
// //                               .sort((a, b) => {
// //                                 const ad = a.start_date
// //                                   ? new Date(a.start_date).getTime()
// //                                   : 0;
// //                                 const bd = b.start_date
// //                                   ? new Date(b.start_date).getTime()
// //                                   : 0;
// //                                 return bd - ad;
// //                               })
// //                               .map((a) => (
// //                                 <div
// //                                   key={a.id}
// //                                   className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1"
// //                                 >
// //                                   <div className="font-semibold text-gray-900">
// //                                     {a.template_name}
// //                                   </div>
// //                                   <div className="text-xs text-gray-600">
// //                                     Type: {a.template_type || "-"} · Start:{" "}
// //                                     {formatHumanDateOnly(a.start_date)} · End:{" "}
// //                                     {formatHumanDateOnly(a.end_date)} ·{" "}
// //                                     {a.is_active ? "Active" : "Inactive"}
// //                                   </div>
// //                                 </div>
// //                               ))}
// //                           </div>
// //                         )}
// //                       </td>

// //                       <td className="px-5 py-4">
// //                         <StatusBadge status={p.status} />
// //                       </td>

// //                       <td className="px-5 py-4">
// //                         <div className="flex items-center justify-end gap-3 text-gray-600">
// //                           <Link
// //                             href={`/admin/patients/${p.patient_id}`}
// //                             className="hover:text-gray-900"
// //                             title="View patient"
// //                           >
// //                             👁
// //                           </Link>

// //                           <Link
// //                             href={`/admin/patients/${p.patient_id}/edit`}
// //                             className="hover:text-blue-600"
// //                             title="Edit patient"
// //                           >
// //                             ✏️
// //                           </Link>

// //                           <Link
// //                             href={`/admin/patients/${p.patient_id}?tab=assign`}
// //                             className="hover:text-blue-600"
// //                             title="Assign questionnaire"
// //                           >
// //                             ➕
// //                           </Link>

// //                           <button
// //                             className="hover:text-red-600"
// //                             title="Delete patient"
// //                             onClick={() =>
// //                               setDeleting({ open: true, patient: p })
// //                             }
// //                           >
// //                             🗑️
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
// //             <span>
// //               Showing {items.length} of {total} patients
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Delete modal */}
// //       {deleting.open ? (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-200">
// //             <div className="text-lg font-bold text-gray-900">
// //               Delete patient?
// //             </div>
// //             <div className="mt-2 text-sm text-gray-600">
// //               This will delete{" "}
// //               <span className="font-semibold text-gray-900">
// //                 {deleting.patient?.name}
// //               </span>{" "}
// //               (MRN: {deleting.patient?.mrn}).
// //             </div>

// //             <div className="mt-5 flex justify-end gap-3">
// //               <button
// //                 className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
// //                 onClick={() => setDeleting({ open: false })}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
// //                 onClick={async () => {
// //                   if (!deleting.patient) return;
// //                   try {
// //                     setLoading(true);
// //                     setError(null);
// //                     await deletePatient(deleting.patient.patient_id);
// //                     setDeleting({ open: false });
// //                     await load();
// //                   } catch (e: any) {
// //                     setError(e?.message || "Failed to delete patient");
// //                     setDeleting({ open: false });
// //                   } finally {
// //                     setLoading(false);
// //                   }
// //                 }}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // ✅ matches backend assignments.py (flow_* fields)
// type PatientAssignment = {
//   id: number;
//   patient_id: number;
//   flow_id: number;
//   flow_name: string;
//   flow_type: string;
//   start_date: string; // YYYY-MM-DD
//   end_date: string; // YYYY-MM-DD
//   frequency: string;
//   is_active: boolean;
//   created_at: string;
// };

// type PatientRow = {
//   patient_id: number;
//   name: string;
//   email: string;
//   mrn: string;
//   procedure?: string | null;
//   surgery_date?: string | null;
//   discharge_date?: string | null;
//   status: "Verified" | "Pending" | "Rejected" | string;

//   created_at?: string | null;

//   // filled by calling /assignments/patient/{id}
//   assignments?: PatientAssignment[];
// };

// function StatusBadge({ status }: { status: string }) {
//   const cls =
//     status.toLowerCase() === "verified"
//       ? "bg-green-50 text-green-700 ring-1 ring-green-200"
//       : status.toLowerCase() === "pending"
//         ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
//         : "bg-red-50 text-red-700 ring-1 ring-red-200";

//   return (
//     <span
//       className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
//     >
//       {status}
//     </span>
//   );
// }

// function formatHumanDate(value?: string | null) {
//   if (!value) return "-";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "-";
//   return d.toLocaleString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function formatHumanDateOnly(value?: string | null) {
//   if (!value) return "-";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "-";
//   return d.toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//   });
// }

// // small concurrency limiter
// async function mapWithConcurrency<T, R>(
//   items: T[],
//   limit: number,
//   fn: (item: T, idx: number) => Promise<R>,
// ): Promise<R[]> {
//   const results: R[] = new Array(items.length);
//   let i = 0;

//   async function worker() {
//     while (i < items.length) {
//       const idx = i++;
//       results[idx] = await fn(items[idx], idx);
//     }
//   }

//   await Promise.all(
//     Array.from({ length: Math.min(limit, items.length) }, () => worker()),
//   );
//   return results;
// }

// export default function PatientsPage() {
//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState<
//     "name" | "mrn" | "created_at" | "assigned_count"
//   >("name");
//   const [order, setOrder] = useState<"asc" | "desc">("asc");

//   const [items, setItems] = useState<PatientRow[]>([]);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [accessToken, setAccessToken] = useState<string | null>(null);

//   const [deleting, setDeleting] = useState<{
//     open: boolean;
//     patient?: PatientRow;
//   }>({ open: false });

//   useEffect(() => {
//     setAccessToken(localStorage.getItem("access_token"));
//   }, []);

//   const headers = useMemo(
//     () => ({
//       "Content-Type": "application/json",
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//     }),
//     [accessToken],
//   );

//   async function apiFetch(url: string, init?: RequestInit) {
//     const res = await fetch(url, {
//       ...init,
//       headers: {
//         ...(init?.headers || {}),
//         ...headers,
//       },
//       cache: "no-store",
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok)
//       throw new Error(data.detail || data.message || "Request failed");
//     return data;
//   }

//   async function fetchAssignments(
//     patientId: number,
//   ): Promise<PatientAssignment[]> {
//     const data = await apiFetch(
//       `${API_BASE}/assignments/patient/${patientId}?active_only=false&skip=0&limit=200`,
//     );
//     return (data.items ?? []) as PatientAssignment[];
//   }

//   async function load() {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = new URL(`${API_BASE}/patients/`);
//       if (query.trim()) url.searchParams.set("q", query.trim());
//       url.searchParams.set("skip", "0");
//       url.searchParams.set("limit", "50");
//       url.searchParams.set("sort", sort);
//       url.searchParams.set("order", order);

//       const res = await fetch(url.toString(), { headers, cache: "no-store" });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.detail || "Failed to load patients");

//       const basePatients: PatientRow[] = data.items ?? [];
//       setTotal(data.total ?? basePatients.length);

//       const withAssignments = await mapWithConcurrency(
//         basePatients,
//         6,
//         async (p) => {
//           try {
//             const a = await fetchAssignments(p.patient_id);
//             return { ...p, assignments: a };
//           } catch {
//             return { ...p, assignments: [] };
//           }
//         },
//       );

//       let finalList = withAssignments.slice();
//       if (sort === "assigned_count") {
//         finalList.sort((a, b) => {
//           const ac = a.assignments?.length ?? 0;
//           const bc = b.assignments?.length ?? 0;
//           return order === "asc" ? ac - bc : bc - ac;
//         });
//       }

//       setItems(finalList);
//     } catch (e: any) {
//       setError(e.message || "Failed to load patients");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function deletePatient(patientId: number) {
//     const res = await fetch(`${API_BASE}/patients/${patientId}`, {
//       method: "DELETE",
//       headers,
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) throw new Error(data.detail || "Failed to delete patient");
//   }

//   useEffect(() => {
//     if (accessToken !== null) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken, sort, order]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-7xl px-4 py-8">
//         <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
//           {/* Top bar */}
//           <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
//             <div className="flex w-full items-center gap-3 md:max-w-md">
//               <div className="relative w-full">
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search patients..."
//                   className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-teal-400"
//                 />
//               </div>
//               <button
//                 onClick={load}
//                 className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
//               >
//                 Search
//               </button>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
//                 <span className="text-sm text-gray-600">Sort by</span>
//                 <select
//                   value={sort}
//                   onChange={(e) => setSort(e.target.value as any)}
//                   className="bg-transparent text-sm font-semibold outline-none"
//                 >
//                   <option value="name">Patient Name</option>
//                   <option value="mrn">MRN</option>
//                   <option value="created_at">Registered</option>
//                   <option value="assigned_count">Assigned count</option>
//                 </select>
//                 <button
//                   onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
//                   className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
//                   title="Toggle order"
//                 >
//                   {order === "asc" ? "↑" : "↓"}
//                 </button>
//               </div>

//               <Link
//                 href="/admin/register-internal"
//                 className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//               >
//                 + Add Patient
//               </Link>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="text-xs font-semibold text-gray-600">
//                 <tr className="border-b border-gray-100">
//                   <th className="px-5 py-4">MRN</th>
//                   <th className="px-5 py-4">Patient</th>
//                   <th className="px-5 py-4">Registered</th>
//                   <th className="px-5 py-4">Procedure</th>
//                   <th className="px-5 py-4">Assigned Flows</th>
//                   <th className="px-5 py-4">Status</th>
//                   <th className="px-5 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={7} className="px-5 py-8 text-gray-600">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={7} className="px-5 py-8 text-red-600">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : items.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-5 py-8 text-gray-600">
//                       No patients found.
//                     </td>
//                   </tr>
//                 ) : (
//                   items.map((p) => (
//                     <tr key={p.patient_id} className="hover:bg-gray-50/50">
//                       <td className="px-5 py-4 font-semibold text-gray-900">
//                         {p.mrn}
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="font-semibold text-gray-900">
//                           {p.name}
//                         </div>
//                         <div className="text-xs text-gray-500">{p.email}</div>
//                       </td>

//                       <td className="px-5 py-4 text-gray-700">
//                         {formatHumanDate(p.created_at)}
//                       </td>

//                       <td className="px-5 py-4 text-gray-700">
//                         {p.procedure ?? "-"}
//                       </td>

//                       {/* ✅ FLOW FIELDS */}
//                       <td className="px-5 py-4 text-gray-700">
//                         {!p.assignments || p.assignments.length === 0 ? (
//                           <span className="text-gray-500">—</span>
//                         ) : (
//                           <div className="flex flex-col gap-1">
//                             {p.assignments
//                               .slice()
//                               .sort((a, b) => {
//                                 const ad = a.start_date
//                                   ? new Date(a.start_date).getTime()
//                                   : 0;
//                                 const bd = b.start_date
//                                   ? new Date(b.start_date).getTime()
//                                   : 0;
//                                 return bd - ad;
//                               })
//                               .map((a) => (
//                                 <div
//                                   key={a.id}
//                                   className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1"
//                                 >
//                                   <div className="font-semibold text-gray-900">
//                                     {a.flow_name}
//                                   </div>
//                                   <div className="text-xs text-gray-600">
//                                     Type: {a.flow_type || "-"} · Start:{" "}
//                                     {formatHumanDateOnly(a.start_date)} · End:{" "}
//                                     {formatHumanDateOnly(a.end_date)} ·{" "}
//                                     {a.is_active ? "Active" : "Inactive"}
//                                   </div>
//                                 </div>
//                               ))}
//                           </div>
//                         )}
//                       </td>

//                       <td className="px-5 py-4">
//                         <StatusBadge status={p.status} />
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex items-center justify-end gap-3 text-gray-600">
//                           <Link
//                             href={`/admin/patients/${p.patient_id}`}
//                             className="hover:text-gray-900"
//                             title="View patient"
//                           >
//                             👁
//                           </Link>

//                           <Link
//                             href={`/admin/patients/${p.patient_id}/edit`}
//                             className="hover:text-blue-600"
//                             title="Edit patient"
//                           >
//                             ✏️
//                           </Link>

//                           <Link
//                             href={`/admin/patients/${p.patient_id}?tab=assign`}
//                             className="hover:text-blue-600"
//                             title="Assign flow"
//                           >
//                             ➕
//                           </Link>

//                           <button
//                             className="hover:text-red-600"
//                             title="Delete patient"
//                             onClick={() =>
//                               setDeleting({ open: true, patient: p })
//                             }
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
//             <span>
//               Showing {items.length} of {total} patients
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Delete modal */}
//       {deleting.open ? (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-200">
//             <div className="text-lg font-bold text-gray-900">
//               Delete patient?
//             </div>
//             <div className="mt-2 text-sm text-gray-600">
//               This will delete{" "}
//               <span className="font-semibold text-gray-900">
//                 {deleting.patient?.name}
//               </span>{" "}
//               (MRN: {deleting.patient?.mrn}).
//             </div>

//             <div className="mt-5 flex justify-end gap-3">
//               <button
//                 className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//                 onClick={() => setDeleting({ open: false })}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
//                 onClick={async () => {
//                   if (!deleting.patient) return;
//                   try {
//                     setLoading(true);
//                     setError(null);
//                     await deletePatient(deleting.patient.patient_id);
//                     setDeleting({ open: false });
//                     await load();
//                   } catch (e: any) {
//                     setError(e?.message || "Failed to delete patient");
//                     setDeleting({ open: false });
//                   } finally {
//                     setLoading(false);
//                   }
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

// ✅ matches backend assignments.py (flow_* fields)
type PatientAssignment = {
  id: number;
  patient_id: number;
  flow_id: number;
  flow_name: string;
  flow_type: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  frequency: string;
  is_active: boolean;
  created_at: string;
};

type PatientRow = {
  patient_id: number;
  name: string;
  email: string;
  mrn: string;
  procedure?: string | null;
  surgery_date?: string | null;
  discharge_date?: string | null;
  status: "Verified" | "Pending" | "Rejected" | string;

  created_at?: string | null;

  // filled by calling /assignments/patient/{id}
  assignments?: PatientAssignment[];
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    status.toLowerCase() === "verified"
      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
      : status.toLowerCase() === "pending"
        ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
        : "bg-red-50 text-red-700 ring-1 ring-red-200";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

function formatHumanDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatHumanDateOnly(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// small concurrency limiter
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

export default function PatientsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "name" | "mrn" | "created_at" | "assigned_count"
  >("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [items, setItems] = useState<PatientRow[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<{
    open: boolean;
    patient?: PatientRow;
  }>({ open: false });

  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }),
    [accessToken],
  );

  async function apiFetch(url: string, init?: RequestInit) {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        ...headers,
      },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.detail || data.message || "Request failed");
    return data;
  }

  async function fetchAssignments(
    patientId: number,
  ): Promise<PatientAssignment[]> {
    const data = await apiFetch(
      `${API_BASE}/assignments/patient/${patientId}?active_only=false&skip=0&limit=200`,
    );
    return (data.items ?? []) as PatientAssignment[];
  }

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${API_BASE}/patients/`);
      if (query.trim()) url.searchParams.set("q", query.trim());
      url.searchParams.set("skip", "0");
      url.searchParams.set("limit", "50");
      url.searchParams.set("sort", sort);
      url.searchParams.set("order", order);

      const res = await fetch(url.toString(), { headers, cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Failed to load patients");

      const basePatients: PatientRow[] = data.items ?? [];
      setTotal(data.total ?? basePatients.length);

      const withAssignments = await mapWithConcurrency(
        basePatients,
        6,
        async (p) => {
          try {
            const a = await fetchAssignments(p.patient_id);
            return { ...p, assignments: a };
          } catch {
            return { ...p, assignments: [] };
          }
        },
      );

      let finalList = withAssignments.slice();
      if (sort === "assigned_count") {
        finalList.sort((a, b) => {
          const ac = a.assignments?.length ?? 0;
          const bc = b.assignments?.length ?? 0;
          return order === "asc" ? ac - bc : bc - ac;
        });
      }

      setItems(finalList);
    } catch (e: any) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  async function deletePatient(patientId: number) {
    const res = await fetch(`${API_BASE}/patients/${patientId}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Failed to delete patient");
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
    if (accessToken !== null) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, sort, order]);

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
            <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and view all enrolled patients
            </p>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Top bar */}
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-3 md:max-w-md">
                <div className="relative w-full">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search patients..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={load}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                >
                  Search
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="bg-transparent text-sm font-semibold outline-none"
                  >
                    <option value="name">Patient Name</option>
                    <option value="mrn">MRN</option>
                    <option value="created_at">Registered</option>
                    <option value="assigned_count">Assigned count</option>
                  </select>
                  <button
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    className="rounded-lg px-2 py-1 text-sm hover:bg-gray-50"
                    title="Toggle order"
                  >
                    {order === "asc" ? "↑" : "↓"}
                  </button>
                </div>

                <Link
                  href="/admin/register-internal"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  + Add Patient
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-4">MRN</th>
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Registered</th>
                    <th className="px-5 py-4">Procedure</th>
                    <th className="px-5 py-4">Assigned Flows</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        Loading patients...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    items.map((p) => (
                      <tr key={p.patient_id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {p.mrn}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {p.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {p.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {formatHumanDate(p.created_at)}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {p.procedure ?? "-"}
                        </td>

                        {/* ✅ FLOW FIELDS */}
                        <td className="px-5 py-4 text-gray-700">
                          {!p.assignments || p.assignments.length === 0 ? (
                            <span className="text-gray-500">—</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {p.assignments
                                .slice()
                                .sort((a, b) => {
                                  const ad = a.start_date
                                    ? new Date(a.start_date).getTime()
                                    : 0;
                                  const bd = b.start_date
                                    ? new Date(b.start_date).getTime()
                                    : 0;
                                  return bd - ad;
                                })
                                .map((a) => (
                                  <div
                                    key={a.id}
                                    className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-1"
                                  >
                                    <div className="font-semibold text-teal-900">
                                      {a.flow_name}
                                    </div>
                                    <div className="text-xs text-teal-700">
                                      Type: {a.flow_type || "-"} · Start:{" "}
                                      {formatHumanDateOnly(a.start_date)} · End:{" "}
                                      {formatHumanDateOnly(a.end_date)} ·{" "}
                                      {a.is_active ? (
                                        <span className="text-green-600 font-semibold">
                                          Active
                                        </span>
                                      ) : (
                                        <span className="text-gray-500">
                                          Inactive
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={p.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/patients/${p.patient_id}`}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-teal-600"
                              title="View patient"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>

                            <Link
                              href={`/admin/patients/${p.patient_id}/edit`}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600"
                              title="Edit patient"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>

                            <Link
                              href={`/admin/patients/${p.patient_id}?tab=assign`}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-teal-600"
                              title="Assign flow"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </Link>

                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                              title="Delete patient"
                              onClick={() =>
                                setDeleting({ open: true, patient: p })
                              }
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
              <span>
                Showing {items.length} of {total} patients
              </span>
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
        </main>
      </div>

      {/* Delete modal */}
      {deleting.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Delete patient?
                </div>
                <div className="text-sm text-gray-500">
                  This action cannot be undone
                </div>
              </div>
            </div>

            <div className="mb-5 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleting.patient?.name}
              </span>{" "}
              (MRN: {deleting.patient?.mrn})? All associated data will be
              permanently removed.
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                onClick={() => setDeleting({ open: false })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                onClick={async () => {
                  if (!deleting.patient) return;
                  try {
                    setLoading(true);
                    setError(null);
                    await deletePatient(deleting.patient.patient_id);
                    setDeleting({ open: false });
                    await load();
                  } catch (e: any) {
                    setError(e?.message || "Failed to delete patient");
                    setDeleting({ open: false });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
