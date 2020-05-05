import { Output } from '@pulumi/pulumi';
import { Bucket, DynamoDB, ECR, CodePipelineBk, CodePipelineFr } from './src';
import { Consts } from '../consts';
import { Initial, Install } from 'typings';

export let outputs: Output<Initial.Outputs>;

const start = () => {
  outputs = Consts.INSTALL_STACK.outputs.apply<Initial.Outputs>((item) => {
    const install = item.outputs as Install.Outputs;

    const bucket = Bucket();
    // create dynamodb tables
    const dynamoDB = DynamoDB();

    const ecr = ECR();
    // create codepipeline backend
    CodePipelineBk(install, ecr);
    // create codepipeline frontend
    CodePipelineFr(install);

    return {
      DynamoDB: dynamoDB,
      Bucket: bucket,
      ECR: ecr,
    };
  });
};

start();
