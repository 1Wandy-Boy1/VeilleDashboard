// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veille LLM",
  description: "Plateforme de veille IA / LLM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gradient-to-br from-white to-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">🔍 Veille LLM</h1>
            </Link>
            <Navigation />
          </div>
        </header>
        <main className="flex-grow pt-6 pb-12 px-4 sm:px-6 lg:px-8">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">© 2024 Veille LLM. Tous droits réservés.</p>
              <div className="flex gap-6">
                <Link href="/a-propos" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">À propos</Link>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
