# ABSECO Luxury Premium UI Upgrade — Summary

## 1. Updated component structure

**Global**
- `app/globals.css` — Luxury variables, deep gradient background, `.luxury-card`, `.section-title`, `.hero-title`, `.scrollbar-hide`
- `tailwind.config.ts` — `luxury-gradient`, `shadow-card-lift`, `shadow-orange-hover`, `shadow-inner-glow`, `font-display` (Sora), keyframes for fade/glow

**Showroom components**
- `ShowroomHero.tsx` — Full-viewport hero, new copy, dual CTAs, glow hover
- `CollectionCard.tsx` — Catalogue-style cards, hover zoom + lift, gradient overlay
- `ProductExperienceCard.tsx` — Premium product layout, large visual, single Experience CTA
- `CameraExperiencePanel.tsx` — Glowing device overlays, smooth ON/OFF with Framer Motion
- `SmartPlanCart.tsx` — “My Smart Home Plan” panel, elegant item cards, Reserve Installation Slot
- `OrderTimeline.tsx` — “Your Journey”, glowing step indicators, checkmarks for done
- `ConsultationForm.tsx` — Minimal inputs, rounded-full primary CTA
- `SuggestionCard.tsx` — Subtle border, light copy

**Chrome**
- `ShowroomNav.tsx` — Minimal sticky bar, letter-spaced brand
- `ShowroomBottomNav.tsx` — Four tabs, active pill indicator (layoutId), uppercase labels

**Pages**
- `app/page.tsx` — Section titles as `.section-title`, scroll-triggered motion, lifestyle copy
- `app/collection/[slug]/page.tsx` — Luxury collection hero + setup cards
- `app/experience/page.tsx` — Refined heading and supporting text
- `app/orders/page.tsx` — “Your Journey” timeline + View Plan CTA
- `app/orders/plan/page.tsx` — Plan heading + SmartPlanCart
- `app/profile/page.tsx` — Card list with hover states

---

## 2. Visual improvements

| Area | Change |
|------|--------|
| **Hero** | Full viewport (min-h-[100vh]), headline “Experience Intelligent Luxury Living”, subtext “ABSECO Smart Homes Powered by AI”, CTAs “Explore Smart Living” + “Experience In My Room”, radial orange glow overlay, slow fade-in (1s), button glow on hover |
| **Collections** | Full-image cards, gradient overlay (accent colour), title at bottom, hover scale 1.02 + image zoom 1.10, card lift shadow, scroll fade-in |
| **Products** | Aspect 4/5, large product visual, gradient mask, “Experience” primary button + “Add to Plan” secondary, hover lift, rounded-2xl |
| **Camera experience** | Rounded-3xl container, device overlays with glow when ON (boxShadow + border), smooth ON/OFF state transition, refined copy “See your space come to life” |
| **Smart Plan** | Title “My Smart Home Plan”, item rows with description + category, estimated range in orange-tinted panel with inner glow, CTAs: Request Quotation, Book Site Visit, Reserve Installation Slot (rounded-full) |
| **Order timeline** | Title “Your Journey”, steps: Consultation Booked → Design Planning → Installation Scheduled → Completed → Warranty Active, circular step markers with glow when done, checkmark animation |
| **Consultation** | Rounded inputs, focus ring orange, full-width rounded-full submit with hover scale |
| **Suggestions** | Light border, no “Tip:” label, font-light body copy |
| **Nav** | Sticky top bar with blur, letter-spaced brand; bottom nav with active pill (animated layoutId), uppercase tab labels |
| **Typography** | Sora for headings (`font-display`), Inter for body, section titles uppercase + tracking, hero very large (text-4xl–6xl), body minimal and light |
| **Colour** | Primary #FF6A00, background #020617 → #0f172a, borders white/[0.06]–[0.1], accent glow blue/orange |
| **Motion** | Framer Motion: hero stagger, scroll-triggered section fade, card hover lift/scale, button hover/tap scale, nav pill transition, timeline step animation |

---

## 3. Performance and mobile

- **Mobile-first** — Touch targets (py-3–4, full-width buttons), bottom nav stays 4-tab.
- **Images** — Next/Image with sizes; hero and collections use priority or lazy load where appropriate.
- **Motion** — `whileInView` with `viewport={{ once: true }}` to avoid repeated work; short durations (0.25–0.5s).
- **Scroll** — `scrollbar-hide` on horizontal collection strip; `scroll-behavior: smooth` on html.
- **No new heavy deps** — Only existing Framer Motion and Tailwind.

Build passes; experience remains fast and mobile-optimised.
