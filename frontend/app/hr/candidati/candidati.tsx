"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import CandidatoCard from "@/components/cards/candidatoCard";
import * as userService from "@/services/user.service";

export default function CandidatiHR() {
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [candidati, setCandidati] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                const data = await userService.getCandidati();
                setCandidati(data ?? []);
            } catch (e) {
                console.error(e);
                setErrore("Impossibile caricare i candidati.");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Candidati"
                subtitle="Elenco dei candidati registrati e relative informazioni"
                actions={[{ label: "Torna alla dashboard", href: "/hr/dashboard" }]}
            />

            {loading && (
                <p className="text-sm text-[var(--muted)]">Caricamento…</p>
            )}

            {errore && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errore}
                </div>
            )}

            {!loading && !errore && candidati.length === 0 && (
                <EmptyState
                    title="Nessun candidato"
                    subtitle="I candidati appariranno qui quando invieranno candidature."
                    actionSlot={
                        <Button asChild>
                            <Link href="/hr/posizioni">Vai alle posizioni</Link>
                        </Button>
                    }
                />
            )}

            {!loading && !errore && candidati.length > 0 && (
                <div className="grid gap-4">
                    {candidati.map((c) => (
                        <CandidatoCard
                            key={c.idUtente}
                            id={c.idUtente}
                            nome={`${c.nome} ${c.cognome}`}
                            email={c.email}
                            posizione={c.ultimaPosizione}
                            punteggio={c.punteggioTotale}
                            clickable
                            href={`/hr/candidati/${c.idUtente}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
