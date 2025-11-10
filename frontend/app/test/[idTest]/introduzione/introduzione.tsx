"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TestIntroduzione() {
    const { idTest } = useParams<{ idTest: string }>();
    const [consenso, setConsenso] = useState(false);

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Introduzione al test</h2>
                <p className="text-muted">
                    Qui caricheremo titolo, durata, punteggio massimo e istruzioni del test
                    selezionato (<span className="font-mono">{String(idTest)}</span>).
                </p>
            </div>

            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4">
                <h3 className="text-lg font-semibold">Istruzioni</h3>
                <ul className="list-disc pl-6 text-sm text-muted space-y-1">
                    <li>Leggi attentamente le domande prima di rispondere.</li>
                    <li>Non aggiornare né chiudere la pagina durante lo svolgimento.</li>
                    <li>I risultati verranno salvati al termine.</li>
                </ul>

                <label className="flex items-center gap-2 text-sm mt-4">
                    <input
                        type="checkbox"
                        checked={consenso}
                        onChange={(e) => setConsenso(e.target.checked)}
                    />
                    Dichiaro di aver letto e compreso le istruzioni.
                </label>

                <div className="flex justify-end">
                    <Link
                        href={`/test/${idTest}/tentativo`}
                        className={`btn ${!consenso ? "pointer-events-none opacity-60" : ""}`}
                        aria-disabled={!consenso}
                        title={!consenso ? "Accetta le istruzioni per iniziare" : "Inizia il test"}
                    >
                        Inizia il test
                    </Link>
                </div>
            </div>
        </section>
    );
}
