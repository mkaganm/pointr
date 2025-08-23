# Pointr API Tests Makefile (Windows PowerShell Compatible)
# Kullanım: make [target]

.PHONY: help install setup test run clean

# Default target
help: ## Bu yardım mesajını göster
	@echo "Pointr API Tests - Kullanılabilir Komutlar:"
	@echo ""
	@echo "📦 Kurulum Komutları:"
	@echo "  install     - Bağımlılıkları yükle"
	@echo "  setup       - Playwright ve gerekli araçları kur"
	@echo ""
	@echo "🧪 Test Komutları:"
	@echo "  test        - Sadece testleri çalıştır"
	@echo "  run         - Test + Rapor + Serve (tek komutla her şeyi yap)"
	@echo ""
	@echo "🧹 Temizlik Komutları:"
	@echo "  clean       - Test sonuçlarını ve raporları temizle"

# Kurulum komutları
install: ## Bağımlılıkları yükle
	@echo "📦 Bağımlılıklar yükleniyor..."
	npm install
	@echo "✅ Bağımlılıklar yüklendi"

setup: ## Playwright ve gerekli araçları kur
	@echo "🔧 Playwright kuruluyor..."
	npx playwright install --with-deps
	@echo "✅ Playwright kuruldu"

# Test komutları
test: ## Sadece testleri çalıştır
	@echo "🧪 Testler çalıştırılıyor..."
	@if not defined PLAYWRIGHT_BASE_URL ( \
		echo "⚠️  PLAYWRIGHT_BASE_URL ayarlanmamış, varsayılan: http://localhost:8081" && \
		set PLAYWRIGHT_BASE_URL=http://localhost:8081 \
	)
	npm run test:api
	@echo "✅ Testler tamamlandı"

# Ana komut - Test + Rapor + Serve
run: ## Test + Rapor + Serve (tek komutla her şeyi yap)
	@echo "🚀 Test + Rapor + Serve başlatılıyor..."
	@echo "⚠️  Mock API'nin çalıştığından emin olun (http://localhost:8081)"
	@echo ""
	@echo "📋 Adımlar:"
	@echo "1. Testler çalıştırılıyor..."
	npm run test:api
	@echo ""
	@echo "2. Allure raporu oluşturuluyor..."
	npm run report:allure
	@echo ""
	@echo "3. Rapor serve modunda açılıyor..."
	@echo "✅ Rapor http://localhost:8080 adresinde açılıyor..."
	npx allure serve ./allure-results
	@echo "✅ Tüm işlemler tamamlandı!"

# Temizlik komutları
clean: ## Test sonuçlarını ve raporları temizle
	@echo "🧹 Temizlik yapılıyor..."
	@if exist "allure-results" rmdir /s /q allure-results
	@if exist "allure-report" rmdir /s /q allure-report
	@if exist "playwright-report" rmdir /s /q playwright-report
	@if exist "test-results" rmdir /s /q test-results
	@echo "✅ Temizlik tamamlandı"
