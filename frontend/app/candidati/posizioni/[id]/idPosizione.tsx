// frontend/app/candidati/posizioni/[id]/idPosizione.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import { getPosizioneById } from "@/services/posizione.service";
import type { Posizione } from "@/types/posizione";
import ApplyButton from "@/components/forms/ApplyButton";

export default function IdPosizionePage() {
    const { id } = useParams<{ id: string }>();

    const [posizione, setPosizione] = useState<Posizione | null>(null);
    const [err, setErr] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setErr("");
        setPosizione(null);

        getPosizioneById(id)
            .then((data) => {
                setPosizione(data ?? null);
            })
            .catch((e: any) => {
                setErr(e?.message || "Errore nel caricamento della posizione.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (!id) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Posizione non valida"
                    subtitle="L'ID della posizione non è presente nell'URL."
                    actions={[
                        {
                            label: "Torna alle posizioni",
                            href: "/candidati/posizioni",
                            variant: "dark",
                        },
                    ]}
                />
                <EmptyState
                    title="Posizione non trovata"
                    subtitle="Verifica il link utilizzato per accedere al dettaglio."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={posizione?.titolo || "Dettaglio posizione"}
                subtitle={
                    posizione
                        ? `${posizione.sede} • ${
                            posizione.contratto || "Contratto non specificato"
                        }`
                        : "Caricamento dettagli della posizione in corso…"
                }
                actions={[
                    {
                        label: "Torna alle posizioni",
                        href: "/candidati/posizioni",
                        variant: "dark",
                    },
                ]}
            />

            {/* Errore */}
            {!loading && err && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Errore nel caricamento della posizione: {err}
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
                    <div className="h-4 w-1/3 rounded bg-white/10 mb-3" />
                    <div className="h-3 w-1/4 rounded bg-white/8 mb-6" />
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="h-3 w-full rounded bg-white/8" />
                            <div className="h-3 w-5/6 rounded bg-white/8" />
                            <div className="h-3 w-3/4 rounded bg-white/8" />
                            <div className="h-3 w-2/3 rounded bg-white/8" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-1/2 rounded bg-white/8" />
                            <div className="h-3 w-1/3 rounded bg-white/8" />
                            <div className="h-3 w-2/3 rounded bg-white/8" />
                        </div>
                    </div>
                </div>
            )}

            {/* Nessun dato (ma niente errore) */}
            {!loading && !err && !posizione && (
                <EmptyState
                    title="Posizione non trovata"
                    subtitle="La posizione richiesta non è presente oppure è stata rimossa."
                />
            )}

            {/* Dettaglio posizione */}
            {!loading && !err && posizione && (
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {posizione.titolo}
                            </h2>
                            <p className="text-sm text-muted">
                                {posizione.sede} •{" "}
                                {posizione.contratto || "Contratto non specificato"}
                            </p>
                        </div>

                        {posizione.idStatoPosizione && (
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted">
                                {(posizione as any).idStatoPosizione?.descrizione ??
                                    "Attiva"}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Colonna descrizione (larga) */}
                        <section className="md:col-span-2 space-y-3">
                            <h3 className="text-base font-semibold">Descrizione</h3>
                            <p className="text-sm text-muted whitespace-pre-line">
                                {posizione.descrizione ||
                                    "Nessuna descrizione fornita per questa posizione."}
                            </p>
                        </section>

                        {/* Colonna dettagli sintetici */}
                        <section className="space-y-2">
                            <h3 className="text-base font-semibold">Dettagli</h3>
                            <ul className="text-sm text-muted space-y-1">
                                <li>
                                    <strong>Contratto:</strong>{" "}
                                    {posizione.contratto || "Non specificato"}
                                </li>
                                <li>
                                    <strong>RAL:</strong>{" "}
                                    {posizione.ral ? `${posizione.ral} €` : "Non disponibile"}
                                </li>
                                <li>
                                    <strong>Settore:</strong>{" "}
                                    {(posizione as any).idSettore?.nome || "Non indicato"}
                                </li>
                                <li>
                                    <strong>Stato:</strong>{" "}
                                    {(posizione as any).idStatoPosizione?.descrizione ||
                                        "Attiva"}
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Bottone candidatura + Vai al test */}
                    <div className="mt-6 flex justify-end">
                        <ApplyButton
                            idPosizione={posizione.idPosizione}
                            fullWidth={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
