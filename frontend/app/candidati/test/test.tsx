"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import EmptyState from "@/components/empty/EmptyState";

import {
    getTestDisponibili,
    getTentativiCandidato,
} from "@/services/test.service";
import type { TestListItem, TentativoListItem } from "@/types/test";

type Tab = "disponibili" | "storico";

export default function TestCandidatoHome() {
    const [tab, setTab] = useState<Tab>("disponibili");

    const [testDisponibili, setTestDisponibili] = useState<TestListItem[]>([]);
    const [storicoTentativi, setStoricoTentativi] = useState<TentativoListItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setErrore(null);

            try {
                const disponibili = await getTestDisponibili();
                const storico = await getTentativiCandidato();

                setTestDisponibili(disponibili ?? []);
                setStoricoTentativi(storico ?? []);
            } catch (e) {
                setErrore(
                    "Non è stato possibile caricare i test. Riprova tra qualche minuto."
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Test di selezione"
                subtitle="Consulta i test disponibili e lo storico dei tentativi."
            />

            <section className="max-w-5xl mx-auto space-y-4">
                {/* TABS */}
                <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
                    <button
                        type="button"
                        onClick={() => setTab("disponibili")}
                        className={`px-4 py-2 text-sm rounded-lg ${
                            tab === "disponibili"
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--muted)] hover:bg-white/5"
                        }`}
                    >
                        Test disponibili
                    </button>

                    <button
                        type="button"
                        onClick={() => setTab("storico")}
                        className={`px-4 py-2 text-sm rounded-lg ${
                            tab === "storico"
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--muted)] hover:bg-white/5"
                        }`}
                    >
                        Storico test
                    </button>
                </div>

                {loading && (
                    <p className="text-sm text-[var(--muted)]">Caricamento…</p>
                )}

                {errore && !loading && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errore}
                    </div>
                )}

                {!loading && !errore && (
                    <>
                        {tab === "disponibili" && (
                            <SezioneTestDisponibili items={testDisponibili} />
                        )}
                        {tab === "storico" && (
                            <SezioneStoricoTentativi items={storicoTentativi} />
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

function SezioneTestDisponibili({ items }: { items: TestListItem[] }) {
    if (!items || items.length === 0) {
        return (
            <EmptyState
                title="Nessun test disponibile"
                subtitle="Al momento non ci sono test assegnati."
            />
        );
    }

    return (
        <div className="space-y-4">
            {items.map((t, idx) => {
                const anyT = t as any;

                const idTest: number =
                    anyT.idTest ?? anyT.testId ?? idx;

                const titolo: string =
                    anyT.titolo ??
                    anyT.nome ??
                    "Test senza titolo";

                const descrizione: string | null =
                    anyT.descrizione ??
                    anyT.descrizioneBreve ??
                    anyT.sommario ??
                    null;

                const tipo: string | null =
                    anyT.tipoTestNome ??
                    anyT.tipoTest?.nome ??
                    anyT.tipo ??
                    null;

                const settore: string | null =
                    anyT.settoreNome ??
                    anyT.settore?.nome ??
                    null;

                const durataMinuti: number | null =
                    anyT.durataMinuti ??
                    anyT.durata ??
                    null;

                const punteggioMax: number | null =
                    anyT.punteggioMax ??
                    anyT.punteggioTotaleMax ??
                    null;

                const numDomande: number | null =
                    anyT.numeroDomande ??
                    anyT.numDomande ??
                    null;

                const difficolta: string | null =
                    anyT.difficolta ??
                    anyT.livelloDifficolta ??
                    null;

                return (
                    <article
                        key={idTest}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-stretch md:justify-between"
                    >
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-base font-semibold">
                                    {titolo}
                                </h3>

                                {(tipo || difficolta) && (
                                    <div className="flex flex-wrap justify-end gap-2 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                                        {tipo && (
                                            <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2 py-0.5">
                                                {tipo}
                                            </span>
                                        )}
                                        {difficolta && (
                                            <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2 py-0.5">
                                                Diff. {difficolta}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {descrizione && (
                                <p className="text-sm text-[var(--muted)]">
                                    {descrizione}
                                </p>
                            )}

                            {(settore ||
                                durataMinuti ||
                                numDomande ||
                                punteggioMax) && (
                                <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)] pt-1">
                                    {settore && (
                                        <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5">
                                            Settore:{" "}
                                            <span className="ml-1 font-medium">
                                                {settore}
                                            </span>
                                        </span>
                                    )}
                                    {durataMinuti && (
                                        <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5">
                                            Durata:{" "}
                                            <span className="ml-1 font-medium">
                                                {durataMinuti} min
                                            </span>
                                        </span>
                                    )}
                                    {numDomande && (
                                        <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5">
                                            Domande:{" "}
                                            <span className="ml-1 font-medium">
                                                {numDomande}
                                            </span>
                                        </span>
                                    )}
                                    {punteggioMax && (
                                        <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5">
                                            Max:{" "}
                                            <span className="ml-1 font-medium">
                                                {punteggioMax} pt
                                            </span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end md:justify-center md:pl-6">
                            <Button asChild>
                                <Link href={`/candidati/test/${idTest}/introduzione`}>
                                    Inizia
                                </Link>
                            </Button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function SezioneStoricoTentativi({ items }: { items: TentativoListItem[] }) {
    if (!items || items.length === 0) {
        return (
            <EmptyState
                title="Nessun test svolto"
                subtitle="Quando completerai un test, comparirà qui."
            />
        );
    }

    return (
        <div className="space-y-4">
            {items.map((t, idx) => {
                const anyT = t as any;

                const idTentativo = anyT.idTentativo ?? idx;
                const idTest = anyT.idTest ?? idx;
                const titolo =
                    anyT.titoloTest ??
                    anyT.titolo ??
                    "Test";

                const punteggioTotale: number | null =
                    anyT.punteggioTotale ?? null;

                const esito: string | null =
                    anyT.esito ?? null;

                return (
                    <article
                        key={idTentativo}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                    >
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold">{titolo}</h3>

                            <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                                {typeof punteggioTotale === "number" && (
                                    <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5">
                                        Punteggio:{" "}
                                        <span className="ml-1 font-medium">
                                            {punteggioTotale}
                                        </span>
                                    </span>
                                )}
                                {esito && (
                                    <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 font-medium">
                                        {esito}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Button variant="secondary" asChild>
                                <Link href={`/candidati/test/${idTest}/risultati`}>
                                    Dettaglio
                                </Link>
                            </Button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
