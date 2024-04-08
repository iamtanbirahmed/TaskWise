run:
	docker compose up -d
stop:
	docker compose down
run-db:
	docker compose up -d mongodb mongo-express

run-backend:
	docker compose up -d mongodb mongo-express backend-service;
install:
	cd ./taskwise-crud-service && npm install && cd ../taskwise-frontend-service && npm install
test:
	cd ./taskwise-crud-service && npm install && npm run test && cd ../taskwise-frontend-service && npm install && npm run test;
	
test-be:
	cd ./taskwise-crud-service && npm run test;
test-fe:
	cd ./taskwise-frontend-service && npm run test;
test-e2e:
	cd ./taskwise-crud-service && npm run test:e2e;
clean:
	docker system prune --all