import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "sonner";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {ReactNode} from "react";
import {Analytics} from "@vercel/analytics/next";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remote Radar – Intelligent Remote Job Scanner & AI Application Assistant",
  description: "Continuously discover, track, and apply to remote jobs with AI-powered resume tailoring and cover letter generation.",
  keywords: [
    "remote jobs",
    "job scraper",
    "AI resume",
    "cover letter",
    "job tracker",
    "RemoteRadar",
    "Next.js",
    "automation",
    "sourcing"
  ],
  authors: [
    { 
      name: "Sherard Dalaguit", 
      url: "https://sherarddalaguit.com" 
    }
  ],
  creator: "Sherard Dalaguit",
  publisher: "RemoteRadar Inc.",
  icons: {
    icon: "/logo.png",
  }
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={`${poppins.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
						<Analytics />
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}

export default RootLayout;
