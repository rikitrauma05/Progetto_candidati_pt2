"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";

export default function CandidatureCandidato() {
    // In attesa di integrazione API, lista vuota
    const candidature: any[] = [];

    return (
        <div className="space-y-6">
            {/* intestazione pagina */}
            <PageHeader
                title="Le mie candidature"
                subtitle="Visualizza lo stato delle posizioni per cui ti sei candidato"
            />

            {/* stato vuoto */}
            {candidature.length === 0 && (
                <EmptyState
                    title="Nessuna candidatura inviata"
                    subtitle="Non hai ancora inviato candidature. Trova una posizione adatta a te e candidati subito."
                    actionSlot={
                        <Button asChild>
                            <Link href="/candidati/posizioni">Vedi posizioni aperte</Link>
                        </Button>
                    }
                />
            )}

            {/* elenco candidature (solo struttura, senza dati reali) */}
            {candidature.length > 0 && (
                <div className="grid gap-3">
                    {candidature.map((c) => (
                        <PosizioneCard
                            key={c.idPosizione}
                            titolo={c.titolo}
                            sede={c.sede}
                            contratto={c.contratto}
                            candidature={undefined}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/candidati/posizioni/${c.idPosizione}`}>
                                        Dettaglio
                                    </Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
