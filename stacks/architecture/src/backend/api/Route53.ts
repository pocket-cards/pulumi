import { route53, apigatewayv2 } from '@pulumi/aws';
import { Consts } from '../../../../consts';

export default (zone: route53.Zone, domain: apigatewayv2.DomainName): void => {
  new route53.Record('route53.record.backend', {
    name: `api.${Consts.DOMAIN_NAME()}`,
    type: 'CNAME',
    zoneId: zone.id,
    records: [domain.domainNameConfiguration.targetDomainName],
    ttl: 300,
  });
};
