export default JSON.parse(`
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cognito-identity:*",
        "apigateway:*",
        "dynamodb:*",
        "cloudfront:*",
        "ssm:*",
        "ecs:*",
        "route53:*",
        "ecr:*",
        "cognito-idp:*",
        "acm:*",
        "servicediscovery:*",
        "elasticloadbalancing:*",
        "ec2:*InternetGateway*",
        "ec2:*Route",
        "ec2:*RouteTable*",
        "ec2:*SecurityGroup*",
        "ec2:*AvailabilityZones*",
        "ec2:Describe*",
        "ec2:*VPC*",
        "ec2:*Tags*",
        "ec2:*NetworkInterface*",
        "ec2:*Subnet*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
`);
