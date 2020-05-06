import { route53, cloudfront } from '@pulumi/aws';
import { Consts } from '../../../consts';

export default (zone: route53.Zone, distribution: cloudfront.Distribution): void => {
  new route53.Record('route53.record.frontend', {
    name: `card.${Consts.DOMAIN_NAME()}`,
    type: 'CNAME',
    zoneId: zone.id,
    records: [distribution.domainName],
    ttl: 300,
  });
};
