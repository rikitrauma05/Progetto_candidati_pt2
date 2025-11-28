"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStrutturaTest } from "@/services/test.service";
import type { StrutturaTestDto } from "@/types/test/test";

type DettaglioTestProps = {
    idTest: number;
};

export default function DettaglioTest({ idTest }: DettaglioTestProps) {
    const [test, setTest] = useState<StrutturaTestDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getStrutturaTest(idTest);
                setTest(data);
            } catch (e: any) {
                console.error("Errore caricamento test:", e);
                setError(
                    e?.message ||
                    "Si è verificato un errore nel caricamento del test."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [idTest]);

    if (loading) {
        return (
            <section className="max-w-4xl mx-auto p-6">
                <p className="text-sm text-[var(--muted)]">
                    Caricamento test…
                </p>
            </section>
        );
    }

    if (error || !test) {
        return (
            <section className="max-w-4xl mx-auto p-6 space-y-4">
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
                    <p className="text-sm text-destructive">
                        {error || "Test non trovato."}
                    </p>
                </div>

                <Link
                    href="/hr/test"
                    className="text-sm text-blue-500 hover:underline"
                >
                    ← Torna alla lista test
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-4xl mx-auto space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{test.titolo}</h1>
                    <p className="text-sm text-[var(--muted)]">
                        Tipo: {test.tipo || "Non specificato"}
                    </p>
                </div>

                <Link
                    href="/hr/test"
                    className="px-4 py-2 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--accent)]/10"
                >
                    Torna ai test
                </Link>
            </header>

            <div className="rounded-xl border bg-[var(--card)] p-6 space-y-3">
                <p>
                    <strong>Descrizione:</strong>{" "}
                    {test.descrizione || "—"}
                </p>
                <p>
                    <strong>Durata:</strong> {test.durataMinuti} minuti
                </p>
                <p>
                    <strong>Punteggio massimo:</strong> {test.punteggioMax}
                </p>
                <p>
                    <strong>Numero domande:</strong> {test.numeroDomande}
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Domande</h2>

                {test.domande.map((domanda, index) => (
                    <div
                        key={domanda.idDomanda}
                        className="border rounded-lg p-4 bg-[var(--surface)] space-y-3"
                    >
                        <h3 className="font-medium">
                            {index + 1}. {domanda.testo}
                        </h3>

                        <div className="space-y-2">
                            {domanda.opzioni.map((opzione) => (
                                <div
                                    key={opzione.idOpzione}
                                    className={`px-3 py-2 rounded-md border text-sm ${
                                        opzione.corretta
                                            ? "bg-green-500/20 border-green-500 text-green-900"
                                            : "bg-[var(--input)] border-[var(--border)]"
                                    }`}
                                >
                                    {opzione.testoOpzione}
                                    {opzione.corretta && (
                                        <span className="ml-2 font-semibold">
                                            (Corretta)
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
