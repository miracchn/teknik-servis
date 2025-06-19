import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cepcare | Bilgisayar, Telefon ve Tablet Tamiri",
  description: "Profesyonel ekibimizle İstanbul'da notebook, bilgisayar, iPhone ve iPad tamiri hizmetleri. Aynı gün onarım ve garantili tamir hizmetleri.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
