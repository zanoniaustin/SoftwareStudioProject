workspace "PokéHub" "C4 model for a Pokémon card identifier with Next.js frontend and FastAPI backend, deployed on GKE with Gateway API." {

    model {

        // People
        user  = person "End User" "Uploads a card photo to identify and manage personal collection."
        admin = person "Admin"    "Curates the dataset and monitors the system."

        // Software System
        system = softwareSystem "PokéHub" "Identifies Pokémon cards from images and shows card details." {

            // Containers
            frontend = container "Frontend (Web UI)" "Node.js (Next.js)" "Uploads images, renders UI, calls backend API."
            backend  = container "Backend API + Model" "Python (FastAPI)" "Receives uploads, runs CNN model against a local dataset, returns top matches and details."

            // Relationships
            user  -> frontend "Browse/Upload, view results" "HTTPS"
            admin -> frontend "Manage system & content"     "HTTPS"
            frontend -> backend "REST/JSON" "HTTPS"
        }

        // Deployment: Production
        deploymentEnvironment "Production" {
            gcp = deploymentNode "Google Cloud Project" "GCP project hosting GKE and load balancer" "GCP" {
                dns = infrastructureNode "Squarespace DNS" "DNS for just-incredible.dev (records: pokehub.just-incredible.dev, api.pokehub.just-incredible.dev)" "DNS"
                gclb = infrastructureNode "Cloud Load Balancer" "External HTTP(S) LB terminating TLS" "GCLB"
                dockerhub = infrastructureNode "Docker Hub Registry" "Container images for frontend and backend" "Registry"

                gke = deploymentNode "GKE Cluster" "Managed Kubernetes" "GKE" {
                    ns_app = deploymentNode "Namespace: app" "Application namespace" "Kubernetes Namespace" {
                        gateway     = infrastructureNode "Gateway API" "Gateway + Controller (L7 entry)" "Gateway API"
                        route_front = infrastructureNode "HTTPRoute: pokehub.just-incredible.dev" "Routes host to Frontend Service" "Gateway API"
                        route_api   = infrastructureNode "HTTPRoute: api.pokehub.just-incredible.dev" "Routes host to Backend Service" "Gateway API"
                        svc_front   = infrastructureNode "Service: frontend" "ClusterIP for frontend pods" "ClusterIP"
                        svc_back    = infrastructureNode "Service: backend"  "ClusterIP for backend pods"  "ClusterIP"

                        dep_front = deploymentNode "Deployment: frontend" "Replicas 1-2; image: docker.io/<your-user>/pokehub-frontend:tag" "K8s Deployment" {
                            containerInstance frontend
                        }
                        dep_back = deploymentNode "Deployment: backend" "Replicas 1-2; image: docker.io/<your-user>/pokehub-backend:tag" "K8s Deployment" {
                            containerInstance backend
                        }
                    }
                }

                // Relationships
                dns -> gclb "Resolves hostnames"
                gclb -> gateway "HTTPS"
                gateway -> route_front "Host: pokehub.just-incredible.dev"
                gateway -> route_api   "Host: api.pokehub.just-incredible.dev"
                route_front -> svc_front "HTTP"
                route_api   -> svc_back  "HTTP"
                svc_front -> dep_front "Forwards to pods"
                svc_back  -> dep_back  "Forwards to pods"
                dockerhub -> dep_front "Pods pull image"
                dockerhub -> dep_back  "Pods pull image"
            }
        }
    }

    views {

        systemContext system "Context" {
            include *
            autoLayout lr
        }

        container system "Containers" {
            include *
            autoLayout lr
        }

        dynamic system "Identify-Card-Flow" {
            user     -> frontend "Upload photo"
            frontend -> backend  "POST /identify"
            backend  -> frontend "JSON results"
            frontend -> user     "Display results"
            autoLayout tb
        }

        deployment system "Production" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                background #9b191f 
                shape Person 
                color #ffffff 
            }
            element "Software System" { 
                background #ba1e25 
                color #ffffff 
            }
            element "Container" { 
                background #d9232b
                color #ffffff 
            }
            element "Infrastructure Node"  { 
                background #444444
                color #ffffff
                shape RoundedBox
                opacity 70 
            }
            element "Kubernetes Namespace" { 
                background #2d5a27
                color #ffffff 
            }
            element "K8s Deployment" { 
                background #356a9a 
                color #ffffff 
            }
            element "ClusterIP" { 
                background #5b8bb2 
                color #ffffff 
            }
            element "Gateway API" { 
                background #5f4bb6
                color #ffffff 
            }
        }
    }
}
