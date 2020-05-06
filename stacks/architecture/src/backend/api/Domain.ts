import { apigatewayv2 } from '@pulumi/aws';
import { Consts } from '../../../../consts';
import { Install } from 'typings';

export default (acm: Install.ACM.Outputs) => {
  const domain = new apigatewayv2.DomainName('apigateway.domain', {
    domainName: `api.${Consts.DOMAIN_NAME()}`,
    domainNameConfiguration: {
      certificateArn: acm.Tokyo.Certificate.arn,
      endpointType: 'REGIONAL',
      securityPolicy: 'TLS_1_2',
    },
  });

  return domain;
};
