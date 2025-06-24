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
        <nav className="flex flex-row items-center  max-h-screen px-5 py-3 bg-black">
          <ul className="flex flex-row items-center justify-center space-x-4">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile" >Profile</a></li>
            <li className=""><a href="" onClick={() => signOut()}>Logout</a></li>
          </ul>
        </nav>
        <h1>Welcome back, {session.user?.name || session.user?.email}</h1>
        <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <div className="">
      <h1>Welcome to Our App</h1>
      <p>This is the public marketing site. Learn how it works.</p>
      <button onClick={() => signIn()}>Login</button>
    </div>  
  );
}
