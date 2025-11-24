"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";
import ApplyButton from "@/components/forms/ApplyButton";
import { getJson } from "@/services/api";

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidatureRicevute?: number;
    ral?: number;
};

export default function PosizioniCandidato() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // endpoint per le posizioni visibili al candidato
                const data = await getJson<Posizione[]>("/posizioni");
                setPosizioni(data ?? []);
            } catch (e: any) {
                console.error("Errore durante il caricamento delle posizioni:", e);
                setErrore(
                    e?.message ||
                    "Si è verificato un errore durante il caricamento delle posizioni.",
                );
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
                    subtitle="Esplora le posizioni aperte e invia la tua candidatura."
                />
                <p className="text-sm text-[var(--muted)]">
                    Caricamento delle posizioni in corso…
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni disponibili"
                subtitle="Esplora le posizioni aperte e invia la tua candidatura."
            />

            {errore && (
                <div className="max-w-3xl mx-auto rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
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
                                rightSlot={
                                    <ApplyButton
                                        idPosizione={p.idPosizione}
                                    />
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
