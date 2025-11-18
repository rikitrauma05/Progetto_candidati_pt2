// app/candidati/test/[idTest]/tentativo/tentativo.tsx
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
    DomandaTest,
    GetDomandeResponse,
    RispostaDTO,
} from "@/types/test";

type StatoCaricamento = "CREAZIONE_TENTATIVO" | "CARICAMENTO_DOMANDE" | "PRONTO";
type RisposteUtente = Record<number, number | null>; // idDomanda -> idOpzione

export default function TentativoTestPage() {
    const params = useParams<{ idTest: string }>();
    const idTest = Number(params?.idTest ?? "0");

    const router = useRouter();

    const [stato, setStato] = useState<StatoCaricamento>("CREAZIONE_TENTATIVO");
    const [errore, setErrore] = useState<string | null>(null);

    const [idTentativo, setIdTentativo] = useState<number | null>(null);
    const [titoloTest, setTitoloTest] = useState<string>("");
    const [durataMinuti, setDurataMinuti] = useState<number>(0);
    const [domande, setDomande] = useState<DomandaTest[]>([]);

    const [risposte, setRisposte] = useState<RisposteUtente>({});
    const [tempoRimanente, setTempoRimanente] = useState<number>(0);
    const [staInviando, setStaInviando] = useState(false);
    const [tempoScaduto, setTempoScaduto] = useState(false);

    // 1) Avvio tentativo + caricamento domande
    useEffect(() => {
        if (!idTest) return;

        async function initTentativo() {
            try {
                setErrore(null);
                setStato("CREAZIONE_TENTATIVO");

                // POST /test/{idTest}/tentativi/avvia
                const avvio = await avviaTest(idTest);
                const nuovoIdTentativo = avvio.idTentativo;
                setIdTentativo(nuovoIdTentativo);

                setStato("CARICAMENTO_DOMANDE");

                // GET /test/tentativi/{idTentativo}/domande
                const datiDomande: GetDomandeResponse =
                    await getDomandeTentativo(nuovoIdTentativo);

                setTitoloTest(datiDomande.titoloTest);
                setDurataMinuti(datiDomande.durataMinuti);
                setDomande(datiDomande.domande);

                // inizializza risposte: tutte null
                const iniziali: RisposteUtente = {};
                for (const d of datiDomande.domande) {
                    iniziali[d.idDomanda] = null;
                }
                setRisposte(iniziali);

                // timer in secondi
                const seconds = (datiDomande.durataMinuti ?? 0) * 60;
                setTempoRimanente(seconds);

                setStato("PRONTO");
            } catch (e) {
                console.error(e);
                setErrore(
                    "Non è stato possibile avviare il test. Riprova più tardi."
                );
            }
        }

        initTentativo();
    }, [idTest]);

    // 2) Timer che scala ogni secondo
    useEffect(() => {
        if (stato !== "PRONTO") return;
        if (tempoRimanente <= 0 || tempoScaduto) return;

        const interval = setInterval(() => {
            setTempoRimanente((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTempoScaduto(true);
                    return 0;
                }
                return prev - 1;
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

    function onSelezionaRisposta(idDomanda: number, idOpzione: number) {
        setRisposte((prev) => ({
            ...prev,
            [idDomanda]: idOpzione,
        }));
    }

    async function onInviaTest() {
        if (!idTentativo) return;

        try {
            setStaInviando(true);
            setErrore(null);

            const payloadRisposte: RispostaDTO[] = Object.entries(risposte).map(
                ([idDomandaStr, idOpzione]) => ({
                    idDomanda: Number(idDomandaStr),
                    idOpzione: idOpzione ?? null,
                })
            );

            // POST /test/tentativi/{idTentativo}/risposte
            await inviaRisposte(idTentativo, {
                idTentativo,
                risposte: payloadRisposte,
            });

            router.push(
                `/candidati/test/${idTest}/risultati?tentativo=${idTentativo}`
            );
        } catch (e) {
            console.error(e);
            setErrore(
                "Si è verificato un errore durante l'invio del test. Riprova."
            );
        } finally {
            setStaInviando(false);
        }
    }

    const testInCaricamento = stato !== "PRONTO" || !idTentativo;

    if (!idTest) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Test non valido"
                    subtitle="L'identificativo del test non è corretto."
                    actions={[
                        {
                            label: "Torna ai test",
                            href: "/candidati/test",
                            variant: "primary",
                        },
                    ]}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={titoloTest || "Svolgimento del test"}
                subtitle={
                    testInCaricamento
                        ? "Stiamo preparando il tuo tentativo di test…"
                        : "Rispondi alle domande entro il tempo a disposizione."
                }
                actions={[
                    {
                        label: "Esci",
                        href: "/candidati/test",
                        variant: "dark", // OK per PageHeader ("primary" | "dark" | "success")
                    },
                ]}
            />

            {/* Stato / errori */}
            {errore && (
                <div className="max-w-3xl mx-auto rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-100">
                    {errore}
                </div>
            )}

            {/* Box principale */}
            <section className="max-w-4xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
                {/* Intestazione con timer */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                            Tempo rimanente
                        </p>
                        <p
                            className={`font-mono text-xl ${
                                tempoRimanente <= 60
                                    ? "text-red-600"
                                    : "text-[var(--foreground)]"
                            }`}
                        >
                            {minutiSecondi}
                        </p>
                        {tempoScaduto && (
                            <p className="text-xs text-red-600">
                                Il tempo è scaduto: puoi comunque provare a
                                inviare le risposte, se non è già stato fatto
                                in automatico dal sistema.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline" // variante valida del Button
                            disabled={testInCaricamento || staInviando}
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Se aggiorni la pagina potresti perdere le risposte non salvate. Vuoi davvero aggiornare?"
                                    )
                                ) {
                                    window.location.reload();
                                }
                            }}
                        >
                            Aggiorna pagina
                        </Button>
                        <Button
                            variant="primary"
                            disabled={testInCaricamento || staInviando}
                            onClick={onInviaTest}
                        >
                            {staInviando ? "Invio in corso…" : "Invia test"}
                        </Button>
                    </div>
                </div>

                {/* Stato di caricamento */}
                {testInCaricamento && (
                    <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                        <p>
                            Preparazione del tentativo in corso. Attendi qualche
                            istante senza chiudere la pagina.
                        </p>
                        <div className="space-y-2">
                            <div className="h-4 w-1/2 rounded bg-[var(--surface-soft)]" />
                            <div className="h-4 w-4/5 rounded bg-[var(--surface-soft)]" />
                            <div className="h-4 w-3/5 rounded bg-[var(--surface-soft)]" />
                        </div>
                    </div>
                )}

                {/* Domande */}
                {!testInCaricamento && domande.length > 0 && (
                    <div className="space-y-6">
                        {domande.map((domanda, index) => (
                            <div
                                key={domanda.idDomanda}
                                className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-[var(--foreground)]">
                                        <span className="mr-2 text-[var(--muted)]">
                                            {index + 1}.
                                        </span>
                                        {domanda.testo}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {domanda.opzioni.map((opzione) => (
                                        <label
                                            key={opzione.idOpzione}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-sm hover:border-[var(--border)] hover:bg-[var(--surface)]"
                                        >
                                            <input
                                                type="radio"
                                                name={`domanda-${domanda.idDomanda}`}
                                                className="h-4 w-4"
                                                checked={
                                                    risposte[
                                                        domanda.idDomanda
                                                        ] === opzione.idOpzione
                                                }
                                                onChange={() =>
                                                    onSelezionaRisposta(
                                                        domanda.idDomanda,
                                                        opzione.idOpzione
                                                    )
                                                }
                                            />
                                            <span>{opzione.testoOpzione}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!testInCaricamento && domande.length === 0 && (
                    <p className="text-sm text-[var(--muted)]">
                        Non ci sono domande associate a questo test. Contatta il
                        supporto per segnalare il problema.
                    </p>
                )}
            </section>
        </div>
    );
}
