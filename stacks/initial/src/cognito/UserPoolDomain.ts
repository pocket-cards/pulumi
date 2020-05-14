import { cognito } from '@pulumi/aws';
import { Envs } from '../../../consts';

export default (pool: cognito.UserPool) => {
  const domainName = Envs.IS_DEV ? 'card-dev' : 'card';

  const domain = new cognito.UserPoolDomain('cognito.userpool.domain', {
    domain: domainName,
    userPoolId: pool.id,
  });

  return domain;
};
