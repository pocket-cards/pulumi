import { codebuild, iam } from '@pulumi/aws';
import { Principals, Policy, Consts } from '../consts';

export default () => {
  const resourceName = `${Consts.PROJECT_NAME_UC}_CodeBuild_Pulumi`;
  // service role
  const serviceRole = getRole(resourceName);

  const project = new codebuild.Project(resourceName, {
    artifacts: {
      type: 'CODEPIPELINE',
    },
    buildTimeout: 30,
    description: 'pulumi build',
    environment: {
      type: 'LINUX_CONTAINER',
      computeType: 'BUILD_GENERAL1_SMALL',
      image: 'aws/codebuild/standard:4.0',
      imagePullCredentialsType: 'CODEBUILD',
      // environmentVariables: [
      //   {
      //     name: 'SOME_KEY1',
      //     value: 'SOME_VALUE1',
      //   },
      //   {
      //     name: 'SOME_KEY2',
      //     type: 'PARAMETER_STORE',
      //     value: 'SOME_VALUE2',
      //   },
      // ],
    },
    serviceRole: serviceRole.arn,
    source: {
      type: 'CODEPIPELINE',
      buildspec: 'buildspec.yml',
    },
  });

  return project;
};

/** CodePipeline Role */
const getRole = (resourceName: string) => {
  const role = new iam.Role(`${resourceName}Role`, {
    assumeRolePolicy: Principals.CODEBUILD,
  });

  new iam.RolePolicy('codebuild', {
    policy: Policy.CodeBuild_Backend,
    role: role.id,
  });

  return role;
};
