"use client";

import Button from "@/components/ui/button";

export default function CandidatoCard({
                                          nome,
                                          email,
                                          posizione,
                                          punteggio,
                                          rightSlot,
                                          className = "",
                                      }: {
    nome: string;
    email: string;
    posizione?: string | null;
    punteggio?: number | string | null;
    rightSlot?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`w-full rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-4 ${className}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{nome}</h3>
                    <p className="text-sm text-[var(--muted)]">{email}</p>

                    {posizione && (
                        <p className="text-sm mt-1">
                            Posizione: <span className="font-medium">{posizione}</span>
                        </p>
                    )}

                    {punteggio !== undefined && punteggio !== null && (
                        <p className="text-sm mt-1">
                            Punteggio: <span className="font-medium">{punteggio}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">{rightSlot}</div>
            </div>
        </div>
    );
}
