import { s3, cloudfront } from '@pulumi/aws';
import { Frontend } from 'typings';
import { interpolate } from '@pulumi/pulumi';

export default (inputs: Frontend.Inputs, identity: cloudfront.OriginAccessIdentity) => {
  new s3.BucketPolicy('s3.bucketpolicy.audio', {
    bucket: inputs.S3.Audio.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "${identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${inputs.S3.Audio.arn}/*"
        }
      ]
    }
    `,
  });

  new s3.BucketPolicy('s3.bucketpolicy.frontend', {
    bucket: inputs.S3.Frontend.bucket,
    policy: interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
            "AWS": "${identity.iamArn}"
          },
          "Action": "s3:GetObject",
          "Resource": "${inputs.S3.Frontend.arn}/*"
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
