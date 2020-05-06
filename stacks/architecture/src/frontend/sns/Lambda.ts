import { iam, lambda } from '@pulumi/aws';
import { asset } from '@pulumi/pulumi';
import * as path from 'path';
import { Consts, Principals, Policy } from '../../../../consts';

export default () => {
  const role = getRole();

  const func = new lambda.Function(
    'lambda.function.pipeline.frontend',
    {
      name: `${Consts.PROJECT_NAME_UC}_SNS_Frontend`,
      code: new asset.FileArchive(path.join(__dirname, './payload.zip')),
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
  const role = new iam.Role('iam.role.lambda.sns.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_Lambda_SNSFronendRole`,
    assumeRolePolicy: Principals.LAMBDA,
  });

  new iam.RolePolicy('iam.policy.lambda.sns.frontend', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Lambda_Basic,
  });
  return role;
};
