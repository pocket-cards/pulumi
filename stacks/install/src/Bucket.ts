import { s3 } from '@pulumi/aws';
import { Consts } from '../../consts';
import { Install } from 'typings';

export default (): Install.BucketOutputs => {
  // artifact bucket
  const artifact = new s3.Bucket(`${Consts.PROJECT_NAME}-artifact`, {
    acl: 'private',
    forceDestroy: true,
  });

  return {
    Artifact: artifact,
  };
};
