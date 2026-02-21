// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://virtualwardbackend-production.up.railway.app";

// type RoleItem = { id: number; name: string };
// type RolesResponse = { items: RoleItem[] };

// export default function RegisterPage() {
//   const [roles, setRoles] = useState<RoleItem[]>([]);
//   const [loadingRoles, setLoadingRoles] = useState(true);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [roleId, setRoleId] = useState<number | "">("");

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [createdUserId, setCreatedUserId] = useState<number | null>(null);
//   const [devVerifyToken, setDevVerifyToken] = useState<string | null>(null);

//   const canSubmit = useMemo(() => {
//     return (
//       name.trim().length > 0 &&
//       email.trim().length > 0 &&
//       password.length >= 8 &&
//       roleId !== "" &&
//       !submitting
//     );
//   }, [name, email, password, roleId, submitting]);

//   useEffect(() => {
//     let alive = true;

//     async function loadRoles() {
//       try {
//         setLoadingRoles(true);
//         const res = await fetch(`${API_BASE}/roles/`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           cache: "no-store",
//         });

//         // roles endpoint is public in your backend code
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || `Failed to load roles (${res.status})`);
//         }

//         const data = (await res.json()) as RolesResponse;
//         if (alive) setRoles(data.items ?? []);
//       } catch (e: any) {
//         if (alive) setError(e?.message ?? "Failed to load roles");
//       } finally {
//         if (alive) setLoadingRoles(false);
//       }
//     }

//     loadRoles();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setCreatedUserId(null);
//     setDevVerifyToken(null);

//     if (roleId === "") {
//       setError("Please select a role.");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // 1) Register user
//       const registerRes = await fetch(`${API_BASE}/users/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           email: email.trim(),
//           password,
//         }),
//       });

//       const registerBody = await registerRes.json().catch(() => null);

//       if (!registerRes.ok) {
//         const msg =
//           registerBody?.detail ||
//           registerBody?.message ||
//           `Register failed (${registerRes.status})`;
//         throw new Error(msg);
//       }

//       const userId: number = registerBody.user_id;
//       const verifyToken: string = registerBody.dev_email_verification_token;

//       setCreatedUserId(userId);
//       setDevVerifyToken(verifyToken);

//       // 2) Assign role
//       const assignRes = await fetch(`${API_BASE}/users/assign-role`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           role_id: roleId,
//         }),
//       });

//       const assignBody = await assignRes.json().catch(() => null);

//       if (!assignRes.ok) {
//         const msg =
//           assignBody?.detail ||
//           assignBody?.message ||
//           `Role assign failed (${assignRes.status})`;
//         throw new Error(msg);
//       }
//     } catch (e: any) {
//       setError(e?.message ?? "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
//       <div className="mx-auto max-w-xl px-6 py-14">
//         <div className="mb-8">
//           <h1 className="text-3xl font-semibold tracking-tight">
//             Create account
//           </h1>
//           <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//             Register, pick a role, then verify your email.
//           </p>
//         </div>

//         <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
//           {error && (
//             <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
//               {error}
//             </div>
//           )}

//           <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Full name</label>
//               <input
//                 className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Fahad"
//                 autoComplete="name"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Email</label>
//               <input
//                 className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Password</label>
//               <input
//                 className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Min 8 chars"
//                 type="password"
//                 autoComplete="new-password"
//               />
//               <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
//                 Password must be 8–72 characters (bcrypt limit).
//               </p>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Role</label>
//               <select
//                 className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:focus:ring-white/10"
//                 value={roleId}
//                 onChange={(e) =>
//                   setRoleId(e.target.value ? Number(e.target.value) : "")
//                 }
//                 disabled={loadingRoles}
//               >
//                 <option value="">
//                   {loadingRoles ? "Loading roles..." : "Select a role"}
//                 </option>
//                 {roles.map((r) => (
//                   <option key={r.id} value={r.id}>
//                     {r.name}
//                   </option>
//                 ))}
//               </select>
//               <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
//                 Roles are loaded from <code className="px-1">GET /roles/</code>
//               </p>
//             </div>

//             <button
//               type="submit"
//               disabled={!canSubmit}
//               className="w-full rounded-xl bg-black px-4 py-2 text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
//             >
//               {submitting ? "Creating..." : "Create account"}
//             </button>
//           </form>

//           {createdUserId && devVerifyToken && (
//             <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
//               <div className="font-medium">Account created ✅</div>
//               <div className="mt-2 space-y-1 text-zinc-700 dark:text-zinc-200">
//                 <div>
//                   <span className="font-medium">User ID:</span> {createdUserId}
//                 </div>
//                 <div className="break-all">
//                   <span className="font-medium">Dev verify token:</span>{" "}
//                   <code className="px-1">{devVerifyToken}</code>
//                 </div>
//                 <div className="pt-2">
//                   Go verify email here:{" "}
//                   <Link
//                     className="underline"
//                     href={`/verify-email?token=${encodeURIComponent(
//                       devVerifyToken
//                     )}`}
//                   >
//                     Verify Email
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
//             Already have an account?{" "}
//             <Link
//               className="font-medium text-zinc-900 underline dark:text-zinc-50"
//               href="/login"
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://virtualwardbackend-production.up.railway.app";

type RoleItem = { id: number; name: string };
type RolesResponse = { items: RoleItem[] };

export default function RegisterPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roleId, setRoleId] = useState<number | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [devVerifyToken, setDevVerifyToken] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      roleId !== "" &&
      !submitting
    );
  }, [name, email, password, roleId, submitting]);

  useEffect(() => {
    let alive = true;

    async function loadRoles() {
      try {
        setLoadingRoles(true);
        const res = await fetch(`${API_BASE}/roles/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to load roles (${res.status})`);
        }

        const data = (await res.json()) as RolesResponse;
        if (alive) setRoles(data.items ?? []);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load roles");
      } finally {
        if (alive) setLoadingRoles(false);
      }
    }

    loadRoles();
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreatedUserId(null);
    setDevVerifyToken(null);

    if (roleId === "") {
      setError("Please select a role.");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Register user
      const registerRes = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const registerBody = await registerRes.json().catch(() => null);

      if (!registerRes.ok) {
        const msg =
          registerBody?.detail ||
          registerBody?.message ||
          `Register failed (${registerRes.status})`;
        throw new Error(msg);
      }

      const userId: number = registerBody.user_id;
      const verifyToken: string = registerBody.dev_email_verification_token;

      setCreatedUserId(userId);
      setDevVerifyToken(verifyToken);

      // 2) Assign role
      const assignRes = await fetch(`${API_BASE}/users/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          role_id: roleId,
        }),
      });

      const assignBody = await assignRes.json().catch(() => null);

      if (!assignRes.ok) {
        const msg =
          assignBody?.detail ||
          assignBody?.message ||
          `Role assign failed (${assignRes.status})`;
        throw new Error(msg);
      }
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Teal Background */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-teal-500 to-teal-600 p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Create Account</h1>
          <p className="text-lg text-teal-50 mb-8">
            Welcome to Virtual Ward System!
          </p>
          <div className="space-y-4 text-teal-50">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">
                  Easy Registration
                </div>
                <div className="text-sm">
                  Create your account in just a few steps
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">Secure & Private</div>
                <div className="text-sm">
                  Your data is protected with industry-standard encryption
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <div className="font-semibold text-white">
                  Email Verification
                </div>
                <div className="text-sm">
                  Verify your email to activate your account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium mb-6"
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
              Back to Login
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              Register New Account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Create your account and select your role
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
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
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {createdUserId && devVerifyToken && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-green-900">
                    Account Created Successfully!
                  </div>
                  <div className="text-sm text-green-700">
                    Please verify your email to continue
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-green-800 mb-4">
                <div>
                  <span className="font-medium">User ID:</span> {createdUserId}
                </div>
                <div className="break-all">
                  <span className="font-medium">Verification Token:</span>{" "}
                  <code className="bg-green-100 px-2 py-1 rounded text-xs">
                    {devVerifyToken}
                  </code>
                </div>
              </div>

              <Link
                href={`/verify-email?token=${encodeURIComponent(devVerifyToken)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Verify Email Now
              </Link>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Password must be 8–72 characters long
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Account Type
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={roleId}
                    onChange={(e) =>
                      setRoleId(e.target.value ? Number(e.target.value) : "")
                    }
                    disabled={loadingRoles}
                  >
                    <option value="">
                      {loadingRoles ? "Loading roles..." : "Select your role"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Select the role that best describes your position
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-700"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
