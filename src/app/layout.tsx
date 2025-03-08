import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/custom-ui/NavBar";
import { ReactQueryProvider } from "@/providers/ReactQueryProviders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col gap-20`}
      >
        {/* <NavBar menu={"Candidatures"} /> */}

        <main className="py-2 px-4">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
