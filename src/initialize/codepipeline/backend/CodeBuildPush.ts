import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts, Envs } from '../../../consts';

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(
    'iam.role.codebuild.backend.push',
    {
      name: `${Consts.PROJECT_NAME_UC}_CodeBuild_Backend_PushRole`,
      assumeRolePolicy: Principals.CODEBUILD,
    },
    {
      deleteBeforeReplace: true,
    }
  );

  new iam.RolePolicy('iam.policy.codebuild.backend.push', {
    name: 'inline_policy',
    policy: Policy.CodeBuild_Backend_Push,
    role: role.id,
  });

  return role;
};

export default () => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Backend-Push`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project('codebuild.project.backend.push', {
    name: resourceName,
    artifacts: {
      type: 'CODEPIPELINE',
    },
    buildTimeout: 30,
    description: 'Backend Push',
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
      ],
    },
    serviceRole: serviceRole.arn,
    source: {
      type: 'CODEPIPELINE',
      buildspec: 'buildspec/push.yml',
    },
  });

  return project;
};
