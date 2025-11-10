"use client";

import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import Link from "next/link";

/** Tipo locale per il profilo candidato */
type Candidato = {
    nome: string;
    cognome: string;
    email: string;
    citta?: string | null;
    telefono?: string | null;
    dataNascita?: string | null; // ISO string
};

/** Componente di dettaglio isolato: elimina qualsiasi ambiguità di narrowing */
function DettaglioProfilo({ c }: { c: Candidato }) {
    return (
        <div className="rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-6 space-y-4">
            <h3 className="text-lg font-semibold">
                {c.nome} {c.cognome}
            </h3>
            <p className="text-sm text-[var(--muted)]">{c.email}</p>
            <div className="text-sm mt-2">
                <p>Città: {c.citta ?? "—"}</p>
                <p>Telefono: {c.telefono ?? "—"}</p>
                <p>Data di nascita: {c.dataNascita ?? "—"}</p>
            </div>
        </div>
    );
}

export default function ProfiloCandidato() {
    // Tipizzato in modo esplicito: niente 'any' né 'never'
    const candidato: Candidato | null = null;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profilo candidato"
                subtitle="Visualizza e aggiorna le tue informazioni personali"
                actions={[{ label: "Torna alle posizioni", href: "/candidati/posizioni" }]}
            />

            {/* Se assente, stato vuoto */}
            {candidato === null ? (
                <EmptyState
                    title="Profilo non disponibile"
                    subtitle="Effettua il login per visualizzare e modificare le tue informazioni personali."
                    actionSlot={
                        <Button asChild>
                            <Link href="/auth/login">Accedi</Link>
                        </Button>
                    }
                />
            ) : (
                // Forziamo il tipo via props: qui TS è certo che 'c' è Candidato
                <DettaglioProfilo c={candidato} />
            )}
        </div>
    );
}
