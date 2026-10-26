import type { Metadata } from "next";
import { Bebas_Neue, Rethink_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import PageTransitionHandler from "@/components/page-transition-handler";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="69f8a523-acd9-4cb7-8cc3-c9dfe85cfcfd"
          />
        )}
      </head>
      <body
        className={`${bebasNeue.variable} ${rethinkSans.variable} antialiased`}
      > 
        {children}
        <PageTransitionHandler />
      </body>
    </html>
  );
}
