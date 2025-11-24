"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";
import { getJson } from "@/services/api";

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidatureRicevute?: number;
};

export default function PosizioniHR() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);
                const data = await getJson<Posizione[]>("/posizioni/hr/mie");
                setPosizioni(data ?? []);
            } catch (e) {
                console.error(e);
                setErrore("Errore durante il caricamento delle posizioni.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni aperte"
                subtitle="Gestisci le posizioni lavorative pubblicate"
                actions={[{ label: "Nuova posizione", href: "/hr/posizioni/nuova" }]}
            />

            {loading && (
                <p className="text-sm text-[var(--muted)]">Caricamento posizioni…</p>
            )}

            {errore && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errore}
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                {!loading && !errore && posizioni.length === 0 && (
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

                {!loading && !errore && posizioni.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {posizioni.map((p) => (
                            <PosizioneCard
                                key={p.idPosizione}
                                id={p.idPosizione}
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
        </div>
    );
}
