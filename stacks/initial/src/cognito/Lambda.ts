import { iam, lambda } from '@pulumi/aws';
import { asset } from '@pulumi/pulumi';
import * as path from 'path';
import { Principals, Consts, Policy } from '../../../consts';

export default () => {
  const role = getRole();

  const func = new lambda.Function(
    'lambda.function.cognito',
    {
      name: `${Consts.PROJECT_NAME_UC}_Cognito`,
      code: new asset.FileArchive(path.join(__dirname, './lambda_function_payload.zip')),
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
