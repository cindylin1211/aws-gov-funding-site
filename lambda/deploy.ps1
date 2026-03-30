# Deploy Lambda function for grants API

Write-Host "Creating IAM role..." -ForegroundColor Yellow
try {
    aws iam create-role `
      --role-name grants-api-lambda-role `
      --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}' `
      --profile cindy 2>$null
} catch {
    Write-Host "Role already exists" -ForegroundColor Gray
}

Write-Host "Attaching policies..." -ForegroundColor Yellow
aws iam attach-role-policy `
  --role-name grants-api-lambda-role `
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole `
  --profile cindy

aws iam attach-role-policy `
  --role-name grants-api-lambda-role `
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess `
  --profile cindy

Write-Host "Waiting for role to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Creating Lambda function..." -ForegroundColor Yellow
aws lambda create-function `
  --function-name grants-api `
  --runtime nodejs20.x `
  --role arn:aws:iam::640223110023:role/grants-api-lambda-role `
  --handler grants-api.handler `
  --zip-file fileb://grants-api.zip `
  --timeout 30 `
  --memory-size 512 `
  --region us-west-2 `
  --profile cindy

Write-Host "`n✅ Lambda function created!" -ForegroundColor Green
