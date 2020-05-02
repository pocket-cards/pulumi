import AttachPolicy from './AttachPolicy';
import CloudFront from './CloudFront';
import Tables from './DynamoDB';
import Bucket from './Bucket';
import CodeBuildBk from './codebuild/Backend';
import CodeBuildFr from './codebuild/Frontend';
import CodePipelineBk from './codepipeline/Backend';
import CodePipelineFr from './codepipeline/Frontend';
import { Install, Initialize } from 'typings';

export default (install: Install.Outputs): Initialize.Outputs => {
  // attach policy
  AttachPolicy(install.Role.CodeBuildPulumi);

  // create cloudfront identity
  const identity = CloudFront();

  const bucket = Bucket(identity);
  // create dynamodb tables
  const tables = Tables();

  // create codebuild backend
  const cbbk = CodeBuildBk();
  // create codebuild frontend
  const cbfr = CodeBuildFr();

  // create codepipeline backend
  CodePipelineBk(cbbk, install.Bucket.Artifact);
  // create codepipeline frontend
  CodePipelineFr(cbfr, install.Bucket.Artifact);

  return {
    DynamoDB: tables,
    Bucket: bucket,
    CloudFront: identity,
  };
};
