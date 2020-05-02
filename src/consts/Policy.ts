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

export const CodeBuild_Pulumi = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "codebuild:*",
        "codepipeline:*",
        "logs:*",
        "s3:*",
        "iam:*Role",
        "iam:*RolePolicy"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
`;

export const CodeBuild_Pulumi_Attach = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cloudfront:*",
        "cognito-identity:*",
        "apigateway:*",
        "route53:*",
        "ecs:*",
        "ecr:*",
        "dynamodb:*",
        "cognito-idp:*",
        "acm:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
`;

export const CodeBuild_Backend = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cloudwatch:*",
        "codebuild:*",
        "codedeploy:*",
        "dynamodb:*",
        "ecr:*",
        "ecs:*",
        "iam:*Role",
        "iam:*RolePolicy",
        "iam:DeleteServiceLinkedRole",
        "iam:GetServiceLinkedRoleDeletionStatus",
        "ec2:Describe*",
        "lambda:GetFunctionConfiguration",
        "lambda:ListFunctions",
        "logs:*",
        "events:*",
        "sns:*",
        "s3:*",
        "ssm:*",
        "ssmmessages:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
`;

export const CodeBuild_Frontend = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cloudwatch:*",
        "codebuild:*",
        "codedeploy:*",
        "iam:*Role",
        "iam:*RolePolicy",
        "ec2:Describe*",
        "logs:*",
        "events:*",
        "sns:*",
        "s3:*",
        "ssm:*",
        "ssmmessages:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
`;
