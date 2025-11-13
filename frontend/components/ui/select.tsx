"use client";

type Option = { value: string | number; label: string; disabled?: boolean };

export default function Select({
                                   label,
                                   name,
                                   value,
                                   onChangeAction,
                                   options = [],
                                   placeholder = "Seleziona…",
                                   error,
                                   hint,
                                   required,
                                   disabled,
                                   className = "",
                               }: {
    label?: string;
    name?: string;
    value?: string | number;
    onChangeAction?: (v: string) => void;
    options?: Option[];
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block mb-1 text-sm font-medium">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}

            <select
                name={name}
                value={value ?? ""}
                onChange={(e) => onChangeAction?.(e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none
                   bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)]
                   focus:ring-2 focus:ring-[var(--accent)]"
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((o) => (
                    <option key={`${o.value}`} value={o.value} disabled={o.disabled}>
                        {o.label}
                    </option>
                ))}
            </select>

            {hint && !error && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
