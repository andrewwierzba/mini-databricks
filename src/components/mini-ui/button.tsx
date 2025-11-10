import * as React from "react";

import { Button as BaseButton, buttonVariants } from "@/components/ui/button";

import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import "@/app/styles/styles.css"

type ButtonVariant = "default" | "destructive" | "ghost" | "link" | "outline" | "secondary"

const buttonVariantStyles: Record<ButtonVariant, string> = {
    default: "bg-[var(--blue-600)] text-[var(--white-800)] hover:bg-[var(--blue-700)] active:bg-[var(--blue-800)]",
    destructive: "bg-[var(--red-600)] text-[var(--white-800)] hover:bg-[var(--red-700)] active:bg-[var(--red-800)]",
    ghost: "bg-transparent text-[var(--blue-600)] hover:bg-[var(--blue-600)]/8 hover:text-[var(--blue-700)] active:bg-[var(--blue-600)]/16 active:text-[var(--blue-800)]",
    link: "bg-transparent text-[var(--blue-600)] hover:bg-transparent active:bg-transparent",
    outline: "bg-transparent border border-[var(--gray-300)] text-[var(--black-800)] hover:bg-[var(--blue-600)]/8 hover:border-[var(--blue-600)] hover:text-[var(--blue-700)] active:bg-[var(--blue-600)]/16 active:border-[var(--blue-800)] active:text-[var(--blue-800)]",
    secondary: "bg-[var(--black-400)] text-[var(--white-800)] hover:bg-[var(--black-500)] active:bg-[var(--black-600)]"
}

interface ButtonProps
    extends React.ComponentProps<typeof BaseButton>,
    Omit<VariantProps<typeof buttonVariants>, "variant"> {
    variant?: ButtonVariant
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variantClasses = buttonVariantStyles[variant] || buttonVariantStyles.default

        return (
            <BaseButton
                className={cn(variantClasses, className)}
                ref={ref}
                variant={undefined}
                {...props}
            >
                {children}
            </BaseButton>
        )
    }
)

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant }
