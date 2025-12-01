"use client";

import { useEffect, useState } from "react";
import {
    getHrDashboardStats,
    HrDashboardStats,
} from "@/services/dashboard.service";

function formatNumber(value: number | null | undefined) {
    if (value == null) return "—";
    return new Intl.NumberFormat("it-IT").format(value);
}

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
            } catch (err: any) {
                console.error("Errore dashboard:", err);
                setError(
                    err?.message ||
                    "Si è verificato un errore nel caricamento della dashboard."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const now = new Date();
    const lastUpdate = now.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const candidaturePerPosizione =
        stats && stats.totalePosizioni > 0
            ? stats.totaleCandidature / stats.totalePosizioni
            : null;

    const tentativiPerTest =
        stats && stats.totaleTest > 0
            ? stats.totaleTentativi / stats.totaleTest
            : null;

    // Stati per il badge backend
    const isOnline = !loading && !error;
    const isOffline = !!error && !loading;
    const isChecking = loading;

    return (
        <section className="flex-1 max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* HEADER */}
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-sky-400/80 uppercase">
                        area hr
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Dashboard HR
                    </h1>
                    <p className="mt-1 text-sm text-slate-400 max-w-xl">
                        Panoramica in tempo reale su posizioni aperte,
                        candidature e test di valutazione.
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 text-xs text-slate-400">
                    {/* BADGE STATO BACKEND */}
                    {isChecking && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 border border-slate-700/70 px-3 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                        </span>
                        Verifica connessione backend…
                    </span>
                    )}

                    {isOnline && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 border border-slate-700/70 px-3 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        Backend connesso
                    </span>
                    )}

                    {isOffline && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-950/60 border border-red-700/70 px-3 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                        </span>
                        Backend non raggiungibile
                    </span>
                    )}

                    <span>Ultimo aggiornamento: {lastUpdate}</span>
                </div>
            </header>

            {/* STATI DI CARICAMENTO / ERRORE */}
            {loading && (
                <div className="rounded-2xl border border-slate-800 bg-white/5 backdrop-blur-sm p-6">
                    <p className="text-sm text-slate-300">
                        Caricamento dati della dashboard…
                    </p>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-2xl border border-red-500/60 bg-red-950/40 backdrop-blur-sm p-6">
                    <p className="text-sm text-red-200">
                        {error}
                    </p>
                </div>
            )}

            {/* CONTENUTO PRINCIPALE */}
            {!loading && !error && stats && (
                <div className="space-y-8">
                    {/* CARDS PRINCIPALI */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Posizioni totali"
                            hint="Somma di tutte le posizioni a DB"
                            value={formatNumber(stats.totalePosizioni)}
                            accent="from-sky-500/20 to-sky-500/5 border-sky-500/40"
                        />
                        <StatCard
                            label="Candidature totali"
                            hint="Tutte le candidature registrate"
                            value={formatNumber(stats.totaleCandidature)}
                            accent="from-emerald-500/20 to-emerald-500/5 border-emerald-500/40"
                        />
                        <StatCard
                            label="Test definiti"
                            hint="Questionari creati dal team HR"
                            value={formatNumber(stats.totaleTest)}
                            accent="from-violet-500/20 to-violet-500/5 border-violet-500/40"
                        />
                        <StatCard
                            label="Tentativi di test"
                            hint="Numero totale di tentativi svolti"
                            value={formatNumber(stats.totaleTentativi)}
                            accent="from-amber-500/20 to-amber-500/5 border-amber-500/40"
                        />
                    </section>

                    {/* KPI DERIVATI */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Indicatori chiave
                            </h2>
                            <p className="mt-1 text-xs text-slate-400">
                                Metriche calcolate automaticamente dai
                                dati aggregati.
                            </p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <KpiCard
                                    label="Candidature per posizione"
                                    value={
                                        candidaturePerPosizione != null
                                            ? candidaturePerPosizione.toFixed(1)
                                            : "—"
                                    }
                                    description="Media candidature raccolte per ogni posizione."
                                />
                                <KpiCard
                                    label="Tentativi per test"
                                    value={
                                        tentativiPerTest != null
                                            ? tentativiPerTest.toFixed(1)
                                            : "—"
                                    }
                                    description="Numero medio di tentativi rispetto ai test definiti."
                                />
                                <KpiCard
                                    label="Engagement test"
                                    value={
                                        stats.totaleCandidature > 0
                                            ? `${Math.round(
                                                (stats.totaleTentativi /
                                                    Math.max(
                                                        stats.totaleCandidature,
                                                        1
                                                    )) * 100
                                            )}%`
                                            : "—"
                                    }
                                    description="Rapporto tra candidature e tentativi di test."
                                />
                            </div>
                        </div>

                        {/* PANNELLO LATERALE: NOTE / PROSSIMI STEP */}
                        <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Suggerimenti operativi
                            </h2>
                            <p className="text-xs text-slate-400">
                                Usa questi numeri per capire dove
                                intervenire:
                            </p>
                            <ul className="mt-1 space-y-2 text-xs text-slate-300">
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                                    Se le candidature per posizione sono
                                    basse, valuta di migliorare la descrizione
                                    delle posizioni o i canali di pubblicazione.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                                    Se i tentativi per test sono pochi,
                                    verifica che i test siano correttamente
                                    assegnati alle posizioni.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Monitora l'engagement dei test per capire
                                    quanto i candidati arrivano fino in fondo
                                    al percorso di selezione.
                                </li>
                            </ul>
                        </aside>
                    </section>
                </div>
            )}
        </section>
    );
}

type StatCardProps = {
    label: string;
    hint: string;
    value: string;
    accent: string; // classi tailwind per il gradient/border
};

function StatCard({ label, hint, value, accent }: StatCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${accent} px-4 py-4`}
        >
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_rgba(15,23,42,0))]" />
            <div className="relative space-y-2">
                <p className="text-xs font-medium text-slate-300/90">
                    {label}
                </p>
                <p className="text-3xl font-semibold tabular-nums">
                    {value}
                </p>
                <p className="text-[11px] text-slate-300/70">
                    {hint}
                </p>
            </div>
        </div>
    );
}

type KpiCardProps = {
    label: string;
    value: string;
    description: string;
};

function KpiCard({ label, value, description }: KpiCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 flex flex-col gap-1">
            <p className="text-[11px] font-medium text-slate-300/90 uppercase tracking-wide">
                {label}
            </p>
            <p className="text-xl font-semibold tabular-nums">
                {value}
            </p>
            <p className="text-[11px] text-slate-400">
                {description}
            </p>
        </div>
    );
}
