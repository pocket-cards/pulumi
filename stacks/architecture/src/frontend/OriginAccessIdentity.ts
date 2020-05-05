import { cloudfront } from '@pulumi/aws';
import { Consts } from '../../../consts';

export default () =>
  new cloudfront.OriginAccessIdentity('cloudfront.originaccess.identity', {
    comment: Consts.PROJECT_NAME,
  });
