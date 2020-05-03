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
    Route53: install.Route53,
    CloudFront: init.CloudFront,
    Bucket: init.Bucket,
  });

  const backend = Backend({ Route53: install.Route53 });

  new route53.Record('route53.record.backend', {
    name: `api.${Consts.DOMAIN_NAME()}`,
    type: 'A',
    zoneId: install.Route53.Zone.id,
    aliases: [
      {
        name: backend.ECS.ELB.ALB.dnsName,
        zoneId: backend.ECS.ELB.ALB.zoneId,
        evaluateTargetHealth: true,
      },
    ],
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
    // Test: backend,
  };
};

start();
