## App Architecture
- Next.js using App Router
- Databricks Design System
- ReactFlow for Directed Acyclic Graph (DAG)

## Directories
- `/app/` - Next.js pages and layouts
- `/app/providers/` - Design system and theme providers

## File Format
- Tabs with a tab size of 4

## Import Conventions
- Alphabetical order within import groups
- Import external libraries first, then local imports, then CSS imports last

## Property Conventions
- Alphabetical order for properties

## Style Conventions
- Classes should be in **alphabetical order by their CSS property equivalents**
- Styles should be in alphabetical order

## Design System
- Use the Databricks Design System as the base for all components
- When a specific component does not exist within the Databricks Design System, fallback to using [ShadCN UI](https://ui.shadcn.com/) components
