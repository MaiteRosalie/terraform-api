# items-api

A serverless REST API for managing items, built with AWS Lambda, API Gateway (HTTP API), and DynamoDB. Written in TypeScript and bundled with esbuild.

## Architecture

```
API Gateway (HTTP API)
    └── Lambda (single handler with internal router)
            └── DynamoDB
```

The Lambda function uses a single entry point (`src/handlers/index.ts`) that routes requests internally based on HTTP method and path.

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Terraform](https://developer.hashicorp.com/terraform/install) (for deployment)
- [Docker](https://www.docker.com/) (for local development with SAM)

## Project Structure

```
services/items-api/
├── src/
│   ├── handlers/           # Lambda entry point and route handlers
│   ├── services/           # Business logic
│   ├── repositories/       # DynamoDB access layer
│   ├── infrastructure/     # DynamoDB client setup
│   ├── validators/         # Zod schemas
│   ├── types/              # Shared types
│   └── utils/              # Response helpers
├── esbuild.mjs             # Build config
├── template.yaml           # SAM template for local development
└── package.json
```

## Setup

```bash
npm install
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript and bundle to `dist/index.js` |
| `npm run dev` | Start local API with SAM on `http://localhost:3000` |
| `npm run test` | Run all unit and integration tests |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run check` | Run typecheck and lint |
| `npm run pack` | Build and zip for deployment |

## Local Development

Build the project first, then start the local API:

```bash
npm run build
npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/items` | Create an item |
| `GET` | `/items/:id` | Get an item by ID |
| `PUT` | `/items/:id` | Replace an item |
| `PATCH` | `/items/:id` | Update an item |
| `DELETE` | `/items/:id` | Delete an item |


## Tests

Tests are organised per layer, each in their own `unit-tests/` or `integration-tests/` folder alongside the source files.

```bash
npm test
```

- **Unit tests** — each layer tested in isolation with mocked dependencies
- **Integration tests** — full handler → service → repository chain with DynamoDB mocked at the SDK level

## Deployment

Infrastructure is managed with Terraform in the `terraform/` directory.

## API Testing with Bruno

Bruno collections are available in the `bruno/items-api/` directory. Open the collection in [Bruno](https://www.usebruno.com/) and select the `dev` environment to run requests against the deployed API.
