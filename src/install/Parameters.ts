import { Config } from '@pulumi/pulumi';
import { ssm } from '@pulumi/aws';
import { Consts } from '../consts';

const config = new Config();

export default () => {
  // github
  const github = new ssm.Parameter(Consts.GITHUB_WEBHOOK_SECRET.toLowerCase(), {
    name: Consts.SSM_KEY_GITHUB_WEBHOOK_SECRET,
    type: 'SecureString',
    value: config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET),
  });

  // pulumi
  const pulumi = new ssm.Parameter(Consts.PULUMI_ACCESS_TOKEN.toLowerCase(), {
    name: Consts.SSM_KEY_PULUMI_ACCESS_TOKEN,
    type: 'SecureString',
    value: config.requireSecret(Consts.PULUMI_ACCESS_TOKEN),
  });

  return { github, pulumi };
};
