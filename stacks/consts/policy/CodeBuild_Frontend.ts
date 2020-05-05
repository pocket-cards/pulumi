export default JSON.parse(`
{
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
`);
