# ABSECO AI Smart Living Showroom — Refactor Summary

## 1. Updated folder structure

```
/app
  layout.tsx              ← Uses ShowroomNav, ShowroomBottomNav, SmartPlanProvider
  page.tsx                ← Showroom landing (replaces dashboard)
  globals.css
  manifest.ts
  experience/
    page.tsx              ← NEW: Camera / “Experience in My Room”
  orders/
    page.tsx              ← NEW: Order timeline
    plan/
      page.tsx            ← NEW: Smart Home Plan (cart)
  collection/
    [slug]/
      page.tsx            ← NEW: Collection detail (e.g. living-room, bedroom)
  profile/
    page.tsx              ← Simplified: My Orders, Plan, AI Designer, Warranty, Support
  ai-designer/            ← KEPT (linked from Profile)
  proposal/               ← KEPT (internal/legacy)
  admin/                  ← KEPT (internal, no customer nav link)
  admin/partners/
  partner/                ← KEPT (internal)
  partner/join/
  partner/demo/
  dashboard/              ← KEPT (redirects to /)
  explore/                ← KEPT (no nav link; URL still works)
  r/[partner]/            ← KEPT (referral redirect + cookies)
  api/                    ← Unchanged (leads, auth, partner, whatsapp, admin)

/components
  ShowroomNav.tsx         ← NEW: Minimal top bar (brand only)
  ShowroomBottomNav.tsx   ← NEW: 4 tabs (Showroom, Experience, Orders, Profile)
  showroom/
    ShowroomHero.tsx      ← NEW
    CollectionCard.tsx    ← NEW
    ProductExperienceCard.tsx  ← NEW
    ConsultationForm.tsx  ← NEW
    SuggestionCard.tsx    ← NEW
    SmartPlanCart.tsx     ← NEW
    OrderTimeline.tsx     ← NEW
    CameraExperiencePanel.tsx ← NEW
  (Navbar, BottomNavigation, HeroBanner, etc. remain in codebase but are not used in layout)

/features
  showroom/
    data.ts               ← NEW: collections, featuredProducts, collectionExperiences, suggestionPhrases
  dashboard/              ← KEPT (data still used by partner/demo, etc.)
  ai-designer/            ← KEPT

/lib
  context/
    SmartPlanContext.tsx  ← NEW: Plan cart state + localStorage
  db/, models/, services/, utils/  ← Unchanged
```

---

## 2. New pages created

| Route | Purpose |
|-------|--------|
| `/` | **Showroom landing**: Hero, Smart Living Collections, Featured Smart Products, suggestion tips, “Experience in My Room” CTA, “Plan Your Smart Home” consultation form |
| `/experience` | **Camera experience**: Request camera, overlay smart devices (switch, light, camera, speaker), ON/OFF simulation |
| `/orders` | **Order tracking**: Vertical timeline (Consultation scheduled → Design → Installation → Completed → Warranty) + link to Smart Home Plan |
| `/orders/plan` | **Smart Home Plan**: List of items added from showroom/collections, estimated range, Request Quotation / Book Site Visit / Pay Booking Amount |
| `/collection/[slug]` | **Collection detail**: e.g. `/collection/living-room`, `/collection/bedroom`. Large hero, automation setup cards (Experience + Add to Smart Plan), suggestion card |

---

## 3. Removed / no longer used in customer flow

- **Not removed from codebase**, but **no longer in main customer navigation or layout**:
  - `Navbar.tsx` (hamburger + search + profile) — replaced by `ShowroomNav` (brand only).
  - `BottomNavigation.tsx` (5 tabs: Home, Explore, AI Designer, Saved, Profile) — replaced by `ShowroomBottomNav` (4 tabs: Showroom, Experience, Orders, Profile).
  - `HeroBanner.tsx`, dashboard-style hero — replaced by `ShowroomHero`.
  - Old dashboard sections on `/` (search bar, “Explore Home Types”, old package cards, old scenes, old “Real Installations”, partner CTA block) — replaced by showroom sections above.

- **Still exist and are reachable by URL** (internal / power users):
  - `/explore` — old explore page.
  - `/dashboard` — redirects to `/`.
  - `/ai-designer` — linked from Profile (“Design with AI”).
  - `/proposal` — legacy proposal page.
  - `/admin`, `/admin/partners`, `/partner`, `/partner/join`, `/partner/demo`, `/sales` — no links in showroom UI; internal only.

- **Unused by new showroom** (can be deleted later if desired):
  - `HomeTypeCard`, `PackageCard`, `SceneCard` in current form (replaced by `CollectionCard`, `ProductExperienceCard` and collection experiences).
  - `PartnerStatsCard` still used on `/partner` page.

---

## 4. New showroom UX flow

1. **Landing (`/`)**  
   User sees a cinematic hero (“Welcome to ABSECO Smart Living”, “Experience AI Powered Luxury Homes”) and “Enter Showroom”.  
   Below: **Smart Living Collections** (horizontal scroll) → **Featured Smart Products** (grid with Experience + Add to Plan) → **AI suggestion cards** → **“Experience in My Room”** (camera CTA) → **“Plan Your Smart Home”** (Name, Phone, City, Book Free Consultation).

2. **Collections (`/collection/[slug]`)**  
   User taps a collection (e.g. Luxury Living Room, Smart Bedroom).  
   Page shows a large visual and automation setup cards; each card has **Experience** (→ `/experience`) and **Add to Smart Plan** (adds to plan, persisted in context + localStorage).

3. **Experience (`/experience`)**  
   “Experience in My Room”: camera permission, then live preview (or static fallback) with overlaid devices (switch, light strip, camera, speaker). User toggles ON/OFF for a simple “try it in your space” feel.

4. **Orders (`/orders`)**  
   Simple order timeline (Consultation scheduled → Design in progress → Installation scheduled → Completed → Warranty active) and a link to “View Smart Home Plan”.

5. **Smart Home Plan (`/orders/plan`)**  
   Cart of items added from showroom/collections. Shows estimated cost range and actions: **Request Quotation**, **Book Site Visit**, **Pay Booking Amount**. If empty, prompts to “Explore Showroom”.

6. **Profile (`/profile`)**  
   Short list: My Orders, My Smart Home Plan, Design with AI (→ `/ai-designer`), Warranty, Support. No dashboards or analytics.

7. **Internal / power users**  
   AI Designer, admin, partner, and sales routes are unchanged and reachable by URL or from Profile (AI Designer only). No admin/partner/sales in the 4-tab nav.

**Design**: Same stack (Next.js 14, React, Tailwind, Framer Motion). Same primary colour (#FF6A00), dark gradient background, glass cards, soft glow, Inter/Sora. Mobile-first, minimal copy, visual and emotional rather than technical.

**Backend**: Lead capture (e.g. consultation form → `/api/leads`), MongoDB models, referral attribution (`/r/[partner]`), partner/API routes and AI Designer logic are unchanged; only the customer-facing front-end was refactored into a simple, premium showroom flow.
