import { Envs } from '..';
import { interpolate } from '@pulumi/pulumi';

export default interpolate`
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "SNS:GetTopicAttributes",
        "SNS:SetTopicAttributes",
        "SNS:AddPermission",
        "SNS:RemovePermission",
        "SNS:DeleteTopic",
        "SNS:Subscribe",
        "SNS:ListSubscriptionsByTopic",
        "SNS:Publish",
        "SNS:Receive"
      ],
      "Resource": "arn:aws:sns:${Envs.DEFAULT_REGION}:${Envs.ACCOUNT_ID}:*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceOwner": "${Envs.ACCOUNT_ID}"
        }
      }
    }
  ]
}
`;
