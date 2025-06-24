// app/layout.tsx
import './globals.css'
import { ClientSessionProvider } from "./components/ClientSessionProvider";
import { getServerSession } from "next-auth/next"; // or auth()
import { authOptions } from "@/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html>
      <body>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}

