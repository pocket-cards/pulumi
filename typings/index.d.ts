import { Output, OutputInstance } from '@pulumi/pulumi';
import { cloudfront, apigateway, apigatewayv2 } from '@pulumi/aws';
import { Backend } from './backend';

export * from './backend';
export * from './frontend';
export * from './install';
export * from './initial';

export interface Outputs {
  Bucket: {
    Audio: BucketOutputs;
    Images: BucketOutputs;
    Frontend: BucketOutputs;
    Artifacts: BucketOutputs;
  };
  Cognito: {
    UserPoolId: Output<string>;
    UserPoolClientId: Output<string>;
  };
  CloudFront: {
    Identity: cloudfront.OriginAccessIdentity;
    Distribution: cloudfront.Distribution;
  };
  APIGateway: {
    API: {
      Id: Output<string>;
      Arn: Output<string>;
      ExecutionArn: Output<string>;
      Endpoint: Output<string>;
    };
    // Authorizer: {
    //   Id: Output<string>;
    //   Name: Output<string>;
    //   AuthorizerType: Output<string>;
    //   JWTConfiguration: any;
    // };
    Integration: {
      Id: Output<string>;
    };
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
  ECS: ECSOutputs;
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

interface BucketOutputs {
  bucketName: Output<string>;
  bucketArn: Output<string>;
  bucketDomainName: Output<string>;
}

interface ECSOutputs {
  Cluster: {
    Name: Output<string>;
    Arn: Output<string>;
  };
  Service: {
    Arn: Output<string>;
    TaskDefinition: Output<string>;
    DesiredCount: Output<string>;
  };
}
