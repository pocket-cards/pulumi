import CodeBuild from './CodeBuild';
import CodePipeline from './CodePipeline';

export default () => {
  // create codebuild
  const project = CodeBuild();
  // create codepipeline
  CodePipeline(project);
};
