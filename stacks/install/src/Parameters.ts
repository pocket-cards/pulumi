import { Config } from '@pulumi/pulumi';
import { ssm } from '@pulumi/aws';
import { Consts } from '../../consts';

const config = new Config();

export default (): void => {
  // github
  new ssm.Parameter('ssm.parameter.github_webhook_secret', {
    name: Consts.SSM_KEY_GITHUB_WEBHOOK_SECRET,
    type: 'SecureString',
    value: config.requireSecret(Consts.GITHUB_WEBHOOK_SECRET),
    overwrite: true,
  });

  // pulumi
  new ssm.Parameter('ssm.parameter.pulumi_access_token', {
    name: Consts.SSM_KEY_PULUMI_ACCESS_TOKEN,
    type: 'SecureString',
    value: config.requireSecret(Consts.PULUMI_ACCESS_TOKEN),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.ipa_url', {
    name: Consts.SSM_KEY_IPA_URL,
    type: 'SecureString',
    value: config.requireSecret(Consts.IPA_URL),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.ipa_api_key', {
    name: Consts.SSM_KEY_IPA_API_KEY,
    type: 'SecureString',
    value: config.requireSecret(Consts.IPA_API_KEY),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.translation_url', {
    name: Consts.SSM_KEY_TRANSLATION_URL,
    type: 'SecureString',
    value: config.requireSecret(Consts.TRANSLATION_URL),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.translation_api_key', {
    name: Consts.SSM_KEY_TRANSLATION_API_KEY,
    type: 'SecureString',
    value: config.requireSecret(Consts.TRANSLATION_API_KEY),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.google_app_client_id', {
    name: Consts.SSM_KEY_GOOGLE_APP_CLIENT_ID,
    type: 'SecureString',
    value: config.requireSecret(Consts.GOOGLE_APP_CLIENT_ID),
    overwrite: true,
  });

  new ssm.Parameter('ssm.parameter.google_app_secret', {
    name: Consts.SSM_KEY_GOOGLE_APP_SECRET,
    type: 'SecureString',
    value: config.requireSecret(Consts.GOOGLE_APP_SECRET),
    overwrite: true,
  });
};
