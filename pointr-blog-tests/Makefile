.PHONY: help build run test report clean logs stop

# Default target
help:
	@echo "Available commands:"
	@echo "  make build    - Build Docker images"
	@echo "  make run      - Run tests"
	@echo "  make test     - Run only tests"
	@echo "  make report   - Show Playwright report"
	@echo "  make logs     - Show logs"
	@echo "  make stop     - Stop all services"
	@echo "  make clean    - Clean up containers and volumes"
	@echo "  make rebuild  - Rebuild and run"

# Build Docker images
build:
	docker-compose build

# Run tests
run:
	docker-compose up --build
	@echo "Tests completed. Opening report..."
	@timeout /t 3 /nobreak > nul 2>&1 || ping -n 3 127.0.0.1 > nul 2>&1 || true
	@if exist "playwright-report\index.html" ( \
		echo "Opening Playwright report..."; \
		npx playwright show-report \
	) else ( \
		echo "Report not found. Please check if tests completed successfully."; \
		echo "You can manually open the report with: make report" \
	)

# Run only tests
test:
	docker-compose run --rm playwright-tests

# Show Playwright report
report:
	@if exist "playwright-report\index.html" ( \
		npx playwright show-report \
	) else ( \
		echo "Report not found. Please run tests first with: make run" \
	)

# Show logs
logs:
	docker-compose logs -f

# Stop all services
stop:
	docker-compose down

# Clean up containers and volumes
clean:
	docker-compose down -v
	docker system prune -f

# Rebuild and run
rebuild: clean build run
