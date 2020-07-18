import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts, Envs } from '../../../../consts';
import { Frontend } from 'typings';

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

export default (inputs: Frontend.CodePipeline.Inputs) => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Frontend`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project('codebuild.project.frontend', {
    name: resourceName,
    artifacts: {
      type: 'CODEPIPELINE',
    },
    buildTimeout: 10,
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
          name: 'BUCKET_WEB',
          value: inputs.Bucket.Frontend.bucket,
        },
        {
          name: 'USER_POOL_ID',
          value: inputs.Cognito.UserPool.id,
        },
        {
          name: 'USER_POOL_WEB_CLIENT_ID',
          value: inputs.Cognito.UserPoolClient.id,
        },
        {
          name: 'IDENTITY_POOL_ID',
          value: inputs.Cognito.IdentityPool.id,
        },
        {
          name: 'API_URL',
          value: `https://api.${Consts.DOMAIN_NAME()}`,
        },
        {
          name: 'API_SERVER_URL',
          value: `https://api.${Consts.DOMAIN_NAME()}`,
        },
        {
          name: 'AUTH_DOMAIN',
          value: `${inputs.Cognito.UserPoolDomain.domain}.auth.ap-northeast-1.amazoncognito.com`,
        },
        {
          name: 'AUTH_SIGN_IN_URL',
          value: Consts.AUTH_SIGN_IN_URL,
        },
        {
          name: 'AUTH_SIGN_OUT_URL',
          value: Consts.AUTH_SIGN_OUT_URL,
        },
      ],
    },
    serviceRole: serviceRole.arn,
    source: {
      type: 'CODEPIPELINE',
      buildspec: 'buildspec.yml',
    },
  });

  return project;
};
