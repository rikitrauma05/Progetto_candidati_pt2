"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";

export default function PosizioniHR() {
    // finché non ci sono API, le liste restano vuote
    const posizioni: any[] = [];

    return (
        <div className="space-y-6">
            {/* intestazione pagina */}
            <PageHeader
                title="Posizioni aperte"
                subtitle="Gestisci le posizioni lavorative pubblicate"
                actions={[{ label: "Nuova posizione", href: "/hr/posizioni/nuova" }]}
            />

            {/* nessuna posizione */}
            {posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione trovata"
                    subtitle="Non sono presenti posizioni attive al momento."
                    actionSlot={
                        <Button asChild>
                            <Link href="/hr/posizioni/nuova">Crea nuova posizione</Link>
                        </Button>
                    }
                />
            )}

            {/* esempio statico (placeholder grafico, senza dati reali) */}
            {posizioni.length > 0 && (
                <div className="grid gap-3">
                    {posizioni.map((p) => (
                        <PosizioneCard
                            key={p.idPosizione}
                            titolo={p.titolo}
                            sede={p.sede}
                            contratto={p.contratto}
                            candidature={p.candidatureRicevute}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/hr/posizioni/${p.idPosizione}`}>Dettaglio</Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
