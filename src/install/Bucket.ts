import { s3 } from '@pulumi/aws';
import { Consts } from '../consts';

export default () => {
  // artifact bucket
  const artifact = new s3.Bucket(`${Consts.PROJECT_NAME}-artifact`, {
    acl: 'private',
  });

  return artifact;
};
