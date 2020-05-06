import { cloudfront, acm } from '@pulumi/aws';
import { Initial } from './initial';
import { Install } from './install';

export namespace Frontend {
  // ----------------------------------------------------------------------------------------------
  // Frontend Inputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: Install.Route53Outputs;
    S3: Initial.S3Outputs;
    ACM: Install.ACM.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Frontend Outputs
  // ----------------------------------------------------------------------------------------------
  export type Outputs = CloudFront.Outputs;

  namespace CloudFront {
    type Outputs = CloudFrontOutputs;

    // ----------------------------------------------------------------------------------------------
    // CloudFront Outputs
    // ----------------------------------------------------------------------------------------------
    interface CloudFrontOutputs {
      Distribution: cloudfront.Distribution;
      Identity: cloudfront.OriginAccessIdentity;
    }
  }
}
