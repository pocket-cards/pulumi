import { lambda, sns } from '@pulumi/aws';
import Topic from './Topic';
import Lambda from './Lambda';

export default () => {
  const topic = Topic();

  const func = Lambda();

  new lambda.Permission('lambda.permission.sns.frontend', {
    statementId: 'lambda-permission-sns-frontend',
    action: 'lambda:InvokeFunction',
    function: func.name,
    principal: 'sns.amazonaws.com',
    sourceArn: topic.arn,
  });

  new sns.TopicSubscription('sns.topic.subscription.frontend', {
    endpoint: func.arn,
    protocol: 'lambda',
    topic: topic.arn,
  });
};
