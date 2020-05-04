import CloudFront from './src/CloudFront';
import Tables from './src/DynamoDB';
import Bucket from './src/Bucket';
import CodePipelineBk from './src/codepipeline/backend';
import CodePipelineFr from './src/codepipeline/frontend';
import { Initialize } from 'typings';
import { Consts } from '../consts';
import { INSTALL_STACK } from '../consts/Consts';

export let outputs: Initialize.Outputs;

const start = () => {
  // create cloudfront identity
  const identity = CloudFront();

  const bucket = Bucket(identity);
  // create dynamodb tables
  const tables = Tables();

  // create codepipeline backend
  CodePipelineBk();
  // create codepipeline frontend
  CodePipelineFr();

  outputs = {
    DynamoDB: tables,
    Bucket: bucket,
    CloudFront: identity,
    // Test: values,
  };
};

start();
