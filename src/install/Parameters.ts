import { Config } from '@pulumi/pulumi';
import { ssm } from '@pulumi/aws';
import { Consts } from '../consts';
import { Install } from 'typings/install';

const config = new Config();

export default (): Install.ParameterOutputs => {
  // github
  const github = new ssm.Parameter('ssm.parameter.github_webhook_secret', {
    name: Consts.SSM_KEY_GITHUB_WEBHOOK_SECRET,
    type: 'SecureString',
    value: config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET),
    overwrite: true,
  });

  // pulumi
  const pulumi = new ssm.Parameter('ssm.parameter.pulumi_access_token', {
    name: Consts.SSM_KEY_PULUMI_ACCESS_TOKEN,
    type: 'SecureString',
    value: config.requireSecret(Consts.PULUMI_ACCESS_TOKEN),
    overwrite: true,
  });

  return { Github: github, Pulumi: pulumi };
};
