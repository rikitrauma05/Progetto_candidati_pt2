"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import DateTimeCard from "@/components/cards/DateTimeCard";

export default function HomePage() {
    const { isAuthenticated, user } = useAuthStore();

    const isHR = user?.ruolo === "HR";
    const isCandidato = user?.ruolo === "CANDIDATO";

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center space-y-8">

            {/* 🔥 WIDGET DATA + ORA */}
            <DateTimeCard />

            <h1 className="text-4xl font-bold tracking-tight mb-4">
                Benvenuto in <span className="text-blue-600">CandidAI</span>
            </h1>

            <p className="text-base text-[var(--muted)] max-w-xl mb-10 leading-relaxed">
                La piattaforma intelligente per candidature, test di valutazione e gestione dei profili.
                Accedi per scoprire le funzionalità dedicate al tuo ruolo.
            </p>

            {/* Utente NON autenticato */}
            {!isAuthenticated && (
                <div className="flex gap-4">
                    <Link
                        href="/auth/login"
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                    >
                        Accedi
                    </Link>

                    <Link
                        href="/auth/register"
                        className="px-6 py-2 rounded-lg border text-sm"
                    >
                        Registrati
                    </Link>
                </div>
            )}

            {/* Utente autenticato */}
            {isAuthenticated && (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-[var(--muted)]">
                        Bentornato, <strong>{user?.nome}</strong>
                    </p>

                    {isHR && (
                        <Link
                            href="/hr/dashboard"
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                        >
                            Entra nella Dashboard HR
                        </Link>
                    )}

                    {isCandidato && (
                        <Link
                            href="/candidati/profili"
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                        >
                            Vai al tuo Profilo
                        </Link>
                    )}
                </div>
            )}
        </main>
    );
}
