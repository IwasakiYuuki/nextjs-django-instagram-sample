all: up

build:
	(cd frontend && docker build . --network=host -t instagram-sample-frontend)
	(cd backend && docker build . --network=host --platform=linux/amd64 -t instagram-sample-backend)

up: build
	docker compose up -d

down:
	docker compose down
