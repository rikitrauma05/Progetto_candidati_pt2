// app/candidati/posizioni/posizioni.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede: string;
    contratto: string;
    candidatureRicevute: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api"; // usa il proxy

export default function PosizioniCandidato() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/posizioni/topquattro`, { cache: "no-store" })
            .then(async r => {
                if (!r.ok) throw new Error(await r.text());
                return r.json();
            })
            .then(setPosizioni)
            .catch(e => setErr(String(e?.message || e)));
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni aperte"
                subtitle="Consulta le offerte disponibili. Qui mostriamo le Top 4 dal backend."
            />

            {err && (
                <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 whitespace-pre-wrap">
                    Errore: {err}
                </div>
            )}

            {!err && posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione disponibile"
                    subtitle="Al momento non ci sono offerte attive. Torna più tardi per nuove opportunità."
                />
            )}

            {posizioni.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {posizioni.map(p => (
                        <PosizioneCard
                            key={p.idPosizione}
                            titolo={p.titolo}
                            sede={p.sede}
                            contratto={p.contratto}
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
