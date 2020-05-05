import { cognito, cloudfront, acm, route53, s3 } from '@pulumi/aws';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Frontend Inputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: {
      Zone: route53.Zone;
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
  }

  // ----------------------------------------------------------------------------------------------
  // Cognito Outputs
  // ----------------------------------------------------------------------------------------------
  export interface CognitoOutputs {
    UserPool: cognito.UserPool;
    UserPoolClient: cognito.UserPoolClient;
    IdentityPool: cognito.IdentityPool;
  }

  namespace CloudFront {
    type Outputs = CloudFrontOutputs & ACMOutputs;

    // ----------------------------------------------------------------------------------------------
    // CloudFront Outputs
    // ----------------------------------------------------------------------------------------------
    interface CloudFrontOutputs {
      Distribution: cloudfront.Distribution;
      Identity: cloudfront.OriginAccessIdentity;
    }

    // ----------------------------------------------------------------------------------------------
    // Certificate Manager Outputs
    // ----------------------------------------------------------------------------------------------
    interface ACMOutputs {
      Certificate: acm.Certificate;
      CertificateValidation: acm.CertificateValidation;
    }
  }
}
