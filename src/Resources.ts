import * as pulumi from '@pulumi/pulumi';
import Bucket from './install/Bucket';
import CodeBuild from './install/CodeBuild';
import Parameters from './install/Parameters';

export const ArtifactBucket = Bucket();

export const CodeBuildPulumi = CodeBuild();

export const Config = new pulumi.Config();

export const ParameterStore = Parameters();
