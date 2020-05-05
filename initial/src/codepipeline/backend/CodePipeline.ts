import { Output, Config } from '@pulumi/pulumi';
import { codepipeline, iam, s3 } from '@pulumi/aws';
import { Envs, Principals, Policy, Consts } from '../../../../consts';
import { Initial, Install } from 'typings';

const config = new Config();

export default (inputs: Install.BucketOutputs, codebuild: Initial.CodePipeline.BackendCodeBuildOutputs) => {
  // create pipeline
  const pipeline = createPipeline(inputs.Artifact, codebuild);

  // create webhook
  createWebhook(pipeline.name);

  return pipeline;
};

/** Create CodePipeline */
const createPipeline = (artifact: s3.Bucket, codebuild: Initial.CodePipeline.BackendCodeBuildOutputs) => {
  // codepipeline role
  const role = getRole(artifact.arn);

  // backend pipeline
  return new codepipeline.Pipeline(
    'codepipeline.pipeline.backend',
    {
      name: `${Consts.PROJECT_NAME_UC}-Backend`,
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
                Repo: Consts.REPO_BACKEND,
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
                ProjectName: codebuild.Build.name,
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
        {
          actions: [
            {
              category: 'Test',
              configuration: {
                ProjectName: codebuild.Test.name,
                PrimarySource: 'source_output',
              },
              inputArtifacts: ['source_output', 'build_output'],
              name: 'Test',
              owner: 'AWS',
              provider: 'CodeBuild',
              version: '1',
            },
          ],
          name: 'Test',
        },
        {
          actions: [
            {
              category: 'Build',
              configuration: {
                ProjectName: codebuild.Push.name,
              },
              inputArtifacts: ['build_output'],
              name: 'Push',
              owner: 'AWS',
              provider: 'CodeBuild',
              version: '1',
            },
          ],
          name: 'Push',
        },
      ],
    }
    // {
    //   ignoreChanges: ['stages[0].actions[0].configuration.OAuthToken'],
    // }
  );
};

/** CodePipeline Webhook */
const createWebhook = (pipeline: Output<string>) => {
  const webhookSecret = config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET);

  new codepipeline.Webhook('codepipeline.webhook.backend', {
    authentication: 'GITHUB_HMAC',
    authenticationConfiguration: {
      secretToken: webhookSecret,
    },
    filters: [
      {
        jsonPath: '$.ref',
        matchEquals: 'refs/heads/master',
      },
    ],
    targetAction: 'Source',
    targetPipeline: pipeline,
  });
};

/** CodePipeline Role */
const getRole = (bucketArn: Output<string>) => {
  const role = new iam.Role('iam.role.codepipeline.backend', {
    name: `${Consts.PROJECT_NAME_UC}_CodePipeline_BackendRole`,
    assumeRolePolicy: Principals.CODEPIPELINE,
  });

  new iam.RolePolicy('iam.policy.codepipeline.backend', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.CodePipeline(bucketArn),
  });

  return role;
};
