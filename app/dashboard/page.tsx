"use client";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Welcome to your dashboard, {session.user?.name || session.user?.email}</h1>
      <button onClick={()=>signOut()}>signout</button>
    </div>
  );
}
