import OriginAccessIdentity from './OriginAccessIdentity';
import BucketPolicy from './BucketPolicy';
import CloudFront from './CloudFront';
import { Frontend } from 'typings';
import Route53 from './Route53';

export default (inputs: Frontend.Inputs): Frontend.Outputs => {
  const identity = OriginAccessIdentity();

  // Add Bucket Access Policy
  BucketPolicy(inputs, identity);

  const distribution = CloudFront(inputs, inputs.ACM, identity);

  // Route53 Record
  Route53(inputs.Route53.Zone, distribution);

  return {
    Identity: identity,
    Distribution: distribution,
  };
};
