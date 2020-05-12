import { iam, lambda, cloudfront } from '@pulumi/aws';
import { asset } from '@pulumi/pulumi';
import * as path from 'path';
import { Consts, Principals, Policy } from '../../../../consts';
import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';

export default (distribution: cloudfront.Distribution) => {
  const role = getRole();

  const func = new lambda.Function(
    'lambda.function.pipeline.frontend',
    {
      name: `${Consts.PROJECT_NAME_UC}_CloudFront_Invalidation`,
      code: new AssetArchive({
        'index.js': new StringAsset(`
          exports.handler = async (event) => {
            const response = {
              statusCode: 200,
              body: JSON.stringify('Hello from Lambda!'),
            };
            return response;
          };
        `),
      }),
      handler: 'index.handler',
      role: role.arn,
      runtime: 'nodejs12.x',
      memorySize: 256,
      timeout: 600,
      environment: {
        variables: {
          DISTRIBUTION_ID: distribution.id,
        },
      },
    },
    { ignoreChanges: ['code'] }
  );

  return func;
};

const getRole = () => {
  const role = new iam.Role('iam.role.lambda.sns.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_SNSFronendRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.sns.frontend', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_CloudFront_Invalidation,
  });
  return role;
};
