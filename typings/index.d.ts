import { Output, OutputInstance } from '@pulumi/pulumi';
import { cloudfront, apigateway, apigatewayv2 } from '@pulumi/aws';
import { Backend } from './backend';

export * from './backend';
export * from './frontend';
export * from './install';
export * from './initial';

export interface Outputs {
  Bucket: {
    Audio: Output<string>;
    Images: Output<string>;
    Frontend: Output<string>;
  };
  UserPoolId: Output<string>;
  UserPoolClientId: Output<string>;
  CloudFront: {
    Identity: cloudfront.OriginAccessIdentity;
    Distribution: cloudfront.Distribution;
  };
  APIGateway: Backend.API.Outputs;
  VPC: {
    Name?: Output<string>;
    Id: Output<string>;
    Arn: Output<string>;
    CidrBlock: Output<string>;
    DefaultRouteTable: Output<string>;
    EnableDnsHostnames: OutputInstance<boolean | undefined>;
    EnableDnsSupport: OutputInstance<boolean | undefined>;
  };
  SubnetIds: Output<string>[];
  // ECS: {
  //   Cluster: {
  //     Name: Output<string>;
  //     Arn: Output<string>;
  //   };
  //   Service: {
  //     DesiredCount: OutputInstance<number | undefined>;
  //     Id: Output<string>;
  //     TaskDefinition: Output<string>;
  //   };
  // };
  Test?: any;
}
