.PHONY: run stop run-db run-backend install test test-be test-fe test-e2e clean

run:
	@echo "Starting containers..."
	@docker compose up -d

stop:
	@echo "Stopping containers..."
	@docker compose down

run-db:
	@echo "Starting MongoDB and Mongo Express containers..."
	@docker compose up -d mongodb mongo-express

run-backend:
	@echo "Starting backend service containers..."
	@docker compose up -d mongodb mongo-express backend-service

install:
	@echo "Installing dependencies..."
	@cd ./taskwise-crud-service && npm install && cd ../taskwise-frontend-service && npm install

test:
	@echo "Running all tests..."
	@cd ./taskwise-crud-service && npm install && npm run test && cd ../taskwise-frontend-service && npm install && npm run test

test-be:
	@echo "Running backend tests..."
	@cd ./taskwise-crud-service && npm install && npm run test

test-fe:
	@echo "Running frontend tests..."
	@cd ./taskwise-frontend-service && npm install && npm run test

test-e2e: run-db
	@echo "Running end-to-end tests..."
	@cd ./taskwise-crud-service && npm install && npm run test:e2e

clean:
	@echo "Cleaning up Docker system..."
	@docker system prune --all