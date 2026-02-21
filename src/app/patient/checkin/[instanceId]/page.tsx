// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ??
//   process.env.NEXT_PUBLIC_API_URL ??
//   "https://virtualwardbackend-production.up.railway.app";

// type CheckinMetaOut = {
//   instance_id: number;
//   status: string;
//   scheduled_for: string;
//   flow: {
//     id: number;
//     name: string;
//     flow_type: string;
//     start_node_key: string; // ✅ required
//   };
// };

// type NodeOptionOut = {
//   id: number;
//   display_order: number;
//   label: string;
//   value: string;
//   severity: string;
//   seriousness_points: number;
//   next_node_key?: string | null;
// };

// type NodeOut = {
//   node_key: string;
//   node_type: "QUESTION" | "MESSAGE" | "ALERT" | string;
//   title?: string | null;
//   body_text: string;
//   help_text?: string | null;
//   ui_ack_required: boolean;
//   alert_severity?: string | null;
//   notify_admin: boolean;
//   default_next_node_key?: string | null;
//   auto_next_node_key?: string | null;
//   options: NodeOptionOut[];
// };

// type NodeAnswerOut = {
//   instance_id: number;
//   node_key: string;
//   next_node_key: string; // node_key or END
// };

// export default function PatientCheckinPage() {
//   const router = useRouter();
//   const params = useParams<{ instanceId: string }>();
//   const instanceId = Number(params.instanceId);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [meta, setMeta] = useState<CheckinMetaOut | null>(null);
//   const [node, setNode] = useState<NodeOut | null>(null);
//   const [currentKey, setCurrentKey] = useState<string>("");

//   const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

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
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

//     const body = await res.json().catch(() => null);
//     if (!res.ok)
//       throw new Error(body?.detail || body?.message || "Request failed");
//     return body as T;
//   }

//   async function loadMeta() {
//     const m = await api<CheckinMetaOut>(`/patient/checkins/${instanceId}`);

//     if (!m?.flow?.start_node_key) {
//       console.log("Bad meta payload:", m);
//       throw new Error(
//         "Missing flow.start_node_key in /patient/checkins/{id} response.",
//       );
//     }
//     setMeta(m);
//     setCurrentKey(m.flow.start_node_key);
//   }

//   async function loadNode(nodeKey: string) {
//     const n = await api<NodeOut>(
//       `/patient/checkins/${instanceId}/node/${encodeURIComponent(nodeKey)}`,
//     );

//     if (!n?.node_key) {
//       console.log("Bad node payload:", n);
//       throw new Error(
//         "Invalid node response from /patient/checkins/{id}/node/{node_key}",
//       );
//     }

//     // sort options by display_order just in case
//     const opts = Array.isArray(n.options)
//       ? [...n.options].sort((a, b) => a.display_order - b.display_order)
//       : [];
//     setNode({ ...n, options: opts });
//     setSelectedOptionId(null);
//   }

//   async function complete() {
//     await api(`/patient/checkins/${instanceId}/complete`, { method: "POST" });
//     router.push("/patient/dashboard");
//   }

//   async function next() {
//     if (!node) return;

//     setSaving(true);
//     setError(null);

//     try {
//       // MESSAGE / ALERT: no option_id
//       if (node.node_type !== "QUESTION") {
//         const out = await api<NodeAnswerOut>(
//           `/patient/checkins/${instanceId}/node/${encodeURIComponent(node.node_key)}/answer`,
//           {
//             method: "POST",
//             body: JSON.stringify({ option_id: null, value_text: null }),
//           },
//         );

//         if (out.next_node_key === "END") {
//           await complete();
//           return;
//         }

//         setCurrentKey(out.next_node_key);
//         await loadNode(out.next_node_key);
//         return;
//       }

//       // QUESTION: must pick option
//       if (!selectedOptionId) {
//         setError("Please select an option.");
//         return;
//       }

//       const out = await api<NodeAnswerOut>(
//         `/patient/checkins/${instanceId}/node/${encodeURIComponent(node.node_key)}/answer`,
//         {
//           method: "POST",
//           body: JSON.stringify({
//             option_id: selectedOptionId,
//             value_text: null,
//           }),
//         },
//       );

//       if (out.next_node_key === "END") {
//         await complete();
//         return;
//       }

//       setCurrentKey(out.next_node_key);
//       await loadNode(out.next_node_key);
//     } catch (e: any) {
//       setError(e?.message || "Failed to submit answer");
//     } finally {
//       setSaving(false);
//     }
//   }

//   useEffect(() => {
//     if (!accessToken) {
//       router.replace("/login");
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         await loadMeta(); // sets currentKey too
//       } catch (e: any) {
//         setError(e?.message || "Failed to load check-in");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // when currentKey becomes available, load first node
//   useEffect(() => {
//     if (!currentKey) return;
//     (async () => {
//       try {
//         setError(null);
//         await loadNode(currentKey);
//       } catch (e: any) {
//         setError(e?.message || "Failed to load node");
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentKey]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-lg">Loading check-in...</div>
//       </div>
//     );
//   }

//   if (!meta) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <button
//           onClick={() => router.back()}
//           className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//         >
//           ← Back
//         </button>

//         {error && (
//           <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div>
//             <div className="text-lg font-bold text-gray-900">
//               {meta.flow.name}
//             </div>
//             <div className="text-xs text-gray-500">
//               Scheduled for: {new Date(meta.scheduled_for).toLocaleDateString()}
//             </div>
//             <div className="text-xs text-gray-500">Status: {meta.status}</div>
//           </div>

//           <button
//             onClick={() => router.push("/patient/dashboard")}
//             className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//           >
//             ← Back to Dashboard
//           </button>
//         </div>
//       </header>

//       <main className="px-6 py-6 max-w-3xl">
//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {!node ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-5">
//             <div className="text-sm text-gray-600">Loading node...</div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg border border-gray-200 p-5">
//             <div className="text-xs text-gray-500 mb-2">
//               Node: {node.node_key}
//             </div>

//             {node.title ? (
//               <div className="text-lg font-bold text-gray-900 mb-2">
//                 {node.title}
//               </div>
//             ) : null}

//             <div className="text-sm text-gray-900 whitespace-pre-wrap">
//               {node.body_text}
//             </div>

//             {node.help_text ? (
//               <div className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
//                 {node.help_text}
//               </div>
//             ) : null}

//             {node.node_type === "QUESTION" ? (
//               <div className="mt-5 space-y-2">
//                 {(node.options ?? []).map((o) => {
//                   const checked = selectedOptionId === o.id;
//                   return (
//                     <label
//                       key={o.id}
//                       className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer hover:bg-gray-50 ${
//                         checked
//                           ? "border-blue-400 bg-blue-50/40"
//                           : "border-gray-200"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name={`node_${node.node_key}`}
//                         checked={checked}
//                         onChange={() => setSelectedOptionId(o.id)}
//                       />
//                       <div className="flex-1">
//                         <div className="text-sm text-gray-900 font-semibold">
//                           {o.label}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Score: {o.seriousness_points ?? 0}
//                         </div>
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="mt-5 text-sm text-gray-600">
//                 {node.node_type === "ALERT" ? (
//                   <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
//                     ALERT{" "}
//                     {node.alert_severity ? `• ${node.alert_severity}` : ""}
//                   </span>
//                 ) : (
//                   <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
//                     MESSAGE
//                   </span>
//                 )}
//               </div>
//             )}

//             <div className="mt-6 flex items-center justify-between gap-3">
//               <button
//                 onClick={() => router.back()}
//                 className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={next}
//                 disabled={
//                   saving || (node.node_type === "QUESTION" && !selectedOptionId)
//                 }
//                 className={`rounded-lg px-5 py-2 text-sm font-bold text-white ${
//                   saving || (node.node_type === "QUESTION" && !selectedOptionId)
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-black hover:bg-gray-800"
//                 }`}
//               >
//                 {saving ? "Saving..." : "Next"}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://virtualwardbackend-production.up.railway.app";

type CheckinMetaOut = {
  instance_id: number;
  status: string;
  scheduled_for: string;
  flow: {
    id: number;
    name: string;
    flow_type: string;
    start_node_key: string;
  };
};

type NodeOptionOut = {
  id: number;
  display_order: number;
  label: string;
  value: string;
  severity: string;
  seriousness_points: number;
  next_node_key?: string | null;
};

type NodeOut = {
  node_key: string;
  node_type: "QUESTION" | "MESSAGE" | "ALERT" | string;
  title?: string | null;
  body_text: string;
  help_text?: string | null;
  ui_ack_required: boolean;
  alert_severity?: string | null;
  notify_admin: boolean;
  default_next_node_key?: string | null;
  auto_next_node_key?: string | null;
  options: NodeOptionOut[];
};

type NodeAnswerOut = {
  instance_id: number;
  node_key: string;
  next_node_key: string;
};

export default function PatientCheckinPage() {
  const router = useRouter();
  const params = useParams<{ instanceId: string }>();
  const instanceId = Number(params.instanceId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState<CheckinMetaOut | null>(null);
  const [node, setNode] = useState<NodeOut | null>(null);
  const [currentKey, setCurrentKey] = useState<string>("");

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

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
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok)
      throw new Error(body?.detail || body?.message || "Request failed");
    return body as T;
  }

  async function loadMeta() {
    const m = await api<CheckinMetaOut>(`/patient/checkins/${instanceId}`);

    if (!m?.flow?.start_node_key) {
      console.log("Bad meta payload:", m);
      throw new Error(
        "Missing flow.start_node_key in /patient/checkins/{id} response.",
      );
    }
    setMeta(m);
    setCurrentKey(m.flow.start_node_key);
  }

  async function loadNode(nodeKey: string) {
    const n = await api<NodeOut>(
      `/patient/checkins/${instanceId}/node/${encodeURIComponent(nodeKey)}`,
    );

    if (!n?.node_key) {
      console.log("Bad node payload:", n);
      throw new Error(
        "Invalid node response from /patient/checkins/{id}/node/{node_key}",
      );
    }

    const opts = Array.isArray(n.options)
      ? [...n.options].sort((a, b) => a.display_order - b.display_order)
      : [];
    setNode({ ...n, options: opts });
    setSelectedOptionId(null);
  }

  async function complete() {
    await api(`/patient/checkins/${instanceId}/complete`, { method: "POST" });
    router.push("/patient/dashboard");
  }

  async function next() {
    if (!node) return;

    setSaving(true);
    setError(null);

    try {
      // MESSAGE / ALERT: no option_id
      if (node.node_type !== "QUESTION") {
        const out = await api<NodeAnswerOut>(
          `/patient/checkins/${instanceId}/node/${encodeURIComponent(node.node_key)}/answer`,
          {
            method: "POST",
            body: JSON.stringify({ option_id: null, value_text: null }),
          },
        );

        if (out.next_node_key === "END") {
          await complete();
          return;
        }

        setCurrentKey(out.next_node_key);
        await loadNode(out.next_node_key);
        return;
      }

      // QUESTION: must pick option
      if (!selectedOptionId) {
        setError("Please select an option.");
        return;
      }

      const out = await api<NodeAnswerOut>(
        `/patient/checkins/${instanceId}/node/${encodeURIComponent(node.node_key)}/answer`,
        {
          method: "POST",
          body: JSON.stringify({
            option_id: selectedOptionId,
            value_text: null,
          }),
        },
      );

      if (out.next_node_key === "END") {
        await complete();
        return;
      }

      setCurrentKey(out.next_node_key);
      await loadNode(out.next_node_key);
    } catch (e: any) {
      setError(e?.message || "Failed to submit answer");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        await loadMeta();
      } catch (e: any) {
        setError(e?.message || "Failed to load check-in");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentKey) return;
    (async () => {
      try {
        setError(null);
        await loadNode(currentKey);
      } catch (e: any) {
        setError(e?.message || "Failed to load node");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-xl font-semibold text-gray-700">
            Loading your questionnaire...
          </div>
          <div className="text-sm text-gray-500 mt-2">Please wait a moment</div>
        </div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 px-5 py-3 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0"
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
              <div className="text-red-700">{error}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {meta.flow.name}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
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
                    {new Date(meta.scheduled_for).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse"></div>
                    {meta.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/patient/dashboard")}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-4 animate-shake">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0"
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
            <div>
              <div className="font-semibold text-red-900 mb-1">Oops!</div>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Question Card */}
        {!node ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-600">Loading question...</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-white">
                    <div className="text-sm opacity-90">Question</div>
                    <div className="font-mono text-xs opacity-75">
                      {node.node_key}
                    </div>
                  </div>
                </div>

                {node.node_type === "ALERT" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ALERT {node.alert_severity && `• ${node.alert_severity}`}
                  </span>
                )}

                {node.node_type === "MESSAGE" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    INFO
                  </span>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="px-8 py-8">
              {node.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {node.title}
                </h2>
              )}

              <div className="text-lg text-gray-800 leading-relaxed mb-6 whitespace-pre-wrap">
                {node.body_text}
              </div>

              {node.help_text && (
                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                  <div className="text-sm text-blue-900 whitespace-pre-wrap">
                    {node.help_text}
                  </div>
                </div>
              )}

              {/* Answer Options */}
              {node.node_type === "QUESTION" && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700 mb-4">
                    Please select your answer:
                  </div>
                  {(node.options ?? []).map((o, idx) => {
                    const checked = selectedOptionId === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelectedOptionId(o.id)}
                        className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                          checked
                            ? "border-teal-500 bg-teal-50 shadow-lg scale-[1.02]"
                            : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              checked
                                ? "border-teal-600 bg-teal-600"
                                : "border-gray-300"
                            }`}
                          >
                            {checked && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1">
                            <div
                              className={`text-base font-semibold mb-1 ${
                                checked ? "text-teal-900" : "text-gray-900"
                              }`}
                            >
                              {o.label}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500">
                              Option {idx + 1}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => router.push("/patient/dashboard")}
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={next}
                  disabled={
                    saving ||
                    (node.node_type === "QUESTION" && !selectedOptionId)
                  }
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                    saving ||
                    (node.node_type === "QUESTION" && !selectedOptionId)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {saving ? (
                    <>
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
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text at Bottom */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your healthcare provider
          </p>
        </div>
      </main>
    </div>
  );
}
