import { Output, interpolate } from '@pulumi/pulumi';

export const CodePipeline_Pulumi = (bucketArn: Output<string>) => interpolate`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObject"
      ],
      "Resource": [
        "${bucketArn}",
        "${bucketArn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
`;

export const CodeBuild_Pulumi = require('./policy/codebuild_pulumi.json');
