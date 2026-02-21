// // // "use client";

// // // import React, { useEffect, useMemo, useState } from "react";

// // // // ============================================================
// // // // TYPES
// // // // ============================================================
// // // type FlowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
// // // type FlowType =
// // //   | "GENERAL_SURGERY"
// // //   | "COLORECTAL"
// // //   | "CARDIAC"
// // //   | "DIABETES"
// // //   | "ORTHOPEDIC"
// // //   | "OTHER";
// // // type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// // // type SeverityLevel = "GREEN" | "AMBER" | "RED";

// // // type CreatedBy = { id: number; name: string; email: string };

// // // type FlowListItem = {
// // //   id: number;
// // //   name: string;
// // //   description: string | null;
// // //   flow_type: string;
// // //   status: string;
// // //   start_node_key: string;
// // //   version: number;
// // //   node_count: number;
// // //   created_at: string;
// // //   created_by: CreatedBy;
// // // };

// // // type FlowOption = {
// // //   id?: number;
// // //   display_order: number;
// // //   label: string;
// // //   value: string;
// // //   severity: SeverityLevel;
// // //   news2_score: number;
// // //   seriousness_points: number;
// // //   next_node_key: string | null;
// // // };

// // // type FlowNode = {
// // //   id?: number;
// // //   node_key: string;
// // //   node_type: FlowNodeType;
// // //   title: string | null;
// // //   body_text: string;
// // //   help_text: string | null;
// // //   parent_node_key: string | null;
// // //   depth_level?: number;
// // //   default_next_node_key: string | null;
// // //   auto_next_node_key: string | null;
// // //   ui_ack_required: boolean;
// // //   alert_severity: SeverityLevel | null;
// // //   notify_admin: boolean;
// // //   options: FlowOption[];
// // // };

// // // type FlowDetail = {
// // //   id: number;
// // //   name: string;
// // //   description: string | null;
// // //   flow_type: string;
// // //   status: string;
// // //   start_node_key: string;
// // //   version: number;
// // //   created_at: string;
// // //   updated_at: string;
// // //   created_by: CreatedBy;
// // //   nodes: FlowNode[];
// // // };

// // // type ValidationResult = {
// // //   valid: boolean;
// // //   errors: string[];
// // //   warnings?: string[];
// // //   node_count: number;
// // // };

// // // // ============================================================
// // // // CONSTANTS
// // // // ============================================================
// // // const FLOW_TYPES: { value: "" | FlowType; label: string }[] = [
// // //   { value: "", label: "All" },
// // //   { value: "GENERAL_SURGERY", label: "General Surgery" },
// // //   { value: "COLORECTAL", label: "Colorectal" },
// // //   { value: "CARDIAC", label: "Cardiac" },
// // //   { value: "DIABETES", label: "Diabetes" },
// // //   { value: "ORTHOPEDIC", label: "Orthopedic" },
// // //   { value: "OTHER", label: "Other" },
// // // ];

// // // const STATUSES: { value: "" | FlowStatus; label: string }[] = [
// // //   { value: "", label: "All" },
// // //   { value: "ACTIVE", label: "Active" },
// // //   { value: "DRAFT", label: "Draft" },
// // //   { value: "ARCHIVED", label: "Archived" },
// // // ];

// // // const NODE_TYPES: { value: FlowNodeType; label: string; icon: string }[] = [
// // //   { value: "QUESTION", label: "Question", icon: "❓" },
// // //   { value: "MESSAGE", label: "Message", icon: "💬" },
// // //   { value: "ALERT", label: "Alert", icon: "🚨" },
// // // ];

// // // const SEVERITY_LEVELS: SeverityLevel[] = ["GREEN", "AMBER", "RED"];

// // // // ============================================================
// // // // HELPERS
// // // // ============================================================
// // // function getAccessToken(): string | null {
// // //   if (typeof window === "undefined") return null;
// // //   return localStorage.getItem("access_token");
// // // }

// // // function getApiBaseUrl(): string {
// // //   return process.env.NEXT_PUBLIC_API_URL || "https://virtualwardbackend-production.up.railway.app";
// // // }

// // // async function fetchJson<T>(
// // //   url: string,
// // //   opts: { method?: string; token?: string | null; body?: any } = {},
// // // ): Promise<T> {
// // //   const res = await fetch(url, {
// // //     method: opts.method || "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //       ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
// // //     },
// // //     ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
// // //   });

// // //   const text = await res.text();
// // //   const data = text ? JSON.parse(text) : null;

// // //   if (!res.ok) {
// // //     const msg = data?.detail?.errors
// // //       ? data.detail.errors.join("; ")
// // //       : data?.detail || data?.message || `Request failed (${res.status})`;
// // //     throw new Error(msg);
// // //   }
// // //   return data as T;
// // // }

// // // function getSeverityColor(severity: SeverityLevel): string {
// // //   switch (severity) {
// // //     case "RED":
// // //       return "#dc2626";
// // //     case "AMBER":
// // //       return "#f59e0b";
// // //     case "GREEN":
// // //       return "#16a34a";
// // //     default:
// // //       return "#6b7280";
// // //   }
// // // }

// // // function getNodeTypeColor(nodeType: FlowNodeType): string {
// // //   switch (nodeType) {
// // //     case "QUESTION":
// // //       return "#3b82f6";
// // //     case "MESSAGE":
// // //       return "#8b5cf6";
// // //     case "ALERT":
// // //       return "#dc2626";
// // //     default:
// // //       return "#6b7280";
// // //   }
// // // }

// // // // ============================================================
// // // // COMPONENTS
// // // // ============================================================
// // // function Badge({ status }: { status: FlowStatus }) {
// // //   const map: Record<FlowStatus, { dot: string; text: string }> = {
// // //     ACTIVE: { dot: "🟢", text: "Active" },
// // //     DRAFT: { dot: "🟡", text: "Draft" },
// // //     ARCHIVED: { dot: "🔴", text: "Archived" },
// // //   };
// // //   const x = map[status] || { dot: "⚪", text: status };
// // //   return (
// // //     <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
// // //       <span>{x.dot}</span>
// // //       <span>{x.text}</span>
// // //     </span>
// // //   );
// // // }

// // // function Modal({
// // //   title,
// // //   open,
// // //   onClose,
// // //   children,
// // //   width = "1100px",
// // // }: {
// // //   title: string;
// // //   open: boolean;
// // //   onClose: () => void;
// // //   children: React.ReactNode;
// // //   width?: string;
// // // }) {
// // //   if (!open) return null;
// // //   return (
// // //     <div style={styles.backdrop} onMouseDown={onClose}>
// // //       <div
// // //         style={{ ...styles.modal, width: `min(${width}, 100%)` }}
// // //         onMouseDown={(e) => e.stopPropagation()}
// // //       >
// // //         <div style={styles.modalHeader}>
// // //           <h3 style={{ margin: 0 }}>{title}</h3>
// // //           <button onClick={onClose} style={styles.btnGhost}>
// // //             ✕
// // //           </button>
// // //         </div>
// // //         <div>{children}</div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ============================================================
// // // // MAIN COMPONENT
// // // // ============================================================
// // // export default function FlowManagement() {
// // //   const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
// // //   const token = useMemo(() => getAccessToken(), []);

// // //   // Filters
// // //   const [q, setQ] = useState<string>("");
// // //   const [flowType, setFlowType] = useState<"" | FlowType>("");
// // //   const [status, setStatus] = useState<"" | FlowStatus>("");

// // //   // List
// // //   const [items, setItems] = useState<FlowListItem[]>([]);
// // //   const [total, setTotal] = useState<number>(0);
// // //   const [page, setPage] = useState<number>(1);
// // //   const pageSize = 10;

// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [error, setError] = useState<string>("");

// // //   // View modal
// // //   const [viewOpen, setViewOpen] = useState<boolean>(false);
// // //   const [viewFlow, setViewFlow] = useState<FlowDetail | null>(null);

// // //   // Edit modal
// // //   const [editOpen, setEditOpen] = useState<boolean>(false);
// // //   const [editingId, setEditingId] = useState<number | null>(null);
// // //   const [form, setForm] = useState<{
// // //     name: string;
// // //     description: string;
// // //     flow_type: FlowType;
// // //     status: FlowStatus;
// // //     start_node_key: string;
// // //     nodes: FlowNode[];
// // //   }>({
// // //     name: "",
// // //     description: "",
// // //     flow_type: "OTHER",
// // //     status: "DRAFT",
// // //     start_node_key: "1",
// // //     nodes: [],
// // //   });

// // //   // Validation
// // //   const [validationOpen, setValidationOpen] = useState<boolean>(false);
// // //   const [validationResult, setValidationResult] =
// // //     useState<ValidationResult | null>(null);

// // //   // Excel import
// // //   const [importOpen, setImportOpen] = useState<boolean>(false);
// // //   const [excelFile, setExcelFile] = useState<File | null>(null);
// // //   const [importFlowName, setImportFlowName] = useState<string>("");
// // //   const [importFlowType, setImportFlowType] = useState<FlowType>("OTHER");

// // //   const skip = useMemo(() => (page - 1) * pageSize, [page]);
// // //   const pageCount = useMemo(
// // //     () => Math.max(1, Math.ceil(total / pageSize)),
// // //     [total],
// // //   );

// // //   // ============================================================
// // //   // API CALLS
// // //   // ============================================================
// // //   async function loadList() {
// // //     setLoading(true);
// // //     setError("");
// // //     try {
// // //       const params = new URLSearchParams();
// // //       if (q.trim()) params.set("q", q.trim());
// // //       if (flowType) params.set("flow_type", flowType);
// // //       if (status) params.set("status", status);
// // //       params.set("skip", String(skip));
// // //       params.set("limit", String(pageSize));

// // //       const data = await fetchJson<{ total: number; items: FlowListItem[] }>(
// // //         `${apiBaseUrl}/flows/?${params.toString()}`,
// // //         { token },
// // //       );

// // //       setItems(data.items);
// // //       setTotal(data.total);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to load flows");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     loadList();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [q, flowType, status, page]);

// // //   async function openView(flowId: number) {
// // //     setError("");
// // //     setViewFlow(null);
// // //     setViewOpen(true);
// // //     try {
// // //       const data = await fetchJson<FlowDetail>(
// // //         `${apiBaseUrl}/flows/${flowId}`,
// // //         { token },
// // //       );
// // //       setViewFlow(data);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to load flow");
// // //       setViewOpen(false);
// // //     }
// // //   }

// // //   async function openEdit(flowId: number) {
// // //     setError("");
// // //     try {
// // //       const data = await fetchJson<FlowDetail>(
// // //         `${apiBaseUrl}/flows/${flowId}`,
// // //         { token },
// // //       );
// // //       setEditingId(data.id);
// // //       setForm({
// // //         name: data.name,
// // //         description: data.description || "",
// // //         flow_type: data.flow_type as FlowType,
// // //         status: data.status as FlowStatus,
// // //         start_node_key: data.start_node_key,
// // //         nodes: data.nodes.map((n) => ({
// // //           ...n,
// // //           options: n.options || [],
// // //         })),
// // //       });
// // //       setEditOpen(true);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to load flow for editing");
// // //     }
// // //   }

// // //   function openCreate() {
// // //     setEditingId(null);
// // //     setForm({
// // //       name: "",
// // //       description: "",
// // //       flow_type: "OTHER",
// // //       status: "DRAFT",
// // //       start_node_key: "1",
// // //       nodes: [],
// // //     });
// // //     setEditOpen(true);
// // //   }

// // //   async function saveFlow() {
// // //     setError("");
// // //     try {
// // //       if (!form.name.trim()) throw new Error("Flow name is required");
// // //       if (form.nodes.length === 0)
// // //         throw new Error("At least one node is required");

// // //       const payload = {
// // //         name: form.name,
// // //         description: form.description || null,
// // //         flow_type: form.flow_type,
// // //         status: form.status,
// // //         start_node_key: form.start_node_key,
// // //         nodes: form.nodes,
// // //       };

// // //       if (editingId) {
// // //         await fetchJson(`${apiBaseUrl}/flows/${editingId}`, {
// // //           method: "PUT",
// // //           token,
// // //           body: payload,
// // //         });
// // //       } else {
// // //         await fetchJson(`${apiBaseUrl}/flows/`, {
// // //           method: "POST",
// // //           token,
// // //           body: payload,
// // //         });
// // //       }

// // //       setEditOpen(false);
// // //       await loadList();
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to save flow");
// // //     }
// // //   }

// // //   async function deleteFlow(id: number) {
// // //     if (!window.confirm("Delete this flow?")) return;
// // //     setError("");
// // //     try {
// // //       await fetchJson(`${apiBaseUrl}/flows/${id}`, { method: "DELETE", token });
// // //       await loadList();
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to delete flow");
// // //     }
// // //   }

// // //   async function archiveFlow(id: number) {
// // //     if (!window.confirm("Archive this flow?")) return;
// // //     setError("");
// // //     try {
// // //       await fetchJson(`${apiBaseUrl}/flows/${id}/archive`, {
// // //         method: "POST",
// // //         token,
// // //       });
// // //       await loadList();
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to archive flow");
// // //     }
// // //   }

// // //   async function validateFlow(id: number) {
// // //     setError("");
// // //     setValidationResult(null);
// // //     setValidationOpen(true);
// // //     try {
// // //       const data = await fetchJson<ValidationResult>(
// // //         `${apiBaseUrl}/flows/${id}/validate`,
// // //         { token },
// // //       );
// // //       setValidationResult(data);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to validate flow");
// // //       setValidationOpen(false);
// // //     }
// // //   }

// // //   async function importExcel() {
// // //     if (!excelFile) {
// // //       setError("Please select an Excel file");
// // //       return;
// // //     }

// // //     setError("");
// // //     try {
// // //       const formData = new FormData();
// // //       formData.append("file", excelFile);
// // //       formData.append(
// // //         "flow_name",
// // //         importFlowName || excelFile.name.replace(".xlsx", ""),
// // //       );
// // //       formData.append("flow_type", importFlowType);

// // //       const res = await fetch(`${apiBaseUrl}/flows/import-excel`, {
// // //         method: "POST",
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: formData,
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         throw new Error(data?.detail || "Import failed");
// // //       }

// // //       setImportOpen(false);
// // //       setExcelFile(null);
// // //       setImportFlowName("");
// // //       await loadList();
// // //       alert(`Flow imported successfully! Flow ID: ${data.flow_id}`);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to import Excel");
// // //     }
// // //   }

// // //   async function seedDemo() {
// // //     if (!window.confirm("Create demo flow?")) return;
// // //     setError("");
// // //     try {
// // //       await fetchJson(`${apiBaseUrl}/flows/demo/seed`, {
// // //         method: "POST",
// // //         token,
// // //       });
// // //       await loadList();
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to seed demo");
// // //     }
// // //   }

// // //   // ============================================================
// // //   // NODE MANAGEMENT
// // //   // ============================================================
// // //   function addNode() {
// // //     const newKey = String(form.nodes.length + 1);
// // //     setForm((prev) => ({
// // //       ...prev,
// // //       nodes: [
// // //         ...prev.nodes,
// // //         {
// // //           node_key: newKey,
// // //           node_type: "QUESTION",
// // //           title: null,
// // //           body_text: "",
// // //           help_text: null,
// // //           parent_node_key: null,
// // //           default_next_node_key: null,
// // //           auto_next_node_key: null,
// // //           ui_ack_required: false,
// // //           alert_severity: null,
// // //           notify_admin: false,
// // //           options: [
// // //             {
// // //               display_order: 1,
// // //               label: "Option 1",
// // //               value: "opt1",
// // //               severity: "GREEN",
// // //               news2_score: 0,
// // //               seriousness_points: 0,
// // //               next_node_key: null,
// // //             },
// // //             {
// // //               display_order: 2,
// // //               label: "Option 2",
// // //               value: "opt2",
// // //               severity: "GREEN",
// // //               news2_score: 0,
// // //               seriousness_points: 0,
// // //               next_node_key: null,
// // //             },
// // //           ],
// // //         },
// // //       ],
// // //     }));
// // //   }

// // //   function updateNode(idx: number, patch: Partial<FlowNode>) {
// // //     setForm((prev) => {
// // //       const nodes = [...prev.nodes];
// // //       nodes[idx] = { ...nodes[idx], ...patch };
// // //       return { ...prev, nodes };
// // //     });
// // //   }

// // //   function removeNode(idx: number) {
// // //     setForm((prev) => ({
// // //       ...prev,
// // //       nodes: prev.nodes.filter((_, i) => i !== idx),
// // //     }));
// // //   }

// // //   function addOption(nodeIdx: number) {
// // //     setForm((prev) => {
// // //       const nodes = [...prev.nodes];
// // //       const node = { ...nodes[nodeIdx] };
// // //       node.options = [
// // //         ...node.options,
// // //         {
// // //           display_order: node.options.length + 1,
// // //           label: "",
// // //           value: "",
// // //           severity: "GREEN",
// // //           news2_score: 0,
// // //           seriousness_points: 0,
// // //           next_node_key: null,
// // //         },
// // //       ];
// // //       nodes[nodeIdx] = node;
// // //       return { ...prev, nodes };
// // //     });
// // //   }

// // //   function updateOption(
// // //     nodeIdx: number,
// // //     optIdx: number,
// // //     patch: Partial<FlowOption>,
// // //   ) {
// // //     setForm((prev) => {
// // //       const nodes = [...prev.nodes];
// // //       const node = { ...nodes[nodeIdx] };
// // //       const options = [...node.options];
// // //       options[optIdx] = { ...options[optIdx], ...patch };
// // //       node.options = options;
// // //       nodes[nodeIdx] = node;
// // //       return { ...prev, nodes };
// // //     });
// // //   }

// // //   function removeOption(nodeIdx: number, optIdx: number) {
// // //     setForm((prev) => {
// // //       const nodes = [...prev.nodes];
// // //       const node = { ...nodes[nodeIdx] };
// // //       if (node.options.length <= 2) return prev;
// // //       node.options = node.options.filter((_, i) => i !== optIdx);
// // //       nodes[nodeIdx] = node;
// // //       return { ...prev, nodes };
// // //     });
// // //   }

// // //   // ============================================================
// // //   // RENDER
// // //   // ============================================================
// // //   return (
// // //     <div style={styles.page}>
// // //       {/* Header */}
// // //       <div style={styles.topbar}>
// // //         <div>
// // //           <div style={styles.brand}>Virtual Ward System</div>
// // //           <div style={styles.subtitle}>Tree-Based Flow Management</div>
// // //         </div>
// // //         <div style={styles.userBox}>
// // //           <span>👤 Admin</span>
// // //         </div>
// // //       </div>

// // //       <div style={styles.sectionTitleRow}>
// // //         <h2 style={{ margin: 0 }}>Questionnaire Flows</h2>
// // //         <div style={{ color: "#555" }}>{new Date().toDateString()}</div>
// // //       </div>

// // //       {/* Toolbar */}
// // //       <div style={styles.toolbar}>
// // //         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
// // //           <button onClick={openCreate} style={styles.btnPrimary}>
// // //             + Create New Flow
// // //           </button>
// // //           <button onClick={() => setImportOpen(true)} style={styles.btn}>
// // //             📊 Import Excel
// // //           </button>
// // //           <button onClick={seedDemo} style={styles.btn}>
// // //             🎲 Create Demo Flow
// // //           </button>
// // //         </div>

// // //         <div style={styles.filters}>
// // //           <label style={styles.label}>
// // //             Search:
// // //             <input
// // //               style={styles.input}
// // //               value={q}
// // //               onChange={(e) => {
// // //                 setPage(1);
// // //                 setQ(e.target.value);
// // //               }}
// // //               placeholder="Search flows..."
// // //             />
// // //           </label>

// // //           <label style={styles.label}>
// // //             Type:
// // //             <select
// // //               style={styles.select}
// // //               value={flowType}
// // //               onChange={(e) => {
// // //                 setPage(1);
// // //                 setFlowType(e.target.value as any);
// // //               }}
// // //             >
// // //               {FLOW_TYPES.map((t) => (
// // //                 <option key={t.label} value={t.value}>
// // //                   {t.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </label>

// // //           <label style={styles.label}>
// // //             Status:
// // //             <select
// // //               style={styles.select}
// // //               value={status}
// // //               onChange={(e) => {
// // //                 setPage(1);
// // //                 setStatus(e.target.value as any);
// // //               }}
// // //             >
// // //               {STATUSES.map((s) => (
// // //                 <option key={s.label} value={s.value}>
// // //                   {s.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </label>
// // //         </div>
// // //       </div>

// // //       {error ? <div style={styles.errorBox}>⚠️ {error}</div> : null}

// // //       {/* Table */}
// // //       <div style={styles.tableCard}>
// // //         <div style={styles.tableWrap}>
// // //           <table style={styles.table}>
// // //             <thead>
// // //               <tr>
// // //                 <th style={styles.th}>#</th>
// // //                 <th style={styles.th}>Flow Name</th>
// // //                 <th style={styles.th}>Type</th>
// // //                 <th style={styles.th}>Nodes</th>
// // //                 <th style={styles.th}>Version</th>
// // //                 <th style={styles.th}>Status</th>
// // //                 <th style={styles.th}>Actions</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {loading ? (
// // //                 <tr>
// // //                   <td colSpan={7} style={styles.td}>
// // //                     Loading...
// // //                   </td>
// // //                 </tr>
// // //               ) : items.length === 0 ? (
// // //                 <tr>
// // //                   <td colSpan={7} style={styles.td}>
// // //                     No flows found.
// // //                   </td>
// // //                 </tr>
// // //               ) : (
// // //                 items.map((flow, idx) => (
// // //                   <tr key={flow.id}>
// // //                     <td style={styles.td}>{skip + idx + 1}</td>
// // //                     <td style={styles.td}>
// // //                       <div style={{ fontWeight: 800 }}>{flow.name}</div>
// // //                       <div style={{ color: "#666", fontSize: 12 }}>
// // //                         Start: {flow.start_node_key}
// // //                       </div>
// // //                     </td>
// // //                     <td style={styles.td}>{flow.flow_type}</td>
// // //                     <td style={styles.td}>{flow.node_count}</td>
// // //                     <td style={styles.td}>v{flow.version}</td>
// // //                     <td style={styles.td}>
// // //                       <Badge status={flow.status as FlowStatus} />
// // //                     </td>
// // //                     <td style={styles.td}>
// // //                       <div
// // //                         style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
// // //                       >
// // //                         <button
// // //                           style={styles.btn}
// // //                           onClick={() => openView(flow.id)}
// // //                         >
// // //                           View
// // //                         </button>
// // //                         <button
// // //                           style={styles.btn}
// // //                           onClick={() => openEdit(flow.id)}
// // //                         >
// // //                           Edit
// // //                         </button>
// // //                         <button
// // //                           style={styles.btn}
// // //                           onClick={() => validateFlow(flow.id)}
// // //                         >
// // //                           Validate
// // //                         </button>
// // //                         <button
// // //                           style={styles.btn}
// // //                           onClick={() => archiveFlow(flow.id)}
// // //                         >
// // //                           Archive
// // //                         </button>
// // //                         <button
// // //                           style={styles.btnDanger}
// // //                           onClick={() => deleteFlow(flow.id)}
// // //                         >
// // //                           Delete
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         <div style={styles.pagination}>
// // //           <div>
// // //             Showing {items.length ? skip + 1 : 0}-{skip + items.length} of{" "}
// // //             {total}
// // //           </div>
// // //           <div style={{ display: "flex", gap: 8 }}>
// // //             <button
// // //               style={styles.btn}
// // //               disabled={page <= 1}
// // //               onClick={() => setPage((p) => p - 1)}
// // //             >
// // //               Previous
// // //             </button>
// // //             <span>
// // //               Page {page} / {pageCount}
// // //             </span>
// // //             <button
// // //               style={styles.btn}
// // //               disabled={page >= pageCount}
// // //               onClick={() => setPage((p) => p + 1)}
// // //             >
// // //               Next
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* VIEW MODAL */}
// // //       <Modal
// // //         title="Flow Preview"
// // //         open={viewOpen}
// // //         onClose={() => setViewOpen(false)}
// // //       >
// // //         {!viewFlow ? (
// // //           <div>Loading...</div>
// // //         ) : (
// // //           <div style={{ display: "grid", gap: 16 }}>
// // //             <div style={styles.previewHeader}>
// // //               <div>
// // //                 <div style={styles.previewTitle}>{viewFlow.name}</div>
// // //                 <div style={{ color: "#666" }}>{viewFlow.description}</div>
// // //               </div>
// // //             </div>

// // //             <div style={styles.treeContainer}>
// // //               <h4>Flow Structure (Tree View)</h4>
// // //               {viewFlow.nodes.map((node, idx) => {
// // //                 const indent = (node.depth_level || 0) * 40;
// // //                 const bgColor =
// // //                   node.node_type === "QUESTION"
// // //                     ? "#eff6ff"
// // //                     : node.node_type === "MESSAGE"
// // //                       ? "#f5f3ff"
// // //                       : "#fef2f2";

// // //                 return (
// // //                   <div
// // //                     key={idx}
// // //                     style={{ marginLeft: indent, marginBottom: 12 }}
// // //                   >
// // //                     <div
// // //                       style={{
// // //                         ...styles.nodeCard,
// // //                         background: bgColor,
// // //                         borderLeft: `4px solid ${getNodeTypeColor(node.node_type)}`,
// // //                       }}
// // //                     >
// // //                       <div
// // //                         style={{
// // //                           display: "flex",
// // //                           justifyContent: "space-between",
// // //                         }}
// // //                       >
// // //                         <div>
// // //                           <span style={styles.nodeKey}>{node.node_key}</span>
// // //                           <span style={styles.nodeType}>{node.node_type}</span>
// // //                           {node.alert_severity && (
// // //                             <span
// // //                               style={{
// // //                                 ...styles.severityBadge,
// // //                                 background: getSeverityColor(
// // //                                   node.alert_severity,
// // //                                 ),
// // //                               }}
// // //                             >
// // //                               {node.alert_severity}
// // //                             </span>
// // //                           )}
// // //                         </div>
// // //                         <div style={{ fontSize: 12, color: "#666" }}>
// // //                           {node.node_type === "QUESTION" &&
// // //                             node.default_next_node_key && (
// // //                               <span>
// // //                                 Default → {node.default_next_node_key}
// // //                               </span>
// // //                             )}
// // //                           {(node.node_type === "MESSAGE" ||
// // //                             node.node_type === "ALERT") &&
// // //                             node.auto_next_node_key && (
// // //                               <span>Next → {node.auto_next_node_key}</span>
// // //                             )}
// // //                         </div>
// // //                       </div>
// // //                       <div style={{ fontWeight: 700, marginTop: 8 }}>
// // //                         {node.body_text}
// // //                       </div>
// // //                       {node.options.length > 0 && (
// // //                         <div style={{ marginTop: 8 }}>
// // //                           {node.options.map((opt, oidx) => (
// // //                             <div key={oidx} style={styles.optionRow}>
// // //                               <span>{opt.label}</span>
// // //                               <span style={{ fontSize: 11, color: "#666" }}>
// // //                                 NEWS2: {opt.news2_score}, Points:{" "}
// // //                                 {opt.seriousness_points},
// // //                                 <span
// // //                                   style={{
// // //                                     color: getSeverityColor(opt.severity),
// // //                                     fontWeight: 700,
// // //                                   }}
// // //                                 >
// // //                                   {" "}
// // //                                   {opt.severity}
// // //                                 </span>
// // //                                 {opt.next_node_key && (
// // //                                   <span> → {opt.next_node_key}</span>
// // //                                 )}
// // //                               </span>
// // //                             </div>
// // //                           ))}
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </Modal>

// // //       {/* EDIT/CREATE MODAL */}
// // //       <Modal
// // //         title={editingId ? "Edit Flow" : "Create Flow"}
// // //         open={editOpen}
// // //         onClose={() => setEditOpen(false)}
// // //         width="1200px"
// // //       >
// // //         <div style={{ display: "grid", gap: 12 }}>
// // //           <div
// // //             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
// // //           >
// // //             <label style={styles.labelCol}>
// // //               Flow Name
// // //               <input
// // //                 style={styles.input}
// // //                 value={form.name}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({ ...p, name: e.target.value }))
// // //                 }
// // //               />
// // //             </label>

// // //             <label style={styles.labelCol}>
// // //               Type
// // //               <select
// // //                 style={styles.select}
// // //                 value={form.flow_type}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({
// // //                     ...p,
// // //                     flow_type: e.target.value as FlowType,
// // //                   }))
// // //                 }
// // //               >
// // //                 {FLOW_TYPES.filter((t) => t.value !== "").map((t) => (
// // //                   <option key={t.label} value={t.value}>
// // //                     {t.label}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </label>
// // //           </div>

// // //           <label style={styles.labelCol}>
// // //             Description
// // //             <textarea
// // //               style={styles.textarea}
// // //               value={form.description}
// // //               onChange={(e) =>
// // //                 setForm((p) => ({ ...p, description: e.target.value }))
// // //               }
// // //             />
// // //           </label>

// // //           <div
// // //             style={{
// // //               display: "grid",
// // //               gridTemplateColumns: "1fr 1fr 1fr",
// // //               gap: 12,
// // //             }}
// // //           >
// // //             <label style={styles.labelCol}>
// // //               Status
// // //               <select
// // //                 style={styles.select}
// // //                 value={form.status}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({
// // //                     ...p,
// // //                     status: e.target.value as FlowStatus,
// // //                   }))
// // //                 }
// // //               >
// // //                 {STATUSES.filter((s) => s.value !== "").map((s) => (
// // //                   <option key={s.label} value={s.value}>
// // //                     {s.label}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </label>

// // //             <label style={styles.labelCol}>
// // //               Start Node Key
// // //               <input
// // //                 style={styles.input}
// // //                 value={form.start_node_key}
// // //                 onChange={(e) =>
// // //                   setForm((p) => ({ ...p, start_node_key: e.target.value }))
// // //                 }
// // //               />
// // //             </label>

// // //             <div style={{ display: "flex", alignItems: "flex-end" }}>
// // //               <button style={styles.btn} onClick={addNode}>
// // //                 + Add Node
// // //               </button>
// // //             </div>
// // //           </div>

// // //           <div style={styles.hr} />

// // //           <h4>Nodes ({form.nodes.length})</h4>

// // //           {form.nodes.length === 0 ? (
// // //             <div style={{ color: "#666" }}>
// // //               No nodes yet. Click "Add Node" to start.
// // //             </div>
// // //           ) : (
// // //             <div style={{ display: "grid", gap: 12 }}>
// // //               {form.nodes.map((node, idx) => (
// // //                 <div key={idx} style={styles.nodeEditCard}>
// // //                   <div
// // //                     style={{
// // //                       display: "flex",
// // //                       justifyContent: "space-between",
// // //                       marginBottom: 10,
// // //                     }}
// // //                   >
// // //                     <h5 style={{ margin: 0 }}>Node: {node.node_key}</h5>
// // //                     <button
// // //                       style={styles.btnDanger}
// // //                       onClick={() => removeNode(idx)}
// // //                     >
// // //                       Remove
// // //                     </button>
// // //                   </div>

// // //                   <div
// // //                     style={{
// // //                       display: "grid",
// // //                       gridTemplateColumns: "1fr 1fr 1fr",
// // //                       gap: 10,
// // //                     }}
// // //                   >
// // //                     <label style={styles.labelCol}>
// // //                       Node Key
// // //                       <input
// // //                         style={styles.input}
// // //                         value={node.node_key}
// // //                         onChange={(e) =>
// // //                           updateNode(idx, { node_key: e.target.value })
// // //                         }
// // //                       />
// // //                     </label>

// // //                     <label style={styles.labelCol}>
// // //                       Type
// // //                       <select
// // //                         style={styles.select}
// // //                         value={node.node_type}
// // //                         onChange={(e) =>
// // //                           updateNode(idx, {
// // //                             node_type: e.target.value as FlowNodeType,
// // //                           })
// // //                         }
// // //                       >
// // //                         {NODE_TYPES.map((t) => (
// // //                           <option key={t.value} value={t.value}>
// // //                             {t.icon} {t.label}
// // //                           </option>
// // //                         ))}
// // //                       </select>
// // //                     </label>

// // //                     <label style={styles.labelCol}>
// // //                       Parent Node (optional)
// // //                       <input
// // //                         style={styles.input}
// // //                         value={node.parent_node_key || ""}
// // //                         onChange={(e) =>
// // //                           updateNode(idx, {
// // //                             parent_node_key: e.target.value || null,
// // //                           })
// // //                         }
// // //                         placeholder="e.g., 1 or 1.1"
// // //                       />
// // //                     </label>
// // //                   </div>

// // //                   <label style={styles.labelCol}>
// // //                     Body Text
// // //                     <textarea
// // //                       style={styles.textarea}
// // //                       value={node.body_text}
// // //                       onChange={(e) =>
// // //                         updateNode(idx, { body_text: e.target.value })
// // //                       }
// // //                     />
// // //                   </label>

// // //                   {node.node_type === "QUESTION" && (
// // //                     <>
// // //                       <label style={styles.labelCol}>
// // //                         Default Next Node (if no option matches)
// // //                         <input
// // //                           style={styles.input}
// // //                           value={node.default_next_node_key || ""}
// // //                           onChange={(e) =>
// // //                             updateNode(idx, {
// // //                               default_next_node_key: e.target.value || null,
// // //                             })
// // //                           }
// // //                           placeholder="e.g., END or 2"
// // //                         />
// // //                       </label>

// // //                       <div style={{ marginTop: 10 }}>
// // //                         <div
// // //                           style={{
// // //                             display: "flex",
// // //                             justifyContent: "space-between",
// // //                             alignItems: "center",
// // //                             marginBottom: 8,
// // //                           }}
// // //                         >
// // //                           <strong>Options</strong>
// // //                           <button
// // //                             style={styles.btn}
// // //                             onClick={() => addOption(idx)}
// // //                           >
// // //                             + Add Option
// // //                           </button>
// // //                         </div>

// // //                         {node.options.map((opt, oidx) => (
// // //                           <div
// // //                             key={oidx}
// // //                             style={{
// // //                               display: "grid",
// // //                               gridTemplateColumns:
// // //                                 "1fr 1fr 80px 80px 100px 100px auto",
// // //                               gap: 8,
// // //                               marginBottom: 8,
// // //                             }}
// // //                           >
// // //                             <input
// // //                               style={styles.input}
// // //                               placeholder="Label"
// // //                               value={opt.label}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   label: e.target.value,
// // //                                 })
// // //                               }
// // //                             />
// // //                             <input
// // //                               style={styles.input}
// // //                               placeholder="Value"
// // //                               value={opt.value}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   value: e.target.value,
// // //                                 })
// // //                               }
// // //                             />
// // //                             <input
// // //                               style={styles.input}
// // //                               placeholder="NEWS2"
// // //                               type="number"
// // //                               value={opt.news2_score}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   news2_score: Number(e.target.value),
// // //                                 })
// // //                               }
// // //                             />
// // //                             <input
// // //                               style={styles.input}
// // //                               placeholder="Points"
// // //                               type="number"
// // //                               value={opt.seriousness_points}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   seriousness_points: Number(e.target.value),
// // //                                 })
// // //                               }
// // //                             />
// // //                             <select
// // //                               style={styles.select}
// // //                               value={opt.severity}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   severity: e.target.value as SeverityLevel,
// // //                                 })
// // //                               }
// // //                             >
// // //                               {SEVERITY_LEVELS.map((s) => (
// // //                                 <option key={s} value={s}>
// // //                                   {s}
// // //                                 </option>
// // //                               ))}
// // //                             </select>
// // //                             <input
// // //                               style={styles.input}
// // //                               placeholder="Next Node"
// // //                               value={opt.next_node_key || ""}
// // //                               onChange={(e) =>
// // //                                 updateOption(idx, oidx, {
// // //                                   next_node_key: e.target.value || null,
// // //                                 })
// // //                               }
// // //                             />
// // //                             <button
// // //                               style={styles.btnDanger}
// // //                               onClick={() => removeOption(idx, oidx)}
// // //                               disabled={node.options.length <= 2}
// // //                             >
// // //                               ✕
// // //                             </button>
// // //                           </div>
// // //                         ))}
// // //                       </div>
// // //                     </>
// // //                   )}

// // //                   {(node.node_type === "MESSAGE" ||
// // //                     node.node_type === "ALERT") && (
// // //                     <>
// // //                       <label style={styles.labelCol}>
// // //                         Auto Next Node (where to go after acknowledgment)
// // //                         <input
// // //                           style={styles.input}
// // //                           value={node.auto_next_node_key || ""}
// // //                           onChange={(e) =>
// // //                             updateNode(idx, {
// // //                               auto_next_node_key: e.target.value || null,
// // //                             })
// // //                           }
// // //                           placeholder="e.g., END or 2"
// // //                         />
// // //                       </label>

// // //                       {node.node_type === "ALERT" && (
// // //                         <div
// // //                           style={{
// // //                             display: "grid",
// // //                             gridTemplateColumns: "1fr 1fr",
// // //                             gap: 10,
// // //                           }}
// // //                         >
// // //                           <label style={styles.labelCol}>
// // //                             Alert Severity
// // //                             <select
// // //                               style={styles.select}
// // //                               value={node.alert_severity || "RED"}
// // //                               onChange={(e) =>
// // //                                 updateNode(idx, {
// // //                                   alert_severity: e.target
// // //                                     .value as SeverityLevel,
// // //                                 })
// // //                               }
// // //                             >
// // //                               {SEVERITY_LEVELS.map((s) => (
// // //                                 <option key={s} value={s}>
// // //                                   {s}
// // //                                 </option>
// // //                               ))}
// // //                             </select>
// // //                           </label>

// // //                           <label style={styles.labelCol}>
// // //                             Notify Admin
// // //                             <select
// // //                               style={styles.select}
// // //                               value={node.notify_admin ? "yes" : "no"}
// // //                               onChange={(e) =>
// // //                                 updateNode(idx, {
// // //                                   notify_admin: e.target.value === "yes",
// // //                                 })
// // //                               }
// // //                             >
// // //                               <option value="yes">Yes</option>
// // //                               <option value="no">No</option>
// // //                             </select>
// // //                           </label>
// // //                         </div>
// // //                       )}
// // //                     </>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}

// // //           <div
// // //             style={{
// // //               display: "flex",
// // //               justifyContent: "flex-end",
// // //               gap: 10,
// // //               marginTop: 16,
// // //             }}
// // //           >
// // //             <button style={styles.btn} onClick={() => setEditOpen(false)}>
// // //               Cancel
// // //             </button>
// // //             <button style={styles.btnPrimary} onClick={saveFlow}>
// // //               Save Flow
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </Modal>

// // //       {/* VALIDATION MODAL */}
// // //       <Modal
// // //         title="Flow Validation"
// // //         open={validationOpen}
// // //         onClose={() => setValidationOpen(false)}
// // //         width="700px"
// // //       >
// // //         {!validationResult ? (
// // //           <div>Validating...</div>
// // //         ) : (
// // //           <div style={{ display: "grid", gap: 12 }}>
// // //             <div
// // //               style={{
// // //                 padding: 16,
// // //                 borderRadius: 8,
// // //                 background: validationResult.valid ? "#dcfce7" : "#fee2e2",
// // //                 border: `2px solid ${validationResult.valid ? "#16a34a" : "#dc2626"}`,
// // //               }}
// // //             >
// // //               <div style={{ fontSize: 18, fontWeight: 700 }}>
// // //                 {validationResult.valid ? "✅ Valid Flow" : "❌ Invalid Flow"}
// // //               </div>
// // //               <div style={{ marginTop: 4, color: "#666" }}>
// // //                 {validationResult.node_count} nodes
// // //               </div>
// // //             </div>

// // //             {validationResult.errors.length > 0 && (
// // //               <div>
// // //                 <h4 style={{ margin: "0 0 8px 0", color: "#dc2626" }}>
// // //                   Errors:
// // //                 </h4>
// // //                 <ul style={{ margin: 0, paddingLeft: 20 }}>
// // //                   {validationResult.errors.map((err, idx) => (
// // //                     <li key={idx} style={{ color: "#991b1b", marginBottom: 4 }}>
// // //                       {err}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             )}

// // //             {validationResult.warnings &&
// // //               validationResult.warnings.length > 0 && (
// // //                 <div>
// // //                   <h4 style={{ margin: "0 0 8px 0", color: "#f59e0b" }}>
// // //                     Warnings:
// // //                   </h4>
// // //                   <ul style={{ margin: 0, paddingLeft: 20 }}>
// // //                     {validationResult.warnings.map((warn, idx) => (
// // //                       <li
// // //                         key={idx}
// // //                         style={{ color: "#92400e", marginBottom: 4 }}
// // //                       >
// // //                         {warn}
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 </div>
// // //               )}
// // //           </div>
// // //         )}
// // //       </Modal>

// // //       {/* EXCEL IMPORT MODAL */}
// // //       <Modal
// // //         title="Import Excel File"
// // //         open={importOpen}
// // //         onClose={() => setImportOpen(false)}
// // //         width="600px"
// // //       >
// // //         <div style={{ display: "grid", gap: 12 }}>
// // //           <div
// // //             style={{
// // //               padding: 12,
// // //               background: "#fffbeb",
// // //               border: "1px solid #fef3c7",
// // //               borderRadius: 8,
// // //             }}
// // //           >
// // //             <strong>Excel Format:</strong>
// // //             <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, fontSize: 13 }}>
// // //               <li>Column 1: Node Key (Q1, Q2, Q2.1)</li>
// // //               <li>Column 2: Question/Body Text</li>
// // //               <li>Column 3: Answer/Option (for QUESTION nodes)</li>
// // //               <li>Column 4: NEWS2 Score</li>
// // //               <li>Column 5: Seriousness Points</li>
// // //               <li>Column 6: Next Node</li>
// // //               <li>Column 7: Severity (green/amber/red)</li>
// // //             </ul>
// // //           </div>

// // //           <label style={styles.labelCol}>
// // //             Flow Name (optional)
// // //             <input
// // //               style={styles.input}
// // //               value={importFlowName}
// // //               onChange={(e) => setImportFlowName(e.target.value)}
// // //               placeholder="Leave empty to use filename"
// // //             />
// // //           </label>

// // //           <label style={styles.labelCol}>
// // //             Flow Type
// // //             <select
// // //               style={styles.select}
// // //               value={importFlowType}
// // //               onChange={(e) => setImportFlowType(e.target.value as FlowType)}
// // //             >
// // //               {FLOW_TYPES.filter((t) => t.value !== "").map((t) => (
// // //                 <option key={t.label} value={t.value}>
// // //                   {t.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </label>

// // //           <label style={styles.labelCol}>
// // //             Excel File
// // //             <input
// // //               type="file"
// // //               accept=".xlsx,.xls"
// // //               onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
// // //               style={{ padding: 8 }}
// // //             />
// // //           </label>

// // //           <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
// // //             <button style={styles.btn} onClick={() => setImportOpen(false)}>
// // //               Cancel
// // //             </button>
// // //             <button
// // //               style={styles.btnPrimary}
// // //               onClick={importExcel}
// // //               disabled={!excelFile}
// // //             >
// // //               Import
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </Modal>
// // //     </div>
// // //   );
// // // }

// // // // ============================================================
// // // // STYLES
// // // // ============================================================
// // // const styles: Record<string, React.CSSProperties> = {
// // //   page: {
// // //     padding: 18,
// // //     fontFamily: "system-ui, Arial",
// // //     background: "#f6f7fb",
// // //     minHeight: "100vh",
// // //   },
// // //   topbar: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 18,
// // //   },
// // //   brand: { fontWeight: 900, fontSize: 18 },
// // //   subtitle: { color: "#555" },
// // //   userBox: { display: "flex", gap: 10, alignItems: "center" },
// // //   sectionTitleRow: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "baseline",
// // //     marginBottom: 12,
// // //   },
// // //   toolbar: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     marginBottom: 12,
// // //     flexWrap: "wrap",
// // //   },
// // //   filters: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
// // //   label: { display: "flex", gap: 8, alignItems: "center", color: "#333" },
// // //   labelCol: { display: "grid", gap: 6, color: "#333" },
// // //   input: {
// // //     padding: "8px 10px",
// // //     borderRadius: 8,
// // //     border: "1px solid #ccc",
// // //     minWidth: 200,
// // //   },
// // //   select: { padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" },
// // //   textarea: {
// // //     padding: "8px 10px",
// // //     borderRadius: 8,
// // //     border: "1px solid #ccc",
// // //     minHeight: 60,
// // //   },
// // //   tableCard: {
// // //     background: "#fff",
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
// // //   },
// // //   tableWrap: { overflowX: "auto" },
// // //   table: { width: "100%", borderCollapse: "collapse" },
// // //   th: {
// // //     textAlign: "left",
// // //     padding: 10,
// // //     borderBottom: "1px solid #eee",
// // //     color: "#444",
// // //   },
// // //   td: { padding: 10, borderBottom: "1px solid #f0f0f0", verticalAlign: "top" },
// // //   pagination: {
// // //     marginTop: 10,
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     flexWrap: "wrap",
// // //     gap: 10,
// // //   },
// // //   btn: {
// // //     padding: "8px 10px",
// // //     borderRadius: 8,
// // //     border: "1px solid #ccc",
// // //     background: "#fff",
// // //     cursor: "pointer",
// // //     fontWeight: 600,
// // //     fontSize: 13,
// // //   },
// // //   btnGhost: {
// // //     padding: "6px 10px",
// // //     borderRadius: 8,
// // //     border: "1px solid #ddd",
// // //     background: "#fff",
// // //     cursor: "pointer",
// // //   },
// // //   btnPrimary: {
// // //     padding: "8px 12px",
// // //     borderRadius: 8,
// // //     border: "1px solid #1f6feb",
// // //     background: "#1f6feb",
// // //     color: "#fff",
// // //     cursor: "pointer",
// // //     fontWeight: 700,
// // //   },
// // //   btnDanger: {
// // //     padding: "8px 10px",
// // //     borderRadius: 8,
// // //     border: "1px solid #d1242f",
// // //     background: "#fff",
// // //     color: "#d1242f",
// // //     cursor: "pointer",
// // //     fontWeight: 700,
// // //   },
// // //   errorBox: {
// // //     background: "#fff3cd",
// // //     border: "1px solid #ffecb5",
// // //     padding: 10,
// // //     borderRadius: 10,
// // //     marginBottom: 12,
// // //   },
// // //   hr: { height: 1, background: "#eee", margin: "12px 0" },
// // //   backdrop: {
// // //     position: "fixed",
// // //     inset: 0,
// // //     background: "rgba(0,0,0,0.35)",
// // //     display: "flex",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     padding: 16,
// // //     zIndex: 9999,
// // //   },
// // //   modal: {
// // //     maxHeight: "90vh",
// // //     overflow: "auto",
// // //     background: "#fff",
// // //     borderRadius: 12,
// // //     padding: 14,
// // //     boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
// // //   },
// // //   modalHeader: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 10,
// // //     paddingBottom: 10,
// // //     borderBottom: "1px solid #eee",
// // //   },
// // //   previewHeader: {
// // //     padding: 14,
// // //     background: "#f7fbff",
// // //     border: "1px solid #dbeafe",
// // //     borderRadius: 12,
// // //   },
// // //   previewTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 900,
// // //     color: "#111",
// // //     marginBottom: 6,
// // //   },
// // //   treeContainer: {
// // //     padding: 14,
// // //     background: "#fafafa",
// // //     borderRadius: 12,
// // //     border: "1px solid #e5e7eb",
// // //   },
// // //   nodeCard: {
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     border: "1px solid #e5e7eb",
// // //     marginBottom: 8,
// // //   },
// // //   nodeKey: {
// // //     padding: "4px 8px",
// // //     background: "#111",
// // //     color: "#fff",
// // //     borderRadius: 4,
// // //     fontWeight: 700,
// // //     fontSize: 12,
// // //     marginRight: 8,
// // //   },
// // //   nodeType: {
// // //     padding: "4px 8px",
// // //     background: "#f3f4f6",
// // //     borderRadius: 4,
// // //     fontSize: 12,
// // //     fontWeight: 600,
// // //     marginRight: 8,
// // //   },
// // //   severityBadge: {
// // //     padding: "4px 8px",
// // //     color: "#fff",
// // //     borderRadius: 4,
// // //     fontSize: 11,
// // //     fontWeight: 700,
// // //   },
// // //   optionRow: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     padding: "6px 10px",
// // //     background: "#fff",
// // //     border: "1px solid #e5e7eb",
// // //     borderRadius: 6,
// // //     marginBottom: 4,
// // //     fontSize: 13,
// // //   },
// // //   nodeEditCard: {
// // //     padding: 14,
// // //     background: "#f9fafb",
// // //     border: "1px solid #e5e7eb",
// // //     borderRadius: 10,
// // //   },
// // // };

// // "use client";

// // import React, { useState } from "react";

// // // ============================================================
// // // TYPES
// // // ============================================================
// // type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// // type SeverityLevel = "GREEN" | "AMBER" | "RED";

// // type FlowOption = {
// //   display_order: number;
// //   label: string;
// //   value: string;
// //   severity: SeverityLevel;
// //   news2_score: number;
// //   seriousness_points: number;
// //   next_node_key: string | null;
// // };

// // type FlowNode = {
// //   node_key: string;
// //   node_type: FlowNodeType;
// //   title: string | null;
// //   body_text: string;
// //   help_text: string | null;
// //   parent_node_key: string | null;
// //   depth_level: number;
// //   default_next_node_key: string | null;
// //   auto_next_node_key: string | null;
// //   ui_ack_required: boolean;
// //   alert_severity: SeverityLevel | null;
// //   notify_admin: boolean;
// //   options: FlowOption[];
// // };

// // type Flow = {
// //   id: number;
// //   name: string;
// //   description: string;
// //   flow_type: string;
// //   status: string;
// //   start_node_key: string;
// //   version: number;
// //   nodes: FlowNode[];
// // };

// // // ============================================================
// // // DUMMY DATA
// // // ============================================================
// // const DEMO_FLOW: Flow = {
// //   id: 1,
// //   name: "Colorectal Surgery - Post-Op Assessment",
// //   description: "Daily monitoring for colorectal surgery patients",
// //   flow_type: "COLORECTAL",
// //   status: "DRAFT",
// //   start_node_key: "1",
// //   version: 1,
// //   nodes: [
// //     {
// //       node_key: "1",
// //       node_type: "QUESTION",
// //       title: "General Wellbeing",
// //       body_text: "How do you feel overall today?",
// //       help_text: "Select the option that best describes your current state",
// //       parent_node_key: null,
// //       depth_level: 0,
// //       default_next_node_key: "2",
// //       auto_next_node_key: null,
// //       ui_ack_required: false,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [
// //         {
// //           display_order: 1,
// //           label: "Much better than yesterday",
// //           value: "much_better",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 2,
// //           label: "About the same",
// //           value: "same",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 10,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 3,
// //           label: "Slightly worse",
// //           value: "worse",
// //           severity: "AMBER",
// //           news2_score: 2,
// //           seriousness_points: 30,
// //           next_node_key: "1.1",
// //         },
// //         {
// //           display_order: 4,
// //           label: "Much worse",
// //           value: "much_worse",
// //           severity: "RED",
// //           news2_score: 3,
// //           seriousness_points: 60,
// //           next_node_key: "1.1",
// //         },
// //       ],
// //     },
// //     {
// //       node_key: "1.1",
// //       node_type: "MESSAGE",
// //       title: null,
// //       body_text:
// //         "We will ask some additional questions to better understand your condition.",
// //       help_text: null,
// //       parent_node_key: "1",
// //       depth_level: 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: "2",
// //       ui_ack_required: true,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [],
// //     },
// //     {
// //       node_key: "2",
// //       node_type: "QUESTION",
// //       title: "Pain Assessment",
// //       body_text: "What is your current pain level?",
// //       help_text: "Rate your pain from 0 (no pain) to 10 (worst pain)",
// //       parent_node_key: null,
// //       depth_level: 0,
// //       default_next_node_key: "3",
// //       auto_next_node_key: null,
// //       ui_ack_required: false,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [
// //         {
// //           display_order: 1,
// //           label: "No pain (0-2)",
// //           value: "no_pain",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 2,
// //           label: "Mild pain (3-4)",
// //           value: "mild",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 15,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 3,
// //           label: "Moderate pain (5-6)",
// //           value: "moderate",
// //           severity: "AMBER",
// //           news2_score: 2,
// //           seriousness_points: 40,
// //           next_node_key: "2.1",
// //         },
// //         {
// //           display_order: 4,
// //           label: "Severe pain (7-10)",
// //           value: "severe",
// //           severity: "RED",
// //           news2_score: 3,
// //           seriousness_points: 80,
// //           next_node_key: "ALERT_1",
// //         },
// //       ],
// //     },
// //     {
// //       node_key: "2.1",
// //       node_type: "MESSAGE",
// //       title: null,
// //       body_text:
// //         "Moderate pain may require medication adjustment. Please continue with the assessment.",
// //       help_text: null,
// //       parent_node_key: "2",
// //       depth_level: 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: "3",
// //       ui_ack_required: true,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [],
// //     },
// //     {
// //       node_key: "3",
// //       node_type: "QUESTION",
// //       title: "Vital Signs",
// //       body_text: "What is your oxygen saturation level?",
// //       help_text: "Use your pulse oximeter to measure SpO2",
// //       parent_node_key: null,
// //       depth_level: 0,
// //       default_next_node_key: "4",
// //       auto_next_node_key: null,
// //       ui_ack_required: false,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [
// //         {
// //           display_order: 1,
// //           label: "96% or higher",
// //           value: "normal",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 2,
// //           label: "94-95%",
// //           value: "borderline",
// //           severity: "AMBER",
// //           news2_score: 1,
// //           seriousness_points: 20,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 3,
// //           label: "92-93%",
// //           value: "low",
// //           severity: "AMBER",
// //           news2_score: 2,
// //           seriousness_points: 50,
// //           next_node_key: "ALERT_2",
// //         },
// //         {
// //           display_order: 4,
// //           label: "Below 92%",
// //           value: "critical",
// //           severity: "RED",
// //           news2_score: 3,
// //           seriousness_points: 100,
// //           next_node_key: "ALERT_2",
// //         },
// //       ],
// //     },
// //     {
// //       node_key: "4",
// //       node_type: "QUESTION",
// //       title: "Bowel Function",
// //       body_text: "Have you had a bowel movement today?",
// //       help_text: null,
// //       parent_node_key: null,
// //       depth_level: 0,
// //       default_next_node_key: "END",
// //       auto_next_node_key: null,
// //       ui_ack_required: false,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [
// //         {
// //           display_order: 1,
// //           label: "Yes, normal",
// //           value: "yes_normal",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 2,
// //           label: "Yes, but abnormal (blood/mucus)",
// //           value: "yes_abnormal",
// //           severity: "RED",
// //           news2_score: 0,
// //           seriousness_points: 80,
// //           next_node_key: "ALERT_3",
// //         },
// //         {
// //           display_order: 3,
// //           label: "No",
// //           value: "no",
// //           severity: "AMBER",
// //           news2_score: 0,
// //           seriousness_points: 25,
// //           next_node_key: null,
// //         },
// //       ],
// //     },
// //     {
// //       node_key: "ALERT_1",
// //       node_type: "ALERT",
// //       title: "Severe Pain Alert",
// //       body_text:
// //         "⚠️ SEVERE PAIN DETECTED: Please contact your surgical team immediately. Severe pain may indicate complications.",
// //       help_text: null,
// //       parent_node_key: "2",
// //       depth_level: 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: "END",
// //       ui_ack_required: true,
// //       alert_severity: "RED",
// //       notify_admin: true,
// //       options: [],
// //     },
// //     {
// //       node_key: "ALERT_2",
// //       node_type: "ALERT",
// //       title: "Low Oxygen Saturation",
// //       body_text:
// //         "⚠️ LOW OXYGEN LEVELS: Your oxygen saturation is below normal. Please contact the ward immediately.",
// //       help_text: null,
// //       parent_node_key: "3",
// //       depth_level: 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: "4",
// //       ui_ack_required: true,
// //       alert_severity: "AMBER",
// //       notify_admin: true,
// //       options: [],
// //     },
// //     {
// //       node_key: "ALERT_3",
// //       node_type: "ALERT",
// //       title: "Abnormal Bowel Movement",
// //       body_text:
// //         "⚠️ ABNORMAL BOWEL FUNCTION: Blood or mucus in stool requires immediate attention. Contact your surgical team.",
// //       help_text: null,
// //       parent_node_key: "4",
// //       depth_level: 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: "END",
// //       ui_ack_required: true,
// //       alert_severity: "RED",
// //       notify_admin: true,
// //       options: [],
// //     },
// //   ],
// // };

// // // ============================================================
// // // MAIN COMPONENT
// // // ============================================================
// // export default function FlowBuilderStandalone() {
// //   const [flow, setFlow] = useState<Flow>(DEMO_FLOW);
// //   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
// //     new Set(DEMO_FLOW.nodes.map((n) => n.node_key)),
// //   );
// //   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

// //   // Toggle node expansion
// //   function toggleNode(nodeKey: string) {
// //     setExpandedNodes((prev) => {
// //       const next = new Set(prev);
// //       if (next.has(nodeKey)) {
// //         next.delete(nodeKey);
// //       } else {
// //         next.add(nodeKey);
// //       }
// //       return next;
// //     });
// //   }

// //   // Check if node has children
// //   function hasChildren(nodeKey: string): boolean {
// //     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
// //   }

// //   // Get visible nodes
// //   function getVisibleNodes(): FlowNode[] {
// //     const nodeMap = new Map(flow.nodes.map((n) => [n.node_key, n]));

// //     function shouldShow(node: FlowNode): boolean {
// //       if (!node.parent_node_key) return true;
// //       const parent = nodeMap.get(node.parent_node_key);
// //       if (!parent) return true;
// //       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
// //     }

// //     return flow.nodes.filter(shouldShow);
// //   }

// //   // Update node
// //   function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
// //     setFlow((prev) => ({
// //       ...prev,
// //       nodes: prev.nodes.map((n) =>
// //         n.node_key === nodeKey ? { ...n, ...updates } : n,
// //       ),
// //     }));
// //   }

// //   // Update option
// //   function updateOption(
// //     nodeKey: string,
// //     optionIdx: number,
// //     updates: Partial<FlowOption>,
// //   ) {
// //     setFlow((prev) => ({
// //       ...prev,
// //       nodes: prev.nodes.map((n) => {
// //         if (n.node_key === nodeKey) {
// //           const options = [...n.options];
// //           options[optionIdx] = { ...options[optionIdx], ...updates };
// //           return { ...n, options };
// //         }
// //         return n;
// //       }),
// //     }));
// //   }

// //   // Add option
// //   function addOption(nodeKey: string) {
// //     setFlow((prev) => ({
// //       ...prev,
// //       nodes: prev.nodes.map((n) => {
// //         if (n.node_key === nodeKey) {
// //           return {
// //             ...n,
// //             options: [
// //               ...n.options,
// //               {
// //                 display_order: n.options.length + 1,
// //                 label: "New Option",
// //                 value: `opt_${n.options.length + 1}`,
// //                 severity: "GREEN" as SeverityLevel,
// //                 news2_score: 0,
// //                 seriousness_points: 0,
// //                 next_node_key: null,
// //               },
// //             ],
// //           };
// //         }
// //         return n;
// //       }),
// //     }));
// //   }

// //   // Remove option
// //   function removeOption(nodeKey: string, optionIdx: number) {
// //     setFlow((prev) => ({
// //       ...prev,
// //       nodes: prev.nodes.map((n) => {
// //         if (n.node_key === nodeKey) {
// //           if (n.options.length <= 2) return n;
// //           return {
// //             ...n,
// //             options: n.options.filter((_, i) => i !== optionIdx),
// //           };
// //         }
// //         return n;
// //       }),
// //     }));
// //   }

// //   // Add node
// //   function addNode(parentKey: string | null = null) {
// //     const newKey = parentKey
// //       ? `${parentKey}.${flow.nodes.filter((n) => n.parent_node_key === parentKey).length + 1}`
// //       : `${flow.nodes.filter((n) => !n.parent_node_key).length + 1}`;

// //     const newNode: FlowNode = {
// //       node_key: newKey,
// //       node_type: "QUESTION",
// //       title: "New Question",
// //       body_text: "Enter your question here",
// //       help_text: null,
// //       parent_node_key: parentKey,
// //       depth_level: newKey.split(".").length - 1,
// //       default_next_node_key: null,
// //       auto_next_node_key: null,
// //       ui_ack_required: false,
// //       alert_severity: null,
// //       notify_admin: false,
// //       options: [
// //         {
// //           display_order: 1,
// //           label: "Option 1",
// //           value: "opt1",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //         {
// //           display_order: 2,
// //           label: "Option 2",
// //           value: "opt2",
// //           severity: "GREEN",
// //           news2_score: 0,
// //           seriousness_points: 0,
// //           next_node_key: null,
// //         },
// //       ],
// //     };

// //     setFlow((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
// //     setExpandedNodes((prev) => new Set([...prev, newKey]));
// //   }

// //   // Export flow as JSON
// //   function exportFlow() {
// //     const dataStr = JSON.stringify(flow, null, 2);
// //     const dataUri =
// //       "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
// //     const exportFileDefaultName = `flow_${flow.name.replace(/\s+/g, "_")}.json`;

// //     const linkElement = document.createElement("a");
// //     linkElement.setAttribute("href", dataUri);
// //     linkElement.setAttribute("download", exportFileDefaultName);
// //     linkElement.click();
// //   }

// //   const visibleNodes = getVisibleNodes();

// //   return (
// //     <div style={styles.container}>
// //       {/* Top Bar */}
// //       <div style={styles.topBar}>
// //         <div style={styles.appTitle}>
// //           Clinical Questionnaire Builder - Professional Edition
// //         </div>
// //         <input
// //           style={styles.flowNameInput}
// //           value={flow.name}
// //           onChange={(e) =>
// //             setFlow((prev) => ({ ...prev, name: e.target.value }))
// //           }
// //           placeholder="Flow name..."
// //         />
// //         <span style={styles.statusBadge}>{flow.status}</span>
// //         <div style={styles.topActions}>
// //           <button style={styles.btn} onClick={exportFlow}>
// //             💾 Export JSON
// //           </button>
// //           <button style={styles.btnPrimary}>▶️ Preview Flow</button>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div style={styles.mainContent}>
// //         <div style={styles.tableContainer}>
// //           <div style={styles.tableHeader}>
// //             <div style={styles.tableTitle}>Flow Tree Structure</div>
// //             <div style={styles.tableControls}>
// //               <button style={styles.controlBtn} onClick={() => addNode(null)}>
// //                 + Add Root Node
// //               </button>
// //               <button
// //                 style={styles.controlBtn}
// //                 onClick={() =>
// //                   setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)))
// //                 }
// //               >
// //                 ▼ Expand All
// //               </button>
// //               <button
// //                 style={styles.controlBtn}
// //                 onClick={() => setExpandedNodes(new Set())}
// //               >
// //                 ▶ Collapse All
// //               </button>
// //             </div>
// //           </div>

// //           <div style={styles.tableWrapper}>
// //             <table style={styles.treeTable}>
// //               <thead>
// //                 <tr>
// //                   <th style={{ ...styles.th, width: "40px" }}></th>
// //                   <th style={{ ...styles.th, width: "100px" }}>Node</th>
// //                   <th style={{ ...styles.th, width: "120px" }}>Type</th>
// //                   <th style={{ ...styles.th, minWidth: "300px" }}>Body Text</th>
// //                   <th style={{ ...styles.th, width: "150px" }}>Next/Default</th>
// //                   <th style={{ ...styles.th, width: "400px" }}>
// //                     Options / Settings
// //                   </th>
// //                   <th style={{ ...styles.th, width: "120px" }}>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {visibleNodes.map((node) => {
// //                   const hasChild = hasChildren(node.node_key);
// //                   const isExpanded = expandedNodes.has(node.node_key);
// //                   const indent = node.depth_level * 32;
// //                   const isEditing = editingNodeKey === node.node_key;

// //                   return (
// //                     <Fragment  key={node.node_key}>
// //                       {/* Node Row */}
// //                       <tr style={styles.nodeRow}>
// //                         <td style={styles.td}>
// //                           {hasChild && (
// //                             <button
// //                               style={styles.expandBtn}
// //                               onClick={() => toggleNode(node.node_key)}
// //                             >
// //                               {isExpanded ? "▼" : "▶"}
// //                             </button>
// //                           )}
// //                         </td>
// //                         <td
// //                           style={{
// //                             ...styles.td,
// //                             paddingLeft: `${indent + 12}px`,
// //                           }}
// //                         >
// //                           <div style={styles.nodeKeyBadge}>{node.node_key}</div>
// //                         </td>
// //                         <td style={styles.td}>
// //                           <select
// //                             style={styles.selectInline}
// //                             value={node.node_type}
// //                             onChange={(e) =>
// //                               updateNode(node.node_key, {
// //                                 node_type: e.target.value as FlowNodeType,
// //                               })
// //                             }
// //                           >
// //                             <option value="QUESTION">❓ Question</option>
// //                             <option value="MESSAGE">💬 Message</option>
// //                             <option value="ALERT">🚨 Alert</option>
// //                           </select>
// //                         </td>
// //                         <td style={styles.td}>
// //                           <input
// //                             style={styles.inputInline}
// //                             value={node.body_text}
// //                             onChange={(e) =>
// //                               updateNode(node.node_key, {
// //                                 body_text: e.target.value,
// //                               })
// //                             }
// //                             placeholder="Question or message..."
// //                           />
// //                         </td>
// //                         <td style={styles.td}>
// //                           {node.node_type === "QUESTION" ? (
// //                             <input
// //                               style={styles.inputInline}
// //                               value={node.default_next_node_key || ""}
// //                               onChange={(e) =>
// //                                 updateNode(node.node_key, {
// //                                   default_next_node_key: e.target.value || null,
// //                                 })
// //                               }
// //                               placeholder="END or key"
// //                             />
// //                           ) : (
// //                             <input
// //                               style={styles.inputInline}
// //                               value={node.auto_next_node_key || ""}
// //                               onChange={(e) =>
// //                                 updateNode(node.node_key, {
// //                                   auto_next_node_key: e.target.value || null,
// //                                 })
// //                               }
// //                               placeholder="END or key"
// //                             />
// //                           )}
// //                         </td>
// //                         <td style={styles.td}>
// //                           {node.node_type === "QUESTION" && (
// //                             <div style={{ fontSize: 11, color: "#6b7280" }}>
// //                               {node.options.length} options
// //                               <button
// //                                 style={styles.btnInline}
// //                                 onClick={() =>
// //                                   setEditingNodeKey(
// //                                     isEditing ? null : node.node_key,
// //                                   )
// //                                 }
// //                               >
// //                                 {isEditing ? "Hide" : "Edit"}
// //                               </button>
// //                             </div>
// //                           )}
// //                           {node.node_type === "ALERT" && (
// //                             <select
// //                               style={styles.selectInline}
// //                               value={node.alert_severity || "RED"}
// //                               onChange={(e) =>
// //                                 updateNode(node.node_key, {
// //                                   alert_severity: e.target
// //                                     .value as SeverityLevel,
// //                                 })
// //                               }
// //                             >
// //                               <option value="GREEN">🟢 Green</option>
// //                               <option value="AMBER">🟡 Amber</option>
// //                               <option value="RED">🔴 Red</option>
// //                             </select>
// //                           )}
// //                         </td>
// //                         <td style={styles.td}>
// //                           <button
// //                             style={styles.btnSmall}
// //                             onClick={() => addNode(node.node_key)}
// //                           >
// //                             + Child
// //                           </button>
// //                         </td>
// //                       </tr>

// //                       {/* Options Rows */}
// //                       {isEditing &&
// //                         node.node_type === "QUESTION" &&
// //                         node.options.map((opt, idx) => (
// //                           <tr
// //                             key={`${node.node_key}-opt-${idx}`}
// //                             style={styles.optionRow}
// //                           >
// //                             <td colSpan={2} style={styles.td}></td>
// //                             <td style={styles.td}>
// //                               <span style={{ fontSize: 11, color: "#6b7280" }}>
// //                                 Option {idx + 1}
// //                               </span>
// //                             </td>
// //                             <td style={styles.td}>
// //                               <input
// //                                 style={styles.inputInline}
// //                                 value={opt.label}
// //                                 onChange={(e) =>
// //                                   updateOption(node.node_key, idx, {
// //                                     label: e.target.value,
// //                                   })
// //                                 }
// //                                 placeholder="Option label"
// //                               />
// //                             </td>
// //                             <td style={styles.td}>
// //                               <input
// //                                 style={styles.inputInline}
// //                                 value={opt.next_node_key || ""}
// //                                 onChange={(e) =>
// //                                   updateOption(node.node_key, idx, {
// //                                     next_node_key: e.target.value || null,
// //                                   })
// //                                 }
// //                                 placeholder="Next node"
// //                               />
// //                             </td>
// //                             <td style={styles.td}>
// //                               <div
// //                                 style={{
// //                                   display: "flex",
// //                                   gap: 6,
// //                                   fontSize: 12,
// //                                 }}
// //                               >
// //                                 <select
// //                                   style={{ ...styles.selectInline, width: 90 }}
// //                                   value={opt.severity}
// //                                   onChange={(e) =>
// //                                     updateOption(node.node_key, idx, {
// //                                       severity: e.target.value as SeverityLevel,
// //                                     })
// //                                   }
// //                                 >
// //                                   <option value="GREEN">🟢 Green</option>
// //                                   <option value="AMBER">🟡 Amber</option>
// //                                   <option value="RED">🔴 Red</option>
// //                                 </select>
// //                                 <input
// //                                   style={{ ...styles.inputInline, width: 60 }}
// //                                   type="number"
// //                                   value={opt.news2_score}
// //                                   onChange={(e) =>
// //                                     updateOption(node.node_key, idx, {
// //                                       news2_score: Number(e.target.value),
// //                                     })
// //                                   }
// //                                   placeholder="NEWS2"
// //                                   title="NEWS2 Score"
// //                                 />
// //                                 <input
// //                                   style={{ ...styles.inputInline, width: 60 }}
// //                                   type="number"
// //                                   value={opt.seriousness_points}
// //                                   onChange={(e) =>
// //                                     updateOption(node.node_key, idx, {
// //                                       seriousness_points: Number(
// //                                         e.target.value,
// //                                       ),
// //                                     })
// //                                   }
// //                                   placeholder="Points"
// //                                   title="Seriousness Points"
// //                                 />
// //                               </div>
// //                             </td>
// //                             <td style={styles.td}>
// //                               <button
// //                                 style={styles.btnSmall}
// //                                 onClick={() => removeOption(node.node_key, idx)}
// //                                 disabled={node.options.length <= 2}
// //                               >
// //                                 ✕
// //                               </button>
// //                             </td>
// //                           </tr>
// //                         ))}

// //                       {/* Add Option Button */}
// //                       {isEditing && node.node_type === "QUESTION" && (
// //                         <tr style={styles.optionRow}>
// //                           <td colSpan={6} style={styles.td}>
// //                             <button
// //                               style={styles.btnInline}
// //                               onClick={() => addOption(node.node_key)}
// //                             >
// //                               + Add Option
// //                             </button>
// //                           </td>
// //                         </tr>
// //                       )}
// //                     </Fragment >
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ============================================================
// // // STYLES
// // // ============================================================
// // const styles: Record<string, React.CSSProperties> = {
// //   container: {
// //     display: "flex",
// //     flexDirection: "column",
// //     height: "100vh",
// //     overflow: "hidden",
// //     fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
// //     background: "#f0f2f5",
// //     color: "#111827",
// //   },
// //   topBar: {
// //     background: "white",
// //     borderBottom: "2px solid #e5e7eb",
// //     padding: "0.875rem 1.5rem",
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "1.5rem",
// //     boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
// //   },
// //   appTitle: {
// //     fontSize: "1.125rem",
// //     fontWeight: 700,
// //     color: "#047857",
// //   },
// //   flowNameInput: {
// //     flex: 1,
// //     maxWidth: "320px",
// //     padding: "0.5rem 0.75rem",
// //     border: "1px solid #d1d5db",
// //     borderRadius: "5px",
// //     fontSize: "0.875rem",
// //     fontWeight: 500,
// //   },
// //   statusBadge: {
// //     padding: "0.375rem 0.75rem",
// //     background: "#f3f4f6",
// //     color: "#6b7280",
// //     borderRadius: "4px",
// //     fontSize: "0.75rem",
// //     fontWeight: 600,
// //     textTransform: "uppercase",
// //   },
// //   topActions: {
// //     display: "flex",
// //     gap: "0.625rem",
// //     marginLeft: "auto",
// //   },
// //   btn: {
// //     padding: "0.5rem 1rem",
// //     border: "1px solid #d1d5db",
// //     borderRadius: "5px",
// //     fontSize: "0.813rem",
// //     fontWeight: 500,
// //     cursor: "pointer",
// //     transition: "all 0.15s",
// //     fontFamily: "inherit",
// //     background: "white",
// //     color: "#374151",
// //   },
// //   btnPrimary: {
// //     background: "#059669",
// //     color: "white",
// //     border: "none",
// //     padding: "0.5rem 1rem",
// //     borderRadius: "5px",
// //     fontSize: "0.813rem",
// //     fontWeight: 600,
// //     cursor: "pointer",
// //   },
// //   mainContent: {
// //     flex: 1,
// //     overflow: "hidden",
// //     padding: "1rem",
// //   },
// //   tableContainer: {
// //     background: "white",
// //     borderRadius: "8px",
// //     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
// //     height: "100%",
// //     display: "flex",
// //     flexDirection: "column",
// //     border: "1px solid #e5e7eb",
// //   },
// //   tableHeader: {
// //     padding: "1rem 1.25rem",
// //     borderBottom: "2px solid #e5e7eb",
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     background: "#ecfdf5",
// //   },
// //   tableTitle: {
// //     fontSize: "1rem",
// //     fontWeight: 600,
// //     color: "#065f46",
// //   },
// //   tableControls: {
// //     display: "flex",
// //     gap: "0.5rem",
// //   },
// //   controlBtn: {
// //     padding: "0.5rem 0.875rem",
// //     background: "white",
// //     border: "1px solid #d1d5db",
// //     borderRadius: "4px",
// //     fontSize: "0.75rem",
// //     fontWeight: 500,
// //     cursor: "pointer",
// //     transition: "all 0.15s",
// //     color: "#374151",
// //   },
// //   tableWrapper: {
// //     flex: 1,
// //     overflow: "auto",
// //   },
// //   treeTable: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //     fontSize: "0.813rem",
// //     background: "white",
// //   },
// //   th: {
// //     background: "#047857",
// //     color: "white",
// //     padding: "0.75rem 0.625rem",
// //     textAlign: "left",
// //     fontSize: "0.75rem",
// //     fontWeight: 600,
// //     textTransform: "uppercase",
// //     letterSpacing: "0.03em",
// //     borderRight: "1px solid #059669",
// //     borderBottom: "2px solid #065f46",
// //     position: "sticky",
// //     top: 0,
// //     zIndex: 10,
// //   },
// //   td: {
// //     padding: "0.5rem 0.625rem",
// //     borderBottom: "1px solid #f3f4f6",
// //     borderRight: "1px solid #f9fafb",
// //     verticalAlign: "middle",
// //   },
// //   nodeRow: {
// //     background: "white",
// //     transition: "background 0.15s",
// //   },
// //   optionRow: {
// //     background: "#f9fafb",
// //   },
// //   nodeKeyBadge: {
// //     display: "inline-block",
// //     padding: "0.25rem 0.625rem",
// //     background: "#111827",
// //     color: "white",
// //     borderRadius: "4px",
// //     fontFamily: "JetBrains Mono, monospace",
// //     fontSize: "0.75rem",
// //     fontWeight: 600,
// //   },
// //   expandBtn: {
// //     border: "none",
// //     background: "transparent",
// //     cursor: "pointer",
// //     fontSize: "0.75rem",
// //     padding: "0.25rem",
// //     color: "#6b7280",
// //   },
// //   inputInline: {
// //     width: "100%",
// //     padding: "0.375rem 0.5rem",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: "3px",
// //     fontSize: "0.813rem",
// //     fontFamily: "inherit",
// //   },
// //   selectInline: {
// //     width: "100%",
// //     padding: "0.375rem 0.5rem",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: "3px",
// //     fontSize: "0.813rem",
// //     fontFamily: "inherit",
// //     background: "white",
// //   },
// //   btnInline: {
// //     padding: "0.25rem 0.5rem",
// //     border: "1px solid #d1d5db",
// //     borderRadius: "3px",
// //     fontSize: "0.75rem",
// //     background: "white",
// //     cursor: "pointer",
// //     marginLeft: "0.5rem",
// //   },
// //   btnSmall: {
// //     padding: "0.25rem 0.5rem",
// //     border: "1px solid #d1d5db",
// //     borderRadius: "3px",
// //     fontSize: "0.7rem",
// //     background: "white",
// //     cursor: "pointer",
// //   },
// // };

// "use client";

// import React, { useState } from "react";

// // ============================================================
// // TYPES
// // ============================================================
// type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// type SeverityLevel = "GREEN" | "AMBER" | "RED";

// type FlowOption = {
//   display_order: number;
//   label: string;
//   value: string;
//   severity: SeverityLevel;
//   news2_score: number;
//   seriousness_points: number;
//   next_node_key: string | null;
// };

// type FlowNode = {
//   node_key: string;
//   node_type: FlowNodeType;
//   title: string | null;
//   body_text: string;
//   help_text: string | null;
//   parent_node_key: string | null;
//   depth_level: number;
//   default_next_node_key: string | null;
//   auto_next_node_key: string | null;
//   ui_ack_required: boolean;
//   alert_severity: SeverityLevel | null;
//   notify_admin: boolean;
//   options: FlowOption[];
// };

// type Flow = {
//   id: number;
//   name: string;
//   description: string;
//   flow_type: string;
//   status: string;
//   start_node_key: string;
//   version: number;
//   nodes: FlowNode[];
// };

// // ============================================================
// // DUMMY DATA
// // ============================================================
// const DEMO_FLOW: Flow = {
//   id: 1,
//   name: "Colorectal Surgery - Post-Op Assessment",
//   description: "Daily monitoring for colorectal surgery patients",
//   flow_type: "COLORECTAL",
//   status: "DRAFT",
//   start_node_key: "1",
//   version: 1,
//   nodes: [
//     {
//       node_key: "1",
//       node_type: "QUESTION",
//       title: "General Wellbeing",
//       body_text: "How do you feel overall today?",
//       help_text: "Select the option that best describes your current state",
//       parent_node_key: null,
//       depth_level: 0,
//       default_next_node_key: "2",
//       auto_next_node_key: null,
//       ui_ack_required: false,
//       alert_severity: null,
//       notify_admin: false,
//       options: [
//         {
//           display_order: 1,
//           label: "Much better than yesterday",
//           value: "much_better",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//         {
//           display_order: 2,
//           label: "About the same",
//           value: "same",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 10,
//           next_node_key: null,
//         },
//         {
//           display_order: 3,
//           label: "Slightly worse",
//           value: "worse",
//           severity: "AMBER",
//           news2_score: 2,
//           seriousness_points: 30,
//           next_node_key: "1.1",
//         },
//         {
//           display_order: 4,
//           label: "Much worse",
//           value: "much_worse",
//           severity: "RED",
//           news2_score: 3,
//           seriousness_points: 60,
//           next_node_key: "1.1",
//         },
//       ],
//     },
//     {
//       node_key: "1.1",
//       node_type: "MESSAGE",
//       title: null,
//       body_text:
//         "We will ask some additional questions to better understand your condition.",
//       help_text: null,
//       parent_node_key: "1",
//       depth_level: 1,
//       default_next_node_key: null,
//       auto_next_node_key: "2",
//       ui_ack_required: true,
//       alert_severity: null,
//       notify_admin: false,
//       options: [],
//     },
//     {
//       node_key: "2",
//       node_type: "QUESTION",
//       title: "Pain Assessment",
//       body_text: "What is your current pain level?",
//       help_text: "Rate your pain from 0 (no pain) to 10 (worst pain)",
//       parent_node_key: null,
//       depth_level: 0,
//       default_next_node_key: "3",
//       auto_next_node_key: null,
//       ui_ack_required: false,
//       alert_severity: null,
//       notify_admin: false,
//       options: [
//         {
//           display_order: 1,
//           label: "No pain (0-2)",
//           value: "no_pain",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//         {
//           display_order: 2,
//           label: "Mild pain (3-4)",
//           value: "mild",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 15,
//           next_node_key: null,
//         },
//         {
//           display_order: 3,
//           label: "Moderate pain (5-6)",
//           value: "moderate",
//           severity: "AMBER",
//           news2_score: 2,
//           seriousness_points: 40,
//           next_node_key: "2.1",
//         },
//         {
//           display_order: 4,
//           label: "Severe pain (7-10)",
//           value: "severe",
//           severity: "RED",
//           news2_score: 3,
//           seriousness_points: 80,
//           next_node_key: "ALERT_1",
//         },
//       ],
//     },
//     {
//       node_key: "2.1",
//       node_type: "MESSAGE",
//       title: null,
//       body_text:
//         "Moderate pain may require medication adjustment. Please continue with the assessment.",
//       help_text: null,
//       parent_node_key: "2",
//       depth_level: 1,
//       default_next_node_key: null,
//       auto_next_node_key: "3",
//       ui_ack_required: true,
//       alert_severity: null,
//       notify_admin: false,
//       options: [],
//     },
//     {
//       node_key: "3",
//       node_type: "QUESTION",
//       title: "Vital Signs",
//       body_text: "What is your oxygen saturation level?",
//       help_text: "Use your pulse oximeter to measure SpO2",
//       parent_node_key: null,
//       depth_level: 0,
//       default_next_node_key: "4",
//       auto_next_node_key: null,
//       ui_ack_required: false,
//       alert_severity: null,
//       notify_admin: false,
//       options: [
//         {
//           display_order: 1,
//           label: "96% or higher",
//           value: "normal",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//         {
//           display_order: 2,
//           label: "94-95%",
//           value: "borderline",
//           severity: "AMBER",
//           news2_score: 1,
//           seriousness_points: 20,
//           next_node_key: null,
//         },
//         {
//           display_order: 3,
//           label: "92-93%",
//           value: "low",
//           severity: "AMBER",
//           news2_score: 2,
//           seriousness_points: 50,
//           next_node_key: "ALERT_2",
//         },
//         {
//           display_order: 4,
//           label: "Below 92%",
//           value: "critical",
//           severity: "RED",
//           news2_score: 3,
//           seriousness_points: 100,
//           next_node_key: "ALERT_2",
//         },
//       ],
//     },
//     {
//       node_key: "4",
//       node_type: "QUESTION",
//       title: "Bowel Function",
//       body_text: "Have you had a bowel movement today?",
//       help_text: null,
//       parent_node_key: null,
//       depth_level: 0,
//       default_next_node_key: "END",
//       auto_next_node_key: null,
//       ui_ack_required: false,
//       alert_severity: null,
//       notify_admin: false,
//       options: [
//         {
//           display_order: 1,
//           label: "Yes, normal",
//           value: "yes_normal",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//         {
//           display_order: 2,
//           label: "Yes, but abnormal (blood/mucus)",
//           value: "yes_abnormal",
//           severity: "RED",
//           news2_score: 0,
//           seriousness_points: 80,
//           next_node_key: "ALERT_3",
//         },
//         {
//           display_order: 3,
//           label: "No",
//           value: "no",
//           severity: "AMBER",
//           news2_score: 0,
//           seriousness_points: 25,
//           next_node_key: null,
//         },
//       ],
//     },
//     {
//       node_key: "ALERT_1",
//       node_type: "ALERT",
//       title: "Severe Pain Alert",
//       body_text:
//         "⚠️ SEVERE PAIN DETECTED: Please contact your surgical team immediately. Severe pain may indicate complications.",
//       help_text: null,
//       parent_node_key: "2",
//       depth_level: 1,
//       default_next_node_key: null,
//       auto_next_node_key: "END",
//       ui_ack_required: true,
//       alert_severity: "RED",
//       notify_admin: true,
//       options: [],
//     },
//     {
//       node_key: "ALERT_2",
//       node_type: "ALERT",
//       title: "Low Oxygen Saturation",
//       body_text:
//         "⚠️ LOW OXYGEN LEVELS: Your oxygen saturation is below normal. Please contact the ward immediately.",
//       help_text: null,
//       parent_node_key: "3",
//       depth_level: 1,
//       default_next_node_key: null,
//       auto_next_node_key: "4",
//       ui_ack_required: true,
//       alert_severity: "AMBER",
//       notify_admin: true,
//       options: [],
//     },
//     {
//       node_key: "ALERT_3",
//       node_type: "ALERT",
//       title: "Abnormal Bowel Movement",
//       body_text:
//         "⚠️ ABNORMAL BOWEL FUNCTION: Blood or mucus in stool requires immediate attention. Contact your surgical team.",
//       help_text: null,
//       parent_node_key: "4",
//       depth_level: 1,
//       default_next_node_key: null,
//       auto_next_node_key: "END",
//       ui_ack_required: true,
//       alert_severity: "RED",
//       notify_admin: true,
//       options: [],
//     },
//   ],
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================
// export default function FlowBuilderStandalone() {
//   const [flow, setFlow] = useState<Flow>(DEMO_FLOW);
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
//     new Set(DEMO_FLOW.nodes.map((n) => n.node_key)),
//   );
//   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

//   // Toggle node expansion
//   function toggleNode(nodeKey: string) {
//     setExpandedNodes((prev) => {
//       const next = new Set(prev);
//       if (next.has(nodeKey)) {
//         next.delete(nodeKey);
//       } else {
//         next.add(nodeKey);
//       }
//       return next;
//     });
//   }

//   // Check if node has children
//   function hasChildren(nodeKey: string): boolean {
//     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
//   }

//   // Get visible nodes
//   function getVisibleNodes(): FlowNode[] {
//     const nodeMap = new Map(flow.nodes.map((n) => [n.node_key, n]));

//     function shouldShow(node: FlowNode): boolean {
//       if (!node.parent_node_key) return true;
//       const parent = nodeMap.get(node.parent_node_key);
//       if (!parent) return true;
//       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
//     }

//     return flow.nodes.filter(shouldShow);
//   }

//   // Update node
//   function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
//     setFlow((prev) => ({
//       ...prev,
//       nodes: prev.nodes.map((n) =>
//         n.node_key === nodeKey ? { ...n, ...updates } : n,
//       ),
//     }));
//   }

//   // Update option
//   function updateOption(
//     nodeKey: string,
//     optionIdx: number,
//     updates: Partial<FlowOption>,
//   ) {
//     setFlow((prev) => ({
//       ...prev,
//       nodes: prev.nodes.map((n) => {
//         if (n.node_key === nodeKey) {
//           const options = [...n.options];
//           options[optionIdx] = { ...options[optionIdx], ...updates };
//           return { ...n, options };
//         }
//         return n;
//       }),
//     }));
//   }

//   // Add option
//   function addOption(nodeKey: string) {
//     setFlow((prev) => ({
//       ...prev,
//       nodes: prev.nodes.map((n) => {
//         if (n.node_key === nodeKey) {
//           return {
//             ...n,
//             options: [
//               ...n.options,
//               {
//                 display_order: n.options.length + 1,
//                 label: "New Option",
//                 value: `opt_${n.options.length + 1}`,
//                 severity: "GREEN" as SeverityLevel,
//                 news2_score: 0,
//                 seriousness_points: 0,
//                 next_node_key: null,
//               },
//             ],
//           };
//         }
//         return n;
//       }),
//     }));
//   }

//   // Remove option
//   function removeOption(nodeKey: string, optionIdx: number) {
//     setFlow((prev) => ({
//       ...prev,
//       nodes: prev.nodes.map((n) => {
//         if (n.node_key === nodeKey) {
//           if (n.options.length <= 2) return n;
//           return {
//             ...n,
//             options: n.options.filter((_, i) => i !== optionIdx),
//           };
//         }
//         return n;
//       }),
//     }));
//   }

//   // Add node
//   function addNode(parentKey: string | null = null) {
//     const newKey = parentKey
//       ? `${parentKey}.${flow.nodes.filter((n) => n.parent_node_key === parentKey).length + 1}`
//       : `${flow.nodes.filter((n) => !n.parent_node_key).length + 1}`;

//     const newNode: FlowNode = {
//       node_key: newKey,
//       node_type: "QUESTION",
//       title: "New Question",
//       body_text: "Enter your question here",
//       help_text: null,
//       parent_node_key: parentKey,
//       depth_level: newKey.split(".").length - 1,
//       default_next_node_key: null,
//       auto_next_node_key: null,
//       ui_ack_required: false,
//       alert_severity: null,
//       notify_admin: false,
//       options: [
//         {
//           display_order: 1,
//           label: "Option 1",
//           value: "opt1",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//         {
//           display_order: 2,
//           label: "Option 2",
//           value: "opt2",
//           severity: "GREEN",
//           news2_score: 0,
//           seriousness_points: 0,
//           next_node_key: null,
//         },
//       ],
//     };

//     setFlow((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
//     setExpandedNodes((prev) => new Set([...prev, newKey]));
//   }

//   // Get all available next nodes as dropdown options
//   function getNextNodeOptions(): Array<{ value: string; label: string }> {
//     const options: Array<{ value: string; label: string }> = [
//       { value: "END", label: "END - Finish questionnaire" },
//     ];

//     flow.nodes.forEach((node) => {
//       const icon = getNodeTypeIcon(node.node_type);
//       const typeLabel =
//         node.node_type === "QUESTION"
//           ? "Question"
//           : node.node_type === "MESSAGE"
//             ? "Message"
//             : "Alert";
//       const text =
//         node.body_text.length > 50
//           ? node.body_text.substring(0, 50) + "..."
//           : node.body_text;

//       options.push({
//         value: node.node_key,
//         label: `${node.node_key} - ${icon} ${typeLabel}: ${text}`,
//       });
//     });

//     return options;
//   }

//   // Get all available next nodes for dropdown
//   function getAvailableNextNodes(): Array<{ key: string; label: string }> {
//     const options = [
//       { key: "", label: "-- Select Next Node --" },
//       { key: "END", label: "END - Complete Flow" },
//     ];

//     flow.nodes.forEach((node) => {
//       const label = `${node.node_key} - ${node.body_text}`;
//       options.push({ key: node.node_key, label });
//     });

//     return options;
//   }

//   // Export flow as JSON
//   function exportFlow() {
//     const dataStr = JSON.stringify(flow, null, 2);
//     const dataUri =
//       "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
//     const exportFileDefaultName = `flow_${flow.name.replace(/\s+/g, "_")}.json`;

//     const linkElement = document.createElement("a");
//     linkElement.setAttribute("href", dataUri);
//     linkElement.setAttribute("download", exportFileDefaultName);
//     linkElement.click();
//   }

//   const visibleNodes = getVisibleNodes();

//   return (
//     <div style={styles.container}>
//       {/* Top Bar */}
//       <div style={styles.topBar}>
//         <div style={styles.appTitle}>
//           Clinical Questionnaire Builder - Professional Edition
//         </div>
//         <input
//           style={styles.flowNameInput}
//           value={flow.name}
//           onChange={(e) =>
//             setFlow((prev) => ({ ...prev, name: e.target.value }))
//           }
//           placeholder="Flow name..."
//         />
//         <span style={styles.statusBadge}>{flow.status}</span>
//         <div style={styles.topActions}>
//           <button style={styles.btn} onClick={exportFlow}>
//             Export JSON
//           </button>
//           <button style={styles.btnPrimary}>Preview Flow</button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainContent}>
//         <div style={styles.tableContainer}>
//           <div style={styles.tableHeader}>
//             <div style={styles.tableTitle}>Flow Tree Structure</div>
//             <div style={styles.tableControls}>
//               <button style={styles.controlBtn} onClick={() => addNode(null)}>
//                 + Add Root Node
//               </button>
//               <button
//                 style={styles.controlBtn}
//                 onClick={() =>
//                   setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)))
//                 }
//               >
//                 ▼ Expand All
//               </button>
//               <button
//                 style={styles.controlBtn}
//                 onClick={() => setExpandedNodes(new Set())}
//               >
//                 ▶ Collapse All
//               </button>
//             </div>
//           </div>

//           <div style={styles.tableWrapper}>
//             <table style={styles.treeTable}>
//               <thead>
//                 <tr>
//                   <th style={{ ...styles.th, width: "40px" }}></th>
//                   <th style={{ ...styles.th, width: "100px" }}>Node</th>
//                   <th style={{ ...styles.th, width: "120px" }}>Type</th>
//                   <th style={{ ...styles.th, minWidth: "300px" }}>Body Text</th>
//                   <th style={{ ...styles.th, width: "280px" }}>Next Node</th>
//                   <th style={{ ...styles.th, width: "400px" }}>
//                     Options / Settings
//                   </th>
//                   <th style={{ ...styles.th, width: "120px" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleNodes.map((node) => {
//                   const hasChild = hasChildren(node.node_key);
//                   const isExpanded = expandedNodes.has(node.node_key);
//                   const indent = node.depth_level * 32;
//                   const isEditing = editingNodeKey === node.node_key;

//                   return (
//                     <Fragment  key={node.node_key}>
//                       {/* Node Row */}
//                       <tr style={styles.nodeRow}>
//                         <td style={styles.td}>
//                           {hasChild && (
//                             <button
//                               style={styles.expandBtn}
//                               onClick={() => toggleNode(node.node_key)}
//                             >
//                               {isExpanded ? "▼" : "▶"}
//                             </button>
//                           )}
//                         </td>
//                         <td
//                           style={{
//                             ...styles.td,
//                             paddingLeft: `${indent + 12}px`,
//                           }}
//                         >
//                           <div style={styles.nodeKeyBadge}>{node.node_key}</div>
//                         </td>
//                         <td style={styles.td}>
//                           <select
//                             style={styles.selectInline}
//                             value={node.node_type}
//                             onChange={(e) =>
//                               updateNode(node.node_key, {
//                                 node_type: e.target.value as FlowNodeType,
//                               })
//                             }
//                           >
//                             <option value="QUESTION">Question</option>
//                             <option value="MESSAGE">Message</option>
//                             <option value="ALERT">Alert</option>
//                           </select>
//                         </td>
//                         <td style={styles.td}>
//                           <input
//                             style={styles.inputInline}
//                             value={node.body_text}
//                             onChange={(e) =>
//                               updateNode(node.node_key, {
//                                 body_text: e.target.value,
//                               })
//                             }
//                             placeholder="Question or message..."
//                           />
//                         </td>
//                         <td style={styles.td}>
//                           {node.node_type === "QUESTION" ? (
//                             <select
//                               style={styles.selectInline}
//                               value={node.default_next_node_key || ""}
//                               onChange={(e) =>
//                                 updateNode(node.node_key, {
//                                   default_next_node_key: e.target.value || null,
//                                 })
//                               }
//                             >
//                               {getAvailableNextNodes().map((opt) => (
//                                 <option key={opt.key} value={opt.key}>
//                                   {opt.label}
//                                 </option>
//                               ))}
//                             </select>
//                           ) : (
//                             <select
//                               style={styles.selectInline}
//                               value={node.auto_next_node_key || ""}
//                               onChange={(e) =>
//                                 updateNode(node.node_key, {
//                                   auto_next_node_key: e.target.value || null,
//                                 })
//                               }
//                             >
//                               {getAvailableNextNodes().map((opt) => (
//                                 <option key={opt.key} value={opt.key}>
//                                   {opt.label}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </td>
//                         <td style={styles.td}>
//                           {node.node_type === "QUESTION" && (
//                             <div style={{ fontSize: 11, color: "#6b7280" }}>
//                               {node.options.length} options
//                               <button
//                                 style={styles.btnInline}
//                                 onClick={() =>
//                                   setEditingNodeKey(
//                                     isEditing ? null : node.node_key,
//                                   )
//                                 }
//                               >
//                                 {isEditing ? "Hide" : "Edit"}
//                               </button>
//                             </div>
//                           )}
//                           {node.node_type === "ALERT" && (
//                             <select
//                               style={styles.selectInline}
//                               value={node.alert_severity || "RED"}
//                               onChange={(e) =>
//                                 updateNode(node.node_key, {
//                                   alert_severity: e.target
//                                     .value as SeverityLevel,
//                                 })
//                               }
//                             >
//                               <option value="GREEN">Green</option>
//                               <option value="AMBER">Amber</option>
//                               <option value="RED">Red</option>
//                             </select>
//                           )}
//                         </td>
//                         <td style={styles.td}>
//                           <button
//                             style={styles.btnSmall}
//                             onClick={() => addNode(node.node_key)}
//                           >
//                             + Child
//                           </button>
//                         </td>
//                       </tr>

//                       {/* Options Rows */}
//                       {isEditing &&
//                         node.node_type === "QUESTION" &&
//                         node.options.map((opt, idx) => (
//                           <tr
//                             key={`${node.node_key}-opt-${idx}`}
//                             style={styles.optionRow}
//                           >
//                             <td colSpan={2} style={styles.td}></td>
//                             <td style={styles.td}>
//                               <span style={{ fontSize: 11, color: "#6b7280" }}>
//                                 Option {idx + 1}
//                               </span>
//                             </td>
//                             <td style={styles.td}>
//                               <input
//                                 style={styles.inputInline}
//                                 value={opt.label}
//                                 onChange={(e) =>
//                                   updateOption(node.node_key, idx, {
//                                     label: e.target.value,
//                                   })
//                                 }
//                                 placeholder="Option label"
//                               />
//                             </td>
//                             <td style={styles.td}>
//                               <select
//                                 style={styles.selectInline}
//                                 value={opt.next_node_key || ""}
//                                 onChange={(e) =>
//                                   updateOption(node.node_key, idx, {
//                                     next_node_key: e.target.value || null,
//                                   })
//                                 }
//                               >
//                                 {getAvailableNextNodes().map((nextOpt) => (
//                                   <option key={nextOpt.key} value={nextOpt.key}>
//                                     {nextOpt.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             </td>
//                             <td style={styles.td}>
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   gap: 6,
//                                   fontSize: 12,
//                                 }}
//                               >
//                                 <select
//                                   style={{ ...styles.selectInline, width: 90 }}
//                                   value={opt.severity}
//                                   onChange={(e) =>
//                                     updateOption(node.node_key, idx, {
//                                       severity: e.target.value as SeverityLevel,
//                                     })
//                                   }
//                                 >
//                                   <option value="GREEN">Green</option>
//                                   <option value="AMBER">Amber</option>
//                                   <option value="RED">Red</option>
//                                 </select>
//                                 <input
//                                   style={{ ...styles.inputInline, width: 60 }}
//                                   type="number"
//                                   value={opt.news2_score}
//                                   onChange={(e) =>
//                                     updateOption(node.node_key, idx, {
//                                       news2_score: Number(e.target.value),
//                                     })
//                                   }
//                                   placeholder="NEWS2"
//                                   title="NEWS2 Score"
//                                 />
//                                 <input
//                                   style={{ ...styles.inputInline, width: 60 }}
//                                   type="number"
//                                   value={opt.seriousness_points}
//                                   onChange={(e) =>
//                                     updateOption(node.node_key, idx, {
//                                       seriousness_points: Number(
//                                         e.target.value,
//                                       ),
//                                     })
//                                   }
//                                   placeholder="Points"
//                                   title="Seriousness Points"
//                                 />
//                               </div>
//                             </td>
//                             <td style={styles.td}>
//                               <button
//                                 style={styles.btnSmall}
//                                 onClick={() => removeOption(node.node_key, idx)}
//                                 disabled={node.options.length <= 2}
//                               >
//                                 ✕
//                               </button>
//                             </td>
//                           </tr>
//                         ))}

//                       {/* Add Option Button */}
//                       {isEditing && node.node_type === "QUESTION" && (
//                         <tr style={styles.optionRow}>
//                           <td colSpan={6} style={styles.td}>
//                             <button
//                               style={styles.btnInline}
//                               onClick={() => addOption(node.node_key)}
//                             >
//                               + Add Option
//                             </button>
//                           </td>
//                         </tr>
//                       )}
//                     </Fragment >
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================================
// // STYLES
// // ============================================================
// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//     overflow: "hidden",
//     fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
//     background: "#f0f2f5",
//     color: "#111827",
//   },
//   topBar: {
//     background: "white",
//     borderBottom: "2px solid #e5e7eb",
//     padding: "0.875rem 1.5rem",
//     display: "flex",
//     alignItems: "center",
//     gap: "1.5rem",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//   },
//   appTitle: {
//     fontSize: "1.125rem",
//     fontWeight: 700,
//     color: "#047857",
//   },
//   flowNameInput: {
//     flex: 1,
//     maxWidth: "320px",
//     padding: "0.5rem 0.75rem",
//     border: "1px solid #d1d5db",
//     borderRadius: "5px",
//     fontSize: "0.875rem",
//     fontWeight: 500,
//   },
//   statusBadge: {
//     padding: "0.375rem 0.75rem",
//     background: "#f3f4f6",
//     color: "#6b7280",
//     borderRadius: "4px",
//     fontSize: "0.75rem",
//     fontWeight: 600,
//     textTransform: "uppercase",
//   },
//   topActions: {
//     display: "flex",
//     gap: "0.625rem",
//     marginLeft: "auto",
//   },
//   btn: {
//     padding: "0.5rem 1rem",
//     border: "1px solid #d1d5db",
//     borderRadius: "5px",
//     fontSize: "0.813rem",
//     fontWeight: 500,
//     cursor: "pointer",
//     transition: "all 0.15s",
//     fontFamily: "inherit",
//     background: "white",
//     color: "#374151",
//   },
//   btnPrimary: {
//     background: "#059669",
//     color: "white",
//     border: "none",
//     padding: "0.5rem 1rem",
//     borderRadius: "5px",
//     fontSize: "0.813rem",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   mainContent: {
//     flex: 1,
//     overflow: "hidden",
//     padding: "1rem",
//   },
//   tableContainer: {
//     background: "white",
//     borderRadius: "8px",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     border: "1px solid #e5e7eb",
//   },
//   tableHeader: {
//     padding: "1rem 1.25rem",
//     borderBottom: "2px solid #e5e7eb",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#ecfdf5",
//   },
//   tableTitle: {
//     fontSize: "1rem",
//     fontWeight: 600,
//     color: "#065f46",
//   },
//   tableControls: {
//     display: "flex",
//     gap: "0.5rem",
//   },
//   controlBtn: {
//     padding: "0.5rem 0.875rem",
//     background: "white",
//     border: "1px solid #d1d5db",
//     borderRadius: "4px",
//     fontSize: "0.75rem",
//     fontWeight: 500,
//     cursor: "pointer",
//     transition: "all 0.15s",
//     color: "#374151",
//   },
//   tableWrapper: {
//     flex: 1,
//     overflow: "auto",
//   },
//   treeTable: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "0.813rem",
//     background: "white",
//   },
//   th: {
//     background: "#047857",
//     color: "white",
//     padding: "0.75rem 0.625rem",
//     textAlign: "left",
//     fontSize: "0.75rem",
//     fontWeight: 600,
//     textTransform: "uppercase",
//     letterSpacing: "0.03em",
//     borderRight: "1px solid #059669",
//     borderBottom: "2px solid #065f46",
//     position: "sticky",
//     top: 0,
//     zIndex: 10,
//   },
//   td: {
//     padding: "0.5rem 0.625rem",
//     borderBottom: "1px solid #f3f4f6",
//     borderRight: "1px solid #f9fafb",
//     verticalAlign: "middle",
//   },
//   nodeRow: {
//     background: "white",
//     transition: "background 0.15s",
//   },
//   optionRow: {
//     background: "#f9fafb",
//   },
//   nodeKeyBadge: {
//     display: "inline-block",
//     padding: "0.25rem 0.625rem",
//     background: "#111827",
//     color: "white",
//     borderRadius: "4px",
//     fontFamily: "JetBrains Mono, monospace",
//     fontSize: "0.75rem",
//     fontWeight: 600,
//   },
//   expandBtn: {
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontSize: "0.75rem",
//     padding: "0.25rem",
//     color: "#6b7280",
//   },
//   inputInline: {
//     width: "100%",
//     padding: "0.375rem 0.5rem",
//     border: "1px solid #e5e7eb",
//     borderRadius: "3px",
//     fontSize: "0.813rem",
//     fontFamily: "inherit",
//   },
//   selectInline: {
//     width: "100%",
//     padding: "0.375rem 0.5rem",
//     border: "1px solid #e5e7eb",
//     borderRadius: "3px",
//     fontSize: "0.813rem",
//     fontFamily: "inherit",
//     background: "white",
//   },
//   btnInline: {
//     padding: "0.25rem 0.5rem",
//     border: "1px solid #d1d5db",
//     borderRadius: "3px",
//     fontSize: "0.75rem",
//     background: "white",
//     cursor: "pointer",
//     marginLeft: "0.5rem",
//   },
//   btnSmall: {
//     padding: "0.25rem 0.5rem",
//     border: "1px solid #d1d5db",
//     borderRadius: "3px",
//     fontSize: "0.7rem",
//     background: "white",
//     cursor: "pointer",
//   },
// };

"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

// ============================================================
// TYPES
// ============================================================
type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
type SeverityLevel = "GREEN" | "AMBER" | "RED";

type FlowOption = {
  display_order: number;
  label: string;
  value: string;
  severity: SeverityLevel;
  news2_score: number;
  seriousness_points: number;
  next_node_key: string | null;
};

type FlowNode = {
  node_key: string;
  node_type: FlowNodeType;
  title: string | null;
  body_text: string;
  help_text: string | null;
  parent_node_key: string | null;
  depth_level: number;
  default_next_node_key: string | null;
  auto_next_node_key: string | null;
  ui_ack_required: boolean;
  alert_severity: SeverityLevel | null;
  notify_admin: boolean;
  options: FlowOption[];
};

type Flow = {
  id: number;
  name: string;
  description: string;
  flow_type: string;
  status: string;
  start_node_key: string;
  version: number;
  nodes: FlowNode[];
};

type FlowListItem = {
  id: number;
  name: string;
  description: string;
  flow_type: string;
  status: string;
  node_count: number;
  version: number;
};

// ============================================================
// API HELPER (Same as dashboard)
// ============================================================
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

async function apiPut(url: string, accessToken: string, body: any) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data?.detail || data?.message || "Request failed");
  return data;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function FlowsPage() {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState<FlowListItem[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<number | null>(null);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load flows on mount
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    loadFlows(access);
  }, [router]);

  // Load flow when selected
  useEffect(() => {
    if (!selectedFlowId) return;
    const access = localStorage.getItem("access_token");
    if (!access) return;
    loadFlow(access, selectedFlowId);
  }, [selectedFlowId]);

  // API Functions
  async function loadFlows(accessToken: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await apiGet<{ total: number; items: FlowListItem[] }>(
        `${API_BASE}/flows/`,
        accessToken,
      );

      setFlows(data.items);

      if (data.items.length > 0 && !selectedFlowId) {
        setSelectedFlowId(data.items[0].id);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load flows");
    } finally {
      setLoading(false);
    }
  }

  async function loadFlow(accessToken: string, flowId: number) {
    try {
      setLoading(true);
      setError(null);

      const data = await apiGet<Flow>(
        `${API_BASE}/flows/${flowId}`,
        accessToken,
      );

      setFlow(data);
      setExpandedNodes(new Set(data.nodes.map((n) => n.node_key)));
      setHasUnsavedChanges(false);
    } catch (e: any) {
      setError(e?.message || "Failed to load flow");
    } finally {
      setLoading(false);
    }
  }

  async function saveFlow() {
    if (!flow) return;

    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: flow.name,
        description: flow.description,
        flow_type: flow.flow_type,
        status: flow.status,
        start_node_key: flow.start_node_key,
        nodes: flow.nodes,
      };

      const data = await apiPut(
        `${API_BASE}/flows/${flow.id}`,
        access,
        payload,
      );

      // Reload flow
      await loadFlow(access, flow.id);
      setHasUnsavedChanges(false);
      alert(`Flow saved successfully! Version: ${data.version}`);
    } catch (e: any) {
      setError(e?.message || "Failed to save flow");
      alert("Failed to save flow: " + (e?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function createDemoFlow() {
    const access = localStorage.getItem("access_token");
    if (!access) {
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await apiPost(`${API_BASE}/flows/demo/seed`, access);

      alert(`Demo flow created: ${data.message}`);
      await loadFlows(access);
      setSelectedFlowId(data.flow_id);
    } catch (e: any) {
      setError(e?.message || "Failed to create demo flow");
      alert("Failed to create demo flow: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  // Node functions
  function toggleNode(nodeKey: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeKey)) {
        next.delete(nodeKey);
      } else {
        next.add(nodeKey);
      }
      return next;
    });
  }

  function hasChildren(nodeKey: string): boolean {
    if (!flow) return false;
    return flow.nodes.some((n) => n.parent_node_key === nodeKey);
  }

  function getVisibleNodes(): FlowNode[] {
    if (!flow) return [];

    const nodeMap = new Map(flow.nodes.map((n) => [n.node_key, n]));

    function shouldShow(node: FlowNode): boolean {
      if (!node.parent_node_key) return true;
      const parent = nodeMap.get(node.parent_node_key);
      if (!parent) return true;
      return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
    }

    return flow.nodes.filter(shouldShow);
  }

  function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
    if (!flow) return;

    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.node_key === nodeKey ? { ...n, ...updates } : n,
        ),
      };
    });
    setHasUnsavedChanges(true);
  }

  function updateOption(
    nodeKey: string,
    optionIdx: number,
    updates: Partial<FlowOption>,
  ) {
    if (!flow) return;

    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key === nodeKey) {
            const options = [...n.options];
            options[optionIdx] = { ...options[optionIdx], ...updates };
            return { ...n, options };
          }
          return n;
        }),
      };
    });
    setHasUnsavedChanges(true);
  }

  function addOption(nodeKey: string) {
    if (!flow) return;

    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key === nodeKey) {
            return {
              ...n,
              options: [
                ...n.options,
                {
                  display_order: n.options.length + 1,
                  label: "New Option",
                  value: `opt_${n.options.length + 1}`,
                  severity: "GREEN" as SeverityLevel,
                  news2_score: 0,
                  seriousness_points: 0,
                  next_node_key: null,
                },
              ],
            };
          }
          return n;
        }),
      };
    });
    setHasUnsavedChanges(true);
  }

  function removeOption(nodeKey: string, optionIdx: number) {
    if (!flow) return;

    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key === nodeKey) {
            if (n.options.length <= 2) return n;
            return {
              ...n,
              options: n.options.filter((_, i) => i !== optionIdx),
            };
          }
          return n;
        }),
      };
    });
    setHasUnsavedChanges(true);
  }

  function addNode(parentKey: string | null = null) {
    if (!flow) return;

    const newKey = parentKey
      ? `${parentKey}.${flow.nodes.filter((n) => n.parent_node_key === parentKey).length + 1}`
      : `${flow.nodes.filter((n) => !n.parent_node_key).length + 1}`;

    const newNode: FlowNode = {
      node_key: newKey,
      node_type: "QUESTION",
      title: "New Question",
      body_text: "Enter your question here",
      help_text: null,
      parent_node_key: parentKey,
      depth_level: newKey.split(".").length - 1,
      default_next_node_key: null,
      auto_next_node_key: null,
      ui_ack_required: false,
      alert_severity: null,
      notify_admin: false,
      options: [
        {
          display_order: 1,
          label: "Option 1",
          value: "opt1",
          severity: "GREEN",
          news2_score: 0,
          seriousness_points: 0,
          next_node_key: null,
        },
        {
          display_order: 2,
          label: "Option 2",
          value: "opt2",
          severity: "GREEN",
          news2_score: 0,
          seriousness_points: 0,
          next_node_key: null,
        },
      ],
    };

    setFlow((prev) => {
      if (!prev) return prev;
      return { ...prev, nodes: [...prev.nodes, newNode] };
    });
    setExpandedNodes((prev) => new Set([...prev, newKey]));
    setHasUnsavedChanges(true);
  }

  function getAvailableNextNodes(): Array<{ key: string; label: string }> {
    if (!flow)
      return [
        { key: "", label: "-- Select Next Node --" },
        { key: "END", label: "END - Complete Flow" },
      ];

    const options = [
      { key: "", label: "-- Select Next Node --" },
      { key: "END", label: "END - Complete Flow" },
    ];

    flow.nodes.forEach((node) => {
      const label = `${node.node_key} - ${node.body_text}`;
      options.push({ key: node.node_key, label });
    });

    return options;
  }

  function exportFlow() {
    if (!flow) return;

    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `flow_${flow.name.replace(/\s+/g, "_")}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  const visibleNodes = getVisibleNodes();

  if (loading && !flow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading flows...</div>
      </div>
    );
  }

  // No flows state
  if (!loading && flows.length === 0 && !flow) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              📋 Flow Builder
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </header>

        <main className="w-full px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Flows Found
            </h2>
            <p className="text-gray-600 mb-6">
              Create a demo flow to get started with the flow builder.
            </p>
            <button
              onClick={createDemoFlow}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Create Demo Flow
            </button>
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 py-4 flex items-center gap-4">
          <div className="text-lg font-bold text-gray-900">📋 Flow Builder</div>

          {/* Flow Selector */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            value={selectedFlowId || ""}
            onChange={(e) => setSelectedFlowId(Number(e.target.value))}
          >
            <option value="">-- Select Flow --</option>
            {flows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} (v{f.version}) - {f.node_count} nodes
              </option>
            ))}
          </select>

          {flow && (
            <>
              <input
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={flow.name}
                onChange={(e) => {
                  setFlow((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  );
                  setHasUnsavedChanges(true);
                }}
                placeholder="Flow name..."
              />

              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase">
                {flow.status}
              </span>

              {hasUnsavedChanges && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                  ● Unsaved
                </span>
              )}
            </>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={createDemoFlow}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium"
            >
              Create Demo
            </button>

            <button
              onClick={() => {
                const access = localStorage.getItem("access_token");
                if (access) loadFlows(access);
              }}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium"
            >
              ↻ Refresh
            </button>

            {flow && (
              <>
                <button
                  onClick={exportFlow}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium"
                >
                  Export JSON
                </button>

                <button
                  onClick={saveFlow}
                  disabled={saving || !hasUnsavedChanges}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "💾 Save Flow"}
                </button>
              </>
            )}

            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
          <div className="text-red-700">
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

      {/* Main Content */}
      {flow && (
        <main className="w-full px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-900">
                {flow.name} (Version {flow.version})
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addNode(null)}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm font-medium"
                >
                  + Add Root Node
                </button>

                <button
                  onClick={() =>
                    setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)))
                  }
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm font-medium"
                >
                  ▼ Expand All
                </button>

                <button
                  onClick={() => setExpandedNodes(new Set())}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm font-medium"
                >
                  ▶ Collapse All
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-10"></th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-24">
                      Node
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-32">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase min-w-[300px]">
                      Body Text
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-64">
                      Next Node
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-96">
                      Options / Settings
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleNodes.map((node) => {
                    const hasChild = hasChildren(node.node_key);
                    const isExpanded = expandedNodes.has(node.node_key);
                    const indent = node.depth_level * 32;
                    const isEditing = editingNodeKey === node.node_key;

                    return (
                      <Fragment key={node.node_key}>
                        {/* Node Row */}
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2">
                            {hasChild && (
                              <button
                                onClick={() => toggleNode(node.node_key)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                {isExpanded ? "▼" : "▶"}
                              </button>
                            )}
                          </td>

                          <td
                            className="px-3 py-2"
                            style={{ paddingLeft: `${indent + 12}px` }}
                          >
                            <span className="inline-block px-2 py-1 bg-gray-900 text-white rounded text-xs font-mono font-semibold">
                              {node.node_key}
                            </span>
                          </td>

                          <td className="px-3 py-2">
                            <select
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              value={node.node_type}
                              onChange={(e) =>
                                updateNode(node.node_key, {
                                  node_type: e.target.value as FlowNodeType,
                                })
                              }
                            >
                              <option value="QUESTION">Question</option>
                              <option value="MESSAGE">Message</option>
                              <option value="ALERT">Alert</option>
                            </select>
                          </td>

                          <td className="px-3 py-2">
                            <input
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              value={node.body_text}
                              onChange={(e) =>
                                updateNode(node.node_key, {
                                  body_text: e.target.value,
                                })
                              }
                              placeholder="Question or message..."
                            />
                          </td>

                          <td className="px-3 py-2">
                            {node.node_type === "QUESTION" ? (
                              <select
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                value={node.default_next_node_key || ""}
                                onChange={(e) =>
                                  updateNode(node.node_key, {
                                    default_next_node_key:
                                      e.target.value || null,
                                  })
                                }
                              >
                                {getAvailableNextNodes().map((opt) => (
                                  <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                value={node.auto_next_node_key || ""}
                                onChange={(e) =>
                                  updateNode(node.node_key, {
                                    auto_next_node_key: e.target.value || null,
                                  })
                                }
                              >
                                {getAvailableNextNodes().map((opt) => (
                                  <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>

                          <td className="px-3 py-2">
                            {node.node_type === "QUESTION" && (
                              <div className="text-xs text-gray-600">
                                {node.options.length} options
                                <button
                                  onClick={() =>
                                    setEditingNodeKey(
                                      isEditing ? null : node.node_key,
                                    )
                                  }
                                  className="ml-2 px-2 py-0.5 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
                                >
                                  {isEditing ? "Hide" : "Edit"}
                                </button>
                              </div>
                            )}
                            {node.node_type === "ALERT" && (
                              <select
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                value={node.alert_severity || "RED"}
                                onChange={(e) =>
                                  updateNode(node.node_key, {
                                    alert_severity: e.target
                                      .value as SeverityLevel,
                                  })
                                }
                              >
                                <option value="GREEN">Green</option>
                                <option value="AMBER">Amber</option>
                                <option value="RED">Red</option>
                              </select>
                            )}
                          </td>

                          <td className="px-3 py-2">
                            <button
                              onClick={() => addNode(node.node_key)}
                              className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
                            >
                              + Child
                            </button>
                          </td>
                        </tr>

                        {/* Options Rows */}
                        {isEditing &&
                          node.node_type === "QUESTION" &&
                          node.options.map((opt, idx) => (
                            <tr
                              key={`${node.node_key}-opt-${idx}`}
                              className="bg-gray-50 border-b border-gray-100"
                            >
                              <td colSpan={2} className="px-3 py-2"></td>
                              <td className="px-3 py-2">
                                <span className="text-xs text-gray-600">
                                  Option {idx + 1}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={opt.label}
                                  onChange={(e) =>
                                    updateOption(node.node_key, idx, {
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="Option label"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <select
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={opt.next_node_key || ""}
                                  onChange={(e) =>
                                    updateOption(node.node_key, idx, {
                                      next_node_key: e.target.value || null,
                                    })
                                  }
                                >
                                  {getAvailableNextNodes().map((nextOpt) => (
                                    <option
                                      key={nextOpt.key}
                                      value={nextOpt.key}
                                    >
                                      {nextOpt.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <select
                                    className="px-2 py-1 border border-gray-300 rounded w-24"
                                    value={opt.severity}
                                    onChange={(e) =>
                                      updateOption(node.node_key, idx, {
                                        severity: e.target
                                          .value as SeverityLevel,
                                      })
                                    }
                                  >
                                    <option value="GREEN">Green</option>
                                    <option value="AMBER">Amber</option>
                                    <option value="RED">Red</option>
                                  </select>
                                  <input
                                    className="px-2 py-1 border border-gray-300 rounded w-16"
                                    type="number"
                                    value={opt.news2_score}
                                    onChange={(e) =>
                                      updateOption(node.node_key, idx, {
                                        news2_score: Number(e.target.value),
                                      })
                                    }
                                    placeholder="NEWS2"
                                    title="NEWS2 Score"
                                  />
                                  <input
                                    className="px-2 py-1 border border-gray-300 rounded w-16"
                                    type="number"
                                    value={opt.seriousness_points}
                                    onChange={(e) =>
                                      updateOption(node.node_key, idx, {
                                        seriousness_points: Number(
                                          e.target.value,
                                        ),
                                      })
                                    }
                                    placeholder="Points"
                                    title="Seriousness Points"
                                  />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() =>
                                    removeOption(node.node_key, idx)
                                  }
                                  disabled={node.options.length <= 2}
                                  className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs disabled:opacity-50"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}

                        {/* Add Option Button */}
                        {isEditing && node.node_type === "QUESTION" && (
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <td colSpan={6} className="px-3 py-2">
                              <button
                                onClick={() => addOption(node.node_key)}
                                className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-sm"
                              >
                                + Add Option
                              </button>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
