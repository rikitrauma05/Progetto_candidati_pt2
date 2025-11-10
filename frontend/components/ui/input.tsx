"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
    error?: string;
};

export default function Input({ label, hint, error, className, ...props }: Props) {
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-sm font-medium">{label}</label>}
            <input
                {...props}
                className={[
                    "w-full rounded-xl border px-3 py-2 outline-none bg-background",
                    "focus:ring-2 focus:ring-accent",
                    error ? "border-red-400" : "border-border",
                    className || "",
                ].join(" ")}
            />
            {hint && !error && <p className="text-xs text-muted">{hint}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
