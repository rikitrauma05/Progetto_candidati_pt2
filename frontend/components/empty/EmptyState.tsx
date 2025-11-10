"use client";

export default function EmptyState({
                                       title = "Nessun dato",
                                       subtitle = "Non ci sono elementi da mostrare.",
                                       actionSlot,
                                       className = "",
                                   }: {
    title?: string;
    subtitle?: string;
    actionSlot?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`w-full border rounded-2xl p-8 text-center
                  bg-[var(--surface)] border-[var(--border)] ${className}`}
        >
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-[var(--muted)] mb-4">{subtitle}</p>
            {actionSlot}
        </div>
    );
}
