"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://virtualwardbackend-production.up.railway.app";

type AttemptDetailItem = {
  node_key: string;
  question: string;
  answer: string;
};

type AttemptDetailResponse = {
  instance_id: number;
  flow_id?: number;
  flow_name: string;
  scheduled_for?: string | null;
  submitted_at?: string | null;
  total_score?: number;
  items: AttemptDetailItem[];
};

function humanDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function PatientAttemptDetailPage() {
  const router = useRouter();
  const params = useParams<{ instanceId: string }>();
  const instanceId = Number(params.instanceId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AttemptDetailResponse | null>(null);

  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }, []);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (!instanceId || Number.isNaN(instanceId)) {
      setError("Invalid attempt id");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/patient/attempts/${instanceId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });

        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.detail || "Failed to load attempt");

        // Ensure shape
        const items = Array.isArray(body?.items) ? body.items : [];
        setData({
          instance_id: body.instance_id ?? instanceId,
          flow_id: body.flow_id,
          flow_name: body.flow_name ?? "Questionnaire",
          scheduled_for: body.scheduled_for ?? null,
          submitted_at: body.submitted_at ?? null,
          total_score: body.total_score ?? undefined,
          items: items.map((x: any) => ({
            node_key: String(x?.node_key ?? ""),
            question: String(x?.question ?? ""),
            answer: String(x?.answer ?? ""),
          })),
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load attempt");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, instanceId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
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
            Back
          </button>

          <div className="text-sm text-gray-500">
            Attempt ID: <span className="font-mono">{instanceId}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center mt-4 text-gray-600">
              Loading attempt details...
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="text-red-700 font-semibold mb-2">Error</div>
            <div className="text-red-600">{error}</div>
          </div>
        ) : !data ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-gray-700">No data found.</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white">
              <div className="text-2xl font-bold">{data.flow_name}</div>
              <div className="mt-2 text-sm opacity-90 flex flex-wrap gap-x-6 gap-y-1">
                <span>
                  Scheduled: <b>{humanDate(data.scheduled_for)}</b>
                </span>
                <span>
                  Submitted: <b>{humanDate(data.submitted_at)}</b>
                </span>
                {typeof data.total_score === "number" && (
                  <span>
                    Score: <b>{data.total_score}</b>
                  </span>
                )}
              </div>
            </div>

            <div className="p-8">
              {data.items.length === 0 ? (
                <div className="text-gray-600">
                  No answered questions found for this attempt.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.items.map((it, idx) => (
                    <div
                      key={`${it.node_key}-${idx}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="text-xs text-gray-500 font-mono mb-2">
                        {it.node_key}
                      </div>
                      <div className="text-base font-semibold text-gray-900 mb-2">
                        {it.question || "(Question text missing)"}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Answer: </span>
                        {it.answer || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
