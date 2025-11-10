import "../styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";

/* ============================
   Layout principale del sito
   ============================ */
export const metadata: Metadata = {
    title: "Lavoro Candidati",
    description: "Piattaforma di gestione candidature e posizioni lavorative",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
        <body className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-surface shadow-card">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/auth/login" className="text-2xl font-semibold text-accent">
                    Lavoro<span className="text-foreground">Candidati</span>
                </Link>

                <nav className="flex gap-4 text-sm">
                    <Link href="/auth/login" className="hover:text-accent">Home</Link>
                    <Link href="/auth/login" className="hover:text-accent">Login</Link>
                    <Link href="/auth/register" className="hover:text-accent">Registrati</Link>
                </nav>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>

        <footer className="mt-12 border-t border-border bg-surface text-center py-4 text-sm text-muted">
            © {new Date().getFullYear()} LavoroCandidati — Tutti i diritti riservati
        </footer>
        </body>
        </html>
    );
}
