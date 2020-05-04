import { route53, apigatewayv2 } from '@pulumi/aws';
import { Consts } from '../../../../consts';

export default (zone: route53.Zone, api: apigatewayv2.Api): void => {
  new route53.Record('route53.record.backend', {
    name: `api.${Consts.DOMAIN_NAME()}`,
    type: 'CNAME',
    zoneId: zone.id,
    records: [api.apiEndpoint],
    ttl: 300,
  });
};
