import CloudFront from './CloudFront';
import Tables from './DynamoDB';
import Bucket from './Bucket';
import CodePipelineBk from './codepipeline/backend';
import CodePipelineFr from './codepipeline/frontend';
import { Install, Initialize } from 'typings';

export default (install: Install.Outputs): Initialize.Outputs => {
  // create cloudfront identity
  const identity = CloudFront();

  const bucket = Bucket(identity);
  // create dynamodb tables
  const tables = Tables();

  // create codepipeline backend
  CodePipelineBk(install.Bucket);
  // create codepipeline frontend
  CodePipelineFr(install.Bucket);

  return {
    DynamoDB: tables,
    Bucket: bucket,
    CloudFront: identity,
  };
};
