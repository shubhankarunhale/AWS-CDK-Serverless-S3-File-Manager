import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { createDocumentBucket } from "./bucket-service";
import {BackendInfraDeploymentService} from "./backend-infra-deployment-service"

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const BUCKET_NAME = `project-documents-${this.account}-${this.region}`;

    const bucket = createDocumentBucket(this, BUCKET_NAME);

    // Define the API Gateway resource
    // Define the API Gateway without a default handler
    const api = new apigateway.RestApi(this, "projectApi", {
      restApiName: "Project Service",
      description: "This service handles file operations.",
    });
    this.addMockResource(api);
    
    
     const frontendStackExportsAvailable =
     process.env.FRONTEND_STACK_EXPORTS_AVAILABLE === "true";
     
     
     
     new BackendInfraDeploymentService(this, 'BackendDeployment',{
      bucket,
      api,
      frontendStackExportsAvailable,
    });

  }

  public addMockResource(api: apigateway.LambdaRestApi) {
    const placeholderResource = api.root.addResource("placeholder");
    placeholderResource.addMethod("GET", new apigateway.MockIntegration(), {
      requestParameters: {
        "method.request.path.proxy": true,
      },
      methodResponses: [
        {
          statusCode: "200",
        },
      ],
    });
  }
}
