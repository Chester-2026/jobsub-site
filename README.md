# jobsub.app

Public site for JobSub. Static files on GitHub Pages (`main` → https://jobsub.app).

This repo is the marketing page only. It does not talk to watcher, engine, gatekeeper, or OneAboveAll. Signup is still the Google Form; confirm and unsubscribe stay on gatekeeper.

## Company list

The public list is maintained **here**, by hand — not fetched from watcher.

1. Edit `companies.json` (JSON array of display names, alphabetical).
2. Edit the same names in the `<ul id="company-list">` in `index.html` (no-JS fallback).
3. Set the no-JS count in `#company-status` (`N companies`). `app.js` overwrites it after fetch.

List the public display name, not the watcher `company_id`. DoorDash is two watcher boards (`doordash`, `doordash-canada`) and one name; Yelp is likewise two (`yelp`, `yelp-canada`) and one name.

Two names here differ from watcher's `display_name` on purpose — do not "fix" either:

- LayerZero Labs is listed under its full name; watcher says `LayerZero`.
- Borealis AI is the name readers recognize; watcher says `RBC Borealis` (board `rbc-borealis`, RBC's Workday filtered to `Borealis`).

Do not list a company whose board is disabled in watcher. Adding a name on this site does not start a crawl.

## Collapsed list

The list is collapsed on load: `app.js` renders the `FEATURED` names only, behind a "Show all N" toggle. Change the featured names by editing `FEATURED` at the top of `app.js`. Names not in `companies.json` are ignored, so dropping a company cannot leave a stale chip.

Two things that look like tidy-ups but are load-bearing:

- `#company-toggle` lives **outside** the `<ul>` in markup, `hidden`, and `app.js` moves it into an `<li class="company-more">` at the end of the row. It must stay outside: `readInitial()` reads every `<li>` in the markup as a company name, so a button parked inside the `<ul>` would register "Show all" as a company.
- Searching always filters the full list and drops the toggle from the row. Collapsing applies only at rest — otherwise search would silently miss the companies that aren't featured.

The button is dashed, not solid, so it doesn't read as a 28th company chip while sharing the row. Its height comes from flex stretch, not fixed padding, so it stays aligned if the chips change.

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

## Privacy

`privacy.html` is a description of behaviour. This site sets no cookies, runs no analytics, and embeds no third-party scripts, fonts, or trackers. First-party CSS/JS only. Company search runs in the browser.

## Local preview

```bash
python3 -m http.server 8765
```
