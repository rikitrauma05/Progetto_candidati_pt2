// /frontend/app/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

type LinkItem = {
    href: string;
    label: string;
};

const publicLinks: LinkItem[] = [
    { href: "/auth/login", label: "Login" },
    { href: "/auth/register", label: "Registrati" },
];

const candidatoLinks: LinkItem[] = [
    { href: "/candidati/posizioni", label: "Posizioni" },
    { href: "/candidati/candidature", label: "Candidature" },
    { href: "/candidati/test", label: "Test" },       // sezione Test per i candidati
    { href: "/candidati/profili", label: "Profilo" },
];

const hrLinks: LinkItem[] = [
    { href: "/hr/dashboard", label: "Dashboard" },
    { href: "/hr/posizioni", label: "Posizioni" },
    { href: "/hr/candidati", label: "Candidati" },
    { href: "/hr/test", label: "Test" },
    { href: "/hr/analisi", label: "Analisi" },
];

export default function NavLinks() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    const links = useMemo<LinkItem[]>(() => {
        if (!isAuthenticated) {
            return publicLinks;
        }

        const roleCode =
            (user as any)?.ruoloCodice ??
            (user as any)?.roleCode ??
            (user as any)?.ruolo?.codice ??
            (user as any)?.ruolo ??
            (user as any)?.role;

        if (roleCode === "HR") {
            return hrLinks;
        }

        // Default → candidato
        return candidatoLinks;
    }, [isAuthenticated, user]);

    return (
        <div className="flex items-center gap-3">
            {links.map((link) => {
                const isActive =
                    pathname === link.href || pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-blue-500 text-white"
                                : "text-[var(--muted)] hover:bg-blue-500/10 hover:text-[var(--foreground)]"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}

            {isAuthenticated && (
                <button
                    type="button"
                    onClick={logout}
                    className="rounded-full px-3 py-1 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-600/10 transition-colors"
                >
                    Logout
                </button>
            )}
        </div>
    );
}
