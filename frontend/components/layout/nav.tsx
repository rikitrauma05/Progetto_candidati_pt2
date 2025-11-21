"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function Nav() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuthStore();

    const ruolo = user?.ruolo; // 'CANDIDATO' | 'HR'
    const isHR = ruolo === "HR";
    const isCandidato = ruolo === "CANDIDATO";

    type NavLink = {
        href: string;
        label: string;
    };

    let navLinks: NavLink[] = [];

    if (isCandidato) {
        navLinks = [
            { href: "/candidati/posizioni", label: "Posizioni aperte" },
            { href: "/candidati/candidature", label: "Le mie candidature" },
            { href: "/candidati/profili", label: "Profilo" },
        ];
    } else if (isHR) {
        navLinks = [
            { href: "/hr/dashboard", label: "Dashboard" },
            { href: "/hr/posizioni", label: "Posizioni" },
            { href: "/hr/candidati", label: "Candidati" },
            { href: "/hr/analisi", label: "Analisi" },
        ];
    }

    return (
        <header className="border-b bg-background/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* Logo / titolo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-lg font-semibold tracking-tight">
                        CandidAI
                    </Link>
                </div>

                {/* Link di navigazione (solo se loggato) */}
                {isAuthenticated && navLinks.length > 0 && (
                    <div className="hidden gap-4 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={classNames(
                                    "text-sm font-medium transition-colors",
                                    pathname.startsWith(link.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Area destra: login/register oppure utente + logout */}
                <div className="flex items-center gap-3">
                    {!isAuthenticated && (
                        <>
                            <Link
                                href="/auth/login"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Registrati
                            </Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <>
                            {user && (
                                <span className="hidden text-sm text-muted-foreground sm:inline">
                                    {ruolo === "HR" ? "HR" : "Candidato"}:{" "}
                                    <span className="font-semibold">
                                        {user.nome} {user.cognome}
                                    </span>
                                </span>
                            )}

                            {/* Qui non facciamo più la logica di logout,
                                ma andiamo alla pagina /auth/logout */}
                            <Link
                                href="/auth/logout"
                                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
                            >
                                Logout
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
