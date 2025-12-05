"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import { getJson } from "@/services/api";

type PosizioneInfo = {
    idPosizione: number;
    titolo: string;
    sede?: string | null;
    contratto?: string | null;
};

type CandidatoTop = {
    idCandidato: number;
    nome: string;
    cognome: string;
    email: string;
    punteggioTotale: number;
    statoCandidatura?: string | null;
};

type CandidatoPerPosizione = {
    idCandidato: number;
    nome: string;
    cognome: string;
    email: string;
    punteggioTotale: number | null;
    statoCandidatura?: string | null; // oppure cambia il nome in base al tuo DTO
};

function formatStato(stato?: string | null) {
    if (!stato) return "—";
    switch (stato) {
        case "IN_VALUTAZIONE":
            return "In valutazione";
        case "RESPINTO":
        case "RESPINTA":
            return "Respinta";
        case "ACCETTATO":
        case "ACCETTATA":
            return "Accettata";
        default:
            return stato;
    }
}

export default function HrTopCandidatiPerPosizione() {
    // La cartella in app è ancora [idCandidato], ma qui lo interpretiamo come idPosizione
    const { idCandidato } = useParams<{ idCandidato: string }>();
    const idPosizione = Number(idCandidato);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [posizione, setPosizione] = useState<PosizioneInfo | null>(null);
    const [topCandidati, setTopCandidati] = useState<CandidatoTop[]>([]);

    useEffect(() => {
        if (!idPosizione || Number.isNaN(idPosizione)) {
            setErrore("Identificativo posizione non valido.");
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // 1) dettagli posizione
                const pos = await getJson<PosizioneInfo>(`/posizioni/${idPosizione}`);
                setPosizione(pos);

                // 2) tutti i candidati per quella posizione
                const lista = await getJson<CandidatoPerPosizione[]>(
                    `/posizioni/${idPosizione}/candidati`,
                );

                // normalizza stato + ordina + prendi top 5
                const normalizzati: CandidatoTop[] = lista.map((c) => ({
                    idCandidato: c.idCandidato,
                    nome: c.nome,
                    cognome: c.cognome,
                    email: c.email,
                    punteggioTotale: c.punteggioTotale ?? 0,
                    statoCandidatura: c.statoCandidatura ?? "IN_VALUTAZIONE",
                }));

                normalizzati.sort(
                    (a, b) => (b.punteggioTotale ?? 0) - (a.punteggioTotale ?? 0),
                );

                setTopCandidati(normalizzati.slice(0, 5));
            } catch (err: any) {
                console.error("Errore nel caricamento dei top candidati:", err);
                setErrore(
                    err?.message ||
                    "Si è verificato un errore nel caricamento dei candidati.",
                );
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [idPosizione]);

    return (
        <section className="space-y-6">
            <PageHeader
                title={
                    posizione
                        ? `Top candidati – ${posizione.titolo}`
                        : "Top candidati per posizione"
                }
                subtitle="I migliori candidati per questa posizione"
                actions={[
                    {
                        label: "Torna alle posizioni",
                        href: "/hr/candidati",
                    },
                ]}
            />

            {loading && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento dei candidati in corso…
                    </p>
                </div>
            )}

            {!loading && errore && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-red-500/40 bg-red-900/30 p-6 text-sm text-red-100">
                    <p className="mb-4">{errore}</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/hr/candidati")}
                    >
                        Torna alle posizioni
                    </Button>
                </div>
            )}

            {!loading && !errore && posizione && topCandidati.length === 0 && (
                <EmptyState
                    title="Nessun candidato per questa posizione"
                    subtitle="Non ci sono ancora candidature con punteggio registrato per questa posizione."
                    actionSlot={
                        <Button onClick={() => router.push("/hr/candidati")}>
                            Torna alle posizioni
                        </Button>
                    }
                />
            )}

            {!loading && !errore && posizione && topCandidati.length > 0 && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] overflow-hidden">
                    <div className="border-b border-border px-4 py-3 text-sm text-[var(--muted)]">
                        Mostrati i primi 5 candidati, scorri pure per vedere i successivi
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr className="text-left">
                            <th className="px-4 py-3">Candidato</th>
                            <th className="px-4 py-3 hidden md:table-cell">
                                Email
                            </th>
                            <th className="px-4 py-3">Punteggio</th>
                            <th className="px-4 py-3">Stato candidatura</th>
                        </tr>
                        </thead>
                        <tbody>
                        {topCandidati.map((c) => (
                            <tr
                                key={c.idCandidato}
                                className="border-t border-border"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {c.nome} {c.cognome}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {c.email}
                                </td>
                                <td className="px-4 py-3 text-xs font-semibold">
                                    {c.punteggioTotale} pt
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {formatStato(c.statoCandidatura)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
