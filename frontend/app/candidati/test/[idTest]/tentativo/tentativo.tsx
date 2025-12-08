"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import { getDomandeTentativo, completaTest } from "@/services/test.service";
import type { GetDomandeResponse, RispostaDTO } from "@/types/test/tentativo-test";

type StatoCaricamento = "CARICAMENTO" | "PRONTO";
type RisposteUtente = Record<number, number | null>;

function getLocalISOString(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    // Formato: YYYY-MM-DDTHH:MM:SS
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

export default function TentativoTestPage() {

    /* ----------------------------------------------------------
       PARAMETRI URL
    ---------------------------------------------------------- */
    const params = useParams<{ idTest: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const idTest = Number(params.idTest);
    const idPosizione = Number(searchParams.get('idPosizione'));



    /* ----------------------------------------------------------
       STATE
    ---------------------------------------------------------- */
    const [stato, setStato] = useState<StatoCaricamento>("CARICAMENTO");
    const [errore, setErrore] = useState<string | null>(null);
    const [iniziatoAt] = useState<Date>(new Date());

    const [titoloTest, setTitoloTest] = useState("");
    const [durataMinuti, setDurataMinuti] = useState(0);
    const [domande, setDomande] = useState<GetDomandeResponse["domande"]>([]);
    const [risposte, setRisposte] = useState<RisposteUtente>({});
    const [tempoRimanente, setTempoRimanente] = useState(0);
    const [tempoScaduto, setTempoScaduto] = useState(false);
    const [staInviando, setStaInviando] = useState(false);
    const [indice, setIndice] = useState(0);
    const getTimerStorageKey = (idTest: number) => `test-timer-id-${idTest}`;

    // Ref per evitare invii multipli e per leggere risposte stabili dentro useCallback
    const inviatoRef = useRef(false);
    const risposteRef = useRef<RisposteUtente>(risposte);

    useEffect(() => {
        risposteRef.current = risposte;
    }, [risposte]);

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


                const data = await getDomandeTentativo(idTest);

                setTitoloTest(data.titoloTest);
                setDurataMinuti(data.durataMinuti);
                setDomande(data.domande);

                const iniziali: RisposteUtente = {};
                data.domande.forEach((d) => {
                    iniziali[d.idDomanda] = null;
                });
                setRisposte(iniziali);

                const chiaveTempo = getTimerStorageKey(idTest);
                const tempoSalvato = localStorage.getItem(chiaveTempo);
                let tempoIniziale = data.durataMinuti * 60; // Tempo predefinito

                if (tempoSalvato) {
                    const tempoRecuperato = parseInt(tempoSalvato, 10);
                    // Usiamo il tempo recuperato solo se è positivo
                    if (tempoRecuperato > 0) {
                        tempoIniziale = tempoRecuperato;
                    } else {
                        // Tempo salvato è <= 0, cancelliamo la chiave e usiamo il tempo iniziale
                        localStorage.removeItem(chiaveTempo);
                    }
                } else {
                    // Se non c'è nulla in storage, salviamo il tempo pieno per la prima volta
                    localStorage.setItem(chiaveTempo, String(tempoIniziale));
                }

                setTempoRimanente(tempoIniziale);
                setStato("PRONTO");
            } catch (e: any) {
                setErrore("C'è stato un errore nel ricaricamento del test.")
            }
        }

        init();
    }, [idTest, idPosizione]);


    /* ----------------------------------------------------------
       INVIO TEST — CREA CANDIDATURA + TENTATIVO + RISPOSTE
       reso stabile con useCallback e proteggo da invii multipli con inviatoRef
    ---------------------------------------------------------- */
    const invia = useCallback(async () => {
        if (inviatoRef.current) return;
        inviatoRef.current = true;

        if (!idTest || !idPosizione) return;

        try {
            setStaInviando(true);

            // ! RISPOSTEREF.CURRENT viene letto qui, garantendo l'ultimo stato
            const payload: RispostaDTO[] = Object.entries(risposteRef.current).map(
                ([idDomanda, idOpzione]) => ({
                    idDomanda: Number(idDomanda),
                    idOpzione: idOpzione ?? null,
                })
            );


            const response = await completaTest({
                idTest,
                idPosizione,
                iniziatoAt: getLocalISOString(iniziatoAt),
                risposte: payload,
            });

            localStorage.removeItem(getTimerStorageKey(idTest)); // pulisco storage al termine

            router.push(
                `/candidati/test/${idTest}/risultati?idTentativo=${response.idTentativo}`
            );
        } catch (e: any) {
            console.error("ERRORE INVIO:", e);
            setErrore(e?.message ?? "Errore durante l'invio del test.");
            // RE-IMPOSTO inviatoRef a false in caso di fallimento per permettere ritentativo
            inviatoRef.current = false;
        } finally {
            setStaInviando(false);
        }
    }, [idTest, idPosizione, iniziatoAt, router]);


    /* ----------------------------------------------------------
       EFFETTO 1: GESTIONE DEL TIMER E SCADENZA (Modificata)
       - Imposta solo il tempoRimanente e tempoScaduto
    ---------------------------------------------------------- */
    useEffect(() => {
        if (stato !== "PRONTO" || tempoScaduto) return;

        const chiaveTempo = getTimerStorageKey(idTest);

        const interval = setInterval(() => {
            setTempoRimanente((t) => {
                const nuovoTempo = t - 1;

                if (nuovoTempo > 0) {
                    localStorage.setItem(chiaveTempo, String(nuovoTempo));
                    return nuovoTempo;
                } else if (nuovoTempo <= 0) {
                    // Tempo SCADUTO!
                    clearInterval(interval);
                    localStorage.removeItem(chiaveTempo);
                    setTempoScaduto(true); // <--- Imposta lo stato per l'altro useEffect
                    return 0;
                }
                return t; // non dovrebbe succedere
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        }

    }, [stato, idTest, tempoScaduto]); // Non dipende più da tempoRimanente, invia


    /* ----------------------------------------------------------
       EFFETTO 2: INVIO AUTOMATICO (Nuovo blocco dedicato)
       - Si attiva solo quando tempoScaduto diventa TRUE.
    ---------------------------------------------------------- */
    useEffect(() => {
        if (tempoScaduto) {
            // Se tempoScaduto è TRUE, chiama invia()
            invia();
        }
    }, [tempoScaduto, invia]);


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
                        <p
                            className={`font-mono text-xl ${
                                tempoRimanente <= 60 && tempoRimanente >= 0
                                    ? "text-red-600"
                                    : "text-[var(--foreground)]"
                            }`}
                        >
                            {tempoScaduto || tempoRimanente === 0
                                ? "Tempo scaduto, invio del test in corso..."
                                : minutiSecondi}
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
                                            disabled={staInviando || tempoScaduto}
                                        />
                                        <span>{o.testoOpzione}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                disabled={staInviando || tempoScaduto}
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