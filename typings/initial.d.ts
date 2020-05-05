import { s3, cloudfront, codebuild, codepipeline, ecr, dynamodb } from '@pulumi/aws';

export namespace Initial {
  // ----------------------------------------------------------------------------------------------
  // Initial Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    DynamoDB: DynamoDBOutputs;
    Bucket: S3Outputs;
    CloudFront: CloudFrontOutputs;
    ECR: ECROutputs;
  }

  // ----------------------------------------------------------------------------------------------
  // DynamoDB Outputs
  // ----------------------------------------------------------------------------------------------
  interface DynamoDBOutputs {
    Users: dynamodb.Table;
    Words: dynamodb.Table;
    Groups: dynamodb.Table;
    History: dynamodb.Table;
    WordMaster: dynamodb.Table;
  }

  // ----------------------------------------------------------------------------------------------
  // S3 Outputs
  // ----------------------------------------------------------------------------------------------
  interface S3Outputs {
    Frontend: s3.Bucket;
    Audio: s3.Bucket;
    Images: s3.Bucket;
  }

  // ----------------------------------------------------------------------------------------------
  // ECR Outputs
  // ----------------------------------------------------------------------------------------------
  interface ECROutputs {
    Backend: ecr.Repository;
    BackendTesting: ecr.Repository;
  }

  // ----------------------------------------------------------------------------------------------
  // CloudFront Outputs
  // ----------------------------------------------------------------------------------------------
  interface CloudFrontOutputs {
    Identity: cloudfront.OriginAccessIdentity;
  }

  // ----------------------------------------------------------------------------------------------
  // CodePipeline Outputs
  // ----------------------------------------------------------------------------------------------
  namespace CodePipeline {
    type Outputs = FrontendOutputs & BackendOutputs;

    // ----------------------------------------------------------------------------------------------
    // Frontend Outputs
    // ----------------------------------------------------------------------------------------------
    interface FrontendOutputs {
      CodeBuild: codebuild.Project;
      CodePipeline: codepipeline.Pipeline;
    }

    // ----------------------------------------------------------------------------------------------
    // Backend Outputs
    // ----------------------------------------------------------------------------------------------
    interface BackendOutputs {
      CodeBuild: BackendCodeBuildOutputs;
      CodePipeline: codepipeline.Pipeline;
    }

    // ----------------------------------------------------------------------------------------------
    // Backend CodeBuild Outputs
    // ----------------------------------------------------------------------------------------------
    interface BackendCodeBuildOutputs {
      Build: codebuild.Project;
      Test: codebuild.Project;
      Push: codebuild.Project;
    }
  }
}
