import { s3 } from '@pulumi/aws';
import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';
import { Initial } from 'typings';

export default (artifact: s3.Bucket, cognito: Initial.CognitoOutputs): Initial.CodePipeline.FrontendOutputs => {
  // create codebuild backend
  const codebuild = CodeBuild(cognito);
  // create codebuild backend
  const pipeline = CodePipeline(artifact, codebuild);

  return {
    CodeBuild: codebuild,
    CodePipeline: pipeline,
  };
};
