import { Bucket, DynamoDB, ECR, Cognito } from './src';
import { Initial } from 'typings';

export let outputs: Initial.Outputs;

const start = () => {
  const bucket = Bucket();
  // create dynamodb tables
  const dynamoDB = DynamoDB();
  // create cognito
  const cognito = Cognito();
  // create ECR
  const ecr = ECR();

  // create codepipeline backend
  // CodePipelineBk(install, ecr);
  // create codepipeline frontend
  // CodePipelineFr(bucket.Artifacts, cognito);

  outputs = {
    DynamoDB: dynamoDB,
    ECR: ecr,
    S3: bucket,
    Cognito: cognito,
  };
};

start();
