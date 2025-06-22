// This file is part of the Next.js application and handles the login page.
// It allows users to sign in using GitHub or Google authentication providers.
"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  return (
    <main>
      <h1>Sign in</h1>
      <button onClick={() => signIn("github", { callbackUrl })}>
        Sign in with GitHub
      </button>
      <button onClick={() => signIn("google", { callbackUrl })}>
        Sign in with Google
      </button>
    </main>
  );
}
