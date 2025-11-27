"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import PosizioneCard from "@/components/cards/posizioneCard";
import ApplyButton from "@/components/forms/ApplyButton";
import { getJson } from "@/services/api";

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidatureRicevute?: number;
    ral?: number;

    // campi opzionali per future evoluzioni:
    testAssociato?: {
        idTest: number;
        titolo: string;
    } | null;
    candidatura?: {
        idCandidatura: number;
        stato: string;
        punteggioTest?: number | null;
    } | null;
};

type CandidaturaMia = {
    idCandidatura: number;
    posizione?: {
        idPosizione: number;
    } | null;
};

export default function PosizioniCandidato() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [idPosizioniCandidate, setIdPosizioniCandidate] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errore, setErrore] = useState<string | null>(null);

    // filtri
    const [search, setSearch] = useState("");
    const [filtroSede, setFiltroSede] = useState<string>("tutte");
    const [filtroContratto, setFiltroContratto] = useState<string>("tutti");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // Carico posizioni e mie candidature insieme
                const [posizioniApi, candidatureApi] = await Promise.all([
                    getJson<Posizione[]>("/posizioni"),
                    getJson<CandidaturaMia[]>("/candidature/mie"),
                ]);

                setPosizioni(posizioniApi ?? []);

                // estraggo gli id delle posizioni per cui SONO già candidato
                const ids = (candidatureApi ?? [])
                    .map((c) => c.posizione?.idPosizione)
                    .filter((id): id is number => typeof id === "number");

                // rimuovo eventuali duplicati
                setIdPosizioniCandidate(Array.from(new Set(ids)));
            } catch (e: any) {
                console.error("Errore durante il caricamento delle posizioni:", e);
                setErrore(
                    e?.message ||
                    "Si è verificato un errore durante il caricamento delle posizioni.",
                );
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    // opzioni filtri ricavate dai dati
    const sediDisponibili = useMemo(
        () =>
            Array.from(
                new Set(
                    posizioni
                        .map((p) => p.sede)
                        .filter((sede): sede is string => !!sede),
                ),
            ),
        [posizioni],
    );

    const contrattiDisponibili = useMemo(
        () =>
            Array.from(
                new Set(
                    posizioni
                        .map((p) => p.contratto)
                        .filter((c): c is string => !!c),
                ),
            ),
        [posizioni],
    );

    const posizioniFiltrate = useMemo(
        () =>
            posizioni.filter((p) => {
                // 1) escludo subito le posizioni per cui sono già candidato
                if (idPosizioniCandidate.includes(p.idPosizione)) {
                    return false;
                }

                // 2) applico i filtri di ricerca
                const matchTitolo = p.titolo
                    .toLowerCase()
                    .includes(search.toLowerCase().trim());

                const matchSede =
                    filtroSede === "tutte" ||
                    (!p.sede ? false : p.sede === filtroSede);

                const matchContratto =
                    filtroContratto === "tutti" ||
                    (!p.contratto ? false : p.contratto === filtroContratto);

                return matchTitolo && matchSede && matchContratto;
            }),
        [posizioni, search, filtroSede, filtroContratto, idPosizioniCandidate],
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Posizioni disponibili"
                    subtitle="Esplora le posizioni aperte e invia la tua candidatura."
                />
                <p className="text-sm text-[var(--muted)]">
                    Caricamento delle posizioni in corso…
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni disponibili"
                subtitle="Esplora le posizioni aperte e invia la tua candidatura."
            />

            {errore && (
                <div className="max-w-3xl mx-auto rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
                    {errore}
                </div>
            )}

            <div className="max-w-5xl mx-auto space-y-4">
                {/* FILTRI */}
                {!errore && posizioni.length > 0 && (
                    <div className="rounded-2xl border border-border bg-[var(--card)] p-4 grid gap-3 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                                Cerca per titolo
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Es. Sviluppatore, Sistemista…"
                                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                                Filtra per sede
                            </label>
                            <select
                                value={filtroSede}
                                onChange={(e) => setFiltroSede(e.target.value)}
                                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            >
                                <option value="tutte">Tutte le sedi</option>
                                {sediDisponibili.map((sede) => (
                                    <option key={sede} value={sede}>
                                        {sede}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                                Filtra per contratto
                            </label>
                            <select
                                value={filtroContratto}
                                onChange={(e) =>
                                    setFiltroContratto(e.target.value)
                                }
                                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            >
                                <option value="tutti">Tutti i contratti</option>
                                {contrattiDisponibili.map((contratto) => (
                                    <option key={contratto} value={contratto}>
                                        {contratto}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* LISTA POSIZIONI */}
                {!errore && posizioniFiltrate.length === 0 && (
                    <EmptyState
                        title="Nessuna posizione trovata"
                        subtitle={
                            posizioni.length === 0
                                ? "Quando saranno pubblicate nuove posizioni le troverai qui."
                                : "Nessuna posizione corrisponde ai filtri impostati o sei già candidato per tutte quelle visibili."
                        }
                    />
                )}

                {!errore && posizioniFiltrate.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {posizioniFiltrate.map((p) => (
                            <PosizioneCard
                                key={p.idPosizione}
                                id={p.idPosizione}
                                titolo={p.titolo}
                                sede={p.sede}
                                contratto={p.contratto}
                                candidature={p.candidatureRicevute}
                                clickable
                                href={`/candidati/posizioni/${p.idPosizione}`}
                                rightSlot={<ApplyButton idPosizione={p.idPosizione} />}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
