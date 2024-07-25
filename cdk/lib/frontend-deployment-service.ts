import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, ViewerProtocolPolicy,OriginAccessIdentity  } from 'aws-cdk-lib/aws-cloudfront';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { BlockPublicAccess, Bucket, } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source , } from 'aws-cdk-lib/aws-s3-deployment';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'; 
import * as cdk from 'aws-cdk-lib';

const path = './resources/build';

export class FrontendDeploymentService extends Construct {
    constructor(scope: Construct, id: string,props?: cdk.StackProps) {
        super(scope, id);
      
        
        const hostingBucket = new Bucket(this, 'FrontendBucket', {
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const oai = new OriginAccessIdentity(this, 'currCloudFrontOAI');
        
        
        const distribution = new CloudFrontWebDistribution(this, 'CloudfrontDistribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: hostingBucket,
                        originAccessIdentity: oai,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Redirect HTTP to HTTPS
            defaultRootObject: 'index.html', // Set default root object
            errorConfigurations: [
                {
                    errorCode: 404,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                },
            ],
        });
        new BucketDeployment(this, 'BucketDeployment', {
            sources: [Source.asset(path)],
            destinationBucket: hostingBucket,
            distribution,
            distributionPaths: ['/*'],
        });

        new CfnOutput(this, 'CloudFrontURL', {
            value: `https://${distribution.distributionDomainName}` ,
            description: 'The distribution URL',
            exportName: 'CloudfrontURL',
        });

        new CfnOutput(this, 'BucketName', {
            value: hostingBucket.bucketName,
            description: 'The name of the S3 bucket',
            exportName: 'BucketName',
        });
        
    }
}