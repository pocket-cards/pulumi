import Install from './src/install';
import Initialize from './src/initialize';
import Frontend from './src/frontend';
import Backend from './src/backend';
import { Consts } from './src/consts';
import { Outputs } from 'typings';
import { route53 } from '@pulumi/aws';

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

  outputs = {
    Bucket: {
      Artifact: install.Bucket.Artifact.bucket,
    },
    UserPoolId: frontend.Cognito.UserPool.id,
    UserPoolClientId: frontend.Cognito.UserPoolClient.id,
    DynamoDB: init.DynamoDB,
    CloudFront: {
      Identity: init.CloudFront.Identity.iamArn,
    },
    Test: backend,
  };
};

start();
