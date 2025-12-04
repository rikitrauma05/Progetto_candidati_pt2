// app/candidati/test/[idTest]/tentativo/tentativo.tsx (o page.tsx)

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // ✅ Aggiungi useSearchParams
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import { getDomandeTentativo, completaTest } from "@/services/test.service"; // ✅ Rimuovi avviaTest, aggiungi completaTest
import type { GetDomandeResponse, RispostaDTO } from "@/types/test/tentativo-test";

type StatoCaricamento = "CARICAMENTO" | "PRONTO";
type RisposteUtente = Record<number, number | null>;

export default function TentativoTestPage() {
    /* ----------------------------------------------------------
       PARAMETRI URL
    ---------------------------------------------------------- */
    const params = useParams<{ idTest: string }>();
    const searchParams = useSearchParams(); // ✅ AGGIUNGI
    const router = useRouter();

    const idTest = Number(params.idTest);
    const idPosizione = Number(searchParams.get('idPosizione')); // ✅ Leggi dall'URL
    //
    // console.log('🔍 DEBUG - idTest:', idTest);
    // console.log('🔍 DEBUG - idPosizione:', idPosizione);
    // console.log('🔍 DEBUG - searchParams:', searchParams.toString());


    /* ----------------------------------------------------------
       STATE
    ---------------------------------------------------------- */
    const [stato, setStato] = useState<StatoCaricamento>("CARICAMENTO");
    const [errore, setErrore] = useState<string | null>(null);
    const [iniziatoAt] = useState<Date>(new Date()); // ✅ Timestamp di inizio

    const [titoloTest, setTitoloTest] = useState("");
    const [durataMinuti, setDurataMinuti] = useState(0);
    const [domande, setDomande] = useState<GetDomandeResponse["domande"]>([]);
    const [risposte, setRisposte] = useState<RisposteUtente>({});
    const [tempoRimanente, setTempoRimanente] = useState(0);
    const [tempoScaduto, setTempoScaduto] = useState(false);
    const [staInviando, setStaInviando] = useState(false);
    const [indice, setIndice] = useState(0);

    /* ----------------------------------------------------------
       INIT — CARICA SOLO DOMANDE (NON CREA TENTATIVO)
    ---------------------------------------------------------- */
    useEffect(() => {
        if (!idTest || !idPosizione) {
            setErrore("Parametri mancanti: idTest o idPosizione");
            return;
        }

        async function init() {
            try {
                setErrore(null);
                setStato("CARICAMENTO");

                // ✅ Carica SOLO le domande (NON crea tentativo)
                const data = await getDomandeTentativo(idTest);

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
                setErrore("Errore durante il caricamento del test.");
            }
        }

        init();
    }, [idTest, idPosizione]); // ✅ Dipendenze corrette

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
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
       INVIO TEST — CREA CANDIDATURA + TENTATIVO + RISPOSTE
    ---------------------------------------------------------- */
    async function invia() {
        if (!idTest || !idPosizione) return;

        try {
            setStaInviando(true);

            const payload: RispostaDTO[] = Object.entries(risposte).map(
                ([idDomanda, idOpzione]) => ({
                    idDomanda: Number(idDomanda),
                    idOpzione: idOpzione ?? null,
                })
            );

            // ✅ Invia tutto in una volta (crea candidatura + tentativo + risposte)
            const response = await completaTest({
                idTest,
                idPosizione,
                iniziatoAt: iniziatoAt.toISOString(),
                risposte: payload,
            });
            console.log("RESPONSE COMPLETATEST:", response);

            // ✅ Redirect ai risultati
            router.push(
                `/candidati/test/${idTest}/risultati?idTentativo=${response.idTentativo}`
            );
        } catch (e: any) {
            console.error("ERRORE INVIO:", e);
            setErrore(e?.message ?? "Errore durante l'invio del test.");
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
    const testInCaricamento = stato !== "PRONTO" && !errore;
    const domanda = !testInCaricamento ? domande[indice] ?? null : null;

    if (!idTest || !idPosizione) {
        return (
            <PageHeader
                title="Test non valido"
                subtitle="Parametri mancanti."
                actions={[
                    {
                        label: "Torna alle posizioni",
                        href: "/candidati/posizioni",
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
                        ? "Caricamento del test…"
                        : "Rispondi alle domande entro il tempo a disposizione."
                }
                actions={[
                    {
                        label: "Esci",
                        href: "/candidati/posizioni",
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