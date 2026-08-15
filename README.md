# jobsub.app

Public site for JobSub. Static files on GitHub Pages (`main` → https://jobsub.app).

This repo is the marketing page only. It does not talk to watcher, engine, gatekeeper, or OneAboveAll. Signup is still the Google Form; confirm and unsubscribe stay on gatekeeper.

## Company list

The public list is maintained **here**, by hand — not fetched from watcher.

1. Edit `companies.json` (JSON array of display names, alphabetical).
2. Edit the same names in the `<ul id="company-list">` in `index.html` (no-JS fallback).
3. Set the no-JS count in `#company-status` (`N companies`). `app.js` overwrites it after fetch.

List the public display name, not the watcher `company_id`. DoorDash is two watcher boards (`doordash`, `doordash-canada`) and one name. Do not list disabled boards (Circle is in watcher, not here). Adding a name on this site does not start a crawl.

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
