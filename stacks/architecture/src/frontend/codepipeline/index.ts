import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Frontend } from 'typings';

export default (inputs: Frontend.CodePipeline.Inputs): Frontend.CodePipeline.Outputs => {
  // create codebuild backend
  const codebuild = CodeBuild(inputs.Cognito);
  // create codebuild backend
  const pipeline = CodePipeline(inputs.Bucket, codebuild);

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
