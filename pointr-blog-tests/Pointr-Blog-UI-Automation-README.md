# Pointr Blog UI Automation (Playwright + TypeScript + Docker + Allure)

**Scope:** End-to-end UI tests that (R1) verify the blog can load all articles across pagination and (R2) compute the **top 5 most frequent words** from the **latest 3 articles**, saving results to a `.txt`.
**Language:** English-only (code, logs, README).
**Counting mode:** **RAW** — no stopwords, no filters, numbers included.
**Browsers:** Chromium + Firefox (≥2 as required).

---

## 1) Objectives & Acceptance Criteria

- **Target URL:** `https://www.pointr.tech/blog`
- **R1 – Articles loaded across pagination**
  - Traverse the blog list and follow pagination (if present).
  - Aggregate unique article links that match `/blog/<slug>` (excluding `/blog/page/*`).
  - **Acceptance:** unique article links **> 0** and at least one article opens successfully (`/blog/<slug>`).
- **R2 – Top 5 words from the latest 3 articles**
  - Take the first **3** links from the first list page (assumed newest first).
  - Open each article, extract readable text.
  - **RAW counting** of tokens (lower-cased; includes numbers).
  - Sort desc by frequency, take **top 5**.
  - Save as `artifacts/top-words-latest-3.txt` in `word,count` format.
- **Reporting:** Generate Allure HTML after the run.

---

## 2) Tech Stack & Key Choices

- **Playwright + TypeScript**: reliable, cross-browser UI automation with first-class assertions.
- **Page Object Model (POM)**: selectors and flows are isolated for maintainability.
- **Allure**: clean, navigable HTML reports with attachments.
- **Docker**: reproducible environment (browsers + Java JRE for Allure CLI baked in).

---

## 3) Project Folder Structure

```
pointr-blog-tests/
├─ package.json                 # scripts (test, allure), dev deps
├─ tsconfig.json                # TypeScript config
├─ playwright.config.ts         # Playwright projects, reporter (Allure), baseURL
├─ Dockerfile                   # image with Playwright + Java (for Allure)
├─ docker-compose.yml           # one-shot: run tests + generate Allure HTML
├─ .gitignore                   # node_modules, reports, temp artifacts
├─ src/
│  ├─ specs/
│  │  ├─ articles-load.spec.ts  # R1: pagination traversal; sanity open of an article
│  │  └─ top-words.spec.ts      # R2: RAW counting, save to .txt, attach to Allure
│  ├─ pages/
│  │  ├─ BlogListPage.ts        # list page: goto, consent handling, link collection, pagination
│  │  └─ BlogArticlePage.ts     # article page: goto, extractReadableText (<article>/<main>/body)
│  ├─ utils/
│  │  ├─ text.ts                # tokenize(), countTopWordsAll() — RAW mode
│  │  └─ file.ts                # writeTextFile helper (ensures folder exists)
│  └─ data/
│     └─ stopwords.en.txt       # not used in RAW mode (kept for future filtered mode)
├─ artifacts/                   # output (top-words-latest-3.txt)
└─ README.md                    # this document
```

---

## 4) Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (bundled with Node)
- **Java Runtime** (for Allure CLI) — *skip if using Docker*
- **Docker** (optional, for fully containerized runs)

---

## 5) Local Setup

```bash
# 1) Install dependencies
npm ci

# 2) Install Playwright browsers (one-time)
npx playwright install
```

---

## 6) Running Tests

```bash
# All browser projects (Chromium + Firefox)
npm test

# Only Chromium
npx playwright test --project=chromium

# Only Firefox
npx playwright test --project=firefox

# Headed mode (for debugging)
npx playwright test --project=chromium --headed
```

---

## 7) Allure Reporting

```bash
# Generate HTML report from allure-results/
npm run report:allure

# Serve report locally (temporary HTTP server)
npm run report:allure:serve
```

- Raw results: `allure-results/`  
- HTML report: `allure-report/`

---

## 8) Docker Usage

```bash
# Build + run tests + generate Allure HTML
docker compose up --build --abort-on-container-exit

# Artifacts on host:
# - Allure HTML: ./allure-report
# - Text output: ./artifacts/top-words-latest-3.txt
```

**Image contents**
- Base: `mcr.microsoft.com/playwright:v1.46.0-jammy` (Chromium/Firefox preinstalled).
- Adds `openjdk-17-jre` to run `allure-commandline` inside the container.

---

## 9) Output Artifact

- Path: `artifacts/top-words-latest-3.txt`  
- Format (CSV-like):
  ```
  word,count
  navigation,14
  mapping,12
  indoor,11
  ...
  ```
- The test asserts the file has **≥ 6 lines** (header + 5 entries).

---

## 10) Implementation Details

### 10.1 Page Objects

**BlogListPage**
- `goto()`: opens `/blog`, tries to dismiss consent in **English** (`Accept/Agree/Allow`).
- `collectArticleLinksOnCurrentPage()`: collects absolute URLs where:
  - path starts with `/blog/`,
  - path does **not** start with `/blog/page/`,
  - and has at least 2 segments after `/blog/` (looks like `/blog/<slug>`).
- `hasNextPaginationLink()` / `clickNextPaginationIfExists()`:
  - supports `a[rel="next"]` and typical “Next/Older” links.

**BlogArticlePage**
- `goto(absHref)`: opens the given article URL.
- `extractReadableText()`: tries `<article>`, else `<main>`, else `body` text.

### 10.2 Tests

**R1 – `articles-load.spec.ts`**
1. Open blog list (consent dismissed if present).
2. Collect article links from page #1.
3. While a “next” link is visible: click it, wait for `domcontentloaded`, re-collect and de-duplicate.
4. Assert total unique links **> 0**.
5. Open one collected article and assert URL matches `/blog/`.

**R2 – `top-words.spec.ts` (RAW)**
1. On the first list page, take the first **3** article links (assumed newest first).
2. For each link: open article, extract text, push to an array.
3. Run **RAW** frequency count (no stopwords, numbers included).
4. Save top 5 tokens to `artifacts/top-words-latest-3.txt` (`word,count`).
5. Attach the file to Allure; assert it has **≥ 6 lines**.

---

## 11) Text Processing (RAW Mode)

- **Tokenizer** (English): keeps `[a–z 0–9 ' ’]`, lowercases input, strips other punctuation, splits on whitespace.  
  Examples:  
  - `“AI-driven, 2025's mapping”` → `["ai", "driven", "2025's", "mapping"]`  
  - `"Indoor Navigation (Beta)!"` → `["indoor", "navigation", "beta"]`
- **Counting**
  - Counts **every token** (including *the, and, of* etc.) and numeric tokens.
  - Sorted by frequency desc; take top 5.
- **Adjustable knobs (edit in spec)**
  - `minLen` (default: `1`) — raise to `2` or `3` to drop very short tokens.
  - `includeNumbers` (default: `true`) — set to `false` to skip pure numbers.

---

## 12) Configuration & Tunables

- **Base URL:** `playwright.config.ts` → `baseURL: "https://www.pointr.tech"`.
- **Timeouts:** `actionTimeout: 10_000`, `navigationTimeout: 30_000`; adjust as needed.
- **Browsers:** `projects` enable `chromium` and `firefox`. Add `webkit` if needed later.
- **Artifacts:** traces on first retry; screenshots/videos on failure; `.txt` attached to Allure.

---

## 13) Resilience & Troubleshooting

- **Consent banners:** Update `acceptCookiesIfPresent()` if different DOM/text is used.
- **Pagination types:** Supports `rel="next"` and “Next/Older”; if changed to infinite scroll, implement a scroll loop with convergence (stop when count no longer increases).
- **Selectors:** Favor URL-pattern checks and role/text fallbacks over brittle CSS chains.
- **Slow networks:** `waitUntil: "domcontentloaded"` is used; increase timeouts if needed.
- **Very short articles:** RAW mode may surface generic tokens — this is **intentional** for this requirement.

---

## 14) Quality & Conventions

- **Formatting:** `npm run format` (Prettier).
- **Readability:** Use `test.step(...)` for logical grouping in Allure.
- **Isolation:** Each test runs in its own context; avoid cross-test state.

---

## 15) Extensions (Optional)

- Add **WebKit** as a third browser project.
- Add a **Filtered** mode with stopwords (keep RAW as default).
- Parse dates to pick **true latest 3** instead of trusting list order.

---

### Quickstart

```bash
# Local
npm ci
npx playwright install
npm test
npm run report:allure
# or: npm run report:allure:serve

# Docker
docker compose up --build --abort-on-container-exit
```

**Outputs**
- Text: `artifacts/top-words-latest-3.txt`
- Report: `allure-report/`
