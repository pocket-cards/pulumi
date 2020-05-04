import { cognito, cloudfront, acm, route53, s3 } from '@pulumi/aws';
import { Install } from './install';
import { Initialize } from './initialize';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Frontend Inputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: {
      Zone: route53.Zone;
    };
    CloudFront: {
      Identity: cloudfront.OriginAccessIdentity;
    };
    S3: {
      Frontend: s3.Bucket;
      Audio: s3.Bucket;
      Images: s3.Bucket;
    };
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
