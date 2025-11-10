"use client";

import Link from "next/link";

export default function HrDashboard() {
    const kpi = {
        posizioniAperte: "—",
        candidatureOggi: "—",
        testAttivi: "—",
    };

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">HR — Dashboard</h2>
                <p className="text-muted">
                    Panoramica rapida. I valori verranno caricati dal backend.
                </p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl p-5 bg-surface border border-border shadow-card">
                    <p className="text-sm text-muted">Posizioni aperte</p>
                    <p className="text-3xl font-semibold mt-1">{kpi.posizioniAperte}</p>
                </div>
                <div className="rounded-2xl p-5 bg-surface border border-border shadow-card">
                    <p className="text-sm text-muted">Candidature oggi</p>
                    <p className="text-3xl font-semibold mt-1">{kpi.candidatureOggi}</p>
                </div>
                <div className="rounded-2xl p-5 bg-surface border border-border shadow-card">
                    <p className="text-sm text-muted">Test attivi</p>
                    <p className="text-3xl font-semibold mt-1">{kpi.testAttivi}</p>
                </div>
            </div>

            {/* Collegamenti rapidi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/hr/posizioni"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Gestione posizioni</h3>
                    <p className="text-muted text-sm">
                        Crea, apri/chiudi e modifica posizioni.
                    </p>
                </Link>

                <Link
                    href="/hr/candidati"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Candidati</h3>
                    <p className="text-muted text-sm">
                        Visualizza profili e stato candidature.
                    </p>
                </Link>

                <Link
                    href="/hr/analisi"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Analisi & report</h3>
                    <p className="text-muted text-sm">
                        Metriche, trend e statistiche HR.
                    </p>
                </Link>
            </div>
        </section>
    );
}
