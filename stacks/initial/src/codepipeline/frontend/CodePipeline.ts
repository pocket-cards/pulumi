import { Output, Config } from '@pulumi/pulumi';
import { codepipeline, iam, codebuild, s3 } from '@pulumi/aws';
import { Envs, Principals, Policy, Consts } from '../../../../consts';

const config = new Config();

export default (artifact: s3.Bucket, project: codebuild.Project) => {
  // create pipeline
  const pipeline = createPipeline(artifact, project.name);

  // create webhook
  createWebhook(pipeline.name);

  return pipeline;
};

/** Create CodePipeline */
const createPipeline = (artifact: s3.Bucket, projectName: Output<string>) => {
  // codepipeline role
  const role = getRole(artifact.arn);

  // backend pipeline
  return new codepipeline.Pipeline(
    'codepipeline.pipeline.frontend',
    {
      name: `${Consts.PROJECT_NAME_UC}-Frontend`,
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
                Repo: Consts.REPO_FRONTEND,
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
                ProjectName: projectName,
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
    }
    // {
    //   ignoreChanges: ['stages[0].actions[0].configuration.OAuthToken'],
    // }
  );
};

/** CodePipeline Webhook */
const createWebhook = (pipeline: Output<string>) => {
  const webhookSecret = config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET);

  new codepipeline.Webhook('codepipeline.webhook.frontend', {
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
  const role = new iam.Role('iam.role.codepipeline.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_CodePipeline_FrontendRole`,
    assumeRolePolicy: Principals.CODEPIPELINE,
  });

  new iam.RolePolicy('iam.policy.codepipeline.frontend', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.CodePipeline(bucketArn),
  });

  return role;
};
