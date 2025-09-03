# ==== Config ====
FRONTEND_IMAGE=pokehub-frontend
BACKEND_IMAGE=pokehub-backend
FRONTEND_DOCKERFILE=Dockerfile.frontend
BACKEND_DOCKERFILE=Dockerfile.backend
KIND_CLUSTER_NAME=software-studio
HELM_RELEASE=pokehub
HELM_CHART=./pokehub-helm

# ==== Targets ====

# Build frontend and backend images
build: build-frontend build-backend

build-frontend:
	docker buildx build --platform linux/amd64 -t $(FRONTEND_IMAGE):latest -f $(FRONTEND_DOCKERFILE) .

build-backend:
	docker buildx build --platform linux/amd64 -t $(BACKEND_IMAGE):latest -f $(BACKEND_DOCKERFILE) .

# Load images into kind cluster
kind-load:
	kind load docker-image $(FRONTEND_IMAGE):latest --name $(KIND_CLUSTER_NAME)
	kind load docker-image $(BACKEND_IMAGE):latest --name $(KIND_CLUSTER_NAME)

# Install or upgrade Helm release
deploy:
	helm upgrade --install $(HELM_RELEASE) $(HELM_CHART)

# Port-forward frontend to localhost:3000
port-forward:
	kubectl port-forward svc/$(HELM_RELEASE)-frontend 3000:3000

# Clean up Helm release and dangling Docker images
clean:
	helm uninstall $(HELM_RELEASE) || true
	docker image prune -f

# Build, load to kind, and deploy — all in one
all: build kind-load deploy

.PHONY: build kind-load deploy port-forward clean all
