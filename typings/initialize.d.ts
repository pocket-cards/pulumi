import { s3, cloudfront, codebuild, codepipeline } from '@pulumi/aws';
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
