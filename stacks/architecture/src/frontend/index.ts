import OriginAccessIdentity from './OriginAccessIdentity';
import BucketPolicy from './BucketPolicy';
import CloudFront from './CloudFront';
import Record from './Record';
import CodePipeline from './codepipeline';
import SNS from './sns';

import { Frontend } from 'typings';

export default ({ ACM, Cognito, Route53, S3 }: Frontend.Inputs): Frontend.Outputs => {
  const identity = OriginAccessIdentity();

  // Add Bucket Access Policy
  BucketPolicy({
    Bucket: {
      Audio: S3.Audio,
      Frontend: S3.Frontend,
    },
    Identity: identity,
  });

  const cloudfront = CloudFront({
    Bucket: {
      Audio: S3.Audio,
      Frontend: S3.Frontend,
    },
    CertificateValidation: ACM.Virginia.CertificateValidation,
    Identity: identity,
  });

  // Route53 Record
  Record(Route53.Zone, cloudfront.Distribution);

  SNS();

  const pipeline = CodePipeline({
    Bucket: {
      Artifact: S3.Artifacts,
      Frontend: S3.Frontend,
    },
    Cognito: Cognito,
  });

  return {
    CloudFront: {
      Distribution: cloudfront.Distribution,
      Identity: identity,
    },
    CodePipeline: pipeline,
  };
};
