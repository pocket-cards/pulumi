import Parameters from './Parameters';
import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import Bucket from './Bucket';

export default () => {
  // parameter store
  const parameters = Parameters();
  // create artifact bucket
  const bucket = Bucket();
  // create CodeBuild
  const project = CodeBuild();
  // create codepipeline
  CodePipeline(project, bucket);

  return {
    ParameterStore: parameters,
    ArtifactBucket: bucket,
  };
};
