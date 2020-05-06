import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Frontend } from 'typings';
import { codestarnotifications } from '@pulumi/aws';
import { Consts } from '../../../../consts';

export default (inputs: Frontend.CodePipeline.Inputs): Frontend.CodePipeline.Outputs => {
  // create codebuild backend
  const codebuild = CodeBuild(inputs.Cognito);
  // create codebuild backend
  const pipeline = CodePipeline(inputs.Bucket.Artifact, inputs.Bucket.Frontend, codebuild);

  new codestarnotifications.NotificationRule('codestar.notifications.rule.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_Frontend`,
    detailType: 'FULL',
    eventTypeIds: ['codepipeline-pipeline-pipeline-execution-succeeded'],
    resource: pipeline.arn,
    status: 'ENABLED',
    targets: [
      {
        type: 'SNS',
        address: inputs.SNSTopic.arn,
      },
    ],
  });

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
