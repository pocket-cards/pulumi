import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts, Envs } from '../../../../consts';
import { Initial } from 'typings';

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(
    'iam.role.codebuild.frontend',
    {
      name: `${Consts.PROJECT_NAME_UC}_CodeBuild_FrontendRole`,
      assumeRolePolicy: Principals.CODEBUILD,
    },
    { deleteBeforeReplace: true }
  );

  new iam.RolePolicy('iam.policy.codebuild.frontend', {
    name: 'inline_policy',
    policy: Policy.CodeBuild_Frontend,
    role: role.id,
  });

  return role;
};

export default (cognito: Initial.CognitoOutputs) => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Frontend`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project(
    'codebuild.project.frontend',
    {
      name: resourceName,
      artifacts: {
        type: 'CODEPIPELINE',
      },
      buildTimeout: 30,
      description: 'Frontend build',
      environment: {
        type: 'LINUX_CONTAINER',
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/standard:4.0',
        imagePullCredentialsType: 'CODEBUILD',
        environmentVariables: [
          {
            name: 'ENVIRONMENT',
            value: Envs.ENVIRONMENT,
          },
          {
            name: 'USER_POOL_ID',
            value: cognito.UserPool.id,
          },
          {
            name: 'USER_POOL_WEB_CLIENT_ID',
            value: cognito.UserPoolClient.id,
          },
          {
            name: 'IDENTITY_POOL_ID',
            value: cognito.IdentityPool.id,
          },
        ],
      },
      serviceRole: serviceRole.arn,
      source: {
        type: 'CODEPIPELINE',
        buildspec: 'buildspec.yml',
      },
    },
    { dependsOn: [cognito.UserPool] }
  );

  return project;
};
