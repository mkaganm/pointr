# Pointr Mock API - Project Structure

A Go-based REST API mock service for Site/Building/Level management using Docker and Fiber framework.

## 🏗️ Architecture Overview

```
pointr-mock/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── domain/
│   │   └── models.go            # Domain models (Site, Building, Level)
│   ├── httpapi/
│   │   ├── handlers.go          # HTTP handlers (main handler struct)
│   │   ├── building_handlers.go # Building-specific handlers
│   │   ├── level_handlers.go    # Level-specific handlers
│   │   ├── site_handlers.go     # Site-specific handlers
│   │   └── routes.go            # Route definitions
│   ├── seed/
│   │   └── seed.go              # Initial data seeding
│   └── store/
│       ├── store.go             # Store interface definition
│       ├── memory.go            # In-memory store implementation
│       ├── building_store.go    # Building store operations
│       ├── level_store.go       # Level store operations
│       └── site_store.go        # Site store operations
├── Dockerfile                   # Multi-stage Docker build
├── Makefile                     # Docker-based build and run commands
└── go.mod                       # Go module dependencies
```

## 🎯 Key Components

### **Domain Layer** (`internal/domain/`)
- **models.go**: Core business entities (Site, Building, Level)
- Defines data structures and validation rules

### **Store Layer** (`internal/store/`)
- **store.go**: Interface defining data access contracts
- **memory.go**: In-memory implementation for rapid development
- **{entity}_store.go**: Entity-specific CRUD operations
- Enables easy switching between storage backends (Memory → Redis/PostgreSQL)

### **HTTP API Layer** (`internal/httpapi/`)
- **handlers.go**: Main handler struct and common utilities
- **{entity}_handlers.go**: REST endpoint implementations
- **routes.go**: Fiber route registration and middleware setup
- Clean separation of concerns with dedicated handlers per entity

### **Application Entry** (`cmd/server/`)
- **main.go**: Application bootstrap, dependency injection, and server startup
- Configures Fiber app, initializes stores, loads seed data

### **Data Seeding** (`internal/seed/`)
- **seed.go**: Pre-populates database with test data
- Ensures consistent starting state for development and testing

## 🔄 Data Flow

```
HTTP Request → Routes → Handlers → Store Interface → Memory Store → Response
```

## 🐳 Docker Integration

- **Multi-stage build**: Optimized production image
- **Port 8081**: Default application port
- **Makefile**: Simplified Docker operations
- **Hot reload**: Development mode with automatic restarts

## 🚀 Quick Start

```bash
# Build and run
make build
make run

# Test API
make test-api

# Development mode
make dev
```

## 📋 API Endpoints

- **Sites**: `GET/POST /sites`, `GET/DELETE /sites/:id`
- **Buildings**: `GET/POST /buildings`, `GET/DELETE /buildings/:id`
- **Levels**: `GET/POST /levels`, `GET/DELETE /levels/:id`
- **Health**: `GET /health`

## 🧪 API Examples

### Quick Test Commands
```bash
# Basic API status
curl -s http://localhost:8081/

# Get all sites
curl -s http://localhost:8081/sites

# Get buildings for specific site
curl -s "http://localhost:8081/buildings?site_id=site-hospital-1"

# Get levels for specific building
curl -s "http://localhost:8081/levels?building_id=bldg-main-1"
```

### Complete Endpoint List
- `GET /` - API status and statistics
- `GET /health` - Health check
- `GET /sites` - List all sites
- `POST /sites` - Create new site
- `GET /sites/:id` - Get site details
- `DELETE /sites/:id` - Delete site
- `GET /buildings` - List all buildings
- `POST /buildings` - Create new building
- `GET /buildings/:id` - Get building details
- `DELETE /buildings/:id` - Delete building
- `GET /levels` - List all levels
- `POST /levels` - Create new level (single or batch)
- `GET /levels/:id` - Get level details

### Required Endpoints (Use Cases)
- `POST /sites`, `GET /sites/:id`, `DELETE /sites/:id`
- `POST /buildings`, `GET /buildings/:id`, `DELETE /buildings/:id`
- `POST /levels` (single or `{items:[...]}`), `GET /levels/:id`

## 🎨 Design Patterns

- **Clean Architecture**: Separation of concerns with clear layers
- **Interface Segregation**: Store interface enables multiple implementations
- **Dependency Injection**: Handlers receive store dependencies
- **Repository Pattern**: Store layer abstracts data access
- **RESTful Design**: Standard HTTP methods and status codes
