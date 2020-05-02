import { s3, cloudfront, route53 } from '@pulumi/aws';
import { Output } from '@pulumi/pulumi';

export namespace Initialize {
  // ----------------------------------------------------------------------------------------------
  // Initialize Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    DynamoDB: DynamoDBOutputs;
    Bucket: S3Outputs;
    CloudFront: CloudFrontOutputs;
  }

  // ----------------------------------------------------------------------------------------------
  // DynamoDB Outputs
  // ----------------------------------------------------------------------------------------------
  export interface DynamoDBOutputs {
    Users: Output<string>;
    Words: Output<string>;
    Groups: Output<string>;
    History: Output<string>;
    WordMaster: Output<string>;
  }

  // ----------------------------------------------------------------------------------------------
  // S3 Outputs
  // ----------------------------------------------------------------------------------------------
  export interface S3Outputs {
    Frontend: s3.Bucket;
    Audio: s3.Bucket;
    Images: s3.Bucket;
  }

  // ----------------------------------------------------------------------------------------------
  // CloudFront Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CloudFrontOutputs {
    Identity: cloudfront.OriginAccessIdentity;
  }
}
