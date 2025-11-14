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

export default function TestCandidatoPage() {
    const [tab, setTab] = useState<Tab>("disponibili");
    const [disponibili, setDisponibili] = useState<TestListItem[]>([]);
    const [storico, setStorico] = useState<TentativoListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                const [tests, tentativi] = await Promise.all([
                    getTestDisponibili(),
                    getTentativiCandidato(),
                ]);

                setDisponibili(tests ?? []);
                setStorico(tentativi ?? []);
            } catch (e) {
                console.error(e);
                setErrore("Errore durante il caricamento dei test.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    function labelTipo(tipo: TestListItem["tipo"]) {
        if (tipo === "SOFT_SKILLS") return "Soft skills";
        if (tipo === "TECNICO") return "Test tecnico";
        return tipo;
    }

    function labelEsito(esito: TentativoListItem["esito"]) {
        switch (esito) {
            case "IN_CORSO":
                return "In corso";
            case "SUPERATO":
                return "Superato";
            case "NON_SUPERATO":
                return "Non superato";
            case "SCADUTO":
                return "Scaduto";
            default:
                return esito;
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Test"
                subtitle="Gestisci i test da svolgere e consulta lo storico dei tentativi"
            />

            {errore && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errore}
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 mb-4">
                    <button
                        type="button"
                        onClick={() => setTab("disponibili")}
                        className={
                            "px-4 py-1.5 text-sm rounded-full transition " +
                            (tab === "disponibili"
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--muted)] hover:bg-white/5")
                        }
                    >
                        Test disponibili
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("storico")}
                        className={
                            "px-4 py-1.5 text-sm rounded-full transition " +
                            (tab === "storico"
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--muted)] hover:bg-white/5")
                        }
                    >
                        Storico test
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-[var(--muted)]">Caricamento test…</p>
                ) : (
                    <>
                        {tab === "disponibili" && (
                            <SezioneTestDisponibili
                                tests={disponibili}
                                labelTipo={labelTipo}
                            />
                        )}

                        {tab === "storico" && (
                            <SezioneStoricoTest
                                tentativi={storico}
                                labelTipo={labelTipo}
                                labelEsito={labelEsito}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function SezioneTestDisponibili({
                                    tests,
                                    labelTipo,
                                }: {
    tests: TestListItem[];
    labelTipo: (t: TestListItem["tipo"]) => string;
}) {
    if (tests.length === 0) {
        return (
            <EmptyState
                title="Nessun test disponibile"
                subtitle="Al momento non ci sono test assegnati al tuo profilo."
            />
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {tests.map((t) => (
                <article
                    key={t.idTest}
                    className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:shadow-md hover:border-[var(--accent)] transition"
                >
                    <header className="mb-3">
                        <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)]">
                            {t.titolo}
                        </h3>
                        <p className="mt-1 text-xs md:text-sm text-[var(--muted)]">
                            {labelTipo(t.tipo)} • Durata: {t.durataMinuti} min
                        </p>
                    </header>

                    <div className="flex justify-end">
                        <Button asChild>
                            <Link href={`/candidati/test/${t.idTest}/introduzione`}>
                                Vai al test
                            </Link>
                        </Button>
                    </div>
                </article>
            ))}
        </div>
    );
}

function SezioneStoricoTest({
                                tentativi,
                                labelTipo,
                                labelEsito,
                            }: {
    tentativi: TentativoListItem[];
    labelTipo: (t: TestListItem["tipo"]) => string;
    labelEsito: (e: TentativoListItem["esito"]) => string;
}) {
    if (tentativi.length === 0) {
        return (
            <EmptyState
                title="Nessun test svolto"
                subtitle="Quando completerai dei test, verranno mostrati qui."
            />
        );
    }

    return (
        <div className="space-y-3">
            {tentativi.map((t) => (
                <article
                    key={t.idTentativo}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h3 className="text-sm md:text-base font-semibold text-[var(--foreground)]">
                                {t.testTitolo}
                            </h3>
                            <p className="text-xs md:text-sm text-[var(--muted)]">
                                {labelTipo(t.tipo)}
                                {t.posizioneTitolo
                                    ? ` • Posizione: ${t.posizioneTitolo}`
                                    : ""}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                                Iniziato: {t.iniziatoAt}
                                {t.completatoAt && ` • Terminato: ${t.completatoAt}`}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                            {typeof t.punteggioTotale === "number" && (
                                <span className="text-sm font-medium">
                  Punteggio: {t.punteggioTotale}
                </span>
                            )}
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-[var(--border)] text-[var(--muted)]">
                {labelEsito(t.esito)}
              </span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
