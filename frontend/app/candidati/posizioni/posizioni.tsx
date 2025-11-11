// frontend/app/candidati/posizioni/posizioni.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";
import { getTopQuattroPosizioni } from "@/services/posizione.service";
import type { Posizione } from "@/types/posizione";

export default function PosizioniCandidato() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        getTopQuattroPosizioni()
            .then((data) => {
                if (mounted) setPosizioni(data);
            })
            .catch((e) => {
                if (mounted) setErr(String(e?.message || e));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni aperte"
                subtitle="Consulta le offerte disponibili. Qui mostriamo le Top 4 dal backend."
            />

            {/* Stato: caricamento */}
            {loading && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse rounded-lg border p-4">
                            <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
                            <div className="h-8 w-24 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {/* Stato: errore */}
            {!loading && err && (
                <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 whitespace-pre-wrap">
                    Errore: {err}
                </div>
            )}

            {/* Stato: nessuna posizione */}
            {!loading && !err && posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione disponibile"
                    subtitle="Al momento non ci sono offerte attive. Torna più tardi per nuove opportunità."
                />
            )}

            {/* Stato: dati presenti */}
            {!loading && posizioni.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {posizioni.map((p) => (
                        <PosizioneCard
                            key={p.id}
                            id={p.id}
                            titolo={p.titolo}
                            sede={p.sede}
                            contratto={p.contratto}
                            onClick={() => router.push(`/candidati/posizioni/${p.idPosizione}`)}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/candidati/posizioni/${p.idPosizione}`}>Dettaglio</Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
