---
target: av-ozge-nur-safak law office landing page (re-run)
total_score: 25
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 2
target_identity: "file:/Users/serkan/Desktop/darphane/data/sites/av-ozge-nur-safak.json"
target_fingerprint: "sha256:04d03a221153e8bee2762da5834eec0e471a9c994ca1b0c6c5e2cf9f723c969d"
target_path: /Users/serkan/Desktop/darphane/data/sites/av-ozge-nur-safak.json
timestamp: 2026-09-05T06-36-45Z
slug: data-sites-av-ozge-nur-safak-json
---
# Impeccable Critique #2 — /av-ozge-nur-safak (2026-09-05)
Method: dual-agent. Score 25/36 (heuristic 7 n/a). Detector full mode 0 findings; browser: 3 line-length desktop (services list descriptions 146 cpl, footer note 107), 0 mobile; uxskill 8 FP.

## Priority issues
- [P1] Emergency protocol hidden in closed FAQ #2 (mobile y≈2489). Fix: one-line emergency strip at top of dark services panel with tel number + "ulaşamazsanız WhatsApp'a 'acil' yazın". → clarify
- [P1] Desktop: phone number not in fold; "Hemen Ara" is tel: only (first number at y=2901). Fix: ≥768px button label "Hemen Ara · 0506 820 80 24". → clarify/harden
- [P2] Hero pills look like buttons but inert ("Acil durumda telefon"); desktop fold 8 clickables. Fix: pills → single muted line; drop Yol Tarifi from desktop hero. → distill
- [P2] H1 is only the name; profession buried in 4-line subline. Fix: lead sentence bold (no eyebrow). → typeset
- [P2] Focus ring on dark surfaces 1.78:1. Fix: outline-color var(--c-bg) in .hero-statement/.section-dark. → harden
- [P3] Monogram "ONS" reads as a word; empty dark panel. Fix: single letter Ş or surname; fill panel with emergency strip. → layout

## Personas
Night client: WhatsApp template is "randevu" framed — needs an "Acil" door; no after-hours info. Lawyer: glass header muddy over dark panel on mobile; TBB note is the smallest text; stock Greco-Roman columns not a Turkish courthouse. Relative of detainee: wants to read the number on desktop; no "yakınım gözaltında" FAQ.
