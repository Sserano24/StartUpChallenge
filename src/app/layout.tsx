import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdX",
  description: "Showcase, fund, and discover student engineering projects.",
  // Optional: sets correct color-scheme for form controls, etc.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" }, // slate-950-ish
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          enableColorScheme
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
