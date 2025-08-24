# Pointr API Tests (Playwright + Allure + Docker)

## Installation (local)
```bash
npm i
npx playwright install --with-deps
cp env.example .env # edit if needed
export PLAYWRIGHT_BASE_URL=http://localhost:8080
npm run test:api
npm run report:allure
npm run report:open
```

## With Docker
# If your API service runs as "api" in compose:
```bash
docker compose up --build --abort-on-container-exit
```

# Reports:
# Generated in ./allure-report folder

## Notes

Each test creates its own data and validates through IDs.

If there are endpoint and schema differences, update the routes/data fields in tests.

## Quality Criteria
- All tests must be **independent** and **repeatable**.
- Allure outputs should produce `allure-results/` → `allure-report/`.
- Should run in Docker with single command: `docker compose up --build`.

## Delivery
- Create the above file structure exactly.
- Tests should be **passing** (works if mock exists).
- README should have clear execution steps.
