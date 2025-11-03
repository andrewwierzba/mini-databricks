# Color System — Design & Aesthetic Guidelines

## Philosophy

This color system is built on principles of clarity, accessibility, and refined elegance. The palette balances a natural, contemporary aesthetic with careful attention to contrast and usability. It's designed for interfaces that feel both professional and approachable.

## Design Principles

### Perceptual Uniformity
Colors are defined in OKLCH color space, ensuring that perceived brightness and saturation differences are consistent across the palette. This creates a cohesive, balanced visual hierarchy.

### Accessibility First
Every color pairing respects WCAG contrast standards. The system explicitly maps contrast colors to ensure readable text and accessible interfaces without requiring designers to make manual calculations.

### Opacity as a First-Class Citizen
Black and white include eight opacity levels (5%, 10%, 20%, 40%, 50%, 60%, 80%, 100%). These aren't afterthoughts—they're intentional tools for creating depth, layering, and visual hierarchy.

## Color Narratives

### Black & White (Opacity Scales)
**Vibe**: Subtle control, layering, depth.

These act as tools rather than colors. They're used for overlays, dividers, and creating visual separation without introducing new hues. The progression creates natural rhythm:
- Light opacities (5-10%) are barely perceptible—use for sophisticated hover states
- Mid opacities (40-50%) create distinct separation while maintaining connection
- Dark opacities (80%+) create strong visual emphasis

**When to use**: Everywhere. These are the structural backbone of the interface.

### Blue
**Vibe**: Trust, action, clarity.

Blue is the primary action color. It communicates "do this" and guides user interaction. The palette ranges from pale sky (#f0f8ff) to deep navy (#04355d).

- **Light blues** (100-500): Information, secondary states, backgrounds
- **blue-600**: Primary button. The decisive color. Use sparingly for the main action
- **Dark blues** (700-800): Text, borders, strong emphasis

**When to use**:
- Primary actions and CTAs
- Link colors
- Information states
- Primary UI elements

### Green
**Vibe**: Growth, success, positive movement.

Green communicates completion and approval. It's energetic but stable—think healthy plants rather than neon.

- **Light greens** (100-500): Success backgrounds, positive feedback
- **Dark greens** (600-800): Success text, checked states, confirm buttons

**When to use**:
- Success messages and confirmations
- Completed tasks and checkmarks
- Positive state indicators

### Red
**Vibe**: Urgency, caution, clarity.

Red is reserved for meaningful moments—errors, destructive actions, critical alerts. It's not aggressive; it's honest about consequences.

- **Light reds** (100-400): Error backgrounds, warning containers
- **red-500+**: Error text, delete buttons, critical warnings

**When to use**:
- Error messages and validation failures
- Destructive actions (delete, remove)
- Critical alerts
- Important warnings

### Yellow
**Vibe**: Attention, warmth, caution without urgency.

Yellow sits between blue and red—it says "notice this" without the finality of red. It's warmer, less clinical.

- **Light yellows** (100-400): Warning backgrounds, attention-getting containers
- **Dark yellows** (600-800): Warning text, caution indicators

**When to use**:
- Warnings and cautions
- Important notices that don't require immediate action
- Highlighting important information
- In-progress or pending states

### Grey
**Vibe**: Neutrality, hierarchy, calm.

Grey is the backbone of readable interfaces. It's purposefully unsaturated—it gets out of the way and lets content breathe.

- **Light greys** (100-300): Backgrounds, borders, subtle separation
- **grey-400-600**: Secondary UI, icons, disabled states
- **Dark greys** (700-800): Primary text, headings

**When to use**:
- Text (primary and secondary)
- Borders and dividers
- Backgrounds and fields
- Icons and secondary UI
- Disabled or inactive states

## Semantic Pairings

These combinations reflect our design intent:

| Element | Color | Contrast | Vibe |
|---------|-------|----------|------|
| Primary Button | blue-600 | white-800 | Authoritative, clickable |
| Secondary Button | grey-300 | black-800 | Subtle but available |
| Success Feedback | green-600 | white-800 | Confident completion |
| Error Message | red-600 | white-800 | Clear, demanding attention |
| Warning Alert | yellow-600 | white-800 | Cautious but approachable |
| Neutral Border | grey-100 | — | Invisible structure |
| Secondary Icon | grey-600 | — | Supportive, not primary |
| Disabled State | grey-400 | grey-600 | Dimmed, unavailable |

## Opacity as Expression

Don't think of opacity as just "making things transparent." Think of it as creating depth:

- **5-10% black**: Barely there. Use for ultra-subtle hover states or depth on white backgrounds
- **20-40% black**: Noticeable but not heavy. Good for overlays and light emphasis
- **50%+ black**: Strong statement. For dramatic overlays, modal backgrounds, focus states

The same applies to white—light opacity creates soft highlights; heavy opacity creates solid color blocks.

## Mood Guidance

### For a calm, minimal interface
Rely heavily on light greys, light opacity blacks/whites, and blue as the only chromatic color.

### For a warm, approachable interface
Introduce yellow and green earlier in the hierarchy. Use slightly higher contrast and saturation.

### For a professional, high-contrast interface
Use dark greys with white backgrounds. Blue and red are prominent. Opacity is minimal.

### For a playful, modern interface
Use the full saturation of all colors. Lean into secondary colors. Opacity creates playful layering.

## Implementation Notes

- All colors are defined with hex, RGB (with alpha), and OKLCH values
- Guidelines include recommended contrast colors for accessibility
- Some colors include descriptions (e.g., "Background color for primary buttons") to clarify semantic meaning
- Colors are exported from `colors` object in `page.tsx` for direct import
- Use the checkerboard background on the color page to understand opacity levels

## Accessing Colors in Code

```typescript
import { colors } from '@/app/styles/colors/page';

// Get hex value
const primaryBlue = colors.blue['blue-600'].hex; // "#2272b4"

// Get contrast recommendation
const contrast = colors.blue['blue-600'].guidelines.contrast; // "white-800"

// Get description if available
const description = colors.blue['blue-600'].guidelines.description;
```

## Visual Preview

View the full interactive palette at `/styles/colors` to experience the colors in context, see opacity in action with the checkerboard background, and use copy-to-clipboard for quick access.
