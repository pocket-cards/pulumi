import { s3 } from '@pulumi/aws';
import { Frontend } from 'typings';
import { interpolate } from '@pulumi/pulumi';

export default ({ Bucket: { Frontend, Audio }, Identity }: Frontend.BucketPolicy.Inputs): void => {
  new s3.BucketPolicy('s3.bucketpolicy.audio', {
    bucket: Audio.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "${Identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${Audio.arn}/*"
        }
      ]
    }
    `,
  });

  new s3.BucketPolicy('s3.bucketpolicy.frontend', {
    bucket: Frontend.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
            "AWS": "${Identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${Frontend.arn}/*"
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
};
