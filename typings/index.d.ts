import { Output } from '@pulumi/pulumi';

export * from './backend.d';
export * from './frontend.d';
export * from './install.d';
export * from './initialize.d';

import { Initialize } from './initialize';

export interface Outputs {
  Bucket: {
    Artifact: Output<string>;
  };
  UserPoolId: Output<string>;
  UserPoolClientId: Output<string>;
  DynamoDB: Initialize.DynamoDBOutputs;
  CloudFront: {
    Identity: Output<string>;
  };
  Test?: any;
}
