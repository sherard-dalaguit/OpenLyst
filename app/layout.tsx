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
  metadataBase: new URL("https://www.openlyst.io"),
  title: {
    default: "OpenLyst – Curated Remote Jobs",
    template: "%s | OpenLyst",
  },
  description:
    "OpenLyst helps you discover curated remote jobs across engineering, design, product, and more. Updated daily with powerful filters and email digests.",
  keywords: [
    "remote jobs",
    "work from anywhere",
    "remote engineering jobs",
    "remote design jobs",
    "remote product management jobs",
    "job board",
    "remote work",
    "digital nomad jobs",
  ],
  authors: [
    {
      name: "Sherard Dalaguit",
      url: "https://sherarddalaguit.com"
    }
  ],
  creator: "Sherard Dalaguit",
  publisher: "OpenLyst",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.openlyst.io",
    siteName: "OpenLyst",
    title: "OpenLyst – Curated Remote Jobs",
    description:
      "OpenLyst helps you discover curated remote jobs across engineering, design, product, and more. Updated daily with powerful filters and email digests.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "OpenLyst",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "OpenLyst – Curated Remote Jobs",
    description:
      "OpenLyst helps you discover curated remote jobs across engineering, design, product, and more. Updated daily with powerful filters and email digests.",
    images: ["/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OpenLyst",
  url: "https://www.openlyst.io",
  description: "OpenLyst helps you discover curated remote jobs across engineering, design, product, and more. Updated daily with powerful filters and email digests.",
  publisher: {
    "@type": "Organization",
    name: "OpenLyst",
    url: "https://www.openlyst.io",
    logo: {
      "@type": "ImageObject",
      url: "https://www.openlyst.io/logo.png",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.openlyst.io/jobs?query={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={`${poppins.className} antialiased`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
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
