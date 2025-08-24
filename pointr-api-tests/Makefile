# Pointr API Tests Makefile
.PHONY: help install setup test run docker-test-serve clean clean-allure 

help: ## Show help
	@echo "Available commands:"
	@echo "  install           - Install dependencies"
	@echo "  setup             - Install Playwright"
	@echo "  test              - Run tests"
	@echo "  run               - Test + Report + Serve"
	@echo "  docker-test-serve - Docker tests + Generate report + Python server on 8090"
	@echo "  clean             - Clean all reports"
	@echo "  clean-allure      - Clean Allure reports"

install: ## Install dependencies
	npm install

setup: ## Install Playwright
	npx playwright install --with-deps

test: ## Run tests
	@if not defined PLAYWRIGHT_BASE_URL set PLAYWRIGHT_BASE_URL=http://localhost:8081
	npm run test:api

run: ## Test + Report + Serve
	@echo "Starting tests..."
	npm run test:api
	@echo "Generating report..."
	npm run report:allure
	@echo "Opening report..."
	npx allure serve ./allure-results

docker-test-serve: ## Docker tests + Generate report + Python server on 8090
	@echo "🚀 Starting Docker tests..."
	docker compose up --build tests
	@echo "📊 Generating Allure report..."
	npx allure generate allure-results --clean -o allure-report
	@echo "🌐 Starting Python server on port 8090..."
	@echo "📱 Open http://localhost:8090 in your browser"
	cd allure-report && python -m http.server 8090

clean: ## Clean all reports
	@if exist "allure-results" rmdir /s /q allure-results
	@if exist "allure-report" rmdir /s /q allure-report
	@if exist "playwright-report" rmdir /s /q playwright-report
	@if exist "test-results" rmdir /s /q test-results

clean-allure: ## Clean Allure reports
	@if exist "allure-results" rmdir /s /q allure-results
	@if exist "allure-report" rmdir /s /q allure-report
