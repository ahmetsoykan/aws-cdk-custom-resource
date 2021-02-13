import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as logs from '@aws-cdk/aws-logs';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';

export class AwsCustomResourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const demoBucket = new s3.Bucket(this, 'CustomResourceDemoBucket', {
      bucketName: 'demo-bucket-with-content',
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
    new AwsCustomResource(this, 'CustomResourceLambda', {
      onCreate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Body: 'content',
          Bucket: demoBucket.bucketName,
          Key: 'test.txt'
        },
        physicalResourceId: PhysicalResourceId.of(demoBucket.bucketName+'/test.txt'),
        
      },
      onDelete: {
        service: 'S3',
        action: 'deleteObject',
        parameters: {
          Bucket: demoBucket.bucketName,
          Key: 'test.txt'
        },
        physicalResourceId: PhysicalResourceId.of(demoBucket.bucketName+'/test.txt'),
      },
      logRetention: logs.RetentionDays.THREE_DAYS,
      policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
      });
      
  }
}