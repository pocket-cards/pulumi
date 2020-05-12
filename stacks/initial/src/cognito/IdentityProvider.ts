import { cognito, ssm } from '@pulumi/aws';
import { Consts } from '../../../consts';
import { output } from '@pulumi/pulumi';

export default (userPool: cognito.UserPool) => {
  const provider = new cognito.IdentityProvider('cognito.identity.provider.google', {
    attributeMapping: {
      email: 'email',
      username: 'sub',
    },
    providerDetails: {
      authorize_scopes: 'profile email openid',
      client_id: output(
        ssm.getParameter(
          {
            name: Consts.SSM_KEY_GOOGLE_APP_CLIENT_ID,
          },
          { async: true }
        )
      ).value,
      client_secret: output(
        ssm.getParameter(
          {
            name: Consts.SSM_KEY_GOOGLE_APP_SECRET,
          },
          { async: true }
        )
      ).value,
    },
    providerName: 'Google',
    providerType: 'Google',
    userPoolId: userPool.id,
  });

  return provider;
};
