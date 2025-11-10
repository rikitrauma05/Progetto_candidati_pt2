"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import CandidatoCard from "@/components/cards/candidatoCard";

export default function CandidatiHR() {
    // nessun dato reale finché non colleghiamo le API
    const candidati: any[] = [];

    return (
        <div className="space-y-6">
            {/* intestazione */}
            <PageHeader
                title="Candidati"
                subtitle="Elenco dei candidati e stato delle candidature"
                actions={[{ label: "Torna alla dashboard", href: "/hr/dashboard" }]}
            />

            {/* se non ci sono candidati */}
            {candidati.length === 0 && (
                <EmptyState
                    title="Nessun candidato registrato"
                    subtitle="I candidati appariranno automaticamente quando verranno inviate candidature."
                    actionSlot={
                        <Button asChild>
                            <Link href="/hr/posizioni">Vai alle posizioni</Link>
                        </Button>
                    }
                />
            )}

            {/* elenco (placeholder grafico) */}
            {candidati.length > 0 && (
                <div className="grid gap-3">
                    {candidati.map((c) => (
                        <CandidatoCard
                            key={c.idCandidato}
                            nome={`${c.nome} ${c.cognome}`}
                            email={c.email}
                            posizione={c.posizione}
                            punteggio={c.punteggioTotale}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/hr/candidati/${c.idCandidato}`}>Dettaglio</Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
