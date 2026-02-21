"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div>
      <h1>Verify Email</h1>
      <p>{token ? `Token: ${token}` : "Missing verification token"}</p>
    </div>
  );
}

