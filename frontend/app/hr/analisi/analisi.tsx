"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";

export default function AnalisiHR() {
    // nessun dato finché non ci sono API reali
    const reportDisponibili: any[] = [];

    return (
        <div className="space-y-6">
            {/* intestazione pagina */}
            <PageHeader
                title="Analisi e report"
                subtitle="Statistiche sulle candidature e risultati dei test"
                actions={[
                    { label: "Esporta dati", href: "#" },
                ]}
            />

            {/* stato vuoto temporaneo */}
            {reportDisponibili.length === 0 && (
                <EmptyState
                    title="Nessuna analisi disponibile"
                    subtitle="I report saranno generati automaticamente quando verranno registrate candidature e risultati di test."
                    actionSlot={
                        <Button asChild>
                            <Link href="/hr/dashboard">Torna alla dashboard</Link>
                        </Button>
                    }
                />
            )}
        </div>
    );
}
