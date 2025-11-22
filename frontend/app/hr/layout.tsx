"use client";

import { usePathname } from "next/navigation";

export default function HRLayout({
                                     children,
                                 }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const links = [
        { href: "/hr/posizioni", label: "Posizioni" },
        { href: "/hr/candidati", label: "Candidati" },
        { href: "/hr/test", label: "Test" },
        { href: "/hr/analisi", label: "Analisi" },
    ];

    return (
        <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Sidebar */}
            {/*<aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">*/}
            {/*    <h2 className="text-xl font-semibold mb-6">Area HR</h2>*/}
            {/*    <nav className="flex flex-col gap-2">*/}
            {/*        {links.map((link) => {*/}
            {/*            const isActive = pathname === link.href;*/}
            {/*            return (*/}
            {/*                <Link*/}
            {/*                    key={link.href}*/}
            {/*                    href={link.href}*/}
            {/*                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${*/}
            {/*                        isActive*/}
            {/*                            ? "bg-[var(--accent)] text-white"*/}
            {/*                            : "hover:bg-[var(--accent)]/10"*/}
            {/*                    }`}*/}
            {/*                >*/}
            {/*                    {link.label}*/}
            {/*                </Link>*/}
            {/*            );*/}
            {/*        })}*/}
            {/*    </nav>*/}
            {/*</aside>*/}

            {/* Contenuto */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
