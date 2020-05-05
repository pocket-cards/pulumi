import ACM from './ACM';
import OriginAccessIdentity from './OriginAccessIdentity';
import BucketPolicy from './BucketPolicy';
import CloudFront from './CloudFront';
import { Frontend } from 'typings';

export default (inputs: Frontend.Inputs): Frontend.Outputs => {
  const acm = ACM(inputs.Route53.Zone);

  const identity = OriginAccessIdentity();

  // Add Bucket Access Policy
  BucketPolicy(inputs, identity);

  const distribution = CloudFront(inputs, acm, identity);

  return {
    ...acm,
    Identity: identity,
    Distribution: distribution,
  };
};
