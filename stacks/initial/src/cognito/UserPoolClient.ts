import { cognito } from '@pulumi/aws';
import { Consts, Envs } from '../../../consts';

export default (userpool: cognito.UserPool) => {
  const callbackUrls = [`https://card.${Consts.DOMAIN_NAME()}/login`];
  const logoutUrls = [`https://card.${Consts.DOMAIN_NAME()}/logout`];

  return new cognito.UserPoolClient('cognito.userpoolclient', {
    userPoolId: userpool.id,
    name: `${Consts.PROJECT_NAME_UC}_UserPoolClient`,
    refreshTokenValidity: 30,
    explicitAuthFlows: [
      'ALLOW_ADMIN_USER_PASSWORD_AUTH',
      'ALLOW_USER_SRP_AUTH',
      'ALLOW_REFRESH_TOKEN_AUTH',
      'ALLOW_CUSTOM_AUTH',
    ],
    allowedOauthFlows: ['code'],
    allowedOauthFlowsUserPoolClient: true,
    allowedOauthScopes: ['openid', 'phone', 'aws.cognito.signin.user.admin', 'profile', 'email'],
    callbackUrls: callbackUrls,
    logoutUrls: logoutUrls,
    preventUserExistenceErrors: 'ENABLED',
    supportedIdentityProviders: ['Google'],
  });
};
