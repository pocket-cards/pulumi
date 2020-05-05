import Parameters from './src/Parameters';
import CodeBuild from './src/CodeBuild';
import CodePipeline from './src/CodePipeline';
import Bucket from './src/Bucket';
import Route53 from './src/Route53';
import { Install } from 'typings';

export let outputs: Install.Outputs;

const start = () => {
  const route53 = Route53();
  // parameter store
  const parameters = Parameters();
  // create artifact bucket
  const bucket = Bucket();
  // create CodeBuild
  const codebuild = CodeBuild();
  // create codepipeline
  const pipeline = CodePipeline(codebuild, bucket);

  outputs = {
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

start();
