import { s3 } from '@pulumi/aws';
import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Initialize } from 'typings';

export default (): Initialize.CodePipeline.FrontendOutputs => {
  // create codebuild backend
  const codebuild = CodeBuild();
  // create codebuild backend
  const pipeline = CodePipeline(codebuild);

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
