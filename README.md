# AWS-S3-Secure-File-Manager-Starter

**AWS-S3-Secure-File-Manager-Starter** is a serverless file management application that leverages AWS services to provide a secure and efficient file upload solution. The standout feature of this app is its **dynamic CORS and frontend configuration**, which happens at runtime, setting it apart from existing alternatives.

## Key Feature

### **Dynamic CORS and Frontend Configuration**

The most important and unique aspect of this application is its ability to dynamically handle CORS and frontend configuration at runtime:

- **Dynamic CORS Configuration**: Just like adjusting the security settings of a new guest at a party based on their role, this app automatically configures CORS settings as new roles are created. This ensures that the S3 bucket’s access policies are updated dynamically, with no manual intervention required.

- **Secure Access Policies**: Think of the S3 bucket as a secure vault that only opens for authorized guests. The app dynamically generates access policies to ensure that only requests from the React frontend are accepted, keeping the bucket secure out of the box.

## Features

- **Secure File Uploads**:
  - **Least Privilege Principle**: Presigned URLs act like temporary keys that grant limited access for file uploads, minimizing risk and exposure.
  - **No Lambda Permissions Needed**: Uploads are handled directly by S3, reducing Lambda's role and associated security risks.

- **Scalable Architecture**:
  - **Direct Upload to S3**: Clients upload files directly to S3, bypassing Lambda, which is like having a direct express lane for faster and more scalable uploads.

- **Performance Optimization**:
  - **Faster Uploads**: By avoiding Lambda for uploads, the app reduces latency and speeds up the process, similar to cutting out the middleman in a transaction.

- **Cost Efficiency**:
  - **Reduced Lambda Execution Time**: Handling uploads directly through S3 minimizes compute resource usage and costs, much like saving on fees by avoiding unnecessary services.

- **Simplicity and Flexibility**:
  - **Client-Side Control**: Provides customizable upload parameters directly from the client application, allowing for tailored upload experiences.

## How It Works

1. **Generating Presigned URLs**:
   - Your backend generates presigned URLs using AWS SDKs. These URLs are temporary and scoped to specific S3 operations, akin to giving out temporary access passes.

2. **Client-Side Upload**:
   - The React frontend receives the presigned URL and uses it to upload files directly to S3 via HTTP PUT or POST requests.

3. **Security and Validation**:
   - AWS validates the presigned URL parameters, ensuring that only authorized uploads are accepted, like checking IDs before entry.

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
