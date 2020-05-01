import { ArtifactBucket, CodeBuildPulumi } from '../Resources';
import CodePipeline from './CodePipeline';

export default () => {
  // create codepipeline
  CodePipeline(CodeBuildPulumi, ArtifactBucket);
};
