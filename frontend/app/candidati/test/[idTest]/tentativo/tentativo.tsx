"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";

import {
    avviaTest,
    getDomandeTentativo,
    inviaRisposte,
} from "@/services/test.service";

import type {
    GetDomandeResponse,
    RispostaDTO,
} from "@/types/test/tentativo-test";

type StatoCaricamento = "CREAZIONE" | "DOMANDE" | "PRONTO";
type RisposteUtente = Record<number, number | null>;

export default function TentativoTestPage() {

    /* ----------------------------------------------------------
       PARAMETRI URL
    ---------------------------------------------------------- */
    const params = useParams<{ idTest: string }>();
    const idTest = Number(params.idTest);

    const router = useRouter();

    /* ----------------------------------------------------------
       STATE
    ---------------------------------------------------------- */
    const [stato, setStato] = useState<StatoCaricamento>("CREAZIONE");
    const [errore, setErrore] = useState<string | null>(null);

    const [idTentativo, setIdTentativo] = useState<number | null>(null);
    const [titoloTest, setTitoloTest] = useState("");
    const [durataMinuti, setDurataMinuti] = useState(0);
    const [domande, setDomande] = useState<GetDomandeResponse["domande"]>([]);
    const [risposte, setRisposte] = useState<RisposteUtente>({});
    const [tempoRimanente, setTempoRimanente] = useState(0);
    const [tempoScaduto, setTempoScaduto] = useState(false);
    const [staInviando, setStaInviando] = useState(false);
    const [indice, setIndice] = useState(0);

    /* ----------------------------------------------------------
       INIT — AVVIO TENTATIVO + CARICAMENTO DOMANDE
    ---------------------------------------------------------- */
    useEffect(() => {
        if (!idTest) return;

        async function init() {
            try {
                setErrore(null);
                setStato("CREAZIONE");

                // 1) Avvia tentativo
                const avvio = await avviaTest(idTest);

                if (!avvio?.idTentativo) {
                    throw new Error("Tentativo non valido");
                }

                const tid = avvio.idTentativo;
                setIdTentativo(tid);

                // 2) Carica domande
                setStato("DOMANDE");

                const data = await getDomandeTentativo(tid);

                setTitoloTest(data.titoloTest);
                setDurataMinuti(data.durataMinuti);
                setDomande(data.domande);

                const iniziali: RisposteUtente = {};
                data.domande.forEach((d) => {
                    iniziali[d.idDomanda] = null;
                });
                setRisposte(iniziali);

                setTempoRimanente(data.durataMinuti * 60);

                setStato("PRONTO");
            } catch (e: any) {
                console.error("ERRORE INIT:", e);

                if (e?.message?.includes("409") || e?.status === 409) {
                    setErrore("Hai già svolto questo test e non puoi ripeterlo.");
                    setStato("PRONTO");
                    setDomande([]);
                    return;
                }

                setErrore("Errore durante l'avvio del test.");
            }
        }

        init();
    }, [idTest]);

    /* ----------------------------------------------------------
       TIMER
    ---------------------------------------------------------- */
    useEffect(() => {
        if (stato !== "PRONTO") return;
        if (tempoRimanente <= 0 || tempoScaduto) return;

        const interval = setInterval(() => {
            setTempoRimanente((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    setTempoScaduto(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stato, tempoRimanente, tempoScaduto]);

    const minutiSecondi = useMemo(() => {
        const m = Math.floor(tempoRimanente / 60);
        const s = tempoRimanente % 60;
        return `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    }, [tempoRimanente]);

    /* ----------------------------------------------------------
       SELEZIONE RISPOSTA
    ---------------------------------------------------------- */
    function seleziona(idDomanda: number, idOpzione: number) {
        setRisposte((prev) => ({
            ...prev,
            [idDomanda]: idOpzione,
        }));
    }

    /* ----------------------------------------------------------
       INVIO TEST
    ---------------------------------------------------------- */
    async function invia() {
        if (!idTentativo) return;

        try {
            setStaInviando(true);

            const payload: RispostaDTO[] = Object.entries(risposte).map(
                ([idDomanda, idOpzione]) => ({
                    idDomanda: Number(idDomanda),
                    idOpzione: idOpzione ?? null,
                })
            );

            await inviaRisposte(idTentativo, {
                idTentativo,
                risposte: payload,
            });

            router.push(
                `/candidati/test/${idTest}/risultati?tentativo=${idTentativo}`
            );
        } catch (e) {
            console.error("ERRORE INVIO:", e);
            setErrore("Errore durante l'invio del test.");
        } finally {
            setStaInviando(false);
        }
    }

    function prossima() {
        if (indice < domande.length - 1) {
            setIndice(indice + 1);
        } else {
            invia();
        }
    }

    /* ----------------------------------------------------------
       RENDER
    ---------------------------------------------------------- */

    const testInCaricamento =
        (stato !== "PRONTO" || !idTentativo) && !errore;

    const domanda = !testInCaricamento
        ? domande[indice] ?? null
        : null;

    if (!idTest) {
        return (
            <PageHeader
                title="Test non trovato"
                subtitle="ID non valido."
                actions={[
                    {
                        label: "Torna ai test",
                        href: "/candidati/test",
                        variant: "primary",
                    },
                ]}
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={titoloTest || "Svolgimento test"}
                subtitle={
                    testInCaricamento
                        ? "Preparazione del tentativo…"
                        : "Rispondi alle domande entro il tempo a disposizione."
                }
                actions={[
                    {
                        label: "Esci",
                        href: "/candidati/test",
                        variant: "dark",
                    },
                ]}
            />

            {errore && (
                <div className="max-w-3xl mx-auto rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-800">
                    {errore}
                </div>
            )}

            <section className="max-w-4xl mx-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">

                {/* TIMER */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Tempo rimanente
                        </p>
                        <p
                            className={`font-mono text-xl ${
                                tempoRimanente <= 60 && tempoRimanente > 0
                                    ? "text-red-600"
                                    : "text-[var(--foreground)]"
                            }`}
                        >
                            {minutiSecondi}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        disabled={testInCaricamento}
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Aggiornando perderai le risposte non inviate. Continuare?"
                                )
                            ) {
                                window.location.reload();
                            }
                        }}
                    >
                        Aggiorna
                    </Button>
                </div>

                {/* LOADING */}
                {testInCaricamento && (
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento… attendi qualche secondo.
                    </p>
                )}

                {/* DOMANDE */}
                {!testInCaricamento && domanda && (
                    <div className="space-y-4">

                        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                            <span>
                                Domanda {indice + 1} di {domande.length}
                            </span>
                            <span>Durata: {durataMinuti} min</span>
                        </div>

                        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 space-y-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                                {domanda.testo}
                            </p>

                            <div className="space-y-2">
                                {domanda.opzioni.map((o) => (
                                    <label
                                        key={o.idOpzione}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm cursor-pointer hover:bg-[var(--surface)]"
                                    >
                                        <input
                                            type="radio"
                                            className="h-4 w-4"
                                            checked={
                                                risposte[domanda.idDomanda] ===
                                                o.idOpzione
                                            }
                                            onChange={() =>
                                                seleziona(
                                                    domanda.idDomanda,
                                                    o.idOpzione
                                                )
                                            }
                                        />
                                        <span>{o.testoOpzione}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                disabled={staInviando}
                                onClick={prossima}
                            >
                                {indice === domande.length - 1
                                    ? staInviando
                                        ? "Invio…"
                                        : "Invia test"
                                    : "Prossima domanda"}
                            </Button>
                        </div>
                    </div>
                )}

                {!testInCaricamento && !domanda && !errore && (
                    <p className="text-sm text-[var(--muted)]">
                        Questo test non ha domande configurate.
                    </p>
                )}
            </section>
        </div>
    );
}
