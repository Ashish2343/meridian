import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
import  'react-datepicker/dist/react-datepicker.css'  

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "meridian",
  description: "video calling",
  icons:{
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-t from-[#0a0a0a] to-black`} 
      // style={{
      //   backgroundColor: "red",
      //   // backgroundRepeat: "no-repeat",
      //   // backgroundPosition: "center",
      //   // backgroundAttachment: "fixed", 
      //   // backgroundSize: "cover"
      //   }}
      >
        {children}
        <Toaster/>  
      </body>
      </ClerkProvider>
    </html>
  );
}
