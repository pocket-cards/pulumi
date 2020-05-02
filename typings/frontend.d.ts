import { cognito, cloudfront, acm } from '@pulumi/aws';
import { Install } from './install';
import { Initialize } from './initialize';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Frontend Inputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: Install.Route53Outputs;
    CloudFront: Initialize.CloudFrontOutputs;
    Bucket: Initialize.S3Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Frontend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    Cognito: CognitoOutputs;
    CloudFront: CloudFrontOutputs;
    ACM: ACMOutputs;
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
  export interface ACMOutputs {
    Certificate: acm.Certificate;
    CertificateValidation: acm.CertificateValidation;
  }
}
