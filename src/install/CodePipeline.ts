import { Output, Config } from '@pulumi/pulumi';
import { codepipeline, iam, s3 } from '@pulumi/aws';
import { Envs, Principals, Policy, Consts } from '../consts';
import { Install } from 'typings/install';

const config = new Config();

export default (codebuild: Install.CodeBuildOutputs, bucket: Install.BucketOutputs): Install.CodePipelineOutputs => {
  // create pipeline
  const pipeline = createPipeline(codebuild.CodeBuild.name, bucket.Artifact);

  // create webhook
  const webhook = createWebhook(pipeline.pipeline.name);

  return {
    CodePipeline: pipeline.pipeline,
    CodePipelineRole: pipeline.role,
    CodePipelineWebhook: webhook,
  };
};

/** Create CodePipeline */
const createPipeline = (codebuildName: Output<string>, artifact: s3.Bucket) => {
  // codepipeline role
  const role = getRole(artifact.arn);

  // backend pipeline
  const pipeline = new codepipeline.Pipeline(
    `${Consts.PROJECT_NAME_UC}-Pulumi`,
    {
      artifactStore: {
        location: artifact.bucket,
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
                OAuthToken: config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET),
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
    },
    {
      ignoreChanges: ['stages[0].actions[0].configuration.OAuthToken'],
    }
  );

  return { role, pipeline };
};

/** CodePipeline Webhook */
const createWebhook = (pipeline: Output<string>) => {
  const webhookSecret = config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET);

  return new codepipeline.Webhook('pulumi', {
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
const getRole = (bucketArn: Output<string>) => {
  const role = new iam.Role(`${Consts.PROJECT_NAME_UC}_CodePipeline_PulumiRole`, {
    assumeRolePolicy: Principals.CODEPIPELINE,
  });

  new iam.RolePolicy('CodepipelinePolicy', {
    role: role.id,
    policy: Policy.CodePipeline(bucketArn),
  });

  return role;
};
