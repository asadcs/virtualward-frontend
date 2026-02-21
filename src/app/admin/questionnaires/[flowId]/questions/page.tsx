// // // // // "use client";

// // // // // import { Fragment, useEffect, useMemo, useState } from "react";
// // // // // import { useParams, useRouter } from "next/navigation";

// // // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // // type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// // // // // type SeverityLevel = "GREEN" | "AMBER" | "RED";

// // // // // type FlowOption = {
// // // // //   display_order: number;
// // // // //   label: string;
// // // // //   value: string;
// // // // //   severity: SeverityLevel;
// // // // //   news2_score: number;
// // // // //   seriousness_points: number;
// // // // //   next_node_key: string | null;
// // // // // };

// // // // // type Category = 1 | 2;

// // // // // const CATEGORY_LABEL: Record<Category, string> = {
// // // // //   1: "Clinical Obs – Colorectal",
// // // // //   2: "Symptoms and signs",
// // // // // };

// // // // // type FlowNode = {
// // // // //   node_key: string;
// // // // //   node_type: FlowNodeType;
// // // // //   category: Category;

// // // // //   title: string | null;
// // // // //   body_text: string;
// // // // //   help_text: string | null;

// // // // //   parent_node_key: string | null;
// // // // //   depth_level: number;

// // // // //   // kept for backward compatibility from backend model, but NOT used in UI
// // // // //   default_next_node_key: string | null;
// // // // //   auto_next_node_key: string | null;

// // // // //   ui_ack_required: boolean;
// // // // //   alert_severity: SeverityLevel | null;
// // // // //   notify_admin: boolean;

// // // // //   options: FlowOption[];
// // // // // };

// // // // // type Flow = {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   description: string;
// // // // //   flow_type: string;
// // // // //   status: string;
// // // // //   start_node_key: string;
// // // // //   version: number;
// // // // //   nodes: FlowNode[];
// // // // // };

// // // // // // ------------------ API helpers ------------------
// // // // // async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// // // // //   const res = await fetch(url, {
// // // // //     headers: { Authorization: `Bearer ${accessToken}` },
// // // // //     cache: "no-store",
// // // // //   });
// // // // //   const body = await res.json().catch(() => null);
// // // // //   if (!res.ok)
// // // // //     throw new Error(body?.detail || body?.message || "Request failed");
// // // // //   return body as T;
// // // // // }

// // // // // async function apiPut<T>(
// // // // //   url: string,
// // // // //   accessToken: string,
// // // // //   body: any,
// // // // // ): Promise<T> {
// // // // //   const res = await fetch(url, {
// // // // //     method: "PUT",
// // // // //     headers: {
// // // // //       Authorization: `Bearer ${accessToken}`,
// // // // //       "Content-Type": "application/json",
// // // // //     },
// // // // //     body: JSON.stringify(body),
// // // // //   });
// // // // //   const data = await res.json().catch(() => ({}));
// // // // //   if (!res.ok)
// // // // //     throw new Error(data?.detail || data?.message || "Request failed");
// // // // //   return data as T;
// // // // // }

// // // // // // ------------------ UI helpers ------------------
// // // // // const SEVERITY_ORDER: Record<SeverityLevel, number> = {
// // // // //   GREEN: 1,
// // // // //   AMBER: 2,
// // // // //   RED: 3,
// // // // // };
// // // // // function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
// // // // //   return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
// // // // // }
// // // // // function badgeColorClass() {
// // // // //   // you asked for same color for node badge blocks; keeping teal consistent
// // // // //   return "bg-teal-600 text-white";
// // // // // }

// // // // // const BTN_PRIMARY =
// // // // //   "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // // // const BTN_OUTLINE =
// // // // //   "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // // // const BTN_DANGER =
// // // // //   "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// // // // // type ValidationItem = {
// // // // //   level: "ERROR" | "WARNING";
// // // // //   title: string; // short heading
// // // // //   where: string; // human location
// // // // //   howToFix: string; // step to fix
// // // // // };

// // // // // type ValidationState = {
// // // // //   ran: boolean;
// // // // //   valid: boolean;
// // // // //   items: ValidationItem[];
// // // // // };

// // // // // type PreviewState = {
// // // // //   open: boolean;
// // // // //   currentKey: string | "END";
// // // // //   history: string[]; // node keys stack
// // // // //   answers: Record<string, string>; // node_key -> selected option label
// // // // //   // used to drive routing
// // // // //   selectedOptionValueByNode: Record<string, string>; // node_key -> option.value
// // // // // };

// // // // // // ------------------ main component ------------------
// // // // // export default function QuestionManagementPage() {
// // // // //   const router = useRouter();
// // // // //   const params = useParams<{ flowId: string }>();
// // // // //   const flowId = Number(params.flowId);

// // // // //   const [sidebarOpen, setSidebarOpen] = useState(true);

// // // // //   const token = useMemo(
// // // // //     () =>
// // // // //       typeof window !== "undefined"
// // // // //         ? localStorage.getItem("access_token")
// // // // //         : null,
// // // // //     [],
// // // // //   );

// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [flow, setFlow] = useState<Flow | null>(null);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// // // // //   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
// // // // //   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

// // // // //   const [collapsedCategories, setCollapsedCategories] = useState<
// // // // //     Record<Category, boolean>
// // // // //   >({
// // // // //     1: false,
// // // // //     2: false,
// // // // //   });

// // // // //   const [validation, setValidation] = useState<ValidationState>({
// // // // //     ran: false,
// // // // //     valid: false,
// // // // //     items: [],
// // // // //   });

// // // // //   const [preview, setPreview] = useState<PreviewState>({
// // // // //     open: false,
// // // // //     currentKey: "END",
// // // // //     history: [],
// // // // //     answers: {},
// // // // //     selectedOptionValueByNode: {},
// // // // //   });

// // // // //   // ------------------ auth / load ------------------
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
// // // // //     if (!token) {
// // // // //       router.replace("/login");
// // // // //       return;
// // // // //     }
// // // // //     if (!Number.isFinite(flowId) || flowId <= 0) {
// // // // //       setError("Invalid flowId in route");
// // // // //       setLoading(false);
// // // // //       return;
// // // // //     }
// // // // //     loadFlow();
// // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // //   }, [token, flowId]);

// // // // //   async function loadFlow() {
// // // // //     if (!token) return;
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       setError(null);

// // // // //       const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

// // // // //       // Ensure ALERT nodes always have a real stored default severity, not just UI fallback
// // // // //       const fixed = {
// // // // //         ...data,
// // // // //         nodes: (data.nodes || []).map((n) =>
// // // // //           n.node_type === "ALERT" && !n.alert_severity
// // // // //             ? { ...n, alert_severity: "RED" }
// // // // //             : n,
// // // // //         ),
// // // // //       };

// // // // //       setFlow(fixed);
// // // // //       setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
// // // // //       setHasUnsavedChanges(false);

// // // // //       // reset validation on load
// // // // //       setValidation({ ran: false, valid: false, items: [] });
// // // // //     } catch (e: any) {
// // // // //       setError(e?.message || "Failed to load flow");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   }

// // // // //   async function saveFlow() {
// // // // //     if (!token || !flow) return;

// // // // //     // enforce: must be validated + has unsaved changes
// // // // //     if (!validation.ran || !validation.valid) {
// // // // //       alert("Please validate the questionnaire before saving.");
// // // // //       return;
// // // // //     }
// // // // //     if (!hasUnsavedChanges) {
// // // // //       alert("No changes to save.");
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setSaving(true);
// // // // //       setError(null);

// // // // //       const payload = {
// // // // //         name: flow.name,
// // // // //         description: flow.description,
// // // // //         flow_type: flow.flow_type,
// // // // //         status: flow.status,
// // // // //         start_node_key: flow.start_node_key,
// // // // //         nodes: flow.nodes,
// // // // //       };

// // // // //       const data = await apiPut<any>(
// // // // //         `${API_BASE}/flows/${flow.id}`,
// // // // //         token,
// // // // //         payload,
// // // // //       );
// // // // //       await loadFlow();
// // // // //       setHasUnsavedChanges(false);
// // // // //       alert(`Saved! Version: ${data.version ?? "?"}`);
// // // // //     } catch (e: any) {
// // // // //       setError(e?.message || "Failed to save flow");
// // // // //       alert("Failed to save: " + (e?.message || "Unknown error"));
// // // // //     } finally {
// // // // //       setSaving(false);
// // // // //     }
// // // // //   }

// // // // //   // ------------------ helpers: indexes/maps ------------------
// // // // //   function nodeMap(): Map<string, FlowNode> {
// // // // //     return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
// // // // //   }

// // // // //   function childrenMap(): Map<string, FlowNode[]> {
// // // // //     const map = new Map<string, FlowNode[]>();
// // // // //     for (const n of flow?.nodes || []) {
// // // // //       if (!n.parent_node_key) continue;
// // // // //       const arr = map.get(n.parent_node_key) || [];
// // // // //       arr.push(n);
// // // // //       map.set(n.parent_node_key, arr);
// // // // //     }
// // // // //     return map;
// // // // //   }

// // // // //   function hasChildren(nodeKey: string): boolean {
// // // // //     if (!flow) return false;
// // // // //     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
// // // // //   }

// // // // //   function toggleNode(nodeKey: string) {
// // // // //     setExpandedNodes((prev) => {
// // // // //       const next = new Set(prev);
// // // // //       next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
// // // // //       return next;
// // // // //     });
// // // // //   }

// // // // //   function expandAllNodes() {
// // // // //     if (!flow) return;
// // // // //     setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
// // // // //   }
// // // // //   function collapseAllNodes() {
// // // // //     setExpandedNodes(new Set());
// // // // //   }

// // // // //   function getVisibleNodesByCategory(category: Category): FlowNode[] {
// // // // //     if (!flow) return [];
// // // // //     const nm = nodeMap();
// // // // //     function shouldShow(node: FlowNode): boolean {
// // // // //       if (node.category !== category) return false;
// // // // //       if (!node.parent_node_key) return true;
// // // // //       const parent = nm.get(node.parent_node_key);
// // // // //       if (!parent) return true;
// // // // //       if (parent.category !== category) return false;
// // // // //       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
// // // // //     }
// // // // //     return flow.nodes.filter(shouldShow);
// // // // //   }

// // // // //   // per-category numbering starts from 1
// // // // //   function getCategorySequenceNumber(nodeKey: string): number {
// // // // //     if (!flow) return 0;
// // // // //     const n = flow.nodes.find((x) => x.node_key === nodeKey);
// // // // //     if (!n) return 0;
// // // // //     const sameCat = flow.nodes.filter((x) => x.category === n.category);
// // // // //     // stable sort by display order (flow.nodes order already)
// // // // //     const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
// // // // //     return idx >= 0 ? idx + 1 : 0;
// // // // //   }

// // // // //   // Next-node dropdown values: only nodes in same category + END
// // // // //   function getAvailableNextNodes(
// // // // //     category: Category,
// // // // //   ): Array<{ key: string; label: string }> {
// // // // //     const base = [
// // // // //       { key: "", label: "-- Select Next --" },
// // // // //       { key: "END", label: "END - Complete Flow" },
// // // // //     ];
// // // // //     if (!flow) return base;

// // // // //     const sameCategory = flow.nodes.filter((n) => n.category === category);
// // // // //     return [
// // // // //       ...base,
// // // // //       ...sameCategory.map((node) => ({
// // // // //         key: node.node_key,
// // // // //         label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
// // // // //       })),
// // // // //     ];
// // // // //   }

// // // // //   // ------------------ state update utilities ------------------
// // // // //   function markChanged() {
// // // // //     setHasUnsavedChanges(true);
// // // // //     // any edit invalidates previous validation
// // // // //     setValidation({ ran: false, valid: false, items: [] });
// // // // //   }

// // // // //   function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
// // // // //     if (!flow) return;

// // // // //     setFlow((prev) => {
// // // // //       if (!prev) return prev;

// // // // //       const updatedNodes = prev.nodes.map((n) => {
// // // // //         if (n.node_key !== nodeKey) return n;

// // // // //         // If switching to ALERT, ensure alert_severity exists in STATE (not just UI)
// // // // //         if (updates.node_type === "ALERT") {
// // // // //           return {
// // // // //             ...n,
// // // // //             ...updates,
// // // // //             options: [], // alerts should not have options
// // // // //             alert_severity: (updates.alert_severity ??
// // // // //               n.alert_severity ??
// // // // //               "RED") as SeverityLevel,
// // // // //           };
// // // // //         }

// // // // //         // If switching to MESSAGE, wipe options + severity
// // // // //         if (updates.node_type === "MESSAGE") {
// // // // //           return {
// // // // //             ...n,
// // // // //             ...updates,
// // // // //             options: [],
// // // // //             alert_severity: null,
// // // // //           };
// // // // //         }

// // // // //         // If switching to QUESTION, ensure at least 2 options
// // // // //         if (updates.node_type === "QUESTION") {
// // // // //           const options =
// // // // //             n.options?.length >= 2 ? n.options : makeDefaultOptions();
// // // // //           return { ...n, ...updates, options };
// // // // //         }

// // // // //         return { ...n, ...updates };
// // // // //       });

// // // // //       return { ...prev, nodes: updatedNodes };
// // // // //     });

// // // // //     markChanged();
// // // // //   }

// // // // //   function updateOption(
// // // // //     nodeKey: string,
// // // // //     optionIdx: number,
// // // // //     updates: Partial<FlowOption>,
// // // // //   ) {
// // // // //     if (!flow) return;

// // // // //     setFlow((prev) => {
// // // // //       if (!prev) return prev;
// // // // //       return {
// // // // //         ...prev,
// // // // //         nodes: prev.nodes.map((n) => {
// // // // //           if (n.node_key !== nodeKey) return n;
// // // // //           const options = [...(n.options || [])];
// // // // //           options[optionIdx] = { ...options[optionIdx], ...updates };
// // // // //           return { ...n, options };
// // // // //         }),
// // // // //       };
// // // // //     });

// // // // //     markChanged();
// // // // //   }

// // // // //   function makeDefaultOptions(): FlowOption[] {
// // // // //     return [
// // // // //       {
// // // // //         display_order: 1,
// // // // //         label: "Option 1",
// // // // //         value: "opt1",
// // // // //         severity: "GREEN",
// // // // //         news2_score: 0,
// // // // //         seriousness_points: 0,
// // // // //         next_node_key: null,
// // // // //       },
// // // // //       {
// // // // //         display_order: 2,
// // // // //         label: "Option 2",
// // // // //         value: "opt2",
// // // // //         severity: "GREEN",
// // // // //         news2_score: 0,
// // // // //         seriousness_points: 0,
// // // // //         next_node_key: null,
// // // // //       },
// // // // //     ];
// // // // //   }

// // // // //   function addOption(nodeKey: string) {
// // // // //     if (!flow) return;
// // // // //     setFlow((prev) => {
// // // // //       if (!prev) return prev;
// // // // //       return {
// // // // //         ...prev,
// // // // //         nodes: prev.nodes.map((n) => {
// // // // //           if (n.node_key !== nodeKey) return n;
// // // // //           const nextIndex = (n.options?.length || 0) + 1;
// // // // //           return {
// // // // //             ...n,
// // // // //             options: [
// // // // //               ...(n.options || []),
// // // // //               {
// // // // //                 display_order: nextIndex,
// // // // //                 label: `Option ${nextIndex}`,
// // // // //                 value: `opt_${nextIndex}`,
// // // // //                 severity: "GREEN",
// // // // //                 news2_score: 0,
// // // // //                 seriousness_points: 0,
// // // // //                 next_node_key: null,
// // // // //               },
// // // // //             ],
// // // // //           };
// // // // //         }),
// // // // //       };
// // // // //     });
// // // // //     markChanged();
// // // // //   }

// // // // //   function removeOption(nodeKey: string, optionIdx: number) {
// // // // //     if (!flow) return;
// // // // //     setFlow((prev) => {
// // // // //       if (!prev) return prev;
// // // // //       return {
// // // // //         ...prev,
// // // // //         nodes: prev.nodes.map((n) => {
// // // // //           if (n.node_key !== nodeKey) return n;
// // // // //           if ((n.options?.length || 0) <= 2) return n; // must keep >=2
// // // // //           const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
// // // // //           // re-order display_order
// // // // //           const resequenced = filtered.map((o, i) => ({
// // // // //             ...o,
// // // // //             display_order: i + 1,
// // // // //           }));
// // // // //           return { ...n, options: resequenced };
// // // // //         }),
// // // // //       };
// // // // //     });
// // // // //     markChanged();
// // // // //   }

// // // // //   function addNode(category: Category, parentKey: string | null = null) {
// // // // //     if (!flow) return;

// // // // //     // numbering per category must start at 1; node_key itself can remain whatever, but you asked numbering display to start at 1
// // // // //     // node_key generation: keep deterministic and unique
// // // // //     const siblingsCount = flow.nodes.filter(
// // // // //       (n) => n.parent_node_key === parentKey && n.category === category,
// // // // //     ).length;
// // // // //     const newKey = parentKey
// // // // //       ? `${parentKey}.${siblingsCount + 1}`
// // // // //       : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

// // // // //     const newNode: FlowNode = {
// // // // //       node_key: newKey,
// // // // //       node_type: "QUESTION",
// // // // //       category,
// // // // //       title: "New Question",
// // // // //       body_text: "Enter your question here",
// // // // //       help_text: null,
// // // // //       parent_node_key: parentKey,
// // // // //       depth_level: newKey.split(".").length - 1,
// // // // //       default_next_node_key: null,
// // // // //       auto_next_node_key: null,
// // // // //       ui_ack_required: false,
// // // // //       alert_severity: null,
// // // // //       notify_admin: false,
// // // // //       options: makeDefaultOptions(),
// // // // //     };

// // // // //     setFlow((prev) =>
// // // // //       prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
// // // // //     );
// // // // //     setExpandedNodes((prev) => new Set([...prev, newKey]));
// // // // //     markChanged();
// // // // //   }

// // // // //   // ------------------ delete node (cascade descendants + clear references) ------------------
// // // // //   function collectDescendants(rootKey: string): Set<string> {
// // // // //     const cm = childrenMap();
// // // // //     const toDelete = new Set<string>();
// // // // //     const stack = [rootKey];
// // // // //     while (stack.length) {
// // // // //       const k = stack.pop()!;
// // // // //       if (toDelete.has(k)) continue;
// // // // //       toDelete.add(k);
// // // // //       const kids = cm.get(k) || [];
// // // // //       for (const child of kids) stack.push(child.node_key);
// // // // //     }
// // // // //     return toDelete;
// // // // //   }

// // // // //   function deleteNodeCascade(nodeKey: string) {
// // // // //     if (!flow) return;
// // // // //     const toDelete = collectDescendants(nodeKey);

// // // // //     setFlow((prev) => {
// // // // //       if (!prev) return prev;

// // // // //       const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

// // // // //       // auto-clear references to deleted nodes
// // // // //       const cleaned = remaining.map((n) => {
// // // // //         if (n.node_type !== "QUESTION") return n;

// // // // //         const newOptions = (n.options || []).map((o) => {
// // // // //           if (o.next_node_key && toDelete.has(o.next_node_key)) {
// // // // //             return { ...o, next_node_key: null };
// // // // //           }
// // // // //           return o;
// // // // //         });

// // // // //         const newParent =
// // // // //           n.parent_node_key && toDelete.has(n.parent_node_key)
// // // // //             ? null
// // // // //             : n.parent_node_key;

// // // // //         return { ...n, parent_node_key: newParent, options: newOptions };
// // // // //       });

// // // // //       // if start_node_key deleted, keep it and let validation catch it (as you wanted)
// // // // //       return { ...prev, nodes: cleaned };
// // // // //     });

// // // // //     // collapse editing panel if deleted
// // // // //     if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);

// // // // //     markChanged();
// // // // //   }

// // // // //   // ------------------ FRONTEND VALIDATION (human-readable) ------------------
// // // // //   function validateFrontend(): ValidationState {
// // // // //     if (!flow)
// // // // //       return {
// // // // //         ran: true,
// // // // //         valid: false,
// // // // //         items: [
// // // // //           {
// // // // //             level: "ERROR",
// // // // //             title: "Flow not loaded",
// // // // //             where: "Flow",
// // // // //             howToFix: "Reload the page and try again.",
// // // // //           },
// // // // //         ],
// // // // //       };

// // // // //     const items: ValidationItem[] = [];
// // // // //     const nm = nodeMap();
// // // // //     const keys = new Set([...nm.keys()]);
// // // // //     const allowedCats = new Set<number>([1, 2]);

// // // // //     // start node exists
// // // // //     if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
// // // // //       items.push({
// // // // //         level: "ERROR",
// // // // //         title: "Start node is missing or invalid",
// // // // //         where: `Start Node: ${flow.start_node_key || "(empty)"}`,
// // // // //         howToFix: `Set start_node_key to an existing node key (usually the first question).`,
// // // // //       });
// // // // //     }

// // // // //     // uniqueness (should be unique already, but validate anyway)
// // // // //     const seen = new Set<string>();
// // // // //     for (const n of flow.nodes) {
// // // // //       if (seen.has(n.node_key)) {
// // // // //         items.push({
// // // // //           level: "ERROR",
// // // // //           title: "Duplicate node key found",
// // // // //           where: `Node Key: ${n.node_key}`,
// // // // //           howToFix: "Ensure every node has a unique node_key.",
// // // // //         });
// // // // //       }
// // // // //       seen.add(n.node_key);
// // // // //     }

// // // // //     // category checks + parent checks
// // // // //     for (const n of flow.nodes) {
// // // // //       if (!allowedCats.has(n.category)) {
// // // // //         items.push({
// // // // //           level: "ERROR",
// // // // //           title: "Invalid category",
// // // // //           where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // // // //           howToFix:
// // // // //             "Category must be either 1 (Clinical Obs) or 2 (Symptoms & signs).",
// // // // //         });
// // // // //       }

// // // // //       if (n.parent_node_key) {
// // // // //         const parent = nm.get(n.parent_node_key);
// // // // //         if (!parent) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Parent node not found",
// // // // //             where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // // // //             howToFix: `Either fix parent_node_key or delete/recreate this node under a valid parent.`,
// // // // //           });
// // // // //         } else if (parent.category !== n.category) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Category mismatch between parent and child",
// // // // //             where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
// // // // //             howToFix: `Move the node under a parent in the same category (Category ${n.category}).`,
// // // // //           });
// // // // //         }
// // // // //       }
// // // // //     }

// // // // //     // next-node validity + node-type rules
// // // // //     for (const node of flow.nodes) {
// // // // //       const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

// // // // //       if (node.node_type === "QUESTION") {
// // // // //         if (!node.options || node.options.length < 2) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Question must have at least 2 options",
// // // // //             where: whereNode,
// // // // //             howToFix: "Add more options until there are at least 2.",
// // // // //           });
// // // // //         }

// // // // //         // Each option must have next_node_key (or END) - your rule
// // // // //         for (const opt of node.options || []) {
// // // // //           const whereOpt = `${whereNode} → Option "${opt.label}"`;

// // // // //           if (!opt.label || !opt.label.trim()) {
// // // // //             items.push({
// // // // //               level: "ERROR",
// // // // //               title: "Option label is empty",
// // // // //               where: whereOpt,
// // // // //               howToFix: "Give this option a meaningful label (e.g., Yes / No).",
// // // // //             });
// // // // //           }

// // // // //           if (!opt.next_node_key) {
// // // // //             items.push({
// // // // //               level: "ERROR",
// // // // //               title: "Option next step is missing",
// // // // //               where: whereOpt,
// // // // //               howToFix: `Select a Next node for this option (or choose END).`,
// // // // //             });
// // // // //           } else if (opt.next_node_key !== "END") {
// // // // //             const dst = nm.get(opt.next_node_key);
// // // // //             if (!dst) {
// // // // //               items.push({
// // // // //                 level: "ERROR",
// // // // //                 title: "Option points to a node that does not exist",
// // // // //                 where: whereOpt,
// // // // //                 howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
// // // // //               });
// // // // //             } else if (dst.category !== node.category) {
// // // // //               items.push({
// // // // //                 level: "ERROR",
// // // // //                 title: "Option next node must be in the same category",
// // // // //                 where: `${whereOpt} → Next "${dst.node_key}"`,
// // // // //                 howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
// // // // //               });
// // // // //             }
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       if (node.node_type === "MESSAGE") {
// // // // //         // end node
// // // // //         if (node.options && node.options.length > 0) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Message must not have options",
// // // // //             where: whereNode,
// // // // //             howToFix:
// // // // //               "Change node type to QUESTION if you need options, or remove options.",
// // // // //           });
// // // // //         }
// // // // //       }

// // // // //       if (node.node_type === "ALERT") {
// // // // //         // end node
// // // // //         if (!node.alert_severity) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Alert severity is missing",
// // // // //             where: whereNode,
// // // // //             howToFix: "Select Green / Amber / Red for this Alert.",
// // // // //           });
// // // // //         }
// // // // //         if (node.options && node.options.length > 0) {
// // // // //           items.push({
// // // // //             level: "ERROR",
// // // // //             title: "Alert must not have options",
// // // // //             where: whereNode,
// // // // //             howToFix:
// // // // //               "Alerts are end nodes. Remove options or change type to QUESTION.",
// // // // //           });
// // // // //         }
// // // // //       }
// // // // //     }

// // // // //     // optional: cycle detection (warning)
// // // // //     // Since you asked maturity first, we’ll mark cycle as ERROR because it breaks routing.
// // // // //     const graph = new Map<string, string[]>();
// // // // //     function addEdge(src: string, dst: string | null) {
// // // // //       if (!dst) return;
// // // // //       graph.set(src, [...(graph.get(src) || []), dst]);
// // // // //     }
// // // // //     for (const n of flow.nodes) {
// // // // //       if (n.node_type === "QUESTION") {
// // // // //         for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
// // // // //       }
// // // // //     }

// // // // //     const visited = new Set<string>();
// // // // //     const stack = new Set<string>();
// // // // //     function dfs(u: string): boolean {
// // // // //       if (u === "END") return false;
// // // // //       if (stack.has(u)) return true;
// // // // //       if (visited.has(u)) return false;
// // // // //       visited.add(u);
// // // // //       stack.add(u);
// // // // //       for (const v of graph.get(u) || []) {
// // // // //         if (v && dfs(v)) return true;
// // // // //       }
// // // // //       stack.delete(u);
// // // // //       return false;
// // // // //     }

// // // // //     if (flow.start_node_key && keys.has(flow.start_node_key)) {
// // // // //       if (dfs(flow.start_node_key)) {
// // // // //         items.push({
// // // // //           level: "ERROR",
// // // // //           title: "Flow contains a cycle (loop)",
// // // // //           where: `Start node path from ${flow.start_node_key}`,
// // // // //           howToFix:
// // // // //             "Break the loop by changing an option's Next to END or to a node that does not lead back.",
// // // // //         });
// // // // //       }
// // // // //     }

// // // // //     const valid = items.filter((x) => x.level === "ERROR").length === 0;
// // // // //     return { ran: true, valid, items };
// // // // //   }

// // // // //   function onValidateClick() {
// // // // //     const result = validateFrontend();
// // // // //     setValidation(result);
// // // // //     if (!result.valid) {
// // // // //       // scroll to top so user sees errors
// // // // //       window.scrollTo({ top: 0, behavior: "smooth" });
// // // // //     }
// // // // //   }

// // // // //   // ------------------ PREVIEW (frontend routing) ------------------
// // // // //   function openPreview() {
// // // // //     if (!flow) return;

// // // // //     const start =
// // // // //       flow.start_node_key && nodeMap().has(flow.start_node_key)
// // // // //         ? flow.start_node_key
// // // // //         : "END";
// // // // //     setPreview({
// // // // //       open: true,
// // // // //       currentKey: start,
// // // // //       history: [],
// // // // //       answers: {},
// // // // //       selectedOptionValueByNode: {},
// // // // //     });
// // // // //   }

// // // // //   function closePreview() {
// // // // //     setPreview((p) => ({ ...p, open: false }));
// // // // //   }

// // // // //   function previewCurrentNode(): FlowNode | null {
// // // // //     if (!flow) return null;
// // // // //     if (!preview.open) return null;
// // // // //     if (preview.currentKey === "END") return null;
// // // // //     return nodeMap().get(preview.currentKey) || null;
// // // // //   }

// // // // //   function previewSelectOption(nodeKey: string, opt: FlowOption) {
// // // // //     setPreview((p) => ({
// // // // //       ...p,
// // // // //       answers: { ...p.answers, [nodeKey]: opt.label },
// // // // //       selectedOptionValueByNode: {
// // // // //         ...p.selectedOptionValueByNode,
// // // // //         [nodeKey]: opt.value,
// // // // //       },
// // // // //     }));
// // // // //   }

// // // // //   function previewNext() {
// // // // //     if (!flow) return;
// // // // //     const current = previewCurrentNode();
// // // // //     if (!current) {
// // // // //       return;
// // // // //     }

// // // // //     // End nodes
// // // // //     if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
// // // // //       setPreview((p) => ({
// // // // //         ...p,
// // // // //         history: [...p.history, current.node_key],
// // // // //         currentKey: "END",
// // // // //       }));
// // // // //       return;
// // // // //     }

// // // // //     if (current.node_type === "QUESTION") {
// // // // //       // Find selected option
// // // // //       const selectedValue = preview.selectedOptionValueByNode[current.node_key];
// // // // //       const opt = (current.options || []).find(
// // // // //         (o) => o.value === selectedValue,
// // // // //       );

// // // // //       if (!opt) {
// // // // //         alert("Please select an answer.");
// // // // //         return;
// // // // //       }

// // // // //       const nextKey = opt.next_node_key || "END";

// // // // //       setPreview((p) => ({
// // // // //         ...p,
// // // // //         history: [...p.history, current.node_key],
// // // // //         currentKey: nextKey as any,
// // // // //       }));
// // // // //       return;
// // // // //     }
// // // // //   }

// // // // //   function previewBack() {
// // // // //     setPreview((p) => {
// // // // //       const hist = [...p.history];
// // // // //       const prevKey = hist.pop();
// // // // //       if (!prevKey) return p;
// // // // //       return { ...p, history: hist, currentKey: prevKey };
// // // // //     });
// // // // //   }

// // // // //   function previewRestart() {
// // // // //     openPreview();
// // // // //   }

// // // // //   function computePreviewTotals() {
// // // // //     if (!flow)
// // // // //       return {
// // // // //         totalNews2: 0,
// // // // //         totalPoints: 0,
// // // // //         overallSeverity: "GREEN" as SeverityLevel,
// // // // //       };

// // // // //     let totalNews2 = 0;
// // // // //     let totalPoints = 0;
// // // // //     let overallSeverity: SeverityLevel = "GREEN";

// // // // //     const nm = nodeMap();

// // // // //     for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
// // // // //       const node = nm.get(nodeKey);
// // // // //       if (!node || node.node_type !== "QUESTION") continue;

// // // // //       const selectedValue = preview.selectedOptionValueByNode[nodeKey];
// // // // //       const opt = (node.options || []).find((o) => o.value === selectedValue);
// // // // //       if (!opt) continue;

// // // // //       totalNews2 += Number(opt.news2_score || 0);
// // // // //       totalPoints += Number(opt.seriousness_points || 0);
// // // // //       overallSeverity = maxSeverity(overallSeverity, opt.severity);
// // // // //     }

// // // // //     // If current path reaches an ALERT node, include its severity (max)
// // // // //     const current = previewCurrentNode();
// // // // //     if (current?.node_type === "ALERT" && current.alert_severity) {
// // // // //       overallSeverity = maxSeverity(overallSeverity, current.alert_severity);
// // // // //     }

// // // // //     return { totalNews2, totalPoints, overallSeverity };
// // // // //   }

// // // // //   // ------------------ render guards ------------------
// // // // //   const visibleNodesCat1 = getVisibleNodesByCategory(1);
// // // // //   const visibleNodesCat2 = getVisibleNodesByCategory(2);

// // // // //   if (loading && !flow) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
// // // // //         <div className="text-gray-600">Loading questions...</div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   const currentPreviewNode = previewCurrentNode();
// // // // //   const totals = computePreviewTotals();

// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#f4f5fa] flex">
// // // // //       {/* Sidebar */}
// // // // //       <aside
// // // // //         className={`${
// // // // //           sidebarOpen ? "w-64" : "w-20"
// // // // //         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
// // // // //       >
// // // // //         <div className="p-6 border-b border-gray-200 flex items-center gap-3">
// // // // //           <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
// // // // //             <span className="text-white font-bold">VW</span>
// // // // //           </div>
// // // // //           {sidebarOpen && (
// // // // //             <span className="text-xl font-bold text-teal-600">
// // // // //               VIRTUAL WARD
// // // // //             </span>
// // // // //           )}
// // // // //         </div>

// // // // //         <nav className="flex-1 p-4 space-y-1">
// // // // //           <button
// // // // //             onClick={() => router.push("/admin/questionnaires")}
// // // // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-colors"
// // // // //           >
// // // // //             {sidebarOpen && <span>Questionnaires</span>}
// // // // //             {!sidebarOpen && <span>Q</span>}
// // // // //           </button>

// // // // //           <button
// // // // //             onClick={logout}
// // // // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
// // // // //           >
// // // // //             {sidebarOpen && <span>Logout</span>}
// // // // //             {!sidebarOpen && <span>⎋</span>}
// // // // //           </button>
// // // // //         </nav>
// // // // //       </aside>

// // // // //       {/* Main */}
// // // // //       <div className="flex-1 flex flex-col">
// // // // //         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
// // // // //           <div className="flex items-center gap-4">
// // // // //             <button
// // // // //               onClick={() => setSidebarOpen(!sidebarOpen)}
// // // // //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// // // // //               aria-label="Toggle sidebar"
// // // // //             >
// // // // //               ☰
// // // // //             </button>

// // // // //             <button
// // // // //               onClick={() => router.push("/admin/questionnaires")}
// // // // //               className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
// // // // //             >
// // // // //               ← Back
// // // // //             </button>
// // // // //           </div>

// // // // //           <div className="flex items-center gap-2">
// // // // //             <button onClick={openPreview} className={BTN_PRIMARY}>
// // // // //               👁 Preview
// // // // //             </button>

// // // // //             <button onClick={onValidateClick} className={BTN_PRIMARY}>
// // // // //               ✅ Validate
// // // // //             </button>

// // // // //             <button
// // // // //               onClick={saveFlow}
// // // // //               disabled={
// // // // //                 saving ||
// // // // //                 !hasUnsavedChanges ||
// // // // //                 !validation.ran ||
// // // // //                 !validation.valid
// // // // //               }
// // // // //               className={BTN_PRIMARY}
// // // // //               title={
// // // // //                 !validation.ran
// // // // //                   ? "Validate before saving"
// // // // //                   : !validation.valid
// // // // //                     ? "Fix validation errors before saving"
// // // // //                     : !hasUnsavedChanges
// // // // //                       ? "No changes to save"
// // // // //                       : ""
// // // // //               }
// // // // //             >
// // // // //               💾 {saving ? "Saving..." : "Save"}
// // // // //             </button>
// // // // //           </div>
// // // // //         </header>

// // // // //         {error && (
// // // // //           <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
// // // // //             <div className="text-red-700">
// // // // //               <strong>Error:</strong> {error}
// // // // //             </div>
// // // // //             <button
// // // // //               onClick={() => setError(null)}
// // // // //               className="text-red-700 hover:text-red-900 font-bold"
// // // // //             >
// // // // //               ✕
// // // // //             </button>
// // // // //           </div>
// // // // //         )}

// // // // //         <main className="flex-1 p-6 overflow-auto">
// // // // //           {/* Page header */}
// // // // //           {flow && (
// // // // //             <div className="mb-4">
// // // // //               <h1 className="text-2xl font-semibold text-gray-900">
// // // // //                 Question Management
// // // // //               </h1>
// // // // //               <p className="text-sm text-gray-500 mt-1">
// // // // //                 {flow.name} (Version {flow.version}){" "}
// // // // //                 {validation.ran ? (
// // // // //                   validation.valid ? (
// // // // //                     <span className="ml-2 text-green-700 font-semibold">
// // // // //                       ● Valid
// // // // //                     </span>
// // // // //                   ) : (
// // // // //                     <span className="ml-2 text-red-700 font-semibold">
// // // // //                       ● Not valid
// // // // //                     </span>
// // // // //                   )
// // // // //                 ) : (
// // // // //                   <span className="ml-2 text-gray-500 font-semibold">
// // // // //                     ● Not validated
// // // // //                   </span>
// // // // //                 )}
// // // // //                 {hasUnsavedChanges && (
// // // // //                   <span className="ml-2 text-amber-700 font-semibold">
// // // // //                     ● Unsaved changes
// // // // //                   </span>
// // // // //                 )}
// // // // //               </p>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Validation results */}
// // // // //           {validation.ran && (
// // // // //             <div
// // // // //               className={`mb-6 rounded-lg border px-6 py-4 ${
// // // // //                 validation.valid
// // // // //                   ? "bg-green-50 border-green-200"
// // // // //                   : "bg-red-50 border-red-200"
// // // // //               }`}
// // // // //             >
// // // // //               <div
// // // // //                 className={`font-semibold ${validation.valid ? "text-green-900" : "text-red-900"}`}
// // // // //               >
// // // // //                 {validation.valid
// // // // //                   ? `Validation successful (0 errors, 0 warnings)`
// // // // //                   : `Validation failed (${validation.items.filter((x) => x.level === "ERROR").length} errors, ${
// // // // //                       validation.items.filter((x) => x.level === "WARNING")
// // // // //                         .length
// // // // //                     } warnings)`}
// // // // //               </div>

// // // // //               {!validation.valid && (
// // // // //                 <div className="mt-3 space-y-3">
// // // // //                   {validation.items.map((it, idx) => (
// // // // //                     <div
// // // // //                       key={idx}
// // // // //                       className="bg-white/60 border border-red-200 rounded-lg p-4"
// // // // //                     >
// // // // //                       <div className="font-semibold text-red-900">
// // // // //                         {it.title}
// // // // //                       </div>
// // // // //                       <div className="text-sm text-red-900 mt-1">
// // // // //                         <strong>Where:</strong> {it.where}
// // // // //                       </div>
// // // // //                       <div className="text-sm text-red-900 mt-1">
// // // // //                         <strong>How to fix:</strong> {it.howToFix}
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   ))}
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Builder card */}
// // // // //           {flow && (
// // // // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // // // //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// // // // //                 <h2 className="text-lg font-semibold text-teal-900">
// // // // //                   Question Flow Builder
// // // // //                 </h2>
// // // // //                 <div className="flex items-center gap-2">
// // // // //                   <button
// // // // //                     onClick={() =>
// // // // //                       setCollapsedCategories({ 1: false, 2: false })
// // // // //                     }
// // // // //                     className={BTN_OUTLINE}
// // // // //                   >
// // // // //                     Expand Categories
// // // // //                   </button>
// // // // //                   <button
// // // // //                     onClick={() => setCollapsedCategories({ 1: true, 2: true })}
// // // // //                     className={BTN_OUTLINE}
// // // // //                   >
// // // // //                     Collapse Categories
// // // // //                   </button>
// // // // //                   <button onClick={expandAllNodes} className={BTN_OUTLINE}>
// // // // //                     Expand All
// // // // //                   </button>
// // // // //                   <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
// // // // //                     Collapse All
// // // // //                   </button>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="overflow-auto">
// // // // //                 <table className="w-full text-sm">
// // // // //                   <thead className="bg-gray-50">
// // // // //                     <tr className="border-b border-gray-200">
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-10"></th>
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-24">
// // // // //                         Node
// // // // //                       </th>
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">
// // // // //                         Type
// // // // //                       </th>
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[300px]">
// // // // //                         Body Text
// // // // //                       </th>
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[520px]">
// // // // //                         Options / Settings
// // // // //                       </th>
// // // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">
// // // // //                         Actions
// // // // //                       </th>
// // // // //                     </tr>
// // // // //                   </thead>

// // // // //                   <tbody>
// // // // //                     {([1, 2] as Category[]).map((cat) => {
// // // // //                       const collapsed = collapsedCategories[cat];
// // // // //                       const visibleNodes =
// // // // //                         cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

// // // // //                       return (
// // // // //                         <Fragment key={`cat-${cat}`}>
// // // // //                           <tr className="bg-gray-100 border-b border-gray-200">
// // // // //                             <td className="px-3 py-3" colSpan={6}>
// // // // //                               <div className="flex items-center justify-between">
// // // // //                                 <button
// // // // //                                   onClick={() =>
// // // // //                                     setCollapsedCategories((p) => ({
// // // // //                                       ...p,
// // // // //                                       [cat]: !p[cat],
// // // // //                                     }))
// // // // //                                   }
// // // // //                                   className="flex items-center gap-2 text-sm font-semibold text-gray-800"
// // // // //                                 >
// // // // //                                   <span className="inline-block w-5 text-center">
// // // // //                                     {collapsed ? "▶" : "▼"}
// // // // //                                   </span>
// // // // //                                   <span>{CATEGORY_LABEL[cat]}</span>
// // // // //                                   <span className="text-xs font-normal text-gray-500">
// // // // //                                     (
// // // // //                                     {
// // // // //                                       flow.nodes.filter(
// // // // //                                         (n) => n.category === cat,
// // // // //                                       ).length
// // // // //                                     }{" "}
// // // // //                                     nodes)
// // // // //                                   </span>
// // // // //                                 </button>

// // // // //                                 <button
// // // // //                                   onClick={() => addNode(cat, null)}
// // // // //                                   className={BTN_OUTLINE}
// // // // //                                 >
// // // // //                                   + Add Root Node
// // // // //                                 </button>
// // // // //                               </div>
// // // // //                             </td>
// // // // //                           </tr>

// // // // //                           {!collapsed &&
// // // // //                             visibleNodes.map((node) => {
// // // // //                               const hasChild = hasChildren(node.node_key);
// // // // //                               const isExpanded = expandedNodes.has(
// // // // //                                 node.node_key,
// // // // //                               );
// // // // //                               const indent = node.depth_level * 24;
// // // // //                               const isEditing =
// // // // //                                 editingNodeKey === node.node_key;

// // // // //                               return (
// // // // //                                 <Fragment key={node.node_key}>
// // // // //                                   {/* NODE ROW */}
// // // // //                                   <tr className="border-b border-gray-100 hover:bg-gray-50">
// // // // //                                     <td className="px-3 py-2">
// // // // //                                       {hasChild && (
// // // // //                                         <button
// // // // //                                           onClick={() =>
// // // // //                                             toggleNode(node.node_key)
// // // // //                                           }
// // // // //                                           className="text-gray-600 hover:text-gray-900"
// // // // //                                         >
// // // // //                                           {isExpanded ? "▼" : "▶"}
// // // // //                                         </button>
// // // // //                                       )}
// // // // //                                     </td>

// // // // //                                     <td
// // // // //                                       className="px-3 py-2"
// // // // //                                       style={{
// // // // //                                         paddingLeft: `${indent + 12}px`,
// // // // //                                       }}
// // // // //                                     >
// // // // //                                       {/* Single badge only (no extra Q1 square), same color always */}
// // // // //                                       <span
// // // // //                                         className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
// // // // //                                       >
// // // // //                                         {getCategorySequenceNumber(
// // // // //                                           node.node_key,
// // // // //                                         )}
// // // // //                                       </span>
// // // // //                                     </td>

// // // // //                                     <td className="px-3 py-2">
// // // // //                                       <select
// // // // //                                         className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500"
// // // // //                                         value={node.node_type}
// // // // //                                         onChange={(e) =>
// // // // //                                           updateNode(node.node_key, {
// // // // //                                             node_type: e.target
// // // // //                                               .value as FlowNodeType,
// // // // //                                           })
// // // // //                                         }
// // // // //                                       >
// // // // //                                         <option value="QUESTION">
// // // // //                                           Question
// // // // //                                         </option>
// // // // //                                         <option value="MESSAGE">Message</option>
// // // // //                                         <option value="ALERT">Alert</option>
// // // // //                                       </select>
// // // // //                                     </td>

// // // // //                                     <td className="px-3 py-2">
// // // // //                                       <input
// // // // //                                         className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500"
// // // // //                                         value={node.body_text}
// // // // //                                         onChange={(e) =>
// // // // //                                           updateNode(node.node_key, {
// // // // //                                             body_text: e.target.value,
// // // // //                                           })
// // // // //                                         }
// // // // //                                         placeholder="Question or message..."
// // // // //                                       />
// // // // //                                     </td>

// // // // //                                     <td className="px-3 py-2">
// // // // //                                       {node.node_type === "QUESTION" ? (
// // // // //                                         <div className="text-xs text-gray-600 flex items-center gap-2">
// // // // //                                           <span>
// // // // //                                             {node.options?.length || 0} options
// // // // //                                           </span>
// // // // //                                           <button
// // // // //                                             onClick={() =>
// // // // //                                               setEditingNodeKey(
// // // // //                                                 isEditing
// // // // //                                                   ? null
// // // // //                                                   : node.node_key,
// // // // //                                               )
// // // // //                                             }
// // // // //                                             className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
// // // // //                                           >
// // // // //                                             {isEditing ? "Hide" : "Edit"}
// // // // //                                           </button>
// // // // //                                         </div>
// // // // //                                       ) : node.node_type === "ALERT" ? (
// // // // //                                         <div className="flex items-center gap-2">
// // // // //                                           <span className="text-xs text-gray-600">
// // // // //                                             Severity
// // // // //                                           </span>
// // // // //                                           <select
// // // // //                                             className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500"
// // // // //                                             value={node.alert_severity || "RED"}
// // // // //                                             onChange={(e) =>
// // // // //                                               updateNode(node.node_key, {
// // // // //                                                 alert_severity: e.target
// // // // //                                                   .value as SeverityLevel,
// // // // //                                               })
// // // // //                                             }
// // // // //                                           >
// // // // //                                             <option value="GREEN">Green</option>
// // // // //                                             <option value="AMBER">Amber</option>
// // // // //                                             <option value="RED">Red</option>
// // // // //                                           </select>
// // // // //                                           <span className="text-xs text-gray-500 italic">
// // // // //                                             (end node)
// // // // //                                           </span>
// // // // //                                         </div>
// // // // //                                       ) : (
// // // // //                                         <span className="text-xs text-gray-500 italic">
// // // // //                                           Message (end node)
// // // // //                                         </span>
// // // // //                                       )}
// // // // //                                     </td>

// // // // //                                     <td className="px-3 py-2">
// // // // //                                       <div className="flex items-center gap-2 justify-end">
// // // // //                                         <button
// // // // //                                           onClick={() =>
// // // // //                                             addNode(
// // // // //                                               node.category,
// // // // //                                               node.node_key,
// // // // //                                             )
// // // // //                                           }
// // // // //                                           className={BTN_OUTLINE}
// // // // //                                         >
// // // // //                                           + Child
// // // // //                                         </button>
// // // // //                                         <button
// // // // //                                           onClick={() =>
// // // // //                                             deleteNodeCascade(node.node_key)
// // // // //                                           }
// // // // //                                           className={BTN_DANGER}
// // // // //                                           title="Cascade delete this node and all descendants"
// // // // //                                         >
// // // // //                                           Delete
// // // // //                                         </button>
// // // // //                                       </div>
// // // // //                                     </td>
// // // // //                                   </tr>

// // // // //                                   {/* OPTIONS (EDIT MODE) */}
// // // // //                                   {isEditing &&
// // // // //                                     node.node_type === "QUESTION" &&
// // // // //                                     (node.options || []).map((opt, idx) => (
// // // // //                                       <tr
// // // // //                                         key={`${node.node_key}-opt-${idx}`}
// // // // //                                         className="bg-gray-50 border-b border-gray-100"
// // // // //                                       >
// // // // //                                         <td
// // // // //                                           colSpan={2}
// // // // //                                           className="px-3 py-2"
// // // // //                                         ></td>

// // // // //                                         <td className="px-3 py-2">
// // // // //                                           <span className="text-xs text-gray-600">
// // // // //                                             Option {idx + 1}
// // // // //                                           </span>
// // // // //                                         </td>

// // // // //                                         {/* Option row: single line layout */}
// // // // //                                         <td className="px-3 py-2">
// // // // //                                           <input
// // // // //                                             className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500"
// // // // //                                             value={opt.label}
// // // // //                                             onChange={(e) =>
// // // // //                                               updateOption(node.node_key, idx, {
// // // // //                                                 label: e.target.value,
// // // // //                                               })
// // // // //                                             }
// // // // //                                             placeholder="Option label"
// // // // //                                           />
// // // // //                                         </td>

// // // // //                                         <td className="px-3 py-2">
// // // // //                                           <div className="flex items-center gap-2 flex-wrap">
// // // // //                                             <span className="text-xs text-gray-600">
// // // // //                                               Next
// // // // //                                             </span>
// // // // //                                             <select
// // // // //                                               className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 min-w-[260px]"
// // // // //                                               value={opt.next_node_key || ""}
// // // // //                                               onChange={(e) =>
// // // // //                                                 updateOption(
// // // // //                                                   node.node_key,
// // // // //                                                   idx,
// // // // //                                                   {
// // // // //                                                     next_node_key:
// // // // //                                                       e.target.value || null,
// // // // //                                                   },
// // // // //                                                 )
// // // // //                                               }
// // // // //                                             >
// // // // //                                               {getAvailableNextNodes(
// // // // //                                                 node.category,
// // // // //                                               ).map((nextOpt) => (
// // // // //                                                 <option
// // // // //                                                   key={nextOpt.key}
// // // // //                                                   value={nextOpt.key}
// // // // //                                                 >
// // // // //                                                   {nextOpt.label}
// // // // //                                                 </option>
// // // // //                                               ))}
// // // // //                                             </select>

// // // // //                                             <select
// // // // //                                               className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 w-28"
// // // // //                                               value={opt.severity}
// // // // //                                               onChange={(e) =>
// // // // //                                                 updateOption(
// // // // //                                                   node.node_key,
// // // // //                                                   idx,
// // // // //                                                   {
// // // // //                                                     severity: e.target
// // // // //                                                       .value as SeverityLevel,
// // // // //                                                   },
// // // // //                                                 )
// // // // //                                               }
// // // // //                                             >
// // // // //                                               <option value="GREEN">
// // // // //                                                 Green
// // // // //                                               </option>
// // // // //                                               <option value="AMBER">
// // // // //                                                 Amber
// // // // //                                               </option>
// // // // //                                               <option value="RED">Red</option>
// // // // //                                             </select>

// // // // //                                             <input
// // // // //                                               className="px-2 py-1 border border-gray-200 rounded text-sm w-20 focus:outline-none focus:border-teal-500"
// // // // //                                               type="number"
// // // // //                                               value={opt.news2_score}
// // // // //                                               onChange={(e) =>
// // // // //                                                 updateOption(
// // // // //                                                   node.node_key,
// // // // //                                                   idx,
// // // // //                                                   {
// // // // //                                                     news2_score: Number(
// // // // //                                                       e.target.value,
// // // // //                                                     ),
// // // // //                                                   },
// // // // //                                                 )
// // // // //                                               }
// // // // //                                               placeholder="NEWS2"
// // // // //                                               title="NEWS2 Score"
// // // // //                                             />

// // // // //                                             <input
// // // // //                                               className="px-2 py-1 border border-gray-200 rounded text-sm w-20 focus:outline-none focus:border-teal-500"
// // // // //                                               type="number"
// // // // //                                               value={opt.seriousness_points}
// // // // //                                               onChange={(e) =>
// // // // //                                                 updateOption(
// // // // //                                                   node.node_key,
// // // // //                                                   idx,
// // // // //                                                   {
// // // // //                                                     seriousness_points: Number(
// // // // //                                                       e.target.value,
// // // // //                                                     ),
// // // // //                                                   },
// // // // //                                                 )
// // // // //                                               }
// // // // //                                               placeholder="Points"
// // // // //                                               title="Seriousness Points"
// // // // //                                             />

// // // // //                                             <button
// // // // //                                               onClick={() =>
// // // // //                                                 removeOption(node.node_key, idx)
// // // // //                                               }
// // // // //                                               disabled={
// // // // //                                                 (node.options?.length || 0) <= 2
// // // // //                                               }
// // // // //                                               className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
// // // // //                                               title={
// // // // //                                                 (node.options?.length || 0) <= 2
// // // // //                                                   ? "Minimum 2 options required"
// // // // //                                                   : "Delete option"
// // // // //                                               }
// // // // //                                             >
// // // // //                                               ✕
// // // // //                                             </button>
// // // // //                                           </div>
// // // // //                                         </td>

// // // // //                                         <td className="px-3 py-2"></td>
// // // // //                                       </tr>
// // // // //                                     ))}

// // // // //                                   {isEditing &&
// // // // //                                     node.node_type === "QUESTION" && (
// // // // //                                       <tr className="bg-gray-50 border-b border-gray-100">
// // // // //                                         <td colSpan={5} className="px-3 py-2">
// // // // //                                           <button
// // // // //                                             onClick={() =>
// // // // //                                               addOption(node.node_key)
// // // // //                                             }
// // // // //                                             className={BTN_OUTLINE}
// // // // //                                           >
// // // // //                                             + Add Option
// // // // //                                           </button>
// // // // //                                         </td>
// // // // //                                         <td className="px-3 py-2"></td>
// // // // //                                       </tr>
// // // // //                                     )}
// // // // //                                 </Fragment>
// // // // //                               );
// // // // //                             })}
// // // // //                         </Fragment>
// // // // //                       );
// // // // //                     })}
// // // // //                   </tbody>
// // // // //                 </table>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* PREVIEW MODAL (branching) */}
// // // // //           {preview.open && flow && (
// // // // //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // // // //               <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
// // // // //                 <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
// // // // //                   <div className="text-lg font-bold text-white">
// // // // //                     Patient Preview
// // // // //                   </div>
// // // // //                   <button
// // // // //                     onClick={closePreview}
// // // // //                     className="p-2 hover:bg-teal-700 rounded-lg text-white"
// // // // //                   >
// // // // //                     ✕
// // // // //                   </button>
// // // // //                 </div>

// // // // //                 <div className="p-6 space-y-4">
// // // // //                   {/* Header info */}
// // // // //                   {currentPreviewNode ? (
// // // // //                     <>
// // // // //                       <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
// // // // //                         {CATEGORY_LABEL[currentPreviewNode.category]}
// // // // //                       </div>

// // // // //                       <div className="flex items-center justify-between text-xs text-gray-500">
// // // // //                         <div>
// // // // //                           Node{" "}
// // // // //                           {getCategorySequenceNumber(
// // // // //                             currentPreviewNode.node_key,
// // // // //                           )}{" "}
// // // // //                           • {currentPreviewNode.node_type}
// // // // //                         </div>
// // // // //                         <div>
// // // // //                           Severity:{" "}
// // // // //                           <span className="font-semibold">
// // // // //                             {totals.overallSeverity}
// // // // //                           </span>{" "}
// // // // //                           • NEWS2:{" "}
// // // // //                           <span className="font-semibold">
// // // // //                             {totals.totalNews2}
// // // // //                           </span>{" "}
// // // // //                           • Points:{" "}
// // // // //                           <span className="font-semibold">
// // // // //                             {totals.totalPoints}
// // // // //                           </span>
// // // // //                         </div>
// // // // //                       </div>

// // // // //                       {/* Body */}
// // // // //                       <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
// // // // //                         {currentPreviewNode.title && (
// // // // //                           <div className="text-lg font-semibold text-gray-900 mb-2">
// // // // //                             {currentPreviewNode.title}
// // // // //                           </div>
// // // // //                         )}
// // // // //                         <div className="text-base text-gray-900">
// // // // //                           {currentPreviewNode.body_text}
// // // // //                         </div>
// // // // //                         {currentPreviewNode.help_text && (
// // // // //                           <div className="text-sm text-gray-600 italic mt-2">
// // // // //                             {currentPreviewNode.help_text}
// // // // //                           </div>
// // // // //                         )}

// // // // //                         {/* QUESTION */}
// // // // //                         {currentPreviewNode.node_type === "QUESTION" && (
// // // // //                           <div className="space-y-3 mt-6">
// // // // //                             {(currentPreviewNode.options || []).map(
// // // // //                               (opt, idx) => {
// // // // //                                 const selectedValue =
// // // // //                                   preview.selectedOptionValueByNode[
// // // // //                                     currentPreviewNode.node_key
// // // // //                                   ];
// // // // //                                 const checked = selectedValue === opt.value;
// // // // //                                 return (
// // // // //                                   <button
// // // // //                                     key={`${currentPreviewNode.node_key}-ans-${idx}`}
// // // // //                                     onClick={() =>
// // // // //                                       previewSelectOption(
// // // // //                                         currentPreviewNode.node_key,
// // // // //                                         opt,
// // // // //                                       )
// // // // //                                     }
// // // // //                                     className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
// // // // //                                       checked
// // // // //                                         ? "border-teal-600 bg-teal-50"
// // // // //                                         : "border-gray-200 hover:border-gray-300 bg-white"
// // // // //                                     }`}
// // // // //                                   >
// // // // //                                     <div className="flex items-center gap-3">
// // // // //                                       <div
// // // // //                                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
// // // // //                                           checked
// // // // //                                             ? "border-teal-600 bg-teal-600"
// // // // //                                             : "border-gray-300"
// // // // //                                         }`}
// // // // //                                       >
// // // // //                                         {checked && (
// // // // //                                           <div className="w-2 h-2 bg-white rounded-full"></div>
// // // // //                                         )}
// // // // //                                       </div>
// // // // //                                       <div className="text-base font-medium text-gray-900">
// // // // //                                         {opt.label}
// // // // //                                       </div>
// // // // //                                     </div>
// // // // //                                   </button>
// // // // //                                 );
// // // // //                               },
// // // // //                             )}
// // // // //                           </div>
// // // // //                         )}

// // // // //                         {/* MESSAGE */}
// // // // //                         {currentPreviewNode.node_type === "MESSAGE" && (
// // // // //                           <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
// // // // //                             This is a message. Click <strong>Next</strong> to
// // // // //                             finish.
// // // // //                           </div>
// // // // //                         )}

// // // // //                         {/* ALERT */}
// // // // //                         {currentPreviewNode.node_type === "ALERT" && (
// // // // //                           <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
// // // // //                             <div className="font-semibold">
// // // // //                               Alert Severity:{" "}
// // // // //                               {currentPreviewNode.alert_severity || "RED"}
// // // // //                             </div>
// // // // //                             <div className="mt-1">
// // // // //                               This is an end node. Click <strong>Next</strong>{" "}
// // // // //                               to finish.
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         )}

// // // // //                         {/* Navigation */}
// // // // //                         <div className="flex items-center justify-between pt-6">
// // // // //                           <button
// // // // //                             onClick={previewBack}
// // // // //                             disabled={preview.history.length === 0}
// // // // //                             className={BTN_OUTLINE}
// // // // //                           >
// // // // //                             Back
// // // // //                           </button>
// // // // //                           <button
// // // // //                             onClick={previewNext}
// // // // //                             className={BTN_PRIMARY}
// // // // //                             disabled={
// // // // //                               currentPreviewNode.node_type === "QUESTION" &&
// // // // //                               !preview.selectedOptionValueByNode[
// // // // //                                 currentPreviewNode.node_key
// // // // //                               ]
// // // // //                             }
// // // // //                           >
// // // // //                             Next
// // // // //                           </button>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     // Completed
// // // // //                     <div className="text-center py-10">
// // // // //                       <div className="text-xl font-bold text-gray-900">
// // // // //                         Questionnaire Complete
// // // // //                       </div>
// // // // //                       <div className="text-sm text-gray-600 mt-2">
// // // // //                         Final Severity:{" "}
// // // // //                         <span className="font-semibold">
// // // // //                           {totals.overallSeverity}
// // // // //                         </span>{" "}
// // // // //                         • NEWS2:{" "}
// // // // //                         <span className="font-semibold">
// // // // //                           {totals.totalNews2}
// // // // //                         </span>{" "}
// // // // //                         • Points:{" "}
// // // // //                         <span className="font-semibold">
// // // // //                           {totals.totalPoints}
// // // // //                         </span>
// // // // //                       </div>
// // // // //                       <div className="mt-6 flex items-center justify-center gap-2">
// // // // //                         <button
// // // // //                           onClick={previewRestart}
// // // // //                           className={BTN_OUTLINE}
// // // // //                         >
// // // // //                           ↻ Restart
// // // // //                         </button>
// // // // //                         <button onClick={closePreview} className={BTN_PRIMARY}>
// // // // //                           Close
// // // // //                         </button>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   )}
// // // // //                 </div>

// // // // //                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// // // // //                   <button
// // // // //                     onClick={previewRestart}
// // // // //                     className="text-sm text-gray-600 hover:text-gray-900 font-medium"
// // // // //                   >
// // // // //                     ↻ Restart Preview
// // // // //                   </button>
// // // // //                   <div className="text-xs text-gray-500">
// // // // //                     This is how patients will see the questionnaire
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </main>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // "use client";

// // // // import "reactflow/dist/style.css";

// // // // import { Fragment, useEffect, useMemo, useState } from "react";
// // // // import { useParams, useRouter } from "next/navigation";
// // // // import ReactFlow, {
// // // //   Background,
// // // //   Controls,
// // // //   MiniMap,
// // // //   type Edge,
// // // //   type Node,
// // // // } from "reactflow";

// // // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // // type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// // // // type SeverityLevel = "GREEN" | "AMBER" | "RED";

// // // // type FlowOption = {
// // // //   display_order: number;
// // // //   label: string;
// // // //   value: string;
// // // //   severity: SeverityLevel;
// // // //   news2_score: number;
// // // //   seriousness_points: number;
// // // //   next_node_key: string | null;
// // // // };

// // // // type Category = 1 | 2;

// // // // const CATEGORY_LABEL: Record<Category, string> = {
// // // //   1: "Clinical Obs – Colorectal",
// // // //   2: "Symptoms and signs",
// // // // };

// // // // type FlowNode = {
// // // //   node_key: string;
// // // //   node_type: FlowNodeType;
// // // //   category: Category;

// // // //   title: string | null;
// // // //   body_text: string;
// // // //   help_text: string | null;

// // // //   parent_node_key: string | null;
// // // //   depth_level: number;

// // // //   default_next_node_key: string | null;
// // // //   auto_next_node_key: string | null;

// // // //   ui_ack_required: boolean;
// // // //   alert_severity: SeverityLevel | null;
// // // //   notify_admin: boolean;

// // // //   options: FlowOption[];
// // // // };

// // // // type Flow = {
// // // //   id: number;
// // // //   name: string;
// // // //   description: string;
// // // //   flow_type: string;
// // // //   status: string;
// // // //   start_node_key: string;
// // // //   version: number;
// // // //   nodes: FlowNode[];
// // // // };

// // // // // ================== CONFIG (easy to change) ==================
// // // // const RULES = {
// // // //   AUTO_FIX_START_NODE: true,
// // // //   START_NODE_CATEGORY_PRIORITY: [1, 2] as Category[],
// // // // };

// // // // // Severity -> Prefill values (for BOTH categories)
// // // // // ✅ Change once here, affects everywhere
// // // // const PREFILL_BY_SEVERITY: Record<
// // // //   SeverityLevel,
// // // //   { news2: number; points: number }
// // // // > = {
// // // //   GREEN: { news2: 0, points: 1 }, // meaningful min (still GREEN)
// // // //   AMBER: { news2: 2, points: 30 },
// // // //   RED: { news2: 3, points: 100 },
// // // // };

// // // // // Points -> Severity thresholds (for BOTH categories)
// // // // // ✅ If you want different per category later, split it into CAT1/CAT2 maps
// // // // const SCORE_THRESHOLDS = {
// // // //   AMBER_POINTS_MIN: 30,
// // // //   RED_POINTS_MIN: 100,
// // // // };

// // // // // ------------------ API helpers ------------------
// // // // async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// // // //   const res = await fetch(url, {
// // // //     headers: { Authorization: `Bearer ${accessToken}` },
// // // //     cache: "no-store",
// // // //   });
// // // //   const body = await res.json().catch(() => null);
// // // //   if (!res.ok)
// // // //     throw new Error(body?.detail || body?.message || "Request failed");
// // // //   return body as T;
// // // // }

// // // // async function apiPut<T>(
// // // //   url: string,
// // // //   accessToken: string,
// // // //   body: any,
// // // // ): Promise<T> {
// // // //   const res = await fetch(url, {
// // // //     method: "PUT",
// // // //     headers: {
// // // //       Authorization: `Bearer ${accessToken}`,
// // // //       "Content-Type": "application/json",
// // // //     },
// // // //     body: JSON.stringify(body),
// // // //   });
// // // //   const data = await res.json().catch(() => ({}));
// // // //   if (!res.ok)
// // // //     throw new Error(data?.detail || data?.message || "Request failed");
// // // //   return data as T;
// // // // }

// // // // // ------------------ UI helpers ------------------
// // // // const SEVERITY_ORDER: Record<SeverityLevel, number> = {
// // // //   GREEN: 1,
// // // //   AMBER: 2,
// // // //   RED: 3,
// // // // };
// // // // function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
// // // //   return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
// // // // }

// // // // // Points -> severity (bidirectional partner of PREFILL_BY_SEVERITY)
// // // // function severityFromPoints(points: number): SeverityLevel {
// // // //   if (points >= SCORE_THRESHOLDS.RED_POINTS_MIN) return "RED";
// // // //   if (points >= SCORE_THRESHOLDS.AMBER_POINTS_MIN) return "AMBER";
// // // //   return "GREEN";
// // // // }

// // // // // Final alert (preview): still “score alert logic only for answer options”
// // // // function clinicalAlertFromScore(totalPoints: number): SeverityLevel {
// // // //   return severityFromPoints(totalPoints);
// // // // }

// // // // function badgeColorClass() {
// // // //   return "bg-teal-600 text-white";
// // // // }

// // // // const BTN_PRIMARY =
// // // //   "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // // const BTN_OUTLINE =
// // // //   "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // // const BTN_DANGER =
// // // //   "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// // // // // Clean input/select styling
// // // // const INPUT_SM =
// // // //   "px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
// // // // const SELECT_SM = INPUT_SM;

// // // // type ValidationItem = {
// // // //   level: "ERROR" | "WARNING";
// // // //   title: string;
// // // //   where: string;
// // // //   howToFix: string;
// // // // };

// // // // type ValidationState = {
// // // //   ran: boolean;
// // // //   valid: boolean;
// // // //   items: ValidationItem[];
// // // // };

// // // // type PreviewState = {
// // // //   open: boolean;
// // // //   currentKey: string | "END";
// // // //   history: string[];
// // // //   answers: Record<string, string>;
// // // //   selectedOptionValueByNode: Record<string, string>;
// // // // };

// // // // type ViewMode = "TABLE" | "GRAPH";

// // // // export default function QuestionManagementPage() {
// // // //   const router = useRouter();
// // // //   const params = useParams<{ flowId: string }>();
// // // //   const flowId = Number(params.flowId);

// // // //   const [sidebarOpen, setSidebarOpen] = useState(true);
// // // //   const [viewMode, setViewMode] = useState<ViewMode>("TABLE");

// // // //   const token = useMemo(
// // // //     () =>
// // // //       typeof window !== "undefined"
// // // //         ? localStorage.getItem("access_token")
// // // //         : null,
// // // //     [],
// // // //   );

// // // //   const [loading, setLoading] = useState(true);
// // // //   const [flow, setFlow] = useState<Flow | null>(null);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const [saving, setSaving] = useState(false);
// // // //   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// // // //   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
// // // //   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

// // // //   const [collapsedCategories, setCollapsedCategories] = useState<
// // // //     Record<Category, boolean>
// // // //   >({
// // // //     1: false,
// // // //     2: false,
// // // //   });

// // // //   const [validation, setValidation] = useState<ValidationState>({
// // // //     ran: false,
// // // //     valid: false,
// // // //     items: [],
// // // //   });

// // // //   const [preview, setPreview] = useState<PreviewState>({
// // // //     open: false,
// // // //     currentKey: "END",
// // // //     history: [],
// // // //     answers: {},
// // // //     selectedOptionValueByNode: {},
// // // //   });

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
// // // //     if (!token) {
// // // //       router.replace("/login");
// // // //       return;
// // // //     }
// // // //     if (!Number.isFinite(flowId) || flowId <= 0) {
// // // //       setError("Invalid flowId in route");
// // // //       setLoading(false);
// // // //       return;
// // // //     }
// // // //     loadFlow();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [token, flowId]);

// // // //   function pickFirstRootNodeKeyAnyCategory(nodes: FlowNode[]): string | null {
// // // //     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
// // // //       const root = nodes.find((n) => n.category === cat && !n.parent_node_key);
// // // //       if (root) return root.node_key;
// // // //     }
// // // //     return nodes[0]?.node_key ?? null;
// // // //   }

// // // //   async function loadFlow() {
// // // //     if (!token) return;
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);

// // // //       const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

// // // //       // Ensure ALERT nodes always have a stored default severity
// // // //       const fixed: Flow = {
// // // //         ...data,
// // // //         nodes: (data.nodes || []).map((n) =>
// // // //           n.node_type === "ALERT" && !n.alert_severity
// // // //             ? { ...n, alert_severity: "RED" }
// // // //             : n,
// // // //         ),
// // // //       };

// // // //       // ✅ allow building only one category by auto-fixing start_node_key
// // // //       if (RULES.AUTO_FIX_START_NODE) {
// // // //         const keys = new Set(fixed.nodes.map((n) => n.node_key));
// // // //         if (!fixed.start_node_key || !keys.has(fixed.start_node_key)) {
// // // //           fixed.start_node_key =
// // // //             pickFirstRootNodeKeyAnyCategory(fixed.nodes) ?? "END";
// // // //         }
// // // //       }

// // // //       setFlow(fixed);
// // // //       setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
// // // //       setHasUnsavedChanges(false);
// // // //       setValidation({ ran: false, valid: false, items: [] });
// // // //     } catch (e: any) {
// // // //       setError(e?.message || "Failed to load flow");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function saveFlow() {
// // // //     if (!token || !flow) return;

// // // //     if (!validation.ran || !validation.valid) {
// // // //       alert("Please validate the questionnaire before saving.");
// // // //       return;
// // // //     }
// // // //     if (!hasUnsavedChanges) {
// // // //       alert("No changes to save.");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setSaving(true);
// // // //       setError(null);

// // // //       const payload = {
// // // //         name: flow.name,
// // // //         description: flow.description,
// // // //         flow_type: flow.flow_type,
// // // //         status: flow.status,
// // // //         start_node_key: flow.start_node_key,
// // // //         nodes: flow.nodes,
// // // //       };

// // // //       const data = await apiPut<any>(
// // // //         `${API_BASE}/flows/${flow.id}`,
// // // //         token,
// // // //         payload,
// // // //       );
// // // //       await loadFlow();
// // // //       setHasUnsavedChanges(false);
// // // //       alert(`Saved! Version: ${data.version ?? "?"}`);
// // // //     } catch (e: any) {
// // // //       setError(e?.message || "Failed to save flow");
// // // //       alert("Failed to save: " + (e?.message || "Unknown error"));
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   }

// // // //   // ------------------ helpers: indexes/maps ------------------
// // // //   function nodeMap(): Map<string, FlowNode> {
// // // //     return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
// // // //   }

// // // //   function childrenMap(): Map<string, FlowNode[]> {
// // // //     const map = new Map<string, FlowNode[]>();
// // // //     for (const n of flow?.nodes || []) {
// // // //       if (!n.parent_node_key) continue;
// // // //       const arr = map.get(n.parent_node_key) || [];
// // // //       arr.push(n);
// // // //       map.set(n.parent_node_key, arr);
// // // //     }
// // // //     return map;
// // // //   }

// // // //   function hasChildren(nodeKey: string): boolean {
// // // //     if (!flow) return false;
// // // //     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
// // // //   }

// // // //   function toggleNode(nodeKey: string) {
// // // //     setExpandedNodes((prev) => {
// // // //       const next = new Set(prev);
// // // //       next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
// // // //       return next;
// // // //     });
// // // //   }

// // // //   function expandAllNodes() {
// // // //     if (!flow) return;
// // // //     setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
// // // //   }
// // // //   function collapseAllNodes() {
// // // //     setExpandedNodes(new Set());
// // // //   }

// // // //   function getVisibleNodesByCategory(category: Category): FlowNode[] {
// // // //     if (!flow) return [];
// // // //     const nm = nodeMap();
// // // //     function shouldShow(node: FlowNode): boolean {
// // // //       if (node.category !== category) return false;
// // // //       if (!node.parent_node_key) return true;
// // // //       const parent = nm.get(node.parent_node_key);
// // // //       if (!parent) return true;
// // // //       if (parent.category !== category) return false;
// // // //       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
// // // //     }
// // // //     return flow.nodes.filter(shouldShow);
// // // //   }

// // // //   function getCategorySequenceNumber(nodeKey: string): number {
// // // //     if (!flow) return 0;
// // // //     const n = flow.nodes.find((x) => x.node_key === nodeKey);
// // // //     if (!n) return 0;
// // // //     const sameCat = flow.nodes.filter((x) => x.category === n.category);
// // // //     const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
// // // //     return idx >= 0 ? idx + 1 : 0;
// // // //   }

// // // //   function getAvailableNextNodes(
// // // //     category: Category,
// // // //   ): Array<{ key: string; label: string }> {
// // // //     const base = [
// // // //       { key: "", label: "-- Select Next --" },
// // // //       { key: "END", label: "END - Complete Flow" },
// // // //     ];
// // // //     if (!flow) return base;

// // // //     const sameCategory = flow.nodes.filter((n) => n.category === category);
// // // //     return [
// // // //       ...base,
// // // //       ...sameCategory.map((node) => ({
// // // //         key: node.node_key,
// // // //         label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
// // // //       })),
// // // //     ];
// // // //   }

// // // //   // ------------------ state update utilities ------------------
// // // //   function markChanged() {
// // // //     setHasUnsavedChanges(true);
// // // //     setValidation({ ran: false, valid: false, items: [] });
// // // //   }

// // // //   function makeDefaultOptions(_category: Category): FlowOption[] {
// // // //     const baseSeverity: SeverityLevel = "GREEN";
// // // //     const prefill = PREFILL_BY_SEVERITY[baseSeverity];

// // // //     return [
// // // //       {
// // // //         display_order: 1,
// // // //         label: "Option 1",
// // // //         value: "opt1",
// // // //         severity: baseSeverity,
// // // //         news2_score: prefill.news2,
// // // //         seriousness_points: prefill.points,
// // // //         next_node_key: null,
// // // //       },
// // // //       {
// // // //         display_order: 2,
// // // //         label: "Option 2",
// // // //         value: "opt2",
// // // //         severity: baseSeverity,
// // // //         news2_score: prefill.news2,
// // // //         seriousness_points: prefill.points,
// // // //         next_node_key: null,
// // // //       },
// // // //     ];
// // // //   }

// // // //   function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
// // // //     if (!flow) return;

// // // //     setFlow((prev) => {
// // // //       if (!prev) return prev;

// // // //       const updatedNodes = prev.nodes.map((n) => {
// // // //         if (n.node_key !== nodeKey) return n;

// // // //         if (updates.node_type === "ALERT") {
// // // //           return {
// // // //             ...n,
// // // //             ...updates,
// // // //             options: [],
// // // //             alert_severity: (updates.alert_severity ??
// // // //               n.alert_severity ??
// // // //               "RED") as SeverityLevel,
// // // //           };
// // // //         }

// // // //         if (updates.node_type === "MESSAGE") {
// // // //           return {
// // // //             ...n,
// // // //             ...updates,
// // // //             options: [],
// // // //             alert_severity: null,
// // // //           };
// // // //         }

// // // //         if (updates.node_type === "QUESTION") {
// // // //           const options =
// // // //             n.options?.length >= 2 ? n.options : makeDefaultOptions(n.category);
// // // //           return { ...n, ...updates, options };
// // // //         }

// // // //         return { ...n, ...updates };
// // // //       });

// // // //       return { ...prev, nodes: updatedNodes };
// // // //     });

// // // //     markChanged();
// // // //   }

// // // //   function updateOption(
// // // //     nodeKey: string,
// // // //     optionIdx: number,
// // // //     updates: Partial<FlowOption>,
// // // //   ) {
// // // //     if (!flow) return;

// // // //     setFlow((prev) => {
// // // //       if (!prev) return prev;
// // // //       return {
// // // //         ...prev,
// // // //         nodes: prev.nodes.map((n) => {
// // // //           if (n.node_key !== nodeKey) return n;
// // // //           const options = [...(n.options || [])];
// // // //           options[optionIdx] = { ...options[optionIdx], ...updates };
// // // //           return { ...n, options };
// // // //         }),
// // // //       };
// // // //     });

// // // //     markChanged();
// // // //   }

// // // //   function addOption(nodeKey: string) {
// // // //     if (!flow) return;
// // // //     setFlow((prev) => {
// // // //       if (!prev) return prev;
// // // //       return {
// // // //         ...prev,
// // // //         nodes: prev.nodes.map((n) => {
// // // //           if (n.node_key !== nodeKey) return n;
// // // //           const nextIndex = (n.options?.length || 0) + 1;

// // // //           const baseSeverity: SeverityLevel = "GREEN";
// // // //           const prefill = PREFILL_BY_SEVERITY[baseSeverity];

// // // //           return {
// // // //             ...n,
// // // //             options: [
// // // //               ...(n.options || []),
// // // //               {
// // // //                 display_order: nextIndex,
// // // //                 label: `Option ${nextIndex}`,
// // // //                 value: `opt_${nextIndex}`,
// // // //                 severity: baseSeverity,
// // // //                 news2_score: prefill.news2,
// // // //                 seriousness_points: prefill.points,
// // // //                 next_node_key: null,
// // // //               },
// // // //             ],
// // // //           };
// // // //         }),
// // // //       };
// // // //     });
// // // //     markChanged();
// // // //   }

// // // //   function removeOption(nodeKey: string, optionIdx: number) {
// // // //     if (!flow) return;
// // // //     setFlow((prev) => {
// // // //       if (!prev) return prev;
// // // //       return {
// // // //         ...prev,
// // // //         nodes: prev.nodes.map((n) => {
// // // //           if (n.node_key !== nodeKey) return n;
// // // //           if ((n.options?.length || 0) <= 2) return n;
// // // //           const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
// // // //           const resequenced = filtered.map((o, i) => ({
// // // //             ...o,
// // // //             display_order: i + 1,
// // // //           }));
// // // //           return { ...n, options: resequenced };
// // // //         }),
// // // //       };
// // // //     });
// // // //     markChanged();
// // // //   }

// // // //   function addNode(category: Category, parentKey: string | null = null) {
// // // //     if (!flow) return;

// // // //     const siblingsCount = flow.nodes.filter(
// // // //       (n) => n.parent_node_key === parentKey && n.category === category,
// // // //     ).length;

// // // //     const newKey = parentKey
// // // //       ? `${parentKey}.${siblingsCount + 1}`
// // // //       : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

// // // //     const newNode: FlowNode = {
// // // //       node_key: newKey,
// // // //       node_type: "QUESTION",
// // // //       category,
// // // //       title: "New Question",
// // // //       body_text: "Enter your question here",
// // // //       help_text: null,
// // // //       parent_node_key: parentKey,
// // // //       depth_level: newKey.split(".").length - 1,
// // // //       default_next_node_key: null,
// // // //       auto_next_node_key: null,
// // // //       ui_ack_required: false,
// // // //       alert_severity: null,
// // // //       notify_admin: false,
// // // //       options: makeDefaultOptions(category),
// // // //     };

// // // //     setFlow((prev) =>
// // // //       prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
// // // //     );
// // // //     setExpandedNodes((prev) => new Set([...prev, newKey]));
// // // //     markChanged();
// // // //   }

// // // //   // ------------------ delete node (cascade descendants + clear references) ------------------
// // // //   function collectDescendants(rootKey: string): Set<string> {
// // // //     const cm = childrenMap();
// // // //     const toDelete = new Set<string>();
// // // //     const stack = [rootKey];
// // // //     while (stack.length) {
// // // //       const k = stack.pop()!;
// // // //       if (toDelete.has(k)) continue;
// // // //       toDelete.add(k);
// // // //       const kids = cm.get(k) || [];
// // // //       for (const child of kids) stack.push(child.node_key);
// // // //     }
// // // //     return toDelete;
// // // //   }

// // // //   function deleteNodeCascade(nodeKey: string) {
// // // //     if (!flow) return;
// // // //     const toDelete = collectDescendants(nodeKey);

// // // //     setFlow((prev) => {
// // // //       if (!prev) return prev;

// // // //       const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

// // // //       const cleaned = remaining.map((n) => {
// // // //         if (n.node_type !== "QUESTION") return n;

// // // //         const newOptions = (n.options || []).map((o) => {
// // // //           if (o.next_node_key && toDelete.has(o.next_node_key)) {
// // // //             return { ...o, next_node_key: null };
// // // //           }
// // // //           return o;
// // // //         });

// // // //         const newParent =
// // // //           n.parent_node_key && toDelete.has(n.parent_node_key)
// // // //             ? null
// // // //             : n.parent_node_key;

// // // //         return { ...n, parent_node_key: newParent, options: newOptions };
// // // //       });

// // // //       return { ...prev, nodes: cleaned };
// // // //     });

// // // //     if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);
// // // //     markChanged();
// // // //   }

// // // //   // ------------------ FRONTEND VALIDATION ------------------
// // // //   function validateFrontend(): ValidationState {
// // // //     if (!flow)
// // // //       return {
// // // //         ran: true,
// // // //         valid: false,
// // // //         items: [
// // // //           {
// // // //             level: "ERROR",
// // // //             title: "Flow not loaded",
// // // //             where: "Flow",
// // // //             howToFix: "Reload the page and try again.",
// // // //           },
// // // //         ],
// // // //       };

// // // //     const items: ValidationItem[] = [];
// // // //     const nm = nodeMap();
// // // //     const keys = new Set([...nm.keys()]);
// // // //     const allowedCats = new Set<number>([1, 2]);

// // // //     if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
// // // //       items.push({
// // // //         level: "ERROR",
// // // //         title: "Start node is missing or invalid",
// // // //         where: `Start Node: ${flow.start_node_key || "(empty)"}`,
// // // //         howToFix: `Set start_node_key to an existing node key (usually the first question).`,
// // // //       });
// // // //     }

// // // //     const seen = new Set<string>();
// // // //     for (const n of flow.nodes) {
// // // //       if (seen.has(n.node_key)) {
// // // //         items.push({
// // // //           level: "ERROR",
// // // //           title: "Duplicate node key found",
// // // //           where: `Node Key: ${n.node_key}`,
// // // //           howToFix: "Ensure every node has a unique node_key.",
// // // //         });
// // // //       }
// // // //       seen.add(n.node_key);
// // // //     }

// // // //     for (const n of flow.nodes) {
// // // //       if (!allowedCats.has(n.category)) {
// // // //         items.push({
// // // //           level: "ERROR",
// // // //           title: "Invalid category",
// // // //           where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // // //           howToFix: "Category must be either 1 or 2.",
// // // //         });
// // // //       }

// // // //       if (n.parent_node_key) {
// // // //         const parent = nm.get(n.parent_node_key);
// // // //         if (!parent) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Parent node not found",
// // // //             where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // // //             howToFix:
// // // //               "Either fix parent_node_key or delete/recreate this node under a valid parent.",
// // // //           });
// // // //         } else if (parent.category !== n.category) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Category mismatch between parent and child",
// // // //             where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
// // // //             howToFix: `Move the node under a parent in the same category.`,
// // // //           });
// // // //         }
// // // //       }
// // // //     }

// // // //     for (const node of flow.nodes) {
// // // //       const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

// // // //       if (node.node_type === "QUESTION") {
// // // //         if (!node.options || node.options.length < 2) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Question must have at least 2 options",
// // // //             where: whereNode,
// // // //             howToFix: "Add more options until there are at least 2.",
// // // //           });
// // // //         }

// // // //         for (const opt of node.options || []) {
// // // //           const whereOpt = `${whereNode} → Option "${opt.label}"`;

// // // //           if (!opt.label || !opt.label.trim()) {
// // // //             items.push({
// // // //               level: "ERROR",
// // // //               title: "Option label is empty",
// // // //               where: whereOpt,
// // // //               howToFix: "Give this option a meaningful label (e.g., Yes / No).",
// // // //             });
// // // //           }

// // // //           if (!opt.next_node_key) {
// // // //             items.push({
// // // //               level: "ERROR",
// // // //               title: "Option next step is missing",
// // // //               where: whereOpt,
// // // //               howToFix: `Select a Next node for this option (or choose END).`,
// // // //             });
// // // //           } else if (opt.next_node_key !== "END") {
// // // //             const dst = nm.get(opt.next_node_key);
// // // //             if (!dst) {
// // // //               items.push({
// // // //                 level: "ERROR",
// // // //                 title: "Option points to a node that does not exist",
// // // //                 where: whereOpt,
// // // //                 howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
// // // //               });
// // // //             } else if (dst.category !== node.category) {
// // // //               items.push({
// // // //                 level: "ERROR",
// // // //                 title: "Option next node must be in the same category",
// // // //                 where: `${whereOpt} → Next "${dst.node_key}"`,
// // // //                 howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
// // // //               });
// // // //             }
// // // //           }
// // // //         }
// // // //       }

// // // //       if (node.node_type === "MESSAGE") {
// // // //         if (node.options && node.options.length > 0) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Message must not have options",
// // // //             where: whereNode,
// // // //             howToFix: "Change node type to QUESTION if you need options.",
// // // //           });
// // // //         }
// // // //       }

// // // //       if (node.node_type === "ALERT") {
// // // //         if (!node.alert_severity) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Alert severity is missing",
// // // //             where: whereNode,
// // // //             howToFix: "Select Green / Amber / Red for this Alert.",
// // // //           });
// // // //         }
// // // //         if (node.options && node.options.length > 0) {
// // // //           items.push({
// // // //             level: "ERROR",
// // // //             title: "Alert must not have options",
// // // //             where: whereNode,
// // // //             howToFix:
// // // //               "Alerts are end nodes. Remove options or change type to QUESTION.",
// // // //           });
// // // //         }
// // // //       }
// // // //     }

// // // //     // cycle detection
// // // //     const graph = new Map<string, string[]>();
// // // //     function addEdge(src: string, dst: string | null) {
// // // //       if (!dst) return;
// // // //       graph.set(src, [...(graph.get(src) || []), dst]);
// // // //     }
// // // //     for (const n of flow.nodes) {
// // // //       if (n.node_type === "QUESTION") {
// // // //         for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
// // // //       }
// // // //     }
// // // //     const visited = new Set<string>();
// // // //     const stack = new Set<string>();
// // // //     function dfs(u: string): boolean {
// // // //       if (u === "END") return false;
// // // //       if (stack.has(u)) return true;
// // // //       if (visited.has(u)) return false;
// // // //       visited.add(u);
// // // //       stack.add(u);
// // // //       for (const v of graph.get(u) || []) {
// // // //         if (v && dfs(v)) return true;
// // // //       }
// // // //       stack.delete(u);
// // // //       return false;
// // // //     }
// // // //     if (flow.start_node_key && keys.has(flow.start_node_key)) {
// // // //       if (dfs(flow.start_node_key)) {
// // // //         items.push({
// // // //           level: "ERROR",
// // // //           title: "Flow contains a cycle (loop)",
// // // //           where: `Start node path from ${flow.start_node_key}`,
// // // //           howToFix: "Break the loop by changing an option's Next to END.",
// // // //         });
// // // //       }
// // // //     }

// // // //     const valid = items.filter((x) => x.level === "ERROR").length === 0;
// // // //     return { ran: true, valid, items };
// // // //   }

// // // //   function onValidateClick() {
// // // //     const result = validateFrontend();
// // // //     setValidation(result);
// // // //     if (!result.valid) window.scrollTo({ top: 0, behavior: "smooth" });
// // // //   }

// // // //   // ------------------ PREVIEW (frontend routing) ------------------
// // // //   function openPreview() {
// // // //     if (!flow) return;

// // // //     const start =
// // // //       flow.start_node_key && nodeMap().has(flow.start_node_key)
// // // //         ? flow.start_node_key
// // // //         : "END";

// // // //     setPreview({
// // // //       open: true,
// // // //       currentKey: start,
// // // //       history: [],
// // // //       answers: {},
// // // //       selectedOptionValueByNode: {},
// // // //     });
// // // //   }

// // // //   function closePreview() {
// // // //     setPreview((p) => ({ ...p, open: false }));
// // // //   }

// // // //   function previewCurrentNode(): FlowNode | null {
// // // //     if (!flow) return null;
// // // //     if (!preview.open) return null;
// // // //     if (preview.currentKey === "END") return null;
// // // //     return nodeMap().get(preview.currentKey) || null;
// // // //   }

// // // //   function previewSelectOption(nodeKey: string, opt: FlowOption) {
// // // //     setPreview((p) => ({
// // // //       ...p,
// // // //       answers: { ...p.answers, [nodeKey]: opt.label },
// // // //       selectedOptionValueByNode: {
// // // //         ...p.selectedOptionValueByNode,
// // // //         [nodeKey]: opt.value,
// // // //       },
// // // //     }));
// // // //   }

// // // //   function previewNext() {
// // // //     if (!flow) return;
// // // //     const current = previewCurrentNode();
// // // //     if (!current) return;

// // // //     if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
// // // //       setPreview((p) => ({
// // // //         ...p,
// // // //         history: [...p.history, current.node_key],
// // // //         currentKey: "END",
// // // //       }));
// // // //       return;
// // // //     }

// // // //     if (current.node_type === "QUESTION") {
// // // //       const selectedValue = preview.selectedOptionValueByNode[current.node_key];
// // // //       const opt = (current.options || []).find(
// // // //         (o) => o.value === selectedValue,
// // // //       );

// // // //       if (!opt) {
// // // //         alert("Please select an answer.");
// // // //         return;
// // // //       }

// // // //       const nextKey = opt.next_node_key || "END";

// // // //       setPreview((p) => ({
// // // //         ...p,
// // // //         history: [...p.history, current.node_key],
// // // //         currentKey: nextKey as any,
// // // //       }));
// // // //       return;
// // // //     }
// // // //   }

// // // //   function previewBack() {
// // // //     setPreview((p) => {
// // // //       const hist = [...p.history];
// // // //       const prevKey = hist.pop();
// // // //       if (!prevKey) return p;
// // // //       return { ...p, history: hist, currentKey: prevKey };
// // // //     });
// // // //   }

// // // //   function previewRestart() {
// // // //     openPreview();
// // // //   }

// // // //   // Separate preview results (kept same)
// // // //   function computePreviewResults() {
// // // //     if (!flow) {
// // // //       return {
// // // //         cat1: {
// // // //           totalNews2: 0,
// // // //           totalPoints: 0,
// // // //           alert: "GREEN" as SeverityLevel,
// // // //         },
// // // //         cat2: {
// // // //           severity: "GREEN" as SeverityLevel,
// // // //           alert: "GREEN" as SeverityLevel,
// // // //         },
// // // //         finalAlert: "GREEN" as SeverityLevel,
// // // //       };
// // // //     }

// // // //     const nm = nodeMap();
// // // //     let cat1News2 = 0;
// // // //     let cat1Points = 0;
// // // //     let cat2Severity: SeverityLevel = "GREEN";

// // // //     let cat1AlertNodeSeverity: SeverityLevel | null = null;
// // // //     let cat2AlertNodeSeverity: SeverityLevel | null = null;

// // // //     for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
// // // //       const node = nm.get(nodeKey);
// // // //       if (!node || node.node_type !== "QUESTION") continue;

// // // //       const selectedValue = preview.selectedOptionValueByNode[nodeKey];
// // // //       const opt = (node.options || []).find((o) => o.value === selectedValue);
// // // //       if (!opt) continue;

// // // //       if (node.category === 1) {
// // // //         cat1News2 += Number(opt.news2_score || 0);
// // // //         cat1Points += Number(opt.seriousness_points || 0);
// // // //       } else if (node.category === 2) {
// // // //         cat2Severity = maxSeverity(cat2Severity, opt.severity);
// // // //       }
// // // //     }

// // // //     const current = previewCurrentNode();
// // // //     if (current?.node_type === "ALERT" && current.alert_severity) {
// // // //       if (current.category === 1)
// // // //         cat1AlertNodeSeverity = current.alert_severity;
// // // //       if (current.category === 2)
// // // //         cat2AlertNodeSeverity = current.alert_severity;
// // // //     }

// // // //     let cat1Alert = clinicalAlertFromScore(cat1Points);
// // // //     if (cat1AlertNodeSeverity)
// // // //       cat1Alert = maxSeverity(cat1Alert, cat1AlertNodeSeverity);

// // // //     let cat2Alert = cat2Severity;
// // // //     if (cat2AlertNodeSeverity)
// // // //       cat2Alert = maxSeverity(cat2Alert, cat2AlertNodeSeverity);

// // // //     const finalAlert = maxSeverity(cat1Alert, cat2Alert);

// // // //     return {
// // // //       cat1: {
// // // //         totalNews2: cat1News2,
// // // //         totalPoints: cat1Points,
// // // //         alert: cat1Alert,
// // // //       },
// // // //       cat2: { severity: cat2Severity, alert: cat2Alert },
// // // //       finalAlert,
// // // //     };
// // // //   }

// // // //   // ------------------ graph view (read-only) ------------------
// // // //   function buildGraph(): { nodes: Node[]; edges: Edge[] } {
// // // //     if (!flow) return { nodes: [], edges: [] };

// // // //     const byKey = new Map(flow.nodes.map((n) => [n.node_key, n]));
// // // //     const sameCatIndex = new Map<string, number>();
// // // //     for (const cat of [1, 2] as Category[]) {
// // // //       const list = flow.nodes.filter((n) => n.category === cat);
// // // //       list.forEach((n, i) => sameCatIndex.set(n.node_key, i));
// // // //     }

// // // //     const rfNodes: Node[] = flow.nodes.map((n) => {
// // // //       const idx = sameCatIndex.get(n.node_key) ?? 0;
// // // //       const xBase = n.category === 1 ? 80 : 620;
// // // //       const yBase = 80;

// // // //       return {
// // // //         id: n.node_key,
// // // //         position: { x: xBase + n.depth_level * 40, y: yBase + idx * 90 },
// // // //         data: {
// // // //           label: `${CATEGORY_LABEL[n.category]} • ${n.node_type}\n${n.body_text}`,
// // // //         },
// // // //         style: {
// // // //           borderRadius: 12,
// // // //           border: "1px solid #e5e7eb",
// // // //           padding: 10,
// // // //           width: 420,
// // // //           background:
// // // //             n.node_type === "ALERT"
// // // //               ? "#fff7ed"
// // // //               : n.node_type === "MESSAGE"
// // // //                 ? "#f0f9ff"
// // // //                 : "#ffffff",
// // // //           fontSize: 12,
// // // //           lineHeight: 1.2,
// // // //         },
// // // //       };
// // // //     });

// // // //     const rfEdges: Edge[] = [];
// // // //     for (const n of flow.nodes) {
// // // //       if (n.node_type === "QUESTION") {
// // // //         for (const o of n.options || []) {
// // // //           if (!o.next_node_key || o.next_node_key === "END") continue;
// // // //           if (!byKey.has(o.next_node_key)) continue;

// // // //           rfEdges.push({
// // // //             id: `${n.node_key}--${o.value}--${o.next_node_key}`,
// // // //             source: n.node_key,
// // // //             target: o.next_node_key,
// // // //             label: o.label,
// // // //             animated: false,
// // // //             style: { strokeWidth: 1.5 },
// // // //           });
// // // //         }
// // // //       } else {
// // // //         // MESSAGE/ALERT auto_next is usually END; keep only if points to node
// // // //         if (
// // // //           n.auto_next_node_key &&
// // // //           n.auto_next_node_key !== "END" &&
// // // //           byKey.has(n.auto_next_node_key)
// // // //         ) {
// // // //           rfEdges.push({
// // // //             id: `${n.node_key}--auto--${n.auto_next_node_key}`,
// // // //             source: n.node_key,
// // // //             target: n.auto_next_node_key,
// // // //             label: "auto",
// // // //             animated: true,
// // // //             style: { strokeWidth: 1.5 },
// // // //           });
// // // //         }
// // // //       }
// // // //     }

// // // //     return { nodes: rfNodes, edges: rfEdges };
// // // //   }

// // // //   // ------------------ render guards ------------------
// // // //   const visibleNodesCat1 = getVisibleNodesByCategory(1);
// // // //   const visibleNodesCat2 = getVisibleNodesByCategory(2);

// // // //   if (loading && !flow) {
// // // //     return (
// // // //       <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
// // // //         <div className="text-gray-600">Loading questions...</div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const currentPreviewNode = previewCurrentNode();
// // // //   const results = computePreviewResults();
// // // //   const graph = buildGraph();

// // // //   return (
// // // //     <div className="min-h-screen bg-[#f4f5fa] flex">
// // // //       {/* Sidebar (unchanged) */}
// // // //       <aside
// // // //         className={`${
// // // //           sidebarOpen ? "w-64" : "w-20"
// // // //         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
// // // //       >
// // // //         <div className="p-6 border-b border-gray-200 flex items-center gap-3">
// // // //           <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
// // // //             <span className="text-white font-bold">VW</span>
// // // //           </div>
// // // //           {sidebarOpen && (
// // // //             <span className="text-xl font-bold text-teal-600">
// // // //               VIRTUAL WARD
// // // //             </span>
// // // //           )}
// // // //         </div>

// // // //         <nav className="flex-1 p-4 space-y-1">
// // // //           <button
// // // //             onClick={() => router.push("/admin/questionnaires")}
// // // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-colors"
// // // //           >
// // // //             {sidebarOpen && <span>Questionnaires</span>}
// // // //             {!sidebarOpen && <span>Q</span>}
// // // //           </button>

// // // //           <button
// // // //             onClick={logout}
// // // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
// // // //           >
// // // //             {sidebarOpen && <span>Logout</span>}
// // // //             {!sidebarOpen && <span>⎋</span>}
// // // //           </button>
// // // //         </nav>
// // // //       </aside>

// // // //       {/* Main */}
// // // //       <div className="flex-1 flex flex-col">
// // // //         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
// // // //           <div className="flex items-center gap-4">
// // // //             <button
// // // //               onClick={() => setSidebarOpen(!sidebarOpen)}
// // // //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// // // //               aria-label="Toggle sidebar"
// // // //             >
// // // //               ☰
// // // //             </button>

// // // //             <button
// // // //               onClick={() => router.push("/admin/questionnaires")}
// // // //               className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
// // // //             >
// // // //               ← Back
// // // //             </button>
// // // //           </div>

// // // //           <div className="flex items-center gap-2">
// // // //             <button
// // // //               onClick={() =>
// // // //                 setViewMode((m) => (m === "TABLE" ? "GRAPH" : "TABLE"))
// // // //               }
// // // //               className={BTN_OUTLINE}
// // // //               title="Table is editable. Graph is read-only."
// // // //             >
// // // //               {viewMode === "TABLE" ? "🧠 Graph View" : "📋 Table View"}
// // // //             </button>

// // // //             <button onClick={openPreview} className={BTN_PRIMARY}>
// // // //               👁 Preview
// // // //             </button>

// // // //             <button onClick={onValidateClick} className={BTN_PRIMARY}>
// // // //               ✅ Validate
// // // //             </button>

// // // //             <button
// // // //               onClick={saveFlow}
// // // //               disabled={
// // // //                 saving ||
// // // //                 !hasUnsavedChanges ||
// // // //                 !validation.ran ||
// // // //                 !validation.valid
// // // //               }
// // // //               className={BTN_PRIMARY}
// // // //               title={
// // // //                 !validation.ran
// // // //                   ? "Validate before saving"
// // // //                   : !validation.valid
// // // //                     ? "Fix validation errors before saving"
// // // //                     : !hasUnsavedChanges
// // // //                       ? "No changes to save"
// // // //                       : ""
// // // //               }
// // // //             >
// // // //               💾 {saving ? "Saving..." : "Save"}
// // // //             </button>
// // // //           </div>
// // // //         </header>

// // // //         {error && (
// // // //           <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
// // // //             <div className="text-red-700">
// // // //               <strong>Error:</strong> {error}
// // // //             </div>
// // // //             <button
// // // //               onClick={() => setError(null)}
// // // //               className="text-red-700 hover:text-red-900 font-bold"
// // // //             >
// // // //               ✕
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         <main className="flex-1 p-6 overflow-auto">
// // // //           {flow && (
// // // //             <div className="mb-4">
// // // //               <h1 className="text-2xl font-semibold text-gray-900">
// // // //                 Question Management
// // // //               </h1>
// // // //               <p className="text-sm text-gray-500 mt-1">
// // // //                 {flow.name} (Version {flow.version}){" "}
// // // //                 {validation.ran ? (
// // // //                   validation.valid ? (
// // // //                     <span className="ml-2 text-green-700 font-semibold">
// // // //                       ● Valid
// // // //                     </span>
// // // //                   ) : (
// // // //                     <span className="ml-2 text-red-700 font-semibold">
// // // //                       ● Not valid
// // // //                     </span>
// // // //                   )
// // // //                 ) : (
// // // //                   <span className="ml-2 text-gray-500 font-semibold">
// // // //                     ● Not validated
// // // //                   </span>
// // // //                 )}
// // // //                 {hasUnsavedChanges && (
// // // //                   <span className="ml-2 text-amber-700 font-semibold">
// // // //                     ● Unsaved changes
// // // //                   </span>
// // // //                 )}
// // // //               </p>
// // // //             </div>
// // // //           )}

// // // //           {/* Validation results */}
// // // //           {validation.ran && (
// // // //             <div
// // // //               className={`mb-6 rounded-lg border px-6 py-4 ${
// // // //                 validation.valid
// // // //                   ? "bg-green-50 border-green-200"
// // // //                   : "bg-red-50 border-red-200"
// // // //               }`}
// // // //             >
// // // //               <div
// // // //                 className={`font-semibold ${validation.valid ? "text-green-900" : "text-red-900"}`}
// // // //               >
// // // //                 {validation.valid
// // // //                   ? `Validation successful (0 errors, 0 warnings)`
// // // //                   : `Validation failed (${validation.items.filter((x) => x.level === "ERROR").length} errors, ${
// // // //                       validation.items.filter((x) => x.level === "WARNING")
// // // //                         .length
// // // //                     } warnings)`}
// // // //               </div>

// // // //               {!validation.valid && (
// // // //                 <div className="mt-3 space-y-3">
// // // //                   {validation.items.map((it, idx) => (
// // // //                     <div
// // // //                       key={idx}
// // // //                       className="bg-white/60 border border-red-200 rounded-lg p-4"
// // // //                     >
// // // //                       <div className="font-semibold text-red-900">
// // // //                         {it.title}
// // // //                       </div>
// // // //                       <div className="text-sm text-red-900 mt-1">
// // // //                         <strong>Where:</strong> {it.where}
// // // //                       </div>
// // // //                       <div className="text-sm text-red-900 mt-1">
// // // //                         <strong>How to fix:</strong> {it.howToFix}
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}

// // // //           {/* GRAPH VIEW */}
// // // //           {viewMode === "GRAPH" && flow && (
// // // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// // // //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// // // //                 <h2 className="text-lg font-semibold text-teal-900">
// // // //                   Graph View (read-only)
// // // //                 </h2>
// // // //                 <div className="text-xs text-gray-600">
// // // //                   Changes in table update graph automatically.
// // // //                 </div>
// // // //               </div>

// // // //               <div style={{ height: "70vh" }} className="bg-white">
// // // //                 <ReactFlow nodes={graph.nodes} edges={graph.edges} fitView>
// // // //                   <MiniMap />
// // // //                   <Controls />
// // // //                   <Background />
// // // //                 </ReactFlow>
// // // //               </div>
// // // //             </div>
// // // //           )}

// // // //           {/* TABLE VIEW (your existing builder, preserved) */}
// // // //           {viewMode === "TABLE" && flow && (
// // // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // // //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// // // //                 <h2 className="text-lg font-semibold text-teal-900">
// // // //                   Question Flow Builder
// // // //                 </h2>
// // // //                 <div className="flex items-center gap-2">
// // // //                   <button
// // // //                     onClick={() =>
// // // //                       setCollapsedCategories({ 1: false, 2: false })
// // // //                     }
// // // //                     className={BTN_OUTLINE}
// // // //                   >
// // // //                     Expand Categories
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() => setCollapsedCategories({ 1: true, 2: true })}
// // // //                     className={BTN_OUTLINE}
// // // //                   >
// // // //                     Collapse Categories
// // // //                   </button>
// // // //                   <button onClick={expandAllNodes} className={BTN_OUTLINE}>
// // // //                     Expand All
// // // //                   </button>
// // // //                   <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
// // // //                     Collapse All
// // // //                   </button>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="overflow-auto">
// // // //                 <table className="w-full text-sm">
// // // //                   <thead className="bg-gray-50">
// // // //                     <tr className="border-b border-gray-200">
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-10"></th>
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-24">
// // // //                         Node
// // // //                       </th>
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">
// // // //                         Type
// // // //                       </th>
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[300px]">
// // // //                         Body Text
// // // //                       </th>
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[520px]">
// // // //                         Options / Settings
// // // //                       </th>
// // // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">
// // // //                         Actions
// // // //                       </th>
// // // //                     </tr>
// // // //                   </thead>

// // // //                   <tbody>
// // // //                     {([1, 2] as Category[]).map((cat) => {
// // // //                       const collapsed = collapsedCategories[cat];
// // // //                       const visibleNodes =
// // // //                         cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

// // // //                       return (
// // // //                         <Fragment key={`cat-${cat}`}>
// // // //                           <tr className="bg-gray-100 border-b border-gray-200">
// // // //                             <td className="px-3 py-3" colSpan={6}>
// // // //                               <div className="flex items-center justify-between">
// // // //                                 <button
// // // //                                   onClick={() =>
// // // //                                     setCollapsedCategories((p) => ({
// // // //                                       ...p,
// // // //                                       [cat]: !p[cat],
// // // //                                     }))
// // // //                                   }
// // // //                                   className="flex items-center gap-2 text-sm font-semibold text-gray-800"
// // // //                                 >
// // // //                                   <span className="inline-block w-5 text-center">
// // // //                                     {collapsed ? "▶" : "▼"}
// // // //                                   </span>
// // // //                                   <span>{CATEGORY_LABEL[cat]}</span>
// // // //                                   <span className="text-xs font-normal text-gray-500">
// // // //                                     (
// // // //                                     {
// // // //                                       flow.nodes.filter(
// // // //                                         (n) => n.category === cat,
// // // //                                       ).length
// // // //                                     }{" "}
// // // //                                     nodes)
// // // //                                   </span>
// // // //                                 </button>

// // // //                                 <button
// // // //                                   onClick={() => addNode(cat, null)}
// // // //                                   className={BTN_OUTLINE}
// // // //                                 >
// // // //                                   + Add Root Node
// // // //                                 </button>
// // // //                               </div>
// // // //                             </td>
// // // //                           </tr>

// // // //                           {!collapsed &&
// // // //                             visibleNodes.map((node) => {
// // // //                               const hasChild = hasChildren(node.node_key);
// // // //                               const isExpanded = expandedNodes.has(
// // // //                                 node.node_key,
// // // //                               );
// // // //                               const indent = node.depth_level * 24;
// // // //                               const isEditing =
// // // //                                 editingNodeKey === node.node_key;

// // // //                               return (
// // // //                                 <Fragment key={node.node_key}>
// // // //                                   <tr className="border-b border-gray-100 hover:bg-gray-50">
// // // //                                     <td className="px-3 py-2">
// // // //                                       {hasChild && (
// // // //                                         <button
// // // //                                           onClick={() =>
// // // //                                             toggleNode(node.node_key)
// // // //                                           }
// // // //                                           className="text-gray-600 hover:text-gray-900"
// // // //                                         >
// // // //                                           {isExpanded ? "▼" : "▶"}
// // // //                                         </button>
// // // //                                       )}
// // // //                                     </td>

// // // //                                     <td
// // // //                                       className="px-3 py-2"
// // // //                                       style={{
// // // //                                         paddingLeft: `${indent + 12}px`,
// // // //                                       }}
// // // //                                     >
// // // //                                       <span
// // // //                                         className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
// // // //                                       >
// // // //                                         {getCategorySequenceNumber(
// // // //                                           node.node_key,
// // // //                                         )}
// // // //                                       </span>
// // // //                                     </td>

// // // //                                     <td className="px-3 py-2">
// // // //                                       <select
// // // //                                         className={`${SELECT_SM} w-full`}
// // // //                                         value={node.node_type}
// // // //                                         onChange={(e) =>
// // // //                                           updateNode(node.node_key, {
// // // //                                             node_type: e.target
// // // //                                               .value as FlowNodeType,
// // // //                                           })
// // // //                                         }
// // // //                                       >
// // // //                                         <option value="QUESTION">
// // // //                                           Question
// // // //                                         </option>
// // // //                                         <option value="MESSAGE">Message</option>
// // // //                                         <option value="ALERT">Alert</option>
// // // //                                       </select>
// // // //                                     </td>

// // // //                                     <td className="px-3 py-2">
// // // //                                       <input
// // // //                                         className={`${INPUT_SM} w-full`}
// // // //                                         value={node.body_text}
// // // //                                         onChange={(e) =>
// // // //                                           updateNode(node.node_key, {
// // // //                                             body_text: e.target.value,
// // // //                                           })
// // // //                                         }
// // // //                                         placeholder="Question or message..."
// // // //                                       />
// // // //                                     </td>

// // // //                                     <td className="px-3 py-2">
// // // //                                       {node.node_type === "QUESTION" ? (
// // // //                                         <div className="text-xs text-gray-600 flex items-center gap-2">
// // // //                                           <span>
// // // //                                             {node.options?.length || 0} options
// // // //                                           </span>
// // // //                                           <button
// // // //                                             onClick={() =>
// // // //                                               setEditingNodeKey(
// // // //                                                 isEditing
// // // //                                                   ? null
// // // //                                                   : node.node_key,
// // // //                                               )
// // // //                                             }
// // // //                                             className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
// // // //                                           >
// // // //                                             {isEditing ? "Hide" : "Edit"}
// // // //                                           </button>
// // // //                                         </div>
// // // //                                       ) : node.node_type === "ALERT" ? (
// // // //                                         <div className="flex items-center gap-2">
// // // //                                           <span className="text-xs text-gray-600">
// // // //                                             Severity
// // // //                                           </span>
// // // //                                           <select
// // // //                                             className={SELECT_SM}
// // // //                                             value={node.alert_severity || "RED"}
// // // //                                             onChange={(e) =>
// // // //                                               updateNode(node.node_key, {
// // // //                                                 alert_severity: e.target
// // // //                                                   .value as SeverityLevel,
// // // //                                               })
// // // //                                             }
// // // //                                           >
// // // //                                             <option value="GREEN">Green</option>
// // // //                                             <option value="AMBER">Amber</option>
// // // //                                             <option value="RED">Red</option>
// // // //                                           </select>
// // // //                                           <span className="text-xs text-gray-500 italic">
// // // //                                             (end node)
// // // //                                           </span>
// // // //                                         </div>
// // // //                                       ) : (
// // // //                                         <span className="text-xs text-gray-500 italic">
// // // //                                           Message (end node)
// // // //                                         </span>
// // // //                                       )}
// // // //                                     </td>

// // // //                                     <td className="px-3 py-2">
// // // //                                       <div className="flex items-center gap-2 justify-end">
// // // //                                         <button
// // // //                                           onClick={() =>
// // // //                                             addNode(
// // // //                                               node.category,
// // // //                                               node.node_key,
// // // //                                             )
// // // //                                           }
// // // //                                           className={BTN_OUTLINE}
// // // //                                         >
// // // //                                           + Child
// // // //                                         </button>
// // // //                                         <button
// // // //                                           onClick={() =>
// // // //                                             deleteNodeCascade(node.node_key)
// // // //                                           }
// // // //                                           className={BTN_DANGER}
// // // //                                           title="Cascade delete this node and all descendants"
// // // //                                         >
// // // //                                           Delete
// // // //                                         </button>
// // // //                                       </div>
// // // //                                     </td>
// // // //                                   </tr>

// // // //                                   {/* OPTIONS (EDIT MODE) */}
// // // //                                   {isEditing &&
// // // //                                     node.node_type === "QUESTION" &&
// // // //                                     (node.options || []).map((opt, idx) => {
// // // //                                       return (
// // // //                                         <tr
// // // //                                           key={`${node.node_key}-opt-${idx}`}
// // // //                                           className="bg-gray-50 border-b border-gray-100"
// // // //                                         >
// // // //                                           <td
// // // //                                             colSpan={2}
// // // //                                             className="px-3 py-2"
// // // //                                           ></td>

// // // //                                           <td className="px-3 py-2">
// // // //                                             <span className="text-xs text-gray-600">
// // // //                                               Option {idx + 1}
// // // //                                             </span>
// // // //                                           </td>

// // // //                                           <td className="px-3 py-2">
// // // //                                             <input
// // // //                                               className={`${INPUT_SM} w-full`}
// // // //                                               value={opt.label}
// // // //                                               onChange={(e) =>
// // // //                                                 updateOption(
// // // //                                                   node.node_key,
// // // //                                                   idx,
// // // //                                                   {
// // // //                                                     label: e.target.value,
// // // //                                                   },
// // // //                                                 )
// // // //                                               }
// // // //                                               placeholder="Option label"
// // // //                                             />
// // // //                                           </td>

// // // //                                           {/* ✅ single-row controls, clean, no overlap */}
// // // //                                           <td className="px-3 py-2">
// // // //                                             <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
// // // //                                               <span className="text-xs text-gray-600 whitespace-nowrap">
// // // //                                                 Next
// // // //                                               </span>

// // // //                                               <select
// // // //                                                 className={`${SELECT_SM} min-w-[260px]`}
// // // //                                                 value={opt.next_node_key || ""}
// // // //                                                 onChange={(e) =>
// // // //                                                   updateOption(
// // // //                                                     node.node_key,
// // // //                                                     idx,
// // // //                                                     {
// // // //                                                       next_node_key:
// // // //                                                         e.target.value || null,
// // // //                                                     },
// // // //                                                   )
// // // //                                                 }
// // // //                                               >
// // // //                                                 {getAvailableNextNodes(
// // // //                                                   node.category,
// // // //                                                 ).map((nextOpt) => (
// // // //                                                   <option
// // // //                                                     key={nextOpt.key}
// // // //                                                     value={nextOpt.key}
// // // //                                                   >
// // // //                                                     {nextOpt.label}
// // // //                                                   </option>
// // // //                                                 ))}
// // // //                                               </select>

// // // //                                               {/* ✅ Bidirectional part 1: Severity -> Prefill scores */}
// // // //                                               <select
// // // //                                                 className={`${SELECT_SM} w-28`}
// // // //                                                 value={opt.severity}
// // // //                                                 onChange={(e) => {
// // // //                                                   const newSeverity = e.target
// // // //                                                     .value as SeverityLevel;
// // // //                                                   const prefill =
// // // //                                                     PREFILL_BY_SEVERITY[
// // // //                                                       newSeverity
// // // //                                                     ];

// // // //                                                   updateOption(
// // // //                                                     node.node_key,
// // // //                                                     idx,
// // // //                                                     {
// // // //                                                       severity: newSeverity,
// // // //                                                       news2_score:
// // // //                                                         prefill.news2,
// // // //                                                       seriousness_points:
// // // //                                                         prefill.points,
// // // //                                                     },
// // // //                                                   );
// // // //                                                 }}
// // // //                                               >
// // // //                                                 <option value="GREEN">
// // // //                                                   Green
// // // //                                                 </option>
// // // //                                                 <option value="AMBER">
// // // //                                                   Amber
// // // //                                                 </option>
// // // //                                                 <option value="RED">Red</option>
// // // //                                               </select>

// // // //                                               {/* NEWS2 (editable always) */}
// // // //                                               <input
// // // //                                                 className={`${INPUT_SM} w-24`}
// // // //                                                 type="number"
// // // //                                                 value={opt.news2_score}
// // // //                                                 onChange={(e) =>
// // // //                                                   updateOption(
// // // //                                                     node.node_key,
// // // //                                                     idx,
// // // //                                                     {
// // // //                                                       news2_score: Number(
// // // //                                                         e.target.value,
// // // //                                                       ),
// // // //                                                     },
// // // //                                                   )
// // // //                                                 }
// // // //                                                 placeholder="NEWS2"
// // // //                                                 title="NEWS2 Score"
// // // //                                               />

// // // //                                               {/* ✅ Bidirectional part 2: Points -> Severity */}
// // // //                                               <input
// // // //                                                 className={`${INPUT_SM} w-24`}
// // // //                                                 type="number"
// // // //                                                 value={opt.seriousness_points}
// // // //                                                 onChange={(e) => {
// // // //                                                   const pts = Number(
// // // //                                                     e.target.value,
// // // //                                                   );
// // // //                                                   const sev =
// // // //                                                     severityFromPoints(pts);
// // // //                                                   updateOption(
// // // //                                                     node.node_key,
// // // //                                                     idx,
// // // //                                                     {
// // // //                                                       seriousness_points: pts,
// // // //                                                       severity: sev,
// // // //                                                     },
// // // //                                                   );
// // // //                                                 }}
// // // //                                                 placeholder="Points"
// // // //                                                 title="Seriousness Points"
// // // //                                               />

// // // //                                               <button
// // // //                                                 onClick={() =>
// // // //                                                   removeOption(
// // // //                                                     node.node_key,
// // // //                                                     idx,
// // // //                                                   )
// // // //                                                 }
// // // //                                                 disabled={
// // // //                                                   (node.options?.length || 0) <=
// // // //                                                   2
// // // //                                                 }
// // // //                                                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //                                                 title={
// // // //                                                   (node.options?.length || 0) <=
// // // //                                                   2
// // // //                                                     ? "Minimum 2 options required"
// // // //                                                     : "Delete option"
// // // //                                                 }
// // // //                                               >
// // // //                                                 ✕
// // // //                                               </button>
// // // //                                             </div>
// // // //                                           </td>

// // // //                                           <td className="px-3 py-2"></td>
// // // //                                         </tr>
// // // //                                       );
// // // //                                     })}

// // // //                                   {isEditing &&
// // // //                                     node.node_type === "QUESTION" && (
// // // //                                       <tr className="bg-gray-50 border-b border-gray-100">
// // // //                                         <td colSpan={5} className="px-3 py-2">
// // // //                                           <button
// // // //                                             onClick={() =>
// // // //                                               addOption(node.node_key)
// // // //                                             }
// // // //                                             className={BTN_OUTLINE}
// // // //                                           >
// // // //                                             + Add Option
// // // //                                           </button>
// // // //                                         </td>
// // // //                                         <td className="px-3 py-2"></td>
// // // //                                       </tr>
// // // //                                     )}
// // // //                                 </Fragment>
// // // //                               );
// // // //                             })}
// // // //                         </Fragment>
// // // //                       );
// // // //                     })}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             </div>
// // // //           )}

// // // //           {/* PREVIEW MODAL (unchanged layout, still shows computed alerts) */}
// // // //           {preview.open && flow && (
// // // //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // // //               <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
// // // //                 <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
// // // //                   <div className="text-lg font-bold text-white">
// // // //                     Patient Preview
// // // //                   </div>
// // // //                   <button
// // // //                     onClick={closePreview}
// // // //                     className="p-2 hover:bg-teal-700 rounded-lg text-white"
// // // //                   >
// // // //                     ✕
// // // //                   </button>
// // // //                 </div>

// // // //                 <div className="p-6 space-y-4">
// // // //                   {currentPreviewNode ? (
// // // //                     <>
// // // //                       <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
// // // //                         {CATEGORY_LABEL[currentPreviewNode.category]}
// // // //                       </div>

// // // //                       <div className="flex items-start justify-between text-xs text-gray-500 gap-4">
// // // //                         <div>
// // // //                           Node{" "}
// // // //                           {getCategorySequenceNumber(
// // // //                             currentPreviewNode.node_key,
// // // //                           )}{" "}
// // // //                           • {currentPreviewNode.node_type}
// // // //                         </div>

// // // //                         <div className="text-right">
// // // //                           <div>
// // // //                             Cat1 Alert:{" "}
// // // //                             <span className="font-semibold">
// // // //                               {results.cat1.alert}
// // // //                             </span>{" "}
// // // //                             • Points:{" "}
// // // //                             <span className="font-semibold">
// // // //                               {results.cat1.totalPoints}
// // // //                             </span>{" "}
// // // //                             • NEWS2:{" "}
// // // //                             <span className="font-semibold">
// // // //                               {results.cat1.totalNews2}
// // // //                             </span>
// // // //                           </div>
// // // //                           <div className="mt-1">
// // // //                             Cat2 Alert:{" "}
// // // //                             <span className="font-semibold">
// // // //                               {results.cat2.alert}
// // // //                             </span>{" "}
// // // //                             • Final:{" "}
// // // //                             <span className="font-semibold">
// // // //                               {results.finalAlert}
// // // //                             </span>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>

// // // //                       <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
// // // //                         {currentPreviewNode.title && (
// // // //                           <div className="text-lg font-semibold text-gray-900 mb-2">
// // // //                             {currentPreviewNode.title}
// // // //                           </div>
// // // //                         )}
// // // //                         <div className="text-base text-gray-900">
// // // //                           {currentPreviewNode.body_text}
// // // //                         </div>
// // // //                         {currentPreviewNode.help_text && (
// // // //                           <div className="text-sm text-gray-600 italic mt-2">
// // // //                             {currentPreviewNode.help_text}
// // // //                           </div>
// // // //                         )}

// // // //                         {currentPreviewNode.node_type === "QUESTION" && (
// // // //                           <div className="space-y-3 mt-6">
// // // //                             {(currentPreviewNode.options || []).map(
// // // //                               (opt, idx) => {
// // // //                                 const selectedValue =
// // // //                                   preview.selectedOptionValueByNode[
// // // //                                     currentPreviewNode.node_key
// // // //                                   ];
// // // //                                 const checked = selectedValue === opt.value;

// // // //                                 return (
// // // //                                   <button
// // // //                                     key={`${currentPreviewNode.node_key}-ans-${idx}`}
// // // //                                     onClick={() =>
// // // //                                       previewSelectOption(
// // // //                                         currentPreviewNode.node_key,
// // // //                                         opt,
// // // //                                       )
// // // //                                     }
// // // //                                     className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
// // // //                                       checked
// // // //                                         ? "border-teal-600 bg-teal-50"
// // // //                                         : "border-gray-200 hover:border-gray-300 bg-white"
// // // //                                     }`}
// // // //                                   >
// // // //                                     <div className="flex items-center gap-3">
// // // //                                       <div
// // // //                                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
// // // //                                           checked
// // // //                                             ? "border-teal-600 bg-teal-600"
// // // //                                             : "border-gray-300"
// // // //                                         }`}
// // // //                                       >
// // // //                                         {checked && (
// // // //                                           <div className="w-2 h-2 bg-white rounded-full"></div>
// // // //                                         )}
// // // //                                       </div>
// // // //                                       <div className="text-base font-medium text-gray-900">
// // // //                                         {opt.label}
// // // //                                       </div>
// // // //                                     </div>
// // // //                                   </button>
// // // //                                 );
// // // //                               },
// // // //                             )}
// // // //                           </div>
// // // //                         )}

// // // //                         {currentPreviewNode.node_type === "MESSAGE" && (
// // // //                           <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
// // // //                             This is a message. Click <strong>Next</strong> to
// // // //                             finish.
// // // //                           </div>
// // // //                         )}

// // // //                         {currentPreviewNode.node_type === "ALERT" && (
// // // //                           <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
// // // //                             <div className="font-semibold">
// // // //                               Alert Severity:{" "}
// // // //                               {currentPreviewNode.alert_severity || "RED"}
// // // //                             </div>
// // // //                             <div className="mt-1">
// // // //                               This is an end node. Click <strong>Next</strong>{" "}
// // // //                               to finish.
// // // //                             </div>
// // // //                           </div>
// // // //                         )}

// // // //                         <div className="flex items-center justify-between pt-6">
// // // //                           <button
// // // //                             onClick={previewBack}
// // // //                             disabled={preview.history.length === 0}
// // // //                             className={BTN_OUTLINE}
// // // //                           >
// // // //                             Back
// // // //                           </button>
// // // //                           <button
// // // //                             onClick={previewNext}
// // // //                             className={BTN_PRIMARY}
// // // //                             disabled={
// // // //                               currentPreviewNode.node_type === "QUESTION" &&
// // // //                               !preview.selectedOptionValueByNode[
// // // //                                 currentPreviewNode.node_key
// // // //                               ]
// // // //                             }
// // // //                           >
// // // //                             Next
// // // //                           </button>
// // // //                         </div>
// // // //                       </div>
// // // //                     </>
// // // //                   ) : (
// // // //                     <div className="text-center py-10">
// // // //                       <div className="text-xl font-bold text-gray-900">
// // // //                         Questionnaire Complete
// // // //                       </div>
// // // //                       <div className="text-sm text-gray-600 mt-2">
// // // //                         Final Alert:{" "}
// // // //                         <span className="font-semibold">
// // // //                           {results.finalAlert}
// // // //                         </span>{" "}
// // // //                         • Cat1:{" "}
// // // //                         <span className="font-semibold">
// // // //                           {results.cat1.alert}
// // // //                         </span>{" "}
// // // //                         • Cat2:{" "}
// // // //                         <span className="font-semibold">
// // // //                           {results.cat2.alert}
// // // //                         </span>{" "}
// // // //                         • Points:{" "}
// // // //                         <span className="font-semibold">
// // // //                           {results.cat1.totalPoints}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="mt-6 flex items-center justify-center gap-2">
// // // //                         <button
// // // //                           onClick={previewRestart}
// // // //                           className={BTN_OUTLINE}
// // // //                         >
// // // //                           ↻ Restart
// // // //                         </button>
// // // //                         <button onClick={closePreview} className={BTN_PRIMARY}>
// // // //                           Close
// // // //                         </button>
// // // //                       </div>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>

// // // //                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// // // //                   <button
// // // //                     onClick={previewRestart}
// // // //                     className="text-sm text-gray-600 hover:text-gray-900 font-medium"
// // // //                   >
// // // //                     ↻ Restart Preview
// // // //                   </button>
// // // //                   <div className="text-xs text-gray-500">
// // // //                     This is how patients will see the questionnaire
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </main>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { Fragment, useEffect, useMemo, useState, useCallback } from "react";
// // // import { useParams, useRouter } from "next/navigation";

// // // import ReactFlow, {
// // //   Background,
// // //   Controls,
// // //   MiniMap,
// // //   Handle,
// // //   Position,
// // // } from "reactflow";
// // // import "reactflow/dist/style.css";

// // // import dagre from "dagre";

// // // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // type FlowNodeType = "QUESTION" | "MESSAGE" | "ALERT";
// // // type SeverityLevel = "GREEN" | "AMBER" | "RED";

// // // type FlowOption = {
// // //   display_order: number;
// // //   label: string;
// // //   value: string;
// // //   severity: SeverityLevel;
// // //   news2_score: number;
// // //   seriousness_points: number;
// // //   next_node_key: string | null;
// // // };

// // // type Category = 1 | 2;

// // // const CATEGORY_LABEL: Record<Category, string> = {
// // //   1: "Clinical Obs – Colorectal",
// // //   2: "Symptoms and signs",
// // // };

// // // type FlowNode = {
// // //   node_key: string;
// // //   node_type: FlowNodeType;
// // //   category: Category;

// // //   title: string | null;
// // //   body_text: string;
// // //   help_text: string | null;

// // //   parent_node_key: string | null;
// // //   depth_level: number;

// // //   default_next_node_key: string | null;
// // //   auto_next_node_key: string | null;

// // //   ui_ack_required: boolean;
// // //   alert_severity: SeverityLevel | null;
// // //   notify_admin: boolean;

// // //   options: FlowOption[];
// // // };

// // // type Flow = {
// // //   id: number;
// // //   name: string;
// // //   description: string;
// // //   flow_type: string;
// // //   status: string;
// // //   start_node_key: string;
// // //   version: number;
// // //   nodes: FlowNode[];
// // // };

// // // // ================== CONFIG (easy to change) ==================
// // // const SCORE_CATEGORY_1 = {
// // //   RED_POINTS_MIN: 100,
// // //   AMBER_POINTS_MIN: 30,
// // // };

// // // // Prefill defaults when admin chooses severity (for BOTH categories)
// // // // ✅ Change values here anytime (and it will reflect everywhere)
// // // const PREFILL_BY_SEVERITY: Record<
// // //   SeverityLevel,
// // //   { news2: number; points: number }
// // // > = {
// // //   GREEN: { news2: 0, points: 1 }, // meaningful minimum (not always 0)
// // //   AMBER: { news2: 2, points: 30 },
// // //   RED: { news2: 3, points: 100 },
// // // };

// // // const RULES = {
// // //   AUTO_FIX_START_NODE: true,
// // //   START_NODE_CATEGORY_PRIORITY: [1, 2] as Category[],
// // // };

// // // // ------------------ API helpers ------------------
// // // async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// // //   const res = await fetch(url, {
// // //     headers: { Authorization: `Bearer ${accessToken}` },
// // //     cache: "no-store",
// // //   });
// // //   const body = await res.json().catch(() => null);
// // //   if (!res.ok)
// // //     throw new Error(body?.detail || body?.message || "Request failed");
// // //   return body as T;
// // // }

// // // async function apiPut<T>(
// // //   url: string,
// // //   accessToken: string,
// // //   body: any,
// // // ): Promise<T> {
// // //   const res = await fetch(url, {
// // //     method: "PUT",
// // //     headers: {
// // //       Authorization: `Bearer ${accessToken}`,
// // //       "Content-Type": "application/json",
// // //     },
// // //     body: JSON.stringify(body),
// // //   });
// // //   const data = await res.json().catch(() => ({}));
// // //   if (!res.ok)
// // //     throw new Error(data?.detail || data?.message || "Request failed");
// // //   return data as T;
// // // }

// // // // ------------------ UI helpers ------------------
// // // const SEVERITY_ORDER: Record<SeverityLevel, number> = {
// // //   GREEN: 1,
// // //   AMBER: 2,
// // //   RED: 3,
// // // };

// // // function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
// // //   return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
// // // }

// // // function clinicalAlertFromScore(totalPoints: number): SeverityLevel {
// // //   if (totalPoints >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
// // //   if (totalPoints >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";
// // //   return "GREEN";
// // // }

// // // // Bidirectional: Scores -> Severity
// // // function severityFromScores(points: number, news2: number): SeverityLevel {
// // //   // Primary: points thresholds (as agreed)
// // //   const p = Number.isFinite(points) ? points : 0;
// // //   if (p >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
// // //   if (p >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";

// // //   // Secondary: if points are low but NEWS2 is high, push severity up slightly (optional)
// // //   const n = Number.isFinite(news2) ? news2 : 0;
// // //   if (n >= 3) return maxSeverity("AMBER", "AMBER");
// // //   return "GREEN";
// // // }

// // // function badgeColorClass() {
// // //   return "bg-teal-600 text-white";
// // // }

// // // const BTN_PRIMARY =
// // //   "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // const BTN_OUTLINE =
// // //   "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // // const BTN_DANGER =
// // //   "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// // // // Clean input/select styling
// // // const INPUT_SM =
// // //   "px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
// // // const SELECT_SM = INPUT_SM;

// // // type ValidationItem = {
// // //   level: "ERROR" | "WARNING";
// // //   title: string;
// // //   where: string;
// // //   howToFix: string;
// // // };

// // // type ValidationState = {
// // //   ran: boolean;
// // //   valid: boolean;
// // //   items: ValidationItem[];
// // // };

// // // type PreviewState = {
// // //   open: boolean;
// // //   currentKey: string | "END";
// // //   history: string[];
// // //   answers: Record<string, string>;
// // //   selectedOptionValueByNode: Record<string, string>;
// // // };

// // // // ================== Graph helpers ==================
// // // type CustomNodeData = {
// // //   title: string;
// // //   subtitle: string;
// // //   nodeType: FlowNodeType;
// // //   severity?: SeverityLevel | null;
// // // };

// // // function severityChip(sev?: SeverityLevel | null) {
// // //   const s = sev ?? "GREEN";
// // //   const cls =
// // //     s === "RED"
// // //       ? "bg-red-100 text-red-800 border-red-200"
// // //       : s === "AMBER"
// // //         ? "bg-amber-100 text-amber-800 border-amber-200"
// // //         : "bg-emerald-100 text-emerald-800 border-emerald-200";
// // //   return `inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`;
// // // }

// // // function nodeTypeChip(t: FlowNodeType) {
// // //   const cls =
// // //     t === "ALERT"
// // //       ? "bg-red-50 text-red-700 border-red-200"
// // //       : t === "MESSAGE"
// // //         ? "bg-gray-50 text-gray-700 border-gray-200"
// // //         : "bg-teal-50 text-teal-700 border-teal-200";
// // //   return `inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`;
// // // }

// // // function CustomGraphNode({ data }: { data: CustomNodeData }) {
// // //   return (
// // //     <div className="px-4 py-3 shadow-sm rounded-xl bg-white border border-gray-200 min-w-[280px]">
// // //       <div className="flex items-center justify-between gap-3">
// // //         <span className={nodeTypeChip(data.nodeType)}>{data.nodeType}</span>
// // //         <span className={severityChip(data.severity)}>
// // //           {data.severity ?? "GREEN"}
// // //         </span>
// // //       </div>

// // //       <div className="mt-2 text-sm font-semibold text-gray-900 truncate">
// // //         {data.title}
// // //       </div>
// // //       <div className="text-xs text-gray-500 mt-1 truncate">{data.subtitle}</div>

// // //       <Handle
// // //         type="target"
// // //         position={Position.Top}
// // //         className="!w-16 !bg-teal-500"
// // //       />
// // //       <Handle
// // //         type="source"
// // //         position={Position.Bottom}
// // //         className="!w-16 !bg-teal-500"
// // //       />
// // //     </div>
// // //   );
// // // }

// // // function buildTreeLayout(nodes: Node[], edges: Edge[]) {
// // //   const g = new dagre.graphlib.Graph();
// // //   g.setDefaultEdgeLabel(() => ({}));
// // //   g.setGraph({
// // //     rankdir: "TB",
// // //     nodesep: 80,
// // //     ranksep: 110,
// // //     marginx: 40,
// // //     marginy: 40,
// // //   });

// // //   const NODE_W = 320;
// // //   const NODE_H = 92;

// // //   nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
// // //   edges.forEach((e) => g.setEdge(e.source, e.target));

// // //   dagre.layout(g);

// // //   const laidOut = nodes.map((n) => {
// // //     const p = g.node(n.id);
// // //     return {
// // //       ...n,
// // //       position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 },
// // //     };
// // //   });

// // //   return { nodes: laidOut, edges };
// // // }

// // // export default function QuestionManagementPage() {
// // //   const router = useRouter();
// // //   const params = useParams<{ flowId: string }>();
// // //   const flowId = Number(params.flowId);

// // //   const [sidebarOpen, setSidebarOpen] = useState(true);
// // //   const [viewMode, setViewMode] = useState<"TABLE" | "GRAPH">("TABLE");

// // //   const token = useMemo(
// // //     () =>
// // //       typeof window !== "undefined"
// // //         ? localStorage.getItem("access_token")
// // //         : null,
// // //     [],
// // //   );

// // //   const [loading, setLoading] = useState(true);
// // //   const [flow, setFlow] = useState<Flow | null>(null);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const [saving, setSaving] = useState(false);
// // //   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// // //   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
// // //   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

// // //   const [collapsedCategories, setCollapsedCategories] = useState<
// // //     Record<Category, boolean>
// // //   >({
// // //     1: false,
// // //     2: false,
// // //   });

// // //   const [validation, setValidation] = useState<ValidationState>({
// // //     ran: false,
// // //     valid: false,
// // //     items: [],
// // //   });

// // //   const [preview, setPreview] = useState<PreviewState>({
// // //     open: false,
// // //     currentKey: "END",
// // //     history: [],
// // //     answers: {},
// // //     selectedOptionValueByNode: {},
// // //   });

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
// // //     if (!token) {
// // //       router.replace("/login");
// // //       return;
// // //     }
// // //     if (!Number.isFinite(flowId) || flowId <= 0) {
// // //       setError("Invalid flowId in route");
// // //       setLoading(false);
// // //       return;
// // //     }
// // //     loadFlow();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [token, flowId]);

// // //   function pickFirstRootNodeKeyAnyCategory(nodes: FlowNode[]): string | null {
// // //     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
// // //       const root = nodes.find((n) => n.category === cat && !n.parent_node_key);
// // //       if (root) return root.node_key;
// // //     }
// // //     return nodes[0]?.node_key ?? null;
// // //   }

// // //   async function loadFlow() {
// // //     if (!token) return;
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

// // //       // Ensure ALERT nodes always have a real stored default severity
// // //       const fixed: Flow = {
// // //         ...data,
// // //         nodes: (data.nodes || []).map((n) =>
// // //           n.node_type === "ALERT" && !n.alert_severity
// // //             ? { ...n, alert_severity: "RED" }
// // //             : n,
// // //         ),
// // //       };

// // //       // ✅ Auto-fix start_node_key so user can build only one category
// // //       if (RULES.AUTO_FIX_START_NODE) {
// // //         const keys = new Set(fixed.nodes.map((n) => n.node_key));
// // //         if (!fixed.start_node_key || !keys.has(fixed.start_node_key)) {
// // //           fixed.start_node_key =
// // //             pickFirstRootNodeKeyAnyCategory(fixed.nodes) ?? "END";
// // //         }
// // //       }

// // //       setFlow(fixed);
// // //       setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
// // //       setHasUnsavedChanges(false);
// // //       setValidation({ ran: false, valid: false, items: [] });
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to load flow");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function saveFlow() {
// // //     if (!token || !flow) return;

// // //     if (!validation.ran || !validation.valid) {
// // //       alert("Please validate the questionnaire before saving.");
// // //       return;
// // //     }
// // //     if (!hasUnsavedChanges) {
// // //       alert("No changes to save.");
// // //       return;
// // //     }

// // //     try {
// // //       setSaving(true);
// // //       setError(null);

// // //       const payload = {
// // //         name: flow.name,
// // //         description: flow.description,
// // //         flow_type: flow.flow_type,
// // //         status: flow.status,
// // //         start_node_key: flow.start_node_key,
// // //         nodes: flow.nodes,
// // //       };

// // //       const data = await apiPut<any>(
// // //         `${API_BASE}/flows/${flow.id}`,
// // //         token,
// // //         payload,
// // //       );
// // //       await loadFlow();
// // //       setHasUnsavedChanges(false);
// // //       alert(`Saved! Version: ${data.version ?? "?"}`);
// // //     } catch (e: any) {
// // //       setError(e?.message || "Failed to save flow");
// // //       alert("Failed to save: " + (e?.message || "Unknown error"));
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   }

// // //   // ------------------ helpers: indexes/maps ------------------
// // //   function nodeMap(): Map<string, FlowNode> {
// // //     return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
// // //   }

// // //   function childrenMap(): Map<string, FlowNode[]> {
// // //     const map = new Map<string, FlowNode[]>();
// // //     for (const n of flow?.nodes || []) {
// // //       if (!n.parent_node_key) continue;
// // //       const arr = map.get(n.parent_node_key) || [];
// // //       arr.push(n);
// // //       map.set(n.parent_node_key, arr);
// // //     }
// // //     return map;
// // //   }

// // //   function hasChildren(nodeKey: string): boolean {
// // //     if (!flow) return false;
// // //     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
// // //   }

// // //   function toggleNode(nodeKey: string) {
// // //     setExpandedNodes((prev) => {
// // //       const next = new Set(prev);
// // //       next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
// // //       return next;
// // //     });
// // //   }

// // //   function expandAllNodes() {
// // //     if (!flow) return;
// // //     setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
// // //   }
// // //   function collapseAllNodes() {
// // //     setExpandedNodes(new Set());
// // //   }

// // //   function getVisibleNodesByCategory(category: Category): FlowNode[] {
// // //     if (!flow) return [];
// // //     const nm = nodeMap();
// // //     function shouldShow(node: FlowNode): boolean {
// // //       if (node.category !== category) return false;
// // //       if (!node.parent_node_key) return true;
// // //       const parent = nm.get(node.parent_node_key);
// // //       if (!parent) return true;
// // //       if (parent.category !== category) return false;
// // //       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
// // //     }
// // //     return flow.nodes.filter(shouldShow);
// // //   }

// // //   function getCategorySequenceNumber(nodeKey: string): number {
// // //     if (!flow) return 0;
// // //     const n = flow.nodes.find((x) => x.node_key === nodeKey);
// // //     if (!n) return 0;
// // //     const sameCat = flow.nodes.filter((x) => x.category === n.category);
// // //     const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
// // //     return idx >= 0 ? idx + 1 : 0;
// // //   }

// // //   function getAvailableNextNodes(
// // //     category: Category,
// // //   ): Array<{ key: string; label: string }> {
// // //     const base = [
// // //       { key: "", label: "-- Select Next --" },
// // //       { key: "END", label: "END - Complete Flow" },
// // //     ];
// // //     if (!flow) return base;

// // //     const sameCategory = flow.nodes.filter((n) => n.category === category);
// // //     return [
// // //       ...base,
// // //       ...sameCategory.map((node) => ({
// // //         key: node.node_key,
// // //         label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
// // //       })),
// // //     ];
// // //   }

// // //   // ------------------ state update utilities ------------------
// // //   function markChanged() {
// // //     setHasUnsavedChanges(true);
// // //     setValidation({ ran: false, valid: false, items: [] });
// // //   }

// // //   function makeDefaultOptions(_category: Category): FlowOption[] {
// // //     const baseSeverity: SeverityLevel = "GREEN";
// // //     const prefill = PREFILL_BY_SEVERITY[baseSeverity];

// // //     return [
// // //       {
// // //         display_order: 1,
// // //         label: "Option 1",
// // //         value: "opt1",
// // //         severity: baseSeverity,
// // //         news2_score: prefill.news2,
// // //         seriousness_points: prefill.points,
// // //         next_node_key: null,
// // //       },
// // //       {
// // //         display_order: 2,
// // //         label: "Option 2",
// // //         value: "opt2",
// // //         severity: baseSeverity,
// // //         news2_score: prefill.news2,
// // //         seriousness_points: prefill.points,
// // //         next_node_key: null,
// // //       },
// // //     ];
// // //   }

// // //   function updateNode(nodeKey: string, updates: Partial<FlowNode>) {
// // //     if (!flow) return;

// // //     setFlow((prev) => {
// // //       if (!prev) return prev;

// // //       const updatedNodes = prev.nodes.map((n) => {
// // //         if (n.node_key !== nodeKey) return n;

// // //         if (updates.node_type === "ALERT") {
// // //           return {
// // //             ...n,
// // //             ...updates,
// // //             options: [],
// // //             alert_severity: (updates.alert_severity ??
// // //               n.alert_severity ??
// // //               "RED") as SeverityLevel,
// // //           };
// // //         }

// // //         if (updates.node_type === "MESSAGE") {
// // //           return {
// // //             ...n,
// // //             ...updates,
// // //             options: [],
// // //             alert_severity: null,
// // //           };
// // //         }

// // //         if (updates.node_type === "QUESTION") {
// // //           const options =
// // //             n.options?.length >= 2 ? n.options : makeDefaultOptions(n.category);
// // //           return { ...n, ...updates, options };
// // //         }

// // //         return { ...n, ...updates };
// // //       });

// // //       return { ...prev, nodes: updatedNodes };
// // //     });

// // //     markChanged();
// // //   }

// // //   function updateOption(
// // //     nodeKey: string,
// // //     optionIdx: number,
// // //     updates: Partial<FlowOption>,
// // //   ) {
// // //     if (!flow) return;

// // //     setFlow((prev) => {
// // //       if (!prev) return prev;
// // //       return {
// // //         ...prev,
// // //         nodes: prev.nodes.map((n) => {
// // //           if (n.node_key !== nodeKey) return n;
// // //           const options = [...(n.options || [])];
// // //           options[optionIdx] = { ...options[optionIdx], ...updates };
// // //           return { ...n, options };
// // //         }),
// // //       };
// // //     });

// // //     markChanged();
// // //   }

// // //   function addOption(nodeKey: string) {
// // //     if (!flow) return;
// // //     setFlow((prev) => {
// // //       if (!prev) return prev;
// // //       return {
// // //         ...prev,
// // //         nodes: prev.nodes.map((n) => {
// // //           if (n.node_key !== nodeKey) return n;
// // //           const nextIndex = (n.options?.length || 0) + 1;

// // //           const baseSeverity: SeverityLevel = "GREEN";
// // //           const prefill = PREFILL_BY_SEVERITY[baseSeverity];

// // //           return {
// // //             ...n,
// // //             options: [
// // //               ...(n.options || []),
// // //               {
// // //                 display_order: nextIndex,
// // //                 label: `Option ${nextIndex}`,
// // //                 value: `opt_${nextIndex}`,
// // //                 severity: baseSeverity,
// // //                 news2_score: prefill.news2,
// // //                 seriousness_points: prefill.points,
// // //                 next_node_key: null,
// // //               },
// // //             ],
// // //           };
// // //         }),
// // //       };
// // //     });
// // //     markChanged();
// // //   }

// // //   function removeOption(nodeKey: string, optionIdx: number) {
// // //     if (!flow) return;
// // //     setFlow((prev) => {
// // //       if (!prev) return prev;
// // //       return {
// // //         ...prev,
// // //         nodes: prev.nodes.map((n) => {
// // //           if (n.node_key !== nodeKey) return n;
// // //           if ((n.options?.length || 0) <= 2) return n;
// // //           const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
// // //           const resequenced = filtered.map((o, i) => ({
// // //             ...o,
// // //             display_order: i + 1,
// // //           }));
// // //           return { ...n, options: resequenced };
// // //         }),
// // //       };
// // //     });
// // //     markChanged();
// // //   }

// // //   function addNode(category: Category, parentKey: string | null = null) {
// // //     if (!flow) return;

// // //     const siblingsCount = flow.nodes.filter(
// // //       (n) => n.parent_node_key === parentKey && n.category === category,
// // //     ).length;

// // //     const newKey = parentKey
// // //       ? `${parentKey}.${siblingsCount + 1}`
// // //       : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

// // //     const newNode: FlowNode = {
// // //       node_key: newKey,
// // //       node_type: "QUESTION",
// // //       category,
// // //       title: "New Question",
// // //       body_text: "Enter your question here",
// // //       help_text: null,
// // //       parent_node_key: parentKey,
// // //       depth_level: newKey.split(".").length - 1,
// // //       default_next_node_key: null,
// // //       auto_next_node_key: null,
// // //       ui_ack_required: false,
// // //       alert_severity: null,
// // //       notify_admin: false,
// // //       options: makeDefaultOptions(category),
// // //     };

// // //     setFlow((prev) =>
// // //       prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
// // //     );
// // //     setExpandedNodes((prev) => new Set([...prev, newKey]));
// // //     markChanged();
// // //   }

// // //   // ------------------ delete node (cascade descendants + clear references) ------------------
// // //   function collectDescendants(rootKey: string): Set<string> {
// // //     const cm = childrenMap();
// // //     const toDelete = new Set<string>();
// // //     const stack = [rootKey];
// // //     while (stack.length) {
// // //       const k = stack.pop()!;
// // //       if (toDelete.has(k)) continue;
// // //       toDelete.add(k);
// // //       const kids = cm.get(k) || [];
// // //       for (const child of kids) stack.push(child.node_key);
// // //     }
// // //     return toDelete;
// // //   }

// // //   function deleteNodeCascade(nodeKey: string) {
// // //     if (!flow) return;
// // //     const toDelete = collectDescendants(nodeKey);

// // //     setFlow((prev) => {
// // //       if (!prev) return prev;

// // //       const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

// // //       const cleaned = remaining.map((n) => {
// // //         if (n.node_type !== "QUESTION") return n;

// // //         const newOptions = (n.options || []).map((o) => {
// // //           if (o.next_node_key && toDelete.has(o.next_node_key)) {
// // //             return { ...o, next_node_key: null };
// // //           }
// // //           return o;
// // //         });

// // //         const newParent =
// // //           n.parent_node_key && toDelete.has(n.parent_node_key)
// // //             ? null
// // //             : n.parent_node_key;

// // //         return { ...n, parent_node_key: newParent, options: newOptions };
// // //       });

// // //       return { ...prev, nodes: cleaned };
// // //     });

// // //     if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);
// // //     markChanged();
// // //   }

// // //   // ------------------ FRONTEND VALIDATION ------------------
// // //   function validateFrontend(): ValidationState {
// // //     if (!flow)
// // //       return {
// // //         ran: true,
// // //         valid: false,
// // //         items: [
// // //           {
// // //             level: "ERROR",
// // //             title: "Flow not loaded",
// // //             where: "Flow",
// // //             howToFix: "Reload the page and try again.",
// // //           },
// // //         ],
// // //       };

// // //     const items: ValidationItem[] = [];
// // //     const nm = nodeMap();
// // //     const keys = new Set([...nm.keys()]);
// // //     const allowedCats = new Set<number>([1, 2]);

// // //     if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
// // //       items.push({
// // //         level: "ERROR",
// // //         title: "Start node is missing or invalid",
// // //         where: `Start Node: ${flow.start_node_key || "(empty)"}`,
// // //         howToFix: `Set start_node_key to an existing node key (usually the first question).`,
// // //       });
// // //     }

// // //     const seen = new Set<string>();
// // //     for (const n of flow.nodes) {
// // //       if (seen.has(n.node_key)) {
// // //         items.push({
// // //           level: "ERROR",
// // //           title: "Duplicate node key found",
// // //           where: `Node Key: ${n.node_key}`,
// // //           howToFix: "Ensure every node has a unique node_key.",
// // //         });
// // //       }
// // //       seen.add(n.node_key);
// // //     }

// // //     for (const n of flow.nodes) {
// // //       if (!allowedCats.has(n.category)) {
// // //         items.push({
// // //           level: "ERROR",
// // //           title: "Invalid category",
// // //           where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // //           howToFix: "Category must be either 1 or 2.",
// // //         });
// // //       }

// // //       if (n.parent_node_key) {
// // //         const parent = nm.get(n.parent_node_key);
// // //         if (!parent) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Parent node not found",
// // //             where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// // //             howToFix:
// // //               "Either fix parent_node_key or delete/recreate this node under a valid parent.",
// // //           });
// // //         } else if (parent.category !== n.category) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Category mismatch between parent and child",
// // //             where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
// // //             howToFix: `Move the node under a parent in the same category.`,
// // //           });
// // //         }
// // //       }
// // //     }

// // //     for (const node of flow.nodes) {
// // //       const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

// // //       if (node.node_type === "QUESTION") {
// // //         if (!node.options || node.options.length < 2) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Question must have at least 2 options",
// // //             where: whereNode,
// // //             howToFix: "Add more options until there are at least 2.",
// // //           });
// // //         }

// // //         for (const opt of node.options || []) {
// // //           const whereOpt = `${whereNode} → Option "${opt.label}"`;

// // //           if (!opt.label || !opt.label.trim()) {
// // //             items.push({
// // //               level: "ERROR",
// // //               title: "Option label is empty",
// // //               where: whereOpt,
// // //               howToFix: "Give this option a meaningful label (e.g., Yes / No).",
// // //             });
// // //           }

// // //           if (!opt.next_node_key) {
// // //             items.push({
// // //               level: "ERROR",
// // //               title: "Option next step is missing",
// // //               where: whereOpt,
// // //               howToFix: `Select a Next node for this option (or choose END).`,
// // //             });
// // //           } else if (opt.next_node_key !== "END") {
// // //             const dst = nm.get(opt.next_node_key);
// // //             if (!dst) {
// // //               items.push({
// // //                 level: "ERROR",
// // //                 title: "Option points to a node that does not exist",
// // //                 where: whereOpt,
// // //                 howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
// // //               });
// // //             } else if (dst.category !== node.category) {
// // //               items.push({
// // //                 level: "ERROR",
// // //                 title: "Option next node must be in the same category",
// // //                 where: `${whereOpt} → Next "${dst.node_key}"`,
// // //                 howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
// // //               });
// // //             }
// // //           }
// // //         }
// // //       }

// // //       if (node.node_type === "MESSAGE") {
// // //         if (node.options && node.options.length > 0) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Message must not have options",
// // //             where: whereNode,
// // //             howToFix: "Change node type to QUESTION if you need options.",
// // //           });
// // //         }
// // //       }

// // //       if (node.node_type === "ALERT") {
// // //         if (!node.alert_severity) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Alert severity is missing",
// // //             where: whereNode,
// // //             howToFix: "Select Green / Amber / Red for this Alert.",
// // //           });
// // //         }
// // //         if (node.options && node.options.length > 0) {
// // //           items.push({
// // //             level: "ERROR",
// // //             title: "Alert must not have options",
// // //             where: whereNode,
// // //             howToFix:
// // //               "Alerts are end nodes. Remove options or change type to QUESTION.",
// // //           });
// // //         }
// // //       }
// // //     }

// // //     // cycle detection
// // //     const graph = new Map<string, string[]>();
// // //     function addEdge(src: string, dst: string | null) {
// // //       if (!dst) return;
// // //       graph.set(src, [...(graph.get(src) || []), dst]);
// // //     }
// // //     for (const n of flow.nodes) {
// // //       if (n.node_type === "QUESTION") {
// // //         for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
// // //       }
// // //     }
// // //     const visited = new Set<string>();
// // //     const stack = new Set<string>();
// // //     function dfs(u: string): boolean {
// // //       if (u === "END") return false;
// // //       if (stack.has(u)) return true;
// // //       if (visited.has(u)) return false;
// // //       visited.add(u);
// // //       stack.add(u);
// // //       for (const v of graph.get(u) || []) {
// // //         if (v && dfs(v)) return true;
// // //       }
// // //       stack.delete(u);
// // //       return false;
// // //     }
// // //     if (flow.start_node_key && keys.has(flow.start_node_key)) {
// // //       if (dfs(flow.start_node_key)) {
// // //         items.push({
// // //           level: "ERROR",
// // //           title: "Flow contains a cycle (loop)",
// // //           where: `Start node path from ${flow.start_node_key}`,
// // //           howToFix: "Break the loop by changing an option's Next to END.",
// // //         });
// // //       }
// // //     }

// // //     const valid = items.filter((x) => x.level === "ERROR").length === 0;
// // //     return { ran: true, valid, items };
// // //   }

// // //   function onValidateClick() {
// // //     const result = validateFrontend();
// // //     setValidation(result);
// // //     if (!result.valid) window.scrollTo({ top: 0, behavior: "smooth" });
// // //   }

// // //   // ------------------ PREVIEW (frontend routing) ------------------
// // //   function openPreview() {
// // //     if (!flow) return;

// // //     const start =
// // //       flow.start_node_key && nodeMap().has(flow.start_node_key)
// // //         ? flow.start_node_key
// // //         : "END";

// // //     setPreview({
// // //       open: true,
// // //       currentKey: start,
// // //       history: [],
// // //       answers: {},
// // //       selectedOptionValueByNode: {},
// // //     });
// // //   }

// // //   function closePreview() {
// // //     setPreview((p) => ({ ...p, open: false }));
// // //   }

// // //   function previewCurrentNode(): FlowNode | null {
// // //     if (!flow) return null;
// // //     if (!preview.open) return null;
// // //     if (preview.currentKey === "END") return null;
// // //     return nodeMap().get(preview.currentKey) || null;
// // //   }

// // //   function previewSelectOption(nodeKey: string, opt: FlowOption) {
// // //     setPreview((p) => ({
// // //       ...p,
// // //       answers: { ...p.answers, [nodeKey]: opt.label },
// // //       selectedOptionValueByNode: {
// // //         ...p.selectedOptionValueByNode,
// // //         [nodeKey]: opt.value,
// // //       },
// // //     }));
// // //   }

// // //   function previewNext() {
// // //     if (!flow) return;
// // //     const current = previewCurrentNode();
// // //     if (!current) return;

// // //     if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
// // //       setPreview((p) => ({
// // //         ...p,
// // //         history: [...p.history, current.node_key],
// // //         currentKey: "END",
// // //       }));
// // //       return;
// // //     }

// // //     if (current.node_type === "QUESTION") {
// // //       const selectedValue = preview.selectedOptionValueByNode[current.node_key];
// // //       const opt = (current.options || []).find(
// // //         (o) => o.value === selectedValue,
// // //       );

// // //       if (!opt) {
// // //         alert("Please select an answer.");
// // //         return;
// // //       }

// // //       const nextKey = opt.next_node_key || "END";
// // //       setPreview((p) => ({
// // //         ...p,
// // //         history: [...p.history, current.node_key],
// // //         currentKey: nextKey as any,
// // //       }));
// // //     }
// // //   }

// // //   function previewBack() {
// // //     setPreview((p) => {
// // //       const hist = [...p.history];
// // //       const prevKey = hist.pop();
// // //       if (!prevKey) return p;
// // //       return { ...p, history: hist, currentKey: prevKey };
// // //     });
// // //   }

// // //   function previewRestart() {
// // //     openPreview();
// // //   }

// // //   // ✅ Final alert: max(category1 severity derived from score, category2 severity derived from score)
// // //   function computePreviewResults() {
// // //     if (!flow) {
// // //       return {
// // //         cat1: {
// // //           totalNews2: 0,
// // //           totalPoints: 0,
// // //           alert: "GREEN" as SeverityLevel,
// // //         },
// // //         cat2: {
// // //           totalNews2: 0,
// // //           totalPoints: 0,
// // //           alert: "GREEN" as SeverityLevel,
// // //         },
// // //         finalAlert: "GREEN" as SeverityLevel,
// // //       };
// // //     }

// // //     const nm = nodeMap();
// // //     let cat1News2 = 0;
// // //     let cat1Points = 0;
// // //     let cat2News2 = 0;
// // //     let cat2Points = 0;

// // //     let cat1AlertNodeSeverity: SeverityLevel | null = null;
// // //     let cat2AlertNodeSeverity: SeverityLevel | null = null;

// // //     for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
// // //       const node = nm.get(nodeKey);
// // //       if (!node || node.node_type !== "QUESTION") continue;

// // //       const selectedValue = preview.selectedOptionValueByNode[nodeKey];
// // //       const opt = (node.options || []).find((o) => o.value === selectedValue);
// // //       if (!opt) continue;

// // //       if (node.category === 1) {
// // //         cat1News2 += Number(opt.news2_score || 0);
// // //         cat1Points += Number(opt.seriousness_points || 0);
// // //       } else {
// // //         cat2News2 += Number(opt.news2_score || 0);
// // //         cat2Points += Number(opt.seriousness_points || 0);
// // //       }
// // //     }

// // //     const current = previewCurrentNode();
// // //     if (current?.node_type === "ALERT" && current.alert_severity) {
// // //       if (current.category === 1)
// // //         cat1AlertNodeSeverity = current.alert_severity;
// // //       if (current.category === 2)
// // //         cat2AlertNodeSeverity = current.alert_severity;
// // //     }

// // //     let cat1Alert = clinicalAlertFromScore(cat1Points);
// // //     if (cat1AlertNodeSeverity)
// // //       cat1Alert = maxSeverity(cat1Alert, cat1AlertNodeSeverity);

// // //     let cat2Alert = severityFromScores(cat2Points, cat2News2);
// // //     if (cat2AlertNodeSeverity)
// // //       cat2Alert = maxSeverity(cat2Alert, cat2AlertNodeSeverity);

// // //     const finalAlert = maxSeverity(cat1Alert, cat2Alert);

// // //     return {
// // //       cat1: {
// // //         totalNews2: cat1News2,
// // //         totalPoints: cat1Points,
// // //         alert: cat1Alert,
// // //       },
// // //       cat2: {
// // //         totalNews2: cat2News2,
// // //         totalPoints: cat2Points,
// // //         alert: cat2Alert,
// // //       },
// // //       finalAlert,
// // //     };
// // //   }

// // //   // ------------------ GRAPH BUILD (read-only) ------------------
// // //   const graph = useMemo(() => {
// // //     if (!flow) return { nodes: [] as Node[], edges: [] as Edge[] };

// // //     const nm = new Map(flow.nodes.map((n) => [n.node_key, n]));
// // //     const rfNodes: Node[] = [];
// // //     const rfEdges: Edge[] = [];

// // //     for (const n of flow.nodes) {
// // //       const label = n.body_text || n.title || n.node_key;

// // //       let sev: SeverityLevel | null = null;
// // //       if (n.node_type === "ALERT") sev = n.alert_severity ?? "RED";
// // //       else if (n.node_type === "QUESTION") {
// // //         // show "worst" option severity for quick overview
// // //         let s: SeverityLevel = "GREEN";
// // //         for (const o of n.options || []) s = maxSeverity(s, o.severity);
// // //         sev = s;
// // //       } else sev = "GREEN";

// // //       rfNodes.push({
// // //         id: n.node_key,
// // //         type: "custom",
// // //         data: {
// // //           title: `${CATEGORY_LABEL[n.category]} • ${label}`,
// // //           subtitle: `${n.node_type} • key ${n.node_key}`,
// // //           nodeType: n.node_type,
// // //           severity: sev,
// // //         } satisfies CustomNodeData,
// // //         position: { x: 0, y: 0 },
// // //       });
// // //     }

// // //     // edges from QUESTION options
// // //     for (const n of flow.nodes) {
// // //       if (n.node_type !== "QUESTION") continue;
// // //       for (const o of n.options || []) {
// // //         const target = o.next_node_key;
// // //         if (!target || target === "END") continue;
// // //         if (!nm.has(target)) continue;

// // //         rfEdges.push({
// // //           id: `${n.node_key}--${o.value}-->${target}`,
// // //           source: n.node_key,
// // //           target,
// // //           label: o.label || o.value,
// // //           animated: false,
// // //           style: { strokeWidth: 2 },
// // //           labelStyle: { fontSize: 12, fill: "#111827", fontWeight: 600 },
// // //         });
// // //       }
// // //     }

// // //     // Layout as tree
// // //     return buildTreeLayout(rfNodes, rfEdges);
// // //   }, [flow]);

// // //   const nodeTypes = useMemo(() => ({ custom: CustomGraphNode }), []);

// // //   // ------------------ render guards ------------------
// // //   const visibleNodesCat1 = getVisibleNodesByCategory(1);
// // //   const visibleNodesCat2 = getVisibleNodesByCategory(2);

// // //   if (loading && !flow) {
// // //     return (
// // //       <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
// // //         <div className="text-gray-600">Loading questions...</div>
// // //       </div>
// // //     );
// // //   }

// // //   const currentPreviewNode = previewCurrentNode();
// // //   const results = computePreviewResults();

// // //   return (
// // //     <div className="min-h-screen bg-[#f4f5fa] flex">
// // //       {/* Sidebar */}
// // //       <aside
// // //         className={`${
// // //           sidebarOpen ? "w-64" : "w-20"
// // //         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
// // //       >
// // //         <div className="p-6 border-b border-gray-200 flex items-center gap-3">
// // //           <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
// // //             <span className="text-white font-bold">VW</span>
// // //           </div>
// // //           {sidebarOpen && (
// // //             <span className="text-xl font-bold text-teal-600">
// // //               VIRTUAL WARD
// // //             </span>
// // //           )}
// // //         </div>

// // //         <nav className="flex-1 p-4 space-y-1">
// // //           <button
// // //             onClick={() => router.push("/admin/questionnaires")}
// // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-colors"
// // //           >
// // //             {sidebarOpen && <span>Questionnaires</span>}
// // //             {!sidebarOpen && <span>Q</span>}
// // //           </button>

// // //           <button
// // //             onClick={logout}
// // //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
// // //           >
// // //             {sidebarOpen && <span>Logout</span>}
// // //             {!sidebarOpen && <span>⎋</span>}
// // //           </button>
// // //         </nav>
// // //       </aside>

// // //       {/* Main */}
// // //       <div className="flex-1 flex flex-col">
// // //         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
// // //           <div className="flex items-center gap-4">
// // //             <button
// // //               onClick={() => setSidebarOpen(!sidebarOpen)}
// // //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// // //               aria-label="Toggle sidebar"
// // //             >
// // //               ☰
// // //             </button>

// // //             <button
// // //               onClick={() => router.push("/admin/questionnaires")}
// // //               className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
// // //             >
// // //               ← Back
// // //             </button>
// // //           </div>

// // //           <div className="flex items-center gap-2">
// // //             <button
// // //               onClick={() =>
// // //                 setViewMode((v) => (v === "TABLE" ? "GRAPH" : "TABLE"))
// // //               }
// // //               className={BTN_OUTLINE}
// // //               title="Toggle Table / Graph"
// // //             >
// // //               {viewMode === "TABLE" ? "🧠 Graph View" : "📋 Table View"}
// // //             </button>

// // //             <button onClick={openPreview} className={BTN_PRIMARY}>
// // //               👁 Preview
// // //             </button>

// // //             <button onClick={onValidateClick} className={BTN_PRIMARY}>
// // //               ✅ Validate
// // //             </button>

// // //             <button
// // //               onClick={saveFlow}
// // //               disabled={
// // //                 saving ||
// // //                 !hasUnsavedChanges ||
// // //                 !validation.ran ||
// // //                 !validation.valid
// // //               }
// // //               className={BTN_PRIMARY}
// // //               title={
// // //                 !validation.ran
// // //                   ? "Validate before saving"
// // //                   : !validation.valid
// // //                     ? "Fix validation errors before saving"
// // //                     : !hasUnsavedChanges
// // //                       ? "No changes to save"
// // //                       : ""
// // //               }
// // //             >
// // //               💾 {saving ? "Saving..." : "Save"}
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {error && (
// // //           <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
// // //             <div className="text-red-700">
// // //               <strong>Error:</strong> {error}
// // //             </div>
// // //             <button
// // //               onClick={() => setError(null)}
// // //               className="text-red-700 hover:text-red-900 font-bold"
// // //             >
// // //               ✕
// // //             </button>
// // //           </div>
// // //         )}

// // //         <main className="flex-1 p-6 overflow-auto">
// // //           {/* Page header */}
// // //           {flow && (
// // //             <div className="mb-4">
// // //               <h1 className="text-2xl font-semibold text-gray-900">
// // //                 Question Management
// // //               </h1>
// // //               <p className="text-sm text-gray-500 mt-1">
// // //                 {flow.name} (Version {flow.version}){" "}
// // //                 {validation.ran ? (
// // //                   validation.valid ? (
// // //                     <span className="ml-2 text-green-700 font-semibold">
// // //                       ● Valid
// // //                     </span>
// // //                   ) : (
// // //                     <span className="ml-2 text-red-700 font-semibold">
// // //                       ● Not valid
// // //                     </span>
// // //                   )
// // //                 ) : (
// // //                   <span className="ml-2 text-gray-500 font-semibold">
// // //                     ● Not validated
// // //                   </span>
// // //                 )}
// // //                 {hasUnsavedChanges && (
// // //                   <span className="ml-2 text-amber-700 font-semibold">
// // //                     ● Unsaved changes
// // //                   </span>
// // //                 )}
// // //               </p>
// // //             </div>
// // //           )}

// // //           {/* Validation results */}
// // //           {validation.ran && (
// // //             <div
// // //               className={`mb-6 rounded-lg border px-6 py-4 ${
// // //                 validation.valid
// // //                   ? "bg-green-50 border-green-200"
// // //                   : "bg-red-50 border-red-200"
// // //               }`}
// // //             >
// // //               <div
// // //                 className={`font-semibold ${validation.valid ? "text-green-900" : "text-red-900"}`}
// // //               >
// // //                 {validation.valid
// // //                   ? `Validation successful (0 errors, 0 warnings)`
// // //                   : `Validation failed (${validation.items.filter((x) => x.level === "ERROR").length} errors, ${
// // //                       validation.items.filter((x) => x.level === "WARNING")
// // //                         .length
// // //                     } warnings)`}
// // //               </div>

// // //               {!validation.valid && (
// // //                 <div className="mt-3 space-y-3">
// // //                   {validation.items.map((it, idx) => (
// // //                     <div
// // //                       key={idx}
// // //                       className="bg-white/60 border border-red-200 rounded-lg p-4"
// // //                     >
// // //                       <div className="font-semibold text-red-900">
// // //                         {it.title}
// // //                       </div>
// // //                       <div className="text-sm text-red-900 mt-1">
// // //                         <strong>Where:</strong> {it.where}
// // //                       </div>
// // //                       <div className="text-sm text-red-900 mt-1">
// // //                         <strong>How to fix:</strong> {it.howToFix}
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* GRAPH VIEW */}
// // //           {flow && viewMode === "GRAPH" && (
// // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// // //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// // //                 <h2 className="text-lg font-semibold text-teal-900">
// // //                   Graph View (read-only)
// // //                 </h2>
// // //                 <div className="text-xs text-gray-600">
// // //                   Changes in table update graph automatically.
// // //                 </div>
// // //               </div>

// // //               <div className="h-[720px]">
// // //                 <ReactFlow
// // //                   nodes={graph.nodes}
// // //                   edges={graph.edges}
// // //                   nodeTypes={nodeTypes}
// // //                   fitView
// // //                   fitViewOptions={{ padding: 0.2 }}
// // //                   nodesDraggable={false}
// // //                   nodesConnectable={false}
// // //                   elementsSelectable={true}
// // //                   panOnDrag={true}
// // //                   zoomOnScroll={true}
// // //                   className="bg-teal-50"
// // //                 >
// // //                   <MiniMap />
// // //                   <Controls />
// // //                   <Background />
// // //                 </ReactFlow>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* TABLE VIEW (your original UI, unchanged except bidirectional scoring) */}
// // //           {flow && viewMode === "TABLE" && (
// // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// // //                 <h2 className="text-lg font-semibold text-teal-900">
// // //                   Question Flow Builder
// // //                 </h2>
// // //                 <div className="flex items-center gap-2">
// // //                   <button
// // //                     onClick={() =>
// // //                       setCollapsedCategories({ 1: false, 2: false })
// // //                     }
// // //                     className={BTN_OUTLINE}
// // //                   >
// // //                     Expand Categories
// // //                   </button>
// // //                   <button
// // //                     onClick={() => setCollapsedCategories({ 1: true, 2: true })}
// // //                     className={BTN_OUTLINE}
// // //                   >
// // //                     Collapse Categories
// // //                   </button>
// // //                   <button onClick={expandAllNodes} className={BTN_OUTLINE}>
// // //                     Expand All
// // //                   </button>
// // //                   <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
// // //                     Collapse All
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               <div className="overflow-auto">
// // //                 <table className="w-full text-sm">
// // //                   <thead className="bg-gray-50">
// // //                     <tr className="border-b border-gray-200">
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-10"></th>
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-24">
// // //                         Node
// // //                       </th>
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">
// // //                         Type
// // //                       </th>
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[300px]">
// // //                         Body Text
// // //                       </th>
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[520px]">
// // //                         Options / Settings
// // //                       </th>
// // //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">
// // //                         Actions
// // //                       </th>
// // //                     </tr>
// // //                   </thead>

// // //                   <tbody>
// // //                     {([1, 2] as Category[]).map((cat) => {
// // //                       const collapsed = collapsedCategories[cat];
// // //                       const visibleNodes =
// // //                         cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

// // //                       return (
// // //                         <Fragment key={`cat-${cat}`}>
// // //                           <tr className="bg-gray-100 border-b border-gray-200">
// // //                             <td className="px-3 py-3" colSpan={6}>
// // //                               <div className="flex items-center justify-between">
// // //                                 <button
// // //                                   onClick={() =>
// // //                                     setCollapsedCategories((p) => ({
// // //                                       ...p,
// // //                                       [cat]: !p[cat],
// // //                                     }))
// // //                                   }
// // //                                   className="flex items-center gap-2 text-sm font-semibold text-gray-800"
// // //                                 >
// // //                                   <span className="inline-block w-5 text-center">
// // //                                     {collapsed ? "▶" : "▼"}
// // //                                   </span>
// // //                                   <span>{CATEGORY_LABEL[cat]}</span>
// // //                                   <span className="text-xs font-normal text-gray-500">
// // //                                     (
// // //                                     {
// // //                                       flow.nodes.filter(
// // //                                         (n) => n.category === cat,
// // //                                       ).length
// // //                                     }{" "}
// // //                                     nodes)
// // //                                   </span>
// // //                                 </button>

// // //                                 <button
// // //                                   onClick={() => addNode(cat, null)}
// // //                                   className={BTN_OUTLINE}
// // //                                 >
// // //                                   + Add Root Node
// // //                                 </button>
// // //                               </div>
// // //                             </td>
// // //                           </tr>

// // //                           {!collapsed &&
// // //                             visibleNodes.map((node) => {
// // //                               const hasChild = hasChildren(node.node_key);
// // //                               const isExpanded = expandedNodes.has(
// // //                                 node.node_key,
// // //                               );
// // //                               const indent = node.depth_level * 24;
// // //                               const isEditing =
// // //                                 editingNodeKey === node.node_key;

// // //                               return (
// // //                                 <Fragment key={node.node_key}>
// // //                                   <tr className="border-b border-gray-100 hover:bg-gray-50">
// // //                                     <td className="px-3 py-2">
// // //                                       {hasChild && (
// // //                                         <button
// // //                                           onClick={() =>
// // //                                             toggleNode(node.node_key)
// // //                                           }
// // //                                           className="text-gray-600 hover:text-gray-900"
// // //                                         >
// // //                                           {isExpanded ? "▼" : "▶"}
// // //                                         </button>
// // //                                       )}
// // //                                     </td>

// // //                                     <td
// // //                                       className="px-3 py-2"
// // //                                       style={{
// // //                                         paddingLeft: `${indent + 12}px`,
// // //                                       }}
// // //                                     >
// // //                                       <span
// // //                                         className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
// // //                                       >
// // //                                         {getCategorySequenceNumber(
// // //                                           node.node_key,
// // //                                         )}
// // //                                       </span>
// // //                                     </td>

// // //                                     <td className="px-3 py-2">
// // //                                       <select
// // //                                         className={`${SELECT_SM} w-full`}
// // //                                         value={node.node_type}
// // //                                         onChange={(e) =>
// // //                                           updateNode(node.node_key, {
// // //                                             node_type: e.target
// // //                                               .value as FlowNodeType,
// // //                                           })
// // //                                         }
// // //                                       >
// // //                                         <option value="QUESTION">
// // //                                           Question
// // //                                         </option>
// // //                                         <option value="MESSAGE">Message</option>
// // //                                         <option value="ALERT">Alert</option>
// // //                                       </select>
// // //                                     </td>

// // //                                     <td className="px-3 py-2">
// // //                                       <input
// // //                                         className={`${INPUT_SM} w-full`}
// // //                                         value={node.body_text}
// // //                                         onChange={(e) =>
// // //                                           updateNode(node.node_key, {
// // //                                             body_text: e.target.value,
// // //                                           })
// // //                                         }
// // //                                         placeholder="Question or message..."
// // //                                       />
// // //                                     </td>

// // //                                     <td className="px-3 py-2">
// // //                                       {node.node_type === "QUESTION" ? (
// // //                                         <div className="text-xs text-gray-600 flex items-center gap-2">
// // //                                           <span>
// // //                                             {node.options?.length || 0} options
// // //                                           </span>
// // //                                           <button
// // //                                             onClick={() =>
// // //                                               setEditingNodeKey(
// // //                                                 isEditing
// // //                                                   ? null
// // //                                                   : node.node_key,
// // //                                               )
// // //                                             }
// // //                                             className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
// // //                                           >
// // //                                             {isEditing ? "Hide" : "Edit"}
// // //                                           </button>
// // //                                         </div>
// // //                                       ) : node.node_type === "ALERT" ? (
// // //                                         <div className="flex items-center gap-2">
// // //                                           <span className="text-xs text-gray-600">
// // //                                             Severity
// // //                                           </span>
// // //                                           <select
// // //                                             className={SELECT_SM}
// // //                                             value={node.alert_severity || "RED"}
// // //                                             onChange={(e) =>
// // //                                               updateNode(node.node_key, {
// // //                                                 alert_severity: e.target
// // //                                                   .value as SeverityLevel,
// // //                                               })
// // //                                             }
// // //                                           >
// // //                                             <option value="GREEN">Green</option>
// // //                                             <option value="AMBER">Amber</option>
// // //                                             <option value="RED">Red</option>
// // //                                           </select>
// // //                                           <span className="text-xs text-gray-500 italic">
// // //                                             (end node)
// // //                                           </span>
// // //                                         </div>
// // //                                       ) : (
// // //                                         <span className="text-xs text-gray-500 italic">
// // //                                           Message (end node)
// // //                                         </span>
// // //                                       )}
// // //                                     </td>

// // //                                     <td className="px-3 py-2">
// // //                                       <div className="flex items-center gap-2 justify-end">
// // //                                         <button
// // //                                           onClick={() =>
// // //                                             addNode(
// // //                                               node.category,
// // //                                               node.node_key,
// // //                                             )
// // //                                           }
// // //                                           className={BTN_OUTLINE}
// // //                                         >
// // //                                           + Child
// // //                                         </button>
// // //                                         <button
// // //                                           onClick={() =>
// // //                                             deleteNodeCascade(node.node_key)
// // //                                           }
// // //                                           className={BTN_DANGER}
// // //                                           title="Cascade delete this node and all descendants"
// // //                                         >
// // //                                           Delete
// // //                                         </button>
// // //                                       </div>
// // //                                     </td>
// // //                                   </tr>

// // //                                   {/* OPTIONS (EDIT MODE) */}
// // //                                   {isEditing &&
// // //                                     node.node_type === "QUESTION" &&
// // //                                     (node.options || []).map((opt, idx) => {
// // //                                       return (
// // //                                         <tr
// // //                                           key={`${node.node_key}-opt-${idx}`}
// // //                                           className="bg-gray-50 border-b border-gray-100"
// // //                                         >
// // //                                           <td
// // //                                             colSpan={2}
// // //                                             className="px-3 py-2"
// // //                                           ></td>

// // //                                           <td className="px-3 py-2">
// // //                                             <span className="text-xs text-gray-600">
// // //                                               Option {idx + 1}
// // //                                             </span>
// // //                                           </td>

// // //                                           <td className="px-3 py-2">
// // //                                             <input
// // //                                               className={`${INPUT_SM} w-full`}
// // //                                               value={opt.label}
// // //                                               onChange={(e) =>
// // //                                                 updateOption(
// // //                                                   node.node_key,
// // //                                                   idx,
// // //                                                   { label: e.target.value },
// // //                                                 )
// // //                                               }
// // //                                               placeholder="Option label"
// // //                                             />
// // //                                           </td>

// // //                                           {/* ✅ Clean single-row controls (no overlap) */}
// // //                                           <td className="px-3 py-2">
// // //                                             <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
// // //                                               <span className="text-xs text-gray-600 whitespace-nowrap">
// // //                                                 Next
// // //                                               </span>

// // //                                               <select
// // //                                                 className={`${SELECT_SM} min-w-[260px]`}
// // //                                                 value={opt.next_node_key || ""}
// // //                                                 onChange={(e) =>
// // //                                                   updateOption(
// // //                                                     node.node_key,
// // //                                                     idx,
// // //                                                     {
// // //                                                       next_node_key:
// // //                                                         e.target.value || null,
// // //                                                     },
// // //                                                   )
// // //                                                 }
// // //                                               >
// // //                                                 {getAvailableNextNodes(
// // //                                                   node.category,
// // //                                                 ).map((nextOpt) => (
// // //                                                   <option
// // //                                                     key={nextOpt.key}
// // //                                                     value={nextOpt.key}
// // //                                                   >
// // //                                                     {nextOpt.label}
// // //                                                   </option>
// // //                                                 ))}
// // //                                               </select>

// // //                                               {/* ✅ Bidirectional: Severity -> Scores */}
// // //                                               <select
// // //                                                 className={`${SELECT_SM} w-28`}
// // //                                                 value={opt.severity}
// // //                                                 onChange={(e) => {
// // //                                                   const newSeverity = e.target
// // //                                                     .value as SeverityLevel;
// // //                                                   const prefill =
// // //                                                     PREFILL_BY_SEVERITY[
// // //                                                       newSeverity
// // //                                                     ];

// // //                                                   updateOption(
// // //                                                     node.node_key,
// // //                                                     idx,
// // //                                                     {
// // //                                                       severity: newSeverity,
// // //                                                       news2_score:
// // //                                                         prefill.news2,
// // //                                                       seriousness_points:
// // //                                                         prefill.points,
// // //                                                     },
// // //                                                   );
// // //                                                 }}
// // //                                               >
// // //                                                 <option value="GREEN">
// // //                                                   Green
// // //                                                 </option>
// // //                                                 <option value="AMBER">
// // //                                                   Amber
// // //                                                 </option>
// // //                                                 <option value="RED">Red</option>
// // //                                               </select>

// // //                                               {/* ✅ Bidirectional: Scores -> Severity */}
// // //                                               <input
// // //                                                 className={`${INPUT_SM} w-24`}
// // //                                                 type="number"
// // //                                                 value={opt.news2_score}
// // //                                                 onChange={(e) => {
// // //                                                   const news2 = Number(
// // //                                                     e.target.value,
// // //                                                   );
// // //                                                   const nextSeverity =
// // //                                                     severityFromScores(
// // //                                                       opt.seriousness_points ||
// // //                                                         0,
// // //                                                       news2,
// // //                                                     );
// // //                                                   updateOption(
// // //                                                     node.node_key,
// // //                                                     idx,
// // //                                                     {
// // //                                                       news2_score: news2,
// // //                                                       severity: nextSeverity,
// // //                                                     },
// // //                                                   );
// // //                                                 }}
// // //                                                 placeholder="NEWS2"
// // //                                                 title="NEWS2 Score"
// // //                                               />

// // //                                               <input
// // //                                                 className={`${INPUT_SM} w-24`}
// // //                                                 type="number"
// // //                                                 value={opt.seriousness_points}
// // //                                                 onChange={(e) => {
// // //                                                   const points = Number(
// // //                                                     e.target.value,
// // //                                                   );
// // //                                                   const nextSeverity =
// // //                                                     severityFromScores(
// // //                                                       points,
// // //                                                       opt.news2_score || 0,
// // //                                                     );
// // //                                                   updateOption(
// // //                                                     node.node_key,
// // //                                                     idx,
// // //                                                     {
// // //                                                       seriousness_points:
// // //                                                         points,
// // //                                                       severity: nextSeverity,
// // //                                                     },
// // //                                                   );
// // //                                                 }}
// // //                                                 placeholder="Points"
// // //                                                 title="Seriousness Points"
// // //                                               />

// // //                                               <button
// // //                                                 onClick={() =>
// // //                                                   removeOption(
// // //                                                     node.node_key,
// // //                                                     idx,
// // //                                                   )
// // //                                                 }
// // //                                                 disabled={
// // //                                                   (node.options?.length || 0) <=
// // //                                                   2
// // //                                                 }
// // //                                                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                                                 title={
// // //                                                   (node.options?.length || 0) <=
// // //                                                   2
// // //                                                     ? "Minimum 2 options required"
// // //                                                     : "Delete option"
// // //                                                 }
// // //                                               >
// // //                                                 ✕
// // //                                               </button>
// // //                                             </div>
// // //                                           </td>

// // //                                           <td className="px-3 py-2"></td>
// // //                                         </tr>
// // //                                       );
// // //                                     })}

// // //                                   {isEditing &&
// // //                                     node.node_type === "QUESTION" && (
// // //                                       <tr className="bg-gray-50 border-b border-gray-100">
// // //                                         <td colSpan={5} className="px-3 py-2">
// // //                                           <button
// // //                                             onClick={() =>
// // //                                               addOption(node.node_key)
// // //                                             }
// // //                                             className={BTN_OUTLINE}
// // //                                           >
// // //                                             + Add Option
// // //                                           </button>
// // //                                         </td>
// // //                                         <td className="px-3 py-2"></td>
// // //                                       </tr>
// // //                                     )}
// // //                                 </Fragment>
// // //                               );
// // //                             })}
// // //                         </Fragment>
// // //                       );
// // //                     })}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* PREVIEW MODAL (unchanged) */}
// // //           {preview.open && flow && (
// // //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// // //               <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
// // //                 <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
// // //                   <div className="text-lg font-bold text-white">
// // //                     Patient Preview
// // //                   </div>
// // //                   <button
// // //                     onClick={closePreview}
// // //                     className="p-2 hover:bg-teal-700 rounded-lg text-white"
// // //                   >
// // //                     ✕
// // //                   </button>
// // //                 </div>

// // //                 <div className="p-6 space-y-4">
// // //                   {currentPreviewNode ? (
// // //                     <>
// // //                       <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
// // //                         {CATEGORY_LABEL[currentPreviewNode.category]}
// // //                       </div>

// // //                       <div className="flex items-start justify-between text-xs text-gray-500 gap-4">
// // //                         <div>
// // //                           Node{" "}
// // //                           {getCategorySequenceNumber(
// // //                             currentPreviewNode.node_key,
// // //                           )}{" "}
// // //                           • {currentPreviewNode.node_type}
// // //                         </div>

// // //                         <div className="text-right">
// // //                           <div>
// // //                             Cat1 Alert:{" "}
// // //                             <span className="font-semibold">
// // //                               {results.cat1.alert}
// // //                             </span>{" "}
// // //                             • Points:{" "}
// // //                             <span className="font-semibold">
// // //                               {results.cat1.totalPoints}
// // //                             </span>{" "}
// // //                             • NEWS2:{" "}
// // //                             <span className="font-semibold">
// // //                               {results.cat1.totalNews2}
// // //                             </span>
// // //                           </div>
// // //                           <div className="mt-1">
// // //                             Cat2 Alert:{" "}
// // //                             <span className="font-semibold">
// // //                               {results.cat2.alert}
// // //                             </span>{" "}
// // //                             • Final:{" "}
// // //                             <span className="font-semibold">
// // //                               {results.finalAlert}
// // //                             </span>
// // //                           </div>
// // //                         </div>
// // //                       </div>

// // //                       <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
// // //                         {currentPreviewNode.title && (
// // //                           <div className="text-lg font-semibold text-gray-900 mb-2">
// // //                             {currentPreviewNode.title}
// // //                           </div>
// // //                         )}
// // //                         <div className="text-base text-gray-900">
// // //                           {currentPreviewNode.body_text}
// // //                         </div>
// // //                         {currentPreviewNode.help_text && (
// // //                           <div className="text-sm text-gray-600 italic mt-2">
// // //                             {currentPreviewNode.help_text}
// // //                           </div>
// // //                         )}

// // //                         {currentPreviewNode.node_type === "QUESTION" && (
// // //                           <div className="space-y-3 mt-6">
// // //                             {(currentPreviewNode.options || []).map(
// // //                               (opt, idx) => {
// // //                                 const selectedValue =
// // //                                   preview.selectedOptionValueByNode[
// // //                                     currentPreviewNode.node_key
// // //                                   ];
// // //                                 const checked = selectedValue === opt.value;

// // //                                 return (
// // //                                   <button
// // //                                     key={`${currentPreviewNode.node_key}-ans-${idx}`}
// // //                                     onClick={() =>
// // //                                       previewSelectOption(
// // //                                         currentPreviewNode.node_key,
// // //                                         opt,
// // //                                       )
// // //                                     }
// // //                                     className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
// // //                                       checked
// // //                                         ? "border-teal-600 bg-teal-50"
// // //                                         : "border-gray-200 hover:border-gray-300 bg-white"
// // //                                     }`}
// // //                                   >
// // //                                     <div className="flex items-center gap-3">
// // //                                       <div
// // //                                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
// // //                                           checked
// // //                                             ? "border-teal-600 bg-teal-600"
// // //                                             : "border-gray-300"
// // //                                         }`}
// // //                                       >
// // //                                         {checked && (
// // //                                           <div className="w-2 h-2 bg-white rounded-full"></div>
// // //                                         )}
// // //                                       </div>
// // //                                       <div className="text-base font-medium text-gray-900">
// // //                                         {opt.label}
// // //                                       </div>
// // //                                     </div>
// // //                                   </button>
// // //                                 );
// // //                               },
// // //                             )}
// // //                           </div>
// // //                         )}

// // //                         {currentPreviewNode.node_type === "MESSAGE" && (
// // //                           <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
// // //                             This is a message. Click <strong>Next</strong> to
// // //                             finish.
// // //                           </div>
// // //                         )}

// // //                         {currentPreviewNode.node_type === "ALERT" && (
// // //                           <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
// // //                             <div className="font-semibold">
// // //                               Alert Severity:{" "}
// // //                               {currentPreviewNode.alert_severity || "RED"}
// // //                             </div>
// // //                             <div className="mt-1">
// // //                               This is an end node. Click <strong>Next</strong>{" "}
// // //                               to finish.
// // //                             </div>
// // //                           </div>
// // //                         )}

// // //                         <div className="flex items-center justify-between pt-6">
// // //                           <button
// // //                             onClick={previewBack}
// // //                             disabled={preview.history.length === 0}
// // //                             className={BTN_OUTLINE}
// // //                           >
// // //                             Back
// // //                           </button>
// // //                           <button
// // //                             onClick={previewNext}
// // //                             className={BTN_PRIMARY}
// // //                             disabled={
// // //                               currentPreviewNode.node_type === "QUESTION" &&
// // //                               !preview.selectedOptionValueByNode[
// // //                                 currentPreviewNode.node_key
// // //                               ]
// // //                             }
// // //                           >
// // //                             Next
// // //                           </button>
// // //                         </div>
// // //                       </div>
// // //                     </>
// // //                   ) : (
// // //                     <div className="text-center py-10">
// // //                       <div className="text-xl font-bold text-gray-900">
// // //                         Questionnaire Complete
// // //                       </div>
// // //                       <div className="text-sm text-gray-600 mt-2">
// // //                         Final Alert:{" "}
// // //                         <span className="font-semibold">
// // //                           {results.finalAlert}
// // //                         </span>{" "}
// // //                         • Cat1:{" "}
// // //                         <span className="font-semibold">
// // //                           {results.cat1.alert}
// // //                         </span>{" "}
// // //                         • Cat2:{" "}
// // //                         <span className="font-semibold">
// // //                           {results.cat2.alert}
// // //                         </span>{" "}
// // //                         • Points:{" "}
// // //                         <span className="font-semibold">
// // //                           {results.cat1.totalPoints}
// // //                         </span>
// // //                       </div>
// // //                       <div className="mt-6 flex items-center justify-center gap-2">
// // //                         <button
// // //                           onClick={previewRestart}
// // //                           className={BTN_OUTLINE}
// // //                         >
// // //                           ↻ Restart
// // //                         </button>
// // //                         <button onClick={closePreview} className={BTN_PRIMARY}>
// // //                           Close
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// // //                   <button
// // //                     onClick={previewRestart}
// // //                     className="text-sm text-gray-600 hover:text-gray-900 font-medium"
// // //                   >
// // //                     ↻ Restart Preview
// // //                   </button>
// // //                   <div className="text-xs text-gray-500">
// // //                     This is how patients will see the questionnaire
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </main>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { Fragment, memo, useEffect, useMemo, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";

// // const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // // ✅ Graph deps
// // // ✅ Graph deps (XYFlow v12+ has NO default export)
// // import {
// //   ReactFlow,
// //   Background,
// //   Controls,
// //   MiniMap,
// //   Handle,
// //   Position,
// //   MarkerType,
// //   type Node,
// //   type Edge,
// // } from "@xyflow/react";
// // import "@xyflow/react/dist/style.css";

// // import dagre from "dagre";

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

// // type Category = 1 | 2;

// // const CATEGORY_LABEL: Record<Category, string> = {
// //   1: "Clinical Obs – Colorectal",
// //   2: "Symptoms and signs",
// // };

// // type FlowNodeT = {
// //   node_key: string;
// //   node_type: FlowNodeType;
// //   category: Category;

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
// //   nodes: FlowNodeT[];
// // };

// // // ================== CONFIG (easy to change) ==================
// // const SCORE_CATEGORY_1 = {
// //   RED_POINTS_MIN: 100,
// //   AMBER_POINTS_MIN: 30,
// // };

// // const RULES = {
// //   CATEGORY_2_SCORING_DISABLED: false,
// //   AUTO_FIX_START_NODE: true,
// //   START_NODE_CATEGORY_PRIORITY: [1, 2] as Category[],
// // };

// // // Prefill defaults for Category 1 when admin chooses severity
// // const CAT1_PREFILL_BY_SEVERITY: Record<
// //   SeverityLevel,
// //   { news2: number; points: number }
// // > = {
// //   GREEN: { news2: 0, points: 0 },
// //   AMBER: { news2: 0, points: 30 },
// //   RED: { news2: 0, points: 100 },
// // };

// // // ------------------ API helpers ------------------
// // async function apiGet<T>(url: string, accessToken: string): Promise<T> {
// //   const res = await fetch(url, {
// //     headers: { Authorization: `Bearer ${accessToken}` },
// //     cache: "no-store",
// //   });
// //   const body = await res.json().catch(() => null);
// //   if (!res.ok)
// //     throw new Error(body?.detail || body?.message || "Request failed");
// //   return body as T;
// // }

// // async function apiPut<T>(
// //   url: string,
// //   accessToken: string,
// //   body: any,
// // ): Promise<T> {
// //   const res = await fetch(url, {
// //     method: "PUT",
// //     headers: {
// //       Authorization: `Bearer ${accessToken}`,
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(body),
// //   });
// //   const data = await res.json().catch(() => ({}));
// //   if (!res.ok)
// //     throw new Error(data?.detail || data?.message || "Request failed");
// //   return data as T;
// // }

// // // ------------------ UI helpers ------------------
// // const SEVERITY_ORDER: Record<SeverityLevel, number> = {
// //   GREEN: 1,
// //   AMBER: 2,
// //   RED: 3,
// // };
// // function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
// //   return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
// // }

// // function clinicalAlertFromScore(totalPoints: number): SeverityLevel {
// //   if (totalPoints >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
// //   if (totalPoints >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";
// //   return "GREEN";
// // }

// // function badgeColorClass() {
// //   return "bg-teal-600 text-white";
// // }

// // const BTN_PRIMARY =
// //   "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // const BTN_OUTLINE =
// //   "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// // const BTN_DANGER =
// //   "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// // // Clean input/select styling
// // const INPUT_SM =
// //   "px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
// // const SELECT_SM = INPUT_SM;

// // type ValidationItem = {
// //   level: "ERROR" | "WARNING";
// //   title: string;
// //   where: string;
// //   howToFix: string;
// // };

// // type ValidationState = {
// //   ran: boolean;
// //   valid: boolean;
// //   items: ValidationItem[];
// // };

// // type PreviewState = {
// //   open: boolean;
// //   currentKey: string | "END";
// //   history: string[];
// //   answers: Record<string, string>;
// //   selectedOptionValueByNode: Record<string, string>;

// //   // ✅ NEW: let preview run Cat1 then Cat2
// //   categoryIndex: number;
// // };

// // // =========================
// // // ✅ GRAPH: Custom Node
// // // =========================
// // type GraphNodeData = {
// //   title: string;
// //   subtitle: string;
// //   kind: FlowNodeType | "END" | "CAT_HEADER";
// //   severity: SeverityLevel;
// //   category: Category;
// //   optionPorts?: { id: string; label: string; severity: SeverityLevel }[];
// // };

// // function severityBadgeClasses(sev: SeverityLevel) {
// //   if (sev === "RED") return "bg-red-50 text-red-700 border-red-200";
// //   if (sev === "AMBER") return "bg-amber-50 text-amber-800 border-amber-200";
// //   return "bg-emerald-50 text-emerald-700 border-emerald-200";
// // }

// // function edgeStrokeBySeverity(sev: SeverityLevel) {
// //   if (sev === "RED") return "#ef4444"; // red-500
// //   if (sev === "AMBER") return "#f59e0b"; // amber-500
// //   return "#10b981"; // emerald-500
// // }

// // const FlowGraphNode = memo(function FlowGraphNode({
// //   data,
// // }: {
// //   data: GraphNodeData;
// // }) {
// //   const isEnd = data.kind === "END";
// //   const isHeader = data.kind === "CAT_HEADER";

// //   if (isHeader) {
// //     return (
// //       <div className="px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 shadow-sm min-w-[340px]">
// //         <div className="text-sm font-semibold text-teal-900">
// //           {CATEGORY_LABEL[data.category]}
// //         </div>
// //         <div className="text-xs text-teal-700 mt-1">
// //           Category lane (read-only graph)
// //         </div>
// //         <Handle
// //           type="target"
// //           position={Position.Top}
// //           className="!bg-teal-500 !w-3 !h-3"
// //         />
// //         <Handle
// //           type="source"
// //           position={Position.Bottom}
// //           className="!bg-teal-500 !w-3 !h-3"
// //         />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className={`bg-white rounded-2xl shadow-sm border min-w-[360px] ${
// //         isEnd ? "border-emerald-200" : "border-gray-200"
// //       }`}
// //     >
// //       {/* Top bar */}
// //       <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //           <span className="text-xs font-semibold px-2 py-1 rounded-full border border-teal-200 text-teal-700 bg-teal-50">
// //             {isEnd ? "END" : data.kind}
// //           </span>
// //           <span
// //             className={`text-xs font-semibold px-2 py-1 rounded-full border ${severityBadgeClasses(
// //               data.severity,
// //             )}`}
// //           >
// //             {data.severity}
// //           </span>
// //         </div>
// //         <span className="text-[11px] text-gray-500">
// //           {CATEGORY_LABEL[data.category]}
// //         </span>
// //       </div>

// //       {/* Body */}
// //       <div className="px-4 py-3">
// //         <div className="text-base font-semibold text-gray-900">
// //           {data.title}
// //         </div>
// //         <div className="text-xs text-gray-500 mt-1">{data.subtitle}</div>
// //       </div>

// //       {/* Handles */}
// //       <Handle
// //         type="target"
// //         position={Position.Top}
// //         className="!bg-teal-500 !w-3 !h-3"
// //       />

// //       {/* Multi-source handles (one per option) */}
// //       {data.kind === "QUESTION" && (data.optionPorts?.length || 0) > 0 ? (
// //         <div className="relative h-8">
// //           {data.optionPorts!.map((p, idx) => {
// //             const count = data.optionPorts!.length;
// //             // spread across 8%..92%
// //             const pct = count === 1 ? 50 : 8 + (idx / (count - 1)) * 84;
// //             return (
// //               <Handle
// //                 key={p.id}
// //                 id={p.id}
// //                 type="source"
// //                 position={Position.Bottom}
// //                 style={{ left: `${pct}%` }}
// //                 className="!bg-teal-500 !w-3 !h-3"
// //               />
// //             );
// //           })}
// //         </div>
// //       ) : isEnd ? null : (
// //         <Handle
// //           type="source"
// //           position={Position.Bottom}
// //           className="!bg-teal-500 !w-3 !h-3"
// //         />
// //       )}
// //     </div>
// //   );
// // });

// // const nodeTypes = { flowNode: FlowGraphNode };

// // // =========================
// // // ✅ GRAPH: Layout helpers
// // // =========================
// // const GRAPH_NODE_W = 380;
// // const GRAPH_NODE_H = 130;

// // function layoutWithDagre(
// //   nodes: Node[],
// //   edges: Edge[],
// //   opts?: { ranksep?: number; nodesep?: number },
// // ) {
// //   const g = new dagre.graphlib.Graph();
// //   g.setDefaultEdgeLabel(() => ({}));

// //   // ✅ more tree-like spacing
// //   g.setGraph({
// //     rankdir: "TB",
// //     ranksep: opts?.ranksep ?? 140,
// //     nodesep: opts?.nodesep ?? 80,
// //     edgesep: 10,
// //     marginx: 40,
// //     marginy: 40,
// //   });

// //   nodes.forEach((n) =>
// //     g.setNode(n.id, { width: GRAPH_NODE_W, height: GRAPH_NODE_H }),
// //   );
// //   edges.forEach((e) => g.setEdge(e.source, e.target));

// //   dagre.layout(g);

// //   const laidOut = nodes.map((n) => {
// //     const pos = g.node(n.id);
// //     return {
// //       ...n,
// //       position: { x: pos.x - GRAPH_NODE_W / 2, y: pos.y - GRAPH_NODE_H / 2 },
// //     };
// //   });

// //   return { nodes: laidOut, edges };
// // }

// // // =========================
// // // Page
// // // =========================
// // export default function QuestionManagementPage() {
// //   const router = useRouter();
// //   const params = useParams<{ flowId: string }>();
// //   const flowId = Number(params.flowId);

// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   const [viewMode, setViewMode] = useState<"table" | "graph">("table");

// //   const token = useMemo(
// //     () =>
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("access_token")
// //         : null,
// //     [],
// //   );

// //   const [loading, setLoading] = useState(true);
// //   const [flow, setFlow] = useState<Flow | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   const [saving, setSaving] = useState(false);
// //   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// //   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
// //   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

// //   const [collapsedCategories, setCollapsedCategories] = useState<
// //     Record<Category, boolean>
// //   >({
// //     1: false,
// //     2: false,
// //   });

// //   const [validation, setValidation] = useState<ValidationState>({
// //     ran: false,
// //     valid: false,
// //     items: [],
// //   });

// //   const [preview, setPreview] = useState<PreviewState>({
// //     open: false,
// //     currentKey: "END",
// //     history: [],
// //     answers: {},
// //     selectedOptionValueByNode: {},
// //     categoryIndex: 0,
// //   });

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

// //   useEffect(() => {
// //     if (!token) {
// //       router.replace("/login");
// //       return;
// //     }
// //     if (!Number.isFinite(flowId) || flowId <= 0) {
// //       setError("Invalid flowId in route");
// //       setLoading(false);
// //       return;
// //     }
// //     loadFlow();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [token, flowId]);

// //   function pickFirstRootNodeKeyAnyCategory(nodes: FlowNodeT[]): string | null {
// //     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
// //       const root = nodes.find((n) => n.category === cat && !n.parent_node_key);
// //       if (root) return root.node_key;
// //     }
// //     return nodes[0]?.node_key ?? null;
// //   }

// //   async function loadFlow() {
// //     if (!token) return;
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

// //       const fixed: Flow = {
// //         ...data,
// //         nodes: (data.nodes || []).map((n) =>
// //           n.node_type === "ALERT" && !n.alert_severity
// //             ? { ...n, alert_severity: "RED" }
// //             : n,
// //         ),
// //       };

// //       if (RULES.AUTO_FIX_START_NODE) {
// //         const keys = new Set(fixed.nodes.map((n) => n.node_key));
// //         if (!fixed.start_node_key || !keys.has(fixed.start_node_key)) {
// //           fixed.start_node_key =
// //             pickFirstRootNodeKeyAnyCategory(fixed.nodes) ?? "END";
// //         }
// //       }

// //       setFlow(fixed);
// //       setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
// //       setHasUnsavedChanges(false);
// //       setValidation({ ran: false, valid: false, items: [] });
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to load flow");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function saveFlow() {
// //     if (!token || !flow) return;

// //     if (!validation.ran || !validation.valid) {
// //       alert("Please validate the questionnaire before saving.");
// //       return;
// //     }
// //     if (!hasUnsavedChanges) {
// //       alert("No changes to save.");
// //       return;
// //     }

// //     try {
// //       setSaving(true);
// //       setError(null);

// //       const payload = {
// //         name: flow.name,
// //         description: flow.description,
// //         flow_type: flow.flow_type,
// //         status: flow.status,
// //         start_node_key: flow.start_node_key,
// //         nodes: flow.nodes,
// //       };

// //       const data = await apiPut<any>(
// //         `${API_BASE}/flows/${flow.id}`,
// //         token,
// //         payload,
// //       );
// //       await loadFlow();
// //       setHasUnsavedChanges(false);
// //       alert(`Saved! Version: ${data.version ?? "?"}`);
// //     } catch (e: any) {
// //       setError(e?.message || "Failed to save flow");
// //       alert("Failed to save: " + (e?.message || "Unknown error"));
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   // ------------------ helpers: indexes/maps ------------------
// //   function nodeMap(): Map<string, FlowNodeT> {
// //     return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
// //   }

// //   function childrenMap(): Map<string, FlowNodeT[]> {
// //     const map = new Map<string, FlowNodeT[]>();
// //     for (const n of flow?.nodes || []) {
// //       if (!n.parent_node_key) continue;
// //       const arr = map.get(n.parent_node_key) || [];
// //       arr.push(n);
// //       map.set(n.parent_node_key, arr);
// //     }
// //     return map;
// //   }

// //   function hasChildren(nodeKey: string): boolean {
// //     if (!flow) return false;
// //     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
// //   }

// //   function toggleNode(nodeKey: string) {
// //     setExpandedNodes((prev) => {
// //       const next = new Set(prev);
// //       next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
// //       return next;
// //     });
// //   }

// //   function expandAllNodes() {
// //     if (!flow) return;
// //     setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
// //   }
// //   function collapseAllNodes() {
// //     setExpandedNodes(new Set());
// //   }

// //   function getVisibleNodesByCategory(category: Category): FlowNodeT[] {
// //     if (!flow) return [];
// //     const nm = nodeMap();
// //     function shouldShow(node: FlowNodeT): boolean {
// //       if (node.category !== category) return false;
// //       if (!node.parent_node_key) return true;
// //       const parent = nm.get(node.parent_node_key);
// //       if (!parent) return true;
// //       if (parent.category !== category) return false;
// //       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
// //     }
// //     return flow.nodes.filter(shouldShow);
// //   }

// //   function getCategorySequenceNumber(nodeKey: string): number {
// //     if (!flow) return 0;
// //     const n = flow.nodes.find((x) => x.node_key === nodeKey);
// //     if (!n) return 0;
// //     const sameCat = flow.nodes.filter((x) => x.category === n.category);
// //     const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
// //     return idx >= 0 ? idx + 1 : 0;
// //   }

// //   function getAvailableNextNodes(
// //     category: Category,
// //   ): Array<{ key: string; label: string }> {
// //     const base = [
// //       { key: "", label: "-- Select Next --" },
// //       { key: "END", label: "END - Complete Flow" },
// //     ];
// //     if (!flow) return base;

// //     const sameCategory = flow.nodes.filter((n) => n.category === category);
// //     return [
// //       ...base,
// //       ...sameCategory.map((node) => ({
// //         key: node.node_key,
// //         label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
// //       })),
// //     ];
// //   }

// //   // ------------------ state update utilities ------------------
// //   function markChanged() {
// //     setHasUnsavedChanges(true);
// //     setValidation({ ran: false, valid: false, items: [] });
// //   }

// //   function makeDefaultOptions(category: Category): FlowOption[] {
// //     const baseSeverity: SeverityLevel = "GREEN";
// //     const prefill =
// //       category === 1
// //         ? CAT1_PREFILL_BY_SEVERITY[baseSeverity]
// //         : { news2: 0, points: 0 };

// //     return [
// //       {
// //         display_order: 1,
// //         label: "Option 1",
// //         value: "opt1",
// //         severity: baseSeverity,
// //         news2_score: prefill.news2,
// //         seriousness_points: prefill.points,
// //         next_node_key: null,
// //       },
// //       {
// //         display_order: 2,
// //         label: "Option 2",
// //         value: "opt2",
// //         severity: baseSeverity,
// //         news2_score: prefill.news2,
// //         seriousness_points: prefill.points,
// //         next_node_key: null,
// //       },
// //     ];
// //   }

// //   function updateNode(nodeKey: string, updates: Partial<FlowNodeT>) {
// //     if (!flow) return;

// //     setFlow((prev) => {
// //       if (!prev) return prev;

// //       const updatedNodes = prev.nodes.map((n) => {
// //         if (n.node_key !== nodeKey) return n;

// //         if (updates.node_type === "ALERT") {
// //           return {
// //             ...n,
// //             ...updates,
// //             options: [],
// //             alert_severity: (updates.alert_severity ??
// //               n.alert_severity ??
// //               "RED") as SeverityLevel,
// //           };
// //         }

// //         if (updates.node_type === "MESSAGE") {
// //           return {
// //             ...n,
// //             ...updates,
// //             options: [],
// //             alert_severity: null,
// //           };
// //         }

// //         if (updates.node_type === "QUESTION") {
// //           const options =
// //             n.options?.length >= 2 ? n.options : makeDefaultOptions(n.category);
// //           return { ...n, ...updates, options };
// //         }

// //         return { ...n, ...updates };
// //       });

// //       return { ...prev, nodes: updatedNodes };
// //     });

// //     markChanged();
// //   }

// //   function updateOption(
// //     nodeKey: string,
// //     optionIdx: number,
// //     updates: Partial<FlowOption>,
// //   ) {
// //     if (!flow) return;

// //     setFlow((prev) => {
// //       if (!prev) return prev;
// //       return {
// //         ...prev,
// //         nodes: prev.nodes.map((n) => {
// //           if (n.node_key !== nodeKey) return n;
// //           const options = [...(n.options || [])];
// //           options[optionIdx] = { ...options[optionIdx], ...updates };
// //           return { ...n, options };
// //         }),
// //       };
// //     });

// //     markChanged();
// //   }

// //   function addOption(nodeKey: string) {
// //     if (!flow) return;
// //     setFlow((prev) => {
// //       if (!prev) return prev;
// //       return {
// //         ...prev,
// //         nodes: prev.nodes.map((n) => {
// //           if (n.node_key !== nodeKey) return n;
// //           const nextIndex = (n.options?.length || 0) + 1;

// //           const baseSeverity: SeverityLevel = "GREEN";
// //           const prefill =
// //             n.category === 1
// //               ? CAT1_PREFILL_BY_SEVERITY[baseSeverity]
// //               : { news2: 0, points: 0 };

// //           return {
// //             ...n,
// //             options: [
// //               ...(n.options || []),
// //               {
// //                 display_order: nextIndex,
// //                 label: `Option ${nextIndex}`,
// //                 value: `opt_${nextIndex}`,
// //                 severity: baseSeverity,
// //                 news2_score: prefill.news2,
// //                 seriousness_points: prefill.points,
// //                 next_node_key: null,
// //               },
// //             ],
// //           };
// //         }),
// //       };
// //     });
// //     markChanged();
// //   }

// //   function removeOption(nodeKey: string, optionIdx: number) {
// //     if (!flow) return;
// //     setFlow((prev) => {
// //       if (!prev) return prev;
// //       return {
// //         ...prev,
// //         nodes: prev.nodes.map((n) => {
// //           if (n.node_key !== nodeKey) return n;
// //           if ((n.options?.length || 0) <= 2) return n;
// //           const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
// //           const resequenced = filtered.map((o, i) => ({
// //             ...o,
// //             display_order: i + 1,
// //           }));
// //           return { ...n, options: resequenced };
// //         }),
// //       };
// //     });
// //     markChanged();
// //   }

// //   function addNode(category: Category, parentKey: string | null = null) {
// //     if (!flow) return;

// //     const siblingsCount = flow.nodes.filter(
// //       (n) => n.parent_node_key === parentKey && n.category === category,
// //     ).length;

// //     const newKey = parentKey
// //       ? `${parentKey}.${siblingsCount + 1}`
// //       : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

// //     const newNode: FlowNodeT = {
// //       node_key: newKey,
// //       node_type: "QUESTION",
// //       category,
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
// //       options: makeDefaultOptions(category),
// //     };

// //     setFlow((prev) =>
// //       prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
// //     );
// //     setExpandedNodes((prev) => new Set([...prev, newKey]));
// //     markChanged();
// //   }

// //   // ------------------ delete node (cascade descendants + clear references) ------------------
// //   function collectDescendants(rootKey: string): Set<string> {
// //     const cm = childrenMap();
// //     const toDelete = new Set<string>();
// //     const stack = [rootKey];
// //     while (stack.length) {
// //       const k = stack.pop()!;
// //       if (toDelete.has(k)) continue;
// //       toDelete.add(k);
// //       const kids = cm.get(k) || [];
// //       for (const child of kids) stack.push(child.node_key);
// //     }
// //     return toDelete;
// //   }

// //   function deleteNodeCascade(nodeKey: string) {
// //     if (!flow) return;
// //     const toDelete = collectDescendants(nodeKey);

// //     setFlow((prev) => {
// //       if (!prev) return prev;

// //       const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

// //       const cleaned = remaining.map((n) => {
// //         if (n.node_type !== "QUESTION") return n;

// //         const newOptions = (n.options || []).map((o) => {
// //           if (o.next_node_key && toDelete.has(o.next_node_key)) {
// //             return { ...o, next_node_key: null };
// //           }
// //           return o;
// //         });

// //         const newParent =
// //           n.parent_node_key && toDelete.has(n.parent_node_key)
// //             ? null
// //             : n.parent_node_key;

// //         return { ...n, parent_node_key: newParent, options: newOptions };
// //       });

// //       return { ...prev, nodes: cleaned };
// //     });

// //     if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);
// //     markChanged();
// //   }

// //   // ------------------ FRONTEND VALIDATION ------------------
// //   function validateFrontend(): ValidationState {
// //     if (!flow)
// //       return {
// //         ran: true,
// //         valid: false,
// //         items: [
// //           {
// //             level: "ERROR",
// //             title: "Flow not loaded",
// //             where: "Flow",
// //             howToFix: "Reload the page and try again.",
// //           },
// //         ],
// //       };

// //     const items: ValidationItem[] = [];
// //     const nm = nodeMap();
// //     const keys = new Set([...nm.keys()]);
// //     const allowedCats = new Set<number>([1, 2]);

// //     if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
// //       items.push({
// //         level: "ERROR",
// //         title: "Start node is missing or invalid",
// //         where: `Start Node: ${flow.start_node_key || "(empty)"}`,
// //         howToFix: `Set start_node_key to an existing node key (usually the first question).`,
// //       });
// //     }

// //     const seen = new Set<string>();
// //     for (const n of flow.nodes) {
// //       if (seen.has(n.node_key)) {
// //         items.push({
// //           level: "ERROR",
// //           title: "Duplicate node key found",
// //           where: `Node Key: ${n.node_key}`,
// //           howToFix: "Ensure every node has a unique node_key.",
// //         });
// //       }
// //       seen.add(n.node_key);
// //     }

// //     for (const n of flow.nodes) {
// //       if (!allowedCats.has(n.category)) {
// //         items.push({
// //           level: "ERROR",
// //           title: "Invalid category",
// //           where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// //           howToFix: "Category must be either 1 or 2.",
// //         });
// //       }

// //       if (n.parent_node_key) {
// //         const parent = nm.get(n.parent_node_key);
// //         if (!parent) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Parent node not found",
// //             where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
// //             howToFix:
// //               "Either fix parent_node_key or delete/recreate this node under a valid parent.",
// //           });
// //         } else if (parent.category !== n.category) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Category mismatch between parent and child",
// //             where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
// //             howToFix: `Move the node under a parent in the same category.`,
// //           });
// //         }
// //       }
// //     }

// //     for (const node of flow.nodes) {
// //       const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

// //       if (node.node_type === "QUESTION") {
// //         if (!node.options || node.options.length < 2) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Question must have at least 2 options",
// //             where: whereNode,
// //             howToFix: "Add more options until there are at least 2.",
// //           });
// //         }

// //         for (const opt of node.options || []) {
// //           const whereOpt = `${whereNode} → Option "${opt.label}"`;

// //           if (!opt.label || !opt.label.trim()) {
// //             items.push({
// //               level: "ERROR",
// //               title: "Option label is empty",
// //               where: whereOpt,
// //               howToFix: "Give this option a meaningful label (e.g., Yes / No).",
// //             });
// //           }

// //           if (!opt.next_node_key) {
// //             items.push({
// //               level: "ERROR",
// //               title: "Option next step is missing",
// //               where: whereOpt,
// //               howToFix: `Select a Next node for this option (or choose END).`,
// //             });
// //           } else if (opt.next_node_key !== "END") {
// //             const dst = nm.get(opt.next_node_key);
// //             if (!dst) {
// //               items.push({
// //                 level: "ERROR",
// //                 title: "Option points to a node that does not exist",
// //                 where: whereOpt,
// //                 howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
// //               });
// //             } else if (dst.category !== node.category) {
// //               items.push({
// //                 level: "ERROR",
// //                 title: "Option next node must be in the same category",
// //                 where: `${whereOpt} → Next "${dst.node_key}"`,
// //                 howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
// //               });
// //             }
// //           }

// //           // ✅ Enforce scoring disabled for category 2
// //           if (RULES.CATEGORY_2_SCORING_DISABLED && node.category === 2) {
// //             if (
// //               (opt.news2_score || 0) !== 0 ||
// //               (opt.seriousness_points || 0) !== 0
// //             ) {
// //               items.push({
// //                 level: "ERROR",
// //                 title: "Scoring is disabled for Symptoms and signs",
// //                 where: whereOpt,
// //                 howToFix: "Set NEWS2 and Points to 0 for category 2.",
// //               });
// //             }
// //           }
// //         }
// //       }

// //       if (node.node_type === "MESSAGE") {
// //         if (node.options && node.options.length > 0) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Message must not have options",
// //             where: whereNode,
// //             howToFix: "Change node type to QUESTION if you need options.",
// //           });
// //         }
// //       }

// //       if (node.node_type === "ALERT") {
// //         if (!node.alert_severity) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Alert severity is missing",
// //             where: whereNode,
// //             howToFix: "Select Green / Amber / Red for this Alert.",
// //           });
// //         }
// //         if (node.options && node.options.length > 0) {
// //           items.push({
// //             level: "ERROR",
// //             title: "Alert must not have options",
// //             where: whereNode,
// //             howToFix:
// //               "Alerts are end nodes. Remove options or change type to QUESTION.",
// //           });
// //         }
// //       }
// //     }

// //     // ✅ Cycle detection for BOTH categories (not only start_node_key)
// //     const graph = new Map<string, string[]>();
// //     function addEdge(src: string, dst: string | null) {
// //       if (!dst) return;
// //       graph.set(src, [...(graph.get(src) || []), dst]);
// //     }
// //     for (const n of flow.nodes) {
// //       if (n.node_type === "QUESTION") {
// //         for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
// //       }
// //     }

// //     const visited = new Set<string>();
// //     const stack = new Set<string>();
// //     function dfs(u: string): boolean {
// //       if (u === "END") return false;
// //       if (stack.has(u)) return true;
// //       if (visited.has(u)) return false;
// //       visited.add(u);
// //       stack.add(u);
// //       for (const v of graph.get(u) || []) {
// //         if (v && dfs(v)) return true;
// //       }
// //       stack.delete(u);
// //       return false;
// //     }

// //     function getRoots(cat: Category) {
// //       return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
// //     }

// //     const startKeysToCheck = new Set<string>();
// //     if (flow.start_node_key && keys.has(flow.start_node_key)) {
// //       startKeysToCheck.add(flow.start_node_key);
// //     }
// //     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
// //       for (const r of getRoots(cat)) startKeysToCheck.add(r.node_key);
// //     }

// //     for (const startKey of startKeysToCheck) {
// //       // reset only recursion stack, keep visited so we don't explode
// //       stack.clear();
// //       if (dfs(startKey)) {
// //         items.push({
// //           level: "ERROR",
// //           title: "Flow contains a cycle (loop)",
// //           where: `Path from ${startKey}`,
// //           howToFix: "Break the loop by changing an option's Next to END.",
// //         });
// //         break;
// //       }
// //     }

// //     const valid = items.filter((x) => x.level === "ERROR").length === 0;
// //     return { ran: true, valid, items };
// //   }

// //   function onValidateClick() {
// //     const result = validateFrontend();
// //     setValidation(result);
// //     if (!result.valid) window.scrollTo({ top: 0, behavior: "smooth" });
// //   }

// //   // ------------------ PREVIEW (Cat1 then Cat2) ------------------
// //   function getCategoryRoots(cat: Category): FlowNodeT[] {
// //     if (!flow) return [];
// //     return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
// //   }

// //   function orderedCategoriesPresent(): Category[] {
// //     if (!flow) return [1, 2];
// //     const present = new Set<Category>(flow.nodes.map((n) => n.category));
// //     return RULES.START_NODE_CATEGORY_PRIORITY.filter((c) => present.has(c));
// //   }

// //   function pickCategoryStart(cat: Category): string | "END" {
// //     const roots = getCategoryRoots(cat);
// //     return roots[0]?.node_key ?? "END";
// //   }

// //   function openPreview() {
// //     if (!flow) return;

// //     const nm = nodeMap();
// //     const cats = orderedCategoriesPresent();

// //     // start node is respected, but we also compute which category index it belongs to
// //     const start =
// //       flow.start_node_key && nm.has(flow.start_node_key)
// //         ? flow.start_node_key
// //         : (pickCategoryStart(cats[0]) ?? "END");

// //     const startNode = start !== "END" ? nm.get(start) : null;
// //     const startCat = startNode?.category ?? cats[0];
// //     const catIndex = Math.max(0, cats.indexOf(startCat));

// //     setPreview({
// //       open: true,
// //       currentKey: start,
// //       history: [],
// //       answers: {},
// //       selectedOptionValueByNode: {},
// //       categoryIndex: catIndex,
// //     });
// //   }

// //   function closePreview() {
// //     setPreview((p) => ({ ...p, open: false }));
// //   }

// //   function previewCurrentNode(): FlowNodeT | null {
// //     if (!flow) return null;
// //     if (!preview.open) return null;
// //     if (preview.currentKey === "END") return null;
// //     return nodeMap().get(preview.currentKey) || null;
// //   }

// //   function previewSelectOption(nodeKey: string, opt: FlowOption) {
// //     setPreview((p) => ({
// //       ...p,
// //       answers: { ...p.answers, [nodeKey]: opt.label },
// //       selectedOptionValueByNode: {
// //         ...p.selectedOptionValueByNode,
// //         [nodeKey]: opt.value,
// //       },
// //     }));
// //   }

// //   function goToNextCategoryOrFinish(currentCategory: Category) {
// //     const cats = orderedCategoriesPresent();
// //     const idx = Math.max(0, cats.indexOf(currentCategory));
// //     const nextIdx = idx + 1;
// //     if (nextIdx >= cats.length) {
// //       setPreview((p) => ({ ...p, currentKey: "END", categoryIndex: idx }));
// //       return;
// //     }
// //     const nextCat = cats[nextIdx];
// //     const nextStart = pickCategoryStart(nextCat);
// //     setPreview((p) => ({
// //       ...p,
// //       currentKey: nextStart,
// //       categoryIndex: nextIdx,
// //     }));
// //   }

// //   function previewNext() {
// //     if (!flow) return;
// //     const current = previewCurrentNode();
// //     if (!current) return;

// //     if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
// //       // treat as end of that category lane
// //       setPreview((p) => ({ ...p, history: [...p.history, current.node_key] }));
// //       goToNextCategoryOrFinish(current.category);
// //       return;
// //     }

// //     if (current.node_type === "QUESTION") {
// //       const selectedValue = preview.selectedOptionValueByNode[current.node_key];
// //       const opt = (current.options || []).find(
// //         (o) => o.value === selectedValue,
// //       );

// //       if (!opt) {
// //         alert("Please select an answer.");
// //         return;
// //       }

// //       const nextKey = opt.next_node_key || "END";

// //       setPreview((p) => ({
// //         ...p,
// //         history: [...p.history, current.node_key],
// //       }));

// //       if (nextKey === "END") {
// //         goToNextCategoryOrFinish(current.category);
// //         return;
// //       }

// //       setPreview((p) => ({
// //         ...p,
// //         currentKey: nextKey as any,
// //       }));
// //       return;
// //     }
// //   }

// //   function previewBack() {
// //     setPreview((p) => {
// //       const hist = [...p.history];
// //       const prevKey = hist.pop();
// //       if (!prevKey) return p;
// //       return { ...p, history: hist, currentKey: prevKey };
// //     });
// //   }

// //   function previewRestart() {
// //     openPreview();
// //   }

// //   // ✅ Score alert logic only for answer options (unchanged)
// //   function computePreviewResults() {
// //     if (!flow) {
// //       return {
// //         cat1: {
// //           totalNews2: 0,
// //           totalPoints: 0,
// //           alert: "GREEN" as SeverityLevel,
// //         },
// //         cat2: {
// //           severity: "GREEN" as SeverityLevel,
// //           alert: "GREEN" as SeverityLevel,
// //         },
// //         finalAlert: "GREEN" as SeverityLevel,
// //       };
// //     }

// //     const nm = nodeMap();
// //     let cat1News2 = 0;
// //     let cat1Points = 0;

// //     let cat2Severity: SeverityLevel = "GREEN";

// //     let cat1AlertNodeSeverity: SeverityLevel | null = null;
// //     let cat2AlertNodeSeverity: SeverityLevel | null = null;

// //     for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
// //       const node = nm.get(nodeKey);
// //       if (!node || node.node_type !== "QUESTION") continue;

// //       const selectedValue = preview.selectedOptionValueByNode[nodeKey];
// //       const opt = (node.options || []).find((o) => o.value === selectedValue);
// //       if (!opt) continue;

// //       if (node.category === 1) {
// //         cat1News2 += Number(opt.news2_score || 0);
// //         cat1Points += Number(opt.seriousness_points || 0);
// //       } else if (node.category === 2) {
// //         cat2Severity = maxSeverity(cat2Severity, opt.severity);
// //       }
// //     }

// //     const current = previewCurrentNode();
// //     if (current?.node_type === "ALERT" && current.alert_severity) {
// //       if (current.category === 1)
// //         cat1AlertNodeSeverity = current.alert_severity;
// //       if (current.category === 2)
// //         cat2AlertNodeSeverity = current.alert_severity;
// //     }

// //     let cat1Alert = clinicalAlertFromScore(cat1Points);
// //     if (cat1AlertNodeSeverity)
// //       cat1Alert = maxSeverity(cat1Alert, cat1AlertNodeSeverity);

// //     let cat2Alert = cat2Severity;
// //     if (cat2AlertNodeSeverity)
// //       cat2Alert = maxSeverity(cat2Alert, cat2AlertNodeSeverity);

// //     const finalAlert = maxSeverity(cat1Alert, cat2Alert);

// //     return {
// //       cat1: {
// //         totalNews2: cat1News2,
// //         totalPoints: cat1Points,
// //         alert: cat1Alert,
// //       },
// //       cat2: { severity: cat2Severity, alert: cat2Alert },
// //       finalAlert,
// //     };
// //   }

// //   // ------------------ GRAPH BUILD (true tree + 2 category lanes) ------------------
// //   function buildGraphElements(): { nodes: Node[]; edges: Edge[] } {
// //     if (!flow) return { nodes: [], edges: [] };

// //     const nm = nodeMap();

// //     const endIds: Record<Category, string> = {
// //       1: "END:1",
// //       2: "END:2",
// //     };

// //     const cats = orderedCategoriesPresent();

// //     const allNodes: Node[] = [];
// //     const allEdges: Edge[] = [];

// //     // Build per-category lane then offset X
// //     cats.forEach((cat, laneIndex) => {
// //       const laneNodes: Node[] = [];
// //       const laneEdges: Edge[] = [];

// //       // category header node
// //       const headerId = `CAT:${cat}`;
// //       laneNodes.push({
// //         id: headerId,
// //         type: "flowNode",
// //         data: {
// //           title: CATEGORY_LABEL[cat],
// //           subtitle: "Tree graph lane",
// //           kind: "CAT_HEADER",
// //           severity: "GREEN",
// //           category: cat,
// //         } satisfies GraphNodeData,
// //         position: { x: 0, y: 0 },
// //       });

// //       // END node (so END edges always visible)
// //       laneNodes.push({
// //         id: endIds[cat],
// //         type: "flowNode",
// //         data: {
// //           title: "Complete Flow",
// //           subtitle: "END node",
// //           kind: "END",
// //           severity: "GREEN",
// //           category: cat,
// //         } satisfies GraphNodeData,
// //         position: { x: 0, y: 0 },
// //       });

// //       // actual flow nodes for this category
// //       const nodesInCat = flow.nodes.filter((n) => n.category === cat);
// //       for (const n of nodesInCat) {
// //         let sev: SeverityLevel = "GREEN";
// //         if (n.node_type === "ALERT")
// //           sev = (n.alert_severity || "RED") as SeverityLevel;
// //         if (n.node_type === "QUESTION") {
// //           for (const o of n.options || [])
// //             sev = maxSeverity(sev, o.severity || "GREEN");
// //         }

// //         const optionPorts =
// //           n.node_type === "QUESTION"
// //             ? (n.options || []).map((o) => ({
// //                 id: `opt:${o.value}`,
// //                 label: o.label,
// //                 severity: o.severity || "GREEN",
// //               }))
// //             : [];

// //         laneNodes.push({
// //           id: n.node_key,
// //           type: "flowNode",
// //           data: {
// //             title: n.body_text,
// //             subtitle: `${n.node_type} • key ${n.node_key}`,
// //             kind: n.node_type,
// //             severity: sev,
// //             category: cat,
// //             optionPorts,
// //           } satisfies GraphNodeData,
// //           position: { x: 0, y: 0 },
// //         });
// //       }

// //       // connect header -> category starts (roots)
// //       const roots = nodesInCat.filter((n) => !n.parent_node_key);
// //       for (const r of roots) {
// //         laneEdges.push({
// //           id: `e:${headerId}->${r.node_key}`,
// //           source: headerId,
// //           target: r.node_key,
// //           type: "smoothstep",
// //           markerEnd: { type: MarkerType.ArrowClosed },
// //           style: { strokeWidth: 2, stroke: "#0f766e" }, // teal-700
// //         });
// //       }

// //       // edges per option (unique id + END included)
// //       for (const n of nodesInCat) {
// //         if (n.node_type !== "QUESTION") continue;

// //         for (const o of n.options || []) {
// //           const rawTarget = o.next_node_key || "END";

// //           const targetId =
// //             rawTarget === "END"
// //               ? endIds[cat]
// //               : nm.has(rawTarget)
// //                 ? rawTarget
// //                 : null;

// //           if (!targetId) continue;

// //           const edgeId = `e:${n.node_key}:${o.value}:${targetId}`; // ✅ no collisions

// //           const sev = o.severity || "GREEN";

// //           laneEdges.push({
// //             id: edgeId,
// //             source: n.node_key,
// //             target: targetId,
// //             sourceHandle: `opt:${o.value}`, // ✅ separate port per option
// //             label: o.label,
// //             type: "smoothstep",
// //             markerEnd: { type: MarkerType.ArrowClosed },
// //             style: { strokeWidth: 2, stroke: edgeStrokeBySeverity(sev) },
// //             labelStyle: { fontSize: 12, fontWeight: 700, fill: "#111827" },
// //           });
// //         }
// //       }

// //       const laid = layoutWithDagre(laneNodes, laneEdges, {
// //         ranksep: 150,
// //         nodesep: 95,
// //       });

// //       const xOffset = laneIndex * 980; // ✅ lane spacing
// //       const shiftedNodes = laid.nodes.map((n) => ({
// //         ...n,
// //         position: { x: n.position.x + xOffset, y: n.position.y },
// //       }));

// //       allNodes.push(...shiftedNodes);
// //       allEdges.push(...laid.edges);
// //     });

// //     return { nodes: allNodes, edges: allEdges };
// //   }

// //   // ------------------ render guards ------------------
// //   const visibleNodesCat1 = getVisibleNodesByCategory(1);
// //   const visibleNodesCat2 = getVisibleNodesByCategory(2);

// //   if (loading && !flow) {
// //     return (
// //       <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
// //         <div className="text-gray-600">Loading questions...</div>
// //       </div>
// //     );
// //   }

// //   const currentPreviewNode = previewCurrentNode();
// //   const results = computePreviewResults();
// //   const graph = buildGraphElements();

// //   return (
// //     <div className="min-h-screen bg-[#f4f5fa] flex">
// //       {/* Sidebar */}
// //       <aside
// //         className={`${
// //           sidebarOpen ? "w-64" : "w-20"
// //         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
// //       >
// //         <div className="p-6 border-b border-gray-200 flex items-center gap-3">
// //           <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
// //             <span className="text-white font-bold">VW</span>
// //           </div>
// //           {sidebarOpen && (
// //             <span className="text-xl font-bold text-teal-600">
// //               VIRTUAL WARD
// //             </span>
// //           )}
// //         </div>

// //         <nav className="flex-1 p-4 space-y-1">
// //           <button
// //             onClick={() => router.push("/admin/questionnaires")}
// //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-colors"
// //           >
// //             {sidebarOpen && <span>Questionnaires</span>}
// //             {!sidebarOpen && <span>Q</span>}
// //           </button>

// //           <button
// //             onClick={logout}
// //             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
// //           >
// //             {sidebarOpen && <span>Logout</span>}
// //             {!sidebarOpen && <span>⎋</span>}
// //           </button>
// //         </nav>
// //       </aside>

// //       {/* Main */}
// //       <div className="flex-1 flex flex-col">
// //         <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
// //           <div className="flex items-center gap-4">
// //             <button
// //               onClick={() => setSidebarOpen(!sidebarOpen)}
// //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //               aria-label="Toggle sidebar"
// //             >
// //               ☰
// //             </button>

// //             <button
// //               onClick={() => router.push("/admin/questionnaires")}
// //               className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
// //             >
// //               ← Back
// //             </button>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={() =>
// //                 setViewMode((v) => (v === "table" ? "graph" : "table"))
// //               }
// //               className={BTN_OUTLINE}
// //               title="Toggle Table / Graph"
// //             >
// //               🧠 {viewMode === "table" ? "Graph View" : "Table View"}
// //             </button>

// //             <button onClick={openPreview} className={BTN_PRIMARY}>
// //               👁 Preview
// //             </button>

// //             <button onClick={onValidateClick} className={BTN_PRIMARY}>
// //               ✅ Validate
// //             </button>

// //             <button
// //               onClick={saveFlow}
// //               disabled={
// //                 saving ||
// //                 !hasUnsavedChanges ||
// //                 !validation.ran ||
// //                 !validation.valid
// //               }
// //               className={BTN_PRIMARY}
// //               title={
// //                 !validation.ran
// //                   ? "Validate before saving"
// //                   : !validation.valid
// //                     ? "Fix validation errors before saving"
// //                     : !hasUnsavedChanges
// //                       ? "No changes to save"
// //                       : ""
// //               }
// //             >
// //               💾 {saving ? "Saving..." : "Save"}
// //             </button>
// //           </div>
// //         </header>

// //         {error && (
// //           <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
// //             <div className="text-red-700">
// //               <strong>Error:</strong> {error}
// //             </div>
// //             <button
// //               onClick={() => setError(null)}
// //               className="text-red-700 hover:text-red-900 font-bold"
// //             >
// //               ✕
// //             </button>
// //           </div>
// //         )}

// //         <main className="flex-1 p-6 overflow-auto">
// //           {/* Page header */}
// //           {flow && (
// //             <div className="mb-4">
// //               <h1 className="text-2xl font-semibold text-gray-900">
// //                 Question Management
// //               </h1>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 {flow.name} (Version {flow.version}){" "}
// //                 {validation.ran ? (
// //                   validation.valid ? (
// //                     <span className="ml-2 text-green-700 font-semibold">
// //                       ● Valid
// //                     </span>
// //                   ) : (
// //                     <span className="ml-2 text-red-700 font-semibold">
// //                       ● Not valid
// //                     </span>
// //                   )
// //                 ) : (
// //                   <span className="ml-2 text-gray-500 font-semibold">
// //                     ● Not validated
// //                   </span>
// //                 )}
// //                 {hasUnsavedChanges && (
// //                   <span className="ml-2 text-amber-700 font-semibold">
// //                     ● Unsaved changes
// //                   </span>
// //                 )}
// //               </p>
// //             </div>
// //           )}

// //           {/* Validation results */}
// //           {validation.ran && (
// //             <div
// //               className={`mb-6 rounded-lg border px-6 py-4 ${
// //                 validation.valid
// //                   ? "bg-green-50 border-green-200"
// //                   : "bg-red-50 border-red-200"
// //               }`}
// //             >
// //               <div
// //                 className={`font-semibold ${
// //                   validation.valid ? "text-green-900" : "text-red-900"
// //                 }`}
// //               >
// //                 {validation.valid
// //                   ? `Validation successful (0 errors, 0 warnings)`
// //                   : `Validation failed (${validation.items.filter((x) => x.level === "ERROR").length} errors, ${
// //                       validation.items.filter((x) => x.level === "WARNING")
// //                         .length
// //                     } warnings)`}
// //               </div>

// //               {!validation.valid && (
// //                 <div className="mt-3 space-y-3">
// //                   {validation.items.map((it, idx) => (
// //                     <div
// //                       key={idx}
// //                       className="bg-white/60 border border-red-200 rounded-lg p-4"
// //                     >
// //                       <div className="font-semibold text-red-900">
// //                         {it.title}
// //                       </div>
// //                       <div className="text-sm text-red-900 mt-1">
// //                         <strong>Where:</strong> {it.where}
// //                       </div>
// //                       <div className="text-sm text-red-900 mt-1">
// //                         <strong>How to fix:</strong> {it.howToFix}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* ✅ GRAPH VIEW */}
// //           {flow && viewMode === "graph" && (
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// //                 <div>
// //                   <div className="text-lg font-semibold text-teal-900">
// //                     Graph View (read-only)
// //                   </div>
// //                   <div className="text-xs text-gray-500 mt-1">
// //                     True tree graph: every option is a separate branch
// //                     (including END). Two lanes: Category 1 + Category 2.
// //                   </div>
// //                 </div>
// //                 <div className="text-xs text-gray-500">
// //                   Changes in table update graph automatically.
// //                 </div>
// //               </div>

// //               <div className="h-[72vh] bg-teal-50">
// //                 <ReactFlow
// //                   nodes={graph.nodes}
// //                   edges={graph.edges}
// //                   nodeTypes={nodeTypes}
// //                   fitView
// //                   className="bg-teal-50"
// //                 >
// //                   <MiniMap />
// //                   <Controls />
// //                   <Background />
// //                 </ReactFlow>
// //               </div>
// //             </div>
// //           )}

// //           {/* ✅ TABLE VIEW (your original UI, unchanged) */}
// //           {flow && viewMode === "table" && (
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //               <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
// //                 <h2 className="text-lg font-semibold text-teal-900">
// //                   Question Flow Builder
// //                 </h2>
// //                 <div className="flex items-center gap-2">
// //                   <button
// //                     onClick={() =>
// //                       setCollapsedCategories({ 1: false, 2: false })
// //                     }
// //                     className={BTN_OUTLINE}
// //                   >
// //                     Expand Categories
// //                   </button>
// //                   <button
// //                     onClick={() => setCollapsedCategories({ 1: true, 2: true })}
// //                     className={BTN_OUTLINE}
// //                   >
// //                     Collapse Categories
// //                   </button>
// //                   <button onClick={expandAllNodes} className={BTN_OUTLINE}>
// //                     Expand All
// //                   </button>
// //                   <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
// //                     Collapse All
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="overflow-auto">
// //                 <table className="w-full text-sm">
// //                   <thead className="bg-gray-50">
// //                     <tr className="border-b border-gray-200">
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-10"></th>
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-24">
// //                         Node
// //                       </th>
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">
// //                         Type
// //                       </th>
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[300px]">
// //                         Body Text
// //                       </th>
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[520px]">
// //                         Options / Settings
// //                       </th>
// //                       <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {([1, 2] as Category[]).map((cat) => {
// //                       const collapsed = collapsedCategories[cat];
// //                       const visibleNodes =
// //                         cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

// //                       return (
// //                         <Fragment key={`cat-${cat}`}>
// //                           <tr className="bg-gray-100 border-b border-gray-200">
// //                             <td className="px-3 py-3" colSpan={6}>
// //                               <div className="flex items-center justify-between">
// //                                 <button
// //                                   onClick={() =>
// //                                     setCollapsedCategories((p) => ({
// //                                       ...p,
// //                                       [cat]: !p[cat],
// //                                     }))
// //                                   }
// //                                   className="flex items-center gap-2 text-sm font-semibold text-gray-800"
// //                                 >
// //                                   <span className="inline-block w-5 text-center">
// //                                     {collapsed ? "▶" : "▼"}
// //                                   </span>
// //                                   <span>{CATEGORY_LABEL[cat]}</span>
// //                                   <span className="text-xs font-normal text-gray-500">
// //                                     (
// //                                     {
// //                                       flow.nodes.filter(
// //                                         (n) => n.category === cat,
// //                                       ).length
// //                                     }{" "}
// //                                     nodes)
// //                                   </span>
// //                                 </button>

// //                                 <button
// //                                   onClick={() => addNode(cat, null)}
// //                                   className={BTN_OUTLINE}
// //                                 >
// //                                   + Add Root Node
// //                                 </button>
// //                               </div>
// //                             </td>
// //                           </tr>

// //                           {!collapsed &&
// //                             visibleNodes.map((node) => {
// //                               const hasChild = hasChildren(node.node_key);
// //                               const isExpanded = expandedNodes.has(
// //                                 node.node_key,
// //                               );
// //                               const indent = node.depth_level * 24;
// //                               const isEditing =
// //                                 editingNodeKey === node.node_key;

// //                               return (
// //                                 <Fragment key={node.node_key}>
// //                                   <tr className="border-b border-gray-100 hover:bg-gray-50">
// //                                     <td className="px-3 py-2">
// //                                       {hasChild && (
// //                                         <button
// //                                           onClick={() =>
// //                                             toggleNode(node.node_key)
// //                                           }
// //                                           className="text-gray-600 hover:text-gray-900"
// //                                         >
// //                                           {isExpanded ? "▼" : "▶"}
// //                                         </button>
// //                                       )}
// //                                     </td>

// //                                     <td
// //                                       className="px-3 py-2"
// //                                       style={{
// //                                         paddingLeft: `${indent + 12}px`,
// //                                       }}
// //                                     >
// //                                       <span
// //                                         className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
// //                                       >
// //                                         {getCategorySequenceNumber(
// //                                           node.node_key,
// //                                         )}
// //                                       </span>
// //                                     </td>

// //                                     <td className="px-3 py-2">
// //                                       <select
// //                                         className={`${SELECT_SM} w-full`}
// //                                         value={node.node_type}
// //                                         onChange={(e) =>
// //                                           updateNode(node.node_key, {
// //                                             node_type: e.target
// //                                               .value as FlowNodeType,
// //                                           })
// //                                         }
// //                                       >
// //                                         <option value="QUESTION">
// //                                           Question
// //                                         </option>
// //                                         <option value="MESSAGE">Message</option>
// //                                         <option value="ALERT">Alert</option>
// //                                       </select>
// //                                     </td>

// //                                     <td className="px-3 py-2">
// //                                       <input
// //                                         className={`${INPUT_SM} w-full`}
// //                                         value={node.body_text}
// //                                         onChange={(e) =>
// //                                           updateNode(node.node_key, {
// //                                             body_text: e.target.value,
// //                                           })
// //                                         }
// //                                         placeholder="Question or message..."
// //                                       />
// //                                     </td>

// //                                     <td className="px-3 py-2">
// //                                       {node.node_type === "QUESTION" ? (
// //                                         <div className="text-xs text-gray-600 flex items-center gap-2">
// //                                           <span>
// //                                             {node.options?.length || 0} options
// //                                           </span>
// //                                           <button
// //                                             onClick={() =>
// //                                               setEditingNodeKey(
// //                                                 isEditing
// //                                                   ? null
// //                                                   : node.node_key,
// //                                               )
// //                                             }
// //                                             className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
// //                                           >
// //                                             {isEditing ? "Hide" : "Edit"}
// //                                           </button>
// //                                         </div>
// //                                       ) : node.node_type === "ALERT" ? (
// //                                         <div className="flex items-center gap-2">
// //                                           <span className="text-xs text-gray-600">
// //                                             Severity
// //                                           </span>
// //                                           <select
// //                                             className={SELECT_SM}
// //                                             value={node.alert_severity || "RED"}
// //                                             onChange={(e) =>
// //                                               updateNode(node.node_key, {
// //                                                 alert_severity: e.target
// //                                                   .value as SeverityLevel,
// //                                               })
// //                                             }
// //                                           >
// //                                             <option value="GREEN">Green</option>
// //                                             <option value="AMBER">Amber</option>
// //                                             <option value="RED">Red</option>
// //                                           </select>
// //                                           <span className="text-xs text-gray-500 italic">
// //                                             (end node)
// //                                           </span>
// //                                         </div>
// //                                       ) : (
// //                                         <span className="text-xs text-gray-500 italic">
// //                                           Message (end node)
// //                                         </span>
// //                                       )}
// //                                     </td>

// //                                     <td className="px-3 py-2">
// //                                       <div className="flex items-center gap-2 justify-end">
// //                                         {/* <button
// //                                           onClick={() =>
// //                                             addNode(
// //                                               node.category,
// //                                               node.node_key,
// //                                             )
// //                                           }
// //                                           className={BTN_OUTLINE}
// //                                         >
// //                                           + Child
// //                                         </button> */}
// //                                         <button
// //                                           onClick={() =>
// //                                             deleteNodeCascade(node.node_key)
// //                                           }
// //                                           className={BTN_DANGER}
// //                                           title="Cascade delete this node and all descendants"
// //                                         >
// //                                           Delete
// //                                         </button>
// //                                       </div>
// //                                     </td>
// //                                   </tr>

// //                                   {/* OPTIONS (EDIT MODE) */}
// //                                   {isEditing &&
// //                                     node.node_type === "QUESTION" &&
// //                                     (node.options || []).map((opt, idx) => {
// //                                       const scoringDisabled =
// //                                         RULES.CATEGORY_2_SCORING_DISABLED &&
// //                                         node.category === 2;

// //                                       return (
// //                                         <tr
// //                                           key={`${node.node_key}-opt-${idx}`}
// //                                           className="bg-gray-50 border-b border-gray-100"
// //                                         >
// //                                           <td
// //                                             colSpan={2}
// //                                             className="px-3 py-2"
// //                                           ></td>

// //                                           <td className="px-3 py-2">
// //                                             <span className="text-xs text-gray-600">
// //                                               Option {idx + 1}
// //                                             </span>
// //                                           </td>

// //                                           <td className="px-3 py-2">
// //                                             <input
// //                                               className={`${INPUT_SM} w-full`}
// //                                               value={opt.label}
// //                                               onChange={(e) =>
// //                                                 updateOption(
// //                                                   node.node_key,
// //                                                   idx,
// //                                                   {
// //                                                     label: e.target.value,
// //                                                   },
// //                                                 )
// //                                               }
// //                                               placeholder="Option label"
// //                                             />
// //                                           </td>

// //                                           <td className="px-3 py-2">
// //                                             <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
// //                                               <span className="text-xs text-gray-600 whitespace-nowrap">
// //                                                 Next
// //                                               </span>

// //                                               <select
// //                                                 className={`${SELECT_SM} min-w-[260px]`}
// //                                                 value={opt.next_node_key || ""}
// //                                                 onChange={(e) =>
// //                                                   updateOption(
// //                                                     node.node_key,
// //                                                     idx,
// //                                                     {
// //                                                       next_node_key:
// //                                                         e.target.value || null,
// //                                                     },
// //                                                   )
// //                                                 }
// //                                               >
// //                                                 {getAvailableNextNodes(
// //                                                   node.category,
// //                                                 ).map((nextOpt) => (
// //                                                   <option
// //                                                     key={nextOpt.key}
// //                                                     value={nextOpt.key}
// //                                                   >
// //                                                     {nextOpt.label}
// //                                                   </option>
// //                                                 ))}
// //                                               </select>

// //                                               <select
// //                                                 className={`${SELECT_SM} w-28`}
// //                                                 value={opt.severity}
// //                                                 onChange={(e) => {
// //                                                   const newSeverity = e.target
// //                                                     .value as SeverityLevel;

// //                                                   const updates: Partial<FlowOption> =
// //                                                     {
// //                                                       severity: newSeverity,
// //                                                     };

// //                                                   if (node.category === 1) {
// //                                                     const prefill =
// //                                                       CAT1_PREFILL_BY_SEVERITY[
// //                                                         newSeverity
// //                                                       ];
// //                                                     updates.news2_score =
// //                                                       prefill.news2;
// //                                                     updates.seriousness_points =
// //                                                       prefill.points;
// //                                                   }

// //                                                   updateOption(
// //                                                     node.node_key,
// //                                                     idx,
// //                                                     updates,
// //                                                   );
// //                                                 }}
// //                                               >
// //                                                 <option value="GREEN">
// //                                                   Green
// //                                                 </option>
// //                                                 <option value="AMBER">
// //                                                   Amber
// //                                                 </option>
// //                                                 <option value="RED">Red</option>
// //                                               </select>

// //                                               <input
// //                                                 className={`${INPUT_SM} w-24`}
// //                                                 type="number"
// //                                                 value={
// //                                                   scoringDisabled
// //                                                     ? 0
// //                                                     : opt.news2_score
// //                                                 }
// //                                                 disabled={scoringDisabled}
// //                                                 onChange={(e) =>
// //                                                   updateOption(
// //                                                     node.node_key,
// //                                                     idx,
// //                                                     {
// //                                                       news2_score: Number(
// //                                                         e.target.value,
// //                                                       ),
// //                                                     },
// //                                                   )
// //                                                 }
// //                                                 placeholder="NEWS2"
// //                                                 title="NEWS2 Score"
// //                                               />

// //                                               <input
// //                                                 className={`${INPUT_SM} w-24`}
// //                                                 type="number"
// //                                                 value={
// //                                                   scoringDisabled
// //                                                     ? 0
// //                                                     : opt.seriousness_points
// //                                                 }
// //                                                 disabled={scoringDisabled}
// //                                                 onChange={(e) =>
// //                                                   updateOption(
// //                                                     node.node_key,
// //                                                     idx,
// //                                                     {
// //                                                       seriousness_points:
// //                                                         Number(e.target.value),
// //                                                     },
// //                                                   )
// //                                                 }
// //                                                 placeholder="Points"
// //                                                 title="Seriousness Points"
// //                                               />

// //                                               <button
// //                                                 onClick={() =>
// //                                                   removeOption(
// //                                                     node.node_key,
// //                                                     idx,
// //                                                   )
// //                                                 }
// //                                                 disabled={
// //                                                   (node.options?.length || 0) <=
// //                                                   2
// //                                                 }
// //                                                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// //                                                 title={
// //                                                   (node.options?.length || 0) <=
// //                                                   2
// //                                                     ? "Minimum 2 options required"
// //                                                     : "Delete option"
// //                                                 }
// //                                               >
// //                                                 ✕
// //                                               </button>
// //                                             </div>

// //                                             {scoringDisabled && (
// //                                               <div className="text-xs text-gray-500 mt-1">
// //                                                 Scoring disabled for Symptoms
// //                                                 and signs (Category 2).
// //                                               </div>
// //                                             )}
// //                                           </td>

// //                                           <td className="px-3 py-2"></td>
// //                                         </tr>
// //                                       );
// //                                     })}

// //                                   {isEditing &&
// //                                     node.node_type === "QUESTION" && (
// //                                       <tr className="bg-gray-50 border-b border-gray-100">
// //                                         <td colSpan={5} className="px-3 py-2">
// //                                           <button
// //                                             onClick={() =>
// //                                               addOption(node.node_key)
// //                                             }
// //                                             className={BTN_OUTLINE}
// //                                           >
// //                                             + Add Option
// //                                           </button>
// //                                         </td>
// //                                         <td className="px-3 py-2"></td>
// //                                       </tr>
// //                                     )}
// //                                 </Fragment>
// //                               );
// //                             })}
// //                         </Fragment>
// //                       );
// //                     })}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* PREVIEW MODAL */}
// //           {preview.open && flow && (
// //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //               <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
// //                 <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
// //                   <div className="text-lg font-bold text-white">
// //                     Patient Preview
// //                   </div>
// //                   <button
// //                     onClick={closePreview}
// //                     className="p-2 hover:bg-teal-700 rounded-lg text-white"
// //                   >
// //                     ✕
// //                   </button>
// //                 </div>

// //                 <div className="p-6 space-y-4">
// //                   {currentPreviewNode ? (
// //                     <>
// //                       <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
// //                         {CATEGORY_LABEL[currentPreviewNode.category]}
// //                       </div>

// //                       <div className="flex items-start justify-between text-xs text-gray-500 gap-4">
// //                         <div>
// //                           Node{" "}
// //                           {getCategorySequenceNumber(
// //                             currentPreviewNode.node_key,
// //                           )}{" "}
// //                           • {currentPreviewNode.node_type}
// //                         </div>

// //                         <div className="text-right">
// //                           <div>
// //                             Cat1 Alert:{" "}
// //                             <span className="font-semibold">
// //                               {results.cat1.alert}
// //                             </span>{" "}
// //                             • Points:{" "}
// //                             <span className="font-semibold">
// //                               {results.cat1.totalPoints}
// //                             </span>{" "}
// //                             • NEWS2:{" "}
// //                             <span className="font-semibold">
// //                               {results.cat1.totalNews2}
// //                             </span>
// //                           </div>
// //                           <div className="mt-1">
// //                             Cat2 Alert:{" "}
// //                             <span className="font-semibold">
// //                               {results.cat2.alert}
// //                             </span>{" "}
// //                             • Final:{" "}
// //                             <span className="font-semibold">
// //                               {results.finalAlert}
// //                             </span>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
// //                         {currentPreviewNode.title && (
// //                           <div className="text-lg font-semibold text-gray-900 mb-2">
// //                             {currentPreviewNode.title}
// //                           </div>
// //                         )}
// //                         <div className="text-base text-gray-900">
// //                           {currentPreviewNode.body_text}
// //                         </div>
// //                         {currentPreviewNode.help_text && (
// //                           <div className="text-sm text-gray-600 italic mt-2">
// //                             {currentPreviewNode.help_text}
// //                           </div>
// //                         )}

// //                         {currentPreviewNode.node_type === "QUESTION" && (
// //                           <div className="space-y-3 mt-6">
// //                             {(currentPreviewNode.options || []).map(
// //                               (opt, idx) => {
// //                                 const selectedValue =
// //                                   preview.selectedOptionValueByNode[
// //                                     currentPreviewNode.node_key
// //                                   ];
// //                                 const checked = selectedValue === opt.value;

// //                                 return (
// //                                   <button
// //                                     key={`${currentPreviewNode.node_key}-ans-${idx}`}
// //                                     onClick={() =>
// //                                       previewSelectOption(
// //                                         currentPreviewNode.node_key,
// //                                         opt,
// //                                       )
// //                                     }
// //                                     className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
// //                                       checked
// //                                         ? "border-teal-600 bg-teal-50"
// //                                         : "border-gray-200 hover:border-gray-300 bg-white"
// //                                     }`}
// //                                   >
// //                                     <div className="flex items-center gap-3">
// //                                       <div
// //                                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
// //                                           checked
// //                                             ? "border-teal-600 bg-teal-600"
// //                                             : "border-gray-300"
// //                                         }`}
// //                                       >
// //                                         {checked && (
// //                                           <div className="w-2 h-2 bg-white rounded-full"></div>
// //                                         )}
// //                                       </div>
// //                                       <div className="text-base font-medium text-gray-900">
// //                                         {opt.label}
// //                                       </div>
// //                                     </div>
// //                                   </button>
// //                                 );
// //                               },
// //                             )}
// //                           </div>
// //                         )}

// //                         {currentPreviewNode.node_type === "MESSAGE" && (
// //                           <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
// //                             This is a message. Click <strong>Next</strong> to
// //                             continue.
// //                           </div>
// //                         )}

// //                         {currentPreviewNode.node_type === "ALERT" && (
// //                           <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
// //                             <div className="font-semibold">
// //                               Alert Severity:{" "}
// //                               {currentPreviewNode.alert_severity || "RED"}
// //                             </div>
// //                             <div className="mt-1">
// //                               This is an end node for this category. Click{" "}
// //                               <strong>Next</strong> to continue.
// //                             </div>
// //                           </div>
// //                         )}

// //                         <div className="flex items-center justify-between pt-6">
// //                           <button
// //                             onClick={previewBack}
// //                             disabled={preview.history.length === 0}
// //                             className={BTN_OUTLINE}
// //                           >
// //                             Back
// //                           </button>
// //                           <button
// //                             onClick={previewNext}
// //                             className={BTN_PRIMARY}
// //                             disabled={
// //                               currentPreviewNode.node_type === "QUESTION" &&
// //                               !preview.selectedOptionValueByNode[
// //                                 currentPreviewNode.node_key
// //                               ]
// //                             }
// //                           >
// //                             Next
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </>
// //                   ) : (
// //                     <div className="text-center py-10">
// //                       <div className="text-xl font-bold text-gray-900">
// //                         Questionnaire Complete
// //                       </div>
// //                       <div className="text-sm text-gray-600 mt-2">
// //                         Final Alert:{" "}
// //                         <span className="font-semibold">
// //                           {results.finalAlert}
// //                         </span>{" "}
// //                         • Cat1:{" "}
// //                         <span className="font-semibold">
// //                           {results.cat1.alert}
// //                         </span>{" "}
// //                         • Cat2:{" "}
// //                         <span className="font-semibold">
// //                           {results.cat2.alert}
// //                         </span>{" "}
// //                         • Points:{" "}
// //                         <span className="font-semibold">
// //                           {results.cat1.totalPoints}
// //                         </span>
// //                       </div>
// //                       <div className="mt-6 flex items-center justify-center gap-2">
// //                         <button
// //                           onClick={previewRestart}
// //                           className={BTN_OUTLINE}
// //                         >
// //                           ↻ Restart
// //                         </button>
// //                         <button onClick={closePreview} className={BTN_PRIMARY}>
// //                           Close
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>

// //                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
// //                   <button
// //                     onClick={previewRestart}
// //                     className="text-sm text-gray-600 hover:text-gray-900 font-medium"
// //                   >
// //                     ↻ Restart Preview
// //                   </button>
// //                   <div className="text-xs text-gray-500">
// //                     This is how patients will see the questionnaire
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { Fragment, memo, useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// // ✅ Graph deps (XYFlow v12+ has NO default export)
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   MiniMap,
//   Handle,
//   Position,
//   MarkerType,
//   type Node,
//   type Edge,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// import dagre from "dagre";

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

// type Category = 1 | 2;

// const CATEGORY_LABEL: Record<Category, string> = {
//   1: "Clinical Obs – Colorectal",
//   2: "Symptoms and signs",
// };

// type FlowNodeT = {
//   node_key: string;
//   node_type: FlowNodeType;
//   category: Category;

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
//   nodes: FlowNodeT[];
// };

// // ================== CONFIG (easy to change) ==================
// const SCORE_CATEGORY_1 = {
//   RED_POINTS_MIN: 100,
//   AMBER_POINTS_MIN: 30,
// };

// const RULES = {
//   AUTO_FIX_START_NODE: true,
//   START_NODE_CATEGORY_PRIORITY: [1, 2] as Category[],
// };

// // Prefill defaults for Category 1 when admin chooses severity
// const CAT1_PREFILL_BY_SEVERITY: Record<
//   SeverityLevel,
//   { news2: number; points: number }
// > = {
//   GREEN: { news2: 0, points: 0 },
//   AMBER: { news2: 0, points: 30 },
//   RED: { news2: 0, points: 100 },
// };

// // Prefill defaults for Category 2 when admin chooses severity (editable + bidirectional)
// const CAT2_PREFILL_BY_SEVERITY: Record<
//   SeverityLevel,
//   { news2: number; points: number }
// > = {
//   GREEN: { news2: 0, points: 0 },
//   AMBER: { news2: 2, points: 30 },
//   RED: { news2: 3, points: 100 },
// };

// // ------------------ API helpers ------------------
// async function apiGet<T>(url: string, accessToken: string): Promise<T> {
//   const res = await fetch(url, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//     cache: "no-store",
//   });
//   const body = await res.json().catch(() => null);
//   if (!res.ok)
//     throw new Error(body?.detail || body?.message || "Request failed");
//   return body as T;
// }

// async function apiPut<T>(
//   url: string,
//   accessToken: string,
//   body: any,
// ): Promise<T> {
//   const res = await fetch(url, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok)
//     throw new Error(data?.detail || data?.message || "Request failed");
//   return data as T;
// }

// // ------------------ UI helpers ------------------
// const SEVERITY_ORDER: Record<SeverityLevel, number> = {
//   GREEN: 1,
//   AMBER: 2,
//   RED: 3,
// };
// function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
//   return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
// }

// function clinicalAlertFromScore(totalPoints: number): SeverityLevel {
//   if (totalPoints >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
//   if (totalPoints >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";
//   return "GREEN";
// }

// // ✅ Bidirectional: Scores -> Severity (for BOTH categories)
// function severityFromScores(points: number, news2: number): SeverityLevel {
//   const p = Number.isFinite(points) ? points : 0;
//   if (p >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
//   if (p >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";

//   const n = Number.isFinite(news2) ? news2 : 0;
//   if (n >= 3) return "AMBER";
//   return "GREEN";
// }

// function alertRowClass(sev: SeverityLevel | null) {
//   const s: SeverityLevel = (sev || "RED") as SeverityLevel;

//   if (s === "RED") return "bg-red-50 hover:bg-red-100 border-b border-red-200";
//   if (s === "AMBER")
//     return "bg-amber-50 hover:bg-amber-100 border-b border-amber-200";
//   return "bg-emerald-50 hover:bg-emerald-100 border-b border-emerald-200";
// }

// function alertAccentLeftClass(sev: SeverityLevel | null) {
//   const s: SeverityLevel = (sev || "RED") as SeverityLevel;
//   if (s === "RED") return "border-l-4 border-red-500";
//   if (s === "AMBER") return "border-l-4 border-amber-500";
//   return "border-l-4 border-emerald-500";
// }

// function badgeColorClass() {
//   return "bg-teal-600 text-white";
// }

// const BTN_PRIMARY =
//   "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// const BTN_OUTLINE =
//   "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
// const BTN_DANGER =
//   "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// // Clean input/select styling
// const INPUT_SM =
//   "px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
// const SELECT_SM = INPUT_SM;

// // ✅ Stronger separation styles
// const NODE_ROW = "border-b border-gray-200 bg-white";
// const OPTION_ROW = "border-b border-emerald-200 bg-emerald-50/70";

// type ValidationItem = {
//   level: "ERROR" | "WARNING";
//   title: string;
//   where: string;
//   howToFix: string;
// };

// type ValidationState = {
//   ran: boolean;
//   valid: boolean;
//   items: ValidationItem[];
// };

// type PreviewState = {
//   open: boolean;
//   currentKey: string | "END";
//   history: string[];
//   answers: Record<string, string>;
//   selectedOptionValueByNode: Record<string, string>;

//   // ✅ NEW: let preview run Cat1 then Cat2
//   categoryIndex: number;
// };

// // =========================
// // ✅ GRAPH: Custom Node
// // =========================
// type GraphNodeData = {
//   title: string;
//   subtitle: string;
//   kind: FlowNodeType | "END" | "CAT_HEADER";
//   severity: SeverityLevel;
//   category: Category;
//   optionPorts?: { id: string; label: string; severity: SeverityLevel }[];
// };

// function severityBadgeClasses(sev: SeverityLevel) {
//   if (sev === "RED") return "bg-red-50 text-red-700 border-red-200";
//   if (sev === "AMBER") return "bg-amber-50 text-amber-800 border-amber-200";
//   return "bg-emerald-50 text-emerald-700 border-emerald-200";
// }

// function edgeStrokeBySeverity(sev: SeverityLevel) {
//   if (sev === "RED") return "#ef4444"; // red-500
//   if (sev === "AMBER") return "#f59e0b"; // amber-500
//   return "#10b981"; // emerald-500
// }

// const FlowGraphNode = memo(function FlowGraphNode({
//   data,
// }: {
//   data: GraphNodeData;
// }) {
//   const isEnd = data.kind === "END";
//   const isHeader = data.kind === "CAT_HEADER";

//   if (isHeader) {
//     return (
//       <div className="px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 shadow-sm min-w-[340px]">
//         <div className="text-sm font-semibold text-teal-900">
//           {CATEGORY_LABEL[data.category]}
//         </div>
//         <div className="text-xs text-teal-700 mt-1">
//           Category lane (read-only graph)
//         </div>
//         <Handle
//           type="target"
//           position={Position.Top}
//           className="!bg-teal-500 !w-3 !h-3"
//         />
//         <Handle
//           type="source"
//           position={Position.Bottom}
//           className="!bg-teal-500 !w-3 !h-3"
//         />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`bg-white rounded-2xl shadow-sm border min-w-[360px] ${
//         isEnd ? "border-emerald-200" : "border-gray-200"
//       }`}
//     >
//       {/* Top bar */}
//       <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span className="text-xs font-semibold px-2 py-1 rounded-full border border-teal-200 text-teal-700 bg-teal-50">
//             {isEnd ? "END" : data.kind}
//           </span>
//           <span
//             className={`text-xs font-semibold px-2 py-1 rounded-full border ${severityBadgeClasses(
//               data.severity,
//             )}`}
//           >
//             {data.severity}
//           </span>
//         </div>
//         <span className="text-[11px] text-gray-500">
//           {CATEGORY_LABEL[data.category]}
//         </span>
//       </div>

//       {/* Body */}
//       <div className="px-4 py-3">
//         <div className="text-base font-semibold text-gray-900">
//           {data.title}
//         </div>
//         <div className="text-xs text-gray-500 mt-1">{data.subtitle}</div>
//       </div>

//       {/* Handles */}
//       <Handle
//         type="target"
//         position={Position.Top}
//         className="!bg-teal-500 !w-3 !h-3"
//       />

//       {/* Multi-source handles (one per option) */}
//       {data.kind === "QUESTION" && (data.optionPorts?.length || 0) > 0 ? (
//         <div className="relative h-8">
//           {data.optionPorts!.map((p, idx) => {
//             const count = data.optionPorts!.length;
//             const pct = count === 1 ? 50 : 8 + (idx / (count - 1)) * 84;
//             return (
//               <Handle
//                 key={p.id}
//                 id={p.id}
//                 type="source"
//                 position={Position.Bottom}
//                 style={{ left: `${pct}%` }}
//                 className="!bg-teal-500 !w-3 !h-3"
//               />
//             );
//           })}
//         </div>
//       ) : isEnd ? null : (
//         <Handle
//           type="source"
//           position={Position.Bottom}
//           className="!bg-teal-500 !w-3 !h-3"
//         />
//       )}
//     </div>
//   );
// });

// const nodeTypes = { flowNode: FlowGraphNode };

// // =========================
// // ✅ GRAPH: Layout helpers
// // =========================
// const GRAPH_NODE_W = 380;
// const GRAPH_NODE_H = 130;

// function layoutWithDagre(
//   nodes: Node[],
//   edges: Edge[],
//   opts?: { ranksep?: number; nodesep?: number },
// ) {
//   const g = new dagre.graphlib.Graph();
//   g.setDefaultEdgeLabel(() => ({}));

//   g.setGraph({
//     rankdir: "TB",
//     ranksep: opts?.ranksep ?? 140,
//     nodesep: opts?.nodesep ?? 80,
//     edgesep: 10,
//     marginx: 40,
//     marginy: 40,
//   });

//   nodes.forEach((n) =>
//     g.setNode(n.id, { width: GRAPH_NODE_W, height: GRAPH_NODE_H }),
//   );
//   edges.forEach((e) => g.setEdge(e.source, e.target));

//   dagre.layout(g);

//   const laidOut = nodes.map((n) => {
//     const pos = g.node(n.id);
//     return {
//       ...n,
//       position: { x: pos.x - GRAPH_NODE_W / 2, y: pos.y - GRAPH_NODE_H / 2 },
//     };
//   });

//   return { nodes: laidOut, edges };
// }

// // =========================
// // Page
// // =========================
// export default function QuestionManagementPage() {
//   const router = useRouter();
//   const params = useParams<{ flowId: string }>();
//   const flowId = Number(params.flowId);

//   const [viewMode, setViewMode] = useState<"table" | "graph">("table");

//   const token = useMemo(
//     () =>
//       typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null,
//     [],
//   );

//   const [loading, setLoading] = useState(true);
//   const [flow, setFlow] = useState<Flow | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [saving, setSaving] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [seedingDemo, setSeedingDemo] = useState(false);

//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
//   const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

//   const [collapsedCategories, setCollapsedCategories] = useState<
//     Record<Category, boolean>
//   >({
//     1: false,
//     2: false,
//   });

//   const [validation, setValidation] = useState<ValidationState>({
//     ran: false,
//     valid: false,
//     items: [],
//   });

//   const [preview, setPreview] = useState<PreviewState>({
//     open: false,
//     currentKey: "END",
//     history: [],
//     answers: {},
//     selectedOptionValueByNode: {},
//     categoryIndex: 0,
//   });

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
//     if (!token) {
//       router.replace("/login");
//       return;
//     }
//     if (!Number.isFinite(flowId) || flowId <= 0) {
//       setError("Invalid flowId in route");
//       setLoading(false);
//       return;
//     }
//     loadFlow();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, flowId]);

//   function pickFirstRootNodeKeyAnyCategory(nodes: FlowNodeT[]): string | null {
//     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
//       const root = nodes.find((n) => n.category === cat && !n.parent_node_key);
//       if (root) return root.node_key;
//     }
//     return nodes[0]?.node_key ?? null;
//   }

//   async function loadFlow() {
//     if (!token) return;
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

//       const fixed: Flow = {
//         ...data,
//         nodes: (data.nodes || []).map((n) =>
//           n.node_type === "ALERT" && !n.alert_severity
//             ? { ...n, alert_severity: "RED" }
//             : n,
//         ),
//       };

//       if (RULES.AUTO_FIX_START_NODE) {
//         const keys = new Set(fixed.nodes.map((n) => n.node_key));
//         if (!fixed.start_node_key || !keys.has(fixed.start_node_key)) {
//           fixed.start_node_key =
//             pickFirstRootNodeKeyAnyCategory(fixed.nodes) ?? "END";
//         }
//       }

//       setFlow(fixed);
//       setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
//       setHasUnsavedChanges(false);
//       setValidation({ ran: false, valid: false, items: [] });
//     } catch (e: any) {
//       setError(e?.message || "Failed to load flow");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function saveFlow() {
//     if (!token || !flow) return;

//     if (!validation.ran || !validation.valid) {
//       alert("Please validate the questionnaire before saving.");
//       return;
//     }
//     if (!hasUnsavedChanges) {
//       alert("No changes to save.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError(null);

//       const payload = {
//         name: flow.name,
//         description: flow.description,
//         flow_type: flow.flow_type,
//         status: flow.status,
//         start_node_key: flow.start_node_key,
//         nodes: flow.nodes,
//       };

//       const data = await apiPut<any>(
//         `${API_BASE}/flows/${flow.id}`,
//         token,
//         payload,
//       );
//       await loadFlow();
//       setHasUnsavedChanges(false);
//       alert(`Saved! Version: ${data.version ?? "?"}`);
//     } catch (e: any) {
//       setError(e?.message || "Failed to save flow");
//       alert("Failed to save: " + (e?.message || "Unknown error"));
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function seedDemoQuestionsFromExcel() {
//     if (!token) return;

//     const ok = confirm(
//       "This will overwrite ALL questions/options for this questionnaire using the Excel demo fixture.\n\nContinue?",
//     );
//     if (!ok) return;

//     try {
//       setSeedingDemo(true);
//       setError(null);

//       const res = await fetch(
//         `${API_BASE}/flows/${flowId}/seed-demo-from-excel`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const data = await res.json().catch(() => null);
//       if (!res.ok) {
//         throw new Error(
//           data?.detail?.errors?.join?.("\n") ||
//             data?.detail ||
//             "Seeding failed",
//         );
//       }

//       // Reload fresh from DB
//       await loadFlow();

//       alert(
//         `Seeded demo questionnaire! Nodes: ${data?.node_count ?? "?"}, Version: ${data?.version ?? "?"}`,
//       );
//     } catch (e: any) {
//       setError(e?.message || "Seeding failed");
//       alert("Seeding failed: " + (e?.message || "Unknown error"));
//     } finally {
//       setSeedingDemo(false);
//     }
//   }

//   // ------------------ helpers: indexes/maps ------------------
//   function nodeMap(): Map<string, FlowNodeT> {
//     return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
//   }

//   function childrenMap(): Map<string, FlowNodeT[]> {
//     const map = new Map<string, FlowNodeT[]>();
//     for (const n of flow?.nodes || []) {
//       if (!n.parent_node_key) continue;
//       const arr = map.get(n.parent_node_key) || [];
//       arr.push(n);
//       map.set(n.parent_node_key, arr);
//     }
//     return map;
//   }

//   function hasChildren(nodeKey: string): boolean {
//     if (!flow) return false;
//     return flow.nodes.some((n) => n.parent_node_key === nodeKey);
//   }

//   function toggleNode(nodeKey: string) {
//     setExpandedNodes((prev) => {
//       const next = new Set(prev);
//       next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
//       return next;
//     });
//   }

//   function expandAllNodes() {
//     if (!flow) return;
//     setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
//   }
//   function collapseAllNodes() {
//     setExpandedNodes(new Set());
//   }

//   function getVisibleNodesByCategory(category: Category): FlowNodeT[] {
//     if (!flow) return [];
//     const nm = nodeMap();
//     function shouldShow(node: FlowNodeT): boolean {
//       if (node.category !== category) return false;
//       if (!node.parent_node_key) return true;
//       const parent = nm.get(node.parent_node_key);
//       if (!parent) return true;
//       if (parent.category !== category) return false;
//       return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
//     }
//     return flow.nodes.filter(shouldShow);
//   }

//   function getCategorySequenceNumber(nodeKey: string): number {
//     if (!flow) return 0;
//     const n = flow.nodes.find((x) => x.node_key === nodeKey);
//     if (!n) return 0;
//     const sameCat = flow.nodes.filter((x) => x.category === n.category);
//     const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
//     return idx >= 0 ? idx + 1 : 0;
//   }

//   function getAvailableNextNodes(
//     category: Category,
//   ): Array<{ key: string; label: string }> {
//     const base = [
//       { key: "", label: "-- Select Next --" },
//       { key: "END", label: "END - Complete Flow" },
//     ];
//     if (!flow) return base;

//     const sameCategory = flow.nodes.filter((n) => n.category === category);
//     return [
//       ...base,
//       ...sameCategory.map((node) => ({
//         key: node.node_key,
//         label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
//       })),
//     ];
//   }

//   // ------------------ state update utilities ------------------
//   function markChanged() {
//     setHasUnsavedChanges(true);
//     setValidation({ ran: false, valid: false, items: [] });
//   }

//   function makeDefaultOptions(category: Category): FlowOption[] {
//     const baseSeverity: SeverityLevel = "GREEN";
//     const prefill =
//       category === 1
//         ? CAT1_PREFILL_BY_SEVERITY[baseSeverity]
//         : CAT2_PREFILL_BY_SEVERITY[baseSeverity];

//     return [
//       {
//         display_order: 1,
//         label: "Option 1",
//         value: "opt1",
//         severity: baseSeverity,
//         news2_score: prefill.news2,
//         seriousness_points: prefill.points,
//         next_node_key: null,
//       },
//       {
//         display_order: 2,
//         label: "Option 2",
//         value: "opt2",
//         severity: baseSeverity,
//         news2_score: prefill.news2,
//         seriousness_points: prefill.points,
//         next_node_key: null,
//       },
//     ];
//   }

//   function updateNode(nodeKey: string, updates: Partial<FlowNodeT>) {
//     if (!flow) return;

//     setFlow((prev) => {
//       if (!prev) return prev;

//       const updatedNodes = prev.nodes.map((n) => {
//         if (n.node_key !== nodeKey) return n;

//         if (updates.node_type === "ALERT") {
//           return {
//             ...n,
//             ...updates,
//             options: [],
//             alert_severity: (updates.alert_severity ??
//               n.alert_severity ??
//               "RED") as SeverityLevel,
//           };
//         }

//         if (updates.node_type === "MESSAGE") {
//           return {
//             ...n,
//             ...updates,
//             options: [],
//             alert_severity: null,
//           };
//         }

//         if (updates.node_type === "QUESTION") {
//           const options =
//             n.options?.length >= 2 ? n.options : makeDefaultOptions(n.category);
//           return { ...n, ...updates, options };
//         }

//         return { ...n, ...updates };
//       });

//       return { ...prev, nodes: updatedNodes };
//     });

//     markChanged();
//   }

//   function updateOption(
//     nodeKey: string,
//     optionIdx: number,
//     updates: Partial<FlowOption>,
//   ) {
//     if (!flow) return;

//     setFlow((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         nodes: prev.nodes.map((n) => {
//           if (n.node_key !== nodeKey) return n;
//           const options = [...(n.options || [])];
//           options[optionIdx] = { ...options[optionIdx], ...updates };
//           return { ...n, options };
//         }),
//       };
//     });

//     markChanged();
//   }

//   function addOption(nodeKey: string) {
//     if (!flow) return;
//     setFlow((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         nodes: prev.nodes.map((n) => {
//           if (n.node_key !== nodeKey) return n;
//           const nextIndex = (n.options?.length || 0) + 1;

//           const baseSeverity: SeverityLevel = "GREEN";
//           const prefill =
//             n.category === 1
//               ? CAT1_PREFILL_BY_SEVERITY[baseSeverity]
//               : CAT2_PREFILL_BY_SEVERITY[baseSeverity];

//           return {
//             ...n,
//             options: [
//               ...(n.options || []),
//               {
//                 display_order: nextIndex,
//                 label: `Option ${nextIndex}`,
//                 value: `opt_${nextIndex}`,
//                 severity: baseSeverity,
//                 news2_score: prefill.news2,
//                 seriousness_points: prefill.points,
//                 next_node_key: null,
//               },
//             ],
//           };
//         }),
//       };
//     });
//     markChanged();
//   }

//   function removeOption(nodeKey: string, optionIdx: number) {
//     if (!flow) return;
//     setFlow((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         nodes: prev.nodes.map((n) => {
//           if (n.node_key !== nodeKey) return n;
//           if ((n.options?.length || 0) <= 2) return n;
//           const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
//           const resequenced = filtered.map((o, i) => ({
//             ...o,
//             display_order: i + 1,
//           }));
//           return { ...n, options: resequenced };
//         }),
//       };
//     });
//     markChanged();
//   }

//   function addNode(category: Category, parentKey: string | null = null) {
//     if (!flow) return;

//     const siblingsCount = flow.nodes.filter(
//       (n) => n.parent_node_key === parentKey && n.category === category,
//     ).length;

//     const newKey = parentKey
//       ? `${parentKey}.${siblingsCount + 1}`
//       : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

//     const newNode: FlowNodeT = {
//       node_key: newKey,
//       node_type: "QUESTION",
//       category,
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
//       options: makeDefaultOptions(category),
//     };

//     setFlow((prev) =>
//       prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
//     );
//     setExpandedNodes((prev) => new Set([...prev, newKey]));
//     markChanged();
//   }

//   // ------------------ delete node (cascade descendants + clear references) ------------------
//   function collectDescendants(rootKey: string): Set<string> {
//     const cm = childrenMap();
//     const toDelete = new Set<string>();
//     const stack = [rootKey];
//     while (stack.length) {
//       const k = stack.pop()!;
//       if (toDelete.has(k)) continue;
//       toDelete.add(k);
//       const kids = cm.get(k) || [];
//       for (const child of kids) stack.push(child.node_key);
//     }
//     return toDelete;
//   }

//   function deleteNodeCascade(nodeKey: string) {
//     if (!flow) return;
//     const toDelete = collectDescendants(nodeKey);

//     setFlow((prev) => {
//       if (!prev) return prev;

//       const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

//       const cleaned = remaining.map((n) => {
//         if (n.node_type !== "QUESTION") return n;

//         const newOptions = (n.options || []).map((o) => {
//           if (o.next_node_key && toDelete.has(o.next_node_key)) {
//             return { ...o, next_node_key: null };
//           }
//           return o;
//         });

//         const newParent =
//           n.parent_node_key && toDelete.has(n.parent_node_key)
//             ? null
//             : n.parent_node_key;

//         return { ...n, parent_node_key: newParent, options: newOptions };
//       });

//       return { ...prev, nodes: cleaned };
//     });

//     if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);
//     markChanged();
//   }

//   // ------------------ FRONTEND VALIDATION ------------------
//   function validateFrontend(): ValidationState {
//     if (!flow)
//       return {
//         ran: true,
//         valid: false,
//         items: [
//           {
//             level: "ERROR",
//             title: "Flow not loaded",
//             where: "Flow",
//             howToFix: "Reload the page and try again.",
//           },
//         ],
//       };

//     const items: ValidationItem[] = [];
//     const nm = nodeMap();
//     const keys = new Set([...nm.keys()]);
//     const allowedCats = new Set<number>([1, 2]);

//     if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
//       items.push({
//         level: "ERROR",
//         title: "Start node is missing or invalid",
//         where: `Start Node: ${flow.start_node_key || "(empty)"}`,
//         howToFix: `Set start_node_key to an existing node key (usually the first question).`,
//       });
//     }

//     const seen = new Set<string>();
//     for (const n of flow.nodes) {
//       if (seen.has(n.node_key)) {
//         items.push({
//           level: "ERROR",
//           title: "Duplicate node key found",
//           where: `Node Key: ${n.node_key}`,
//           howToFix: "Ensure every node has a unique node_key.",
//         });
//       }
//       seen.add(n.node_key);
//     }

//     for (const n of flow.nodes) {
//       if (!allowedCats.has(n.category)) {
//         items.push({
//           level: "ERROR",
//           title: "Invalid category",
//           where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
//           howToFix: "Category must be either 1 or 2.",
//         });
//       }

//       if (n.parent_node_key) {
//         const parent = nm.get(n.parent_node_key);
//         if (!parent) {
//           items.push({
//             level: "ERROR",
//             title: "Parent node not found",
//             where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
//             howToFix:
//               "Either fix parent_node_key or delete/recreate this node under a valid parent.",
//           });
//         } else if (parent.category !== n.category) {
//           items.push({
//             level: "ERROR",
//             title: "Category mismatch between parent and child",
//             where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
//             howToFix: `Move the node under a parent in the same category.`,
//           });
//         }
//       }
//     }

//     for (const node of flow.nodes) {
//       const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

//       if (node.node_type === "QUESTION") {
//         if (!node.options || node.options.length < 2) {
//           items.push({
//             level: "ERROR",
//             title: "Question must have at least 2 options",
//             where: whereNode,
//             howToFix: "Add more options until there are at least 2.",
//           });
//         }

//         for (const opt of node.options || []) {
//           const whereOpt = `${whereNode} → Option "${opt.label}"`;

//           if (!opt.label || !opt.label.trim()) {
//             items.push({
//               level: "ERROR",
//               title: "Option label is empty",
//               where: whereOpt,
//               howToFix: "Give this option a meaningful label (e.g., Yes / No).",
//             });
//           }

//           if (!opt.next_node_key) {
//             items.push({
//               level: "ERROR",
//               title: "Option next step is missing",
//               where: whereOpt,
//               howToFix: `Select a Next node for this option (or choose END).`,
//             });
//           } else if (opt.next_node_key !== "END") {
//             const dst = nm.get(opt.next_node_key);
//             if (!dst) {
//               items.push({
//                 level: "ERROR",
//                 title: "Option points to a node that does not exist",
//                 where: whereOpt,
//                 howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
//               });
//             } else if (dst.category !== node.category) {
//               items.push({
//                 level: "ERROR",
//                 title: "Option next node must be in the same category",
//                 where: `${whereOpt} → Next "${dst.node_key}"`,
//                 howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
//               });
//             }
//           }
//         }
//       }

//       if (node.node_type === "MESSAGE") {
//         if (node.options && node.options.length > 0) {
//           items.push({
//             level: "ERROR",
//             title: "Message must not have options",
//             where: whereNode,
//             howToFix: "Change node type to QUESTION if you need options.",
//           });
//         }
//       }

//       if (node.node_type === "ALERT") {
//         if (!node.alert_severity) {
//           items.push({
//             level: "ERROR",
//             title: "Alert severity is missing",
//             where: whereNode,
//             howToFix: "Select Green / Amber / Red for this Alert.",
//           });
//         }
//         if (node.options && node.options.length > 0) {
//           items.push({
//             level: "ERROR",
//             title: "Alert must not have options",
//             where: whereNode,
//             howToFix:
//               "Alerts are end nodes. Remove options or change type to QUESTION.",
//           });
//         }
//       }
//     }

//     // ✅ Cycle detection for BOTH categories (not only start_node_key)
//     const graph = new Map<string, string[]>();
//     function addEdge(src: string, dst: string | null) {
//       if (!dst) return;
//       graph.set(src, [...(graph.get(src) || []), dst]);
//     }
//     for (const n of flow.nodes) {
//       if (n.node_type === "QUESTION") {
//         for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
//       }
//     }

//     const visited = new Set<string>();
//     const stack = new Set<string>();
//     function dfs(u: string): boolean {
//       if (u === "END") return false;
//       if (stack.has(u)) return true;
//       if (visited.has(u)) return false;
//       visited.add(u);
//       stack.add(u);
//       for (const v of graph.get(u) || []) {
//         if (v && dfs(v)) return true;
//       }
//       stack.delete(u);
//       return false;
//     }

//     function getRoots(cat: Category) {
//       return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
//     }

//     const startKeysToCheck = new Set<string>();
//     if (flow.start_node_key && keys.has(flow.start_node_key)) {
//       startKeysToCheck.add(flow.start_node_key);
//     }
//     for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
//       for (const r of getRoots(cat)) startKeysToCheck.add(r.node_key);
//     }

//     for (const startKey of startKeysToCheck) {
//       stack.clear();
//       if (dfs(startKey)) {
//         items.push({
//           level: "ERROR",
//           title: "Flow contains a cycle (loop)",
//           where: `Path from ${startKey}`,
//           howToFix: "Break the loop by changing an option's Next to END.",
//         });
//         break;
//       }
//     }

//     const valid = items.filter((x) => x.level === "ERROR").length === 0;
//     return { ran: true, valid, items };
//   }

//   function onValidateClick() {
//     const result = validateFrontend();
//     setValidation(result);
//     if (!result.valid) window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   // ------------------ PREVIEW (Cat1 then Cat2) ------------------
//   function getCategoryRoots(cat: Category): FlowNodeT[] {
//     if (!flow) return [];
//     return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
//   }

//   function orderedCategoriesPresent(): Category[] {
//     if (!flow) return [1, 2];
//     const present = new Set<Category>(flow.nodes.map((n) => n.category));
//     return RULES.START_NODE_CATEGORY_PRIORITY.filter((c) => present.has(c));
//   }

//   function pickCategoryStart(cat: Category): string | "END" {
//     const roots = getCategoryRoots(cat);
//     return roots[0]?.node_key ?? "END";
//   }

//   function openPreview() {
//     if (!flow) return;

//     const nm = nodeMap();
//     const cats = orderedCategoriesPresent();

//     const start =
//       flow.start_node_key && nm.has(flow.start_node_key)
//         ? flow.start_node_key
//         : (pickCategoryStart(cats[0]) ?? "END");

//     const startNode = start !== "END" ? nm.get(start) : null;
//     const startCat = startNode?.category ?? cats[0];
//     const catIndex = Math.max(0, cats.indexOf(startCat));

//     setPreview({
//       open: true,
//       currentKey: start,
//       history: [],
//       answers: {},
//       selectedOptionValueByNode: {},
//       categoryIndex: catIndex,
//     });
//   }

//   function closePreview() {
//     setPreview((p) => ({ ...p, open: false }));
//   }

//   function previewCurrentNode(): FlowNodeT | null {
//     if (!flow) return null;
//     if (!preview.open) return null;
//     if (preview.currentKey === "END") return null;
//     return nodeMap().get(preview.currentKey) || null;
//   }

//   function previewSelectOption(nodeKey: string, opt: FlowOption) {
//     setPreview((p) => ({
//       ...p,
//       answers: { ...p.answers, [nodeKey]: opt.label },
//       selectedOptionValueByNode: {
//         ...p.selectedOptionValueByNode,
//         [nodeKey]: opt.value,
//       },
//     }));
//   }

//   function goToNextCategoryOrFinish(currentCategory: Category) {
//     const cats = orderedCategoriesPresent();
//     const idx = Math.max(0, cats.indexOf(currentCategory));
//     const nextIdx = idx + 1;
//     if (nextIdx >= cats.length) {
//       setPreview((p) => ({ ...p, currentKey: "END", categoryIndex: idx }));
//       return;
//     }
//     const nextCat = cats[nextIdx];
//     const nextStart = pickCategoryStart(nextCat);
//     setPreview((p) => ({
//       ...p,
//       currentKey: nextStart,
//       categoryIndex: nextIdx,
//     }));
//   }

//   function previewNext() {
//     if (!flow) return;
//     const current = previewCurrentNode();
//     if (!current) return;

//     if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
//       setPreview((p) => ({ ...p, history: [...p.history, current.node_key] }));
//       goToNextCategoryOrFinish(current.category);
//       return;
//     }

//     if (current.node_type === "QUESTION") {
//       const selectedValue = preview.selectedOptionValueByNode[current.node_key];
//       const opt = (current.options || []).find(
//         (o) => o.value === selectedValue,
//       );

//       if (!opt) {
//         alert("Please select an answer.");
//         return;
//       }

//       const nextKey = opt.next_node_key || "END";

//       setPreview((p) => ({
//         ...p,
//         history: [...p.history, current.node_key],
//       }));

//       if (nextKey === "END") {
//         goToNextCategoryOrFinish(current.category);
//         return;
//       }

//       setPreview((p) => ({
//         ...p,
//         currentKey: nextKey as any,
//       }));
//       return;
//     }
//   }

//   function previewBack() {
//     setPreview((p) => {
//       const hist = [...p.history];
//       const prevKey = hist.pop();
//       if (!prevKey) return p;
//       return { ...p, history: hist, currentKey: prevKey };
//     });
//   }

//   function previewRestart() {
//     openPreview();
//   }

//   // ✅ Score alert logic only for answer options (unchanged intent; Cat2 now also score-capable)
//   function computePreviewResults() {
//     if (!flow) {
//       return {
//         cat1: {
//           totalNews2: 0,
//           totalPoints: 0,
//           alert: "GREEN" as SeverityLevel,
//         },
//         cat2: {
//           totalNews2: 0,
//           totalPoints: 0,
//           alert: "GREEN" as SeverityLevel,
//         },
//         finalAlert: "GREEN" as SeverityLevel,
//       };
//     }

//     const nm = nodeMap();
//     let cat1News2 = 0;
//     let cat1Points = 0;
//     let cat2News2 = 0;
//     let cat2Points = 0;

//     let cat1AlertNodeSeverity: SeverityLevel | null = null;
//     let cat2AlertNodeSeverity: SeverityLevel | null = null;

//     for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
//       const node = nm.get(nodeKey);
//       if (!node || node.node_type !== "QUESTION") continue;

//       const selectedValue = preview.selectedOptionValueByNode[nodeKey];
//       const opt = (node.options || []).find((o) => o.value === selectedValue);
//       if (!opt) continue;

//       if (node.category === 1) {
//         cat1News2 += Number(opt.news2_score || 0);
//         cat1Points += Number(opt.seriousness_points || 0);
//       } else {
//         cat2News2 += Number(opt.news2_score || 0);
//         cat2Points += Number(opt.seriousness_points || 0);
//       }
//     }

//     const current = previewCurrentNode();
//     if (current?.node_type === "ALERT" && current.alert_severity) {
//       if (current.category === 1)
//         cat1AlertNodeSeverity = current.alert_severity;
//       if (current.category === 2)
//         cat2AlertNodeSeverity = current.alert_severity;
//     }

//     let cat1Alert = clinicalAlertFromScore(cat1Points);
//     if (cat1AlertNodeSeverity)
//       cat1Alert = maxSeverity(cat1Alert, cat1AlertNodeSeverity);

//     let cat2Alert = severityFromScores(cat2Points, cat2News2);
//     if (cat2AlertNodeSeverity)
//       cat2Alert = maxSeverity(cat2Alert, cat2AlertNodeSeverity);

//     const finalAlert = maxSeverity(cat1Alert, cat2Alert);

//     return {
//       cat1: {
//         totalNews2: cat1News2,
//         totalPoints: cat1Points,
//         alert: cat1Alert,
//       },
//       cat2: {
//         totalNews2: cat2News2,
//         totalPoints: cat2Points,
//         alert: cat2Alert,
//       },
//       finalAlert,
//     };
//   }

//   // ------------------ GRAPH BUILD (true tree + 2 category lanes) ------------------
//   function buildGraphElements(): { nodes: Node[]; edges: Edge[] } {
//     if (!flow) return { nodes: [], edges: [] };

//     const nm = nodeMap();

//     const endIds: Record<Category, string> = {
//       1: "END:1",
//       2: "END:2",
//     };

//     const cats = orderedCategoriesPresent();

//     const allNodes: Node[] = [];
//     const allEdges: Edge[] = [];

//     cats.forEach((cat, laneIndex) => {
//       const laneNodes: Node[] = [];
//       const laneEdges: Edge[] = [];

//       const headerId = `CAT:${cat}`;
//       laneNodes.push({
//         id: headerId,
//         type: "flowNode",
//         data: {
//           title: CATEGORY_LABEL[cat],
//           subtitle: "Tree graph lane",
//           kind: "CAT_HEADER",
//           severity: "GREEN",
//           category: cat,
//         } satisfies GraphNodeData,
//         position: { x: 0, y: 0 },
//       });

//       laneNodes.push({
//         id: endIds[cat],
//         type: "flowNode",
//         data: {
//           title: "Complete Flow",
//           subtitle: "END node",
//           kind: "END",
//           severity: "GREEN",
//           category: cat,
//         } satisfies GraphNodeData,
//         position: { x: 0, y: 0 },
//       });

//       const nodesInCat = flow.nodes.filter((n) => n.category === cat);
//       for (const n of nodesInCat) {
//         let sev: SeverityLevel = "GREEN";
//         if (n.node_type === "ALERT")
//           sev = (n.alert_severity || "RED") as SeverityLevel;
//         if (n.node_type === "QUESTION") {
//           for (const o of n.options || [])
//             sev = maxSeverity(sev, o.severity || "GREEN");
//         }

//         const optionPorts =
//           n.node_type === "QUESTION"
//             ? (n.options || []).map((o) => ({
//                 id: `opt:${o.value}`,
//                 label: o.label,
//                 severity: o.severity || "GREEN",
//               }))
//             : [];

//         laneNodes.push({
//           id: n.node_key,
//           type: "flowNode",
//           data: {
//             title: n.body_text,
//             subtitle: `${n.node_type} • key ${n.node_key}`,
//             kind: n.node_type,
//             severity: sev,
//             category: cat,
//             optionPorts,
//           } satisfies GraphNodeData,
//           position: { x: 0, y: 0 },
//         });
//       }

//       const roots = nodesInCat.filter((n) => !n.parent_node_key);
//       for (const r of roots) {
//         laneEdges.push({
//           id: `e:${headerId}->${r.node_key}`,
//           source: headerId,
//           target: r.node_key,
//           type: "smoothstep",
//           markerEnd: { type: MarkerType.ArrowClosed },
//           style: { strokeWidth: 2, stroke: "#0f766e" },
//         });
//       }

//       for (const n of nodesInCat) {
//         if (n.node_type !== "QUESTION") continue;

//         for (const o of n.options || []) {
//           const rawTarget = o.next_node_key || "END";

//           const targetId =
//             rawTarget === "END"
//               ? endIds[cat]
//               : nm.has(rawTarget)
//                 ? rawTarget
//                 : null;

//           if (!targetId) continue;

//           const edgeId = `e:${n.node_key}:${o.value}:${targetId}`;

//           const sev = o.severity || "GREEN";

//           laneEdges.push({
//             id: edgeId,
//             source: n.node_key,
//             target: targetId,
//             sourceHandle: `opt:${o.value}`,
//             label: o.label,
//             type: "smoothstep",
//             markerEnd: { type: MarkerType.ArrowClosed },
//             style: { strokeWidth: 2, stroke: edgeStrokeBySeverity(sev) },
//             labelStyle: { fontSize: 12, fontWeight: 700, fill: "#111827" },
//           });
//         }
//       }

//       const laid = layoutWithDagre(laneNodes, laneEdges, {
//         ranksep: 150,
//         nodesep: 95,
//       });

//       const xOffset = laneIndex * 980;
//       const shiftedNodes = laid.nodes.map((n) => ({
//         ...n,
//         position: { x: n.position.x + xOffset, y: n.position.y },
//       }));

//       allNodes.push(...shiftedNodes);
//       allEdges.push(...laid.edges);
//     });

//     return { nodes: allNodes, edges: allEdges };
//   }

//   // ------------------ render guards ------------------
//   const visibleNodesCat1 = getVisibleNodesByCategory(1);
//   const visibleNodesCat2 = getVisibleNodesByCategory(2);

//   if (loading && !flow) {
//     return (
//       <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
//         <div className="text-gray-600">Loading questions...</div>
//       </div>
//     );
//   }

//   const currentPreviewNode = previewCurrentNode();
//   const results = computePreviewResults();
//   const graph = buildGraphElements();

//   // ✅ Sidebar removed: top header with back button (space gained)
//   return (
//     <div className="min-h-screen bg-[#f4f5fa]">
//       <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => router.push("/admin/questionnaires")}
//             className={BTN_OUTLINE}
//             title="Back to Questionnaires"
//           >
//             ← Questionnaires
//           </button>

//           <div className="h-6 w-px bg-gray-200" />

//           <div className="text-sm font-semibold text-gray-800">
//             Question Management
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={seedDemoQuestionsFromExcel}
//             disabled={seedingDemo || saving || loading}
//             className={BTN_OUTLINE}
//             title="Overwrite this questionnaire with demo questions/options from Excel"
//           >
//             🧪 {seedingDemo ? "Seeding..." : "Create Test Questions & Options"}
//           </button>

//           <button
//             onClick={() =>
//               setViewMode((v) => (v === "table" ? "graph" : "table"))
//             }
//             className={BTN_OUTLINE}
//             title="Toggle Table / Graph"
//           >
//             🧠 {viewMode === "table" ? "Graph View" : "Table View"}
//           </button>

//           <button onClick={openPreview} className={BTN_PRIMARY}>
//             👁 Preview
//           </button>

//           <button onClick={onValidateClick} className={BTN_PRIMARY}>
//             ✅ Validate
//           </button>

//           <button
//             onClick={saveFlow}
//             disabled={
//               saving ||
//               !hasUnsavedChanges ||
//               !validation.ran ||
//               !validation.valid
//             }
//             className={BTN_PRIMARY}
//             title={
//               !validation.ran
//                 ? "Validate before saving"
//                 : !validation.valid
//                   ? "Fix validation errors before saving"
//                   : !hasUnsavedChanges
//                     ? "No changes to save"
//                     : ""
//             }
//           >
//             💾 {saving ? "Saving..." : "Save"}
//           </button>

//           <button onClick={logout} className={BTN_OUTLINE} title="Logout">
//             Logout
//           </button>
//         </div>
//       </header>

//       {error && (
//         <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
//           <div className="text-red-700">
//             <strong>Error:</strong> {error}
//           </div>
//           <button
//             onClick={() => setError(null)}
//             className="text-red-700 hover:text-red-900 font-bold"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       <main className="p-6 overflow-auto">
//         {/* Page header */}
//         {flow && (
//           <div className="mb-4">
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Question Management
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               {flow.name} (Version {flow.version}){" "}
//               {validation.ran ? (
//                 validation.valid ? (
//                   <span className="ml-2 text-green-700 font-semibold">
//                     ● Valid
//                   </span>
//                 ) : (
//                   <span className="ml-2 text-red-700 font-semibold">
//                     ● Not valid
//                   </span>
//                 )
//               ) : (
//                 <span className="ml-2 text-gray-500 font-semibold">
//                   ● Not validated
//                 </span>
//               )}
//               {hasUnsavedChanges && (
//                 <span className="ml-2 text-amber-700 font-semibold">
//                   ● Unsaved changes
//                 </span>
//               )}
//             </p>
//           </div>
//         )}

//         {/* Validation results */}
//         {validation.ran && (
//           <div
//             className={`mb-6 rounded-lg border px-6 py-4 ${
//               validation.valid
//                 ? "bg-green-50 border-green-200"
//                 : "bg-red-50 border-red-200"
//             }`}
//           >
//             <div
//               className={`font-semibold ${
//                 validation.valid ? "text-green-900" : "text-red-900"
//               }`}
//             >
//               {validation.valid
//                 ? `Validation successful (0 errors, 0 warnings)`
//                 : `Validation failed (${
//                     validation.items.filter((x) => x.level === "ERROR").length
//                   } errors, ${
//                     validation.items.filter((x) => x.level === "WARNING").length
//                   } warnings)`}
//             </div>

//             {!validation.valid && (
//               <div className="mt-3 space-y-3">
//                 {validation.items.map((it, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-white/60 border border-red-200 rounded-lg p-4"
//                   >
//                     <div className="font-semibold text-red-900">{it.title}</div>
//                     <div className="text-sm text-red-900 mt-1">
//                       <strong>Where:</strong> {it.where}
//                     </div>
//                     <div className="text-sm text-red-900 mt-1">
//                       <strong>How to fix:</strong> {it.howToFix}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ✅ GRAPH VIEW */}
//         {flow && viewMode === "graph" && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
//               <div>
//                 <div className="text-lg font-semibold text-teal-900">
//                   Graph View (read-only)
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   True tree graph: every option is a separate branch (including
//                   END). Two lanes: Category 1 + Category 2.
//                 </div>
//               </div>
//               <div className="text-xs text-gray-500">
//                 Changes in table update graph automatically.
//               </div>
//             </div>

//             <div className="h-[72vh] bg-teal-50">
//               <ReactFlow
//                 nodes={graph.nodes}
//                 edges={graph.edges}
//                 nodeTypes={nodeTypes}
//                 fitView
//                 className="bg-teal-50"
//               >
//                 <MiniMap />
//                 <Controls />
//                 <Background />
//               </ReactFlow>
//             </div>
//           </div>
//         )}

//         {/* ✅ TABLE VIEW */}
//         {flow && viewMode === "table" && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-emerald-900">
//                 Question Flow Builder
//               </h2>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCollapsedCategories({ 1: false, 2: false })}
//                   className={BTN_OUTLINE}
//                 >
//                   Expand Categories
//                 </button>
//                 <button
//                   onClick={() => setCollapsedCategories({ 1: true, 2: true })}
//                   className={BTN_OUTLINE}
//                 >
//                   Collapse Categories
//                 </button>
//                 <button onClick={expandAllNodes} className={BTN_OUTLINE}>
//                   Expand All
//                 </button>
//                 <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
//                   Collapse All
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr className="border-b border-gray-200">
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12"></th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-24">
//                       Node
//                     </th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-44">
//                       Type
//                     </th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[320px]">
//                       Body Text
//                     </th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[560px]">
//                       Options / Settings
//                     </th>
//                     <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-56">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {([1, 2] as Category[]).map((cat) => {
//                     const collapsed = collapsedCategories[cat];
//                     const visibleNodes =
//                       cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

//                     return (
//                       <Fragment key={`cat-${cat}`}>
//                         <tr className="bg-emerald-100/60 border-b border-emerald-200">
//                           <td className="px-3 py-3" colSpan={6}>
//                             <div className="flex items-center justify-between">
//                               <button
//                                 onClick={() =>
//                                   setCollapsedCategories((p) => ({
//                                     ...p,
//                                     [cat]: !p[cat],
//                                   }))
//                                 }
//                                 className="flex items-center gap-2 text-sm font-semibold text-gray-800"
//                               >
//                                 <span className="inline-block w-5 text-center">
//                                   {collapsed ? "▶" : "▼"}
//                                 </span>
//                                 <span>{CATEGORY_LABEL[cat]}</span>
//                                 <span className="text-xs font-normal text-gray-500">
//                                   (
//                                   {
//                                     flow.nodes.filter((n) => n.category === cat)
//                                       .length
//                                   }{" "}
//                                   nodes)
//                                 </span>
//                               </button>

//                               <button
//                                 onClick={() => addNode(cat, null)}
//                                 className={BTN_OUTLINE}
//                               >
//                                 + Add Root Node
//                               </button>
//                             </div>
//                           </td>
//                         </tr>

//                         {!collapsed &&
//                           visibleNodes.map((node) => {
//                             const hasChild = hasChildren(node.node_key);
//                             const isExpanded = expandedNodes.has(node.node_key);

//                             // ✅ Fix indentation: keep node number aligned; indent only the arrow column
//                             const indent = Math.max(
//                               0,
//                               (node.depth_level - 1) * 18,
//                             );

//                             const isEditing = editingNodeKey === node.node_key;

//                             const isAlert = node.node_type === "ALERT";
//                             const rowClass = isAlert
//                               ? alertRowClass(node.alert_severity)
//                               : `${NODE_ROW} hover:bg-gray-50`;
//                             const leftAccent = isAlert
//                               ? alertAccentLeftClass(node.alert_severity)
//                               : "";

//                             return (
//                               <Fragment key={node.node_key}>
//                                 <tr className={`${rowClass} ${leftAccent}`}>
//                                   {/* <tr className={`${NODE_ROW} hover:bg-gray-50`}> */}
//                                   <td
//                                     className="px-3 py-2"
//                                     style={{ paddingLeft: `${12 + indent}px` }}
//                                   >
//                                     {hasChild && (
//                                       <button
//                                         onClick={() =>
//                                           toggleNode(node.node_key)
//                                         }
//                                         className="text-gray-600 hover:text-gray-900"
//                                       >
//                                         {isExpanded ? "▼" : "▶"}
//                                       </button>
//                                     )}
//                                   </td>

//                                   <td className="px-3 py-2">
//                                     <span
//                                       className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
//                                     >
//                                       {getCategorySequenceNumber(node.node_key)}
//                                     </span>
//                                   </td>

//                                   <td className="px-3 py-2">
//                                     <select
//                                       className={`${SELECT_SM} w-44`}
//                                       value={node.node_type}
//                                       onChange={(e) =>
//                                         updateNode(node.node_key, {
//                                           node_type: e.target
//                                             .value as FlowNodeType,
//                                         })
//                                       }
//                                     >
//                                       <option value="QUESTION">Question</option>
//                                       <option value="MESSAGE">Message</option>
//                                       <option value="ALERT">Alert</option>
//                                     </select>
//                                   </td>

//                                   <td className="px-3 py-2">
//                                     <input
//                                       className={`${INPUT_SM} w-full`}
//                                       value={node.body_text}
//                                       onChange={(e) =>
//                                         updateNode(node.node_key, {
//                                           body_text: e.target.value,
//                                         })
//                                       }
//                                       placeholder="Question or message..."
//                                     />
//                                   </td>

//                                   <td className="px-3 py-2">
//                                     {node.node_type === "QUESTION" ? (
//                                       <div className="text-xs text-gray-600 flex items-center gap-2">
//                                         <span>
//                                           {node.options?.length || 0} options
//                                         </span>
//                                         <button
//                                           onClick={() =>
//                                             setEditingNodeKey(
//                                               isEditing ? null : node.node_key,
//                                             )
//                                           }
//                                           className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs"
//                                         >
//                                           {isEditing ? "Hide" : "Edit"}
//                                         </button>
//                                       </div>
//                                     ) : node.node_type === "ALERT" ? (
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-xs text-gray-600">
//                                           Severity
//                                         </span>
//                                         <select
//                                           className={SELECT_SM}
//                                           value={node.alert_severity || "RED"}
//                                           onChange={(e) =>
//                                             updateNode(node.node_key, {
//                                               alert_severity: e.target
//                                                 .value as SeverityLevel,
//                                             })
//                                           }
//                                         >
//                                           <option value="GREEN">Green</option>
//                                           <option value="AMBER">Amber</option>
//                                           <option value="RED">Red</option>
//                                         </select>
//                                         <span className="text-xs text-gray-500 italic">
//                                           (end node)
//                                         </span>
//                                       </div>
//                                     ) : (
//                                       <span className="text-xs text-gray-500 italic">
//                                         Message (end node)
//                                       </span>
//                                     )}
//                                   </td>

//                                   <td className="px-3 py-2">
//                                     <div className="flex items-center gap-2 justify-end">
//                                       <button
//                                         onClick={() =>
//                                           deleteNodeCascade(node.node_key)
//                                         }
//                                         className={BTN_DANGER}
//                                         title="Cascade delete this node and all descendants"
//                                       >
//                                         Delete
//                                       </button>
//                                     </div>
//                                   </td>
//                                 </tr>

//                                 {/* OPTIONS (EDIT MODE) */}
//                                 {isEditing &&
//                                   node.node_type === "QUESTION" &&
//                                   (node.options || []).map((opt, idx) => {
//                                     return (
//                                       <tr
//                                         key={`${node.node_key}-opt-${idx}`}
//                                         className={OPTION_ROW}
//                                       >
//                                         <td
//                                           colSpan={2}
//                                           className="px-3 py-2"
//                                         ></td>

//                                         <td className="px-3 py-2">
//                                           <span className="text-xs text-gray-700 font-semibold">
//                                             Option {idx + 1}
//                                           </span>
//                                         </td>

//                                         <td className="px-3 py-2">
//                                           <input
//                                             className={`${INPUT_SM} w-full`}
//                                             value={opt.label}
//                                             onChange={(e) =>
//                                               updateOption(node.node_key, idx, {
//                                                 label: e.target.value,
//                                               })
//                                             }
//                                             placeholder="Option label"
//                                           />
//                                         </td>

//                                         <td className="px-3 py-2">
//                                           <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
//                                             <span className="text-xs text-gray-700 whitespace-nowrap font-semibold">
//                                               Next
//                                             </span>

//                                             <select
//                                               className={`${SELECT_SM} min-w-[260px]`}
//                                               value={opt.next_node_key || ""}
//                                               onChange={(e) =>
//                                                 updateOption(
//                                                   node.node_key,
//                                                   idx,
//                                                   {
//                                                     next_node_key:
//                                                       e.target.value || null,
//                                                   },
//                                                 )
//                                               }
//                                             >
//                                               {getAvailableNextNodes(
//                                                 node.category,
//                                               ).map((nextOpt) => (
//                                                 <option
//                                                   key={nextOpt.key}
//                                                   value={nextOpt.key}
//                                                 >
//                                                   {nextOpt.label}
//                                                 </option>
//                                               ))}
//                                             </select>

//                                             {/* ✅ Severity -> Scores (BOTH categories) */}
//                                             <select
//                                               className={`${SELECT_SM} w-28`}
//                                               value={opt.severity}
//                                               onChange={(e) => {
//                                                 const newSeverity = e.target
//                                                   .value as SeverityLevel;
//                                                 const prefill =
//                                                   node.category === 1
//                                                     ? CAT1_PREFILL_BY_SEVERITY[
//                                                         newSeverity
//                                                       ]
//                                                     : CAT2_PREFILL_BY_SEVERITY[
//                                                         newSeverity
//                                                       ];

//                                                 updateOption(
//                                                   node.node_key,
//                                                   idx,
//                                                   {
//                                                     severity: newSeverity,
//                                                     news2_score: prefill.news2,
//                                                     seriousness_points:
//                                                       prefill.points,
//                                                   },
//                                                 );
//                                               }}
//                                             >
//                                               <option value="GREEN">
//                                                 Green
//                                               </option>
//                                               <option value="AMBER">
//                                                 Amber
//                                               </option>
//                                               <option value="RED">Red</option>
//                                             </select>

//                                             {/* ✅ Scores -> Severity (BOTH categories) */}
//                                             <input
//                                               className={`${INPUT_SM} w-24`}
//                                               type="number"
//                                               value={opt.news2_score}
//                                               onChange={(e) => {
//                                                 const news2 = Number(
//                                                   e.target.value,
//                                                 );
//                                                 const nextSeverity =
//                                                   severityFromScores(
//                                                     opt.seriousness_points || 0,
//                                                     news2,
//                                                   );
//                                                 updateOption(
//                                                   node.node_key,
//                                                   idx,
//                                                   {
//                                                     news2_score: news2,
//                                                     severity: nextSeverity,
//                                                   },
//                                                 );
//                                               }}
//                                               placeholder="NEWS2"
//                                               title="NEWS2 Score"
//                                             />

//                                             <input
//                                               className={`${INPUT_SM} w-24`}
//                                               type="number"
//                                               value={opt.seriousness_points}
//                                               onChange={(e) => {
//                                                 const points = Number(
//                                                   e.target.value,
//                                                 );
//                                                 const nextSeverity =
//                                                   severityFromScores(
//                                                     points,
//                                                     opt.news2_score || 0,
//                                                   );
//                                                 updateOption(
//                                                   node.node_key,
//                                                   idx,
//                                                   {
//                                                     seriousness_points: points,
//                                                     severity: nextSeverity,
//                                                   },
//                                                 );
//                                               }}
//                                               placeholder="Points"
//                                               title="Seriousness Points"
//                                             />

//                                             <button
//                                               onClick={() =>
//                                                 removeOption(node.node_key, idx)
//                                               }
//                                               disabled={
//                                                 (node.options?.length || 0) <= 2
//                                               }
//                                               className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                                               title={
//                                                 (node.options?.length || 0) <= 2
//                                                   ? "Minimum 2 options required"
//                                                   : "Delete option"
//                                               }
//                                             >
//                                               ✕
//                                             </button>
//                                           </div>
//                                         </td>

//                                         <td className="px-3 py-2"></td>
//                                       </tr>
//                                     );
//                                   })}

//                                 {isEditing && node.node_type === "QUESTION" && (
//                                   <tr className={OPTION_ROW}>
//                                     <td colSpan={5} className="px-3 py-3">
//                                       <button
//                                         onClick={() => addOption(node.node_key)}
//                                         className={BTN_OUTLINE}
//                                       >
//                                         + Add Option
//                                       </button>
//                                     </td>
//                                     <td className="px-3 py-2"></td>
//                                   </tr>
//                                 )}
//                               </Fragment>
//                             );
//                           })}
//                       </Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* PREVIEW MODAL */}
//         {preview.open && flow && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//             <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
//               <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
//                 <div className="text-lg font-bold text-white">
//                   Patient Preview
//                 </div>
//                 <button
//                   onClick={closePreview}
//                   className="p-2 hover:bg-teal-700 rounded-lg text-white"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="p-6 space-y-4">
//                 {currentPreviewNode ? (
//                   <>
//                     <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
//                       {CATEGORY_LABEL[currentPreviewNode.category]}
//                     </div>

//                     <div className="flex items-start justify-between text-xs text-gray-500 gap-4">
//                       <div>
//                         Node{" "}
//                         {getCategorySequenceNumber(currentPreviewNode.node_key)}{" "}
//                         • {currentPreviewNode.node_type}
//                       </div>

//                       <div className="text-right">
//                         <div>
//                           Cat1 Alert:{" "}
//                           <span className="font-semibold">
//                             {results.cat1.alert}
//                           </span>{" "}
//                           • Points:{" "}
//                           <span className="font-semibold">
//                             {results.cat1.totalPoints}
//                           </span>{" "}
//                           • NEWS2:{" "}
//                           <span className="font-semibold">
//                             {results.cat1.totalNews2}
//                           </span>
//                         </div>
//                         <div className="mt-1">
//                           Cat2 Alert:{" "}
//                           <span className="font-semibold">
//                             {results.cat2.alert}
//                           </span>{" "}
//                           • Final:{" "}
//                           <span className="font-semibold">
//                             {results.finalAlert}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
//                       {currentPreviewNode.title && (
//                         <div className="text-lg font-semibold text-gray-900 mb-2">
//                           {currentPreviewNode.title}
//                         </div>
//                       )}
//                       <div className="text-base text-gray-900">
//                         {currentPreviewNode.body_text}
//                       </div>
//                       {currentPreviewNode.help_text && (
//                         <div className="text-sm text-gray-600 italic mt-2">
//                           {currentPreviewNode.help_text}
//                         </div>
//                       )}

//                       {currentPreviewNode.node_type === "QUESTION" && (
//                         <div className="space-y-3 mt-6">
//                           {(currentPreviewNode.options || []).map(
//                             (opt, idx) => {
//                               const selectedValue =
//                                 preview.selectedOptionValueByNode[
//                                   currentPreviewNode.node_key
//                                 ];
//                               const checked = selectedValue === opt.value;

//                               return (
//                                 <button
//                                   key={`${currentPreviewNode.node_key}-ans-${idx}`}
//                                   onClick={() =>
//                                     previewSelectOption(
//                                       currentPreviewNode.node_key,
//                                       opt,
//                                     )
//                                   }
//                                   className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
//                                     checked
//                                       ? "border-teal-600 bg-teal-50"
//                                       : "border-gray-200 hover:border-gray-300 bg-white"
//                                   }`}
//                                 >
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                                         checked
//                                           ? "border-teal-600 bg-teal-600"
//                                           : "border-gray-300"
//                                       }`}
//                                     >
//                                       {checked && (
//                                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                                       )}
//                                     </div>
//                                     <div className="text-base font-medium text-gray-900">
//                                       {opt.label}
//                                     </div>
//                                   </div>
//                                 </button>
//                               );
//                             },
//                           )}
//                         </div>
//                       )}

//                       {currentPreviewNode.node_type === "MESSAGE" && (
//                         <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
//                           This is a message. Click <strong>Next</strong> to
//                           continue.
//                         </div>
//                       )}

//                       {currentPreviewNode.node_type === "ALERT" && (
//                         <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
//                           <div className="font-semibold">
//                             Alert Severity:{" "}
//                             {currentPreviewNode.alert_severity || "RED"}
//                           </div>
//                           <div className="mt-1">
//                             This is an end node for this category. Click{" "}
//                             <strong>Next</strong> to continue.
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-center justify-between pt-6">
//                         <button
//                           onClick={previewBack}
//                           disabled={preview.history.length === 0}
//                           className={BTN_OUTLINE}
//                         >
//                           Back
//                         </button>
//                         <button
//                           onClick={previewNext}
//                           className={BTN_PRIMARY}
//                           disabled={
//                             currentPreviewNode.node_type === "QUESTION" &&
//                             !preview.selectedOptionValueByNode[
//                               currentPreviewNode.node_key
//                             ]
//                           }
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-10">
//                     <div className="text-xl font-bold text-gray-900">
//                       Questionnaire Complete
//                     </div>
//                     <div className="text-sm text-gray-600 mt-2">
//                       Final Alert:{" "}
//                       <span className="font-semibold">
//                         {results.finalAlert}
//                       </span>{" "}
//                       • Cat1:{" "}
//                       <span className="font-semibold">
//                         {results.cat1.alert}
//                       </span>{" "}
//                       • Cat2:{" "}
//                       <span className="font-semibold">
//                         {results.cat2.alert}
//                       </span>{" "}
//                       • Points:{" "}
//                       <span className="font-semibold">
//                         {results.cat1.totalPoints}
//                       </span>
//                     </div>
//                     <div className="mt-6 flex items-center justify-center gap-2">
//                       <button onClick={previewRestart} className={BTN_OUTLINE}>
//                         ↻ Restart
//                       </button>
//                       <button onClick={closePreview} className={BTN_PRIMARY}>
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//                 <button
//                   onClick={previewRestart}
//                   className="text-sm text-gray-600 hover:text-gray-900 font-medium"
//                 >
//                   ↻ Restart Preview
//                 </button>
//                 <div className="text-xs text-gray-500">
//                   This is how patients will see the questionnaire
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

// ✅ Graph deps (XYFlow v12+ has NO default export)
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import dagre from "dagre";

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

type Category = 1 | 2;

const CATEGORY_LABEL: Record<Category, string> = {
  1: "Clinical Obs – Colorectal",
  2: "Symptoms and signs",
};

type FlowNodeT = {
  node_key: string;
  node_type: FlowNodeType;
  category: Category;

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
  nodes: FlowNodeT[];
};

// ================== CONFIG (easy to change) ==================
const SCORE_CATEGORY_1 = {
  RED_POINTS_MIN: 100,
  AMBER_POINTS_MIN: 30,
};

const RULES = {
  AUTO_FIX_START_NODE: true,
  START_NODE_CATEGORY_PRIORITY: [1, 2] as Category[],
};

// Prefill defaults for Category 1 when admin chooses severity
const CAT1_PREFILL_BY_SEVERITY: Record<
  SeverityLevel,
  { news2: number; points: number }
> = {
  GREEN: { news2: 0, points: 0 },
  AMBER: { news2: 2, points: 30 },
  RED: { news2: 3, points: 100 },
};

// Prefill defaults for Category 2 when admin chooses severity
const CAT2_PREFILL_BY_SEVERITY: Record<
  SeverityLevel,
  { news2: number; points: number }
> = {
  GREEN: { news2: 0, points: 0 },
  AMBER: { news2: 2, points: 30 },
  RED: { news2: 3, points: 100 },
};

// ------------------ API helpers ------------------
async function apiGet<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(body?.detail || body?.message || "Request failed");
  return body as T;
}

async function apiPut<T>(
  url: string,
  accessToken: string,
  body: any,
): Promise<T> {
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
  return data as T;
}

// ------------------ UI helpers ------------------
const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  GREEN: 1,
  AMBER: 2,
  RED: 3,
};
function maxSeverity(a: SeverityLevel, b: SeverityLevel): SeverityLevel {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
}

function clinicalAlertFromScore(totalPoints: number): SeverityLevel {
  if (totalPoints >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
  if (totalPoints >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";
  return "GREEN";
}

/**
 * ✅ Symmetric thresholds (matches defaults):
 * - Points drive RED/AMBER
 * - NEWS2: 3 => RED, 2 => AMBER
 */
function severityFromScores(points: number, news2: number): SeverityLevel {
  const p = Number.isFinite(points) ? points : 0;
  if (p >= SCORE_CATEGORY_1.RED_POINTS_MIN) return "RED";
  if (p >= SCORE_CATEGORY_1.AMBER_POINTS_MIN) return "AMBER";

  const n = Number.isFinite(news2) ? news2 : 0;
  if (n >= 3) return "RED";
  if (n >= 2) return "AMBER";
  return "GREEN";
}

function alertRowClass(sev: SeverityLevel | null) {
  const s: SeverityLevel = (sev || "RED") as SeverityLevel;

  if (s === "RED") return "bg-red-50 hover:bg-red-100 border-b border-red-200";
  if (s === "AMBER")
    return "bg-amber-50 hover:bg-amber-100 border-b border-amber-200";
  return "bg-emerald-50 hover:bg-emerald-100 border-b border-emerald-200";
}

function alertAccentLeftClass(sev: SeverityLevel | null) {
  const s: SeverityLevel = (sev || "RED") as SeverityLevel;
  if (s === "RED") return "border-l-4 border-red-500";
  if (s === "AMBER") return "border-l-4 border-amber-500";
  return "border-l-4 border-emerald-500";
}

function badgeColorClass() {
  return "bg-teal-600 text-white";
}

// Buttons
const BTN_PRIMARY =
  "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
const BTN_OUTLINE =
  "px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
const BTN_DANGER =
  "px-3 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";

// Clean input/select styling
const INPUT_SM =
  "px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-teal-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900";
const SELECT_SM = INPUT_SM;

// ✅ Stronger separation styles
const NODE_ROW = "border-b border-gray-200 bg-white";
const OPTION_ROW = "border-b border-emerald-200 bg-emerald-50/70";

type ValidationItem = {
  level: "ERROR" | "WARNING";
  title: string;
  where: string;
  howToFix: string;
};

type ValidationState = {
  ran: boolean;
  valid: boolean;
  items: ValidationItem[];
};

type PreviewState = {
  open: boolean;
  currentKey: string | "END";
  history: string[];
  answers: Record<string, string>;
  selectedOptionValueByNode: Record<string, string>;
  categoryIndex: number;
};

// =========================
// ✅ GRAPH: Custom Node
// =========================
type GraphNodeData = {
  title: string;
  subtitle: string;
  kind: FlowNodeType | "END" | "CAT_HEADER";
  severity: SeverityLevel;
  category: Category;
  optionPorts?: { id: string; label: string; severity: SeverityLevel }[];
};

function severityBadgeClasses(sev: SeverityLevel) {
  if (sev === "RED") return "bg-red-50 text-red-700 border-red-200";
  if (sev === "AMBER") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function edgeStrokeBySeverity(sev: SeverityLevel) {
  if (sev === "RED") return "#ef4444"; // red-500
  if (sev === "AMBER") return "#f59e0b"; // amber-500
  return "#10b981"; // emerald-500
}

const FlowGraphNode = memo(function FlowGraphNode({
  data,
}: {
  data: GraphNodeData;
}) {
  const isEnd = data.kind === "END";
  const isHeader = data.kind === "CAT_HEADER";

  if (isHeader) {
    return (
      <div className="px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 shadow-sm min-w-[340px]">
        <div className="text-sm font-semibold text-teal-900">
          {CATEGORY_LABEL[data.category]}
        </div>
        <div className="text-xs text-teal-700 mt-1">
          Category lane (read-only graph)
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-teal-500 !w-3 !h-3"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-teal-500 !w-3 !h-3"
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border min-w-[360px] ${
        isEnd ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-full border border-teal-200 text-teal-700 bg-teal-50">
            {isEnd ? "END" : data.kind}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full border ${severityBadgeClasses(
              data.severity,
            )}`}
          >
            {data.severity}
          </span>
        </div>
        <span className="text-[11px] text-gray-500">
          {CATEGORY_LABEL[data.category]}
        </span>
      </div>

      <div className="px-4 py-3">
        <div className="text-base font-semibold text-gray-900">
          {data.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">{data.subtitle}</div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-teal-500 !w-3 !h-3"
      />

      {data.kind === "QUESTION" && (data.optionPorts?.length || 0) > 0 ? (
        <div className="relative h-8">
          {data.optionPorts!.map((p, idx) => {
            const count = data.optionPorts!.length;
            const pct = count === 1 ? 50 : 8 + (idx / (count - 1)) * 84;
            return (
              <Handle
                key={p.id}
                id={p.id}
                type="source"
                position={Position.Bottom}
                style={{ left: `${pct}%` }}
                className="!bg-teal-500 !w-3 !h-3"
              />
            );
          })}
        </div>
      ) : isEnd ? null : (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-teal-500 !w-3 !h-3"
        />
      )}
    </div>
  );
});

const nodeTypes = { flowNode: FlowGraphNode };

// =========================
// ✅ GRAPH: Layout helpers
// =========================
const GRAPH_NODE_W = 380;
const GRAPH_NODE_H = 130;

function layoutWithDagre(
  nodes: Node[],
  edges: Edge[],
  opts?: { ranksep?: number; nodesep?: number },
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: "TB",
    ranksep: opts?.ranksep ?? 140,
    nodesep: opts?.nodesep ?? 80,
    edgesep: 10,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((n) =>
    g.setNode(n.id, { width: GRAPH_NODE_W, height: GRAPH_NODE_H }),
  );
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const laidOut = nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: { x: pos.x - GRAPH_NODE_W / 2, y: pos.y - GRAPH_NODE_H / 2 },
    };
  });

  return { nodes: laidOut, edges };
}

// =========================
// Page
// =========================
type LastEditedField = "severity" | "news2" | "points";

export default function QuestionManagementPage() {
  const router = useRouter();
  const params = useParams<{ flowId: string }>();
  const flowId = Number(params.flowId);

  const [viewMode, setViewMode] = useState<"table" | "graph">("table");

  const token = useMemo(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null,
    [],
  );

  const [loading, setLoading] = useState(true);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [editingNodeKey, setEditingNodeKey] = useState<string | null>(null);

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<Category, boolean>
  >({
    1: false,
    2: false,
  });

  const [validation, setValidation] = useState<ValidationState>({
    ran: false,
    valid: false,
    items: [],
  });

  const [preview, setPreview] = useState<PreviewState>({
    open: false,
    currentKey: "END",
    history: [],
    answers: {},
    selectedOptionValueByNode: {},
    categoryIndex: 0,
  });

  // ✅ “last edited wins” tracker per option
  const [lastEditedByOption, setLastEditedByOption] = useState<
    Record<string, LastEditedField>
  >({});

  function optionKey(nodeKey: string, optValue: string) {
    return `${nodeKey}::${optValue}`;
  }

  function prefillFor(category: Category, severity: SeverityLevel) {
    return category === 1
      ? CAT1_PREFILL_BY_SEVERITY[severity]
      : CAT2_PREFILL_BY_SEVERITY[severity];
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
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!Number.isFinite(flowId) || flowId <= 0) {
      setError("Invalid flowId in route");
      setLoading(false);
      return;
    }
    loadFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, flowId]);

  function pickFirstRootNodeKeyAnyCategory(nodes: FlowNodeT[]): string | null {
    for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
      const root = nodes.find((n) => n.category === cat && !n.parent_node_key);
      if (root) return root.node_key;
    }
    return nodes[0]?.node_key ?? null;
  }

  async function loadFlow() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const data = await apiGet<Flow>(`${API_BASE}/flows/${flowId}`, token);

      const fixed: Flow = {
        ...data,
        nodes: (data.nodes || []).map((n) =>
          n.node_type === "ALERT" && !n.alert_severity
            ? { ...n, alert_severity: "RED" }
            : n,
        ),
      };

      if (RULES.AUTO_FIX_START_NODE) {
        const keys = new Set(fixed.nodes.map((n) => n.node_key));
        if (!fixed.start_node_key || !keys.has(fixed.start_node_key)) {
          fixed.start_node_key =
            pickFirstRootNodeKeyAnyCategory(fixed.nodes) ?? "END";
        }
      }

      setFlow(fixed);
      setExpandedNodes(new Set((fixed.nodes || []).map((n) => n.node_key)));
      setHasUnsavedChanges(false);
      setValidation({ ran: false, valid: false, items: [] });
      setLastEditedByOption({});
    } catch (e: any) {
      setError(e?.message || "Failed to load flow");
    } finally {
      setLoading(false);
    }
  }

  async function saveFlow() {
    if (!token || !flow) return;

    if (!validation.ran || !validation.valid) {
      alert("Please validate the questionnaire before saving.");
      return;
    }
    if (!hasUnsavedChanges) {
      alert("No changes to save.");
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

      const data = await apiPut<any>(
        `${API_BASE}/flows/${flow.id}`,
        token,
        payload,
      );
      await loadFlow();
      setHasUnsavedChanges(false);
      alert(`Saved! Version: ${data.version ?? "?"}`);
    } catch (e: any) {
      setError(e?.message || "Failed to save flow");
      alert("Failed to save: " + (e?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function seedDemoQuestionsFromExcel() {
    if (!token) return;

    const ok = confirm(
      "This will overwrite ALL questions/options for this questionnaire using the Excel demo fixture.\n\nContinue?",
    );
    if (!ok) return;

    try {
      setSeedingDemo(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/flows/${flowId}/seed-demo-from-excel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.detail?.errors?.join?.("\n") ||
            data?.detail ||
            "Seeding failed",
        );
      }

      await loadFlow();

      alert(
        `Seeded demo questionnaire! Nodes: ${data?.node_count ?? "?"}, Version: ${data?.version ?? "?"}`,
      );
    } catch (e: any) {
      setError(e?.message || "Seeding failed");
      alert("Seeding failed: " + (e?.message || "Unknown error"));
    } finally {
      setSeedingDemo(false);
    }
  }

  // ------------------ helpers: indexes/maps ------------------
  function nodeMap(): Map<string, FlowNodeT> {
    return new Map((flow?.nodes || []).map((n) => [n.node_key, n]));
  }

  function childrenMap(): Map<string, FlowNodeT[]> {
    const map = new Map<string, FlowNodeT[]>();
    for (const n of flow?.nodes || []) {
      if (!n.parent_node_key) continue;
      const arr = map.get(n.parent_node_key) || [];
      arr.push(n);
      map.set(n.parent_node_key, arr);
    }
    return map;
  }

  function hasChildren(nodeKey: string): boolean {
    if (!flow) return false;
    return flow.nodes.some((n) => n.parent_node_key === nodeKey);
  }

  function toggleNode(nodeKey: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(nodeKey) ? next.delete(nodeKey) : next.add(nodeKey);
      return next;
    });
  }

  function expandAllNodes() {
    if (!flow) return;
    setExpandedNodes(new Set(flow.nodes.map((n) => n.node_key)));
  }
  function collapseAllNodes() {
    setExpandedNodes(new Set());
  }

  function getVisibleNodesByCategory(category: Category): FlowNodeT[] {
    if (!flow) return [];
    const nm = nodeMap();
    function shouldShow(node: FlowNodeT): boolean {
      if (node.category !== category) return false;
      if (!node.parent_node_key) return true;
      const parent = nm.get(node.parent_node_key);
      if (!parent) return true;
      if (parent.category !== category) return false;
      return expandedNodes.has(node.parent_node_key) && shouldShow(parent);
    }
    return flow.nodes.filter(shouldShow);
  }

  function getCategorySequenceNumber(nodeKey: string): number {
    if (!flow) return 0;
    const n = flow.nodes.find((x) => x.node_key === nodeKey);
    if (!n) return 0;
    const sameCat = flow.nodes.filter((x) => x.category === n.category);
    const idx = sameCat.findIndex((x) => x.node_key === nodeKey);
    return idx >= 0 ? idx + 1 : 0;
  }

  function getAvailableNextNodes(
    category: Category,
  ): Array<{ key: string; label: string }> {
    const base = [
      { key: "", label: "-- Select Next --" },
      { key: "END", label: "END - Complete Flow" },
    ];
    if (!flow) return base;

    const sameCategory = flow.nodes.filter((n) => n.category === category);
    return [
      ...base,
      ...sameCategory.map((node) => ({
        key: node.node_key,
        label: `${getCategorySequenceNumber(node.node_key)} - ${node.body_text}`,
      })),
    ];
  }

  // ------------------ state update utilities ------------------
  function markChanged() {
    setHasUnsavedChanges(true);
    setValidation({ ran: false, valid: false, items: [] });
  }

  function makeDefaultOptions(category: Category): FlowOption[] {
    const baseSeverity: SeverityLevel = "GREEN";
    const prefill = prefillFor(category, baseSeverity);

    return [
      {
        display_order: 1,
        label: "Option 1",
        value: "opt1",
        severity: baseSeverity,
        news2_score: prefill.news2,
        seriousness_points: prefill.points,
        next_node_key: null,
      },
      {
        display_order: 2,
        label: "Option 2",
        value: "opt2",
        severity: baseSeverity,
        news2_score: prefill.news2,
        seriousness_points: prefill.points,
        next_node_key: null,
      },
    ];
  }

  function updateNode(nodeKey: string, updates: Partial<FlowNodeT>) {
    if (!flow) return;

    setFlow((prev) => {
      if (!prev) return prev;

      const updatedNodes = prev.nodes.map((n) => {
        if (n.node_key !== nodeKey) return n;

        if (updates.node_type === "ALERT") {
          return {
            ...n,
            ...updates,
            options: [],
            alert_severity: (updates.alert_severity ??
              n.alert_severity ??
              "RED") as SeverityLevel,
          };
        }

        if (updates.node_type === "MESSAGE") {
          return {
            ...n,
            ...updates,
            options: [],
            alert_severity: null,
          };
        }

        if (updates.node_type === "QUESTION") {
          const options =
            n.options?.length >= 2 ? n.options : makeDefaultOptions(n.category);
          return { ...n, ...updates, options };
        }

        return { ...n, ...updates };
      });

      return { ...prev, nodes: updatedNodes };
    });

    markChanged();
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
          if (n.node_key !== nodeKey) return n;
          const options = [...(n.options || [])];
          options[optionIdx] = { ...options[optionIdx], ...updates };
          return { ...n, options };
        }),
      };
    });

    markChanged();
  }

  /**
   * ✅ Last-edited-wins tri-sync
   * - If Severity changed: overwrite BOTH scores with defaults (canonical)
   * - If NEWS2 changed: recompute Severity; do NOT touch Points (unless Points is not finite)
   * - If Points changed: recompute Severity; do NOT touch NEWS2 (unless NEWS2 is not finite)
   */
  function updateOptionTri(
    nodeKey: string,
    optionIdx: number,
    optValue: string,
    change: { field: LastEditedField; value: number | SeverityLevel },
  ) {
    if (!flow) return;

    setLastEditedByOption((prev) => ({
      ...prev,
      [optionKey(nodeKey, optValue)]: change.field,
    }));

    setFlow((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key !== nodeKey) return n;
          const options = [...(n.options || [])];
          const current = options[optionIdx];
          if (!current) return n;

          let next: FlowOption = { ...current };

          // apply change
          if (change.field === "severity") {
            const sev = change.value as SeverityLevel;
            const pf = prefillFor(n.category, sev);
            next = {
              ...next,
              severity: sev,
              news2_score: pf.news2,
              seriousness_points: pf.points,
            };
          }

          if (change.field === "news2") {
            const news2 = Number(change.value);
            const points = Number(next.seriousness_points);
            const sev = severityFromScores(points, news2);
            next = {
              ...next,
              news2_score: news2,
              severity: sev,
            };

            // snap other score only if it is truly "unset" (not finite)
            if (!Number.isFinite(points)) {
              const pf = prefillFor(n.category, sev);
              next.seriousness_points = pf.points;
            }
          }

          if (change.field === "points") {
            const points = Number(change.value);
            const news2 = Number(next.news2_score);
            const sev = severityFromScores(points, news2);
            next = {
              ...next,
              seriousness_points: points,
              severity: sev,
            };

            // snap other score only if it is truly "unset" (not finite)
            if (!Number.isFinite(news2)) {
              const pf = prefillFor(n.category, sev);
              next.news2_score = pf.news2;
            }
          }

          options[optionIdx] = next;
          return { ...n, options };
        }),
      };
    });

    markChanged();
  }

  function addOption(nodeKey: string) {
    if (!flow) return;
    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key !== nodeKey) return n;
          const nextIndex = (n.options?.length || 0) + 1;

          const baseSeverity: SeverityLevel = "GREEN";
          const prefill = prefillFor(n.category, baseSeverity);

          return {
            ...n,
            options: [
              ...(n.options || []),
              {
                display_order: nextIndex,
                label: `Option ${nextIndex}`,
                value: `opt_${nextIndex}`,
                severity: baseSeverity,
                news2_score: prefill.news2,
                seriousness_points: prefill.points,
                next_node_key: null,
              },
            ],
          };
        }),
      };
    });
    markChanged();
  }

  function removeOption(nodeKey: string, optionIdx: number) {
    if (!flow) return;
    setFlow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.node_key !== nodeKey) return n;
          if ((n.options?.length || 0) <= 2) return n;
          const filtered = (n.options || []).filter((_, i) => i !== optionIdx);
          const resequenced = filtered.map((o, i) => ({
            ...o,
            display_order: i + 1,
          }));
          return { ...n, options: resequenced };
        }),
      };
    });
    markChanged();
  }

  function addNode(category: Category, parentKey: string | null = null) {
    if (!flow) return;

    const siblingsCount = flow.nodes.filter(
      (n) => n.parent_node_key === parentKey && n.category === category,
    ).length;

    const newKey = parentKey
      ? `${parentKey}.${siblingsCount + 1}`
      : `${category}.${flow.nodes.filter((n) => !n.parent_node_key && n.category === category).length + 1}`;

    const newNode: FlowNodeT = {
      node_key: newKey,
      node_type: "QUESTION",
      category,
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
      options: makeDefaultOptions(category),
    };

    setFlow((prev) =>
      prev ? { ...prev, nodes: [...prev.nodes, newNode] } : prev,
    );
    setExpandedNodes((prev) => new Set([...prev, newKey]));
    markChanged();
  }

  // ------------------ delete node (cascade descendants + clear references) ------------------
  function collectDescendants(rootKey: string): Set<string> {
    const cm = childrenMap();
    const toDelete = new Set<string>();
    const stack = [rootKey];
    while (stack.length) {
      const k = stack.pop()!;
      if (toDelete.has(k)) continue;
      toDelete.add(k);
      const kids = cm.get(k) || [];
      for (const child of kids) stack.push(child.node_key);
    }
    return toDelete;
  }

  function deleteNodeCascade(nodeKey: string) {
    if (!flow) return;
    const toDelete = collectDescendants(nodeKey);

    setFlow((prev) => {
      if (!prev) return prev;

      const remaining = prev.nodes.filter((n) => !toDelete.has(n.node_key));

      const cleaned = remaining.map((n) => {
        if (n.node_type !== "QUESTION") return n;

        const newOptions = (n.options || []).map((o) => {
          if (o.next_node_key && toDelete.has(o.next_node_key)) {
            return { ...o, next_node_key: null };
          }
          return o;
        });

        const newParent =
          n.parent_node_key && toDelete.has(n.parent_node_key)
            ? null
            : n.parent_node_key;

        return { ...n, parent_node_key: newParent, options: newOptions };
      });

      return { ...prev, nodes: cleaned };
    });

    if (editingNodeKey && toDelete.has(editingNodeKey)) setEditingNodeKey(null);
    markChanged();
  }

  // ------------------ FRONTEND VALIDATION ------------------
  function validateFrontend(): ValidationState {
    if (!flow)
      return {
        ran: true,
        valid: false,
        items: [
          {
            level: "ERROR",
            title: "Flow not loaded",
            where: "Flow",
            howToFix: "Reload the page and try again.",
          },
        ],
      };

    const items: ValidationItem[] = [];
    const nm = nodeMap();
    const keys = new Set([...nm.keys()]);
    const allowedCats = new Set<number>([1, 2]);

    if (!flow.start_node_key || !keys.has(flow.start_node_key)) {
      items.push({
        level: "ERROR",
        title: "Start node is missing or invalid",
        where: `Start Node: ${flow.start_node_key || "(empty)"}`,
        howToFix: `Set start_node_key to an existing node key (usually the first question).`,
      });
    }

    const seen = new Set<string>();
    for (const n of flow.nodes) {
      if (seen.has(n.node_key)) {
        items.push({
          level: "ERROR",
          title: "Duplicate node key found",
          where: `Node Key: ${n.node_key}`,
          howToFix: "Ensure every node has a unique node_key.",
        });
      }
      seen.add(n.node_key);
    }

    for (const n of flow.nodes) {
      if (!allowedCats.has(n.category)) {
        items.push({
          level: "ERROR",
          title: "Invalid category",
          where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
          howToFix: "Category must be either 1 or 2.",
        });
      }

      if (n.parent_node_key) {
        const parent = nm.get(n.parent_node_key);
        if (!parent) {
          items.push({
            level: "ERROR",
            title: "Parent node not found",
            where: `Node ${getCategorySequenceNumber(n.node_key)} (${n.node_key})`,
            howToFix:
              "Either fix parent_node_key or delete/recreate this node under a valid parent.",
          });
        } else if (parent.category !== n.category) {
          items.push({
            level: "ERROR",
            title: "Category mismatch between parent and child",
            where: `Child: ${n.node_key} → Parent: ${parent.node_key}`,
            howToFix: `Move the node under a parent in the same category.`,
          });
        }
      }
    }

    for (const node of flow.nodes) {
      const whereNode = `Node ${getCategorySequenceNumber(node.node_key)} (${node.node_key})`;

      if (node.node_type === "QUESTION") {
        if (!node.options || node.options.length < 2) {
          items.push({
            level: "ERROR",
            title: "Question must have at least 2 options",
            where: whereNode,
            howToFix: "Add more options until there are at least 2.",
          });
        }

        for (const opt of node.options || []) {
          const whereOpt = `${whereNode} → Option "${opt.label}"`;

          if (!opt.label || !opt.label.trim()) {
            items.push({
              level: "ERROR",
              title: "Option label is empty",
              where: whereOpt,
              howToFix: "Give this option a meaningful label (e.g., Yes / No).",
            });
          }

          if (!opt.next_node_key) {
            items.push({
              level: "ERROR",
              title: "Option next step is missing",
              where: whereOpt,
              howToFix: `Select a Next node for this option (or choose END).`,
            });
          } else if (opt.next_node_key !== "END") {
            const dst = nm.get(opt.next_node_key);
            if (!dst) {
              items.push({
                level: "ERROR",
                title: "Option points to a node that does not exist",
                where: whereOpt,
                howToFix: `Change Next from "${opt.next_node_key}" to an existing node in the same category.`,
              });
            } else if (dst.category !== node.category) {
              items.push({
                level: "ERROR",
                title: "Option next node must be in the same category",
                where: `${whereOpt} → Next "${dst.node_key}"`,
                howToFix: `Pick a Next node inside category "${CATEGORY_LABEL[node.category]}".`,
              });
            }
          }
        }
      }

      if (node.node_type === "MESSAGE") {
        if (node.options && node.options.length > 0) {
          items.push({
            level: "ERROR",
            title: "Message must not have options",
            where: whereNode,
            howToFix: "Change node type to QUESTION if you need options.",
          });
        }
      }

      if (node.node_type === "ALERT") {
        if (!node.alert_severity) {
          items.push({
            level: "ERROR",
            title: "Alert severity is missing",
            where: whereNode,
            howToFix: "Select Green / Amber / Red for this Alert.",
          });
        }
        if (node.options && node.options.length > 0) {
          items.push({
            level: "ERROR",
            title: "Alert must not have options",
            where: whereNode,
            howToFix:
              "Alerts are end nodes. Remove options or change type to QUESTION.",
          });
        }
      }
    }

    // ✅ Cycle detection for BOTH categories
    const graph = new Map<string, string[]>();
    function addEdge(src: string, dst: string | null) {
      if (!dst) return;
      graph.set(src, [...(graph.get(src) || []), dst]);
    }
    for (const n of flow.nodes) {
      if (n.node_type === "QUESTION") {
        for (const o of n.options || []) addEdge(n.node_key, o.next_node_key);
      }
    }

    const visited = new Set<string>();
    const stack = new Set<string>();
    function dfs(u: string): boolean {
      if (u === "END") return false;
      if (stack.has(u)) return true;
      if (visited.has(u)) return false;
      visited.add(u);
      stack.add(u);
      for (const v of graph.get(u) || []) {
        if (v && dfs(v)) return true;
      }
      stack.delete(u);
      return false;
    }

    function getRoots(cat: Category) {
      return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
    }

    const startKeysToCheck = new Set<string>();
    if (flow.start_node_key && keys.has(flow.start_node_key)) {
      startKeysToCheck.add(flow.start_node_key);
    }
    for (const cat of RULES.START_NODE_CATEGORY_PRIORITY) {
      for (const r of getRoots(cat)) startKeysToCheck.add(r.node_key);
    }

    for (const startKey of startKeysToCheck) {
      stack.clear();
      if (dfs(startKey)) {
        items.push({
          level: "ERROR",
          title: "Flow contains a cycle (loop)",
          where: `Path from ${startKey}`,
          howToFix: "Break the loop by changing an option's Next to END.",
        });
        break;
      }
    }

    const valid = items.filter((x) => x.level === "ERROR").length === 0;
    return { ran: true, valid, items };
  }

  function onValidateClick() {
    const result = validateFrontend();
    setValidation(result);
    if (!result.valid) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ------------------ PREVIEW (Cat1 then Cat2) ------------------
  function getCategoryRoots(cat: Category): FlowNodeT[] {
    if (!flow) return [];
    return flow.nodes.filter((n) => n.category === cat && !n.parent_node_key);
  }

  function orderedCategoriesPresent(): Category[] {
    if (!flow) return [1, 2];
    const present = new Set<Category>(flow.nodes.map((n) => n.category));
    return RULES.START_NODE_CATEGORY_PRIORITY.filter((c) => present.has(c));
  }

  function pickCategoryStart(cat: Category): string | "END" {
    const roots = getCategoryRoots(cat);
    return roots[0]?.node_key ?? "END";
  }

  function openPreview() {
    if (!flow) return;

    const nm = nodeMap();
    const cats = orderedCategoriesPresent();

    const start =
      flow.start_node_key && nm.has(flow.start_node_key)
        ? flow.start_node_key
        : (pickCategoryStart(cats[0]) ?? "END");

    const startNode = start !== "END" ? nm.get(start) : null;
    const startCat = startNode?.category ?? cats[0];
    const catIndex = Math.max(0, cats.indexOf(startCat));

    setPreview({
      open: true,
      currentKey: start,
      history: [],
      answers: {},
      selectedOptionValueByNode: {},
      categoryIndex: catIndex,
    });
  }

  function closePreview() {
    setPreview((p) => ({ ...p, open: false }));
  }

  function previewCurrentNode(): FlowNodeT | null {
    if (!flow) return null;
    if (!preview.open) return null;
    if (preview.currentKey === "END") return null;
    return nodeMap().get(preview.currentKey) || null;
  }

  function previewSelectOption(nodeKey: string, opt: FlowOption) {
    setPreview((p) => ({
      ...p,
      answers: { ...p.answers, [nodeKey]: opt.label },
      selectedOptionValueByNode: {
        ...p.selectedOptionValueByNode,
        [nodeKey]: opt.value,
      },
    }));
  }

  function goToNextCategoryOrFinish(currentCategory: Category) {
    const cats = orderedCategoriesPresent();
    const idx = Math.max(0, cats.indexOf(currentCategory));
    const nextIdx = idx + 1;
    if (nextIdx >= cats.length) {
      setPreview((p) => ({ ...p, currentKey: "END", categoryIndex: idx }));
      return;
    }
    const nextCat = cats[nextIdx];
    const nextStart = pickCategoryStart(nextCat);
    setPreview((p) => ({
      ...p,
      currentKey: nextStart,
      categoryIndex: nextIdx,
    }));
  }

  function previewNext() {
    if (!flow) return;
    const current = previewCurrentNode();
    if (!current) return;

    if (current.node_type === "MESSAGE" || current.node_type === "ALERT") {
      setPreview((p) => ({ ...p, history: [...p.history, current.node_key] }));
      goToNextCategoryOrFinish(current.category);
      return;
    }

    if (current.node_type === "QUESTION") {
      const selectedValue = preview.selectedOptionValueByNode[current.node_key];
      const opt = (current.options || []).find(
        (o) => o.value === selectedValue,
      );

      if (!opt) {
        alert("Please select an answer.");
        return;
      }

      const nextKey = opt.next_node_key || "END";

      setPreview((p) => ({
        ...p,
        history: [...p.history, current.node_key],
      }));

      if (nextKey === "END") {
        goToNextCategoryOrFinish(current.category);
        return;
      }

      setPreview((p) => ({
        ...p,
        currentKey: nextKey as any,
      }));
      return;
    }
  }

  function previewBack() {
    setPreview((p) => {
      const hist = [...p.history];
      const prevKey = hist.pop();
      if (!prevKey) return p;
      return { ...p, history: hist, currentKey: prevKey };
    });
  }

  function previewRestart() {
    openPreview();
  }

  function computePreviewResults() {
    if (!flow) {
      return {
        cat1: {
          totalNews2: 0,
          totalPoints: 0,
          alert: "GREEN" as SeverityLevel,
        },
        cat2: {
          totalNews2: 0,
          totalPoints: 0,
          alert: "GREEN" as SeverityLevel,
        },
        finalAlert: "GREEN" as SeverityLevel,
      };
    }

    const nm = nodeMap();
    let cat1News2 = 0;
    let cat1Points = 0;
    let cat2News2 = 0;
    let cat2Points = 0;

    let cat1AlertNodeSeverity: SeverityLevel | null = null;
    let cat2AlertNodeSeverity: SeverityLevel | null = null;

    for (const nodeKey of Object.keys(preview.selectedOptionValueByNode)) {
      const node = nm.get(nodeKey);
      if (!node || node.node_type !== "QUESTION") continue;

      const selectedValue = preview.selectedOptionValueByNode[nodeKey];
      const opt = (node.options || []).find((o) => o.value === selectedValue);
      if (!opt) continue;

      if (node.category === 1) {
        cat1News2 += Number(opt.news2_score || 0);
        cat1Points += Number(opt.seriousness_points || 0);
      } else {
        cat2News2 += Number(opt.news2_score || 0);
        cat2Points += Number(opt.seriousness_points || 0);
      }
    }

    const current = previewCurrentNode();
    if (current?.node_type === "ALERT" && current.alert_severity) {
      if (current.category === 1)
        cat1AlertNodeSeverity = current.alert_severity;
      if (current.category === 2)
        cat2AlertNodeSeverity = current.alert_severity;
    }

    let cat1Alert = clinicalAlertFromScore(cat1Points);
    if (cat1AlertNodeSeverity)
      cat1Alert = maxSeverity(cat1Alert, cat1AlertNodeSeverity);

    let cat2Alert = severityFromScores(cat2Points, cat2News2);
    if (cat2AlertNodeSeverity)
      cat2Alert = maxSeverity(cat2Alert, cat2AlertNodeSeverity);

    const finalAlert = maxSeverity(cat1Alert, cat2Alert);

    return {
      cat1: {
        totalNews2: cat1News2,
        totalPoints: cat1Points,
        alert: cat1Alert,
      },
      cat2: {
        totalNews2: cat2News2,
        totalPoints: cat2Points,
        alert: cat2Alert,
      },
      finalAlert,
    };
  }

  // ------------------ GRAPH BUILD (true tree + 2 category lanes) ------------------
  function buildGraphElements(): { nodes: Node[]; edges: Edge[] } {
    if (!flow) return { nodes: [], edges: [] };

    const nm = nodeMap();

    const endIds: Record<Category, string> = {
      1: "END:1",
      2: "END:2",
    };

    const cats = orderedCategoriesPresent();

    const allNodes: Node[] = [];
    const allEdges: Edge[] = [];

    cats.forEach((cat, laneIndex) => {
      const laneNodes: Node[] = [];
      const laneEdges: Edge[] = [];

      const headerId = `CAT:${cat}`;
      laneNodes.push({
        id: headerId,
        type: "flowNode",
        data: {
          title: CATEGORY_LABEL[cat],
          subtitle: "Tree graph lane",
          kind: "CAT_HEADER",
          severity: "GREEN",
          category: cat,
        } satisfies GraphNodeData,
        position: { x: 0, y: 0 },
      });

      laneNodes.push({
        id: endIds[cat],
        type: "flowNode",
        data: {
          title: "Complete Flow",
          subtitle: "END node",
          kind: "END",
          severity: "GREEN",
          category: cat,
        } satisfies GraphNodeData,
        position: { x: 0, y: 0 },
      });

      const nodesInCat = flow.nodes.filter((n) => n.category === cat);
      for (const n of nodesInCat) {
        let sev: SeverityLevel = "GREEN";
        if (n.node_type === "ALERT")
          sev = (n.alert_severity || "RED") as SeverityLevel;
        if (n.node_type === "QUESTION") {
          for (const o of n.options || [])
            sev = maxSeverity(sev, o.severity || "GREEN");
        }

        const optionPorts =
          n.node_type === "QUESTION"
            ? (n.options || []).map((o) => ({
                id: `opt:${o.value}`,
                label: o.label,
                severity: o.severity || "GREEN",
              }))
            : [];

        laneNodes.push({
          id: n.node_key,
          type: "flowNode",
          data: {
            title: n.body_text,
            subtitle: `${n.node_type} • key ${n.node_key}`,
            kind: n.node_type,
            severity: sev,
            category: cat,
            optionPorts,
          } satisfies GraphNodeData,
          position: { x: 0, y: 0 },
        });
      }

      const roots = nodesInCat.filter((n) => !n.parent_node_key);
      for (const r of roots) {
        laneEdges.push({
          id: `e:${headerId}->${r.node_key}`,
          source: headerId,
          target: r.node_key,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: "#0f766e" },
        });
      }

      for (const n of nodesInCat) {
        if (n.node_type !== "QUESTION") continue;

        for (const o of n.options || []) {
          const rawTarget = o.next_node_key || "END";

          const targetId =
            rawTarget === "END"
              ? endIds[cat]
              : nm.has(rawTarget)
                ? rawTarget
                : null;

          if (!targetId) continue;

          const edgeId = `e:${n.node_key}:${o.value}:${targetId}`;
          const sev = o.severity || "GREEN";

          laneEdges.push({
            id: edgeId,
            source: n.node_key,
            target: targetId,
            sourceHandle: `opt:${o.value}`,
            label: o.label,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2, stroke: edgeStrokeBySeverity(sev) },
            labelStyle: { fontSize: 12, fontWeight: 700, fill: "#111827" },
          });
        }
      }

      const laid = layoutWithDagre(laneNodes, laneEdges, {
        ranksep: 150,
        nodesep: 95,
      });

      const xOffset = laneIndex * 980;
      const shiftedNodes = laid.nodes.map((n) => ({
        ...n,
        position: { x: n.position.x + xOffset, y: n.position.y },
      }));

      allNodes.push(...shiftedNodes);
      allEdges.push(...laid.edges);
    });

    return { nodes: allNodes, edges: allEdges };
  }

  // ------------------ render guards ------------------
  const visibleNodesCat1 = getVisibleNodesByCategory(1);
  const visibleNodesCat2 = getVisibleNodesByCategory(2);

  if (loading && !flow) {
    return (
      <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
        <div className="text-gray-600">Loading questions...</div>
      </div>
    );
  }

  const currentPreviewNode = previewCurrentNode();
  const results = computePreviewResults();
  const graph = buildGraphElements();

  return (
    <div className="min-h-screen bg-[#f4f5fa]">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/questionnaires")}
            className={BTN_OUTLINE}
            title="Back to Questionnaires"
          >
            ← Questionnaires
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <div className="text-sm font-semibold text-gray-800">
            Question Management
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={seedDemoQuestionsFromExcel}
            disabled={seedingDemo || saving || loading}
            className={BTN_OUTLINE}
            title="Overwrite this questionnaire with demo questions/options from Excel"
          >
            🧪 {seedingDemo ? "Seeding..." : "Create Test Questions & Options"}
          </button>

          <button
            onClick={() =>
              setViewMode((v) => (v === "table" ? "graph" : "table"))
            }
            className={BTN_OUTLINE}
            title="Toggle Table / Graph"
          >
            🧠 {viewMode === "table" ? "Graph View" : "Table View"}
          </button>

          <button onClick={openPreview} className={BTN_PRIMARY}>
            👁 Preview
          </button>

          <button onClick={onValidateClick} className={BTN_PRIMARY}>
            ✅ Validate
          </button>

          <button
            onClick={saveFlow}
            disabled={
              saving ||
              !hasUnsavedChanges ||
              !validation.ran ||
              !validation.valid
            }
            className={BTN_PRIMARY}
            title={
              !validation.ran
                ? "Validate before saving"
                : !validation.valid
                  ? "Fix validation errors before saving"
                  : !hasUnsavedChanges
                    ? "No changes to save"
                    : ""
            }
          >
            💾 {saving ? "Saving..." : "Save"}
          </button>

          <button onClick={logout} className={BTN_OUTLINE} title="Logout">
            Logout
          </button>
        </div>
      </header>

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

      <main className="p-6 overflow-auto">
        {flow && (
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Question Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {flow.name} (Version {flow.version}){" "}
              {validation.ran ? (
                validation.valid ? (
                  <span className="ml-2 text-green-700 font-semibold">
                    ● Valid
                  </span>
                ) : (
                  <span className="ml-2 text-red-700 font-semibold">
                    ● Not valid
                  </span>
                )
              ) : (
                <span className="ml-2 text-gray-500 font-semibold">
                  ● Not validated
                </span>
              )}
              {hasUnsavedChanges && (
                <span className="ml-2 text-amber-700 font-semibold">
                  ● Unsaved changes
                </span>
              )}
            </p>
          </div>
        )}

        {validation.ran && (
          <div
            className={`mb-6 rounded-lg border px-6 py-4 ${
              validation.valid
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`font-semibold ${
                validation.valid ? "text-green-900" : "text-red-900"
              }`}
            >
              {validation.valid
                ? `Validation successful (0 errors, 0 warnings)`
                : `Validation failed (${
                    validation.items.filter((x) => x.level === "ERROR").length
                  } errors, ${
                    validation.items.filter((x) => x.level === "WARNING").length
                  } warnings)`}
            </div>

            {!validation.valid && (
              <div className="mt-3 space-y-3">
                {validation.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="bg-white/60 border border-red-200 rounded-lg p-4"
                  >
                    <div className="font-semibold text-red-900">{it.title}</div>
                    <div className="text-sm text-red-900 mt-1">
                      <strong>Where:</strong> {it.where}
                    </div>
                    <div className="text-sm text-red-900 mt-1">
                      <strong>How to fix:</strong> {it.howToFix}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ✅ GRAPH VIEW */}
        {flow && viewMode === "graph" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-teal-50 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-teal-900">
                  Graph View (read-only)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  True tree graph: every option is a separate branch (including
                  END). Two lanes: Category 1 + Category 2.
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Changes in table update graph automatically.
              </div>
            </div>

            <div className="h-[72vh] bg-teal-50">
              <ReactFlow
                nodes={graph.nodes}
                edges={graph.edges}
                nodeTypes={nodeTypes}
                fitView
                className="bg-teal-50"
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>
        )}

        {/* ✅ TABLE VIEW */}
        {flow && viewMode === "table" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-emerald-900">
                Question Flow Builder
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCollapsedCategories({ 1: false, 2: false })}
                  className={BTN_OUTLINE}
                >
                  Expand Categories
                </button>
                <button
                  onClick={() => setCollapsedCategories({ 1: true, 2: true })}
                  className={BTN_OUTLINE}
                >
                  Collapse Categories
                </button>
                <button onClick={expandAllNodes} className={BTN_OUTLINE}>
                  Expand All
                </button>
                <button onClick={collapseAllNodes} className={BTN_OUTLINE}>
                  Collapse All
                </button>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm table-auto">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12"></th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-20">
                      Node
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-44">
                      Type
                    </th>

                    {/* ✅ Make question/body column MUCH wider */}
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[680px] w-[720px]">
                      Body Text
                    </th>

                    {/* ✅ Make options/settings a bit smaller */}
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[360px]">
                      Options / Settings
                    </th>

                    {/* ✅ Actions smaller but enough for Edit + Delete */}
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-[240px]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {([1, 2] as Category[]).map((cat) => {
                    const collapsed = collapsedCategories[cat];
                    const visibleNodes =
                      cat === 1 ? visibleNodesCat1 : visibleNodesCat2;

                    return (
                      <Fragment key={`cat-${cat}`}>
                        <tr className="bg-emerald-100/60 border-b border-emerald-200">
                          <td className="px-3 py-3" colSpan={6}>
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() =>
                                  setCollapsedCategories((p) => ({
                                    ...p,
                                    [cat]: !p[cat],
                                  }))
                                }
                                className="flex items-center gap-2 text-sm font-semibold text-gray-800"
                              >
                                <span className="inline-block w-5 text-center">
                                  {collapsed ? "▶" : "▼"}
                                </span>
                                <span>{CATEGORY_LABEL[cat]}</span>
                                <span className="text-xs font-normal text-gray-500">
                                  (
                                  {
                                    flow.nodes.filter((n) => n.category === cat)
                                      .length
                                  }{" "}
                                  nodes)
                                </span>
                              </button>

                              <button
                                onClick={() => addNode(cat, null)}
                                className={BTN_OUTLINE}
                              >
                                + Add Root Node
                              </button>
                            </div>
                          </td>
                        </tr>

                        {!collapsed &&
                          visibleNodes.map((node) => {
                            const hasChild = hasChildren(node.node_key);
                            const isExpanded = expandedNodes.has(node.node_key);
                            const indent = Math.max(
                              0,
                              (node.depth_level - 1) * 18,
                            );

                            const isEditing = editingNodeKey === node.node_key;

                            const isAlert = node.node_type === "ALERT";
                            const rowClass = isAlert
                              ? alertRowClass(node.alert_severity)
                              : `${NODE_ROW} hover:bg-gray-50`;
                            const leftAccent = isAlert
                              ? alertAccentLeftClass(node.alert_severity)
                              : "";

                            const isQuestion = node.node_type === "QUESTION";

                            return (
                              <Fragment key={node.node_key}>
                                <tr className={`${rowClass} ${leftAccent}`}>
                                  <td
                                    className="px-3 py-2"
                                    style={{ paddingLeft: `${12 + indent}px` }}
                                  >
                                    {hasChild && (
                                      <button
                                        onClick={() =>
                                          toggleNode(node.node_key)
                                        }
                                        className="text-gray-600 hover:text-gray-900"
                                      >
                                        {isExpanded ? "▼" : "▶"}
                                      </button>
                                    )}
                                  </td>

                                  <td className="px-3 py-2">
                                    <span
                                      className={`inline-flex items-center justify-center w-8 h-8 rounded font-semibold ${badgeColorClass()}`}
                                    >
                                      {getCategorySequenceNumber(node.node_key)}
                                    </span>
                                  </td>

                                  <td className="px-3 py-2">
                                    <select
                                      className={`${SELECT_SM} w-44`}
                                      value={node.node_type}
                                      onChange={(e) =>
                                        updateNode(node.node_key, {
                                          node_type: e.target
                                            .value as FlowNodeType,
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
                                      className={`${INPUT_SM} w-full`}
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
                                      <div className="flex items-center gap-2">
                                        {/* ✅ Question row font color = badge background color */}
                                        <span className="text-xs font-semibold text-teal-600">
                                          {node.options?.length || 0} options
                                        </span>
                                      </div>
                                    ) : node.node_type === "ALERT" ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">
                                          Severity
                                        </span>
                                        <select
                                          className={SELECT_SM}
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
                                        <span className="text-xs text-gray-500 italic">
                                          (end node)
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500 italic">
                                        Message (end node)
                                      </span>
                                    )}
                                  </td>

                                  {/* ✅ Put Edit + Delete together to remove big empty gap */}
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-2 justify-end">
                                      {isQuestion && (
                                        <button
                                          onClick={() =>
                                            setEditingNodeKey(
                                              isEditing ? null : node.node_key,
                                            )
                                          }
                                          className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium"
                                        >
                                          {isEditing ? "Hide" : "Edit"}
                                        </button>
                                      )}

                                      <button
                                        onClick={() =>
                                          deleteNodeCascade(node.node_key)
                                        }
                                        className={BTN_DANGER}
                                        title="Cascade delete this node and all descendants"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* OPTIONS (EDIT MODE) */}
                                {isEditing &&
                                  node.node_type === "QUESTION" &&
                                  (node.options || []).map((opt, idx) => {
                                    const lk = optionKey(
                                      node.node_key,
                                      opt.value,
                                    );
                                    const lastEdited = lastEditedByOption[lk];

                                    return (
                                      <tr
                                        key={`${node.node_key}-opt-${idx}`}
                                        className={OPTION_ROW}
                                      >
                                        <td
                                          colSpan={2}
                                          className="px-3 py-2"
                                        ></td>

                                        <td className="px-3 py-2">
                                          <span className="text-xs text-gray-700 font-semibold">
                                            Option {idx + 1}
                                          </span>
                                        </td>

                                        <td className="px-3 py-2">
                                          <input
                                            className={`${INPUT_SM} w-full`}
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
                                          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
                                            <span className="text-xs text-gray-700 whitespace-nowrap font-semibold">
                                              Next
                                            </span>

                                            <select
                                              className={`${SELECT_SM} min-w-[260px]`}
                                              value={opt.next_node_key || ""}
                                              onChange={(e) =>
                                                updateOption(
                                                  node.node_key,
                                                  idx,
                                                  {
                                                    next_node_key:
                                                      e.target.value || null,
                                                  },
                                                )
                                              }
                                            >
                                              {getAvailableNextNodes(
                                                node.category,
                                              ).map((nextOpt) => (
                                                <option
                                                  key={nextOpt.key}
                                                  value={nextOpt.key}
                                                >
                                                  {nextOpt.label}
                                                </option>
                                              ))}
                                            </select>

                                            {/* ✅ Severity (last-edited wins; overwrites both scores to defaults) */}
                                            <select
                                              className={`${SELECT_SM} w-28 ${
                                                lastEdited === "severity"
                                                  ? "ring-2 ring-teal-200"
                                                  : ""
                                              }`}
                                              value={opt.severity}
                                              onChange={(e) => {
                                                const newSeverity = e.target
                                                  .value as SeverityLevel;
                                                updateOptionTri(
                                                  node.node_key,
                                                  idx,
                                                  opt.value,
                                                  {
                                                    field: "severity",
                                                    value: newSeverity,
                                                  },
                                                );
                                              }}
                                              title="Severity (sets default scores)"
                                            >
                                              <option value="GREEN">
                                                Green
                                              </option>
                                              <option value="AMBER">
                                                Amber
                                              </option>
                                              <option value="RED">Red</option>
                                            </select>

                                            {/* ✅ NEWS2 (last-edited wins; updates severity only) */}
                                            <input
                                              className={`${INPUT_SM} w-24 ${
                                                lastEdited === "news2"
                                                  ? "ring-2 ring-teal-200"
                                                  : ""
                                              }`}
                                              type="number"
                                              value={opt.news2_score}
                                              onChange={(e) => {
                                                const news2 = Number(
                                                  e.target.value,
                                                );
                                                updateOptionTri(
                                                  node.node_key,
                                                  idx,
                                                  opt.value,
                                                  {
                                                    field: "news2",
                                                    value: news2,
                                                  },
                                                );
                                              }}
                                              placeholder="NEWS2"
                                              title="NEWS2 Score"
                                            />

                                            {/* ✅ Points (last-edited wins; updates severity only) */}
                                            <input
                                              className={`${INPUT_SM} w-24 ${
                                                lastEdited === "points"
                                                  ? "ring-2 ring-teal-200"
                                                  : ""
                                              }`}
                                              type="number"
                                              value={opt.seriousness_points}
                                              onChange={(e) => {
                                                const points = Number(
                                                  e.target.value,
                                                );
                                                updateOptionTri(
                                                  node.node_key,
                                                  idx,
                                                  opt.value,
                                                  {
                                                    field: "points",
                                                    value: points,
                                                  },
                                                );
                                              }}
                                              placeholder="Points"
                                              title="Seriousness Points"
                                            />

                                            <button
                                              onClick={() =>
                                                removeOption(node.node_key, idx)
                                              }
                                              disabled={
                                                (node.options?.length || 0) <= 2
                                              }
                                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                              title={
                                                (node.options?.length || 0) <= 2
                                                  ? "Minimum 2 options required"
                                                  : "Delete option"
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        </td>

                                        <td className="px-3 py-2"></td>
                                      </tr>
                                    );
                                  })}

                                {isEditing && node.node_type === "QUESTION" && (
                                  <tr className={OPTION_ROW}>
                                    <td colSpan={5} className="px-3 py-3">
                                      <button
                                        onClick={() => addOption(node.node_key)}
                                        className={BTN_OUTLINE}
                                      >
                                        + Add Option
                                      </button>
                                    </td>
                                    <td className="px-3 py-2"></td>
                                  </tr>
                                )}
                              </Fragment>
                            );
                          })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {preview.open && flow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-teal-600 flex items-center justify-between">
                <div className="text-lg font-bold text-white">
                  Patient Preview
                </div>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-teal-700 rounded-lg text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                {currentPreviewNode ? (
                  <>
                    <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {CATEGORY_LABEL[currentPreviewNode.category]}
                    </div>

                    <div className="flex items-start justify-between text-xs text-gray-500 gap-4">
                      <div>
                        Node{" "}
                        {getCategorySequenceNumber(currentPreviewNode.node_key)}{" "}
                        • {currentPreviewNode.node_type}
                      </div>

                      <div className="text-right">
                        <div>
                          Cat1 Alert:{" "}
                          <span className="font-semibold">
                            {results.cat1.alert}
                          </span>{" "}
                          • Points:{" "}
                          <span className="font-semibold">
                            {results.cat1.totalPoints}
                          </span>{" "}
                          • NEWS2:{" "}
                          <span className="font-semibold">
                            {results.cat1.totalNews2}
                          </span>
                        </div>
                        <div className="mt-1">
                          Cat2 Alert:{" "}
                          <span className="font-semibold">
                            {results.cat2.alert}
                          </span>{" "}
                          • Final:{" "}
                          <span className="font-semibold">
                            {results.finalAlert}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      {currentPreviewNode.title && (
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {currentPreviewNode.title}
                        </div>
                      )}
                      <div className="text-base text-gray-900">
                        {currentPreviewNode.body_text}
                      </div>
                      {currentPreviewNode.help_text && (
                        <div className="text-sm text-gray-600 italic mt-2">
                          {currentPreviewNode.help_text}
                        </div>
                      )}

                      {currentPreviewNode.node_type === "QUESTION" && (
                        <div className="space-y-3 mt-6">
                          {(currentPreviewNode.options || []).map(
                            (opt, idx) => {
                              const selectedValue =
                                preview.selectedOptionValueByNode[
                                  currentPreviewNode.node_key
                                ];
                              const checked = selectedValue === opt.value;

                              return (
                                <button
                                  key={`${currentPreviewNode.node_key}-ans-${idx}`}
                                  onClick={() =>
                                    previewSelectOption(
                                      currentPreviewNode.node_key,
                                      opt,
                                    )
                                  }
                                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                    checked
                                      ? "border-teal-600 bg-teal-50"
                                      : "border-gray-200 hover:border-gray-300 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        checked
                                          ? "border-teal-600 bg-teal-600"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {checked && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                    <div className="text-base font-medium text-gray-900">
                                      {opt.label}
                                    </div>
                                  </div>
                                </button>
                              );
                            },
                          )}
                        </div>
                      )}

                      {currentPreviewNode.node_type === "MESSAGE" && (
                        <div className="mt-6 p-3 rounded border border-gray-200 bg-white text-sm text-gray-700">
                          This is a message. Click <strong>Next</strong> to
                          continue.
                        </div>
                      )}

                      {currentPreviewNode.node_type === "ALERT" && (
                        <div className="mt-6 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-900">
                          <div className="font-semibold">
                            Alert Severity:{" "}
                            {currentPreviewNode.alert_severity || "RED"}
                          </div>
                          <div className="mt-1">
                            This is an end node for this category. Click{" "}
                            <strong>Next</strong> to continue.
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6">
                        <button
                          onClick={previewBack}
                          disabled={preview.history.length === 0}
                          className={BTN_OUTLINE}
                        >
                          Back
                        </button>
                        <button
                          onClick={previewNext}
                          className={BTN_PRIMARY}
                          disabled={
                            currentPreviewNode.node_type === "QUESTION" &&
                            !preview.selectedOptionValueByNode[
                              currentPreviewNode.node_key
                            ]
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-xl font-bold text-gray-900">
                      Questionnaire Complete
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Final Alert:{" "}
                      <span className="font-semibold">
                        {results.finalAlert}
                      </span>{" "}
                      • Cat1:{" "}
                      <span className="font-semibold">
                        {results.cat1.alert}
                      </span>{" "}
                      • Cat2:{" "}
                      <span className="font-semibold">
                        {results.cat2.alert}
                      </span>{" "}
                      • Points:{" "}
                      <span className="font-semibold">
                        {results.cat1.totalPoints}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button onClick={previewRestart} className={BTN_OUTLINE}>
                        ↻ Restart
                      </button>
                      <button onClick={closePreview} className={BTN_PRIMARY}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={previewRestart}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  ↻ Restart Preview
                </button>
                <div className="text-xs text-gray-500">
                  This is how patients will see the questionnaire
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
