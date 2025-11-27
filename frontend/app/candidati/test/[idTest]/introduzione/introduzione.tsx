"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import { getStrutturaTest } from "@/services/test.service";

type StrutturaTestClient = {
    idTest: number;
    titolo: string;
    descrizione?: string | null;
    durataMinuti: number;
    numeroDomande: number;
    punteggioMax: number;
    punteggioMin?: number | null;
};

export default function IntroduzioneTestPage() {
    const params = useParams<{ idTest: string }>();
    const idTest = Number(params?.idTest ?? "0");
    const router = useRouter();

    const [test, setTest] = useState<StrutturaTestClient | null>(null);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        if (!idTest) return;

        async function load() {
            setLoading(true);
            setErrore(null);
            try {
                const data = await getStrutturaTest(idTest);
                setTest(data as StrutturaTestClient);
            } catch (e) {
                console.error(e);
                setErrore(
                    "Non è stato possibile caricare i dettagli del test.",
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [idTest]);

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
                        },
                    ]}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Introduzione al test"
                    subtitle="Caricamento dei dettagli del test in corso…"
                />
                <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <div className="h-4 w-32 rounded bg-[var(--surface-soft)] mb-4" />
                    <div className="h-3 w-full rounded bg-[var(--surface-soft)] mb-2" />
                    <div className="h-3 w-5/6 rounded bg-[var(--surface-soft)] mb-2" />
                    <div className="h-3 w-4/6 rounded bg-[var(--surface-soft)]" />
                </div>
            </div>
        );
    }

    if (errore || !test) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Errore nel caricamento del test"
                    subtitle={errore ?? "Si è verificato un errore imprevisto."}
                    actions={[
                        {
                            label: "Torna ai test",
                            href: "/candidati/test",
                        },
                    ]}
                />
                <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <p className="text-sm text-[var(--muted)]">
                        Riprova più tardi. Se il problema persiste, contatta il
                        supporto.
                    </p>
                </div>
            </div>
        );
    }

    function handleStartTest() {
        if (!idTest) return;
        const conferma = window.confirm(
            "Una volta iniziato il test il tempo inizierà a scorrere e non potrai metterlo in pausa. Vuoi davvero iniziare?",
        );
        if (!conferma) return;

        router.push(`/candidati/test/${idTest}/tentativo`);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Introduzione al test: ${test.titolo}`}
                subtitle={
                    test.descrizione ??
                    "Prima di iniziare, leggi con attenzione le informazioni qui sotto."
                }
                actions={[
                    {
                        label: "Torna ai test",
                        href: "/candidati/test",
                    },
                ]}
            />

            <section className="max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Panoramica del test</h2>
                    <p className="text-sm text-[var(--muted)]">
                        Questo test fa parte del processo di selezione. Le
                        domande servono a valutare le tue competenze in modo
                        oggettivo e uniforme per tutti i candidati.
                    </p>
                </div>

                <div className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
                    <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                        <p className="text-[0.7rem] uppercase tracking-wide">
                            Durata massima
                        </p>
                        <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                            {test.durataMinuti} minuti
                        </p>
                    </div>

                    <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                        <p className="text-[0.7rem] uppercase tracking-wide">
                            Numero di domande
                        </p>
                        <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                            {test.numeroDomande}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                        <p className="text-[0.7rem] uppercase tracking-wide">
                            Punteggio massimo
                        </p>
                        <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                            {test.punteggioMax} punti
                        </p>
                    </div>

                    {typeof test.punteggioMin === "number" && (
                        <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                            <p className="text-[0.7rem] uppercase tracking-wide">
                                Punteggio minimo per superare
                            </p>
                            <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                                {test.punteggioMin} punti
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Regole e suggerimenti</h3>
                    <ul className="list-disc list-inside text-sm text-[var(--muted)] space-y-1">
                        <li>
                            Una volta avviato il test, il tempo inizierà a
                            scorrere e non potrà essere messo in pausa.
                        </li>
                        <li>
                            Rispondi a tutte le domande nel limite di tempo
                            indicato. Se non sei sicuro di una risposta, prova
                            comunque a selezionare l&apos;opzione che ritieni
                            più corretta.
                        </li>
                        <li>
                            Assicurati di avere una connessione stabile prima di
                            iniziare e evita di chiudere la pagina durante lo
                            svolgimento.
                        </li>
                    </ul>
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="primary" onClick={handleStartTest}>
                        Inizia il test
                    </Button>
                </div>
            </section>
        </div>
    );
}
