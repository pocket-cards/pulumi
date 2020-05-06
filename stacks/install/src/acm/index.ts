import { route53 } from '@pulumi/aws';
import { Install } from 'typings';
import Certificates from './Certificates';
import Validations from './Validations';

export default (zone: route53.Zone): Install.ACM.Outputs => {
  const certs = Certificates();

  const record = new route53.Record('route53.record.acm', {
    name: certs.Tokyo.domainValidationOptions[0].resourceRecordName,
    records: [certs.Tokyo.domainValidationOptions[0].resourceRecordValue],
    ttl: 60,
    type: certs.Tokyo.domainValidationOptions[0].resourceRecordType,
    zoneId: zone.id,
  });

  const valids = Validations(record, certs);

  return {
    Record: record,
    Tokyo: {
      Certificate: certs.Tokyo,
      CertificateValidation: valids.Tokyo,
    },
    Virginia: {
      Certificate: certs.Virginia,
      CertificateValidation: valids.Virginia,
    },
  };
};
