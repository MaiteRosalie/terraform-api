variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "lambda_arn" {
  type = string
}

variable "lambda_function_name" {
  type = string
}

variable "allowed_origins" {
  type    = list(string)
  default = ["https://example.com", "http://192.168.0.8:3000"]
}

variable "allowed_methods" {
  type    = list(string)
  default = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}

variable "allowed_headers" {
  type    = list(string)
  default = ["Content-Type", "Authorization"]
}
