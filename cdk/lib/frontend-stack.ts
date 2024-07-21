import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontendDeploymentService } from './frontend-deployment-service';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new FrontendDeploymentService(this, 'deployment');
}
}
