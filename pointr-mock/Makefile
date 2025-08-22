# Pointr Mock API Makefile (Docker Only)

.PHONY: help build run dev clean docker-build docker-run docker-stop docker-logs docker-shell

# Default target
help: ## Show this help message
	@echo "Pointr Mock API - Docker Commands:"
	@echo ""
	@echo "build              - Build Docker image"
	@echo "run                - Run Docker container (port 8081)"
	@echo "run-port           - Run on specific port (usage: make run-port PORT=8081)"
	@echo "dev                - Run with hot reload (development mode)"
	@echo "stop               - Stop running container"
	@echo "logs               - Show container logs"
	@echo "shell              - Access container shell"
	@echo "clean              - Clean Docker images and containers"
	@echo "health             - Check API health"
	@echo "test-api           - Quick API test"

# Build Docker image
build: ## Build Docker image
	@echo "Building Docker image..."
	docker build -t pointr-mock .

# Run Docker container
run: ## Run Docker container on port 8081
	@echo "Running Docker container on port 8081..."
	docker run -d --name pointr-mock-api -p 8081:8081 pointr-mock

# Run on specific port
run-port: ## Run Docker container on specific port (usage: make run-port PORT=8081)
	@echo "Running Docker container on port $(PORT)..."
	docker run -d --name pointr-mock-api-$(PORT) -p $(PORT):8081 pointr-mock

# Run with hot reload (development)
dev: ## Run with hot reload using Docker
	@echo "Starting development server with hot reload..."
	docker run -it --rm --name pointr-mock-dev \
		-p 8081:8081 \
		-v $(PWD):/app \
		-w /app \
		golang:1.25-alpine \
		sh -c "go install github.com/air-verse/air@latest && air"

# Stop running container
stop: ## Stop running container
	@echo "Stopping container..."
	-docker stop pointr-mock-api
	-docker rm pointr-mock-api

# Show container logs
logs: ## Show container logs
	@echo "Showing container logs..."
	docker logs -f pointr-mock-api

# Access container shell
shell: ## Access container shell
	@echo "Accessing container shell..."
	docker exec -it pointr-mock-api /bin/sh

# Clean Docker artifacts
clean: ## Clean Docker images and containers
	@echo "Cleaning Docker artifacts..."
	-docker stop pointr-mock-api
	-docker rm pointr-mock-api
	-docker rmi pointr-mock

# API health check
health: ## Check API health
	@echo "Checking API health..."
	curl -s http://localhost:8081/health

# Quick API test
test-api: ## Quick API test
	@echo "Testing API endpoints..."
	@echo "Root endpoint:"
	curl -s http://localhost:8081/
	@echo ""
	@echo "Sites:"
	curl -s http://localhost:8081/sites
	@echo ""
	@echo "Buildings:"
	curl -s http://localhost:8081/buildings
