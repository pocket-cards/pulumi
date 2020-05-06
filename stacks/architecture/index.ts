import { all, Output } from '@pulumi/pulumi';
import Frontend from './src/frontend';
import Backend from './src/backend';
import { Consts } from '../consts';
import { Outputs, Install, Initial } from 'typings';

export let outputs: Output<Outputs>;

const start = () => {
  outputs = all([Consts.INSTALL_STACK.outputs, Consts.INITIAL_STACK.outputs]).apply<Outputs>(([item1, item2]) => {
    const install = item1.outputs as Install.Outputs;
    const init = item2.outputs as Initial.Outputs;

    // Frontend 構成
    const frontend = Frontend({
      Route53: install.Route53,
      S3: init.S3,
    });

    const backend = Backend({
      Route53: install.Route53,
      ECR: init.ECR,
      Cognito: init.Cognito,
    });

    const { ECS: ecsOutputs, VPC: vpcOutputs, APIGateway: apiOutputs } = backend;

    return {
      Bucket: {
        // Artifact: install.Bucket.Artifact.bucket,
        Audio: init.S3.Audio.bucket,
        Frontend: init.S3.Frontend.bucket,
        Images: init.S3.Images.bucket,
      },
      UserPoolId: init.Cognito.UserPool.id,
      UserPoolClientId: init.Cognito.UserPoolClient.id,
      CloudFront: {
        Identity: frontend.Identity.iamArn,
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
  });
};

start();
