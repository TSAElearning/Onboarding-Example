# Halden Employee Onboarding

An interactive onboarding course for new employees. It is plain HTML, CSS and JavaScript, built on the CONNECT™ methodology (The Space of Agnes Elisa). There is no build step and nothing to install.

## Run it

**Quickest:** open `Halden-Onboarding-Course.html` in any browser (Edge, Chrome, Safari, Firefox). It is the whole course in one file, so it works even if you open it straight from the zip.

**Project version:** extract the zip, then open `index.html`, or serve the folder:

```bash
cd halden-onboarding-course
python3 -m http.server 8080
```

Then go to http://localhost:8080.

To publish it, copy the folder to any web server, intranet or static host (for example SharePoint, Netlify, GitHub Pages or an S3 bucket).

## Files

| File | What it holds |
| --- | --- |
| `Halden-Onboarding-Course.html` | The whole course in one file, for previewing and sharing. Regenerate it after editing the files below. |
| `index.html` | Page structure: header, CONNECT™ chain, lesson sidebar, lesson area, design lens |
| `assets/css/styles.css` | Visual design: color tokens (light and dark), Roboto Slab headings, Roboto body, layout, components |
| `assets/js/app.js` | Course engine, content, icons and gamification |

## Look and feel

The course uses an Articulate-style player: a course cover with the lesson list, a lesson header on every screen, a Previous / Continue bar, flip cards, a step-by-step history, character scenarios, and quizzes that show one question at a time with Submit and feedback. Every topic has an outline icon, drawn inline so it works offline.

## Gamification

| Element | How it works |
| --- | --- |
| XP points | 100 per correct first-try answer in lesson checks, 150 in the final challenge, 50 for each sort item, matching answer or phishing flag, 20 for each lesson pulse |
| Streaks | Consecutive correct answers add +25 to +100 bonus XP |
| Stars | 1–3 stars per check, based on first-try accuracy |
| Badges | 9 badges: one for each lesson, plus Phish Finder, On a Roll (5 in a row), Certified and First-Try Finisher |
| Levels | Newcomer → Explorer (600) → Contributor (1,600) → Insider (3,000) |
| Achievements | The points counter at the top opens the learner's level, badges and stars |

Point values, badges and levels are set in `BADGES`, `LEVELS` and the `award()` calls in `app.js`.

## Course structure

Nine lessons and 31 screens, plus a course cover, mapped to the CONNECT™ traceability chain:
Business outcome → Performance → Capability → Objective → Experience → Assessment → Workplace application → KPI.

| # | Module | Chain link |
| --- | --- | --- |
| 00 | Welcome | Outcome · Performance · Objective |
| 01 | Who we are | Experience · Check |
| 02 | How we work | Experience · Check |
| 03 | Integrity & respect | Experience · Check |
| 04 | Security & privacy | Experience · Check |
| 05 | Your first weeks | Experience · Application |
| 06 | Final assessment | Assessment (pass mark 6 of 8) |
| 07 | Your 60-day plan | Workplace application |
| 08 | Measure & close | KPI |

## Editing content

All course text lives in `assets/js/app.js`:

- `BEHAVIORS`: the six target behaviors, rated before and after the course.
- `DEPTS`: departments and their department-specific tool.
- `MODULES`: every module and screen. Each screen has a `type` that sets its interaction:
  `text`, `reveal`, `tabs`, `timeline`, `predict`, `scenario`, `mcq`, `match`, `sort`, `hotspot`, `checklist`, `pulse`, `rate`, or `custom`.
- `LENS`: the design notes shown in the CONNECT™ lens for each screen type. To override them for one screen, give that screen its own `lens` object.
- `ICONS`: the icon set. Use an icon anywhere with `ic('name')`.

To change the colors, edit the tokens at the top of `styles.css`: `--vino`, `--fushia`, `--rose` and so on. There is one set for light mode and one for dark mode.

## Learner data

Progress, answers, module pulses and time per module are saved in each learner's browser (`localStorage`). Nothing is sent to a server. To report results to an LMS, the course needs a SCORM or xAPI wrapper, which is not included.

## Accessibility

- Full keyboard use: tabs and rating scales respond to the arrow keys.
- Results and feedback are written in words, not shown by color alone.
- An A+ larger-text control.
- Dark mode follows the learner's system setting.
- Motion is reduced when the learner's system asks for it.

All company names and figures are fictional.
