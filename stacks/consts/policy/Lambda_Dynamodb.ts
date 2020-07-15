export default JSON.parse(`
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Effect": "Allow",
          "Action": [
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
              "dynamodb:GetItem",
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:UpdateItem"
          ],
          "Resource": "arn:aws:dynamodb:*:*:table/*"
      },
      {
          "Effect": "Allow",
          "Action": [
              "dynamodb:Scan",
              "dynamodb:Query"
          ],
          "Resource": "arn:aws:dynamodb:*:*:table/*/index/*"
      },
      {
          "Effect": "Allow",
          "Action": [
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
              "logs:PutLogEvents"
          ],
          "Resource": "*"
      }
  ]
}
`);
