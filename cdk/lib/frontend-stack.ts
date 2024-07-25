import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontendDeploymentService } from './frontend-deployment-service';


export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new FrontendDeploymentService(this, 'deployment');
}
}
