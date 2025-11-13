"use client";

import React from "react";

export type PosizioneCardProps = {
    id: string | number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidature?: number;
    punteggio?: number;
    rightSlot?: React.ReactNode;
};

export default function PosizioneCard({
                                          titolo,
                                          sede,
                                          contratto,
                                          candidature,
                                          punteggio,
                                          rightSlot,
                                      }: PosizioneCardProps) {
    return (
        <article className="rounded-2xl border bg-[var(--surface)] p-4 shadow-sm hover:shadow-md transition">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{titolo}</h3>
                    <p className="text-sm text-[var(--muted)]">
                        {sede ?? "Sede non indicata"}
                        {contratto ? ` • ${contratto}` : ""}
                    </p>
                </div>
                {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
            </header>

            {typeof punteggio === "number" && (
                <p className="mt-3 text-sm">
                    Punteggio: <span className="font-medium">{punteggio}</span>
                </p>
            )}

            {typeof candidature === "number" && (
                <p className="mt-1 text-sm text-[var(--muted)]">
                    Candidature ricevute: <span className="font-medium">{candidature}</span>
                </p>
            )}
        </article>
    );
}
