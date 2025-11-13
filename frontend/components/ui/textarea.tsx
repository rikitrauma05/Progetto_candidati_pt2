"use client";

export default function Textarea({
                                     label,
                                     name,
                                     value,
                                     onChangeAction,
                                     placeholder,
                                     minRows = 4,
                                     error,
                                     hint,
                                     required,
                                     disabled,
                                     className = "",
                                 }: {
    label?: string;
    name?: string;
    value?: string;
    onChangeAction?: (v: string) => void;
    placeholder?: string;
    minRows?: number;
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

            <textarea
                name={name}
                value={value ?? ""}
                onChange={(e) => onChangeAction?.(e.target.value)}
                placeholder={placeholder}
                rows={minRows}
                disabled={disabled}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-y
                   bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)]
                   focus:ring-2 focus:ring-[var(--accent)]"
            />

            {hint && !error && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
