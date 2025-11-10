"use client";

import React from "react";

export type CandidatoCardProps = {
    id: string | number;
    nome: string;
    email: string;
    posizione?: string;           // titolo posizione opzionale (lato HR)
    punteggio?: number;           // opzionale (test/valutazioni)
    rightSlot?: React.ReactNode;  // azioni contestuali (link, pulsanti)
};

export default function CandidatoCard({
                                          nome,
                                          email,
                                          posizione,
                                          punteggio,
                                          rightSlot,
                                      }: CandidatoCardProps) {
    return (
        <article className="rounded-2xl border bg-[var(--surface)] p-4 shadow-sm flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{nome}</h3>
                <p className="text-sm text-[var(--muted)]">{email}</p>
                {posizione && <p className="text-sm">Posizione: <span className="font-medium">{posizione}</span></p>}
                {typeof punteggio === "number" && (
                    <p className="text-sm">Punteggio: <span className="font-medium">{punteggio}</span></p>
                )}
            </div>
            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </article>
    );
}
