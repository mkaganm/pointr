# Pointr Mock API (Go + Fiber) — Docker Edition

Bu repo **Site / Building / Level** için mock REST API içerir. Tamamen Docker üzerinden çalışır, in-memory veri saklama kullanır ve başlangıçta seed verisi yüklenir.

## 🚀 Gereksinimler

- **Docker** (v20.10+)
- **Make** (Windows için: Git Bash, WSL veya Chocolatey)
- **curl** (test için)

## 📦 Özellikler

- ✅ **Docker First** - Sadece Docker ile çalışır
- ✅ **Hot Reload** - Geliştirme modunda otomatik yeniden yükleme
- ✅ **Modüler Yapı** - Temiz kod organizasyonu
- ✅ **REST API** - Site/Building/Level CRUD operasyonları
- ✅ **In-Memory Storage** - Hızlı ve basit veri saklama
- ✅ **Seed Data** - Hazır test verileri

## Project Tree
```
cmd/server/main.go          # app entry
internal/domain/models.go   # domain modelleri
internal/store/store.go     # store interface
internal/store/memory.go    # memory implementasyonu
internal/httpapi/handlers.go# Fiber handler'ları
internal/httpapi/routes.go  # route tanımları
internal/seed/seed.go       # başlangıç verileri
Dockerfile
```

## 🐳 Docker ile Çalıştırma

### Hızlı Başlangıç
```bash
# Docker image'ını build et
make build

# Container'ı çalıştır
make run

# API'yi test et
make test-api
```

### Geliştirme Modu (Hot Reload)
```bash
# Hot reload ile geliştirme
make dev
```

### Farklı Port ile Çalıştırma
```bash
# Belirli port ile çalıştırma
make run-port PORT=8081
```

### Container Yönetimi
```bash
# Container'ı durdur
make stop

# Log'ları görüntüle
make logs

# Container shell'ine eriş
make shell

# Temizlik (container ve image'ı sil)
make clean
```

### Yardımcı Komutlar
```bash
# Tüm komutları görme
make help

# API sağlık kontrolü
make health

# Hızlı API test
make test-api
```

## 🧪 Hızlı Test

### Docker ile Test
```bash
# Container çalıştıktan sonra
make test-api

# Manuel test
curl -s http://localhost:8080/
curl -s http://localhost:8080/sites
curl -s "http://localhost:8080/buildings?site_id=site-hospital-1"
curl -s "http://localhost:8080/levels?building_id=bldg-main-1"
```

### API Endpoint'leri
- `GET /` - API durumu ve sayılar
- `GET /health` - Sağlık kontrolü
- `GET /sites` - Tüm siteler
- `POST /sites` - Yeni site oluştur
- `GET /sites/:id` - Site detayı
- `DELETE /sites/:id` - Site sil
- `GET /buildings` - Tüm binalar
- `POST /buildings` - Yeni bina oluştur
- `GET /buildings/:id` - Bina detayı
- `DELETE /buildings/:id` - Bina sil
- `GET /levels` - Tüm katlar
- `POST /levels` - Yeni kat oluştur (tekli/toplı)
- `GET /levels/:id` - Kat detayı

## Zorunlu uçlar (case)
- `POST /sites`, `GET /sites/:id`, `DELETE /sites/:id`
- `POST /buildings`, `GET /buildings/:id`, `DELETE /buildings/:id`
- `POST /levels` (tek veya `{items:[...]}`), `GET /levels/:id`

## Notlar
- ID gönderilmezse `uuid` atanır; seed verileri sabit ID kullanır (testler için stabil). 
- Store interface sayesinde Memory → Redis/PG geçişi kolaydır.
