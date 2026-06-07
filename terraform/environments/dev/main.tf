provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  project_name = var.project_name
  environment  = var.environment
}

module "lambda" {
  source = "../../modules/lambda"

  project_name = var.project_name
  environment  = var.environment

  table_name = module.dynamodb.table_name
  table_arn  = module.dynamodb.table_arn
}

module "api_gateway" {
  source = "../../modules/api-gateway"

  project_name = var.project_name
  environment  = var.environment

  lambda_arn           = module.lambda.lambda_arn
  lambda_function_name = module.lambda.function_name
}

output "api_url" {
  value = module.api_gateway.api_url
}