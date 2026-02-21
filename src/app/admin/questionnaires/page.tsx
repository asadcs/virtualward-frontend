// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useRouter } from "next/navigation";

// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // type FlowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

// // type FlowListItem = {
// //   id: number;
// //   name: string;
// //   description: string;
// //   flow_type: string;
// //   status: FlowStatus | string;
// //   node_count: number;
// //   version: number;
// // };

// // type FlowCreatePayload = {
// //   name: string;
// //   description: string;
// //   flow_type: string;
// //   status: FlowStatus;
// //   start_node_key: string;
// //   nodes?: any[];
// // };

// // // ------------------ API helpers ------------------
// // async function apiGet<T>(url: string, token: string): Promise<T> {
// //   const res = await fetch(url, {
// //     headers: { Authorization: `Bearer ${token}` },
// //     cache: "no-store",
// //   });
// //   const body = await res.json().catch(() => null);
// //   if (!res.ok)
// //     throw new Error(body?.detail || body?.message || "Request failed");
// //   return body as T;
// // }

// // async function apiPost<T>(url: string, token: string, body?: any): Promise<T> {
// //   const res = await fetch(url, {
// //     method: "POST",
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     },
// //     body: body ? JSON.stringify(body) : undefined,
// //   });

// //   const data = await res.json().catch(() => ({}));

// //   if (!res.ok) {
// //     // FastAPI may return detail as string OR object
// //     const detail = data?.detail;

// //     if (typeof detail === "string") throw new Error(detail);

// //     // your create_flow sends: detail: { errors: [...] }
// //     if (detail?.errors && Array.isArray(detail.errors)) {
// //       throw new Error(detail.errors.join(" | "));
// //     }

// //     throw new Error(data?.message || JSON.stringify(data) || "Request failed");
// //   }

// //   return data as T;
// // }

// // async function apiDelete<T>(url: string, token: string): Promise<T> {
// //   const res = await fetch(url, {
// //     method: "DELETE",
// //     headers: { Authorization: `Bearer ${token}` },
// //   });
// //   const data = await res.json().catch(() => ({}));
// //   if (!res.ok)
// //     throw new Error(data?.detail || data?.message || "Request failed");
// //   return data as T;
// // }

// // // ------------------ UI ------------------
// // export default function QuestionnaireManagementPage() {
// //   const router = useRouter();
// //   const token = useMemo(
// //     () =>
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("access_token")
// //         : null,
// //     [],
// //   );

// //   const [loading, setLoading] = useState(true);
// //   const [items, setItems] = useState<FlowListItem[]>([]);
// //   const [error, setError] = useState<string | null>(null);

// //   // filters
// //   const [q, setQ] = useState("");
// //   const [status, setStatus] = useState<"" | FlowStatus>("");

// //   // create modal-like inline form
// //   const [creating, setCreating] = useState(false);
// //   const [form, setForm] = useState<FlowCreatePayload>({
// //     name: "",
// //     description: "",
// //     flow_type: "GENERAL",
// //     status: "DRAFT",
// //     start_node_key: "1",
// //     // Optional: you can omit nodes and rely on backend to create default node,
// //     // OR provide a starter node here.
// //     nodes: [
// //       {
// //         node_key: "1",
// //         node_type: "QUESTION",
// //         title: "Start",
// //         body_text: "New question",
// //         help_text: null,
// //         parent_node_key: null,
// //         depth_level: 0,
// //         default_next_node_key: "END",
// //         auto_next_node_key: null,
// //         ui_ack_required: false,
// //         alert_severity: null,
// //         notify_admin: false,
// //         options: [
// //           {
// //             display_order: 1,
// //             label: "Yes",
// //             value: "yes",
// //             severity: "GREEN",
// //             news2_score: 0,
// //             seriousness_points: 0,
// //             next_node_key: "END",
// //           },
// //           {
// //             display_order: 2,
// //             label: "No",
// //             value: "no",
// //             severity: "GREEN",
// //             news2_score: 0,
// //             seriousness_points: 0,
// //             next_node_key: "END",
// //           },
// //         ],
// //       },
// //     ],
// //   });

// //   useEffect(() => {
// //     if (!token) {
// //       router.replace("/login");
// //       return;
// //     }
// //     load();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [token]);

// //   async function load() {
// //     if (!token) return;
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const data = await apiGet<{ total: number; items: FlowListItem[] }>(
// //         `${API_BASE}/flows/`,
// //         token,
// //       );

// //       let list = data.items || [];
// //       if (q.trim()) {
// //         const s = q.trim().toLowerCase();
// //         list = list.filter(
// //           (x) =>
// //             x.name.toLowerCase().includes(s) ||
// //             (x.description || "").toLowerCase().includes(s),
// //         );
// //       }
// //       if (status) list = list.filter((x) => x.status === status);

// //       setItems(list);
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to load questionnaires");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function createFlow() {
// //     if (!token) return;
// //     try {
// //       setError(null);
// //       if (!form.name.trim()) throw new Error("Name is required");
// //       setCreating(true);

// //       // Create flow
// //       const created = await apiPost<any>(`${API_BASE}/flows/`, token, form);

// //       // backend might return { id } or { flow_id } depending on your implementation
// //       const newId = created?.id ?? created?.flow_id;
// //       await load();

// //       if (newId) {
// //         // jump straight to Question Management screen
// //         router.push(`/admin/questionnaires/${newId}/questions`);
// //       } else {
// //         alert("Created, but no flow id returned by API.");
// //       }
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to create questionnaire");
// //     } finally {
// //       setCreating(false);
// //     }
// //   }

// //   async function deleteFlow(id: number) {
// //     if (!token) return;
// //     if (!confirm("Delete this questionnaire? (soft delete)")) return;
// //     try {
// //       setError(null);
// //       await apiDelete(`${API_BASE}/flows/${id}`, token);
// //       await load();
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to delete");
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="w-full px-6 py-4 flex items-center justify-between">
// //           <div>
// //             <div className="text-lg font-bold text-gray-900">
// //               📋 Questionnaire Management
// //             </div>
// //             <div className="text-sm text-gray-600">
// //               Create and manage questionnaire containers (Flows)
// //             </div>
// //           </div>
// //           <button
// //             onClick={() => router.push("/dashboard")}
// //             className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
// //           >
// //             ← Dashboard
// //           </button>
// //         </div>
// //       </header>

// //       {error && (
// //         <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-red-700">
// //           <strong>Error:</strong> {error}
// //         </div>
// //       )}

// //       <main className="w-full px-6 py-6 space-y-6">
// //         {/* Create */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
// //           <div className="flex items-center justify-between gap-4 flex-wrap">
// //             <div className="text-sm font-semibold text-gray-900">
// //               Create Questionnaire
// //             </div>
// //             <button
// //               onClick={createFlow}
// //               disabled={creating || !form.name.trim()}
// //               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
// //             >
// //               {creating ? "Creating..." : "＋ Create"}
// //             </button>
// //           </div>

// //           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <label className="text-sm">
// //               <div className="text-gray-700 font-medium mb-1">Name</div>
// //               <input
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                 value={form.name}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, name: e.target.value }))
// //                 }
// //                 placeholder="e.g. Colorectal Daily Check"
// //               />
// //             </label>

// //             <label className="text-sm">
// //               <div className="text-gray-700 font-medium mb-1">Type</div>
// //               <input
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                 value={form.flow_type}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, flow_type: e.target.value }))
// //                 }
// //                 placeholder="GENERAL_SURGERY / COLORECTAL ..."
// //               />
// //             </label>

// //             <label className="text-sm md:col-span-2">
// //               <div className="text-gray-700 font-medium mb-1">Description</div>
// //               <textarea
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                 value={form.description}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, description: e.target.value }))
// //                 }
// //                 placeholder="Short description..."
// //               />
// //             </label>

// //             <label className="text-sm">
// //               <div className="text-gray-700 font-medium mb-1">Status</div>
// //               <select
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                 value={form.status}
// //                 onChange={(e) =>
// //                   setForm((p) => ({
// //                     ...p,
// //                     status: e.target.value as FlowStatus,
// //                   }))
// //                 }
// //               >
// //                 <option value="DRAFT">DRAFT</option>
// //                 <option value="ACTIVE">ACTIVE</option>
// //                 <option value="ARCHIVED">ARCHIVED</option>
// //               </select>
// //             </label>

// //             <label className="text-sm">
// //               <div className="text-gray-700 font-medium mb-1">
// //                 Start Node Key
// //               </div>
// //               <input
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                 value={form.start_node_key}
// //                 onChange={(e) =>
// //                   setForm((p) => ({ ...p, start_node_key: e.target.value }))
// //                 }
// //                 placeholder="1"
// //               />
// //             </label>

// //             <div className="text-xs text-gray-500 md:col-span-2">
// //               This screen manages the questionnaire container only. Use “Manage
// //               Questions” to build the tree nodes/options.
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters + list */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //           <div className="p-4 border-b border-gray-200 flex items-center gap-3 flex-wrap">
// //             <div className="font-semibold text-gray-900">Questionnaires</div>
// //             <div className="ml-auto flex items-center gap-2 flex-wrap">
// //               <input
// //                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
// //                 value={q}
// //                 onChange={(e) => setQ(e.target.value)}
// //                 placeholder="Search..."
// //               />
// //               <select
// //                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
// //                 value={status}
// //                 onChange={(e) => setStatus(e.target.value as any)}
// //               >
// //                 <option value="">All statuses</option>
// //                 <option value="DRAFT">DRAFT</option>
// //                 <option value="ACTIVE">ACTIVE</option>
// //                 <option value="ARCHIVED">ARCHIVED</option>
// //               </select>
// //               <button
// //                 onClick={load}
// //                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
// //               >
// //                 ↻ Refresh
// //               </button>
// //             </div>
// //           </div>

// //           <div className="overflow-auto">
// //             <table className="w-full text-sm">
// //               <thead className="bg-gray-900 text-white">
// //                 <tr>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
// //                     Name
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
// //                     Type
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
// //                     Status
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
// //                     Nodes
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
// //                     Version
// //                   </th>
// //                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase w-64">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan={6} className="px-4 py-4 text-gray-600">
// //                       Loading...
// //                     </td>
// //                   </tr>
// //                 ) : items.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={6} className="px-4 py-4 text-gray-600">
// //                       No questionnaires found.
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   items.map((f) => (
// //                     <tr
// //                       key={f.id}
// //                       className="border-b border-gray-100 hover:bg-gray-50"
// //                     >
// //                       <td className="px-4 py-3 font-semibold text-gray-900">
// //                         <div>{f.name}</div>
// //                         <div className="text-xs text-gray-600">
// //                           {f.description}
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">{f.flow_type}</td>
// //                       <td className="px-4 py-3">
// //                         <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
// //                           {f.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3">{f.node_count}</td>
// //                       <td className="px-4 py-3">v{f.version}</td>
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center gap-2 flex-wrap">
// //                           <button
// //                             onClick={() =>
// //                               router.push(
// //                                 `/admin/questionnaires/${f.id}/questions`,
// //                               )
// //                             }
// //                             className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
// //                           >
// //                             Manage Questions
// //                           </button>
// //                           <button
// //                             onClick={() => deleteFlow(f.id)}
// //                             className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold"
// //                           >
// //                             Delete
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// type FlowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

// type FlowListItem = {
//   id: number;
//   name: string;
//   description: string | null;
//   flow_type: string;
//   status: FlowStatus | string;
//   node_count: number;
//   version: number;
// };

// type FlowDetail = {
//   id: number;
//   name: string;
//   description: string | null;
//   flow_type: string;
//   status: FlowStatus | string;
//   start_node_key: string;
//   version: number;
//   nodes: any[];
// };

// type FlowCreatePayload = {
//   name: string;
//   description: string;
//   flow_type: string;
//   status: FlowStatus;
//   start_node_key: string;
//   nodes: any[];
// };

// type FlowUpdatePayload = {
//   name: string;
//   description: string;
//   flow_type: string;
//   status: FlowStatus;
//   start_node_key: string;
//   nodes: any[]; // must send full nodes to PUT /flows/{id} (your backend requires nodes)
// };

// // ------------------ API helpers ------------------
// async function apiGet<T>(url: string, token: string): Promise<T> {
//   const res = await fetch(url, {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: "no-store",
//   });
//   const body = await res.json().catch(() => null);
//   if (!res.ok)
//     throw new Error(body?.detail || body?.message || "Request failed");
//   return body as T;
// }

// async function apiPost<T>(url: string, token: string, body?: any): Promise<T> {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const detail = data?.detail;
//     if (typeof detail === "string") throw new Error(detail);
//     if (detail?.errors && Array.isArray(detail.errors)) {
//       throw new Error(detail.errors.join(" | "));
//     }
//     throw new Error(data?.message || JSON.stringify(data) || "Request failed");
//   }

//   return data as T;
// }

// async function apiPut<T>(url: string, token: string, body?: any): Promise<T> {
//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const detail = data?.detail;
//     if (typeof detail === "string") throw new Error(detail);
//     if (detail?.errors && Array.isArray(detail.errors)) {
//       throw new Error(detail.errors.join(" | "));
//     }
//     throw new Error(data?.message || JSON.stringify(data) || "Request failed");
//   }

//   return data as T;
// }

// async function apiDelete<T>(url: string, token: string): Promise<T> {
//   const res = await fetch(url, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok)
//     throw new Error(data?.detail || data?.message || "Request failed");
//   return data as T;
// }

// // ------------------ small UI helper ------------------
// function Modal({
//   open,
//   title,
//   children,
//   onClose,
// }: {
//   open: boolean;
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
//         <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
//           <div className="text-lg font-bold text-gray-900">{title}</div>
//           <button
//             onClick={onClose}
//             className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-50"
//             title="Close"
//           >
//             ✕
//           </button>
//         </div>
//         <div className="px-6 py-5">{children}</div>
//       </div>
//     </div>
//   );
// }

// export default function QuestionnaireManagementPage() {
//   const router = useRouter();
//   const token = useMemo(
//     () =>
//       typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null,
//     [],
//   );

//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState<FlowListItem[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // filters
//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState<"" | FlowStatus>("");

//   // ✅ Create modal
//   const [createOpen, setCreateOpen] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [createForm, setCreateForm] = useState<FlowCreatePayload>({
//     name: "",
//     description: "",
//     flow_type: "GENERAL",
//     status: "DRAFT",
//     start_node_key: "1",
//     nodes: [
//       {
//         node_key: "1",
//         node_type: "QUESTION",
//         title: "Start",
//         body_text: "New question",
//         help_text: null,
//         parent_node_key: null,
//         depth_level: 0,
//         default_next_node_key: "END",
//         auto_next_node_key: null,
//         ui_ack_required: false,
//         alert_severity: null,
//         notify_admin: false,
//         options: [
//           {
//             display_order: 1,
//             label: "Yes",
//             value: "yes",
//             severity: "GREEN",
//             news2_score: 0,
//             seriousness_points: 0,
//             next_node_key: "END",
//           },
//           {
//             display_order: 2,
//             label: "No",
//             value: "no",
//             severity: "GREEN",
//             news2_score: 0,
//             seriousness_points: 0,
//             next_node_key: "END",
//           },
//         ],
//       },
//     ],
//   });

//   // ✅ Edit modal
//   const [editOpen, setEditOpen] = useState(false);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editSaving, setEditSaving] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [editForm, setEditForm] = useState<FlowUpdatePayload>({
//     name: "",
//     description: "",
//     flow_type: "GENERAL",
//     status: "DRAFT",
//     start_node_key: "1",
//     nodes: [],
//   });

//   useEffect(() => {
//     if (!token) {
//       router.replace("/login");
//       return;
//     }
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   async function load() {
//     if (!token) return;
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await apiGet<{ total: number; items: FlowListItem[] }>(
//         `${API_BASE}/flows/`,
//         token,
//       );

//       let list = data.items || [];

//       if (q.trim()) {
//         const s = q.trim().toLowerCase();
//         list = list.filter(
//           (x) =>
//             x.name.toLowerCase().includes(s) ||
//             (x.description || "").toLowerCase().includes(s),
//         );
//       }
//       if (status) list = list.filter((x) => x.status === status);

//       setItems(list);
//     } catch (e: any) {
//       setError(e?.message || "Failed to load questionnaires");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function resetCreateForm() {
//     setCreateForm((p) => ({
//       ...p,
//       name: "",
//       description: "",
//       flow_type: "GENERAL",
//       status: "DRAFT",
//       start_node_key: "1",
//       nodes: p.nodes?.length ? p.nodes : [],
//     }));
//   }

//   async function createFlow() {
//     if (!token) return;
//     try {
//       setError(null);

//       if (!createForm.name.trim()) throw new Error("Name is required");
//       setCreating(true);

//       const created = await apiPost<any>(
//         `${API_BASE}/flows/`,
//         token,
//         createForm,
//       );
//       const newId = created?.id ?? created?.flow_id;

//       setCreateOpen(false);
//       resetCreateForm();
//       await load();

//       if (newId) {
//         // optional: jump straight to manage questions
//         router.push(`/admin/questionnaires/${newId}/questions`);
//       } else {
//         alert("Created, but no flow id returned by API.");
//       }
//     } catch (e: any) {
//       setError(e?.message || "Failed to create questionnaire");
//     } finally {
//       setCreating(false);
//     }
//   }

//   async function openEdit(id: number) {
//     if (!token) return;
//     try {
//       setError(null);
//       setEditId(id);
//       setEditOpen(true);
//       setEditLoading(true);

//       const detail = await apiGet<FlowDetail>(`${API_BASE}/flows/${id}`, token);

//       setEditForm({
//         name: detail.name ?? "",
//         description: detail.description ?? "",
//         flow_type: detail.flow_type ?? "GENERAL",
//         status: (detail.status as FlowStatus) ?? "DRAFT",
//         start_node_key: detail.start_node_key ?? "1",
//         nodes: detail.nodes ?? [],
//       });
//     } catch (e: any) {
//       setError(e?.message || "Failed to load questionnaire");
//       setEditOpen(false);
//       setEditId(null);
//     } finally {
//       setEditLoading(false);
//     }
//   }

//   async function saveEdit() {
//     if (!token || !editId) return;
//     try {
//       setError(null);
//       setEditSaving(true);

//       if (!editForm.name.trim()) throw new Error("Name is required");

//       // IMPORTANT: your backend PUT requires nodes list (min_items=1).
//       if (!editForm.nodes || editForm.nodes.length < 1) {
//         throw new Error(
//           "This questionnaire has no nodes. Add at least one node in Manage Questions.",
//         );
//       }

//       await apiPut(`${API_BASE}/flows/${editId}`, token, editForm);

//       setEditOpen(false);
//       setEditId(null);
//       await load();
//     } catch (e: any) {
//       setError(e?.message || "Failed to update questionnaire");
//     } finally {
//       setEditSaving(false);
//     }
//   }

//   async function deleteFlow(id: number) {
//     if (!token) return;
//     if (!confirm("Delete this questionnaire? (soft delete)")) return;
//     try {
//       setError(null);
//       await apiDelete(`${API_BASE}/flows/${id}`, token);
//       await load();
//     } catch (e: any) {
//       setError(e?.message || "Failed to delete");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="w-full px-6 py-4 flex items-center justify-between">
//           <div>
//             <div className="text-lg font-bold text-gray-900">
//               📋 Questionnaire Management
//             </div>
//             <div className="text-sm text-gray-600">
//               Create and manage questionnaire containers (Flows)
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCreateOpen(true)}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
//             >
//               ＋ Create Questionnaire
//             </button>
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
//             >
//               ← Dashboard
//             </button>
//           </div>
//         </div>
//       </header>

//       {error && (
//         <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-red-700">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       <main className="w-full px-6 py-6">
//         {/* ✅ Only table + filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-4 border-b border-gray-200 flex items-center gap-3 flex-wrap">
//             <div className="font-semibold text-gray-900">Questionnaires</div>
//             <div className="ml-auto flex items-center gap-2 flex-wrap">
//               <input
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 placeholder="Search..."
//               />
//               <select
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value as any)}
//               >
//                 <option value="">All statuses</option>
//                 <option value="DRAFT">DRAFT</option>
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="ARCHIVED">ARCHIVED</option>
//               </select>
//               <button
//                 onClick={load}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
//               >
//                 ↻ Refresh
//               </button>
//             </div>
//           </div>

//           <div className="overflow-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-900 text-white">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
//                     Name
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
//                     Type
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
//                     Status
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
//                     Nodes
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
//                     Version
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold uppercase w-72">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="px-4 py-4 text-gray-600">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : items.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="px-4 py-4 text-gray-600">
//                       No questionnaires found.
//                     </td>
//                   </tr>
//                 ) : (
//                   items.map((f) => (
//                     <tr
//                       key={f.id}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-4 py-3 font-semibold text-gray-900">
//                         <div>{f.name}</div>
//                         <div className="text-xs text-gray-600">
//                           {f.description || ""}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{f.flow_type}</td>
//                       <td className="px-4 py-3">
//                         <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
//                           {f.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">{f.node_count}</td>
//                       <td className="px-4 py-3">v{f.version}</td>

//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <button
//                             onClick={() => openEdit(f.id)}
//                             className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold"
//                           >
//                             ✏️ Edit
//                           </button>

//                           <button
//                             onClick={() =>
//                               router.push(
//                                 `/admin/questionnaires/${f.id}/questions`,
//                               )
//                             }
//                             className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
//                           >
//                             Manage Questions
//                           </button>

//                           <button
//                             onClick={() => deleteFlow(f.id)}
//                             className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold"
//                           >
//                             Delete
//                           </button>
//                         </div>

//                         <div className="mt-2 text-[11px] text-gray-500">
//                           Tip: Use <span className="font-semibold">Edit</span>{" "}
//                           to change status (Draft → Active).
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* ✅ CREATE MODAL */}
//       <Modal
//         open={createOpen}
//         title="Create Questionnaire"
//         onClose={() => {
//           if (!creating) setCreateOpen(false);
//         }}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="text-sm">
//             <div className="text-gray-700 font-medium mb-1">Name</div>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               value={createForm.name}
//               onChange={(e) =>
//                 setCreateForm((p) => ({ ...p, name: e.target.value }))
//               }
//               placeholder="e.g. Colorectal Daily Check"
//             />
//           </label>

//           <label className="text-sm">
//             <div className="text-gray-700 font-medium mb-1">Type</div>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               value={createForm.flow_type}
//               onChange={(e) =>
//                 setCreateForm((p) => ({ ...p, flow_type: e.target.value }))
//               }
//               placeholder="GENERAL / COLORECTAL / ..."
//             />
//           </label>

//           <label className="text-sm md:col-span-2">
//             <div className="text-gray-700 font-medium mb-1">Description</div>
//             <textarea
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               value={createForm.description}
//               onChange={(e) =>
//                 setCreateForm((p) => ({ ...p, description: e.target.value }))
//               }
//               placeholder="Short description..."
//             />
//           </label>

//           <label className="text-sm">
//             <div className="text-gray-700 font-medium mb-1">Status</div>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               value={createForm.status}
//               onChange={(e) =>
//                 setCreateForm((p) => ({
//                   ...p,
//                   status: e.target.value as FlowStatus,
//                 }))
//               }
//             >
//               <option value="DRAFT">DRAFT</option>
//               <option value="ACTIVE">ACTIVE</option>
//               <option value="ARCHIVED">ARCHIVED</option>
//             </select>
//           </label>

//           <label className="text-sm">
//             <div className="text-gray-700 font-medium mb-1">Start Node Key</div>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               value={createForm.start_node_key}
//               onChange={(e) =>
//                 setCreateForm((p) => ({ ...p, start_node_key: e.target.value }))
//               }
//               placeholder="1"
//             />
//           </label>

//           <div className="md:col-span-2 rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
//             This modal creates the questionnaire container (Flow). You’ll be
//             redirected to
//             <span className="font-semibold"> Manage Questions</span> after
//             creation.
//           </div>
//         </div>

//         <div className="mt-5 flex items-center justify-end gap-3">
//           <button
//             onClick={() => setCreateOpen(false)}
//             disabled={creating}
//             className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={createFlow}
//             disabled={creating || !createForm.name.trim()}
//             className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
//           >
//             {creating ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </Modal>

//       {/* ✅ EDIT MODAL */}
//       <Modal
//         open={editOpen}
//         title="Edit Questionnaire"
//         onClose={() => {
//           if (!editSaving) setEditOpen(false);
//         }}
//       >
//         {editLoading ? (
//           <div className="text-sm text-gray-600">Loading questionnaire...</div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <label className="text-sm">
//                 <div className="text-gray-700 font-medium mb-1">Name</div>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   value={editForm.name}
//                   onChange={(e) =>
//                     setEditForm((p) => ({ ...p, name: e.target.value }))
//                   }
//                 />
//               </label>

//               <label className="text-sm">
//                 <div className="text-gray-700 font-medium mb-1">Type</div>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   value={editForm.flow_type}
//                   onChange={(e) =>
//                     setEditForm((p) => ({ ...p, flow_type: e.target.value }))
//                   }
//                 />
//               </label>

//               <label className="text-sm md:col-span-2">
//                 <div className="text-gray-700 font-medium mb-1">
//                   Description
//                 </div>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   value={editForm.description}
//                   onChange={(e) =>
//                     setEditForm((p) => ({ ...p, description: e.target.value }))
//                   }
//                 />
//               </label>

//               <label className="text-sm">
//                 <div className="text-gray-700 font-medium mb-1">Status</div>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   value={editForm.status}
//                   onChange={(e) =>
//                     setEditForm((p) => ({
//                       ...p,
//                       status: e.target.value as FlowStatus,
//                     }))
//                   }
//                 >
//                   <option value="DRAFT">DRAFT</option>
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="ARCHIVED">ARCHIVED</option>
//                 </select>
//               </label>

//               <label className="text-sm">
//                 <div className="text-gray-700 font-medium mb-1">
//                   Start Node Key
//                 </div>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   value={editForm.start_node_key}
//                   onChange={(e) =>
//                     setEditForm((p) => ({
//                       ...p,
//                       start_node_key: e.target.value,
//                     }))
//                   }
//                 />
//               </label>

//               <div className="md:col-span-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
//                 Note: Saving edits calls{" "}
//                 <span className="font-semibold">PUT /flows/{`{id}`}</span>. Your
//                 backend requires sending the full{" "}
//                 <span className="font-semibold">nodes</span> list too. This
//                 modal keeps nodes as-is; edit nodes in{" "}
//                 <span className="font-semibold">Manage Questions</span>.
//               </div>
//             </div>

//             <div className="mt-5 flex items-center justify-between gap-3">
//               <button
//                 onClick={() => {
//                   if (editId)
//                     router.push(`/admin/questionnaires/${editId}/questions`);
//                 }}
//                 className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
//               >
//                 Open Manage Questions
//               </button>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setEditOpen(false)}
//                   disabled={editSaving}
//                   className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={saveEdit}
//                   disabled={editSaving || !editForm.name.trim()}
//                   className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {editSaving ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

type FlowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type FlowListItem = {
  id: number;
  name: string;
  description: string | null;
  flow_type: string;
  status: FlowStatus | string;
  node_count: number;
  version: number;
};

type FlowDetail = {
  id: number;
  name: string;
  description: string | null;
  flow_type: string;
  status: FlowStatus | string;
  start_node_key: string;
  version: number;
  nodes: any[];
};

type FlowCreatePayload = {
  name: string;
  description: string;
  flow_type: string;
  status: FlowStatus;
  start_node_key: string;
  nodes: any[];
};

type FlowUpdatePayload = {
  name: string;
  description: string;
  flow_type: string;
  status: FlowStatus;
  start_node_key: string;
  nodes: any[];
};

// ------------------ API helpers ------------------
async function apiGet<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(body?.detail || body?.message || "Request failed");
  return body as T;
}

async function apiPost<T>(url: string, token: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = data?.detail;
    if (typeof detail === "string") throw new Error(detail);
    if (detail?.errors && Array.isArray(detail.errors)) {
      throw new Error(detail.errors.join(" | "));
    }
    throw new Error(data?.message || JSON.stringify(data) || "Request failed");
  }

  return data as T;
}

async function apiPut<T>(url: string, token: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = data?.detail;
    if (typeof detail === "string") throw new Error(detail);
    if (detail?.errors && Array.isArray(detail.errors)) {
      throw new Error(detail.errors.join(" | "));
    }
    throw new Error(data?.message || JSON.stringify(data) || "Request failed");
  }

  return data as T;
}

async function apiDelete<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.detail || data?.message || "Request failed");
  return data as T;
}

// ------------------ Modal Component ------------------
function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="text-lg font-bold text-gray-900">{title}</div>
          <button
            onClick={onClose}
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
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function QuestionnaireManagementPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = useMemo(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null,
    [],
  );

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FlowListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | FlowStatus>("");

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<FlowCreatePayload>({
    name: "",
    description: "",
    flow_type: "GENERAL",
    status: "DRAFT",
    start_node_key: "1",
    nodes: [
      {
        node_key: "1",
        node_type: "QUESTION",
        title: "Start",
        body_text: "New question",
        help_text: null,
        parent_node_key: null,
        depth_level: 0,
        default_next_node_key: "END",
        auto_next_node_key: null,
        ui_ack_required: false,
        alert_severity: null,
        notify_admin: false,
        options: [
          {
            display_order: 1,
            label: "Yes",
            value: "yes",
            severity: "GREEN",
            news2_score: 0,
            seriousness_points: 0,
            next_node_key: "END",
          },
          {
            display_order: 2,
            label: "No",
            value: "no",
            severity: "GREEN",
            news2_score: 0,
            seriousness_points: 0,
            next_node_key: "END",
          },
        ],
      },
    ],
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FlowUpdatePayload>({
    name: "",
    description: "",
    flow_type: "GENERAL",
    status: "DRAFT",
    start_node_key: "1",
    nodes: [],
  });

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
    if (!token) {
      router.replace("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function load() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const data = await apiGet<{ total: number; items: FlowListItem[] }>(
        `${API_BASE}/flows/`,
        token,
      );

      let list = data.items || [];

      if (q.trim()) {
        const s = q.trim().toLowerCase();
        list = list.filter(
          (x) =>
            x.name.toLowerCase().includes(s) ||
            (x.description || "").toLowerCase().includes(s),
        );
      }
      if (status) list = list.filter((x) => x.status === status);

      setItems(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load questionnaires");
    } finally {
      setLoading(false);
    }
  }

  function resetCreateForm() {
    setCreateForm((p) => ({
      ...p,
      name: "",
      description: "",
      flow_type: "GENERAL",
      status: "DRAFT",
      start_node_key: "1",
      nodes: p.nodes?.length ? p.nodes : [],
    }));
  }

  async function createFlow() {
    if (!token) return;
    try {
      setError(null);

      if (!createForm.name.trim()) throw new Error("Name is required");
      setCreating(true);

      const created = await apiPost<any>(
        `${API_BASE}/flows/`,
        token,
        createForm,
      );
      const newId = created?.id ?? created?.flow_id;

      setCreateOpen(false);
      resetCreateForm();
      await load();

      if (newId) {
        router.push(`/admin/questionnaires/${newId}/questions`);
      } else {
        alert("Created, but no flow id returned by API.");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to create questionnaire");
    } finally {
      setCreating(false);
    }
  }

  async function openEdit(id: number) {
    if (!token) return;
    try {
      setError(null);
      setEditId(id);
      setEditOpen(true);
      setEditLoading(true);

      const detail = await apiGet<FlowDetail>(`${API_BASE}/flows/${id}`, token);

      setEditForm({
        name: detail.name ?? "",
        description: detail.description ?? "",
        flow_type: detail.flow_type ?? "GENERAL",
        status: (detail.status as FlowStatus) ?? "DRAFT",
        start_node_key: detail.start_node_key ?? "1",
        nodes: detail.nodes ?? [],
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load questionnaire");
      setEditOpen(false);
      setEditId(null);
    } finally {
      setEditLoading(false);
    }
  }

  async function saveEdit() {
    if (!token || !editId) return;
    try {
      setError(null);
      setEditSaving(true);

      if (!editForm.name.trim()) throw new Error("Name is required");

      if (!editForm.nodes || editForm.nodes.length < 1) {
        throw new Error(
          "This questionnaire has no nodes. Add at least one node in Manage Questions.",
        );
      }

      await apiPut(`${API_BASE}/flows/${editId}`, token, editForm);

      setEditOpen(false);
      setEditId(null);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update questionnaire");
    } finally {
      setEditSaving(false);
    }
  }

  async function deleteFlow(id: number) {
    if (!token) return;
    if (!confirm("Delete this questionnaire? (soft delete)")) return;
    try {
      setError(null);
      await apiDelete(`${API_BASE}/flows/${id}`, token);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
    }
  }

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
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-teal-600"
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
              Questionnaire Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage questionnaire containers (Flows)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search questionnaires..."
                />
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="">All statuses</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
                <button
                  onClick={load}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
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

              <button
                onClick={() => setCreateOpen(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
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
                Create Questionnaire
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Nodes
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Version
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        Loading questionnaires...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-8 text-center text-gray-600"
                      >
                        No questionnaires found.
                      </td>
                    </tr>
                  ) : (
                    items.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {f.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {f.description || "No description"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {f.flow_type}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              f.status === "ACTIVE"
                                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                                : f.status === "DRAFT"
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                                  : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {f.node_count}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          v{f.version}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => openEdit(f.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600"
                              title="Edit"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/questionnaires/${f.id}/questions`,
                                )
                              }
                              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Manage Questions
                            </button>

                            <button
                              onClick={() => deleteFlow(f.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                              title="Delete"
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

            <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-600">
              Showing {items.length} questionnaire
              {items.length !== 1 ? "s" : ""}
            </div>
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      <Modal
        open={createOpen}
        title="Create Questionnaire"
        onClose={() => {
          if (!creating) setCreateOpen(false);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <div className="text-gray-700 font-medium mb-2">Name *</div>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Colorectal Daily Check"
            />
          </label>

          <label className="text-sm">
            <div className="text-gray-700 font-medium mb-2">Type</div>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              value={createForm.flow_type}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, flow_type: e.target.value }))
              }
              placeholder="GENERAL / COLORECTAL / ..."
            />
          </label>

          <label className="text-sm md:col-span-2">
            <div className="text-gray-700 font-medium mb-2">Description</div>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Short description..."
              rows={3}
            />
          </label>

          <label className="text-sm">
            <div className="text-gray-700 font-medium mb-2">Status</div>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              value={createForm.status}
              onChange={(e) =>
                setCreateForm((p) => ({
                  ...p,
                  status: e.target.value as FlowStatus,
                }))
              }
            >
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="text-gray-700 font-medium mb-2">Start Node Key</div>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              value={createForm.start_node_key}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, start_node_key: e.target.value }))
              }
              placeholder="1"
            />
          </label>

          <div className="md:col-span-2 rounded-lg bg-teal-50 border border-teal-200 p-4 text-sm text-teal-700">
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
              <div>
                This creates the questionnaire container (Flow). You'll be
                redirected to
                <span className="font-semibold"> Manage Questions</span> after
                creation to add questions and build the flow logic.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setCreateOpen(false)}
            disabled={creating}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={createFlow}
            disabled={creating || !createForm.name.trim()}
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        title="Edit Questionnaire"
        onClose={() => {
          if (!editSaving) setEditOpen(false);
        }}
      >
        {editLoading ? (
          <div className="text-sm text-gray-600">Loading questionnaire...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <div className="text-gray-700 font-medium mb-2">Name *</div>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </label>

              <label className="text-sm">
                <div className="text-gray-700 font-medium mb-2">Type</div>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  value={editForm.flow_type}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, flow_type: e.target.value }))
                  }
                />
              </label>

              <label className="text-sm md:col-span-2">
                <div className="text-gray-700 font-medium mb-2">
                  Description
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                />
              </label>

              <label className="text-sm">
                <div className="text-gray-700 font-medium mb-2">Status</div>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      status: e.target.value as FlowStatus,
                    }))
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </label>

              <label className="text-sm">
                <div className="text-gray-700 font-medium mb-2">
                  Start Node Key
                </div>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  value={editForm.start_node_key}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      start_node_key: e.target.value,
                    }))
                  }
                />
              </label>

              <div className="md:col-span-2 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                  <div>
                    Saving edits requires sending the full nodes list. This
                    modal keeps nodes as-is. To edit questions, use{" "}
                    <span className="font-semibold">Manage Questions</span>.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (editId)
                    router.push(`/admin/questionnaires/${editId}/questions`);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
              >
                Open Manage Questions
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditOpen(false)}
                  disabled={editSaving}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  disabled={editSaving || !editForm.name.trim()}
                  className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
