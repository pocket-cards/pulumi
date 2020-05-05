import { interpolate } from '@pulumi/pulumi';
import { s3 } from '@pulumi/aws';
import { Consts } from '../../consts';
import { Initial } from 'typings';

export default (cloudfront: Initial.CloudFrontOutputs): Initial.S3Outputs => {
  const audio = createAudio(cloudfront);

  const frontend = createFrontend(cloudfront);

  const images = new s3.Bucket(`${Consts.PROJECT_NAME}-images`, {
    acl: 'private',
    lifecycleRules: [
      {
        enabled: true,
        expiration: {
          days: 30,
        },
      },
    ],
  });

  return {
    Audio: audio,
    Images: images,
    Frontend: frontend,
  };
};

const createAudio = (cloudfront: Initial.CloudFrontOutputs) => {
  const bucket = new s3.Bucket(`${Consts.PROJECT_NAME}-audio`, {
    acl: 'private',
  });

  new s3.BucketPolicy('s3.bucketpolicy.audio', {
    bucket: bucket.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "${cloudfront.Identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${bucket.arn}/*"
        }
      ]
    }
    `,
  });

  return bucket;
};

const createFrontend = (cloudfront: Initial.CloudFrontOutputs) => {
  const bucket = new s3.Bucket(`${Consts.PROJECT_NAME}-frontend`, {
    acl: 'private',
  });

  new s3.BucketPolicy('s3.bucketpolicy.frontend', {
    bucket: bucket.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
            "AWS": "${cloudfront.Identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${bucket.arn}/*"
        }
      ]
    }
    `.apply((item) =>
      item
        .split('\n')
        .map((item) => item.trim())
        .join('')
    ),
  });

  return bucket;
};
