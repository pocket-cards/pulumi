import { all, Output, StackReference } from '@pulumi/pulumi';
import Frontend from './src/frontend';
import Backend from './src/backend';
import { Consts } from '../consts';
import { Outputs, Install, Initial } from 'typings';

export let outputs: Output<Outputs>;

const INSTALL_STACK = new StackReference(Consts.INSTALL_STACK_NAME);
const INITIAL_STACK = new StackReference(Consts.INITIAL_STACK_NAME);

const start = () => {
  outputs = all([INSTALL_STACK.outputs, INITIAL_STACK.outputs]).apply<Outputs>(([item1, item2]) => {
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
      ECR: init.ECR.Backend,
      Cognito: { ...init.Cognito },
      ACM: install.ACM.Tokyo.Certificate,
      DynamoDB: { ...init.DynamoDB },
      S3: {
        Audio: init.S3.Audio,
      },
    });

    const { ECS: ecsOutputs, VPC: vpcOutputs, APIGateway: apiOutputs } = backend;
    const {
      CloudFront: { Distribution: distribution, Identity: identity },
    } = frontend;

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
        IdentityPoolId: init.Cognito.IdentityPool.id,
      },
      CloudFront: {
        Arn: distribution.arn,
        DomainName: distribution.domainName,
        Enabled: distribution.enabled,
        Origins: distribution.origins.apply((origins) =>
          origins.map((item) => ({
            DomainName: item.domainName,
            OriginId: item.originId,
            OriginPath: item.originPath,
          }))
        ),
        CertificateArn: distribution.viewerCertificate.acmCertificateArn,
        IdentityId: identity.id,
        AccessIdentityPath: identity.cloudfrontAccessIdentityPath,
      },
      APIGateway: {
        API: {
          Id: apiOutputs.API.id,
          Arn: apiOutputs.API.arn,
          Endpoint: apiOutputs.API.apiEndpoint,
          ExecutionArn: apiOutputs.API.executionArn,
        },
        Authorizer: {
          Id: apiOutputs.Authorizer.id,
          Name: apiOutputs.Authorizer.name,
          AuthorizerType: apiOutputs.Authorizer.authorizerType,
        },
        Integration: [
          {
            Id: apiOutputs.Integration.id,
            Uri: apiOutputs.Integration.integrationUri,
            Method: apiOutputs.Integration.integrationMethod,
            Type: apiOutputs.Integration.integrationType,
          },
        ],
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
          Arn: ecsOutputs.ECSService.id,
          TaskDefinition: ecsOutputs.TaskDefinition.id,
          DesiredCount: ecsOutputs.ECSService.desiredCount,
        },
      },
      // Test: backend,
    } as Outputs;
  });
};

start();
