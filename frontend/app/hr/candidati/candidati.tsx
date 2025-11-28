"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";
import { getJson } from "@/services/api";

type PosizioneConStatistiche = {
    idPosizione: number;
    titolo: string;
    sede?: string | null;
    contratto?: string | null;
    candidatureRicevute?: number | null;
    // opzionale: miglior punteggio tra i candidati della posizione
    migliorPunteggio?: number | null;
};

export default function CandidaturePerPosizioneHR() {
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [posizioni, setPosizioni] = useState<PosizioneConStatistiche[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // Se hai un endpoint specifico HR, cambialo qui
                // es: "/hr/posizioni/candidature"
                const data = await getJson<PosizioneConStatistiche[]>("/posizioni");

                setPosizioni(data ?? []);
            } catch (err: any) {
                console.error("Errore caricamento posizioni:", err);
                setErrore(
                    err?.message ||
                    "Si è verificato un errore durante il caricamento delle posizioni.",
                );
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Candidature per posizione"
                subtitle="Seleziona una posizione per vedere i migliori candidati in base al punteggio."
            />

            {loading && (
                <p className="text-sm text-[var(--muted)]">
                    Caricamento delle posizioni in corso…
                </p>
            )}

            {errore && (
                <div className="max-w-3xl mx-auto rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
                    {errore}
                </div>
            )}

            {!loading && !errore && posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione attiva"
                    subtitle="Non ci sono ancora posizioni con candidature. Crea una nuova posizione per iniziare."
                    actionSlot={
                        <Button asChild>
                            <Link href="/hr/posizioni/nuova">
                                Crea una posizione
                            </Link>
                        </Button>
                    }
                />
            )}

            {!loading && !errore && posizioni.length > 0 && (
                <div className="max-w-6xl mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {posizioni.map((p) => (
                        <PosizioneCard
                            key={p.idPosizione}
                            id={p.idPosizione}
                            titolo={p.titolo}
                            sede={p.sede ?? undefined}
                            contratto={p.contratto ?? undefined}
                            candidature={p.candidatureRicevute ?? undefined}
                            clickable
                            href={`/hr/candidati/${p.idPosizione}`}
                            rightSlot={
                                <div className="flex flex-col items-end gap-1">
                                    {typeof p.migliorPunteggio === "number" && (
                                        <p className="text-xs text-[var(--muted)]">
                                            Top punteggio:{" "}
                                            <span className="font-semibold text-[var(--foreground)]">
                                                {p.migliorPunteggio} pt
                                            </span>
                                        </p>
                                    )}
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/hr/candidati/${p.idPosizione}`}>
                                            Vedi top 5
                                        </Link>
                                    </Button>
                                </div>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
