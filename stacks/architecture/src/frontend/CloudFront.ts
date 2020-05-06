import { cloudfront } from '@pulumi/aws';
import { Frontend } from 'typings';
import { Consts } from '../../../consts';

export default ({
  Bucket,
  Identity,
  CertificateValidation,
}: Frontend.CloudFront.Inputs): Frontend.CloudFront.Outputs => {
  const distribution = new cloudfront.Distribution('cloudfront.frontend', {
    aliases: [`card.${Consts.DOMAIN_NAME()}`],
    origins: [
      {
        customOriginConfig: {
          httpPort: 80,
          httpsPort: 443,
          originKeepaliveTimeout: 5,
          originProtocolPolicy: 'https-only',
          originReadTimeout: 30,
          originSslProtocols: ['TLSv1'],
        },
        domainName: `api.${Consts.DOMAIN_NAME()}`,
        originId: 'api',
        originPath: '/api',
      },
      {
        domainName: Bucket.Audio.bucketDomainName,
        originId: 'audio',
        originPath: '',
        s3OriginConfig: {
          originAccessIdentity: Identity.cloudfrontAccessIdentityPath,
        },
      },
      {
        domainName: Bucket.Frontend.bucketDomainName,
        originId: 'frontend',
        originPath: '',
        s3OriginConfig: {
          originAccessIdentity: Identity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    defaultCacheBehavior: {
      allowedMethods: ['HEAD', 'DELETE', 'POST', 'GET', 'OPTIONS', 'PUT', 'PATCH'],
      cachedMethods: ['HEAD', 'GET'],
      compress: false,
      defaultTtl: 86400,
      forwardedValues: {
        cookies: {
          forward: 'none',
        },
        queryString: false,
      },
      maxTtl: 31536000,
      minTtl: 0,
      smoothStreaming: false,
      targetOriginId: 'frontend',
      viewerProtocolPolicy: 'redirect-to-https',
    },
    orderedCacheBehaviors: [
      {
        allowedMethods: ['HEAD', 'GET', 'OPTIONS'],
        cachedMethods: ['HEAD', 'GET'],
        compress: true,
        defaultTtl: 3600,
        fieldLevelEncryptionId: '',
        forwardedValues: {
          cookies: {
            forward: 'none',
          },
          queryString: false,
        },
        maxTtl: 86400,
        minTtl: 0,
        pathPattern: '/audio/*',
        smoothStreaming: false,
        targetOriginId: 'audio',
        viewerProtocolPolicy: 'redirect-to-https',
      },
    ],
    customErrorResponses: [
      {
        errorCachingMinTtl: 3000,
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/index.html',
      },
    ],
    comment: '',
    priceClass: 'PriceClass_All',
    enabled: true,
    viewerCertificate: {
      acmCertificateArn: CertificateValidation.certificateArn,
      minimumProtocolVersion: 'TLSv1.1_2016',
      sslSupportMethod: 'sni-only',
    },
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    httpVersion: 'http2',
    isIpv6Enabled: false,
  });

  return {
    Distribution: distribution,
  };
};
