"use client";

import React, { KeyboardEvent } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export type PosizioneCardProps = {
    id: string | number;
    titolo: string;
    sede?: string;
    contratto?: string;
    candidature?: number;
    punteggio?: number;
    rightSlot?: React.ReactNode;
    isPreferita?: boolean;
    togglePreferitaAction?: () => void;
    clickable?: boolean;
    href?: string;
};

export default function PosizioneCard({
                                          titolo,
                                          sede,
                                          contratto,
                                          candidature,
                                          punteggio,
                                          rightSlot,
                                          isPreferita = false,
                                          togglePreferitaAction,
                                          clickable = false,
                                          href,
                                      }: PosizioneCardProps) {
    const router = useRouter();
    const canNavigate = clickable && !!href;

    const handleActivate = () => {
        if (canNavigate) router.push(href!);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!canNavigate) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleActivate();
        }
    };

    return (
        <article
            role={canNavigate ? "button" : undefined}
            tabIndex={canNavigate ? 0 : undefined}
            onClick={handleActivate}
            onKeyDown={handleKeyDown}
            className="
        relative
        group
        rounded-2xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)]
        bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]
        px-4 py-3 md:px-5 md:py-4
        shadow-sm
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
        hover:border-[var(--accent)]
        hover:bg-[color-mix(in_srgb,var(--surface)_95%,transparent)]
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all duration-200
        outline-none
        focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
      "
            style={canNavigate ? { cursor: "pointer" } : undefined}
        >
            {/* LEFT: info posizione */}
            <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)] truncate">
                        {titolo}
                    </h3>

                    {/* PRIMA RIGA: sede + contratto + punteggio */}
                    <div className="mt-1 flex items-center gap-2 text-xs md:text-sm">
                        {sede && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[var(--muted)] border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span className="truncate">{sede}</span>
              </span>
                        )}

                        {contratto && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[var(--muted)] border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="truncate">{contratto}</span>
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

                {/* SOLO CANDIDATURE IN BASSO */}
                {typeof candidature === "number" && (
                    <div className="mt-2 text-xs md:text-sm text-[var(--muted)] flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                        {candidature} candidature
                    </div>
                )}
            </div>

            {/* RIGHT: preferiti + azioni extra (bottoni centrati) */}
            {(togglePreferitaAction || rightSlot) && (
                <div
                    className="
            relative shrink-0
            w-full sm:w-auto
            flex flex-col items-center justify-center gap-2
          "
                    onClick={(e) => e.stopPropagation()}
                >
                    {togglePreferitaAction && (
                        <button
                            type="button"
                            onClick={() => togglePreferitaAction()}
                            aria-pressed={isPreferita}
                            aria-label={isPreferita ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                            className={`
                inline-flex h-9 w-9 items-center justify-center
                rounded-full border transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]
                ${isPreferita
                                ? "bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)]"
                                : "bg-transparent border-[color-mix(in_srgb,var(--border)_70%,transparent)] text-[var(--muted)] hover:bg-white/5"
                            }`
                            }
                        >
                            <Heart
                                size={20}
                                strokeWidth={2}
                                className={isPreferita ? "fill-current" : "fill-none"}
                            />
                        </button>
                    )}

                    {rightSlot && (
                        <div className="w-full flex flex-wrap items-center justify-center gap-2">
                            {rightSlot}
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
