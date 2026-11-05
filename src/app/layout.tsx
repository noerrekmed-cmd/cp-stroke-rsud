import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CP Stroke Non Perdarahan - RSUD Dr. Soedarso",
  description: "Formulir Clinical Pathway Stroke Non Perdarahan RSUD Dr. Soedarso. Form online untuk pencatatan kegiatan perawatan pasien stroke iskemik/infark.",
  keywords: ["Clinical Pathway", "Stroke", "Non Perdarahan", "RSUD Dr. Soedarso", "Form CP", "Iskemik", "Infark"],
  authors: [{ name: "RSUD Dr. Soedarso" }],
  openGraph: {
    title: "CP Stroke Non Perdarahan - RSUD Dr. Soedarso",
    description: "Form online Clinical Pathway Stroke Non Perdarahan",
    siteName: "RSUD Dr. Soedarso",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
