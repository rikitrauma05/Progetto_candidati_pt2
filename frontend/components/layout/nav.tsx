"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Nav({
                                area = "hr",
                            }: {
    area?: "hr" | "candidati";
}) {
    const pathname = usePathname();
    const items = area === "hr" ? hrItems : candidateItems;

    return (
        <nav className="flex items-center justify-between gap-6">
            <Link href="/" className="text-base font-semibold">
                Lavoro_Candidati
            </Link>

            <ul className="flex items-center gap-4">
                {items.map((it) => {
                    const active =
                        pathname === it.href ||
                        (pathname?.startsWith(it.href + "/") ?? false);
                    return (
                        <li key={it.href}>
                            <Link
                                href={it.href}
                                className={`rounded-xl px-3 py-2 text-sm ${
                                    active
                                        ? "bg-[var(--accent)] text-white"
                                        : "text-[var(--foreground)] hover:bg-[var(--border)]"
                                }`}
                            >
                                {it.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="flex items-center gap-3">
                <Link
                    href="/auth/login"
                    className="rounded-xl border px-3 py-2 text-sm"
                >
                    Login
                </Link>
                <Link
                    href="/auth/logout"
                    className="rounded-xl border px-3 py-2 text-sm"
                >
                    Logout
                </Link>
            </div>
        </nav>
    );
}
