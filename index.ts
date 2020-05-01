import * as pulumi from '@pulumi/pulumi';
// import * as aws from "@pulumi/aws";
// import * as awsx from "@pulumi/awsx";

import Install from './src/install';

console.log(process.env.ENVIRONMENT);
// インストール
if (process.env.ENVIRONMENT === 'local') {
  Install();
}
