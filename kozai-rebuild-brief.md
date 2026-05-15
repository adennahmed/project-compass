# KOZAI.CA — Ground-Up Rebuild Brief

## 0. Operating instructions (read first)

You're rebuilding a site from scratch. **Treat every file under `src/components/` and the visual layer of `src/pages/Index.tsx` as throwaway** — anything you've previously authored or iterated on (HeroScene with floating beams + crystal, ServicesSection 3D-shape-per-service, ManifestoSection scroll-scrubbed text, StudioSection portraits, ContactSection fluid noise shader, WorkSection horizontal scroll with stacked-card mockups, the light-paper "Blueprint" palette swap, the carpenter's-mark logo, the lowercase-kozai-with-stroked-z wordmark, the precision-instrument metaphor, the warm-parchment + sienna palette) is **not part of the new design**. Do not reach for any of those compositions, scenes, or color systems. Forget them.

What survives:
- **The information** about Kozai (services, projects, team, contact details) and the Kozai brand identity (the *name* and what the studio does)
- **The technical foundation** (Vite + React + TypeScript + Tailwind, GSAP + Lenis smooth scroll, Three.js available)
- **The fact that text reveals + smooth scroll are wanted**

Everything else — palette, logo, layout grid, hero composition, section structure, navigation, transitions, typography choices, animation language — gets re-derived from the references below.

You do not propose three options and ask the user to pick. **You commit to one coherent design system, defend it briefly, and execute.** The user has explicitly asked for boldness and decisiveness, not menus of choices.

---

## 1. The seven references — what to actually study

Each reference has a *technical signature* that won times. Study what these sites do, not just how they look. Pull techniques, not surface-level visual quotations.

### 1.1 interractlabs.com
- **Stack:** Three.js + PixiJS layered (3D scene with a 2D shader veil rendered on top)
- **Hero:** cursor-reactive 3D scene with manifesto-style typography overlaid
- **Layout:** asymmetric stacked content blocks, generous whitespace, multi-column capability split (Design / Development / Consulting / Sound)
- **Pull:** layered rendering pattern (3D below, 2D shader effect on top), cursor as primary input, manifesto framing instead of marketing framing

### 1.2 loudsrl.com
- **Palette:** `#753b2d` rust + `#4050a7` indigo (most distinctive in the set)
- **Signature interaction:** custom header hover effect, animated menu, glitch 404, big-image transitions
- **Editorial move:** full-screen industry showcases each captioned with **three-word value triads** ("Efficiency, Data-Driven, Secure" / "Headless, Sales, Growth")
- **Pull:** the three-word triad rhythm as a structural device, glitch transitions between sections, custom hover *systems* (not one-off effects)

### 1.3 landonorris.com
- **Palette:** `#D2FF00` lime on `#111112` near-black (which is why this is now **off-limits for Kozai** — too close to old palette)
- **Tech:** Webflow + GSAP + WebGL/WebGPU + Rive
- **Signature artifact:** a 3D helmet rotates as the hero anchor; the helmet *gallery* (Hall of Fame) is the brand's visual vocabulary
- **Interaction:** tap-to-lock on hero galleries (interrupts scroll), dual-state base+hover image swaps, sequential helmet-cards with playful design names
- **Pull:** a *physical artifact of the brand* used as the central 3D form (not abstract glass / particles), tap-to-lock interrupting scroll, decorative SVG signatures functioning as typography

### 1.4 synchronized.studio
- **Palette:** strict achromatic — `#000000`, `#9C9C9C`, `#FFFFFF`. Color is *removed*; motion is the color.
- **Tech:** Vue/Nuxt + GSAP + WebGL + PixiJS
- **Signature:** **horizontal-pinned scroll for case studies**, drag-to-navigate projects panel, custom loading sequence that functions as identity
- **Pull:** horizontal-scroll inside vertical pages (the user scrolls *down*; content moves *sideways*), drag interaction as primary nav, the loader as a brand moment

### 1.5 the-nocodeshader.hardikbhansali.com
- **Palette:** `#000000` + `#ff6a00` neon orange. Shader colors do the rest.
- **Signature:** **54 live WebGL shaders embedded as cards** — the portfolio *is* the demo
- **Interaction:** countdown timer in hero ("00 00"), keep-scrolling prompt, click-to-enter shader previews
- **Pull:** **shader cells as content** (each cell is a mini-shader running live), the brand *is* the visual technique, not visual decoration on top of brand

### 1.6 kvs.services
- **Tech:** Three.js + Blender pipeline (modeled assets, not procedural geometry)
- **Editorial:** long-form flow with full-page video embeds
- **Pull:** 3D objects feel **modeled and lit**, not built from boxes — they have surface, weight, and intent. Studio philosophy expressed in long-form layout, not card grids.

### 1.7 shopify.com/editions/winter2026
- **Tech:** modular feature blocks with embedded video posters, smooth-scroll anchors
- **Signature:** **Sidekick Skills carousel** — emoji-decorated AI prompt shortcuts that combine demo + try-it-now invitation
- **Interaction:** clicking certain backgrounds plays inline clips or deep-links into product
- **Pull:** modular feature-block rhythm, video posters as the dominant visual unit, interactive backgrounds that reward exploration

---

## 2. Cross-site patterns Kozai must adopt

These are the patterns that show up in **multiple** awarded sites. They are not optional.

1. **One signature interaction anchors the whole site.** Lando = 3D helmet rotation. Synchronized = horizontal-scroll case + drag-to-nav. nocodeshader = live shader cells. LOUD = three-word industry triads. Pick one for Kozai. It must be repeatable, screenshot-able, and tie to what Kozai sells.
2. **Single-accent restraint.** Two anchor neutrals + at most one chromatic accent. Color is rare and earned.
3. **Editorial typography hierarchy.** Sans-only. Personality from extreme scale jumps + weight contrast, not from typeface variety. Add italic for one specific editorial moment.
4. **Asymmetric grids with negative space.** Numbered cases, irregular card sizes, generous emptiness.
5. **GSAP ScrollTrigger orchestrates the entire scroll experience.** Section pinning, scrubbed reveals, choreographed exits.
6. **A custom loading sequence is a brand moment**, not a chore. The loader transforms into the site rather than disappearing.
7. **Layered rendering** is acceptable: 3D scene below, 2D shader effect on top, HTML overlaid on both with proper z-stacking.
8. **Custom cursors are not the differentiator** anymore. If you ship one, keep it minimal — it's hygiene, not signature.

---

## 3. Constraints derived from prior rejections

The user has explicitly rejected, in order:

| Rejected | Why |
|---|---|
| Black + lime green palette (`#080809` + `#DAFF00`) | Identical to landonorris.com — derivative |
| Warm parchment + burnt sienna palette | "Did not look good"; "warm earthy" is wrong direction |
| Light editorial cream + cobalt blue ("Blueprint") | "Looks horrible — basically just changed accent colors and went light mode" |
| Carpenter's reference mark logo (square + line + tick) | "Ugly and disconnected" |
| Lowercase wordmark with strike through z | (implicit — was tied to rejected light-mode rebuild) |
| Precision-instrument metaphor for hero 3D form | (implicit — tied to rejected rebuild) |
| Floating-beams + central crystal hero (current production) | "Polygons just instantly appear, it looks weird" |
| Word "boutique" in copy | "Sounds unprofessional" |
| Word "two-person" / "Two engineers" anywhere | Wants more professional framing |
| "Founding Engineer" / "Systems Engineering" as roles | Wanted upgraded titles (already done — keep "Principal Engineer & Founder" / "Senior Systems Engineer") |
| Slow tweaks framed as "redesigns" | The user wants *structural* change, not color or copy swaps |

Therefore the new design must:
- **Not** be light mode + a single accent + lowercase wordmark
- **Not** be black + neon green or black + electric lime
- **Not** be warm cream / parchment / sienna
- **Not** use a "construction / timber / instrument" metaphor for the central 3D
- **Not** rely on rotating glass beams or a floating crystal
- **Not** use the word boutique, two-person, or "intentionally small"

---

## 4. The new design system Kozai will commit to

The brief above forecloses the obvious palettes. What's left, and what's actually *bold* for a software studio?

### 4.1 Palette — committed

**"NIGHT TRADING FLOOR"** — deep saturated blue-black background, warm off-white text, two cooperating accents.

| Token | Value | Role |
|---|---|---|
| `--ink` (background) | `#06080F` deep navy-black, slight blue cast | The whole page. Not pure black — has depth. |
| `--ink-rise` | `#0C111B` slightly lifted surface | Cards, drawers, elevated panels |
| `--ink-edge` | `#1B2230` hairline borders | 1px lines, dividers |
| `--bone` (text) | `#E8E4D7` warm off-white | Primary text. Slight cream cast keeps it from feeling clinical |
| `--bone-mute` | `#7A7E8A` cool grey | Labels, captions |
| `--signal` (primary accent) | `#FF5B2A` saturated vermilion | Used at most 5 places per page. Errors, hover, single hot accent |
| `--signal-2` (secondary accent) | `#3DEAD2` electric jade | Used even more rarely — "live", "active", "online" indicators only |

This palette is *not* in the reference set. Closest neighbor is LOUD's rust + indigo, but here both accents are higher-saturation and the neutrals are bluer. It reads as a **trading-floor / mission-control** aesthetic — which is exactly what Kozai sells: tools operators rely on.

### 4.2 Typography — committed

| Use | Family | Weight | Treatment |
|---|---|---|---|
| Display headlines | **PP Neue Montreal** if licensable, otherwise **Space Grotesk** Medium 500 | 500 | Tight tracking (`-0.04em`), line-height 0.92, scale up to 12vw on hero |
| Body | **Inter** | 400 | leading-relaxed, max-width 60ch |
| Mono / labels / numerics | **JetBrains Mono** | 400 | uppercase, `tracking-[0.32em]`, 11px |
| Editorial italic | **Editorial New** if licensable, else system serif italic | 400 | Used **once** per section maximum, for a single emphatic word or phrase |

The serif italic is the editorial flourish. It should appear on the hero (one word italicized), once in the manifesto, and nowhere else. Restraint is the point.

### 4.3 Logo — committed

**Wordmark only. "KOZAI" set in display weight, full caps, with a single horizontal hairline crossing the entire wordmark below the baseline** — like a strikethrough that *under*lines instead. The hairline extends a few units past the wordmark on each side, suggesting a measurement bar or a spec sheet.

No mark, no monogram, no symbol. The hairline is the entire visual identity element. At favicon size, the favicon is just two horizontal hairlines stacked (the wordmark's bottom plus the underline) — abstract enough to read at 16×16.

This is intentionally *quieter* than every previous logo attempt. Kozai's confidence comes from the work, not the logomark.

### 4.4 Signature interaction — committed

**A horizontal-pinned camera dolly through a single 3D environment** that contains all of Kozai's "rooms" — Hero, Services, Work, Studio, Contact each correspond to a position the camera travels to. The user scrolls vertically; the camera moves laterally through the environment.

The 3D environment is **not** an abstract sculpture or a single object. It is a **stylized terminal / control surface** rendered in Three.js with deliberate restraint:
- A single dark plane stretches into the distance (the "trading floor")
- Above it, a sparse arrangement of **3D-rendered "panels"** — each panel is a flat rectangle showing a stylized data visualization (line chart, table, log stream, status grid) rendered as **a Three.js shader, not as DOM**. The panels are positioned like floating monitors in a server room.
- Each section of the site corresponds to one panel becoming the camera's focus. The camera flies between panels.
- The accent vermilion is used for one specific element per panel (a single error log line, a single chart line, a single highlighted cell) — never as a fill.

This **is** what Kozai sells (tools, dashboards, data infrastructure) rendered as the brand identity. It's the LandoNorris-helmet move: a real artifact of the brand becomes the brand's visual vocabulary. nocodeshader's "shaders are content" idea, applied to dashboards instead of shaders.

### 4.5 Loading sequence — committed

The page loads with a single full-screen monospace counter ticking from `00.0` to `100.0` in the bottom-left, with one rotating string above it cycling through Kozai's services in 200ms intervals (`internal_tools / workflow_automation / data_pipelines / client_platforms / mvp_engineering`). When 100.0 hits, the counter snaps off-screen left and the camera dolly begins from the first panel position.

No logo glyph drawing, no shutter peel, no center-screen branding. The counter *is* the loader.

### 4.6 Site structure — committed

The site is **one continuous horizontal-pinned scroll** containing six "rooms":

1. **OPERATIONS** (entry / what you used to call the hero) — establishes the environment. Hero text overlays the trading-floor scene. Headline appears as a stack of monospace lines that "type out", not a display-font reveal.
2. **APPROACH** (manifesto) — three panels float into focus, one at a time. Each panel shows a three-word triad (LOUD pattern) plus one paragraph of body. Triads:
   - `SCOPED. OPINIONATED. SHIPPED.`
   - `ENGINEERS. NOT VENDORS.`
   - `BUILT. TO. OWN.`
3. **WHAT WE BUILD** (services) — four data-vis panels become foreground in sequence. Each panel's shader is *thematic*: a chart (dashboards), a flowing graph (workflow), a tile grid (platforms), a forecast-cone (data). Panel labels are mono.
4. **SELECTED WORK** — four project panels, each with: client / year / one-line outcome / a single live data-vis representing the project's domain. Hovering a panel slows the camera and brings it forward (Lando-style tap-to-lock equivalent).
5. **THE STUDIO** — two portrait panels float into focus, with founder + senior engineer bios as monospace caption blocks beneath. Portraits use a pixel-quantize shader that resolves on hover (RGB-split → clean photo).
6. **CONTACT** — a single panel becomes a terminal prompt: `> kozai.contact:~$_` with a blinking cursor. Email appears as a typed response. CTA button below opens the existing intake drawer.

Vertical scroll progress = horizontal camera position in the 3D environment. Lenis stays as the smooth-scroll engine; GSAP ScrollTrigger drives the camera along a Catmull-Rom spline through the scene.

### 4.7 Transitions between rooms — committed

Between each room, the camera **briefly cuts** (1-frame hard cut, then a 200ms motion-blur shader pass) — a *glitch transition* in the LOUD lineage. Not a smooth crossfade. The cut is a deliberate punctuation that says "new room."

### 4.8 Cursor — committed

Single dot, 4px, vermilion. On hoverable elements: dot grows to 32px ring with 1px stroke, no fill. On panels: dot becomes a small `+` crosshair. No labels following the cursor. Quieter than the current implementation.

### 4.9 Mobile — committed

Mobile drops the horizontal-pinned dolly. Vertical scroll, full-bleed sections, each room becomes its own viewport. The data-vis shaders still run as panel backgrounds. Loader becomes a single-line counter at the top of the viewport.

---

## 5. Implementation sequence

Build in this order. Push after each step. Verify in browser at desktop + mobile widths before moving on.

1. **Foundation reset.** Replace `src/index.css` palette tokens with the Night Trading Floor values. Strip everything custom-cursor-related down to the spec in 4.8. Replace `src/components/Logo.tsx` with the wordmark + hairline. Update favicon SVG. Update `index.html` `theme-color` to `#06080F`.
2. **Loading sequence.** Replace `src/components/Preloader.tsx` with the counter+rotating-string loader. No WebGL noise shader, no shutter panels.
3. **The room engine.** Build a new `src/components/SceneController.tsx` (or similar) that owns the Three.js renderer + camera + panel registry. Camera moves along a Catmull-Rom spline. Panels are registered by section and given a target camera position. ScrollTrigger drives spline progress.
4. **Operations room (hero).** First panel, with monospace headline that types out via GSAP TextPlugin (or a manual stagger). Subline and meta strip pinned to the viewport edge, not the panel.
5. **Approach room.** Three triad panels. LOUD-style typography. Each triad reveals via word-by-word stagger when its panel becomes camera focus.
6. **Build room (services).** Four shader-backed data-vis panels. Implement four custom GLSL fragment shaders (chart line, flowing graph, tile grid, forecast cone). Each runs at low cost — single-pass, no post-processing.
7. **Work room.** Four project panels. Project data lives in a typed array (preserve existing project data). Hover-to-lock interaction.
8. **Studio room.** Two portrait panels with the pixel-quantize → clean-photo hover shader.
9. **Contact room.** Terminal prompt panel. Existing `ContactDrawer.tsx` stays (it's the only intake mechanism); the terminal prompt is the visible front.
10. **Transition glitch.** Implement the 1-frame-cut + 200ms motion-blur shader pass between rooms.
11. **Mobile fallback.** Detect `(max-width: 768px)` in `SceneController` and switch to vertical-stack mode. Verify each room renders standalone.
12. **Polish.** Cursor states, micro-interactions on the navigation, transition timings, prefers-reduced-motion fallbacks.

Each step is one commit. Don't bundle.

---

## 6. Copy preserved from existing site

Use this verbatim where applicable. Do not invent new copy for these data points.

**Studio identity**
> Kozai is a software studio working at the intersection of engineering and operations. You work directly with the engineers building your system — every call, every commit, every release. No intermediaries between you and the people writing the code.

**Founded:** 2022 · **Location:** Toronto, CA · **Stack:** TS · Go · Rust · SQL

**Team**
- **Aden Ahmed** — Principal Engineer & Founder
  > Builds the operational platforms mid-market and enterprise teams depend on. Background spans data infrastructure, distributed services, and the interfaces operators rely on every day.
  > *Specializes in turning ambiguous requirements into systems that hold up under production load.*
- **Muhammad Khan** — Senior Systems Engineer
  > Distributed systems and reliability engineering. Deep experience with high-availability architectures, observability, and the edge cases that determine whether a system can be trusted under load.
  > *Focuses on resilience engineering — building systems that fail gracefully and recover predictably.*

**Services (preserve)**
1. Internal tools & dashboards — *Your ops team stops copy-pasting between spreadsheets.*
2. Workflow automation — *The job that took an afternoon now runs while you sleep.*
3. Client-facing platforms — *From whiteboard to first paying user.*
4. Data & decision support — *Stop arguing about what the number is.*

**Selected work (preserve)**
- Meridian Logistics — Real-time fleet console — `−83% incidents`
- Kindred Health — Clinician charting suite — `−78% charting time`
- Tessera Capital — Deal flow operating system — `+41% reply rate`
- Lumen Studios — Render pipeline & client portal — `−6 days / project`

**Contact** — `hello@kozai.ca` · Mon–Fri · 09–18 ET · Within 48 hours

---

## 7. What "done" looks like

When the rebuild ships, a visitor should:
1. **See the trading-floor environment within 1.5s** of the loader hitting 100.
2. **Understand within 5 seconds** that Kozai builds operational software (the panels show data, not abstract shapes).
3. **Scroll once and feel the camera move sideways** through space — and immediately understand the metaphor.
4. **Reach Contact** having seen all four projects rendered as live data, the team rendered as quantized portraits, and the manifesto as three-word triads.
5. **Never see**: floating beams, a glass crystal, a rotating square logo, the words "boutique" or "two-person", lime green, warm parchment, or burnt sienna.

If any of those forbidden elements appear in your build, you've regressed.

---

**End of brief.** When the user pastes this back, begin with step 1 (Foundation reset). Push after each step. Verify in browser before continuing. Do not propose options. Commit to this design and execute it.
