import { Output, OutputInstance } from '@pulumi/pulumi';

export * from './backend.d';
export * from './frontend.d';
export * from './install.d';
export * from './initialize.d';

import { Initialize } from './initialize';

export interface Outputs {
  Bucket: {
    Artifact: Output<string>;
    Audio: Output<string>;
    Images: Output<string>;
    Frontend: Output<string>;
  };
  UserPoolId: Output<string>;
  UserPoolClientId: Output<string>;
  DynamoDB: Initialize.DynamoDBOutputs;
  CloudFront: {
    Identity: Output<string>;
  };
  APIGateway: {
    Endpoint: Output<string>;
  };
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
  ECS: {
    Cluster: {
      Name: Output<string>;
      Arn: Output<string>;
    };
    Service: {
      DesiredCount: OutputInstance<number | undefined>;
      Id: Output<string>;
      TaskDefinition: Output<string>;
    };
  };
  Test?: any;
}
