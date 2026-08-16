import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arma tus fotos - Rojas Impresiones",
  description: "Creá composiciones fotográficas Super A3 y descargalas en PDF.",
  icons: {
    icon: "/rojas-icon.png",
    shortcut: "/rojas-icon.png",
    apple: "/rojas-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
