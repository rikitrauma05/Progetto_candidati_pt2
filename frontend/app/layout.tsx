import "@/styles/globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lavoro_Candidati",
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
                    <Link href="/" className="text-lg font-semibold tracking-tight">
                        Candid<span className="text-blue-500">AI</span>
                    </Link>

                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            href="/"
                            className="rounded-full px-3 py-1.5 text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Home
                        </Link>

                        <Link
                            href="/candidati/posizioni"
                            className="rounded-full px-3 py-1.5 text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Posizioni
                        </Link>

                        <Link
                            href="/candidati/candidature"
                            className="rounded-full px-3 py-1.5 text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Candidature
                        </Link>

                        <Link
                            href="/candidati/test"
                            className="rounded-full px-3 py-1.5 text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Test
                        </Link>

                        <Link
                            href="/candidati/profili"
                            className="rounded-full px-3 py-1.5 text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Profilo
                        </Link>

                        <span className="mx-1 h-5 w-px bg-border" />

                        <Link
                            href="/auth/login"
                            className="rounded-full px-3 py-1.5 text-xs text-muted hover:bg-white/5 hover:text-[var(--foreground)] transition"
                        >
                            Login
                        </Link>

                        <Link
                            href="/auth/register"
                            className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-600 transition"
                        >
                            Registrati
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}
