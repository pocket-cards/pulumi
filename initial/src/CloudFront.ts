import { cloudfront } from '@pulumi/aws';
import { Initial } from 'typings';
import { Consts } from '../../consts';

export default (): Initial.CloudFrontOutputs => {
  const identity = new cloudfront.OriginAccessIdentity('cloudfront.originaccess.identity', {
    comment: Consts.PROJECT_NAME,
  });

  return {
    Identity: identity,
  };
};
