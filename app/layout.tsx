// app/layout.tsx
import "./globals.css";
import { ClientSessionProvider } from "./components/ClientSessionProvider";
import { getServerSession } from "next-auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(); // no need to pass authOptions

  return (
    <html lang="en">
      <body>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
