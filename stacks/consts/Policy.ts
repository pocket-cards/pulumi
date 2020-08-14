export const CodePipeline = JSON.parse(`{
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
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    }
  ]
}
`);

export { default as CodeBuild_Pulumi } from './policy/CodeBuild_Pulumi';
export { default as CodeBuild_Pulumi_Attach } from './policy/CodeBuild_Pulumi_Attach';
export { default as CodeBuild_Backend_Build } from './policy/CodeBuild_Backend_Build';
export { default as CodeBuild_Backend_Test } from './policy/CodeBuild_Backend_Test';
export { default as CodeBuild_Backend_Push } from './policy/CodeBuild_Backend_Push';
export { default as CodeBuild_Frontend } from './policy/CodeBuild_Frontend';
export { default as ECS_Task } from './policy/ECS_Task';
export { default as ECS_TaskExecution } from './policy/ECS_TaskExecution';
export { default as Cognito_Authenticated } from './policy/Cognito_Authenticated';
export { default as Lambda_Basic } from './policy/Lambda_Basic';
export { default as Lambda_Dynamodb } from './policy/Lambda_Dynamodb';
export { default as Lambda_CloudFront_Invalidation } from './policy/Lambda_CloudFront_Invalidation';
export { default as SNS_Topic } from './policy/SNS_Topic';
