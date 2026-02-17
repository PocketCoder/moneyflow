# Vantage Style Guide & Cheat Sheet

Keep this guide open when building new UI to ensure consistency across the Vantage platform.

## 📜 The Golden Rule

**Never use hardcoded colors** (e.g., `bg-green-900`, `text-gray-500`).  
Always use **Semantic Variables**. This ensures Dark Mode works automatically and the "Natural Wealth" theme remains consistent.

---

## 1. Structural Layers

- **Page Containers:** Always start with `bg-background min-h-screen text-foreground`.
- **Content Cards:** Use `bg-card border border-border text-card-foreground shadow-sm rounded-lg`.
  - _Why:_ This creates the "White card on Warm Stone" aesthetic.

## 2. Typography Hierarchy

- **Main Headings (H1-H3):** `font-archivo text-foreground`. (Archivo Black from Google Fonts).
- **Body Text:** `font-sans` (Inter from Google Fonts).
- **Subtitles / Metadata:** `text-sm text-muted-foreground` (Mid-Grey).
- **Positive Values (Growth):** `text-primary` (Deep Green).
- **Negative Values (Debt/Loss):** `text-destructive` (Muted Red).
- **Links:** `text-primary hover:underline underline-offset-4`.

## 3. Interactive Elements (Buttons & Inputs)

- **Primary Action:** `bg-primary text-primary-foreground hover:bg-primary/90`.
- **Secondary/Cancel:** `bg-secondary text-secondary-foreground hover:bg-secondary/80`.
- **Ghost/Icon Buttons:** `hover:bg-accent hover:text-accent-foreground`.
- **Inputs:** `bg-transparent border-input focus:ring-1 focus:ring-ring rounded-md`.

## 4. Charts & Data

When using Recharts or Tremor components, bind colors to these CSS variables:

- **Main Trend:** `var(--chart-1)` (Deep Green)
- **Secondary:** `var(--chart-2)` (Lighter Green)
- **Liabilities:** `var(--destructive)` (Red)
- **Grid Lines:** `stroke-border` (Subtle)

---

## ✂️ Copy-Paste Recipes

### Standard Card Component

```tsx
<div className="border-border bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
	<h3 className="text-lg leading-none font-semibold tracking-tight">Card Title</h3>
	<p className="text-muted-foreground mt-2 text-sm">Card description goes here.</p>
	<div className="mt-4">{/* Content */}</div>
</div>
```

### Primary Button (via Tailwind Variants)

```tsx
import {Button} from '@/components/ui/button';

<Button variant="default">Save Changes</Button>;
```

### Status Badge (Pill)

```tsx
import { Badge } from "@/components/ui/badge";

// Success / Growth
<Badge variant="default">+12%</Badge>

// Debt / Danger
<Badge variant="destructive">-5%</Badge>

// Neutral / Secondary
<Badge variant="secondary">Pending</Badge>
```

---

## 🛠 Tools Usage

### Using Tailwind Variants (`tv`)

For reusable components with multiple states, use `tailwind-variants`.

```ts
import {tv} from 'tailwind-variants';

const badge = tv({
	base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	variants: {
		variant: {
			default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
			secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
			destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
			outline: 'text-foreground'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});
```
