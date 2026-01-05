.PHONY: help setup build up down test clean deploy logs

help:
	@echo "SafeRoute - Zero-Knowledge Privacy Proxy"
	@echo ""
	@echo "Available commands:"
	@echo "  make setup    - Initial project setup"
	@echo "  make build    - Build all services"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make test     - Run all tests"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make deploy   - Deploy to Kubernetes"
	@echo "  make logs     - View service logs"

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
	cd services/proxy && go test ./...
	cd services/ner-service && python -m pytest
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
