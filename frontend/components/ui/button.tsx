"use client";

import React, { isValidElement, cloneElement } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
    variant?: Variant;
    size?: Size;
    asChild?: boolean;            // rende “polimorfico” il bottone (applica le classi al child)
    className?: string;
    children?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export default function Button({
                                   className,
                                   variant = "primary",
                                   size = "md",
                                   disabled,
                                   asChild = false,
                                   children,
                                   ...props
                               }: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60 disabled:pointer-events-none";
    const variants: Record<Variant, string> = {
        primary: "bg-accent text-white hover:opacity-90",
        secondary: "bg-surface text-foreground border border-border hover:bg-accent/10",
        outline: "border border-border bg-transparent hover:bg-accent/10",
        ghost: "bg-transparent hover:bg-accent/10",
        danger: "bg-red-600 text-white hover:opacity-90 focus:ring-red-500 border border-red-700/30",
        success: "bg-green-600 text-white hover:opacity-90 focus:ring-green-500 border border-green-700/30",
    };
    const sizes: Record<Size, string> = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-3",
        icon: "h-10 w-10 p-0",
    };

    const classes = cx(base, variants[variant], sizes[size], className);

    // Applica le classi al child (es. <a> o <Link>)
    if (asChild && isValidElement(children)) {
        const child = children as React.ReactElement<any>;
        return cloneElement(child, {
            ...child.props,
            className: cx(child.props?.className, classes),
            "aria-disabled": disabled || undefined,
        } as any);
    }

    // Fallback: normale <button>
    return (
        <button className={classes} disabled={disabled} {...props}>
            {children}
        </button>
    );
}
