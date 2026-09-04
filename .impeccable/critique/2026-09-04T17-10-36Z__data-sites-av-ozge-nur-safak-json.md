---
target: av-ozge-nur-safak law office landing page
total_score: 26
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:/Users/serkan/Desktop/darphane/data/sites/av-ozge-nur-safak.json"
target_fingerprint: "sha256:b8a305f747da7c6ab3033b3b1da191bebeb3706f28bd3279875f0b53e8bc95dc"
target_path: /Users/serkan/Desktop/darphane/data/sites/av-ozge-nur-safak.json
timestamp: 2026-09-04T17-10-36Z
slug: data-sites-av-ozge-nur-safak-json
---
# Impeccable Critique — /av-ozge-nur-safak (2026-09-04)
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score: 26/36 (heuristic 7 n/a — Persuade surface)
1 Visibility 3 · 2 Real world 3 · 3 Control 3 · 4 Consistency 2 · 5 Error prevention 3 · 6 Recognition 3 · 7 n/a · 8 Aesthetic 3 · 9 Recovery 3 · 10 Help 3

## Design specificity
Shell authored for this lawyer (ink palette, EB Garamond, statement hero, monogram, WhatsApp template, FAQ); content interchangeable — no photo, bar registration, faculty, years, weekday hours. Detector: 0 findings (full mode). Browser detector: 8 × line-length on desktop (About ×3, Services intro, FAQ answers ×4), 0 on mobile. uxskill lint: 9 findings, all false positives.

## Priority issues
- [P1] Mobile fold has 7 tappable actions, 3 duplicated (header WhatsApp 40px, hero 3 buttons, sticky bar 3). Fix: hide ghost action on mobile, drop header CTA when bar present. → distill
- [P1] Same WhatsApp action, three labels, two different prefilled messages (hero/CTA structured template vs bar/header whatsappDefault). Fix: bar + navCta reuse first hero whatsapp action value; single label. → harden
- [P1] Permitted trust facts unused: bar registration, faculty, years, weekday hours (business.hours empty → no OpenBadge), photo, "görüşmeler avukatlık sırrı kapsamındadır". Fix: replace duplicate highlights with facts; fill hours; privacy line.
- [P2] Monogram "Ö" diaeresis floats detached (desktop between h1 and subline; mobile beside Yol Tarifi). Fix: strip diacritics → ONS or move lower. → polish
- [P2] TBB regulation paragraph + jargon mid-persuasion; section-intro 87–96 chars/line. Fix: TBB line to footer small; visitor-language service copy; max-width 46rem→38rem. → clarify

## Persona red flags
Anxious first-time client at night: two WhatsApp buttons, one blank; no identity; "randevuyla" ×3; no after-hours guidance.
The lawyer (buyer): eyebrow reads like a Maps category; two-item services on a huge surface; nothing about her; claims to verify (Saturday open, Osmanbey metro, same-day confirmation).
Relative of a detained person: "gözaltı/tutuklama/acil" below the fold; hero says "randevuyla" 4× and never "acil durumda arayın".

## Minor
Active nav not reset at top · mobile header CTA 40px · pills 13px wrap to 2 lines · SEO title vs page focus mismatch · footer repeats address/phone right under Location.
