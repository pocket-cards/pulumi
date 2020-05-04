import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Initialize, Install } from 'typings';

export default (inputs: Install.BucketOutputs): Initialize.CodePipeline.FrontendOutputs => {
  // create codebuild backend
  const codebuild = CodeBuild();
  // create codebuild backend
  const pipeline = CodePipeline(codebuild, inputs.Artifact);

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
