---
name: upr-web-design
description: Use when designing or developing websites for the University of Pinar del Río (UPR), to ensure visual identity compliance with the official brand manual. Applies to new site builds and redesigns.
---

# SKILL: Web Visual Identity Guidelines - University of Pinar del Río (UPR)

## Overview
This document defines strict design and frontend development rules based on the "Visual Identity Manual" of the University of Pinar del Río "Hermanos Saíz Montes de Oca". Any AI agent, designer, or frontend developer creating a new website or redesigning an existing one for the institution must follow these guidelines.

## 1. The Identifier (Logo)
- **Golden Rule:** NEVER recreate the logo using HTML/CSS text. Always use the official high-resolution SVG or PNG assets.
- **Compositions:**
  - *Primary (Vertical):* Default for headers, footers, and homepages.
  - *Secondary (Horizontal):* Use only in tight spaces or narrow navigation bars.
- **Clear Space (Área Vital):** Maintain a margin of respect proportional to the logo's height. No text, buttons, images, or borders may intrude into this space.
- **Minimum Digital Size:** Do not scale the logo below `35 x 33.2 px`. If space is tighter, use only the imagotype (symbol without text).
- **Absolute Prohibitions:** Do not apply shadows, glows, transparencies, perspective, rotation, proportion distortion, or alter the institutional colors.

## 2. Color Palette
Use exclusively these codes for the web interface:
- **Primary Green:** `RGB: 0, 121, 63` | `HEX: #00793F` (Primary buttons, links, accents).
- **Secondary Green:** `RGB: 5, 83, 43` | `HEX: #05532B` (Button hover states, footers, contrast).
- **Backgrounds:** Prioritize white or very light gray backgrounds to ensure contrast.
- **Negative Logo:** Use the white version of the logo when placing it over dark green backgrounds or images.

## 3. Institutional Typography
- **Official Font:** Myriad Pro.
- **Web Implementation (Fallback):** If the web license for Myriad Pro is unavailable, use `Source Sans Pro` or `Segoe UI` as visually similar fallback fonts.
- **Hierarchy:**
  - *Headings (H1, H2, H3):* Myriad Pro Bold or Black.
  - *Subheadings (H4, H5):* Myriad Pro Bold.
  - *Body text (P, lists, forms):* Myriad Pro Regular or Condensed.
- **Readability:** Do not use text smaller than `14px`. Ensure a `line-height` of at least `1.5` for paragraphs.

## 4. Graphic Resources & UI
- **Rules (Filetes):** You may use separator lines terminating at both ends with the imagotype star to divide sections or as card borders.
- **Texture (Trama):** The star pattern may be used for section backgrounds (e.g., footers) at low opacity only, without compromising legibility.
- **Photography:** Use sharp, high-quality images that reflect the reality of UPR (students, classrooms, the monument, the flag). Avoid generic stock photos.

## 5. Instructions for New Sites
- **Header:** Logo in primary (vertical) or secondary composition, left-aligned or centered, on a white background.
- **Footer:** Primary or dark green background with the white (negative) logo version.
- **Buttons (CTA):** Primary Green with white text. The `:hover` state must use Secondary Green.
- **Navigation:** Institutional typography, dark gray/black text, and green for the active item.

## 6. Instructions for Redesigns (Existing Sites)
- **Brand Audit:** Immediately replace any distorted, shadowed, or incorrectly colored logo with the official assets.
- **Typography Unification:** Remove fonts such as Arial, Times New Roman, or Roboto. Apply the Myriad Pro family (or its fallback) across the entire CSS.
- **Visual Cleanup:** Remove unauthorized gradients, logo shadows, and perspective effects.
- **Responsive:** Ensure the logo retains its clear space on mobile and does not overlap hamburger menus or icons.

## 7. Agent Checklist
- [ ] Is the logo the official asset with correct proportions?
- [ ] Is the logo's clear space free of other elements?
- [ ] Do the HEX colors match Primary Green (#00793F) and Secondary Green (#05532B)?
- [ ] Is the typography Myriad Pro or its fallback (Source Sans Pro / Segoe UI)?
- [ ] Is text contrast over backgrounds legible (WCAG AA)?
- [ ] Have shadows, transparencies, and logo distortions been removed?