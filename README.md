# AWS-S3-Secure-File-Manager-Starter

**AWS-S3-Secure-File-Manager-Starter** is a serverless file management application that leverages AWS services to provide a secure and efficient file upload solution. The standout feature of this app is its **dynamic CORS and frontend configuration**, which happens at runtime, setting it apart from existing alternatives.

## Key Feature

### **Dynamic CORS and Frontend Configuration**

The most important and unique aspect of this application is its ability to dynamically handle CORS and frontend configuration at runtime:

- **Dynamic CORS Configuration**: Automatically configures CORS settings as new roles are created. This ensures that the S3 bucket’s access policies are updated dynamically, with no manual intervention required.

- **Secure Access Policies**: Dynamically generates access policies to ensure that only requests from the React frontend are accepted, keeping the bucket secure out of the box.


## Getting Started

### Prerequisites

- Node.js (v20 or later)
- AWS CLI
- AWS CDK (v2)
- GitHub account

### AWS Account Permissions

Ensure the AWS account you're using has the necessary permissions to access and manage the required services. This includes permissions for:

*   S3
*   Lambda
*   API Gateway
*   CloudFormation
*   IAM

To configure the AWS account with the necessary permissions, use the AWS Management Console or AWS CLI to attach the appropriate policies to your user or role. You can use AWS-managed policies such as `AdministratorAccess` for full permissions or create a custom policy with the least privilege principle.


### Deploy Using GitHub Actions

1. **Fork the Repository:**
   Fork this repository to your GitHub account.

2. **Add Secrets:**
   Add the required parameters to the secrets in your GitHub repository settings. Navigate to `Settings > Secrets > Actions` and add the following secrets:

   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

3. **Push Changes:**
   Push any changes to your forked repository. This will trigger the GitHub Actions workflow to deploy your application.
   To access the deployment "run logs>Get Deployment Url step" to get the deployment url

### Run Locally

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-username/AWS-S3-Secure-File-Manager-Starter.git
   cd AWS-S3-Secure-File-Manager-Starter
   ```

2. **Run deploy.sh in bash**
   ```
   ./deploy.sh
    ```

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


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
