"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import {
    getTestDisponibili,
    getTentativiCandidato,
} from "@/services/test.service";
import type { TestListItem, TentativoListItem } from "@/types/test";

type Stato = "LOADING" | "OK" | "ERROR";

export default function TestCandidatoPage() {
    const [stato, setStato] = useState<Stato>("LOADING");
    const [errore, setErrore] = useState<string | null>(null);

    const [tests, setTests] = useState<TestListItem[]>([]);
    const [tentativi, setTentativi] = useState<TentativoListItem[]>([]);

    useEffect(() => {
        async function load() {
            try {
                setErrore(null);
                setStato("LOADING");

                const [testsRes, tentativiRes] = await Promise.all([
                    getTestDisponibili(),
                    getTentativiCandidato(),
                ]);

                setTests(testsRes);
                setTentativi(tentativiRes);
                setStato("OK");
            } catch (e) {
                console.error(e);
                setErrore(
                    "Non è stato possibile caricare i test. Riprova più tardi."
                );
                setStato("ERROR");
            }
        }

        load();
    }, []);

    const testSvoltiIds = new Set(
        tentativi
            .filter((t) => t.idTest != null)
            .map((t) => t.idTest as number)
    );

    const tentativoPerTest = new Map<number, TentativoListItem>();
    for (const t of tentativi) {
        if (t.idTest == null) continue;
        const key = t.idTest as number;
        const existing = tentativoPerTest.get(key);

        if (!existing) {
            tentativoPerTest.set(key, t);
        } else {
            if (t.completatoAt && existing.completatoAt) {
                if (t.completatoAt.localeCompare(existing.completatoAt) > 0) {
                    tentativoPerTest.set(key, t);
                }
            } else if (t.completatoAt && !existing.completatoAt) {
                tentativoPerTest.set(key, t);
            }
        }
    }

    const tentativiOrdinati: TentativoListItem[] = [...tentativi].sort(
        (a, b) => {
            if (!a.completatoAt && !b.completatoAt) return 0;
            if (!a.completatoAt) return 1;
            if (!b.completatoAt) return -1;
            return b.completatoAt.localeCompare(a.completatoAt);
        }
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Test disponibili"
                subtitle="Visualizza i test assegnati e consulta lo storico dei tentativi."
            />

            {errore && (
                <div className="max-w-4xl mx-auto rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {errore}
                </div>
            )}

            {/* TEST DISPONIBILI */}
            <section className="max-w-5xl mx-auto space-y-4">
                <h2 className="text-lg font-semibold">Test assegnati</h2>

                {stato === "LOADING" && (
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento in corso…
                    </p>
                )}

                {stato === "OK" && tests.length === 0 && (
                    <p className="text-sm text-[var(--muted)]">
                        Al momento non hai test disponibili.
                    </p>
                )}

                {stato === "OK" && tests.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {tests.map((test) => {
                            const svolto = testSvoltiIds.has(test.idTest);
                            const tentativo = tentativoPerTest.get(
                                test.idTest
                            );

                            const hrefRisultati = tentativo
                                ? `/candidati/test/${test.idTest}/risultati?tentativo=${tentativo.idTentativo}`
                                : `/candidati/test/${test.idTest}/risultati`;

                            const hrefAzione = svolto
                                ? hrefRisultati
                                : `/candidati/test/${test.idTest}/introduzione`;

                            return (
                                <article
                                    key={test.idTest}
                                    className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-base font-semibold">
                                                {test.titolo}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                                    svolto
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/40"
                                                        : "bg-sky-500/10 text-sky-500 border border-sky-500/40"
                                                }`}
                                            >
                                                {svolto
                                                    ? "Svolto"
                                                    : "Disponibile"}
                                            </span>
                                        </div>
                                        {test.descrizione && (
                                            <p className="text-sm text-[var(--muted)] line-clamp-3">
                                                {test.descrizione}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                                        <div className="space-x-2">
                                            {test.durataMinuti != null && (
                                                <span>
                                                    Durata:{" "}
                                                    {test.durataMinuti} min
                                                </span>
                                            )}
                                            {test.punteggioMax != null && (
                                                <span>
                                                    · Max:{" "}
                                                    {test.punteggioMax} pt
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <Link href={hrefAzione}>
                                                <Button
                                                    variant={
                                                        svolto
                                                            ? "outline"
                                                            : "primary"
                                                    }
                                                    size="sm"
                                                >
                                                    {svolto
                                                        ? "Vedi risultati"
                                                        : "Inizia test"}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* STORICO TENTATIVI */}
            <section className="max-w-5xl mx-auto space-y-4">
                <h2 className="text-lg font-semibold">Storico tentativi</h2>

                {stato === "LOADING" && (
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento in corso…
                    </p>
                )}

                {stato === "OK" && tentativiOrdinati.length === 0 && (
                    <p className="text-sm text-[var(--muted)]">
                        Non hai ancora svolto alcun test.
                    </p>
                )}

                {stato === "OK" && tentativiOrdinati.length > 0 && (
                    <div className="space-y-2 text-sm">
                        {tentativiOrdinati.map((t) => (
                            <div
                                key={t.idTentativo}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2"
                            >
                                <div className="space-y-0.5">
                                    <p className="font-medium">
                                        {t.titoloTest}
                                    </p>
                                    <p className="text-[11px] text-[var(--muted)]">
                                        Punteggio:{" "}
                                        {t.punteggioTotale ?? 0}/
                                        {t.punteggioMax ?? "-"} · Esito:{" "}
                                        {t.esito ?? "IN_VALUTAZIONE"}
                                        {t.completatoAt &&
                                            ` · Completato il ${t.completatoAt}`}
                                    </p>
                                </div>
                                <Link
                                    href={`/candidati/test/${t.idTest}/risultati?tentativo=${t.idTentativo}`}
                                >
                                    <Button variant="outline" size="sm">
                                        Vedi dettaglio
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
