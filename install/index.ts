import Parameters from './src/Parameters';
import CodeBuild from './src/CodeBuild';
import CodePipeline from './src/CodePipeline';
import Bucket from './src/Bucket';
import Route53 from './src/Route53';
import { Install } from 'typings';
import { Output } from '@pulumi/pulumi';

export let outputs: any;
export let ArtifactBucket: { [key: string]: Output<string> };
export let BucketName: Output<string>;
export let BucketArn: Output<string>;

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

  // outputs = {
  //   Bucket: {
  //     Artifact: bucket.Artifact.,
  //   },
  // };
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

  ArtifactBucket = {
    BucketName: bucket.Artifact.bucket,
    BUcketArn: bucket.Artifact.bucket,
  };

  BucketName = bucket.Artifact.bucket;
  BucketArn = bucket.Artifact.arn;
};

start();
