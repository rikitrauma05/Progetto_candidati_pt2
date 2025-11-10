"use client";

import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";

export default function DashboardHR() {
    // nessun dato reale finché non colleghiamo il backend
    const kpi = [
        { label: "Posizioni attive", value: 0 },
        { label: "Candidature totali", value: 0 },
        { label: "Test completati", value: 0 },
        { label: "Media punteggi", value: "—" },
    ];

    return (
        <div className="space-y-6">
            {/* intestazione con KPI */}
            <PageHeader
                title="Dashboard HR"
                subtitle="Panoramica generale delle attività di selezione"
                kpis={kpi}
            />

            {/* stato vuoto per ora */}
            <EmptyState
                title="Nessun dato disponibile"
                subtitle="La dashboard sarà popolata automaticamente quando verranno create posizioni e candidature."
            />
        </div>
    );
}
