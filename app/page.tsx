"use client";
// this is the main entry point
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div>
        <h1>Welcome back, {session.user?.name || session.user?.email}</h1>
        <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <p>This is the public marketing site. Learn how it works.</p>
      <button onClick={() => signIn()}>Login</button>
    </div>
  );
}
