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
    punteggioTotale?: number | null;
    esitoTentativo?: string | null;
    stato?: string | null; // NORMALIZZATO
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

    // ================================================================
    // CARICA POSIZIONE
    // ================================================================
    async function caricaPosizione() {
        try {
            const data = await getJson<Posizione>(`/posizioni/${id}`);
            setPosizione(data);
        } catch {
            setErrore("Impossibile caricare la posizione.");
        }
    }

    // ================================================================
    // CARICA CANDIDATI (con normalizzazione dello stato)
    // ================================================================
    async function caricaCandidati() {
        try {
            const lista = await getJson<any[]>(`/posizioni/${id}/candidati`);

            const normalizzati: CandidatoPerPosizione[] = lista.map(c => ({
                ...c,
                stato: c.stato?.codice ?? c.stato ?? "IN_VALUTAZIONE",
            }));

            const attivi = normalizzati.filter(c => c.stato !== "RESPINTA");

            attivi.sort((a, b) => (b.punteggioTotale ?? 0) - (a.punteggioTotale ?? 0));

            setCandidati(attivi.slice(0, 5));

        } catch {
            setErrore("Errore nel caricamento dei candidati.");
        }
    }

    // ================================================================
    // HR — AGGIORNA STATO CANDIDATURA
    // ================================================================
    async function aggiornaStato(
        idCandidatura: number,
        nuovoStato: "ACCETTATA" | "RESPINTA"
    ) {
        setAzioneInCorso(idCandidatura);

        try {
            await patchJson(`/candidature/${idCandidatura}/stato?stato=${nuovoStato}`);

            if (nuovoStato === "RESPINTA") {
                setCandidati(prev =>
                    prev.filter(c => c.idCandidatura !== idCandidatura)
                );
            }

            if (nuovoStato === "ACCETTATA") {
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

    // ================================================================
    // INIT LOAD
    // ================================================================
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

    // ==================================================================
    // RENDER
    // ==================================================================
    return (
        <section className="space-y-6">

            <PageHeader
                title={posizione ? `Top 5 candidati – ${posizione.titolo}` : "Caricamento…"}
                subtitle="I migliori candidati ordinati per punteggio."
                actions={[{ label: "Torna alle posizioni", href: "/hr/candidati" }]}
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
                        onClick={() => router.push("/hr/candidati")}
                    >
                        Torna alle posizioni
                    </Button>
                </div>
            )}

            {!loading && !errore && candidati.length === 0 && (
                <EmptyState
                    title="Nessun candidato"
                    subtitle="Non ci sono candidati valutabili per questa posizione."
                    actionSlot={<Button onClick={() => router.push("/hr/candidati")}>
                        Torna alle posizioni
                    </Button>}
                />
            )}

            {!loading && !errore && candidati.length > 0 && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] overflow-hidden">

                    <div className="border-b border-border px-4 py-3 text-sm text-[var(--muted)]">
                        I migliori 5 candidati ordinati per punteggio
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr>
                            <th className="px-4 py-3 text-left">Candidato</th>
                            <th className="px-4 py-3 hidden md:table-cell text-left">Email</th>
                            <th className="px-4 py-3 text-left">Punteggio</th>

                            {/* === COLONNA CV (AGGIUNTA) === */}
                            <th className="px-4 py-3 text-left">CV</th>

                            <th className="px-4 py-3 text-left">Stato</th>
                            <th className="px-4 py-3 text-left">Azioni</th>
                        </tr>
                        </thead>

                        <tbody>
                        {candidati.map((c) => (
                            <tr key={c.idCandidatura} className="border-t border-border">

                                <td className="px-4 py-3 font-medium">
                                    {c.nome} {c.cognome}
                                </td>

                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {c.email}
                                </td>

                                <td className="px-4 py-3 text-xs font-semibold">
                                    {c.punteggioTotale ?? 0} pt
                                </td>

                                {/* === CELLA CV (AGGIUNTA) === */}
                                <td className="px-4 py-3 text-xs">
                                    {c.cvUrl ? (
                                        <a
                                            href={`http://localhost:8080/api/files/cv/${c.cvUrl.split("/").pop()}`}
                                            target="_blank"
                                            className="text-blue-500 underline"
                                        >
                                            Apri CV
                                        </a>
                                    ) : "—"}
                                </td>

                                <td className="px-4 py-3 text-xs">
                                    <span className="px-2 py-1 rounded-md border text-[var(--muted)]">
                                        {c.stato === "ACCETTATA" ? "Accettato" : "In valutazione"}
                                    </span>
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
