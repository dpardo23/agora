import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";

// Fuentes de docs/diseno/sistema-de-diseno.md, sección 3. Bricolage se carga como fuente variable para poder usar
// el eje óptico «opsz» (next/font no admite ejes junto con pesos fijos).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Solo se usa dentro de la Oficina del Olimpo: no se precarga en las demás páginas.
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "Ágora", template: "%s · Ágora" },
  description: "Plataforma universitaria personal.",
  applicationName: "Ágora",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-BO"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} ${pixelify.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
