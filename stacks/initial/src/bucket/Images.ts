import { s3 } from '@pulumi/aws';
import { Consts } from '../../../consts';

export default () =>
  new s3.Bucket(`${Consts.PROJECT_NAME}-images`, {
    acl: 'private',
    lifecycleRules: [
      {
        enabled: true,
        expiration: {
          days: 30,
        },
      },
    ],
  });
