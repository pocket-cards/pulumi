import Install from './src/install';
import Initialize from './src/initialize';
import Frontend from './src/frontend';
import { Outputs } from 'typings';

export let outputs: Outputs;

(() => {
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

  // outputs = {
  //   Bucket: {
  //     Artifact: install.Bucket.Artifact.bucket,
  //   },
  //   UserPoolId: frontend.Cognito.UserPool.id,
  //   UserPoolClientId: frontend.Cognito.UserPoolClient.id,
  //   DynamoDB: init.DynamoDB,
  //   CloudFront: {
  //     Identity: init.CloudFront.Identity.iamArn,
  //   },
  //   // Test: init,
  // };
})();
