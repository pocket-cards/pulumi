import { cognito, cloudfront, acm } from '@pulumi/aws';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Install Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    Cognito: CognitoOutputs;
    CloudFront: CloudFrontOutputs;
    ACM: AMCOutputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Cognito Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CognitoOutputs {
    UserPool: cognito.UserPool;
    UserPoolClient: cognito.UserPoolClient;
    IdentityPool: cognito.IdentityPool;
  }

  // ----------------------------------------------------------------------------------------------
  // Frontend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CloudFrontOutputs {
    Distribution: cloudfront.Distribution;
  }

  // ----------------------------------------------------------------------------------------------
  // Certificate Manager Outputs
  // ----------------------------------------------------------------------------------------------
  export interface AMCOutputs {
    Certificate: acm.Certificate;
  }
}
