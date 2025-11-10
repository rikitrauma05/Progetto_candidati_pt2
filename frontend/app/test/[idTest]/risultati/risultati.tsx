"use client";

import { useParams } from "next/navigation";

export default function TestRisultati() {
    const { idTest } = useParams<{ idTest: string }>();

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Risultati del test</h2>
                <p className="text-muted">
                    Test ID: <span className="font-mono">{String(idTest)}</span>
                </p>
            </div>

            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4">
                <h3 className="text-lg font-semibold">Esito complessivo</h3>

                <div className="h-32 rounded-xl border border-dashed border-border grid place-items-center text-muted">
                    Qui verranno caricati punteggio, tempo impiegato e stato
                    (superato/non superato).
                </div>
            </div>

            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4">
                <h3 className="text-lg font-semibold">Dettaglio risposte</h3>
                <div className="h-48 rounded-xl border border-dashed border-border grid place-items-center text-muted">
                    Qui verrà mostrato il riepilogo delle domande e delle risposte corrette.
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <a
                    href={`/test/${idTest}/tentativo`}
                    className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                >
                    Ritenta
                </a>
                <a href="/candidati/posizioni" className="btn">
                    Torna alle posizioni
                </a>
            </div>
        </section>
    );
}
