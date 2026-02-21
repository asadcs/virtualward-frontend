"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

export default function RegisterInternalPatientPage() {
  const router = useRouter();

  // Form state
  const [mrn, setMrn] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [procedure, setProcedure] = useState("");
  const [surgeryDate, setSurgeryDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [demoWorking, setDemoWorking] = useState(false);
  const [deleteWorking, setDeleteWorking] = useState(false);
  const [filling, setFilling] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const anyWorking = submitting || demoWorking || deleteWorking || filling;

  function autoFillDemoForm() {
    setError(null);
    setSuccess(false);

    setFilling(true);
    try {
      setMrn("MRN-DEMO-1001");
      setName("Demo Patient");
      setAge("45");
      setPhone("03001234567");
      setEmail("demo.patient@gmail.com");
      setProcedure("Post-op Monitoring");
      setSurgeryDate("2025-01-10");
      setDischargeDate("2025-01-12");
      setNotes("Auto-filled for demo purposes");
      setSuccess(true);
      setTempPassword("12345678");
      // redirect after success
      setTimeout(() => router.push("/dashboard"), 1200);
    } finally {
      setFilling(false);
    }
  }

  async function resetAndSeedDemo() {
    setError(null);
    setSuccess(false);

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const ok = confirm(
      "This will delete demo patients (test01..test50) and create fresh test01..test10.\n\nContinue?",
    );
    if (!ok) return;

    setDemoWorking(true);
    try {
      const res = await fetch(`${API_BASE}/demo-admin/wipe-and-seed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          count: 10,
          password: "12345678",
          wipe_scope: "TEST_EMAILS", // SAFE
          email_domain: "gmail.com",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to reset & seed demo patients");
      }

      setSuccess(true);
      setTempPassword("12345678");

      // redirect after success
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (e: any) {
      setError(e?.message || "Demo setup failed");
    } finally {
      setDemoWorking(false);
    }
  }

  async function deleteAllPatients() {
    setError(null);
    setSuccess(false);

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const ok = confirm(
      "This will DELETE all demo patients (test01..test50) and related data.\n\nContinue?",
    );
    if (!ok) return;

    setDeleteWorking(true);
    try {
      const res = await fetch(`${API_BASE}/demo-admin/delete-all-patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          scope: "TEST_EMAILS", // SAFE
          email_domain: "gmail.com",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to delete demo patients");
      }

      setSuccess(true);
      setTempPassword("");

      // redirect after success
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setDeleteWorking(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!mrn || !name || !age || !phone || !email) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/patients/register-internal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          mrn,
          name,
          age: parseInt(age, 10),
          phone,
          email,
          procedure: procedure || null,
          surgery_date: surgeryDate || null,
          discharge_date: dischargeDate || null,
          notes: notes || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to register patient");
      }

      setSuccess(true);
      setTempPassword(
        data?.default_password || data?.temporary_password || "12345678",
      );

      // redirect after success
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (e: any) {
      setError(e?.message || "Failed to register patient");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Register Patient</h1>
          <p className="text-lg opacity-90">Welcome to Virtual Ward System!</p>
          <p className="mt-3 opacity-80 text-sm">
            Demo helpers are available during your presentation.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Register Internal Patient
              </h2>
              <p className="text-gray-600 mt-2">
                Patient Type:{" "}
                <span className="font-medium text-teal-600">● Internal</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <div className="text-green-800 font-semibold mb-1">
                  ✅ Success!
                </div>
                {tempPassword ? (
                  <div className="text-green-700 text-sm">
                    Password:{" "}
                    <span className="font-mono font-bold bg-green-100 px-2 py-1 rounded">
                      {tempPassword}
                    </span>
                  </div>
                ) : (
                  <div className="text-green-700 text-sm">
                    Redirecting to dashboard...
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital MRN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mrn}
                      onChange={(e) => setMrn(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="MR123460"
                      required
                      disabled={anyWorking}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Michael Chen"
                        required
                        disabled={anyWorking}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="55"
                        min="0"
                        max="150"
                        required
                        disabled={anyWorking}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="+44 7700 900123"
                        required
                        disabled={anyWorking}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="michael.chen@email.com"
                        required
                        disabled={anyWorking}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                  Medical Information{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    (Optional)
                  </span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure/Surgery
                    </label>
                    <input
                      type="text"
                      value={procedure}
                      onChange={(e) => setProcedure(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="Colorectal resection"
                      disabled={anyWorking}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surgery Date
                      </label>
                      <input
                        type="date"
                        value={surgeryDate}
                        onChange={(e) => setSurgeryDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        disabled={anyWorking}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discharge Date
                      </label>
                      <input
                        type="date"
                        value={dischargeDate}
                        onChange={(e) => setDischargeDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        disabled={anyWorking}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      rows={3}
                      placeholder="Any additional medical information or instructions..."
                      disabled={anyWorking}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={anyWorking}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Registering..." : "Register Patient"}
                </button>

                <button
                  type="button"
                  onClick={autoFillDemoForm}
                  disabled={anyWorking}
                  className="flex-1 px-6 py-3 border-2 border-teal-200 rounded-lg text-teal-700 font-semibold hover:bg-teal-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {filling ? "Filling..." : "⚡ Auto-Fill Demo Form"}
                </button>

                <button
                  type="button"
                  onClick={resetAndSeedDemo}
                  disabled={anyWorking}
                  className="flex-1 px-6 py-3 border-2 border-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Deletes demo emails (test01..test50) then seeds test01..test10"
                >
                  {demoWorking ? "Setting up..." : "🧪 Seed 10 Demo Patients"}
                </button>

                <button
                  type="button"
                  onClick={deleteAllPatients}
                  disabled={anyWorking}
                  className="flex-1 px-6 py-3 border-2 border-red-300 rounded-lg text-red-700 font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Deletes demo emails (test01..test50) and all related data"
                >
                  {deleteWorking
                    ? "Deleting..."
                    : "🗑️ Delete All Demo Patients"}
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  disabled={anyWorking}
                  className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
                >
                  Cancel / Go Back
                </button>
              </div>
            </form>

            <div className="mt-6 text-xs text-gray-500">
              Demo patients: <span className="font-mono">test01@gmail.com</span>{" "}
              …<span className="font-mono">test10@gmail.com</span> (password:{" "}
              <span className="font-mono">12345678</span>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
