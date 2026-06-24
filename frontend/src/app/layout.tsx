import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const telugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Legal Aid Portal — Free legal guidance for everyone",
    template: "%s · Legal Aid Portal",
  },
  description:
    "A pro bono initiative offering free, confidential legal guidance. Submit your case, track its status, and talk to a volunteer — no fees, ever.",
  openGraph: {
    title: "Legal Aid Portal",
    description: "Free, confidential legal guidance for those who cannot afford it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${telugu.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
