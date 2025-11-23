"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";
import { API_BASE_URL } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

type CandidaturaApi = {
    idCandidatura: number;
    posizione: {
        idPosizione: number;
        titolo: string;
        sede?: string | null;
        contratto?: string | null;
    };
    createdAT: string;
    stato?: { codice: string } | null;
};

export default function CandidatureCandidato() {
    const [candidature, setCandidature] = useState<CandidaturaApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`${API_BASE_URL}/candidature/mie`, {
                    headers: {
                        Authorization: accessToken ? `Bearer ${accessToken}` : "",
                    },
                });

                const text = await res.text();
                if (!res.ok) {
                    throw new Error(text || "Errore nel caricamento delle candidature");
                }

                const data: CandidaturaApi[] = JSON.parse(text);
                setCandidature(data);
            } catch (err: any) {
                console.error(err);
                setErrore(err.message ?? "Errore imprevisto");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [accessToken]);

    const hasCandidature = candidature.length > 0;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Le mie candidature"
                subtitle="Visualizza lo stato delle posizioni per cui ti sei candidato"
            />

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

            {candidature.length > 0 && (
                <div className="grid gap-3">
                    {candidature.map((c) => (
                        <PosizioneCard
                            key={c.idCandidatura}
                            id={c.posizione.idPosizione}
                            titolo={c.posizione.titolo}
                            sede={c.posizione.sede ?? undefined}
                            contratto={c.posizione.contratto ?? undefined}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/candidati/posizioni/${c.posizione.idPosizione}`}>
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
