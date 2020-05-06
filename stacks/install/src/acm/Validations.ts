import { acm, route53 } from '@pulumi/aws';
import { Install } from 'typings';
import { Envs } from '../../../consts';

export default (record: route53.Record, certs: Install.ACM.Certificates): Install.ACM.Validations => {
  const tokyo = new acm.CertificateValidation(
    'certificate.validation.tokyo',
    {
      certificateArn: certs.Tokyo.arn,
      validationRecordFqdns: [record.fqdn],
    },
    {
      customTimeouts: {
        create: '15m',
        update: '15m',
      },
    }
  );

  const virginia = new acm.CertificateValidation(
    'certificate.validation.virginia',
    {
      certificateArn: certs.Virginia.arn,
      validationRecordFqdns: [record.fqdn],
    },
    {
      customTimeouts: {
        create: '15m',
        update: '15m',
      },
      provider: Envs.PROVIDER_US,
    }
  );

  return {
    Tokyo: tokyo,
    Virginia: virginia,
  };
};
