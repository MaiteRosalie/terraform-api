# items-api

A serverless REST API for managing items built on AWS, using Lambda, API Gateway, and DynamoDB. Infrastructure is managed with Terraform and the service is written in TypeScript.

## Repository Structure

```
.
├── services/
│   └── items-api/        # Lambda service (TypeScript)
├── terraform/            # AWS infrastructure (Terraform)
└── bruno/                # API collections for manual testing (Bruno)
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 3. Run tests

```bash
npm run test
```

### 4. Deploy

Initialize terraform, package the Lambda artifact and then apply the Terraform infrastructure changes:

```bash
npm run init
npm run update
```

## Services

| Service | Description | Docs |
|---------|-------------|------|
| `items-api` | CRUD API for items | [README](services/items-api/README.md) |

## Infrastructure

AWS infrastructure is defined in `terraform/`. See the [Terraform README](terraform/README.md) for full details.

| Resource | Description |
|----------|-------------|
| API Gateway (HTTP API v2) | Routes HTTP requests to Lambda |
| Lambda | Runs the items-api service |
| DynamoDB | Stores items |

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/items` | Create an item |
| `GET` | `/items/:id` | Get an item by ID |
| `PUT` | `/items/:id` | Replace an item |
| `PATCH` | `/items/:id` | Update an item |
| `DELETE` | `/items/:id` | Delete an item |

## Manual Testing

Bruno collections are available in `bruno/items-api/`. Open in [Bruno](https://www.usebruno.com/) and select the `dev` environment to run requests against the deployed API.
