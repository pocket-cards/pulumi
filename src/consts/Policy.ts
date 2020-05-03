import { Output, interpolate } from '@pulumi/pulumi';

export const CodePipeline = (bucketArn: Output<string>) => interpolate`{
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

export const CodeBuild_Pulumi = require('./policy/CodeBuild_Pulumi.json');

export const CodeBuild_Pulumi_Attach = require('./policy/CodeBuild_Pulumi_Attach.json');

export const CodeBuild_Backend = require('./policy/CodeBuild_Backend.json');

export const CodeBuild_Frontend = require('./policy/CodeBuild_Frontend.json');

export const ECS_Tasks = require('./policy/ECS_Tasks.json');
