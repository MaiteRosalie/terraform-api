# terraform

Provisions the AWS infrastructure using Terraform.

## Resources

| Module | Resources |
|--------|-----------|
| `dynamodb` | DynamoDB table with on-demand billing |
| `lambda` | Lambda function, IAM role, DynamoDB access policy |
| `api-gateway` | HTTP API (v2), Lambda integration, default stage, CORS |

All resources are tagged with `Project`, `Environment`, and `ManagedBy: terraform`.

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.8
- AWS credentials configured (`aws configure` or environment variables)

## Variables

| Name | Type | Description |
|------|------|-------------|
| `aws_region` | string | AWS region to deploy to |
| `environment` | string | Deployment environment (e.g. `dev`) |
| `project_name` | string | Project name used for resource naming |

## Outputs

| Name | Description |
|------|-------------|
| `api_url` | Invocation URL of the deployed HTTP API |

## Usage

Initialize and apply using an environment-specific var file:

```bash
terraform init
terraform apply -var-file=dev.tfvars
```

`dev.tfvars`:
```hcl
aws_region   = "us-east-1"
environment  = "dev"
project_name = "items-api"
```

To target a specific module:

```bash
terraform apply -var-file=dev.tfvars -target=module.lambda
```

To destroy all resources:

```bash
terraform destroy -var-file=dev.tfvars
```

## Lambda Deployment Artifact

The Lambda module expects a zip file at `../services/items-api.zip`. Build it from the service directory before applying.

## Modules

### `modules/dynamodb`

Creates the DynamoDB table with `id` (string) as the partition key and `PAY_PER_REQUEST` billing.

### `modules/lambda`

Creates the Lambda function using `nodejs24.x`, attaches basic execution and DynamoDB CRUD policies, and injects `TABLE_NAME` and `STAGE` as environment variables.

### `modules/api-gateway`

Creates an HTTP API (v2) with a `$default` catch-all route proxying to Lambda. CORS is configured with the following defaults:

- Allowed origins: `https://example.com`, `http://192.168.0.8:3000`
- Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- Allowed headers: `Content-Type`, `Authorization`
