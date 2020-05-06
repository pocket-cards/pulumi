import { all, Output } from '@pulumi/pulumi';
import Frontend from './src/frontend';
import Backend from './src/backend';
import { Consts } from '../consts';
import { Outputs, Install, Initial } from 'typings';
import { INITIAL_STACK } from '../consts/Consts';

export let outputs: Output<Outputs>;

const start = () => {
  outputs = all([Consts.INSTALL_STACK.outputs, Consts.INITIAL_STACK.outputs]).apply<Outputs>(([item1, item2]) => {
    const install = item1.outputs as Install.Outputs;
    const init = item2.outputs as Initial.Outputs;

    // Frontend 構成
    const frontend = Frontend({
      Route53: { ...install.Route53 },
      Cognito: { ...init.Cognito },
      S3: {
        Artifacts: init.S3.Artifacts,
        Audio: init.S3.Audio,
        Frontend: init.S3.Frontend,
      },
      ACM: {
        Virginia: { ...install.ACM.Virginia },
      },
    });

    const backend = Backend({
      Route53: install.Route53,
      ECR: init.ECR,
      Cognito: init.Cognito,
      ACM: install.ACM,
    });

    const { ECS: ecsOutputs, VPC: vpcOutputs, APIGateway: apiOutputs } = backend;

    return {
      Bucket: {
        Artifacts: {
          bucketName: init.S3.Artifacts.bucket,
          bucketArn: init.S3.Artifacts.arn,
          bucketDomainName: init.S3.Artifacts.bucketDomainName,
        },
        Audio: {
          bucketName: init.S3.Audio.bucket,
          bucketArn: init.S3.Audio.arn,
          bucketDomainName: init.S3.Audio.bucketDomainName,
        },
        Frontend: {
          bucketName: init.S3.Frontend.bucket,
          bucketArn: init.S3.Frontend.arn,
          bucketDomainName: init.S3.Frontend.bucketDomainName,
        },
        Images: {
          bucketName: init.S3.Images.bucket,
          bucketArn: init.S3.Images.arn,
          bucketDomainName: init.S3.Images.bucketDomainName,
        },
      },
      Cognito: {
        UserPoolId: init.Cognito.UserPool.id,
        UserPoolClientId: init.Cognito.UserPoolClient.id,
      },
      CloudFront: {
        Identity: frontend.CloudFront.Identity,
        Distribution: frontend.CloudFront.Distribution,
      },
      APIGateway: apiOutputs,
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
    } as Outputs;
  });
};

start();
