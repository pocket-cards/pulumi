import { cognito } from '@pulumi/aws';

export default (pool: cognito.UserPool) => {
  const domain = new cognito.UserPoolDomain('cognito.userpool.domain', {
    domain: 'card',
    userPoolId: pool.id,
  });

  return domain;
};
