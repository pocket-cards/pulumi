import CodeBuildBuild from './CodeBuildBuild';
import CodeBuildTest from './CodeBuildTest';
import CodeBuildPush from './CodeBuildPush';
import CodePipeline from './CodePipeline';
import { Initial, Install } from 'typings';

export default (inputs: Install.Outputs, ecr: Initial.ECROutputs): Initial.CodePipeline.BackendOutputs => {
  // create codebuild backend
  const cbBuild = CodeBuildBuild();
  const cbTest = CodeBuildTest();
  const cbPush = CodeBuildPush(ecr);

  // create codebuild backend
  const pipeline = CodePipeline(inputs.Bucket, {
    Build: cbBuild,
    Test: cbTest,
    Push: cbPush,
  });

  return {
    CodeBuild: {
      Build: cbBuild,
      Test: cbTest,
      Push: cbPush,
    },
    CodePipeline: pipeline,
  };
};
