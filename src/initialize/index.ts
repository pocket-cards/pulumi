import { s3 } from '@pulumi/aws';
import Tables from './DynamoDB';
import CodeBuildBk from './codebuild/Backend';
import CodeBuildFr from './codebuild/Frontend';
import CodePipelineBk from './codepipeline/Backend';
import CodePipelineFr from './codepipeline/Frontend';

export default (bucket: s3.Bucket) => {
  // create dynamodb tables
  Tables();

  // create codebuild backend
  const cbbk = CodeBuildBk();
  // create codebuild frontend
  const cbfr = CodeBuildFr();

  // create codepipeline backend
  CodePipelineBk(cbbk, bucket);
  // create codepipeline frontend
  CodePipelineFr(cbfr, bucket);
};
