// // // "use client";

// // // import { useEffect, useMemo, useState } from "react";
// // // import { useSearchParams } from "next/navigation";
// // // import Link from "next/link";

// // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // type PatientRow = {
// // //   patient_id: number;
// // //   name: string;
// // //   email: string;
// // //   mrn: string;
// // //   procedure?: string | null;
// // //   surgery_date?: string | null;
// // //   discharge_date?: string | null;
// // //   created_at?: string | null;
// // //   status: string;
// // // };

// // // type AssignmentRow = {
// // //   id: number;
// // //   patient_id: number;
// // //   template_id: number;
// // //   template_name: string;
// // //   template_type: string;
// // //   start_date: string;
// // //   end_date: string;
// // //   frequency: string;
// // //   is_active: boolean;
// // //   created_at: string;
// // // };

// // // type TemplateRow = {
// // //   id: number;
// // //   name: string;
// // //   type: string;
// // //   status: string;
// // //   question_count: number;
// // //   complete_questions: number;
// // // };

// // // function Pill({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
// // //       {children}
// // //     </span>
// // //   );
// // // }

// // // function fmtDate(d?: string | null) {
// // //   return d || "-";
// // // }

// // // function isoToday() {
// // //   const d = new Date();
// // //   const yyyy = d.getFullYear();
// // //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// // //   const dd = String(d.getDate()).padStart(2, "0");
// // //   return `${yyyy}-${mm}-${dd}`;
// // // }

// // // export default function PatientDetailClient({
// // //   patientId,
// // // }: {
// // //   patientId: string;
// // // }) {
// // //   const searchParams = useSearchParams();
// // //   const initialTab = searchParams.get("tab");

// // //   const pid = Number(patientId);

// // //   const [accessToken, setAccessToken] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     setAccessToken(localStorage.getItem("access_token"));
// // //   }, []);

// // //   const [patient, setPatient] = useState<PatientRow | null>(null);
// // //   const [patientLoading, setPatientLoading] = useState(false);
// // //   const [patientError, setPatientError] = useState<string | null>(null);

// // //   const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
// // //   const [assignLoading, setAssignLoading] = useState(false);
// // //   const [assignError, setAssignError] = useState<string | null>(null);

// // //   const [templates, setTemplates] = useState<TemplateRow[]>([]);
// // //   const [tmplLoading, setTmplLoading] = useState(false);
// // //   const [tmplError, setTmplError] = useState<string | null>(null);

// // //   const [showAssign, setShowAssign] = useState(initialTab === "assign");
// // //   const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
// // //   const [startDate, setStartDate] = useState<string>(isoToday());
// // //   const [durationDays, setDurationDays] = useState<number>(30);
// // //   const frequency = "DAILY";

// // //   const endDate = useMemo(() => {
// // //     const dt = new Date(startDate);
// // //     dt.setDate(dt.getDate() + (durationDays - 1));
// // //     const yyyy = dt.getFullYear();
// // //     const mm = String(dt.getMonth() + 1).padStart(2, "0");
// // //     const dd = String(dt.getDate()).padStart(2, "0");
// // //     return `${yyyy}-${mm}-${dd}`;
// // //   }, [startDate, durationDays]);

// // //   async function apiFetch(url: string, init?: RequestInit) {
// // //     const res = await fetch(url, {
// // //       ...init,
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
// // //         ...(init?.headers || {}),
// // //       },
// // //       cache: "no-store",
// // //     });

// // //     const data = await res.json().catch(() => ({}));
// // //     if (!res.ok)
// // //       throw new Error(data.detail || data.message || "Request failed");
// // //     return data;
// // //   }

// // //   async function loadPatient() {
// // //     setPatientLoading(true);
// // //     setPatientError(null);
// // //     try {
// // //       // ✅ trailing slash avoids FastAPI 307
// // //       const data = await apiFetch(`${API_BASE}/patients/?skip=0&limit=200`);
// // //       const found = (data.items ?? []).find(
// // //         (x: PatientRow) => x.patient_id === pid
// // //       );
// // //       if (!found) throw new Error("Patient not found");
// // //       setPatient(found);
// // //     } catch (e: any) {
// // //       setPatientError(e.message || "Failed to load patient");
// // //     } finally {
// // //       setPatientLoading(false);
// // //     }
// // //   }

// // //   async function loadAssignments() {
// // //     setAssignLoading(true);
// // //     setAssignError(null);
// // //     try {
// // //       const data = await apiFetch(`${API_BASE}/assignments/patient/${pid}`);
// // //       setAssignments(data.items ?? []);
// // //     } catch (e: any) {
// // //       setAssignError(e.message || "Failed to load assignments");
// // //     } finally {
// // //       setAssignLoading(false);
// // //     }
// // //   }

// // //   async function loadTemplates() {
// // //     setTmplLoading(true);
// // //     setTmplError(null);
// // //     try {
// // //       const url = new URL(`${API_BASE}/questionnaire-templates/`);
// // //       url.searchParams.set("skip", "0");
// // //       url.searchParams.set("limit", "200");
// // //       url.searchParams.set("status", "ACTIVE");

// // //       const data = await apiFetch(url.toString());
// // //       setTemplates(data.items ?? []);
// // //     } catch (e: any) {
// // //       setTmplError(e.message || "Failed to load templates");
// // //     } finally {
// // //       setTmplLoading(false);
// // //     }
// // //   }

// // //   async function createAssignment() {
// // //     if (!selectedTemplateId) {
// // //       alert("Please select a template.");
// // //       return;
// // //     }
// // //     try {
// // //       await apiFetch(`${API_BASE}/assignments/`, {
// // //         method: "POST",
// // //         body: JSON.stringify({
// // //           patient_id: pid,
// // //           template_id: Number(selectedTemplateId),
// // //           start_date: startDate,
// // //           end_date: endDate,
// // //           frequency,
// // //         }),
// // //       });

// // //       setShowAssign(false);
// // //       setSelectedTemplateId("");
// // //       await loadAssignments();
// // //       alert("Assigned successfully.");
// // //     } catch (e: any) {
// // //       alert(e.message || "Failed to assign template");
// // //     }
// // //   }

// // //   async function deactivateAssignment(assignmentId: number) {
// // //     if (!confirm("Deactivate this assignment?")) return;
// // //     try {
// // //       await apiFetch(`${API_BASE}/assignments/${assignmentId}/deactivate`, {
// // //         method: "POST",
// // //       });
// // //       await loadAssignments();
// // //     } catch (e: any) {
// // //       alert(e.message || "Failed to deactivate");
// // //     }
// // //   }

// // //   // ✅ URL validation
// // //   if (Number.isNaN(pid)) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 p-8">
// // //         <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
// // //           <h1 className="text-xl font-bold text-gray-900">
// // //             Invalid Patient URL
// // //           </h1>
// // //           <p className="mt-2 text-sm text-gray-700">
// // //             Got:{" "}
// // //             <code className="rounded bg-gray-100 px-2 py-1">{patientId}</code>
// // //           </p>
// // //           <div className="mt-4">
// // //             <Link
// // //               href="/admin/patients"
// // //               className="text-sm font-semibold text-blue-700 hover:text-blue-800"
// // //             >
// // //               ← Back to Patients
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   useEffect(() => {
// // //     if (!accessToken) return;
// // //     loadPatient();
// // //     loadAssignments();
// // //     loadTemplates();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [accessToken, pid]);

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <div className="mx-auto max-w-6xl px-4 py-8">
// // //         <div className="mb-6 flex items-center justify-between">
// // //           <Link
// // //             href="/admin/patients"
// // //             className="text-sm font-semibold text-gray-700 hover:text-gray-900"
// // //           >
// // //             ← Back to Patients
// // //           </Link>

// // //           <button
// // //             onClick={() => setShowAssign(true)}
// // //             className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// // //           >
// // //             Assign Daily Assessment
// // //           </button>
// // //         </div>

// // //         {/* Patient header */}
// // //         <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
// // //           {patientLoading ? (
// // //             <div className="text-gray-600">Loading patient...</div>
// // //           ) : patientError ? (
// // //             <div className="text-red-600">{patientError}</div>
// // //           ) : patient ? (
// // //             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
// // //               <div>
// // //                 <div className="text-xl font-bold text-gray-900">
// // //                   {patient.name}
// // //                 </div>
// // //                 <div className="mt-1 text-sm text-gray-600">
// // //                   {patient.email}
// // //                 </div>

// // //                 <div className="mt-4 flex flex-wrap gap-2">
// // //                   <Pill>MRN: {patient.mrn}</Pill>
// // //                   <Pill>Procedure: {patient.procedure ?? "-"}</Pill>
// // //                   <Pill>Surgery: {fmtDate(patient.surgery_date)}</Pill>
// // //                   <Pill>Discharge: {fmtDate(patient.discharge_date)}</Pill>
// // //                   <Pill>Status: {patient.status}</Pill>
// // //                 </div>
// // //               </div>

// // //               <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
// // //                 <div className="font-semibold text-gray-900">Virtual Ward</div>
// // //                 <div className="mt-1">
// // //                   Active protocols:{" "}
// // //                   {assignments.filter((a) => a.is_active).length}
// // //                 </div>
// // //                 <div className="mt-1">
// // //                   Total assignments: {assignments.length}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ) : null}
// // //         </div>

// // //         {/* Assignments */}
// // //         <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
// // //           <div className="flex items-center justify-between border-b border-gray-100 p-5">
// // //             <div>
// // //               <div className="text-lg font-bold text-gray-900">
// // //                 Assigned Assessment Protocols
// // //               </div>
// // //               <div className="text-sm text-gray-600">
// // //                 Monitoring plan prescriptions for this patient
// // //               </div>
// // //             </div>
// // //             <button
// // //               onClick={loadAssignments}
// // //               className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
// // //             >
// // //               Refresh
// // //             </button>
// // //           </div>

// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full text-left text-sm">
// // //               <thead className="text-xs font-semibold text-gray-600">
// // //                 <tr className="border-b border-gray-100">
// // //                   <th className="px-5 py-4">Protocol</th>
// // //                   <th className="px-5 py-4">Date Range</th>
// // //                   <th className="px-5 py-4">Frequency</th>
// // //                   <th className="px-5 py-4">Status</th>
// // //                   <th className="px-5 py-4 text-right">Actions</th>
// // //                 </tr>
// // //               </thead>

// // //               <tbody className="divide-y divide-gray-100">
// // //                 {assignLoading ? (
// // //                   <tr>
// // //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// // //                       Loading assignments...
// // //                     </td>
// // //                   </tr>
// // //                 ) : assignError ? (
// // //                   <tr>
// // //                     <td colSpan={5} className="px-5 py-8 text-red-600">
// // //                       {assignError}
// // //                     </td>
// // //                   </tr>
// // //                 ) : assignments.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// // //                       No protocols assigned yet.
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   assignments.map((a) => (
// // //                     <tr key={a.id} className="hover:bg-gray-50/50">
// // //                       <td className="px-5 py-4">
// // //                         <div className="font-semibold text-gray-900">
// // //                           {a.template_name}
// // //                         </div>
// // //                         <div className="text-xs text-gray-500">
// // //                           {a.template_type}
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-5 py-4 text-gray-700">
// // //                         {a.start_date} → {a.end_date}
// // //                       </td>
// // //                       <td className="px-5 py-4 text-gray-700">{a.frequency}</td>
// // //                       <td className="px-5 py-4">
// // //                         <span
// // //                           className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
// // //                             a.is_active
// // //                               ? "bg-green-50 text-green-700 ring-1 ring-green-200"
// // //                               : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
// // //                           }`}
// // //                         >
// // //                           {a.is_active ? "Active" : "Inactive"}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-5 py-4">
// // //                         <div className="flex items-center justify-end gap-3">
// // //                           {a.is_active ? (
// // //                             <button
// // //                               onClick={() => deactivateAssignment(a.id)}
// // //                               className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
// // //                             >
// // //                               Deactivate
// // //                             </button>
// // //                           ) : (
// // //                             <span className="text-xs text-gray-500">—</span>
// // //                           )}
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
// // //             Showing {assignments.length} assignments
// // //           </div>
// // //         </div>

// // //         {/* Assign modal */}
// // //         {showAssign && (
// // //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
// // //             <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
// // //               <div className="flex items-center justify-between border-b border-gray-100 p-5">
// // //                 <div>
// // //                   <div className="text-lg font-bold text-gray-900">
// // //                     Assign Daily Assessment
// // //                   </div>
// // //                   <div className="text-sm text-gray-600">
// // //                     Select a template and duration
// // //                   </div>
// // //                 </div>
// // //                 <button
// // //                   onClick={() => setShowAssign(false)}
// // //                   className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
// // //                   title="Close"
// // //                 >
// // //                   ✕
// // //                 </button>
// // //               </div>

// // //               <div className="p-5">
// // //                 <div className="mb-4">
// // //                   <label className="mb-1 block text-sm font-semibold text-gray-800">
// // //                     Assessment Protocol (Template)
// // //                   </label>
// // //                   {tmplLoading ? (
// // //                     <div className="text-sm text-gray-600">
// // //                       Loading templates...
// // //                     </div>
// // //                   ) : tmplError ? (
// // //                     <div className="text-sm text-red-600">{tmplError}</div>
// // //                   ) : (
// // //                     <select
// // //                       value={selectedTemplateId}
// // //                       onChange={(e) =>
// // //                         setSelectedTemplateId(
// // //                           e.target.value ? Number(e.target.value) : ""
// // //                         )
// // //                       }
// // //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// // //                     >
// // //                       <option value="">Select a template...</option>
// // //                       {templates.map((t) => (
// // //                         <option key={t.id} value={t.id}>
// // //                           {t.name} ({t.type}) — {t.complete_questions}/
// // //                           {t.question_count} complete
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                   )}
// // //                 </div>

// // //                 <div className="grid gap-4 md:grid-cols-3">
// // //                   <div>
// // //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// // //                       Start Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={startDate}
// // //                       onChange={(e) => setStartDate(e.target.value)}
// // //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// // //                       Duration
// // //                     </label>
// // //                     <select
// // //                       value={durationDays}
// // //                       onChange={(e) => setDurationDays(Number(e.target.value))}
// // //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// // //                     >
// // //                       <option value={7}>7 days</option>
// // //                       <option value={14}>14 days</option>
// // //                       <option value={30}>30 days</option>
// // //                     </select>
// // //                   </div>

// // //                   <div>
// // //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// // //                       End Date
// // //                     </label>
// // //                     <input
// // //                       type="date"
// // //                       value={endDate}
// // //                       readOnly
// // //                       className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-6 flex items-center justify-end gap-3">
// // //                   <button
// // //                     onClick={() => setShowAssign(false)}
// // //                     className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
// // //                   >
// // //                     Cancel
// // //                   </button>
// // //                   <button
// // //                     onClick={createAssignment}
// // //                     className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// // //                   >
// // //                     Assign
// // //                   </button>
// // //                 </div>

// // //                 <div className="mt-4 text-xs text-gray-500">
// // //                   Frequency is fixed to{" "}
// // //                   <span className="font-semibold">Daily</span> for MVP.
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useSearchParams } from "next/navigation";
// // import Link from "next/link";

// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // type PatientRow = {
// //   patient_id: number;
// //   name: string;
// //   email: string;
// //   mrn: string;
// //   procedure?: string | null;
// //   surgery_date?: string | null;
// //   discharge_date?: string | null;
// //   created_at?: string | null;
// //   status: string;
// // };

// // type AssignmentRow = {
// //   id: number;
// //   patient_id: number;
// //   template_id: number; // backend uses template_id field name
// //   template_name: string;
// //   template_type: string;
// //   start_date: string;
// //   end_date: string;
// //   frequency: string;
// //   is_active: boolean;
// //   created_at: string;
// // };

// // // ✅ This now matches backend /flows/ list response (FlowOut)
// // type FlowRow = {
// //   id: number;
// //   name: string;
// //   description?: string | null;
// //   flow_type: string;
// //   status: string;
// //   start_node_key: string;
// //   version: number;
// //   node_count: number;
// //   created_at: string;
// //   created_by: {
// //     id: number;
// //     name: string;
// //     email: string;
// //   };
// // };

// // function Pill({ children }: { children: React.ReactNode }) {
// //   return (
// //     <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
// //       {children}
// //     </span>
// //   );
// // }

// // function fmtDate(d?: string | null) {
// //   return d || "-";
// // }

// // function isoToday() {
// //   const d = new Date();
// //   const yyyy = d.getFullYear();
// //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// //   const dd = String(d.getDate()).padStart(2, "0");
// //   return `${yyyy}-${mm}-${dd}`;
// // }

// // export default function PatientDetailClient({
// //   patientId,
// // }: {
// //   patientId: string;
// // }) {
// //   const searchParams = useSearchParams();
// //   const initialTab = searchParams.get("tab");

// //   const pid = Number(patientId);

// //   const [accessToken, setAccessToken] = useState<string | null>(null);

// //   useEffect(() => {
// //     setAccessToken(localStorage.getItem("access_token"));
// //   }, []);

// //   const [patient, setPatient] = useState<PatientRow | null>(null);
// //   const [patientLoading, setPatientLoading] = useState(false);
// //   const [patientError, setPatientError] = useState<string | null>(null);

// //   const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
// //   const [assignLoading, setAssignLoading] = useState(false);
// //   const [assignError, setAssignError] = useState<string | null>(null);

// //   // ✅ flows
// //   const [flows, setFlows] = useState<FlowRow[]>([]);
// //   const [flowsLoading, setFlowsLoading] = useState(false);
// //   const [flowsError, setFlowsError] = useState<string | null>(null);

// //   const [showAssign, setShowAssign] = useState(initialTab === "assign");
// //   const [selectedFlowId, setSelectedFlowId] = useState<number | "">("");

// //   const [startDate, setStartDate] = useState<string>(isoToday());
// //   const [durationDays, setDurationDays] = useState<number>(30);
// //   const frequency = "DAILY";

// //   const endDate = useMemo(() => {
// //     const dt = new Date(startDate);
// //     dt.setDate(dt.getDate() + (durationDays - 1));
// //     const yyyy = dt.getFullYear();
// //     const mm = String(dt.getMonth() + 1).padStart(2, "0");
// //     const dd = String(dt.getDate()).padStart(2, "0");
// //     return `${yyyy}-${mm}-${dd}`;
// //   }, [startDate, durationDays]);

// //   async function apiFetch(url: string, init?: RequestInit) {
// //     const res = await fetch(url, {
// //       ...init,
// //       headers: {
// //         "Content-Type": "application/json",
// //         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
// //         ...(init?.headers || {}),
// //       },
// //       cache: "no-store",
// //     });

// //     const data = await res.json().catch(() => ({}));
// //     if (!res.ok) {
// //       // FastAPI can return detail as string OR object
// //       const msg =
// //         typeof data?.detail === "string"
// //           ? data.detail
// //           : data?.detail?.errors
// //             ? JSON.stringify(data.detail)
// //             : data?.message || "Request failed";
// //       throw new Error(msg);
// //     }
// //     return data;
// //   }

// //   async function loadPatient() {
// //     setPatientLoading(true);
// //     setPatientError(null);
// //     try {
// //       // ✅ trailing slash avoids FastAPI 307
// //       const data = await apiFetch(`${API_BASE}/patients/?skip=0&limit=200`);
// //       const found = (data.items ?? []).find(
// //         (x: PatientRow) => x.patient_id === pid,
// //       );
// //       if (!found) throw new Error("Patient not found");
// //       setPatient(found);
// //     } catch (e: any) {
// //       setPatientError(e.message || "Failed to load patient");
// //     } finally {
// //       setPatientLoading(false);
// //     }
// //   }

// //   async function loadAssignments() {
// //     setAssignLoading(true);
// //     setAssignError(null);
// //     try {
// //       const data = await apiFetch(`${API_BASE}/assignments/patient/${pid}`);
// //       setAssignments(data.items ?? []);
// //     } catch (e: any) {
// //       setAssignError(e.message || "Failed to load assignments");
// //     } finally {
// //       setAssignLoading(false);
// //     }
// //   }

// //   // ✅ THIS IS THE IMPORTANT FIX:
// //   // load "new questionnaires" from /flows/ instead of /questionnaire-templates/
// //   async function loadFlows() {
// //     setFlowsLoading(true);
// //     setFlowsError(null);
// //     try {
// //       const url = new URL(`${API_BASE}/flows/`);
// //       url.searchParams.set("skip", "0");
// //       url.searchParams.set("limit", "200");
// //       url.searchParams.set("status", "ACTIVE");

// //       const data = await apiFetch(url.toString());
// //       setFlows(data.items ?? []);
// //     } catch (e: any) {
// //       setFlowsError(e.message || "Failed to load questionnaires");
// //     } finally {
// //       setFlowsLoading(false);
// //     }
// //   }

// //   async function createAssignment() {
// //     if (!selectedFlowId) {
// //       alert("Please select a questionnaire.");
// //       return;
// //     }
// //     try {
// //       await apiFetch(`${API_BASE}/assignments/`, {
// //         method: "POST",
// //         body: JSON.stringify({
// //           patient_id: pid,
// //           template_id: Number(selectedFlowId), // ✅ backend field name stays template_id
// //           start_date: startDate,
// //           end_date: endDate,
// //           frequency,
// //         }),
// //       });

// //       setShowAssign(false);
// //       setSelectedFlowId("");
// //       await loadAssignments();
// //       alert("Assigned successfully.");
// //     } catch (e: any) {
// //       alert(e.message || "Failed to assign questionnaire");
// //     }
// //   }

// //   async function deactivateAssignment(assignmentId: number) {
// //     if (!confirm("Deactivate this assignment?")) return;
// //     try {
// //       await apiFetch(`${API_BASE}/assignments/${assignmentId}/deactivate`, {
// //         method: "POST",
// //       });
// //       await loadAssignments();
// //     } catch (e: any) {
// //       alert(e.message || "Failed to deactivate");
// //     }
// //   }

// //   // ✅ URL validation
// //   if (Number.isNaN(pid)) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 p-8">
// //         <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
// //           <h1 className="text-xl font-bold text-gray-900">
// //             Invalid Patient URL
// //           </h1>
// //           <p className="mt-2 text-sm text-gray-700">
// //             Got:{" "}
// //             <code className="rounded bg-gray-100 px-2 py-1">{patientId}</code>
// //           </p>
// //           <div className="mt-4">
// //             <Link
// //               href="/admin/patients"
// //               className="text-sm font-semibold text-blue-700 hover:text-blue-800"
// //             >
// //               ← Back to Patients
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   useEffect(() => {
// //     if (!accessToken) return;
// //     loadPatient();
// //     loadAssignments();
// //     loadFlows(); // ✅ important
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [accessToken, pid]);

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="mx-auto max-w-6xl px-4 py-8">
// //         <div className="mb-6 flex items-center justify-between">
// //           <Link
// //             href="/admin/patients"
// //             className="text-sm font-semibold text-gray-700 hover:text-gray-900"
// //           >
// //             ← Back to Patients
// //           </Link>

// //           <button
// //             onClick={() => setShowAssign(true)}
// //             className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// //           >
// //             Assign Daily Assessment
// //           </button>
// //         </div>

// //         {/* Patient header */}
// //         <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
// //           {patientLoading ? (
// //             <div className="text-gray-600">Loading patient...</div>
// //           ) : patientError ? (
// //             <div className="text-red-600">{patientError}</div>
// //           ) : patient ? (
// //             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
// //               <div>
// //                 <div className="text-xl font-bold text-gray-900">
// //                   {patient.name}
// //                 </div>
// //                 <div className="mt-1 text-sm text-gray-600">
// //                   {patient.email}
// //                 </div>

// //                 <div className="mt-4 flex flex-wrap gap-2">
// //                   <Pill>MRN: {patient.mrn}</Pill>
// //                   <Pill>Procedure: {patient.procedure ?? "-"}</Pill>
// //                   <Pill>Surgery: {fmtDate(patient.surgery_date)}</Pill>
// //                   <Pill>Discharge: {fmtDate(patient.discharge_date)}</Pill>
// //                   <Pill>Status: {patient.status}</Pill>
// //                 </div>
// //               </div>

// //               <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
// //                 <div className="font-semibold text-gray-900">Virtual Ward</div>
// //                 <div className="mt-1">
// //                   Active protocols:{" "}
// //                   {assignments.filter((a) => a.is_active).length}
// //                 </div>
// //                 <div className="mt-1">
// //                   Total assignments: {assignments.length}
// //                 </div>
// //               </div>
// //             </div>
// //           ) : null}
// //         </div>

// //         {/* Assignments */}
// //         <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
// //           <div className="flex items-center justify-between border-b border-gray-100 p-5">
// //             <div>
// //               <div className="text-lg font-bold text-gray-900">
// //                 Assigned Assessment Protocols
// //               </div>
// //               <div className="text-sm text-gray-600">
// //                 Monitoring plan prescriptions for this patient
// //               </div>
// //             </div>
// //             <button
// //               onClick={loadAssignments}
// //               className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
// //             >
// //               Refresh
// //             </button>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="min-w-full text-left text-sm">
// //               <thead className="text-xs font-semibold text-gray-600">
// //                 <tr className="border-b border-gray-100">
// //                   <th className="px-5 py-4">Protocol</th>
// //                   <th className="px-5 py-4">Date Range</th>
// //                   <th className="px-5 py-4">Frequency</th>
// //                   <th className="px-5 py-4">Status</th>
// //                   <th className="px-5 py-4 text-right">Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody className="divide-y divide-gray-100">
// //                 {assignLoading ? (
// //                   <tr>
// //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// //                       Loading assignments...
// //                     </td>
// //                   </tr>
// //                 ) : assignError ? (
// //                   <tr>
// //                     <td colSpan={5} className="px-5 py-8 text-red-600">
// //                       {assignError}
// //                     </td>
// //                   </tr>
// //                 ) : assignments.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={5} className="px-5 py-8 text-gray-600">
// //                       No protocols assigned yet.
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   assignments.map((a) => (
// //                     <tr key={a.id} className="hover:bg-gray-50/50">
// //                       <td className="px-5 py-4">
// //                         <div className="font-semibold text-gray-900">
// //                           {a.template_name}
// //                         </div>
// //                         <div className="text-xs text-gray-500">
// //                           {a.template_type}
// //                         </div>
// //                       </td>
// //                       <td className="px-5 py-4 text-gray-700">
// //                         {a.start_date} → {a.end_date}
// //                       </td>
// //                       <td className="px-5 py-4 text-gray-700">{a.frequency}</td>
// //                       <td className="px-5 py-4">
// //                         <span
// //                           className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
// //                             a.is_active
// //                               ? "bg-green-50 text-green-700 ring-1 ring-green-200"
// //                               : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
// //                           }`}
// //                         >
// //                           {a.is_active ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>
// //                       <td className="px-5 py-4">
// //                         <div className="flex items-center justify-end gap-3">
// //                           {a.is_active ? (
// //                             <button
// //                               onClick={() => deactivateAssignment(a.id)}
// //                               className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
// //                             >
// //                               Deactivate
// //                             </button>
// //                           ) : (
// //                             <span className="text-xs text-gray-500">—</span>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
// //             Showing {assignments.length} assignments
// //           </div>
// //         </div>

// //         {/* Assign modal */}
// //         {showAssign && (
// //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
// //             <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
// //               <div className="flex items-center justify-between border-b border-gray-100 p-5">
// //                 <div>
// //                   <div className="text-lg font-bold text-gray-900">
// //                     Assign Daily Assessment
// //                   </div>
// //                   <div className="text-sm text-gray-600">
// //                     Select a questionnaire and duration
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowAssign(false)}
// //                   className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
// //                   title="Close"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>

// //               <div className="p-5">
// //                 <div className="mb-4">
// //                   <label className="mb-1 block text-sm font-semibold text-gray-800">
// //                     Questionnaire (Flow)
// //                   </label>

// //                   {flowsLoading ? (
// //                     <div className="text-sm text-gray-600">
// //                       Loading questionnaires...
// //                     </div>
// //                   ) : flowsError ? (
// //                     <div className="text-sm text-red-600">{flowsError}</div>
// //                   ) : (
// //                     <select
// //                       value={selectedFlowId}
// //                       onChange={(e) =>
// //                         setSelectedFlowId(
// //                           e.target.value ? Number(e.target.value) : "",
// //                         )
// //                       }
// //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// //                     >
// //                       <option value="">Select a questionnaire...</option>
// //                       {flows.map((f) => (
// //                         <option key={f.id} value={f.id}>
// //                           {f.name} ({f.flow_type}) — v{f.version} •{" "}
// //                           {f.node_count} nodes
// //                         </option>
// //                       ))}
// //                     </select>
// //                   )}
// //                 </div>

// //                 <div className="grid gap-4 md:grid-cols-3">
// //                   <div>
// //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// //                       Start Date
// //                     </label>
// //                     <input
// //                       type="date"
// //                       value={startDate}
// //                       onChange={(e) => setStartDate(e.target.value)}
// //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// //                       Duration
// //                     </label>
// //                     <select
// //                       value={durationDays}
// //                       onChange={(e) => setDurationDays(Number(e.target.value))}
// //                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
// //                     >
// //                       <option value={7}>7 days</option>
// //                       <option value={14}>14 days</option>
// //                       <option value={30}>30 days</option>
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-sm font-semibold text-gray-800">
// //                       End Date
// //                     </label>
// //                     <input
// //                       type="date"
// //                       value={endDate}
// //                       readOnly
// //                       className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="mt-6 flex items-center justify-end gap-3">
// //                   <button
// //                     onClick={() => setShowAssign(false)}
// //                     className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={createAssignment}
// //                     className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
// //                   >
// //                     Assign
// //                   </button>
// //                 </div>

// //                 <div className="mt-4 text-xs text-gray-500">
// //                   Frequency is fixed to{" "}
// //                   <span className="font-semibold">Daily</span> for MVP.
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// type PatientRow = {
//   patient_id: number;
//   name: string;
//   email: string;
//   mrn: string;
//   procedure?: string | null;
//   surgery_date?: string | null;
//   discharge_date?: string | null;
//   created_at?: string | null;
//   status: string;
// };

// // ✅ matches backend /assignments/patient/{id}
// type AssignmentRow = {
//   id: number;
//   patient_id: number;
//   flow_id: number;
//   flow_name: string;
//   flow_type: string;
//   start_date: string;
//   end_date: string;
//   frequency: string;
//   is_active: boolean;
//   created_at: string;
// };

// // ✅ matches backend /flows/ list response
// type FlowRow = {
//   id: number;
//   name: string;
//   description?: string | null;
//   flow_type: string;
//   status: string;
//   start_node_key: string;
//   version: number;
//   node_count: number;
//   created_at: string;
//   created_by: {
//     id: number;
//     name: string;
//     email: string;
//   };
// };

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
//       {children}
//     </span>
//   );
// }

// function fmtDate(d?: string | null) {
//   return d || "-";
// }

// function isoToday() {
//   const d = new Date();
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// export default function PatientDetailClient({
//   patientId,
// }: {
//   patientId: string;
// }) {
//   const searchParams = useSearchParams();
//   const initialTab = searchParams.get("tab");

//   const pid = Number(patientId);

//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   useEffect(() => {
//     setAccessToken(localStorage.getItem("access_token"));
//   }, []);

//   const [patient, setPatient] = useState<PatientRow | null>(null);
//   const [patientLoading, setPatientLoading] = useState(false);
//   const [patientError, setPatientError] = useState<string | null>(null);

//   const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
//   const [assignLoading, setAssignLoading] = useState(false);
//   const [assignError, setAssignError] = useState<string | null>(null);

//   const [flows, setFlows] = useState<FlowRow[]>([]);
//   const [flowsLoading, setFlowsLoading] = useState(false);
//   const [flowsError, setFlowsError] = useState<string | null>(null);

//   const [showAssign, setShowAssign] = useState(initialTab === "assign");
//   const [selectedFlowId, setSelectedFlowId] = useState<number | "">("");

//   const [startDate, setStartDate] = useState<string>(isoToday());
//   const [durationDays, setDurationDays] = useState<number>(30);
//   const frequency = "DAILY";

//   const endDate = useMemo(() => {
//     const dt = new Date(startDate);
//     dt.setDate(dt.getDate() + (durationDays - 1));
//     const yyyy = dt.getFullYear();
//     const mm = String(dt.getMonth() + 1).padStart(2, "0");
//     const dd = String(dt.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   }, [startDate, durationDays]);

//   async function apiFetch(url: string, init?: RequestInit) {
//     const res = await fetch(url, {
//       ...init,
//       headers: {
//         "Content-Type": "application/json",
//         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//         ...(init?.headers || {}),
//       },
//       cache: "no-store",
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) {
//       const msg =
//         typeof data?.detail === "string"
//           ? data.detail
//           : data?.detail?.errors
//             ? JSON.stringify(data.detail)
//             : data?.message || "Request failed";
//       throw new Error(msg);
//     }
//     return data;
//   }

//   async function loadPatient() {
//     setPatientLoading(true);
//     setPatientError(null);
//     try {
//       const data = await apiFetch(`${API_BASE}/patients/?skip=0&limit=200`);
//       const found = (data.items ?? []).find(
//         (x: PatientRow) => x.patient_id === pid,
//       );
//       if (!found) throw new Error("Patient not found");
//       setPatient(found);
//     } catch (e: any) {
//       setPatientError(e.message || "Failed to load patient");
//     } finally {
//       setPatientLoading(false);
//     }
//   }

//   async function loadAssignments() {
//     setAssignLoading(true);
//     setAssignError(null);
//     try {
//       const data = await apiFetch(
//         `${API_BASE}/assignments/patient/${pid}?active_only=false&skip=0&limit=200`,
//       );
//       setAssignments(data.items ?? []);
//     } catch (e: any) {
//       setAssignError(e.message || "Failed to load assignments");
//     } finally {
//       setAssignLoading(false);
//     }
//   }

//   async function loadFlows() {
//     setFlowsLoading(true);
//     setFlowsError(null);
//     try {
//       const url = new URL(`${API_BASE}/flows/`);
//       url.searchParams.set("skip", "0");
//       url.searchParams.set("limit", "200");
//       url.searchParams.set("status", "ACTIVE");
//       const data = await apiFetch(url.toString());
//       setFlows(data.items ?? []);
//     } catch (e: any) {
//       setFlowsError(e.message || "Failed to load flows");
//     } finally {
//       setFlowsLoading(false);
//     }
//   }

//   async function createAssignment() {
//     if (!selectedFlowId) {
//       alert("Please select a flow.");
//       return;
//     }
//     try {
//       await apiFetch(`${API_BASE}/assignments/`, {
//         method: "POST",
//         body: JSON.stringify({
//           patient_id: pid,
//           flow_id: Number(selectedFlowId), // ✅ FLOW FIELD
//           start_date: startDate,
//           end_date: endDate,
//           frequency,
//         }),
//       });

//       setShowAssign(false);
//       setSelectedFlowId("");
//       await loadAssignments();
//       alert("Assigned successfully.");
//     } catch (e: any) {
//       alert(e.message || "Failed to assign");
//     }
//   }

//   async function deactivateAssignment(assignmentId: number) {
//     if (!confirm("Deactivate this assignment?")) return;
//     try {
//       await apiFetch(`${API_BASE}/assignments/${assignmentId}/deactivate`, {
//         method: "POST",
//       });
//       await loadAssignments();
//     } catch (e: any) {
//       alert(e.message || "Failed to deactivate");
//     }
//   }

//   if (Number.isNaN(pid)) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-8">
//         <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
//           <h1 className="text-xl font-bold text-gray-900">
//             Invalid Patient URL
//           </h1>
//           <p className="mt-2 text-sm text-gray-700">
//             Got:{" "}
//             <code className="rounded bg-gray-100 px-2 py-1">{patientId}</code>
//           </p>
//           <div className="mt-4">
//             <Link
//               href="/admin/patients"
//               className="text-sm font-semibold text-blue-700 hover:text-blue-800"
//             >
//               ← Back to Patients
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   useEffect(() => {
//     if (!accessToken) return;
//     loadPatient();
//     loadAssignments();
//     loadFlows();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken, pid]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-6xl px-4 py-8">
//         <div className="mb-6 flex items-center justify-between">
//           <Link
//             href="/admin/patients"
//             className="text-sm font-semibold text-gray-700 hover:text-gray-900"
//           >
//             ← Back to Patients
//           </Link>

//           <button
//             onClick={() => setShowAssign(true)}
//             className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//           >
//             Assign Daily Assessment
//           </button>
//         </div>

//         {/* Patient header */}
//         <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
//           {patientLoading ? (
//             <div className="text-gray-600">Loading patient...</div>
//           ) : patientError ? (
//             <div className="text-red-600">{patientError}</div>
//           ) : patient ? (
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div>
//                 <div className="text-xl font-bold text-gray-900">
//                   {patient.name}
//                 </div>
//                 <div className="mt-1 text-sm text-gray-600">
//                   {patient.email}
//                 </div>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <Pill>MRN: {patient.mrn}</Pill>
//                   <Pill>Procedure: {patient.procedure ?? "-"}</Pill>
//                   <Pill>Surgery: {fmtDate(patient.surgery_date)}</Pill>
//                   <Pill>Discharge: {fmtDate(patient.discharge_date)}</Pill>
//                   <Pill>Status: {patient.status}</Pill>
//                 </div>
//               </div>

//               <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-200">
//                 <div className="font-semibold text-gray-900">Virtual Ward</div>
//                 <div className="mt-1">
//                   Active protocols:{" "}
//                   {assignments.filter((a) => a.is_active).length}
//                 </div>
//                 <div className="mt-1">
//                   Total assignments: {assignments.length}
//                 </div>
//               </div>
//             </div>
//           ) : null}
//         </div>

//         {/* Assignments */}
//         <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
//           <div className="flex items-center justify-between border-b border-gray-100 p-5">
//             <div>
//               <div className="text-lg font-bold text-gray-900">
//                 Assigned Assessment Protocols
//               </div>
//               <div className="text-sm text-gray-600">
//                 Monitoring plan prescriptions for this patient
//               </div>
//             </div>
//             <button
//               onClick={loadAssignments}
//               className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//             >
//               Refresh
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm">
//               <thead className="text-xs font-semibold text-gray-600">
//                 <tr className="border-b border-gray-100">
//                   <th className="px-5 py-4">Protocol</th>
//                   <th className="px-5 py-4">Date Range</th>
//                   <th className="px-5 py-4">Frequency</th>
//                   <th className="px-5 py-4">Status</th>
//                   <th className="px-5 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {assignLoading ? (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-8 text-gray-600">
//                       Loading assignments...
//                     </td>
//                   </tr>
//                 ) : assignError ? (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-8 text-red-600">
//                       {assignError}
//                     </td>
//                   </tr>
//                 ) : assignments.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-8 text-gray-600">
//                       No protocols assigned yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   assignments.map((a) => (
//                     <tr key={a.id} className="hover:bg-gray-50/50">
//                       <td className="px-5 py-4">
//                         <div className="font-semibold text-gray-900">
//                           {a.flow_name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {a.flow_type}
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-gray-700">
//                         {a.start_date} → {a.end_date}
//                       </td>
//                       <td className="px-5 py-4 text-gray-700">{a.frequency}</td>
//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
//                             a.is_active
//                               ? "bg-green-50 text-green-700 ring-1 ring-green-200"
//                               : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
//                           }`}
//                         >
//                           {a.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center justify-end gap-3">
//                           {a.is_active ? (
//                             <button
//                               onClick={() => deactivateAssignment(a.id)}
//                               className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
//                             >
//                               Deactivate
//                             </button>
//                           ) : (
//                             <span className="text-xs text-gray-500">—</span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
//             Showing {assignments.length} assignments
//           </div>
//         </div>

//         {/* Assign modal */}
//         {showAssign && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
//             <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
//               <div className="flex items-center justify-between border-b border-gray-100 p-5">
//                 <div>
//                   <div className="text-lg font-bold text-gray-900">
//                     Assign Daily Assessment
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Select a flow and duration
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowAssign(false)}
//                   className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
//                   title="Close"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="p-5">
//                 <div className="mb-4">
//                   <label className="mb-1 block text-sm font-semibold text-gray-800">
//                     Flow
//                   </label>

//                   {flowsLoading ? (
//                     <div className="text-sm text-gray-600">
//                       Loading flows...
//                     </div>
//                   ) : flowsError ? (
//                     <div className="text-sm text-red-600">{flowsError}</div>
//                   ) : (
//                     <select
//                       value={selectedFlowId}
//                       onChange={(e) =>
//                         setSelectedFlowId(
//                           e.target.value ? Number(e.target.value) : "",
//                         )
//                       }
//                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
//                     >
//                       <option value="">Select a flow...</option>
//                       {flows.map((f) => (
//                         <option key={f.id} value={f.id}>
//                           {f.name} ({f.flow_type}) — v{f.version} •{" "}
//                           {f.node_count} nodes
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-3">
//                   <div>
//                     <label className="mb-1 block text-sm font-semibold text-gray-800">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-sm font-semibold text-gray-800">
//                       Duration
//                     </label>
//                     <select
//                       value={durationDays}
//                       onChange={(e) => setDurationDays(Number(e.target.value))}
//                       className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-400"
//                     >
//                       <option value={7}>7 days</option>
//                       <option value={14}>14 days</option>
//                       <option value={30}>30 days</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-sm font-semibold text-gray-800">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={endDate}
//                       readOnly
//                       className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-6 flex items-center justify-end gap-3">
//                   <button
//                     onClick={() => setShowAssign(false)}
//                     className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={createAssignment}
//                     className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//                   >
//                     Assign
//                   </button>
//                 </div>

//                 <div className="mt-4 text-xs text-gray-500">
//                   Frequency is fixed to{" "}
//                   <span className="font-semibold">Daily</span> for MVP.
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

type PatientRow = {
  patient_id: number;
  name: string;
  email: string;
  mrn: string;
  procedure?: string | null;
  surgery_date?: string | null;
  discharge_date?: string | null;
  created_at?: string | null;
  status: string;
};

// ✅ matches backend /assignments/patient/{id}
type AssignmentRow = {
  id: number;
  patient_id: number;
  flow_id: number;
  flow_name: string;
  flow_type: string;
  start_date: string;
  end_date: string;
  frequency: string;
  is_active: boolean;
  created_at: string;
};

// ✅ matches backend /flows/ list response
type FlowRow = {
  id: number;
  name: string;
  description?: string | null;
  flow_type: string;
  status: string;
  start_node_key: string;
  version: number;
  node_count: number;
  created_at: string;
  created_by: {
    id: number;
    name: string;
    email: string;
  };
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
      {children}
    </span>
  );
}

function fmtDate(d?: string | null) {
  return d || "-";
}

function isoToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function PatientDetailClient({
  patientId,
}: {
  patientId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pid = Number(patientId);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
  }, []);

  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);

  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const [flows, setFlows] = useState<FlowRow[]>([]);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [flowsError, setFlowsError] = useState<string | null>(null);

  const [showAssign, setShowAssign] = useState(initialTab === "assign");
  const [selectedFlowId, setSelectedFlowId] = useState<number | "">("");

  const [startDate, setStartDate] = useState<string>(isoToday());
  const [durationDays, setDurationDays] = useState<number>(30);
  const frequency = "DAILY";

  const endDate = useMemo(() => {
    const dt = new Date(startDate);
    dt.setDate(dt.getDate() + (durationDays - 1));
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [startDate, durationDays]);

  async function apiFetch(url: string, init?: RequestInit) {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        typeof data?.detail === "string"
          ? data.detail
          : data?.detail?.errors
            ? JSON.stringify(data.detail)
            : data?.message || "Request failed";
      throw new Error(msg);
    }
    return data;
  }

  async function loadPatient() {
    setPatientLoading(true);
    setPatientError(null);
    try {
      const data = await apiFetch(`${API_BASE}/patients/?skip=0&limit=200`);
      const found = (data.items ?? []).find(
        (x: PatientRow) => x.patient_id === pid,
      );
      if (!found) throw new Error("Patient not found");
      setPatient(found);
    } catch (e: any) {
      setPatientError(e.message || "Failed to load patient");
    } finally {
      setPatientLoading(false);
    }
  }

  async function loadAssignments() {
    setAssignLoading(true);
    setAssignError(null);
    try {
      const data = await apiFetch(
        `${API_BASE}/assignments/patient/${pid}?active_only=false&skip=0&limit=200`,
      );
      setAssignments(data.items ?? []);
    } catch (e: any) {
      setAssignError(e.message || "Failed to load assignments");
    } finally {
      setAssignLoading(false);
    }
  }

  async function loadFlows() {
    setFlowsLoading(true);
    setFlowsError(null);
    try {
      const url = new URL(`${API_BASE}/flows/`);
      url.searchParams.set("skip", "0");
      url.searchParams.set("limit", "200");
      url.searchParams.set("status", "ACTIVE");
      const data = await apiFetch(url.toString());
      setFlows(data.items ?? []);
    } catch (e: any) {
      setFlowsError(e.message || "Failed to load flows");
    } finally {
      setFlowsLoading(false);
    }
  }

  async function createAssignment() {
    if (!selectedFlowId) {
      alert("Please select a flow.");
      return;
    }
    try {
      await apiFetch(`${API_BASE}/assignments/`, {
        method: "POST",
        body: JSON.stringify({
          patient_id: pid,
          flow_id: Number(selectedFlowId), // ✅ FLOW FIELD
          start_date: startDate,
          end_date: endDate,
          frequency,
        }),
      });

      setShowAssign(false);
      setSelectedFlowId("");
      await loadAssignments();
      alert("Assigned successfully.");
    } catch (e: any) {
      alert(e.message || "Failed to assign");
    }
  }

  async function deactivateAssignment(assignmentId: number) {
    if (!confirm("Deactivate this assignment?")) return;
    try {
      await apiFetch(`${API_BASE}/assignments/${assignmentId}/deactivate`, {
        method: "POST",
      });
      await loadAssignments();
    } catch (e: any) {
      alert(e.message || "Failed to deactivate");
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

  if (Number.isNaN(pid)) {
    return (
      <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center p-8">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            Invalid Patient URL
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Got:{" "}
            <code className="rounded bg-gray-100 px-2 py-1">{patientId}</code>
          </p>
          <div className="mt-4">
            <Link
              href="/admin/patients"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              ← Back to Patients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!accessToken) return;
    loadPatient();
    loadAssignments();
    loadFlows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, pid]);

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
          {/* Breadcrumb & Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/admin/patients"
                className="text-gray-600 hover:text-teal-600 font-medium"
              >
                Patients
              </Link>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-900 font-semibold">
                {patient?.name || "Patient Detail"}
              </span>
            </div>

            <button
              onClick={() => setShowAssign(true)}
              className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Assign Daily Assessment
            </button>
          </div>

          {/* Patient Header Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {patientLoading ? (
              <div className="text-gray-600">Loading patient...</div>
            ) : patientError ? (
              <div className="text-red-600">{patientError}</div>
            ) : patient ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {patient.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Pill>MRN: {patient.mrn}</Pill>
                    <Pill>Procedure: {patient.procedure ?? "-"}</Pill>
                    <Pill>Surgery: {fmtDate(patient.surgery_date)}</Pill>
                    <Pill>Discharge: {fmtDate(patient.discharge_date)}</Pill>
                    <Pill>Status: {patient.status}</Pill>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 p-6 text-white min-w-[240px]">
                  <div className="text-sm font-medium opacity-90 mb-2">
                    Virtual Ward Status
                  </div>
                  <div className="text-3xl font-bold mb-4">
                    {assignments.filter((a) => a.is_active).length}
                  </div>
                  <div className="space-y-1 text-sm opacity-90">
                    <div>
                      Active protocols:{" "}
                      {assignments.filter((a) => a.is_active).length}
                    </div>
                    <div>Total assignments: {assignments.length}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Assigned Assessment Protocols
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Monitoring plan prescriptions for this patient
                </div>
              </div>
              <button
                onClick={loadAssignments}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 flex items-center gap-2"
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

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-4">Protocol</th>
                    <th className="px-5 py-4">Date Range</th>
                    <th className="px-5 py-4">Frequency</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {assignLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        Loading assignments...
                      </td>
                    </tr>
                  ) : assignError ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-red-600"
                      >
                        {assignError}
                      </td>
                    </tr>
                  ) : assignments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        No protocols assigned yet.
                      </td>
                    </tr>
                  ) : (
                    assignments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {a.flow_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {a.flow_type}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          <div className="text-sm">{a.start_date}</div>
                          <div className="text-xs text-gray-500">
                            to {a.end_date}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                            {a.frequency}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              a.is_active
                                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                                : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                            }`}
                          >
                            {a.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            {a.is_active ? (
                              <button
                                onClick={() => deactivateAssignment(a.id)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
              Showing {assignments.length} assignment
              {assignments.length !== 1 ? "s" : ""}
            </div>
          </div>
        </main>
      </div>

      {/* Assign modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Assign Daily Assessment
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Select a flow and duration
                </div>
              </div>
              <button
                onClick={() => setShowAssign(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                title="Close"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Flow
                </label>

                {flowsLoading ? (
                  <div className="text-sm text-gray-600">Loading flows...</div>
                ) : flowsError ? (
                  <div className="text-sm text-red-600">{flowsError}</div>
                ) : (
                  <select
                    value={selectedFlowId}
                    onChange={(e) =>
                      setSelectedFlowId(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">Select a flow...</option>
                    {flows.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.flow_type}) — v{f.version} • {f.node_count}{" "}
                        nodes
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Duration
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-teal-50 border border-teal-200 p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-teal-700">
                    Frequency is fixed to{" "}
                    <span className="font-semibold">Daily</span> for MVP. The
                    patient will receive this assessment every day during the
                    selected period.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAssign(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createAssignment}
                  className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Assign Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
