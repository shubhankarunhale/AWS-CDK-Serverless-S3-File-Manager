import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import {PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import * as path from 'path';

export interface DeploymentServiceProps extends cdk.StackProps {
  bucket: Bucket;
  api: apigateway.RestApi;
  frontendStackExportsAvailable: boolean;
}

export class BackendInfraDeploymentService extends Construct {
  constructor(scope: Construct, id: string, props: DeploymentServiceProps) {
    super(scope, id);

    const { bucket, api, frontendStackExportsAvailable } = props;

    //Create lambdas for all our handlers
    const getPresignedUrlFunction = this.createLambda(
      "getPresignedUrlFunction",
      "getPresignedUrl.handler",
      bucket,
      ["s3:GetObject", "s3:PutObject"]
    );

    const listFilesFunction = this.createLambda(
      "listFilesFunction",
      "listFiles.handler",
      bucket,
      ["s3:ListBucket"]
    );

    const getDownloadUrlFunction = this.createLambda(
      "getDownloadUrlFunction",
      "downloadFile.handler",
      bucket,
      ["s3:GetObject"]
    );

    const deleteFileFunction = this.createLambda(
      "deleteFileFunction",
      "deleteFile.handler",
      bucket,
      ["s3:DeleteObject"]
    );

    //Export variables required for frontend deployment
    new cdk.CfnOutput(this, "ApiGateway", {
      value: `${api.url}`,
      description: "The name of the API Gateway for presigned file url",
      exportName: "ApiGateway", // This name can be used to reference the bucket in other stacks
    });

    //Bucket
    new cdk.CfnOutput(this, "DocumentBucketName", {
      value: bucket.bucketName,
      description: "The name of the S3 bucket for storing documents",
      exportName: "DocumentBucketName", // This name can be used to reference the bucket in other stacks
    });

    //Only run when the cloudfront deployment is available
    //This done to ensure proper CORS permissions dynamically based
    //on the frontendurl
    if (frontendStackExportsAvailable) {
      //Can be changed to any other frontend deplyment address
      const frontendCloudFrontURL = cdk.Fn.importValue("CloudfrontURL");
      this.addBucketCORSConfig(bucket, [frontendCloudFrontURL]);

      //Create routes for all the lambdas with CORS configurations
      const getPresignedUrlResource = api.root.addResource("getPresignedUrl");
      this.deployLambdaWithCORS(
        api,
        getPresignedUrlResource,
        [frontendCloudFrontURL],
        getPresignedUrlFunction,
        ["POST"]
      );

      const listFilesResource = api.root.addResource("listFiles");
      this.deployLambdaWithCORS(
        api,
        listFilesResource,
        [frontendCloudFrontURL],
        listFilesFunction,
        ["GET"]
      );

      const getDownloadUrlResource = api.root.addResource("getDownloadUrl");
      this.deployLambdaWithCORS(
        api,
        getDownloadUrlResource,
        [frontendCloudFrontURL],
        getDownloadUrlFunction,
        ["GET"]
      );

      const deleteFileResource = api.root.addResource("deleteFile");
      this.deployLambdaWithCORS(
        api,
        deleteFileResource,
        [frontendCloudFrontURL],
        deleteFileFunction,
        ["DELETE"]
      );
    } else {
      console.warn(
        "FrontendStack outputs not available. Skipping updateBucketPolicy."
      );
    }
  }

  private createLambda(
    id: string,
    handler: string,
    bucket: Bucket,
    actions: string[]
  ): lambda.Function {
    const resources = actions.includes("s3:ListBucket")
      ? [bucket.bucketArn]
      : [`${bucket.bucketArn}/*`];
    return new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'lambda')),
      handler: handler,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: actions,
          resources: resources,
        }),
      ],
    });
  }

  //Add the CORS config to the S3 bucket to allow requests from cloudfront
  public addBucketCORSConfig(bucket: Bucket, allowedOrigins: string[]) {
    bucket.addCorsRule({
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.PUT,
        s3.HttpMethods.POST,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: allowedOrigins,
      allowedHeaders: ["*"],
      exposedHeaders: ["ETag"],
    });
  }

  //Deploy a Lambda function with CORS headers
  private deployLambdaWithCORS(
    api: apigateway.LambdaRestApi,
    resource: apigateway.Resource,
    allowedOrigins: string[],
    lambdaFunction: cdk.aws_lambda.Function,
    httpMethods: string[]
  ) {
    const responseHeaders = {
      "method.response.header.Access-Control-Allow-Origin": true,
      "method.response.header.Access-Control-Allow-Headers": true,
      "method.response.header.Access-Control-Allow-Methods": true,
    };

    const frontendCloudFrontURL = allowedOrigins[0];
    lambdaFunction.addEnvironment("CLOUDFRONT_URL", frontendCloudFrontURL);

    const methodResponses = [
      { statusCode: "200", responseParameters: responseHeaders },
      { statusCode: "400", responseParameters: responseHeaders },
      { statusCode: "500", responseParameters: responseHeaders },
    ];

    httpMethods.forEach((httpMethod) => {
      resource.addMethod(
        httpMethod,
        new apigateway.LambdaIntegration(lambdaFunction),
        {
          methodResponses,
        }
      );
    });

    this.setCorsOptions(resource, allowedOrigins, httpMethods);
  }

  //Helper method to add the CORS Options
  private setCorsOptions(
    resource: apigateway.Resource,
    allowedOrigins: string[],
    allowMethods: string[]
  ) {
    allowedOrigins.forEach((origin) => {
      resource.addCorsPreflight({
        allowOrigins: [origin],
        allowMethods: allowMethods,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
      });
    });
  }
}
