"use client";

import Link from "next/link";
import { Posizione } from "@/types/posizione";

export default function PosizioneCard({ posizione }: { posizione: Posizione }) {
    return (
        <div className="rounded-2xl p-5 bg-surface border border-border shadow-card flex flex-col">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold">{posizione.titolo}</h3>
                    <p className="text-sm text-muted">
                        {posizione.sede} • {posizione.contratto} • {posizione.settore}
                    </p>
                </div>

                <span
                    className={`text-xs px-2 py-1 rounded ${
                        posizione.stato === "APERTA"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                    title={`Aggiornata il ${posizione.aggiornataIl}`}
                >
          {posizione.stato}
        </span>
            </div>

            <div className="mt-5 flex justify-between items-center">
        <span className="text-xs text-muted">
          Ultimo aggiornamento: {posizione.aggiornataIl}
        </span>

                <Link href={`/candidati/posizioni/${posizione.id}`} className="btn">
                    Dettagli
                </Link>
            </div>
        </div>
    );
}
