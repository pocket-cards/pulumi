import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts, Envs } from '../../../../consts';

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(
    'iam.role.codebuild.backend.build',
    {
      name: `${Consts.PROJECT_NAME_UC}_CodeBuild_Backend_BuildRole`,
      assumeRolePolicy: Principals.CODEBUILD,
    },
    {
      deleteBeforeReplace: true,
    }
  );

  new iam.RolePolicy('iam.policy.codebuild.backend.build', {
    name: 'inline_policy',
    policy: Policy.CodeBuild_Backend_Build,
    role: role.id,
  });

  return role;
};

export default () => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Backend-Build`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project(
    'codebuild.project.backend.build',
    {
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
        ],
      },
      serviceRole: serviceRole.arn,
      source: {
        type: 'CODEPIPELINE',
        buildspec: 'buildspec/build.yml',
      },
    },
    { dependsOn: [serviceRole] }
  );

  return project;
};
