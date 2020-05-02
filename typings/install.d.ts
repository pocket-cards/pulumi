import { ssm, s3, iam, codebuild, codepipeline, route53 } from '@pulumi/aws';

export namespace Install {
  // ----------------------------------------------------------------------------------------------
  // Install Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    ParameterStore: ParameterOutputs;
    Bucket: BucketOutputs;
    Route53: Route53Outputs;
    Role: {
      CodeBuildPulumi: iam.Role;
      CodePipelinePulumi: iam.Role;
    };
  }

  // ----------------------------------------------------------------------------------------------
  // CodeBuild Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CodeBuildOutputs {
    CodeBuild: codebuild.Project;
    CodeBuildRole: iam.Role;
  }

  // ----------------------------------------------------------------------------------------------
  // CodePipeline Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CodePipelineOutputs {
    CodePipeline: codepipeline.Pipeline;
    CodePipelineWebhook: codepipeline.Webhook;
    CodePipelineRole: iam.Role;
  }

  // ----------------------------------------------------------------------------------------------
  // Parameter Store Outputs
  // ----------------------------------------------------------------------------------------------
  export interface ParameterOutputs {
    Github: ssm.Parameter;
    Pulumi: ssm.Parameter;
  }

  // ----------------------------------------------------------------------------------------------
  // Bucket Outputs
  // ----------------------------------------------------------------------------------------------
  export interface BucketOutputs {
    Artifact: s3.Bucket;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Route53Outputs {
    Zone: route53.Zone;
    Record?: route53.Record;
  }
}
