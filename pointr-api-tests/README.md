# Pointr API Tests (Playwright + Allure + Docker)

## Kurulum (lokal)
```bash
npm i
npx playwright install --with-deps
cp env.example .env # gerekiyorsa düzenle
export PLAYWRIGHT_BASE_URL=http://localhost:8080
npm run test:api
npm run report:allure
npm run report:open
```

## Docker ile
# API servisiniz compose içinde "api" adıyla koşuyorsa:
```bash
docker compose up --build --abort-on-container-exit
```

# Raporlar:
# ./allure-report klasöründe oluşur

## Notlar

Her test kendi verisini oluşturur ve id'ler üzerinden doğrular.

Endpoint ve şema farkı varsa testlerdeki rotaları/veri alanlarını güncelleyin.

## Kalite Kriterleri
- Tüm testler **bağımsız** ve **tekrarlanabilir** olmalı.
- Allure çıktıları `allure-results/` → `allure-report/` üretmeli.
- Tek komutla Docker içinde koşturulmalı: `docker compose up --build`.

## Teslim
- Yukarıdaki dosya yapısını birebir oluştur.
- Testler **geçer** durumda olmalı (mock varsa çalışır).
- README'de çalıştırma adımları net olmalı.
