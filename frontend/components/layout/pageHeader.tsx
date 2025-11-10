"use client";

export type KPI = { label: string; value: string | number };
export type Action = { label: string; href?: string; onClick?: () => void; variant?: "primary" | "dark" | "success" };

export default function PageHeader({
                                       title,
                                       subtitle,
                                       kpis = [],
                                       actions = [],
                                   }: {
    title: string;
    subtitle?: string;
    kpis?: KPI[];
    actions?: Action[];
}) {
    return (
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
                {subtitle && <p className="text-sm text-[var(--muted)]">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
                {kpis.length > 0 && (
                    <div className="hidden md:flex items-center gap-4">
                        {kpis.map((k) => (
                            <div key={k.label} className="rounded-xl border bg-[var(--surface)] px-4 py-2 shadow-sm">
                                <div className="text-xs text-[var(--muted)]">{k.label}</div>
                                <div className="text-base font-semibold">{k.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {actions.map((a) =>
                    a.href ? (
                        <a
                            key={a.label}
                            href={a.href}
                            className={`rounded-xl px-4 py-2 text-sm font-medium border shadow-sm ${
                                a.variant === "dark"
                                    ? "bg-black text-white"
                                    : a.variant === "success"
                                        ? "bg-green-600 text-white"
                                        : "bg-[var(--accent)] text-white"
                            }`}
                        >
                            {a.label}
                        </a>
                    ) : (
                        <button
                            key={a.label}
                            type="button"
                            onClick={a.onClick}
                            className={`rounded-xl px-4 py-2 text-sm font-medium border shadow-sm ${
                                a.variant === "dark"
                                    ? "bg-black text-white"
                                    : a.variant === "success"
                                        ? "bg-green-600 text-white"
                                        : "bg-[var(--accent)] text-white"
                            }`}
                        >
                            {a.label}
                        </button>
                    )
                )}
            </div>
        </section>
    );
}
