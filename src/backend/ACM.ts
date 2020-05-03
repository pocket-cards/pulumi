import { acm, route53 } from '@pulumi/aws';
import { Consts } from '../consts';
import { Backend } from 'typings';

export default (inputs: Backend.Inputs): Backend.ACMOutputs => {
  const cert = new acm.Certificate('certificate.backend', {
    domainName: `*.${Consts.DOMAIN_NAME()}`,
    validationMethod: 'DNS',
  });

  const record = new route53.Record('route53.record.backend', {
    name: cert.domainValidationOptions[0].resourceRecordName,
    records: [cert.domainValidationOptions[0].resourceRecordValue],
    ttl: 60,
    type: cert.domainValidationOptions[0].resourceRecordType,
    zoneId: inputs.Route53.Zone.id,
  });

  const validation = new acm.CertificateValidation(
    'certificate.validation.backend',
    {
      certificateArn: cert.arn,
      validationRecordFqdns: [record.fqdn],
    },
    {
      customTimeouts: {
        create: '10m',
        update: '10m',
      },
    }
  );

  return {
    Certificate: cert,
    CertificateValidation: validation,
  };
};
