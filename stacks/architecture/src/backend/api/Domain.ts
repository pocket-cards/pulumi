import { apigatewayv2, acm } from '@pulumi/aws';
import { Consts } from '../../../../consts';

export default (cert: acm.Certificate) => {
  const domain = new apigatewayv2.DomainName('apigateway.domain', {
    domainName: `api.${Consts.DOMAIN_NAME()}`,
    domainNameConfiguration: {
      certificateArn: cert.arn,
      endpointType: 'REGIONAL',
      securityPolicy: 'TLS_1_2',
    },
  });

  return domain;
};
