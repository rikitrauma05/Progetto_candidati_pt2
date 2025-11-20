"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type Item = { href: string; label: string };

const hrItems: Item[] = [
    { href: "/hr/dashboard", label: "Dashboard" },
    { href: "/hr/posizioni", label: "Posizioni" },
    { href: "/hr/candidati", label: "Candidati" },
    { href: "/hr/analisi", label: "Analisi" },
];

const candidateItems: Item[] = [
    { href: "/candidati/posizioni", label: "Posizioni" },
    { href: "/candidati/candidature", label: "Candidature" },
    { href: "/candidati/profili", label: "Profilo" },
];

export default function NavLinks() {
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuthStore();

    const ruolo = user?.ruolo;
    const items: Item[] =
        ruolo === "HR"
            ? hrItems
            : ruolo === "CANDIDATO"
                ? candidateItems
                : [];

    const renderItem = (item: Item) => {
        const active =
            pathname === item.href ||
            (pathname?.startsWith(item.href + "/") ?? false);

        return (
            <li key={item.href}>
                <Link
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-sm transition ${
                        active
                            ? "bg-[var(--accent)] text-white"
                            : "text-[var(--foreground)] hover:bg-[var(--border)]"
                    }`}
                >
                    {item.label}
                </Link>
            </li>
        );
    };

    return (
        <>
            {/* Menu centrale */}
            <ul className="flex items-center gap-3 mr-4">
                {/* Link Home sempre visibile */}
                <li key="home">
                    <Link
                        href="/"
                        className={`rounded-xl px-3 py-2 text-sm transition ${
                            pathname === "/"
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--foreground)] hover:bg-[var(--border)]"
                        }`}
                    >
                        Home
                    </Link>
                </li>

                {/* Link in base al ruolo (solo se autenticato) */}
                {isAuthenticated && items.map(renderItem)}
            </ul>

            {/* Azioni a destra: login/registrazione oppure logout */}
            <div className="flex items-center gap-2">
                {!isAuthenticated && (
                    <>
                        <Link
                            href="/auth/login"
                            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/register"
                            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                        >
                            Registrati
                        </Link>
                    </>
                )}

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Logout
                    </button>
                )}
            </div>
        </>
    );
}
