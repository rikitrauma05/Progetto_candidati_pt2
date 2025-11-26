"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import { getRisultatoTentativo } from "@/services/test.service";
import type { RisultatoTentativoDettaglio } from "@/types/test";

function esitoLabel(esito: string) {
    switch (esito) {
        case "SUPERATO":
            return "Superato";
        case "NON_SUPERATO":
            return "Non superato";
        case "IN_VALUTAZIONE":
            return "In valutazione";
        default:
            return esito;
    }
}

function esitoClass(esito: string) {
    switch (esito) {
        case "SUPERATO":
            return "text-emerald-600 bg-emerald-500/10 border-emerald-500/40";
        case "NON_SUPERATO":
            return "text-red-600 bg-red-500/10 border-red-500/40";
        case "IN_VALUTAZIONE":
            return "text-amber-700 bg-amber-500/10 border-amber-500/40";
        default:
            return "text-[var(--foreground)] bg-[var(--surface-soft)] border-[var(--border-soft)]";
    }
}

export default function RisultatiTestPage() {
    const params = useParams<{ idTest: string }>();
    const idTest = Number(params?.idTest ?? "0");

    const searchParams = useSearchParams();
    const router = useRouter();

    const idTentativoParam = searchParams.get("tentativo");
    const idTentativo = idTentativoParam ? Number(idTentativoParam) : NaN;

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [risultato, setRisultato] = useState<RisultatoTentativoDettaglio | null>(null);

    useEffect(() => {
        if (!idTest || !idTentativo || Number.isNaN(idTentativo)) {
            setLoading(false);
            setErrore(
                "Tentativo non specificato correttamente. Torna alla lista dei test."
            );
            return;
        }

        async function load() {
            setLoading(true);
            setErrore(null);
            try {
                const data = await getRisultatoTentativo(idTentativo);
                setRisultato(data);
            } catch (e) {
                console.error(e);
                setErrore(
                    "Non è stato possibile caricare i risultati del test. Riprova più tardi."
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [idTest, idTentativo]);

    const percentuale = useMemo(() => {
        if (!risultato) return null;
        if (!risultato.punteggioMax) return null;
        return Math.round(
            (risultato.punteggioTotale / risultato.punteggioMax) * 100
        );
    }, [risultato]);

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
                title={risultato ? `Risultati: ${risultato.titoloTest}` : "Risultati del test"}
                subtitle={
                    loading
                        ? "Caricamento dei risultati in corso…"
                        : errore
                            ? "Non siamo riusciti a recuperare i risultati."
                            : "Ecco il riepilogo del tuo tentativo."
                }
                kpis={
                    risultato
                        ? [
                            {
                                label: "Punteggio",
                                value: `${risultato.punteggioTotale} / ${risultato.punteggioMax}`,
                            },
                            {
                                label: "Esito",
                                value: esitoLabel(risultato.esito),
                            },
                            {
                                label: "Domande corrette",
                                value: `${risultato.numeroCorrette} / ${risultato.numeroDomande}`,
                            },
                        ]
                        : []
                }
                actions={[
                    {
                        label: "Torna ai test",
                        href: "/candidati/test",
                        variant: "dark",
                    },
                ]}
            />

            {errore && (
                <section className="max-w-3xl mx-auto rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-800 dark:text-red-100 space-y-2">
                    <p>{errore}</p>
                    <div className="pt-2">
                        <Button
                            variant="primary"
                            onClick={() => router.push("/candidati/test")}
                        >
                            Vai alla lista test
                        </Button>
                    </div>
                </section>
            )}

            {loading && !errore && (
                <section className="max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
                    <div className="h-4 w-1/2 rounded bg-[var(--surface-soft)]" />
                    <div className="h-3 w-3/4 rounded bg-[var(--surface-soft)]" />
                    <div className="h-3 w-2/3 rounded bg-[var(--surface-soft)]" />
                    <div className="mt-4 h-20 w-full rounded-xl bg-[var(--surface-soft)]" />
                </section>
            )}

            {!loading && !errore && risultato && (
                <section className="max-w-4xl mx-auto space-y-6">
                    <div className={`rounded-2xl border p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${esitoClass(risultato.esito)}`}>
                        <div>
                            <p className="text-xs uppercase tracking-wide">
                                Esito del tentativo
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {esitoLabel(risultato.esito)}
                            </p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1">
                            <p className="text-sm font-medium">
                                Punteggio ottenuto
                            </p>
                            <p className="text-xl font-semibold">
                                {risultato.punteggioTotale} / {risultato.punteggioMax}
                            </p>
                            {typeof percentuale === "number" && (
                                <p className="text-xs opacity-80">
                                    ({percentuale}% del punteggio massimo)
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
                            <h3 className="text-sm font-semibold">Riepilogo domande</h3>
                            <p className="text-sm text-[var(--muted)]">
                                Il test comprendeva <span className="font-semibold">{risultato.numeroDomande}</span> domande.
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                                <li>✅ Corrette: <span className="font-semibold text-emerald-600">{risultato.numeroCorrette}</span></li>
                                <li>❌ Errate: <span className="font-semibold text-red-600">{risultato.numeroErrate}</span></li>
                                <li>⏭ Non risposte: <span className="font-semibold text-[var(--foreground)]">{risultato.numeroNonRisposte}</span></li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
                            <h3 className="text-sm font-semibold">Informazioni sul tentativo</h3>
                            {typeof risultato.durataUsataMinuti === "number" && (
                                <p className="text-sm text-[var(--muted)]">
                                    Durata effettiva: <span className="font-medium">{risultato.durataUsataMinuti} minuti</span>
                                </p>
                            )}
                            {typeof risultato.punteggioMin === "number" && (
                                <p className="text-sm text-[var(--muted)]">
                                    Punteggio minimo per superare: <span className="font-medium">{risultato.punteggioMin}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                        <Button
                            variant="primary"
                            onClick={() => router.push("/candidati/test")}
                        >
                            Torna alla lista test
                        </Button>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/candidati/test/${idTest}/introduzione`)}
                            >
                                Rivedi informazioni sul test
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => router.push(`/candidati/test/${idTest}/tentativo`)}
                            >
                                Ripeti il test (se consentito)
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
