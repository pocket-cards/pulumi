import { Initialize } from 'typings';
import { s3, cloudfront } from '@pulumi/aws';
import { Consts } from '../consts';
import { interpolate } from '@pulumi/pulumi';

export default (cloudfront: Initialize.CloudFrontOutputs): Initialize.S3Outputs => {
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

const createAudio = (cloudfront: Initialize.CloudFrontOutputs) => {
  const bucket = new s3.Bucket(`${Consts.PROJECT_NAME}-frontend`, {
    acl: 'private',
  });

  new s3.BucketPolicy('bucket.policy.audio', {
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

const createFrontend = (cloudfront: Initialize.CloudFrontOutputs) => {
  const bucket = new s3.Bucket(`${Consts.PROJECT_NAME}-audio`, {
    acl: 'private',
  });

  new s3.BucketPolicy('bucket.policy.frontend', {
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
    `,
  });

  return bucket;
};
