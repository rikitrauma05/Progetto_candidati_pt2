import "@/styles/globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import NavLinks from "./NavLinks";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
    title: "CANDID - AI",
    description: "Piattaforma candidature e test",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
        <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        <div className="min-h-dvh flex flex-col">
            <header className="border-b border-border bg-black/70 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Candid<span className="text-blue-500">AI</span>
                    </Link>

                    <nav className="flex items-center gap-2 text-sm">
                        <NavLinks />
                    </nav>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
                {/* Tutte le pagine passano da qui:
                           - PUBLIC_ROUTES (/, /auth/login, /auth/register) passano libere
                           - /candidati/** richiede ruolo CANDIDATO
                           - /hr/** richiede ruolo HR
                           - se non autenticato su rotta privata → redirect a /auth/login
                        */}
                <AuthGuard>{children}</AuthGuard>
            </main>
        </div>
        </body>
        </html>
    );
}
