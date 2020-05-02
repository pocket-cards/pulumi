import { acm, route53, Provider } from '@pulumi/aws';
import { Frontend, Initialize } from 'typings';
import { Consts, Envs } from '../consts';

export default (dns: Initialize.Route53Outputs): Frontend.AMCOutputs => {
  const cert = new acm.Certificate(
    'certificate.frontend',
    {
      domainName: `card.${Consts.DOMAIN_NAME()}`,
      subjectAlternativeNames: [`card.${Consts.DOMAIN_NAME()}`],
      validationMethod: 'DNS',
    },
    { provider: Envs.PROVIDER_US }
  );

  const validation = new route53.Record('certificate.record', {
    name: cert.domainValidationOptions[0].resourceRecordName,
    records: [cert.domainValidationOptions[0].resourceRecordValue],
    ttl: 60,
    type: cert.domainValidationOptions[0].resourceRecordType,
    zoneId: dns.Zone.id,
  });

  new acm.CertificateValidation('certificate.validation', {
    certificateArn: cert.arn,
    validationRecordFqdns: [validation.fqdn],
  });

  return {
    Certificate: cert,
  };
};
