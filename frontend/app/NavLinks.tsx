"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
    const pathname = usePathname();

    const mainLinks = [
        { href: "/", label: "Home" },
        { href: "/candidati/posizioni", label: "Posizioni" },
        { href: "/candidati/candidature", label: "Candidature" },
        { href: "/candidati/test", label: "Test" },
        { href: "/candidati/profili", label: "Profilo" },
    ];

    const authLinks = [
        { href: "/auth/login", label: "Login" },
        { href: "/auth/register", label: "Registrati" },
    ];

    const isActive = (href: string) => {
        // Attivo se il pathname inizia con il link
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <>
            {/* LINK PRINCIPALI */}
            {mainLinks.map(({ href, label }) => {
                const selected = isActive(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`rounded-full px-3 py-1.5 transition ${
                            selected
                                ? "bg-blue-500 text-white"
                                : "text-muted hover:bg-white/5 hover:text-[var(--foreground)]"
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}

            <span className="mx-1 h-5 w-px bg-border" />

            {/* LOGIN / REGISTRAZIONE */}
            {authLinks.map(({ href, label }) => {
                const selected = isActive(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition ${
                            selected
                                ? "bg-blue-500 text-white"
                                : "text-muted hover:bg-white/5 hover:text-[var(--foreground)]"
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </>
    );
}
