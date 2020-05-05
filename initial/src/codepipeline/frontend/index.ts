import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Initial, Install } from 'typings';

export default (inputs: Install.Outputs): Initial.CodePipeline.FrontendOutputs => {
  // create codebuild backend
  const codebuild = CodeBuild();
  // create codebuild backend
  const pipeline = CodePipeline(inputs.Bucket, codebuild);

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
