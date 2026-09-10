# jobsub.app

Public site for JobSub. Static files on GitHub Pages (`main` → https://jobsub.app).

This repo is the marketing page only. It does not talk to watcher, engine, gatekeeper, or OneAboveAll. Signup is still the Google Form; confirm and unsubscribe stay on gatekeeper.

## Company list

The public list is maintained **here**, by hand — not fetched from watcher.

1. Edit `companies.json` (JSON array of display names, alphabetical).
2. Edit the same names in the `<ul id="company-list">` in `index.html` (no-JS fallback).
3. Set the no-JS count in `#company-status` (`N companies`). `app.js` overwrites it after fetch.
4. Set the count in the hero lede in `index.html` (`N high-tier company career pages`). This one is
   static — `app.js` never touches it — so it is the easiest of the four to leave stale. Grep for the
   old number before committing a list change.

List the public display name, not the watcher `company_id`. DoorDash is two watcher boards (`doordash`, `doordash-canada`) and one name; Yelp is likewise two (`yelp`, `yelp-canada`) and one name.

Two names here differ from watcher's `display_name` on purpose — do not "fix" either:

- LayerZero Labs is listed under its full name; watcher says `LayerZero`.
- Borealis AI is the name readers recognize; watcher says `RBC Borealis` (board `rbc-borealis`, RBC's Workday filtered to `Borealis`).

Both divergences are visible to subscribers: the alert email carries watcher's `display_name` (watcher → `company_name` on the queue message → engine's subject line), so a role from that board arrives as "… — RBC Borealis" while this page says Borealis AI. Accepted trade-off, not a bug. Renaming on this page cannot change the email; only watcher can.

Every other name matches watcher's `display_name` exactly — including seven that read like typos or look truncated and are not: `Layer 6`, whose space is watcher's and the lab's own; `Grafana Labs`, which is the `grafana` board's full `display_name`; `Tripadvisor`, whose lowercase "a" is watcher's and the company's own branding; `Flipp`, whose doubled "p" is the company's own spelling; `Fullscript`, which is one word with a lowercase "s"; `Movable Ink`, which has no second "e" (watcher's board token is `movableink`); and `Jane`, which is watcher's whole `display_name`, not a shortening of "Jane App". Do not close up "Layer6", shorten "Grafana", camel-case "TripAdvisor", drop a "p" from "Flip", split "Full Script", add an "e" to "Moveable Ink", or expand "Jane": each would make another divergence, silently.

Do not list a company whose board is disabled in watcher. Adding a name on this site does not start a crawl.

## Collapsed list

The list is collapsed on load: `app.js` renders the `FEATURED` names only, behind a "Show all N" toggle. Change the featured names by editing `FEATURED` at the top of `app.js`. Names not in `companies.json` are ignored, so dropping a company cannot leave a stale chip.

Two things that look like tidy-ups but are load-bearing:

- `#company-toggle` lives **outside** the `<ul>` in markup, `hidden`, and `app.js` moves it into an `<li class="company-more">` at the end of the row. It must stay outside: `readInitial()` reads every `<li>` in the markup as a company name, so a button parked inside the `<ul>` would register "Show all" as a company.
- Searching always filters the full list and drops the toggle from the row. Collapsing applies only at rest — otherwise search would silently miss the companies that aren't featured.

The button is dashed, not solid, so it doesn't read as one more company chip while sharing the row. Its height comes from flex stretch, not fixed padding, so it stays aligned if the chips change.

## Page structure

Section order on the homepage is deliberate, and it answers the September 2026 user session.
Readers were bouncing off a hero whose `<h1>` was the bare words "5 minutes", and they had to reach
the bottom of the page to find a way to sign up.

1. **Hero** — `<h1>` states the outcome; "five minutes" moved down into the lede where it reads as
   proof rather than as the hook. Two CTAs sit above the fold: the form for people holding a key,
   and a `mailto:` for people who need one. The `.proof` strip under them is the only place on the
   page carrying the Canada/US audience line, so do not thin it out without putting that claim back
   somewhere visible — an earlier draft held it in a pill above the `<h1>` and that pill was cut.
2. **Email specimen** — moved up from fifth place. It is the fastest way to show what the product is.
3. **How it works** — the reader's three steps (get a key, fill the form, confirm), not the crawler's
   pipeline. The old career-page → 5 min → inbox diagram described the machine, and restated
   "5 minutes" for the third time before the reader learned anything new.
4. **Companies** — search and the chip list.
5. **What JobSub does and never does** — replaces the old "Only latest / Invitation only / Simple"
   row. "Simple" carried no information; the no-fee, no-resume, no-auto-apply and no-tracking claims
   were only in footer fine print and in `privacy.html`, where a first-time reader never sees them.
6. **Subscribe** — two cards, so someone without a key is not left at a dead end.

The header is sticky and carries the only button in the bar, so signup stays one click away from any
scroll position. `--bar` in `styles.css` is that bar's height and feeds the `scroll-margin-top` on
each section, so anchor jumps do not land under it. Changing one without the other hides headings.

Every claim on the page is unchanged from the previous version — see "Public claims that must stay
true" below. No links, form targets, or `app.js` behaviour changed in this redesign.

## Signup

The live preference form is https://forms.gle/S8yBqT2PLEMnLvFt7 (nav + homepage CTA). Confirm and unsubscribe stay on gatekeeper.

## Public claims that must stay true

Homepage wording can change; these claims about the service must stay true.

- Invitation only. No open signup, no waitlist collector on this host.
- Alerts within five minutes of a new posting (5-minute crawl).
- High-tier companies; positioned for Canada/US tech people.
- No auto-apply, no resume, no job board. No fee.
- Independent, not-for-profit research project — not a registered nonprofit. Open to sponsorships.
- Operator is “JobSub” — no personal name.
- Do not name the email vendor.

## Colour

The palette is the conventional sky-blue frontend system: a faintly blue-tinted page (`#f6f9fc`),
slate ink and rules, and a single blue accent. Two tokens are easy to get wrong:

- `--signal` is the *interactive* blue and is used as text (`.latency`, hover states), so it is
  sky-700 rather than a lighter sky — a lighter one fails contrast on the page background.
  `--sky` is the lighter shade and is decorative only: it tints the radial wash behind the hero.
- `--on-signal` is whatever text sits **on** `--signal`, and it flips with the theme — white in
  light mode, near-black navy in dark, because the dark accent is a bright sky. Never hardcode a
  text colour on an accent fill; that was the previous bug, a fixed cream that only worked warm.

`--good` stays green for the "yes" marks in the promises list. Green/grey reads as yes/no faster
than one accent used for both.

Contrast was checked for every foreground/background pair in both themes; the tightest is
`--muted` on `--page`. If you lighten `--muted`, re-check it — slate-500 landed at exactly 4.50.

## Privacy

`privacy.html` is a description of behaviour. This site sets no cookies, runs no analytics, and embeds no third-party scripts, fonts, or trackers. First-party CSS/JS only. Company search runs in the browser.

## Local preview

```bash
python3 -m http.server 8765
```
