"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Struttura del tentativo di test.
 * Nessun mock: layout + stati, in attesa di collegare le API reali.
 */
export default function TestTentativo() {
    const { idTest } = useParams<{ idTest: string }>();
    const router = useRouter();

    // Stato UI di base (timer, pagina corrente, risposte)
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [durataMinuti, setDurataMinuti] = useState<number | null>(null);
    const [secondiRimanenti, setSecondiRimanenti] = useState<number | null>(null);
    const [indiceDomanda, setIndiceDomanda] = useState(0);
    const [totDomande, setTotDomande] = useState(0);
    const [risposte, setRisposte] = useState<Record<string, string | number | boolean>>({});

    // Caricamento metadati test e domande (da API in futuro)
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;

        const bootstrap = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // TODO: sostituire con chiamate reali:
                // const meta = await testService.getMeta(idTest)
                // const qs = await testService.getDomande(idTest)
                // setDurataMinuti(meta.durataMinuti)
                // setTotDomande(qs.length)

                // Per ora: nessun mock → fissiamo solo la UI vuota
                setDurataMinuti(null);
                setTotDomande(0);

                // Timer parte solo se abbiamo una durata
                if (durataMinuti && durataMinuti > 0) {
                    const total = durataMinuti * 60;
                    setSecondiRimanenti(total);
                    timer = setInterval(() => {
                        setSecondiRimanenti((s) => {
                            if (s === null) return s;
                            if (s <= 1) {
                                clearInterval(timer!);
                                // TODO: submit automatico
                                router.push(`/test/${idTest}/risultati`);
                                return 0;
                            }
                            return s - 1;
                        });
                    }, 1000);
                }
            } catch {
                setErrore("Impossibile avviare il test in questo momento.");
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
        return () => {
            if (timer) clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idTest]);

    function onRispondi(domandaId: string, valore: string | number | boolean) {
        setRisposte((prev) => ({ ...prev, [domandaId]: valore }));
    }

    function next() {
        if (indiceDomanda + 1 < totDomande) setIndiceDomanda((i) => i + 1);
    }

    function prev() {
        if (indiceDomanda > 0) setIndiceDomanda((i) => i - 1);
    }

    async function submit() {
        try {
            setLoading(true);
            // TODO: testService.submitTentativo({ idTest, risposte })
            router.push(`/test/${idTest}/risultati`);
        } catch {
            setErrore("Errore durante l'invio delle risposte.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <p className="text-muted">Preparazione del test…</p>
            </section>
        );
    }

    if (errore) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center text-red-600">
                <p>{errore}</p>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Header test */}
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Test #{String(idTest)}</h2>
                    <p className="text-sm text-muted">
                        Domanda {totDomande === 0 ? 0 : indiceDomanda + 1} di {totDomande}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-muted">Tempo rimanente</p>
                    <p className="font-mono">
                        {secondiRimanenti == null
                            ? "—"
                            : `${Math.floor(secondiRimanenti / 60)
                                .toString()
                                .padStart(2, "0")}:${(secondiRimanenti % 60)
                                .toString()
                                .padStart(2, "0")}`}
                    </p>
                </div>
            </div>

            {/* Corpo domanda (placeholder fino a integrazione DB) */}
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4">
                <div className="h-24 rounded-xl border border-dashed border-border grid place-items-center text-muted">
                    Qui verrà caricata la domanda e le sue opzioni dal database.
                </div>

                {/* Placeholder interazione risposta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                        onClick={() => onRispondi("DOMANDA_PLACEHOLDER", "A")}
                    >
                        Seleziona opzione A
                    </button>
                    <button
                        type="button"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                        onClick={() => onRispondi("DOMANDA_PLACEHOLDER", "B")}
                    >
                        Seleziona opzione B
                    </button>
                </div>
            </div>

            {/* Navigazione */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    className="rounded-xl border border-border px-4 py-2 hover:bg-surface disabled:opacity-50"
                    onClick={prev}
                    disabled={indiceDomanda <= 0}
                >
                    Indietro
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface disabled:opacity-50"
                        onClick={next}
                        disabled={indiceDomanda + 1 >= totDomande}
                    >
                        Avanti
                    </button>
                    <button type="button" className="btn" onClick={submit}>
                        Invia risposte
                    </button>
                </div>
            </div>
        </section>
    );
}
