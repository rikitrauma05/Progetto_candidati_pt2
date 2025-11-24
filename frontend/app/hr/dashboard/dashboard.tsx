// frontend/app/hr/dashboard/dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { getHrDashboardStats, HrDashboardStats } from "@/services/dashboard.service";

export default function HrDashboardPage() {
    const [stats, setStats] = useState<HrDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getHrDashboardStats();
                setStats(data);
            } catch (e: any) {
                console.error("Errore caricamento dashboard HR:", e);
                setError(
                    e?.message ||
                    "Si è verificato un errore nel caricamento della dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <section className="max-w-6xl mx-auto space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Dashboard HR
                    </h1>
                    <p className="text-sm text-[var(--muted)]">
                        Panoramica delle posizioni, candidature e test.
                    </p>
                </div>
            </header>

            {loading && (
                <div className="rounded-xl border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento dati della dashboard…
                    </p>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border bg-[var(--card)] p-4">
                        <p className="text-xs text-[var(--muted)] uppercase tracking-wide">
                            Posizioni totali
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                            {stats.totalePosizioni}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-[var(--card)] p-4">
                        <p className="text-xs text-[var(--muted)] uppercase tracking-wide">
                            Candidature totali
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                            {stats.totaleCandidature}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-[var(--card)] p-4">
                        <p className="text-xs text-[var(--muted)] uppercase tracking-wide">
                            Test definiti
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                            {stats.totaleTest}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-[var(--card)] p-4">
                        <p className="text-xs text-[var(--muted)] uppercase tracking-wide">
                            Tentativi test
                        </p>
                        <p className="mt-2 text-2xl font-semibold">
                            {stats.totaleTentativi}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
