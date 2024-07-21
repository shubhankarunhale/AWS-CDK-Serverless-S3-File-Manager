import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';

export const createDocumentBucket = (scope: Construct, bucketName: string): Bucket => {
//     let bucket: Bucket;
//     try {  
        
//         bucket = Bucket.fromBucketName(scope, 'DocumentBucket', bucketName)as Bucket;;
        
// } catch (e) {
  const bucket = new Bucket(scope, 'DocumentBucket', {
      bucketName: bucketName,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    
    // new cdk.CfnOutput(scope, 'DocumentBucketName', {
    //     value: bucket.bucketName,
    //     description: 'The name of the S3 bucket for storing documents',
    //     exportName: 'DocumentBucketName', // This name can be used to reference the bucket in other stacks
    // });

    return bucket;
  };