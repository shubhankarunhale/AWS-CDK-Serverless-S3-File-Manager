# AWS-S3-Secure-File-Manager-Starter

**AWS-S3-Secure-File-Manager-Starter** is a boilerplate starter code for a serverless file management application using AWS services. This application demonstrates secure and efficient file uploads using presigned URLs, enabling scalable and cost-effective file management.

## Features

- **Secure File Uploads**:
  - **Least Privilege Principle**: Presigned URLs grant temporary, limited access for file uploads, minimizing risk and exposure.
  - **No Lambda Permissions Needed**: Uploads are handled directly by S3, reducing Lambda's role and associated security risks.

- **Scalable Architecture**:
  - **Direct Upload to S3**: Clients upload files directly to S3, bypassing Lambda and enhancing scalability and performance.

- **Performance Optimization**:
  - **Faster Uploads**: Bypassing Lambda for uploads reduces latency and improves performance.

- **Cost Efficiency**:
  - **Reduced Lambda Execution Time**: Minimizes compute resource usage and costs by handling uploads directly through S3.

- **Simplicity and Flexibility**:
  - **Client-Side Control**: Customizable upload parameters and control directly from the client application.

## How It Works

1. **Generating Presigned URLs**:
   - Your backend generates presigned URLs using AWS SDKs. These URLs are temporary and scoped to specific S3 operations.

2. **Client-Side Upload**:
   - The React frontend receives the presigned URL and uses it to upload files directly to S3 via HTTP PUT or POST requests.

3. **Security and Validation**:
   - AWS validates the presigned URL parameters, ensuring that only authorized uploads are accepted.

## Example Use Case

**Scenario**: Uploading user-generated files to an S3 bucket.

**Implementation**: Lambda functions generate presigned URLs for each upload request.

**Advantages**:
- Simplified architecture
- Reduced Lambda execution time and costs
- Enhanced security with temporary, scoped access

## Getting Started

To set up the project locally:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/AWS-S3-Secure-File-Manager-Starter.git
    cd AWS-S3-Secure-File-Manager-Starter
    ```

2. **Install Dependencies**:

    - **For the frontend**:
        ```bash
        cd frontend
        npm install
        cd ..
        ```

    - **For the backend (CDK)**:
        ```bash
        cd cdk
        npm install
        ```

3. **Configure AWS CLI**:
   Ensure AWS CLI is configured with your credentials:
    ```bash
    aws configure
    ```

4. **Deploy the Application**:
    - Run the deployment script:
        ```bash
        ./deploy.sh
        ```

5. **Run the Application Locally**:
    - Start the frontend:
        ```bash
        cd frontend
        npm start
        ```

    - Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
