"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function NavLinks() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuthStore();

    const ruolo = user?.ruolo; // "CANDIDATO" | "HR" | "ADMIN"
    const isHR = ruolo === "HR";
    const isCandidato = ruolo === "CANDIDATO";

    type NavItem = {
        href: string;
        label: string;
        show: boolean;
    };

    // Link principali della navbar
    const items: NavItem[] = [
        { href: "/", label: "Home", show: true },
        { href: "/candidati/posizioni", label: "Posizioni aperte", show: isAuthenticated && isCandidato }, // si vede solo quando si ci logga
        { href: "/candidati/candidature", label: "Le mie candidature", show: isCandidato },
        { href: "/hr/dashboard", label: "Dashboard HR", show: isHR },
        { href: "/hr/posizioni", label: "Posizioni HR", show: isHR },
        { href: "/hr/candidati", label: "Candidati", show: isHR },
    ];

    // Funzione helper per generare i link uniformi
    const navLinkClasses = (href: string) =>
        classNames(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            pathname === href ? "bg-blue-500 text-white" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
        );

    return (
        <div className="flex items-center gap-2">
            {/* Link di navigazione principali */}
            <div className="flex items-center gap-2">
                {items.filter((item) => item.show).map((item) => (
                    <Link key={item.href} href={item.href} className={navLinkClasses(item.href)}>
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Spacer */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Area autenticazione */}
            {!isAuthenticated && (
                <div className="flex items-center gap-2">
                    <Link href="/auth/login" className={navLinkClasses("/auth/login")}>
                        Login
                    </Link>
                    <Link href="/auth/register" className={navLinkClasses("/auth/register")}>
                        Registrati
                    </Link>
                </div>
            )}

            {isAuthenticated && (
                <div className="flex items-center gap-2">
                    {/* Info utente compatta */}
                    {user && (
                        <div className="hidden sm:flex flex-col items-end mr-1">
                            <span className="text-xs font-semibold leading-tight">
                                {user.nome} {user.cognome}
                            </span>
                            <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                                {ruolo === "HR" ? "HR" : ruolo === "CANDIDATO" ? "Candidato" : ruolo}
                            </span>
                        </div>
                    )}

                    {/* Link aggiuntivi a seconda del ruolo */}
                    {isCandidato && (
                        <Link href="/candidati/profili" className={navLinkClasses("/candidati/profili")}>
                            Profilo
                        </Link>
                    )}
                    {isHR && (
                        <Link href="/hr/dashboard" className={navLinkClasses("/hr/dashboard")}>
                            Area HR
                        </Link>
                    )}

                    {/* Logout */}
                    <Link
                        href="/auth/logout"
                        className={classNames(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                            "text-red-400 hover:text-white hover:bg-red-500"
                        )}
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}
