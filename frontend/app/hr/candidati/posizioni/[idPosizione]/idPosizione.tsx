"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import { getJson, patchJson } from "@/services/api";

type CandidatoPerPosizione = {
    idCandidatura: number;
    idCandidato: number;
    nome: string;
    cognome: string;
    email: string;
    cvUrl?: string | null;
    punteggioTotale?: number | null;  // null = nessun test previsto
    stato?: string | null;            // ACCETTATA / IN_VALUTAZIONE / RESPINTA
};

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede?: string | null;
    contratto?: string | null;
};

export default function HrTopCandidatiPerPosizione() {
    const { idPosizione } = useParams<{ idPosizione: string }>();
    const router = useRouter();
    const id = Number(idPosizione);

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    const [posizione, setPosizione] = useState<Posizione | null>(null);
    const [candidati, setCandidati] = useState<CandidatoPerPosizione[]>([]);

    const [azioneInCorso, setAzioneInCorso] = useState<number | null>(null);

    // ============================================
    // CARICA POSIZIONE
    // ============================================
    async function caricaPosizione() {
        try {
            const data = await getJson<Posizione>(`/posizioni/${id}`);
            setPosizione(data);
        } catch {
            setErrore("Impossibile caricare i dettagli della posizione.");
        }
    }

    // ============================================
    // CARICA CANDIDATI
    // ============================================
    async function caricaCandidati() {
        try {
            const lista = await getJson<CandidatoPerPosizione[]>(
                `/posizioni/${id}/candidati`
            );

            const normalizzati = lista.map(c => ({
                ...c,
                stato: c.stato ?? "IN_VALUTAZIONE",
                // punteggio: se null → nessun test previsto
                punteggioTotale: c.punteggioTotale ?? null
            }));

            // Ordinamento:
            // - se tutti hanno punteggio null → ordina per ordine candidatura (lista originale)
            // - altrimenti ordina per punteggio desc
            const esistonoTest = normalizzati.some(c => c.punteggioTotale !== null);

            const ordinati = esistonoTest
                ? [...normalizzati].sort(
                    (a, b) => (b.punteggioTotale ?? 0) - (a.punteggioTotale ?? 0)
                )
                : normalizzati; // nessun test → ordine naturale

            // Togli respinti e prendi top 5
            setCandidati(ordinati.filter(c => c.stato !== "RESPINTA").slice(0, 5));

        } catch {
            setErrore("Errore nel caricamento dei candidati.");
        }
    }

    // ============================================
    // PATCH – Aggiorna stato candidatura
    // ============================================
    async function aggiornaStato(
        idCandidatura: number,
        nuovoStato: "ACCETTATA" | "RESPINTA"
    ) {
        setAzioneInCorso(idCandidatura);

        try {
            await patchJson(`/candidature/${idCandidatura}/stato?stato=${nuovoStato}`);

            if (nuovoStato === "RESPINTA") {
                setCandidati(prev => prev.filter(c => c.idCandidatura !== idCandidatura));
            } else {
                setCandidati(prev =>
                    prev.map(c =>
                        c.idCandidatura === idCandidatura
                            ? { ...c, stato: "ACCETTATA" }
                            : c
                    )
                );
            }

            await caricaCandidati();
        } catch {
            alert("Errore aggiornamento stato");
        } finally {
            setAzioneInCorso(null);
        }
    }

    // ============================================
    // INIT LOAD
    // ============================================
    useEffect(() => {
        if (!id || Number.isNaN(id)) {
            setErrore("ID posizione non valido.");
            setLoading(false);
            return;
        }

        const load = async () => {
            await caricaPosizione();
            await caricaCandidati();
            setLoading(false);
        };

        load();
    }, [id]);

    return (
        <section className="space-y-6">
            <PageHeader
                title={posizione ? `Top candidati – ${posizione.titolo}` : "Caricamento…"}
                subtitle={
                    candidati.some(c => c.punteggioTotale !== null)
                        ? "I migliori 5 candidati ordinati per punteggio."
                        : "Candidati ordinati per ordine di candidatura (nessun test previsto)."
                }
                actions={[
                    {
                        label: "Torna alle posizioni",
                        href: "/hr/candidati",
                    },
                ]}
            />

            {loading && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">Caricamento…</p>
                </div>
            )}

            {!loading && errore && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-red-500/40 bg-red-900/30 p-6">
                    <p className="text-red-200 text-sm">{errore}</p>
                    <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => router.push("/hr/candidati/posizioni")}
                    >
                        Torna alle posizioni
                    </Button>
                </div>
            )}

            {!loading && !errore && candidati.length === 0 && (
                <EmptyState
                    title="Nessun candidato"
                    subtitle="Non ci sono candidati valutabili per questa posizione."
                    actionSlot={
                        <Button onClick={() => router.push("/hr/candidati/posizioni")}>
                            Torna alle posizioni
                        </Button>
                    }
                />
            )}

            {!loading && !errore && candidati.length > 0 && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr>
                            <th className="px-4 py-3 text-left">Candidato</th>
                            <th className="px-4 py-3 hidden md:table-cell text-left">Email</th>
                            <th className="px-4 py-3 text-left">Punteggio</th>
                            <th className="px-4 py-3 text-left">Stato</th>
                            <th className="px-4 py-3 text-left">Azioni</th>
                        </tr>
                        </thead>

                        <tbody>
                        {candidati.map(c => (
                            <tr key={c.idCandidatura} className="border-t border-border">
                                <td className="px-4 py-3 font-medium">
                                    {c.nome} {c.cognome}
                                </td>

                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {c.email}
                                </td>

                                <td className="px-4 py-3 text-xs font-semibold">
                                    {c.punteggioTotale === null
                                        ? "Nessun test previsto"
                                        : `${c.punteggioTotale} pt`}
                                </td>

                                <td className="px-4 py-3 text-xs">
                                    {c.stato === "ACCETTATA"
                                        ? "Accettato"
                                        : "In valutazione"}
                                </td>

                                <td className="px-4 py-3 flex gap-2">
                                    {c.stato !== "ACCETTATA" ? (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="text-green-600 hover:bg-green-600 hover:text-white"
                                            disabled={azioneInCorso === c.idCandidatura}
                                            onClick={() =>
                                                aggiornaStato(c.idCandidatura, "ACCETTATA")
                                            }
                                        >
                                            {azioneInCorso === c.idCandidatura ? "..." : "Accetta"}
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="secondary" disabled>
                                            Accettato
                                        </Button>
                                    )}

                                    {c.stato !== "ACCETTATA" && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="text-red-600 hover:bg-red-600 hover:text-white"
                                            disabled={azioneInCorso === c.idCandidatura}
                                            onClick={() =>
                                                aggiornaStato(c.idCandidatura, "RESPINTA")
                                            }
                                        >
                                            {azioneInCorso === c.idCandidatura ? "..." : "Rifiuta"}
                                        </Button>
                                    )}
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
