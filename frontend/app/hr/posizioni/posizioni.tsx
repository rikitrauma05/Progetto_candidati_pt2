"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";
import { getJson, deleteJson } from "@/services/api";

type PosizioneListItem = {
    idPosizione: number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidatureRicevute?: number;
    ral?: number | null;
};

export default function PosizioniHR() {
    const [posizioni, setPosizioni] = useState<PosizioneListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // L’HR vede tutte le posizioni presenti a DB
                const data = await getJson<PosizioneListItem[]>("/posizioni");
                setPosizioni(data ?? []);
            } catch (e: any) {
                console.error(e);
                setErrore(
                    e?.message ||
                    "Errore durante il caricamento delle posizioni."
                );
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    async function handleDelete(idPosizione: number) {
        if (
            !window.confirm(
                "Sei sicuro di voler eliminare questa posizione? L'operazione non è reversibile."
            )
        ) {
            return;
        }

        try {
            setDeletingId(idPosizione);
            setErrore(null);

            await deleteJson(`/posizioni/${idPosizione}`);

            setPosizioni((prev) =>
                prev.filter((p) => p.idPosizione !== idPosizione)
            );
        } catch (e: any) {
            console.error("Errore eliminazione posizione:", e);
            // Messaggio generico leggibile lato HR
            setErrore(
                e?.message ||
                "Non è stato possibile eliminare la posizione. Verifica che non sia collegata a test o candidature."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni aperte"
                subtitle="Gestisci le posizioni lavorative pubblicate"
                actions={[
                    {
                        label: "Nuova posizione",
                        href: "/hr/posizioni/nuova",
                    },
                ]}
            />

            {loading && (
                <p className="text-sm text-[var(--muted)]">
                    Caricamento posizioni…
                </p>
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
                        subtitle="Non sono presenti posizioni al momento."
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
                                    <div className="flex gap-2">
                                        <Button asChild>
                                            <Link
                                                href={`/hr/posizioni/${p.idPosizione}`}
                                            >
                                                Dettaglio
                                            </Link>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-red-500/60 text-red-600 hover:bg-red-500/10"
                                            disabled={
                                                deletingId === p.idPosizione
                                            }
                                            onClick={() =>
                                                handleDelete(p.idPosizione)
                                            }
                                        >
                                            {deletingId === p.idPosizione
                                                ? "Eliminazione…"
                                                : "Elimina"}
                                        </Button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
