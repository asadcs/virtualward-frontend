"use client";

import React, { useEffect, useMemo, useState } from "react";

type TemplateStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
type TemplateType =
  | "GENERAL_SURGERY"
  | "COLORECTAL"
  | "CARDIAC"
  | "DIABETES"
  | "ORTHOPEDIC"
  | "OTHER";

type QuestionType =
  | "YES_NO"
  | "NUMBER"
  | "TEXT"
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "SCALE";

type CreatedBy = { id: number; name: string; email: string };

type TemplateListItem = {
  id: number;
  name: string;
  type: TemplateType;
  status: TemplateStatus;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
  question_count: number;
  complete_questions: number;
};

type OptionOut = {
  id: number;
  order: number;
  label: string;
  value: string;
  score: number;
};

type QuestionOut = {
  id: number;
  order: number;
  text: string;
  type: QuestionType;
  required: boolean;
  min_value: number | null;
  max_value: number | null;
  help_text: string | null;
  options: OptionOut[];
};

type TemplateDetail = {
  id: number;
  name: string;
  type: TemplateType;
  status: TemplateStatus;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
  questions: QuestionOut[];
};

type Stats = { total: number; active: number; draft: number; archived: number };

type QuestionIn = {
  order: number;
  text: string;
  type: QuestionType;
  required: boolean;
  min_value: number | null;
  max_value: number | null;
  help_text: string | null;
  options: { order: number; label: string; value: string; score: number }[];
};

type FormState = {
  name: string;
  type: TemplateType;
  status: TemplateStatus;
  questions: QuestionIn[];
};

const TYPES: { value: "" | TemplateType; label: string }[] = [
  { value: "", label: "All" },
  { value: "GENERAL_SURGERY", label: "GENERAL SURGERY" },
  { value: "COLORECTAL", label: "COLORECTAL" },
  { value: "CARDIAC", label: "CARDIAC" },
  { value: "DIABETES", label: "DIABETES" },
  { value: "ORTHOPEDIC", label: "ORTHOPEDIC" },
  { value: "OTHER", label: "OTHER" },
];

const STATUSES: { value: "" | TemplateStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://virtualwardbackend-production.up.railway.app"
  );
}

async function fetchJson<T>(
  url: string,
  opts: { method?: string; token?: string | null; body?: any } = {},
): Promise<T> {
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      data?.detail || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

function Badge({ status }: { status: TemplateStatus }) {
  const map: Record<TemplateStatus, { dot: string; text: string }> = {
    ACTIVE: { dot: "🟢", text: "Active" },
    DRAFT: { dot: "🟡", text: "Draft" },
    ARCHIVED: { dot: "🔴", text: "Archived" },
  };
  const x = map[status];
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <span>{x.dot}</span>
      <span>{x.text}</span>
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={styles.pill}>{children}</span>;
}

function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div style={styles.backdrop} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={styles.btnGhost}>
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function normalizeTypeLabel(t: TemplateType) {
  return t.replaceAll("_", " ");
}

function normalizeQuestionTypeLabel(t: QuestionType) {
  switch (t) {
    case "SINGLE_CHOICE":
      return "Single Choice (MCQ)";
    default:
      return t.replaceAll("_", " ");
  }
}

// --- Demo helpers ---
function demoAnswerForQuestion(q: QuestionOut): string {
  const first = q.options?.[0];
  if (!first) return "Option A";
  return `${first.label} (score ${first.score ?? 0})`;
}

function buildDummyForm(): FormState {
  return {
    name: "Demo Template - Daily Recovery",
    type: "GENERAL_SURGERY",
    status: "DRAFT",
    questions: [
      {
        order: 1,
        text: "Do you have a fever today?",
        type: "SINGLE_CHOICE",
        required: true,
        min_value: null,
        max_value: null,
        help_text: "Choose one option.",
        options: [
          { order: 1, label: "No", value: "no", score: 0 },
          { order: 2, label: "Yes", value: "yes", score: 3 },
        ],
      },
      {
        order: 2,
        text: "Pain score today",
        type: "SINGLE_CHOICE",
        required: true,
        min_value: null,
        max_value: null,
        help_text: null,
        options: [
          { order: 1, label: "0-3 (Mild)", value: "mild", score: 0 },
          { order: 2, label: "4-7 (Moderate)", value: "moderate", score: 2 },
          { order: 3, label: "8-10 (Severe)", value: "severe", score: 5 },
        ],
      },
      {
        order: 3,
        text: "Appetite level",
        type: "SINGLE_CHOICE",
        required: true,
        min_value: null,
        max_value: null,
        help_text: null,
        options: [
          { order: 1, label: "Poor", value: "poor", score: 2 },
          { order: 2, label: "Normal", value: "normal", score: 0 },
          { order: 3, label: "Good", value: "good", score: 0 },
        ],
      },
    ],
  };
}

export default function QuestionnaireTemplateManagement() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const token = useMemo(() => getAccessToken(), []);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
  });

  const [q, setQ] = useState<string>("");
  const [type, setType] = useState<"" | TemplateType>("");
  const [status, setStatus] = useState<"" | TemplateStatus>("");

  const [items, setItems] = useState<TemplateListItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // View modal
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [viewTemplate, setViewTemplate] = useState<TemplateDetail | null>(null);

  // Create/Edit modal
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    type: "OTHER",
    status: "DRAFT",
    questions: [],
  });

  const skip = useMemo(() => (page - 1) * pageSize, [page]);
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total],
  );

  async function loadStats() {
    const data = await fetchJson<Stats>(
      `${apiBaseUrl}/questionnaire-templates/stats`,
      { token },
    );
    setStats(data);
  }

  async function loadList() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (type) params.set("type", type);
      if (status) params.set("status", status);
      params.set("skip", String(skip));
      params.set("limit", String(pageSize));
      params.set("sort", "created_at");
      params.set("order", "desc");

      const data = await fetchJson<{
        total: number;
        items: TemplateListItem[];
      }>(`${apiBaseUrl}/questionnaire-templates/?${params.toString()}`, {
        token,
      });

      setItems(data.items);
      setTotal(data.total);
    } catch (e: any) {
      setError(e?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats().catch((e: any) =>
      setError(e?.message || "Failed to load stats"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, type, status, page]);

  function resetForm() {
    setForm({ name: "", type: "OTHER", status: "DRAFT", questions: [] });
    setEditingId(null);
  }

  async function openView(templateId: number) {
    setError("");
    setViewTemplate(null);
    setViewOpen(true);
    try {
      const t = await fetchJson<TemplateDetail>(
        `${apiBaseUrl}/questionnaire-templates/${templateId}`,
        { token },
      );
      setViewTemplate(t);
    } catch (e: any) {
      setError(e?.message || "Failed to load template");
      setViewOpen(false);
    }
  }

  async function openEdit(templateId: number) {
    setError("");
    try {
      const t = await fetchJson<TemplateDetail>(
        `${apiBaseUrl}/questionnaire-templates/${templateId}`,
        { token },
      );
      setEditingId(t.id);

      setForm({
        name: t.name,
        type: t.type,
        status: t.status,
        questions: (t.questions || []).map((qq) => ({
          order: qq.order,
          text: qq.text,
          type: "SINGLE_CHOICE",
          required: qq.required,
          min_value: null,
          max_value: null,
          help_text: qq.help_text ?? null,
          options:
            (qq.options || []).length >= 2
              ? (qq.options || []).map((o) => ({
                  order: o.order,
                  label: o.label,
                  value: o.value,
                  score: Number.isFinite(o.score) ? o.score : 0,
                }))
              : [
                  { order: 1, label: "Option 1", value: "option_1", score: 0 },
                  { order: 2, label: "Option 2", value: "option_2", score: 0 },
                ],
        })),
      });

      setEditOpen(true);
    } catch (e: any) {
      setError(e?.message || "Failed to load template for edit");
    }
  }

  function openCreate() {
    resetForm();
    setEditOpen(true);
  }

  function loadDummyIntoForm() {
    setForm(buildDummyForm());
  }

  async function seedDemoTemplates() {
    if (!window.confirm("Add 5 demo templates with questions?")) return;
    setError("");
    try {
      await fetchJson(
        `${apiBaseUrl}/questionnaire-templates/demo/seed?count=5`,
        {
          method: "POST",
          token,
        },
      );
      setPage(1);
      await loadStats();
      await loadList();
    } catch (e: any) {
      setError(e?.message || "Failed to add demo templates");
    }
  }

  async function clearAllTemplates() {
    if (
      !window.confirm(
        "Delete ALL templates? (Soft delete)\n\nThis is for DEMO reset.",
      )
    )
      return;
    setError("");
    try {
      await fetchJson(`${apiBaseUrl}/questionnaire-templates/demo/clear`, {
        method: "DELETE",
        token,
      });
      setPage(1);
      await loadStats();
      await loadList();
    } catch (e: any) {
      setError(e?.message || "Failed to delete all templates");
    }
  }

  function updateQuestion(idx: number, patch: Partial<QuestionIn>) {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[idx] = { ...questions[idx], ...patch };
      questions[idx].type = "SINGLE_CHOICE";
      questions[idx].min_value = null;
      questions[idx].max_value = null;
      return { ...prev, questions };
    });
  }

  function addQuestion() {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          order: prev.questions.length + 1,
          text: "",
          type: "SINGLE_CHOICE",
          required: true,
          min_value: null,
          max_value: null,
          help_text: null,
          options: [
            { order: 1, label: "Option 1", value: "option_1", score: 0 },
            { order: 2, label: "Option 2", value: "option_2", score: 0 },
          ],
        },
      ],
    }));
  }

  function removeQuestion(idx: number) {
    setForm((prev) => {
      const questions = prev.questions
        .filter((_, i) => i !== idx)
        .map((q, i) => ({ ...q, order: i + 1 }));
      return { ...prev, questions };
    });
  }

  function addOption(qIdx: number) {
    setForm((prev) => {
      const questions = [...prev.questions];
      const q = { ...questions[qIdx] };
      const opts = [...(q.options || [])];
      opts.push({ order: opts.length + 1, label: "", value: "", score: 0 });
      q.options = opts;
      questions[qIdx] = q;
      return { ...prev, questions };
    });
  }

  function updateOption(
    qIdx: number,
    oIdx: number,
    patch: Partial<{
      label: string;
      value: string;
      order: number;
      score: number;
    }>,
  ) {
    setForm((prev) => {
      const questions = [...prev.questions];
      const q = { ...questions[qIdx] };
      const opts = [...(q.options || [])];
      opts[oIdx] = { ...opts[oIdx], ...patch };
      q.options = opts;
      questions[qIdx] = q;
      return { ...prev, questions };
    });
  }

  function removeOption(qIdx: number, oIdx: number) {
    setForm((prev) => {
      const questions = [...prev.questions];
      const q = { ...questions[qIdx] };
      const current = q.options || [];
      if (current.length <= 2) return prev;
      const opts = current
        .filter((_, i) => i !== oIdx)
        .map((o, i) => ({ ...o, order: i + 1 }));
      q.options = opts;
      questions[qIdx] = q;
      return { ...prev, questions };
    });
  }

  async function saveTemplate() {
    setError("");
    try {
      if (!form.name.trim()) throw new Error("Template name is required");

      for (let i = 0; i < form.questions.length; i++) {
        const q = form.questions[i];
        if (!q.text.trim())
          throw new Error(`Question #${i + 1} text is required`);
        if (!q.options || q.options.length < 2) {
          throw new Error(`Question #${i + 1} must have at least 2 options`);
        }
        for (let j = 0; j < q.options.length; j++) {
          const o = q.options[j];
          if (!o.label.trim() || !o.value.trim()) {
            throw new Error(
              `Question #${i + 1} option #${j + 1}: label and value required`,
            );
          }
          if (!Number.isFinite(o.score)) {
            throw new Error(
              `Question #${i + 1} option #${j + 1}: score must be a number`,
            );
          }
        }
      }

      const payload = {
        name: form.name,
        type: form.type,
        status: form.status,
        questions: form.questions.map((qq) => ({
          order: qq.order,
          text: qq.text,
          type: "SINGLE_CHOICE",
          required: !!qq.required,
          min_value: null,
          max_value: null,
          help_text: qq.help_text,
          options: (qq.options || []).map((o) => ({
            order: o.order,
            label: o.label,
            value: o.value,
            score: Number(o.score || 0),
          })),
        })),
      };

      if (editingId) {
        await fetchJson(`${apiBaseUrl}/questionnaire-templates/${editingId}`, {
          method: "PUT",
          token,
          body: payload,
        });
      } else {
        await fetchJson(`${apiBaseUrl}/questionnaire-templates/`, {
          method: "POST",
          token,
          body: payload,
        });
      }

      setEditOpen(false);
      resetForm();
      await loadStats();
      await loadList();
    } catch (e: any) {
      setError(e?.message || "Failed to save template");
    }
  }

  async function archiveTemplate(id: number) {
    if (!window.confirm("Archive this template?")) return;
    setError("");
    try {
      await fetchJson(`${apiBaseUrl}/questionnaire-templates/${id}/archive`, {
        method: "POST",
        token,
      });
      await loadStats();
      await loadList();
    } catch (e: any) {
      setError(e?.message || "Failed to archive template");
    }
  }

  async function deleteTemplate(id: number) {
    if (!window.confirm("Delete this template? (Soft delete)")) return;
    setError("");
    try {
      await fetchJson(`${apiBaseUrl}/questionnaire-templates/${id}`, {
        method: "DELETE",
        token,
      });
      await loadStats();
      await loadList();
    } catch (e: any) {
      setError(e?.message || "Failed to delete template");
    }
  }

  function printView() {
    window.print();
  }

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.brand}>Virtual Ward System</div>
          <div style={styles.subtitle}>Questionnaire Template Management</div>
        </div>
        <div style={styles.userBox}>
          <span>👤 Admin</span>
          <button style={styles.btn}>Logout</button>
        </div>
      </div>

      <div style={styles.sectionTitleRow}>
        <h2 style={{ margin: 0 }}>Questionnaire Templates</h2>
        <div style={{ color: "#555" }}>{new Date().toDateString()}</div>
      </div>

      <div style={styles.statsCard}>
        <div style={styles.statsHeader}>📊 Quick Stats</div>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <div>📋 Total</div>
            <div style={styles.statNumber}>{stats.total}</div>
          </div>
          <div style={styles.statBox}>
            <div>✅ Active</div>
            <div style={styles.statNumber}>{stats.active}</div>
          </div>
          <div style={styles.statBox}>
            <div>📝 Draft</div>
            <div style={styles.statNumber}>{stats.draft}</div>
          </div>
          <div style={styles.statBox}>
            <div>🗑️ Archived</div>
            <div style={styles.statNumber}>{stats.archived}</div>
          </div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={openCreate} style={styles.btnPrimary}>
            + Create New Template
          </button>
          <button onClick={seedDemoTemplates} style={styles.btn}>
            ➕ Add 5 Demo Templates
          </button>
          <button onClick={clearAllTemplates} style={styles.btnDanger}>
            🧹 Delete All Templates
          </button>
        </div>

        <div style={styles.filters}>
          <label style={styles.label}>
            Search:
            <input
              style={styles.input}
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search by template name..."
            />
          </label>

          <label style={styles.label}>
            Type:
            <select
              style={styles.select}
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value as any);
              }}
            >
              {TYPES.map((t) => (
                <option key={t.label} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Status:
            <select
              style={styles.select}
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as any);
              }}
            >
              {STATUSES.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <div style={styles.errorBox}>⚠️ {error}</div> : null}

      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Template Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Questions</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={styles.td}>
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.td}>
                    No templates found.
                  </td>
                </tr>
              ) : (
                items.map((t, idx) => (
                  <tr key={t.id}>
                    <td style={styles.td}>{skip + idx + 1}</td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 800 }}>{t.name}</div>
                      <div style={{ color: "#666", fontSize: 12 }}>
                        Created: {new Date(t.created_at).toLocaleDateString()}{" "}
                        &nbsp;|&nbsp; By: {t.created_by?.name || "—"}
                      </div>
                    </td>
                    <td style={styles.td}>{normalizeTypeLabel(t.type)}</td>
                    <td style={styles.td}>
                      {t.complete_questions}/{t.question_count}{" "}
                      {t.complete_questions === t.question_count ? "✅" : "⚠️"}
                    </td>
                    <td style={styles.td}>
                      <Badge status={t.status} />
                    </td>
                    <td style={styles.td}>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <button
                          style={styles.btn}
                          onClick={() => openView(t.id)}
                        >
                          View
                        </button>
                        <button
                          style={styles.btn}
                          onClick={() => openEdit(t.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.btn}
                          onClick={() => archiveTemplate(t.id)}
                        >
                          Archive
                        </button>
                        <button
                          style={styles.btnDanger}
                          onClick={() => deleteTemplate(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.pagination}>
          <div>
            Showing {items.length ? skip + 1 : 0}-{skip + items.length} of{" "}
            {total}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              style={styles.btn}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} / {pageCount}
            </span>
            <button
              style={styles.btn}
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* VIEW */}
      <Modal
        title="Questionnaire Preview"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
      >
        {!viewTemplate ? (
          <div style={{ color: "#666" }}>Loading questionnaire...</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={styles.previewHeader}>
              <div>
                <div style={styles.previewTitle}>{viewTemplate.name}</div>
                <div style={styles.previewMeta}>
                  <Pill>Type: {normalizeTypeLabel(viewTemplate.type)}</Pill>
                  <Pill>Status: {viewTemplate.status}</Pill>
                  <Pill>Questions: {viewTemplate.questions?.length || 0}</Pill>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={styles.btn} onClick={printView}>
                  🖨️ Print
                </button>
              </div>
            </div>

            <div style={styles.previewCard}>
              <div style={styles.previewCardTitle}>
                Questions & Option Scores
              </div>
              <div style={{ color: "#666", fontSize: 13, marginTop: -6 }}>
                Scoring is stored per option (score column in DB).
              </div>

              <div style={styles.previewTableWrap}>
                <table style={styles.previewTable}>
                  <thead>
                    <tr>
                      <th style={styles.previewTh}>#</th>
                      <th style={styles.previewTh}>Question</th>
                      <th style={styles.previewTh}>Type</th>
                      <th style={styles.previewTh}>Options (with score)</th>
                      <th style={styles.previewTh}>Demo Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewTemplate.questions || [])
                      .slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((qq, i) => {
                        const options = qq.options?.length
                          ? qq.options
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((o) => `${o.label} (score ${o.score ?? 0})`)
                              .join(", ")
                          : "—";

                        return (
                          <tr key={qq.id ?? i}>
                            <td style={styles.previewTdNum}>{i + 1}</td>
                            <td style={styles.previewTd}>
                              <div style={{ fontWeight: 700, color: "#222" }}>
                                {qq.text}
                              </div>
                              {qq.help_text ? (
                                <div
                                  style={{
                                    marginTop: 4,
                                    color: "#666",
                                    fontSize: 12,
                                  }}
                                >
                                  {qq.help_text}
                                </div>
                              ) : null}
                            </td>
                            <td style={styles.previewTd}>
                              <Pill>{normalizeQuestionTypeLabel(qq.type)}</Pill>
                            </td>
                            <td style={styles.previewTd}>
                              <div style={{ color: "#333" }}>{options}</div>
                            </td>
                            <td style={styles.previewTd}>
                              <div style={styles.answerBox}>
                                {demoAnswerForQuestion(qq)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* CREATE / EDIT */}
      <Modal
        title={editingId ? "Edit Template" : "Create Template"}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <label style={styles.labelCol}>
            Template Name
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </label>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <label style={styles.labelCol}>
              Type
              <select
                style={styles.select}
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value as TemplateType,
                  }))
                }
              >
                {TYPES.filter((x) => x.value !== "").map((t) => (
                  <option key={t.label} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.labelCol}>
              Status
              <select
                style={styles.select}
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as TemplateStatus,
                  }))
                }
              >
                {STATUSES.filter((x) => x.value !== "").map((s) => (
                  <option key={s.label} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.hr} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }}>Questions</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!editingId ? (
                <button style={styles.btn} onClick={loadDummyIntoForm}>
                  ⚡ Load Dummy Data
                </button>
              ) : null}
              <button style={styles.btn} onClick={addQuestion}>
                + Add Question
              </button>
            </div>
          </div>

          {form.questions.length === 0 ? (
            <div style={{ color: "#666" }}>No questions yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {form.questions.map((qq, idx) => (
                <div key={idx} style={styles.questionCard}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>Q{idx + 1}</div>
                    <button
                      style={styles.btnDanger}
                      onClick={() => removeQuestion(idx)}
                    >
                      Remove
                    </button>
                  </div>

                  <label style={styles.labelCol}>
                    Question Text
                    <input
                      style={styles.input}
                      value={qq.text}
                      onChange={(e) =>
                        updateQuestion(idx, { text: e.target.value })
                      }
                    />
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <label style={styles.labelCol}>
                      Type (forced)
                      <select
                        style={styles.select}
                        value="SINGLE_CHOICE"
                        disabled
                      >
                        <option value="SINGLE_CHOICE">
                          SINGLE CHOICE (MCQ)
                        </option>
                      </select>
                    </label>

                    <label style={styles.labelCol}>
                      Required
                      <select
                        style={styles.select}
                        value={qq.required ? "yes" : "no"}
                        onChange={(e) =>
                          updateQuestion(idx, {
                            required: e.target.value === "yes",
                          })
                        }
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>

                    <label style={styles.labelCol}>
                      Order
                      <input
                        style={styles.input}
                        type="number"
                        value={qq.order}
                        onChange={(e) =>
                          updateQuestion(idx, { order: Number(e.target.value) })
                        }
                      />
                    </label>
                  </div>

                  {/* Options */}
                  <div style={{ display: "grid", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        Options (label/value/score)
                      </div>
                      <button style={styles.btn} onClick={() => addOption(idx)}>
                        + Add Option
                      </button>
                    </div>

                    {(qq.options || []).map((o, oIdx) => (
                      <div
                        key={oIdx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 140px auto",
                          gap: 8,
                        }}
                      >
                        <input
                          style={styles.input}
                          placeholder="Label"
                          value={o.label}
                          onChange={(e) =>
                            updateOption(idx, oIdx, { label: e.target.value })
                          }
                        />
                        <input
                          style={styles.input}
                          placeholder="Value"
                          value={o.value}
                          onChange={(e) =>
                            updateOption(idx, oIdx, { value: e.target.value })
                          }
                        />
                        <input
                          style={styles.input}
                          placeholder="Score"
                          type="number"
                          value={Number.isFinite(o.score) ? o.score : 0}
                          onChange={(e) =>
                            updateOption(idx, oIdx, {
                              score: Number(e.target.value),
                            })
                          }
                        />
                        <button
                          style={styles.btnDanger}
                          onClick={() => removeOption(idx, oIdx)}
                          disabled={(qq.options || []).length <= 2}
                          title={
                            (qq.options || []).length <= 2
                              ? "At least 2 options required"
                              : "Remove"
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <label style={styles.labelCol}>
                    Help Text (optional)
                    <textarea
                      style={styles.textarea}
                      value={qq.help_text ?? ""}
                      onChange={(e) =>
                        updateQuestion(idx, {
                          help_text: e.target.value || null,
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={styles.btn} onClick={() => setEditOpen(false)}>
              Cancel
            </button>
            <button
              style={styles.btnPrimary}
              onClick={saveTemplate}
              disabled={!form.name.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 18,
    fontFamily: "system-ui, Arial",
    background: "#f6f7fb",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  brand: { fontWeight: 900, fontSize: 18 },
  subtitle: { color: "#555" },
  userBox: { display: "flex", gap: 10, alignItems: "center" },

  sectionTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },

  statsCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: 14,
  },
  statsHeader: { fontWeight: 800, marginBottom: 10 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  statBox: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    background: "#fafafa",
  },
  statNumber: { fontSize: 28, fontWeight: 900, marginTop: 6 },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filters: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  label: { display: "flex", gap: 8, alignItems: "center", color: "#333" },
  labelCol: { display: "grid", gap: 6, color: "#333" },

  input: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    minWidth: 220,
  },
  select: { padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" },
  textarea: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    minHeight: 70,
  },

  tableCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: 10,
    borderBottom: "1px solid #eee",
    color: "#444",
  },
  td: { padding: 10, borderBottom: "1px solid #f0f0f0", verticalAlign: "top" },

  pagination: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },

  btn: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnGhost: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #1f6feb",
    background: "#1f6feb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnDanger: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1242f",
    background: "#fff",
    color: "#d1242f",
    cursor: "pointer",
    fontWeight: 700,
  },

  errorBox: {
    background: "#fff3cd",
    border: "1px solid #ffecb5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  hr: { height: 1, background: "#eee", margin: "8px 0" },

  questionCard: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "#fafafa",
  },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: "min(1100px, 100%)",
    maxHeight: "85vh",
    overflow: "auto",
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    background: "#f7fbff",
    border: "1px solid #dbeafe",
    padding: 12,
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "#111",
    marginBottom: 6,
  },
  previewMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },
  previewCard: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "#fff",
  },
  previewCardTitle: { fontWeight: 900, marginBottom: 8, color: "#111" },

  previewTableWrap: { overflowX: "auto", marginTop: 10 },
  previewTable: { width: "100%", borderCollapse: "collapse" },
  previewTh: {
    textAlign: "left",
    padding: 10,
    borderBottom: "1px solid #eee",
    color: "#374151",
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  previewTd: {
    padding: 10,
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "top",
    fontSize: 13,
  },
  previewTdNum: {
    padding: 10,
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "top",
    fontWeight: 900,
    color: "#111",
    width: 40,
  },
  answerBox: {
    border: "1px dashed #c7d2fe",
    background: "#eef2ff",
    borderRadius: 10,
    padding: 10,
    fontWeight: 800,
    color: "#1f2937",
  },
};
