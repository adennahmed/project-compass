

## Plan: Fix Our Ethos Cards — Stable Padding & Consistent Colors

### Problem
1. When a card expands (flex 1 → 1.8), the bottom text reflows/re-wraps, changing its visual padding. Other cards' text also shifts as they compress (flex 0.8).
2. Colors for SVG illustrations, number labels, and body text don't follow the pure white (card 1) / pure black (cards 2-4) rule.

### Solution

**File: `src/components/SolutionsSection.tsx`**

**A. Prevent text reflow on expand/collapse:**
- Change the bottom text container to use `position: absolute` anchored to the bottom of each card, with fixed left/right padding. This decouples text layout from the card's flex width — the text will simply clip or remain stable regardless of card width changes.
- Alternatively (simpler): reduce the expansion ratio further (e.g., flex 1 → 1.4, others stay at 0.9) so width changes are too small to cause reflow. Combined with a fixed `min-width` on the text area, this prevents wrapping changes.
- Best approach: set the bottom text `<p>` to `white-space: nowrap` or use a fixed-width inner container with `overflow: hidden` so text never reflows regardless of card width.

**B. Color corrections in the `solutions` array:**
- Card 1 (black): `textColor: "#ffffff"`, `accentColor: "#ffffff"` — all text, SVG fills/strokes, and "01 / 04" become white.
- Cards 2-4: `textColor: "#000000"`, `accentColor: "#000000"` — all text, SVG fills/strokes, and number labels become pure black.

**C. Remove opacity transitions on body text:**
- Set body text opacity to a constant value (e.g., `0.7`) so it doesn't shift between expanded/collapsed states.

### Specific Changes

1. Update `accentColor` for card 1 to `"#ffffff"` (was `"#C8A96E"`).
2. Update `accentColor` for card 4 to `"#000000"` (was `"#555555"`).
3. Make bottom text use constant opacity (~0.7) instead of toggling between 0.55/0.85.
4. Add `overflow: hidden` to the bottom text container and keep text stable with fixed padding — use absolute positioning at the bottom of each card so the text block size is independent of flex changes.

