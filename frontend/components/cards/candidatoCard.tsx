"use client";

import React, { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export type CandidatoCardProps = {
    id: string | number;
    nome: string;
    email: string;
    posizione?: string;
    punteggio?: number;

    /** Azioni aggiuntive (pulsanti, link, ecc.) */
    rightSlot?: React.ReactNode;

    /** Se true, la card è cliccabile e porta a href */
    clickable?: boolean;
    href?: string;
};

export default function CandidatoCard({
                                          nome,
                                          email,
                                          posizione,
                                          punteggio,
                                          rightSlot,
                                          clickable = false,
                                          href,
                                      }: CandidatoCardProps) {
    const router = useRouter();

    const canNavigate = clickable && !!href;

    const handleActivate = () => {
        if (canNavigate) {
            router.push(href!);
        }
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
            className={`
        rounded-2xl border border-[var(--border)] bg-[var(--surface)]
        p-4 shadow-sm flex items-start justify-between gap-4
        transition-all duration-200
        ${
                canNavigate
                    ? "cursor-pointer hover:shadow-md hover:border-[var(--accent)]"
                    : ""
            }
      `}
        >
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {nome}
                </h3>
                <p className="text-sm text-[var(--muted)]">{email}</p>

                {posizione && (
                    <p className="text-sm">
                        Posizione: <span className="font-medium">{posizione}</span>
                    </p>
                )}

                {typeof punteggio === "number" && (
                    <p className="text-sm">
                        Punteggio: <span className="font-medium">{punteggio}</span>
                    </p>
                )}
            </div>

            {rightSlot && (
                <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()} // evita click card
                >
                    {rightSlot}
                </div>
            )}
        </article>
    );
}
