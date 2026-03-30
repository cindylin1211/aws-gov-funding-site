#!/bin/bash

# Create IAM role for Lambda
echo "Creating IAM role..."
aws iam create-role \
  --role-name grants-api-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }' \
  --profile cindy 2>/dev/null || echo "Role already exists"

# Attach policies
echo "Attaching policies..."
aws iam attach-role-policy \
  --role-name grants-api-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --profile cindy

aws iam attach-role-policy \
  --role-name grants-api-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess \
  --profile cindy

# Wait for role to be ready
echo "Waiting for role to be ready..."
sleep 10

# Create Lambda function
echo "Creating Lambda function..."
aws lambda create-function \
  --function-name grants-api \
  --runtime nodejs20.x \
  --role arn:aws:iam::640223110023:role/grants-api-lambda-role \
  --handler grants-api.handler \
  --zip-file fileb://grants-api.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-west-2 \
  --profile cindy

echo "✅ Lambda function created!"
