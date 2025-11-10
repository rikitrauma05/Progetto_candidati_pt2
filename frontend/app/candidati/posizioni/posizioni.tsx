"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";

export default function PosizioniCandidato() {
    // in attesa delle API: lista vuota
    const posizioni: any[] = [];

    return (
        <div className="space-y-6">
            {/* intestazione */}
            <PageHeader
                title="Posizioni aperte"
                subtitle="Consulta le offerte disponibili e candidati"
            />

            {/* stato vuoto */}
            {posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione disponibile"
                    subtitle="Al momento non ci sono offerte attive. Torna più tardi per nuove opportunità."
                />
            )}

            {/* lista posizioni (quando ci saranno dati) */}
            {posizioni.length > 0 && (
                <div className="grid gap-3">
                    {posizioni.map((p) => (
                        <PosizioneCard
                            key={p.idPosizione}
                            titolo={p.titolo}
                            sede={p.sede}
                            contratto={p.contratto}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/candidati/posizioni/${p.idPosizione}`}>
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
