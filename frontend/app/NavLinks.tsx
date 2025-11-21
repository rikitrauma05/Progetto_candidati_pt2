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

    const items: NavItem[] = [
        {
            href: "/",
            label: "Home",
            show: true,
        },
        {
            href: "/candidati/posizioni",
            label: "Posizioni aperte",
            // visibile sia da non loggato che dal candidato
            show: !isAuthenticated || isCandidato,
        },
        {
            href: "/candidati/candidature",
            label: "Le mie candidature",
            show: isCandidato,
        },
        {
            href: "/hr/dashboard",
            label: "Dashboard HR",
            show: isHR,
        },
        {
            href: "/hr/posizioni",
            label: "Posizioni HR",
            show: isHR,
        },
        {
            href: "/hr/candidati",
            label: "Candidati",
            show: isHR,
        },
    ];

    return (
        <div className="flex items-center gap-2">
            {/* Link di navigazione */}
            <div className="flex items-center gap-2">
                {items
                    .filter((item) => item.show)
                    .map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={classNames(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-blue-500 text-white"
                                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
            </div>

            {/* Spacer */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Area auth: login/registrati oppure utente + logout */}
            {!isAuthenticated && (
                <div className="flex items-center gap-2">
                    <Link
                        href="/auth/login"
                        className={classNames(
                            "px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 transition-colors",
                            pathname?.startsWith("/auth/login")
                                ? "bg-white text-black"
                                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
                        )}
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/register"
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
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
                                {ruolo === "HR"
                                    ? "HR"
                                    : ruolo === "CANDIDATO"
                                        ? "Candidato"
                                        : ruolo}
                            </span>
                        </div>
                    )}

                    {/* Link al profilo a seconda del ruolo */}
                    {isCandidato && (
                        <Link
                            href="/candidati/profili"
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/20 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)] transition-colors"
                        >
                            Profilo
                        </Link>
                    )}
                    {isHR && (
                        <Link
                            href="/hr/dashboard"
                            className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/20 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)] transition-colors"
                        >
                            Area HR
                        </Link>
                    )}

                    {/* Logout -> va alla pagina dedicata /auth/logout */}
                    <Link
                        href="/auth/logout"
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-red-500/60 text-red-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}
