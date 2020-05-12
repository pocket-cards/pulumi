import { Output, Config, output } from '@pulumi/pulumi';
import { codepipeline, iam, codebuild, s3, ssm } from '@pulumi/aws';
import { Envs, Principals, Policy, Consts } from '../../../../consts';

export default (artifact: s3.Bucket, frontend: s3.Bucket, project: codebuild.Project) => {
  // create pipeline
  const pipeline = createPipeline(artifact, frontend, project.name);

  // create webhook
  createWebhook(pipeline.name);

  return pipeline;
};

/** Create CodePipeline */
const createPipeline = (artifact: s3.Bucket, frontend: s3.Bucket, projectName: Output<string>) => {
  // codepipeline role
  const role = getRole();

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
                OAuthToken: output(
                  ssm.getParameter(
                    {
                      name: Consts.SSM_KEY_GITHUB_WEBHOOK_SECRET,
                    },
                    { async: true }
                  )
                ).value,
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
        {
          actions: [
            {
              name: 'Deploy',
              owner: 'AWS',
              provider: 'S3',
              category: 'Deploy',
              inputArtifacts: ['build_output'],
              configuration: {
                BucketName: frontend.bucket,
                Extract: 'true',
              },
              version: '1',
            },
          ],
          name: 'Deploy',
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
  const webhookSecret = output(
    ssm.getParameter(
      {
        name: Consts.SSM_KEY_GITHUB_WEBHOOK_SECRET,
      },
      { async: true }
    )
  ).value;

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
const getRole = () => {
  const role = new iam.Role('iam.role.codepipeline.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_CodePipeline_FrontendRole`,
    assumeRolePolicy: Principals.CODEPIPELINE,
  });

  new iam.RolePolicy('iam.policy.codepipeline.frontend', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.CodePipeline,
  });

  return role;
};
