import { s3 } from '@pulumi/aws';
import CodeBuildBuild from './CodeBuildBuild';
import CodeBuildTest from './CodeBuildTest';
import CodeBuildPush from './CodeBuildPush';
import CodePipeline from './CodePipeline';
import { Initialize } from 'typings';

export default (): Initialize.CodePipeline.BackendOutputs => {
  // create codebuild backend
  const cbBuild = CodeBuildBuild();
  const cbTest = CodeBuildTest();
  const cbPush = CodeBuildPush();

  // create codebuild backend
  const pipeline = CodePipeline({
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
