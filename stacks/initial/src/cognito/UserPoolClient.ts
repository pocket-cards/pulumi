import { cognito } from '@pulumi/aws';
import { Consts } from '../../../consts';

export default (userpool: cognito.UserPool) => {
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
    callbackUrls: ['http://localhost:3000/login'],
    logoutUrls: ['http://localhost:3000/logout'],
    preventUserExistenceErrors: 'ENABLED',
    supportedIdentityProviders: ['Google'],
  });
};
