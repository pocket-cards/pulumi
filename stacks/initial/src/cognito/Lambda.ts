import { iam, lambda } from '@pulumi/aws';
import { Principals, Consts, Policy } from '../../../consts';
import { AssetArchive, StringAsset } from '@pulumi/pulumi/asset';

export default () => {
  const role = getRole();

  const func = new lambda.Function(
    'lambda.function.cognito',
    {
      name: `${Consts.PROJECT_NAME_UC}_Cognito`,
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
    },
    { ignoreChanges: ['code'] }
  );

  return func;
};

const getRole = () => {
  const role = new iam.Role('iam.role.lambda.cognito', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_CognitoRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.cognito', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_Basic,
  });
  return role;
};
