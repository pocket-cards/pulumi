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
      Route53: {
        Zone: install.Route53.Zone,
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
      ECR: init.ECR,
    });

    const { ECS: ecsOutputs, VPC: vpcOutputs, APIGateway: apiOutputs } = backend;

    return {
      Bucket: {
        // Artifact: install.Bucket.Artifact.bucket,
        Audio: init.Bucket.Audio.bucket,
        Frontend: init.Bucket.Frontend.bucket,
        Images: init.Bucket.Images.bucket,
      },
      UserPoolId: backend.Cognito.UserPool.id,
      UserPoolClientId: backend.Cognito.UserPoolClient.id,
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
