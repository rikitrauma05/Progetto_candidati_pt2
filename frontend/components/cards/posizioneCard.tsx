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
        <article
            className="
                group
                rounded-2xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)]
                bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]
                px-4 py-3 md:px-5 md:py-4
                shadow-sm
                flex items-center justify-between gap-4
                hover:border-[var(--accent)]
                hover:bg-[color-mix(in_srgb,var(--surface)_95%,transparent)]
                hover:shadow-md
                hover:-translate-y-0.5
                transition-all duration-200
            "
        >
            {/* LEFT: info posizione */}
            <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] truncate">
                    {titolo}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    {sede && (
                        <span
                            className="
                                inline-flex items-center gap-1 rounded-full
                                bg-white/5 px-2.5 py-1
                                text-[var(--muted)]
                                border border-white/5
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            <span className="truncate">{sede}</span>
                        </span>
                    )}

                    {contratto && (
                        <span
                            className="
                                inline-flex items-center gap-1 rounded-full
                                bg-white/5 px-2.5 py-1
                                text-[var(--muted)]
                                border border-white/5
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            <span className="truncate">{contratto}</span>
                        </span>
                    )}

                    {typeof candidature === "number" && (
                        <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                            <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                            {candidature} candidature
                        </span>
                    )}

                    {typeof punteggio === "number" && (
                        <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                            <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                            Punteggio: <span className="font-medium">{punteggio}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* RIGHT: azione */}
            {rightSlot && (
                <div className="shrink-0">
                    <div className="inline-flex items-center gap-1">
                        {rightSlot}
                    </div>
                </div>
            )}
        </article>
    );
}
