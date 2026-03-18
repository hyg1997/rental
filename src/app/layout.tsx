import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testingcalibrations.com.pe'),
  title: {
    default: 'Testing Calibrations S.A.C.',
    template: '%s | Testing Calibrations S.A.C.',
  },
  description: 'Servicios de calibracion y venta de equipos de medicion en Peru.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased bg-brand-bg">
        {children}
      </body>
    </html>
  );
}
