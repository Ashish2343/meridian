"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Sync user with backend DB when session is available
  useEffect(() => {
    if (session) {
      fetch("/api/login", { method: "GET" });
    }
  }, [session]);

  if (session) {
    return (
      <div>
        <nav className="flex flex-row items-center px-5 py-3 bg-black text-white">
          <ul className="flex flex-row items-center justify-center space-x-4">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li>
              <button onClick={() => signOut()}>Logout</button>
            </li>
          </ul>
        </nav>

        <main className="p-4">
          <h1 className="text-xl font-bold">Welcome back, {session.user?.name || session.user?.email}</h1>
          <div className="mt-4 space-x-2">
            <button onClick={() => router.push("/dashboard")} className="bg-blue-600 text-white px-4 py-2 rounded">Go to Dashboard</button>
            <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Our App</h1>
      <p className="text-gray-600 mb-4">This is the public marketing site. Learn how it works.</p>
      <button onClick={() => signIn()} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
}
