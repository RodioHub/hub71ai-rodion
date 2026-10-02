# Roots — Housing LTI for Abu Dhabi

| Submission item | Value |
|---|---|
| Team | rodion |
| Hackathon | Hub71 + OpenAI |
| Repository name | `hub71ai-rodion` |
| Live demo | https://r1cave.com/roots/ |
| Access | Public demo; no account or login required |

Roots helps employers plan a housing-based long-term incentive programme: employees move into a home in Abu Dhabi from the start and can earn ownership after an agreed employment term. The product brings together the employer offer, indicative financing, employee protections, and the practical next steps to launch a pilot.

## The problem

Cash housing allowances help employees cover today's rent. Cash LTI can encourage them to stay with an employer, but does not create a lasting connection to Abu Dhabi. Roots explores an alternative: turn part of the existing cash package into a clear path to owning a home in the city.

## What works in this prototype

- An English, responsive landing page describing the employer, employee, developer, and lender proposition.
- A client-side calculator comparing estimated Housing LTI cash costs with the employer's current housing allowance and annual cash LTI.
- A programme preview and A4 print layout with equal 16 mm page margins.
- An XLSX export with a programme proposal, editable budget formulas, and management approval fields.
- Five document outlines covering policy, participation, occupancy, early exit, and ownership transfer.
- A pilot request saved locally in the browser, with recovery, export, and deletion.
- A closing Contact US popup describing a future email enquiry form.

## Run locally

There is no build step, npm install, backend, database, API key, or environment variable to configure.

Open `index.html` directly in a modern browser, or serve the repository root:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. A normal HTTP/HTTPS origin is recommended if browser privacy settings restrict local-file storage.

## Deploy

Upload `index.html`, `styles.css`, `app.js`, `programme-export.js`, and the entire `assets/` folder to any static host. Keep their relative paths unchanged. A subdirectory such as `/roots/` is supported.

The live demo is hosted at https://r1cave.com/roots/ on shared hosting. Server-level HTTPS redirection is managed by the host; cPanel configuration is not part of this repository.

## Three-minute demo journey

1. **0:00–0:30 — The problem and offer.** Show the opening promise: give employees a home and a reason to stay in Abu Dhabi.
2. **0:30–1:30 — Configure a programme.** Change cohort size, home price, term, and the current cash package. Show upfront funding, average annual cost, and the budget gap.
3. **1:30–2:15 — Make it concrete.** Open the programme preview and show the terms that must be agreed. Demonstrate the printable proposal.
4. **2:15–3:00 — Prepare approval.** Request a pilot, save example company details, and download the XLSX workbook for management review.

## Calculator model

One home is assumed per participating employee. Loan principal equals home price less the employer's initial contribution. Monthly loan payments use a fixed illustrative annual rate, with the loan term equal to the programme term. Zero-interest and fully cash-funded purchases are supported.

Upfront funding includes the initial contribution and purchase costs. Ongoing annual cash payments include loan payments and running costs. Total programme cash cost adds upfront funding, ongoing payments over the term, and transfer costs at completion. Average annual cash cost divides that total by programme years. The annual budget gap compares the average with the annual housing allowance plus annual cash LTI for the cohort.

The average already includes upfront and final transfer costs; do not add upfront funding to the average as though it were another annual payment. No retained employer property value is credited after successful transfer to employees. Property appreciation, early exits, taxes, subsidies, inflation, and lender eligibility are not modelled. Defaults are editable illustrations, not market quotes.

## OpenAI tooling used

The concept, English copy, UI, client-side implementation, spreadsheet workflow, and debugging were developed collaboratively with OpenAI Codex. OpenAI image generation produced the original illustrative residence image. The XLSX layout and formulas were authored with OpenAI's artifact-tool and packaged for client-side export.

The app also includes optional, feature-detected browser WebMCP tool registration for reading and configuring the visible calculator. It is not required for the user journey and was unavailable in the test browser. There are no live OpenAI model API calls in the deployed prototype; the financial calculations run deterministically on the client.

## Data and privacy

The prototype uses a model and document outlines created for this concept. It does not claim a proprietary housing-market dataset or confirmed partner inventory.

Saving a request stores only the latest request under `roots.pilot-request.v1` in browser local storage. Requests are not sent to Roots, Hub71, OpenAI, banks, or developers. XLSX generation also runs locally. Data remains on that browser until deleted or browser storage is cleared. No analytics or tracking scripts are included.

## Prototype boundaries and next steps

Financing, property matching, title registration, employee vesting, early-exit protections, legal agreements, remote enquiry submission, and partner integrations are future work. Current documents are discussion outlines. The Contact US popup is a preview, not an active mail form. The proposal and calculator are planning tools, not financing offers or executable agreements.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and English copy |
| `styles.css` | Design, responsive layouts, and print styling |
| `app.js` | Calculator, programme previews, dialogs, and local requests |
| `programme-export.js` | Embedded workbook template and XLSX export logic |
| `assets/` | Bundled residence image, fonts, JSZip, and third-party licence notices |

The original residence image is an AI-generated illustration inspired by Abu Dhabi, not an available listing. Instrument Sans is bundled under the SIL Open Font License; see `assets/OFL-Instrument-Sans.txt`. JSZip is bundled locally; see `assets/LICENSE-JSZip.txt`.

## Validation and submission freeze

The submitted app was checked in headless Chromium at desktop and mobile widths from 320 to 1440 px, including calculator changes, invalid inputs, zero-interest and cash-purchase scenarios, request save/export/recovery/deletion, Contact US, and print output. XLSX formulas were checked against the calculator and recalculated after changing inputs. PDF margins were checked on single- and multi-page output.

At final submission, provide the GitHub repository URL and the full SHA of the final commit, together with the registered track and live demo URL. Once submitted, freeze this code and the corresponding demo. Do not amend, replace, or backdate the final commit.

Made for the Hub71 + OpenAI Hackathon. Thank you for the opportunity and support.
