import * as React from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LinkProps
  extends React.ComponentProps<typeof NextLink>,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  LinkProps
>(({ className, variant, ...props }, ref) => {
  return (
    <NextLink
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
})
Link.displayName = "Link"

export { Link, linkVariants }

