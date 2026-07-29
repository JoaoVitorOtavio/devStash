# Homepage

## Overview

Replace the current `/` route (which redirects straight to `/dashboard`) with a real marketing homepage, rebuilding the static mockup in `prototypes/homepage/` (`index.html`/`styles.css`/`script.js`) using the app's actual stack — Next.js Server Components, Tailwind CSS v4, and shadcn/ui — instead of plain HTML/CSS/JS.

## Requirements

- Remove the `redirect("/dashboard")` in `src/app/page.tsx`; render the homepage there instead. Authenticated users still land on `/dashboard` after sign-in — this only changes what a signed-out visitor sees at `/`.
- Recreate every section from the mockup, matching its content and layout: Navbar, Hero (headline + "chaos to order" visual), Features (6 cards), AI section, Pricing (Free vs. Pro, monthly/yearly toggle), closing CTA, Footer.
- Default to Server Components; extract only the pieces that need interactivity into Client Components:
  - `Navbar` — background opacity change on scroll
  - `ChaosVisual` — the floating-icon animation (`requestAnimationFrame`, wall bounce, mouse-repel)
  - `ScrollReveal` (or a shared hook/wrapper) — fade-in on scroll via `IntersectionObserver`
  - `PricingToggle` — monthly/yearly switch
- Use Tailwind CSS v4 utilities (existing `@theme` tokens in `src/app/globals.css`, no new config file) and shadcn/ui primitives (`Button`, `Card`, `Badge`, `Switch`, etc.) instead of the mockup's custom CSS classes.
- Item type accent colors must match the real seeded values in `prisma/seed.ts` (Snippet `#3b82f6`/`Code`, Prompt `#8b5cf6`/`Sparkles`, Command `#f97316`/`Terminal`, Note `#fde047`/`StickyNote`, File `#6b7280`/`File`, Image `#ec4899`/`Image`, URL `#10b981`/`Link`) — hardcode them on this page (it's public/unauthenticated, no DB fetch needed), reusing the existing `getIcon()` helper (`src/server/icons.ts`) for the icon components rather than duplicating a second palette. Only 3 of the 6 feature cards map to a real item type (Snippets, Prompts, Commands); the other 3 (Instant Search, Files & Docs, Collections) are concepts, not types — Files & Docs may reuse the File color, the other two get a sensible distinct accent.
- Wire every button/link to a real destination:
  - "Sign In" → `/sign-in`
  - "Get Started" / "Get Started Free" / "Upgrade to Pro" → `/register`
  - Navbar "Features" / "Pricing" → same-page anchors (`#features`, `#pricing`)
- Keep markup DRY: one reusable component each for feature cards and pricing cards (data-driven from an array), not copy-pasted JSX per card.
- Dark theme, consistent with the rest of the app's look.
- Fully responsive: chaos/arrow/dashboard-preview stack vertically on mobile (same breakpoint behavior as the mockup).
- No auth checks, server actions, or DB queries needed — the page is fully static/marketing.

## Out of Scope

- Real Stripe/billing wiring behind the Pricing buttons (deferred to the future billing feature per the roadmap).
- Working Blog/About/Privacy/Terms footer links — keep as placeholder links like the mockup.
