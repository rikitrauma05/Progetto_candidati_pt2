"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Posizione } from "@/types/posizione";

export default function IdPosizione() {
    const { id } = useParams();
    const [posizione, setPosizione] = useState<Posizione | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // TODO: collegare a posizioneService.getById(id)
                await new Promise((r) => setTimeout(r, 0));
                setPosizione(null);
            } catch {
                setError("Errore nel caricamento della posizione.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <p className="text-muted">Caricamento in corso...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center text-red-600">
                <p>{error}</p>
            </section>
        );
    }

    if (!posizione) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <h2 className="text-xl font-semibold mb-2">Posizione non trovata</h2>
                <p className="text-muted">
                    Nessuna informazione disponibile per questa posizione.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold">{posizione.titolo}</h2>
                <p className="text-muted">
                    {posizione.sede} • {posizione.contratto} • {posizione.settore}
                </p>
            </div>

            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h3 className="text-lg font-semibold mb-2">Descrizione</h3>
                <p className="text-muted">
                    (Qui verrà caricata la descrizione dal database o dall’API.)
                </p>
            </div>

            <div className="flex justify-end">
                <button className="btn">Candidati</button>
            </div>
        </section>
    );
}
