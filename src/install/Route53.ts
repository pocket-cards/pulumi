import { route53 } from '@pulumi/aws';
import { Install } from 'typings';
import { Consts } from '../consts';

export default (): Install.Route53Outputs => {
  const zone = new route53.Zone(`${Consts.DOMAIN_NAME()}`, {
    name: Consts.DOMAIN_NAME(),
    comment: Consts.DOMAIN_NAME(),
    forceDestroy: false,
  });

  return {
    Zone: zone,
  };
};
