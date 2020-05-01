import { Config, Output } from '@pulumi/pulumi';
import { codepipeline, iam, s3, codebuild } from '@pulumi/aws';
import { Envs, Principals, Policy, Consts } from '../consts';

const config = new Config();

export default (codebuild: codebuild.Project) => {
  // artifact bucket
  const artifact = new s3.Bucket(`${Consts.PROJECT_NAME}-artifact`, {
    acl: 'private',
  });

  // create pipeline
  const pipeline = createPipeline(artifact.bucket, codebuild.name);

  // create webhook
  createWebhook(pipeline.name);
};

/** Create CodePipeline */
const createPipeline = (bucketName: Output<string>, codebuildName: Output<string>) => {
  // codepipeline role
  const role = getRole();

  // backend pipeline
  return new codepipeline.Pipeline(`${Consts.PROJECT_NAME_UC}-Pulumi`, {
    artifactStore: {
      location: bucketName,
      type: 'S3',
    },
    roleArn: role.arn,
    stages: [
      {
        name: 'Source',
        actions: [
          {
            category: 'Source',
            configuration: {
              Branch: Envs.REPO_BRANCH(),
              Owner: Consts.REPO_OWNER,
              Repo: Consts.REPO_PULUMI,
              OAuthToken: config.require(Consts.GITHUB_WEBHOOK_SECRET),
            },
            name: 'Source',
            outputArtifacts: ['source_output'],
            owner: 'ThirdParty',
            provider: 'GitHub',
            version: '1',
          },
        ],
      },
      {
        actions: [
          {
            category: 'Build',
            configuration: {
              ProjectName: codebuildName,
            },
            inputArtifacts: ['source_output'],
            name: 'Build',
            outputArtifacts: ['build_output'],
            owner: 'AWS',
            provider: 'CodeBuild',
            version: '1',
          },
        ],
        name: 'Build',
      },
    ],
  });
};

/** CodePipeline Webhook */
const createWebhook = (pipeline: Output<string>) => {
  const webhookSecret = config.require(Consts.GITHUB_WEBHOOK_SECRET);

  new codepipeline.Webhook('pulumi', {
    authentication: 'GITHUB_HMAC',
    authenticationConfiguration: {
      secretToken: webhookSecret,
    },
    filters: [
      {
        jsonPath: '$.ref',
        matchEquals: 'refs/heads/{Branch}',
      },
    ],
    targetAction: 'Source',
    targetPipeline: pipeline,
  });
};

/** CodePipeline Role */
const getRole = () => {
  const role = new iam.Role(`${Consts.PROJECT_NAME_UC}_CodePipeline_PulumiRole`, {
    assumeRolePolicy: Principals.CODEPIPELINE,
  });

  new iam.RolePolicy('CodepipelinePolicy', {
    policy: Policy.CodePipeline_Backend,
    role: role.id,
  });

  return role;
};
