import CodeBuildBuild from './CodeBuildBuild';
import CodeBuildTest from './CodeBuildTest';
import CodeBuildPush from './CodeBuildPush';
import CodePipeline from './CodePipeline';
import { Initialize, Install } from 'typings';

export default (inputs: Install.BucketOutputs): Initialize.CodePipeline.BackendOutputs => {
  // create codebuild backend
  const cbBuild = CodeBuildBuild();
  const cbTest = CodeBuildTest();
  const cbPush = CodeBuildPush();

  // create codebuild backend
  const pipeline = CodePipeline(
    {
      Build: cbBuild,
      Test: cbTest,
      Push: cbPush,
    },
    inputs.Artifact
  );

  return {
    CodeBuild: {
      Build: cbBuild,
      Test: cbTest,
      Push: cbPush,
    },
    CodePipeline: pipeline,
  };
};
