import { cognito } from '@pulumi/aws';
import { Consts } from '../../../consts';

export default (userpool: cognito.UserPool) => {
  return new cognito.UserPoolClient('cognito.userpoolclient', {
    userPoolId: userpool.id,
    name: `${Consts.PROJECT_NAME_UC}_UserPoolClient`,
    refreshTokenValidity: 30,
    explicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
  });
};
