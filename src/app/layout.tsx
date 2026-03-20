import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testingcalibrations.com.pe'),
  title: {
    default: 'Testing Calibrations S.A.C. | Ingeniería y Metrología de Precisión',
    template: '%s | Testing Calibrations S.A.C.',
  },
  description: 'Laboratorio especializado en calibración metrológica bajo la norma NTP ISO/IEC 17025.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={plusJakarta.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
