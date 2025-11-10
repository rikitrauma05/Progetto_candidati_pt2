"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";

type TentativoInfo = {
    idTest: number;
    titolo: string;
    durataMinuti: number;
    numeroDomande: number;
};

export default function TentativoTest() {
    const [info] = useState<TentativoInfo | null>(null);

    if (!info) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Tentativo di test"
                    subtitle="Rispondi alle domande entro il tempo previsto"
                    actions={[{ label: "Torna alle candidature", href: "/candidati/candidature" }]}
                />
                <EmptyState
                    title="Tentativo non disponibile"
                    subtitle="Non è stato possibile avviare il test. Riprova più tardi."
                    actionSlot={
                        <Button asChild>
                            <Link href="/candidati/posizioni">Vedi posizioni</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tentativo di test"
                subtitle="Rispondi alle domande entro il tempo previsto"
                actions={[{ label: "Torna alle candidature", href: "/candidati/candidature" }]}
            />

            <div className="rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-6 space-y-4">
                <h3 className="text-lg font-semibold">{info.titolo}</h3>
                <div className="text-sm text-[var(--muted)]">
                    <p>Durata: {info.durataMinuti} minuti</p>
                    <p>Numero di domande: {info.numeroDomande}</p>
                </div>

                <div className="mt-4 rounded-xl border border-[var(--border)] p-4">
                    <p className="text-sm">Il contenuto delle domande sarà mostrato qui quando collegheremo le API.</p>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button disabled>Consegna</Button>
                    <Button asChild>
                        <Link href={`/test/${info.idTest}/risultati`}>Vai ai risultati</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
