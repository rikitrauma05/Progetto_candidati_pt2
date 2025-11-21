"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";
import ApplyButton from "@/components/forms/ApplyButton";
import { fetchPosizioni } from "@/services/posizione.service";
import type { Posizione } from "@/types/posizione";

export default function PosizioniCandidato() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                const data = await fetchPosizioni();
                setPosizioni(data ?? []);
            } catch (e) {
                console.error(
                    "Errore durante il caricamento delle posizioni:",
                    e
                );
                setErrore("Errore durante il caricamento delle posizioni.");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Posizioni disponibili"
                    subtitle="Esplora le posizioni aperte e invia la tua candidatura"
                />
                <p className="text-sm text-[var(--muted)]">
                    Caricamento posizioni…
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni disponibili"
                subtitle="Esplora le posizioni aperte e invia la tua candidatura"
            />

            {errore && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errore}
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                {!errore && posizioni.length === 0 && (
                    <EmptyState
                        title="Nessuna posizione disponibile"
                        subtitle="Quando saranno pubblicate nuove posizioni le troverai qui."
                    />
                )}

                {!errore && posizioni.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {posizioni.map((p) => (
                            <PosizioneCard
                                key={p.idPosizione}
                                id={p.idPosizione}
                                titolo={p.titolo}
                                sede={p.sede}
                                contratto={p.contratto}
                                candidature={p.candidatureRicevute}
                                clickable
                                href={`/candidati/posizioni/${p.idPosizione}`}
                                rightSlot={<ApplyButton idPosizione={p.idPosizione} />}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
