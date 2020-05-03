import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts, Envs } from '../../consts';

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(
    'iam.role.codebuild.backend',
    {
      name: `${Consts.PROJECT_NAME_UC}_CodeBuild_BackendRole`,
      assumeRolePolicy: Principals.CODEBUILD,
    },
    {
      deleteBeforeReplace: true,
    }
  );

  new iam.RolePolicy('iam.policy.codebuild.backend', {
    name: 'inline_policy',
    policy: Policy.CodeBuild_Pulumi,
    role: role.id,
  });

  return role;
};

export default () => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Backend`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project('codebuild.project.backend', {
    name: resourceName,
    artifacts: {
      type: 'CODEPIPELINE',
    },
    buildTimeout: 30,
    description: 'Backend build',
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
          name: Consts.PULUMI_ACCESS_TOKEN,
          value: Consts.SSM_KEY_PULUMI_ACCESS_TOKEN,
          type: 'PARAMETER_STORE',
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
