#!/bin/bash

# Navigate to the repository root directory
cd "$(dirname "$0")"
echo "Navigated to repository root directory."

# Install frontend dependencies
cd frontend
npm install
echo "Installed frontend dependencies."
cd ..

# Install backend dependencies
cd cdk
npm install
echo "Installed backend dependencies."

# Synthesize CDK
echo "Synthesizing CDK..."
npx cdk synth
echo "CDK synthesized successfully."

# Deploy BackendStack to create/update API Gateway
echo "Deploying BackendStack..."
npx cdk deploy BackendStack --require-approval never 
echo "BackendStack deployed successfully."
cd ..

# Get API Gateway URL
api_url=$(aws cloudformation list-exports --query "Exports[?Name=='ApiGateway'].Value" --output text)
echo "API_URL=${api_url}"
echo "Fetched API Gateway URL."

# Create .env file with API Gateway URL
echo "REACT_APP_API_GATEWAY_URL=${api_url}" > frontend/.env
echo ".env file created with API Gateway URL."

# Display the content of the .env file
echo "Contents of the .env file:"
cat frontend/.env

# Build frontend with the updated API Gateway URL
cd frontend
export BUILD_PATH=../cdk/resources/build
npx react-scripts build
echo "Frontend built successfully."
cd ..

# Deploy FrontendStack
cd cdk
echo "Deploying FrontendStack..."
npx cdk deploy FrontendStack --require-approval never
echo "FrontendStack deployed successfully."

# Deploy BackendStack with exports available (if needed)
export FRONTEND_STACK_EXPORTS_AVAILABLE=true
echo "Redeploying BackendStack with exports available..."
npx cdk deploy BackendStack --require-approval never
echo "BackendStack redeployed with exports available."

echo "Deployment completed successfully."
deployment_url=$(aws cloudformation list-exports --query "Exports[?Name=='CloudfrontURL'].Value" --output text)
echo "Access the deployment at: ${deployment_url}"