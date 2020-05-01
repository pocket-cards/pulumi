import * as pulumi from '@pulumi/pulumi';
import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts } from '../../consts';

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(`${Consts.PROJECT_NAME_UC}_CodeBuild_BackendRole`, {
    assumeRolePolicy: Principals.CODEBUILD,
  });

  new iam.RolePolicy('codebuild_backend', {
    policy: Policy.CodeBuild_Pulumi,
    role: role.id,
  });

  return role;
};

export default () => {
  const resourceName = `${Consts.PROJECT_NAME_UC}-Backend`;
  // service role
  const serviceRole = getRole();

  const project = new codebuild.Project(resourceName, {
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
          value: pulumi.getStack(),
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
