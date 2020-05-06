import { acm } from '@pulumi/aws';
import { Consts, Envs } from '../../../consts';

export default () => {
  const tokyo = new acm.Certificate(
    'certificate.tokyo',
    {
      domainName: `*.${Consts.DOMAIN_NAME()}`,
      validationMethod: 'DNS',
    },
    { protect: true }
  );

  const virginia = new acm.Certificate(
    'certificate.virginia',
    {
      domainName: `*.${Consts.DOMAIN_NAME()}`,
      validationMethod: 'DNS',
    },
    { provider: Envs.PROVIDER_US, protect: true }
  );

  return {
    Tokyo: tokyo,
    Virginia: virginia,
  };
};
