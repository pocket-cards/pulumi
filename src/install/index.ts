import Parameters from './Parameters';
import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import Bucket from './Bucket';
import Route53 from './Route53';
import { Install } from 'typings/install';

export default (): Install.Outputs => {
  const route53 = Route53();
  // parameter store
  const parameters = Parameters();
  // create artifact bucket
  const bucket = Bucket();
  // create CodeBuild
  const codebuild = CodeBuild();
  // create codepipeline
  const pipeline = CodePipeline(codebuild, bucket);

  return {
    ParameterStore: parameters,
    Bucket: {
      Artifact: bucket.Artifact,
    },
    Route53: route53,
    Role: {
      CodeBuildPulumi: codebuild.CodeBuildRole,
      CodePipelinePulumi: pipeline.CodePipelineRole,
    },
  };
};
