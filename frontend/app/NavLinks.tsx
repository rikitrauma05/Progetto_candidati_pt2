"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavLinks() {
    const [active, setActive] = useState<string>("");

    useEffect(() => {
        const saved = localStorage.getItem("activeLink");
        if (saved) setActive(saved);
    }, []);

    const handleClick = (href: string) => {
        localStorage.setItem("activeLink", href);
        setActive(href);
    };

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

    return (
        <>
            {/* LINK PRINCIPALI */}
            {mainLinks.map(({ href, label }) => {
                const isSelected = active === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => handleClick(href)}
                        className={`rounded-full px-3 py-1.5 transition ${
                            isSelected
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
                const isSelected = active === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => handleClick(href)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition ${
                            isSelected
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
