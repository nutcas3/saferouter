.PHONY: help setup build up down test test-coverage clean deploy logs health

help:
	@echo "SafeRoute - Zero-Knowledge Privacy Proxy"
	@echo ""
	@echo "Available commands:"
	@echo "  make setup          - Initial project setup"
	@echo "  make build          - Build all services"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make test           - Run all tests"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo "  make health         - Check service health"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make deploy         - Deploy to Kubernetes"
	@echo "  make logs           - View service logs"

setup:
	@echo "Setting up SafeRoute..."
	cp .env.example .env
	@echo "Created .env file (please configure)"
	mkdir -p models logs
	@echo "Created directories"
	@echo "Please update .env with your configuration"

build:
	@echo "Building all services..."
	docker-compose build

up:
	@echo "Starting SafeRoute..."
	docker-compose up -d
	@echo "Services started"
	@echo "  - Proxy: http://localhost:8080"
	@echo "  - Dashboard: http://localhost:3000"
	@echo "  - Prometheus: http://localhost:9090"
	@echo "  - Grafana: http://localhost:3001"

down:
	@echo "Stopping SafeRoute..."
	docker-compose down

test:
	@echo "Running tests..."
	@echo "→ CLI tests..."
	cd cli && cargo test
	@echo "→ Proxy tests..."
	cd services/proxy && go test ./...
	@echo "→ NER Service tests..."
	cd services/ner-service && uv run pytest
	@echo "→ Vault tests..."
	cd services/vault && cargo test
	@echo "✓ All tests passed"

test-coverage:
	@echo "Running tests with coverage..."
	cd cli && cargo test
	cd services/proxy && go test -cover ./...
	cd services/ner-service && uv run pytest --cov=. --cov-report=html
	cd services/vault && cargo test

clean:
	@echo "Cleaning..."
	docker-compose down -v
	rm -rf logs/*.log

deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f infrastructure/kubernetes/

logs:
	docker-compose logs -f

health:
	@echo "Checking service health..."
	@curl -s http://localhost:8080/health | jq . || echo "Proxy: ✗"
	@curl -s http://localhost:8081/health | jq . || echo "NER Service: ✗"
	@curl -s http://localhost:8082/health | jq . || echo "Vault: ✗"
	@curl -s http://localhost:3000/health || echo "Dashboard: ✗"
