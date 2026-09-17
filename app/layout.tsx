import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legií 2044 | Činžovní dům ve Varnsdorfu",
  description: "Dům po rozsáhlé rekonstrukci: 9 bytů, 2 obchody a půdní prostor. Prodej domu jako celku.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">{children}</body>
    </html>
  );
}
