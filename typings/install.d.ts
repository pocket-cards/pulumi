import { ssm, s3, iam, codebuild, codepipeline, route53 } from '@pulumi/aws';

export namespace Install {
  // ----------------------------------------------------------------------------------------------
  // Install Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    Route53: Route53Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Parameter Store Outputs
  // ----------------------------------------------------------------------------------------------
  export interface ParameterOutputs {
    Github: ssm.Parameter;
    Pulumi: ssm.Parameter;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Route53Outputs {
    Zone: route53.Zone;
    Record?: route53.Record;
  }
}
