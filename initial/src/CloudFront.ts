import { cloudfront } from '@pulumi/aws';
import { Initialize } from 'typings';
import { Consts } from '../../consts';

export default (): Initialize.CloudFrontOutputs => {
  const identity = new cloudfront.OriginAccessIdentity('cloudfront.originaccess.identity', {
    comment: Consts.PROJECT_NAME,
  });

  return {
    Identity: identity,
  };
};
