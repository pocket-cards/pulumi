import Install from './src/install';
import Initialize from './src/initialize';
import Frontend from './src/frontend';
import Backend from './src/backend';
import { Consts } from './src/consts';
import { Outputs } from 'typings';
import { route53, ecs } from '@pulumi/aws';
import { output } from '@pulumi/pulumi';

export let outputs: Outputs;

const start = () => {
  // インストール
  const install = Install();

  // ローカルはインストールのみ
  if (process.env.ENVIRONMENT === 'local') return;

  // 初期化
  const init = Initialize(install);

  // Frontend 構成
  const frontend = Frontend({
    Route53: {
      Zone: install.Route53.Zone,
    },
    CloudFront: {
      Identity: init.CloudFront.Identity,
    },
    S3: {
      Audio: init.Bucket.Audio,
      Frontend: init.Bucket.Frontend,
      Images: init.Bucket.Images,
    },
  });

  const backend = Backend({
    Route53: {
      Zone: install.Route53.Zone,
    },
    Cognito: {
      UserPool: frontend.Cognito.UserPool,
      UserPoolClient: frontend.Cognito.UserPoolClient,
    },
  });

  const { ECS: ecsOutputs, VPC: vpcOutputs, APIGateway: apiOutputs } = backend;

  outputs = {
    Bucket: {
      Artifact: install.Bucket.Artifact.bucket,
      Audio: init.Bucket.Audio.bucket,
      Frontend: init.Bucket.Frontend.bucket,
      Images: init.Bucket.Images.bucket,
    },
    UserPoolId: frontend.Cognito.UserPool.id,
    UserPoolClientId: frontend.Cognito.UserPoolClient.id,
    DynamoDB: init.DynamoDB,
    CloudFront: {
      Identity: init.CloudFront.Identity.iamArn,
    },
    APIGateway: {
      Endpoint: apiOutputs.API.apiEndpoint,
    },
    VPC: {
      Id: vpcOutputs.VPC.id,
      Arn: vpcOutputs.VPC.arn,
      CidrBlock: vpcOutputs.VPC.cidrBlock,
      DefaultRouteTable: vpcOutputs.VPC.defaultRouteTableId,
      EnableDnsHostnames: vpcOutputs.VPC.enableDnsHostnames,
      EnableDnsSupport: vpcOutputs.VPC.enableDnsSupport,
    },
    SubnetIds: vpcOutputs.Subnets.map((item) => item.id),
    ECS: {
      Cluster: {
        Name: ecsOutputs.Cluster.name,
        Arn: ecsOutputs.Cluster.arn,
      },
      Service: {
        Id: ecsOutputs.ECSService.id,
        TaskDefinition: ecsOutputs.TaskDefinition.id,
        DesiredCount: ecsOutputs.ECSService.desiredCount,
      },
    },
    // Test: backend,
  };
};

start();
