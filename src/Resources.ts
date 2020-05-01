import * as pulumi from '@pulumi/pulumi';
import Bucket from './install/Bucket';
import CodeBuild from './install/CodeBuild';

export const ArtifactBucket = Bucket();

export const CodeBuildPulumi = CodeBuild();

export const Config = new pulumi.Config();
