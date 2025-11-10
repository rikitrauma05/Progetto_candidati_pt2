"use client";

import Button from "@/components/ui/button";

export default function PosizioneCard({
                                          titolo,
                                          sede,
                                          contratto,
                                          candidature,
                                          rightSlot,
                                          onOpen,
                                          className = "",
                                      }: {
    titolo: string;
    sede?: string | null;
    contratto?: string | null;
    candidature?: number | null;
    rightSlot?: React.ReactNode;
    onOpen?: () => void;
    className?: string;
}) {
    return (
        <div
            className={`w-full rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-4 ${className}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{titolo}</h3>
                    <div className="mt-1 text-sm text-[var(--muted)]">
                        {sede ? `Sede: ${sede}` : "Sede: n/d"} · {contratto ?? "Contratto: n/d"}
                    </div>
                    {typeof candidature === "number" && (
                        <div className="mt-1 text-sm">Candidature: {candidature}</div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {rightSlot}
                    {onOpen && <Button onClick={onOpen}>Apri</Button>}
                </div>
            </div>
        </div>
    );
}
