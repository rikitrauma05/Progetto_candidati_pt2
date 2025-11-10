"use client";

import Link from "next/link";
import Button from "@/components/ui/button";

type KPI = { label: string; value: string | number };
type Action = { label: string; href: string };

export default function PageHeader({
                                       title,
                                       subtitle,
                                       kpis = [],
                                       actions = [],
                                       className = "",
                                   }: {
    title: string;
    subtitle?: string;
    kpis?: KPI[];
    actions?: Action[];
    className?: string;
}) {
    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-[var(--muted)] mt-1">{subtitle}</p>
                    )}
                </div>
                {actions?.length ? (
                    <div className="flex gap-2">
                        {actions.map((a) => (
                            <Button key={a.href} asChild>
                                <Link href={a.href}>{a.label}</Link>
                            </Button>
                        ))}
                    </div>
                ) : null}
            </div>

            {kpis?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {kpis.map((k) => (
                        <div
                            key={k.label}
                            className="rounded-xl border p-4 bg-[var(--surface)] border-[var(--border)]"
                        >
                            <div className="text-xs text-[var(--muted)]">{k.label}</div>
                            <div className="text-lg font-semibold">{k.value}</div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
