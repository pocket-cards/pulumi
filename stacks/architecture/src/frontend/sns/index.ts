import { lambda, sns } from '@pulumi/aws';
import Topic from './Topic';
import Lambda from './Lambda';
import { Frontend } from 'typings';

export default (inputs: Frontend.SNS.Inputs): Frontend.SNS.Outputs => {
  const topic = Topic();

  const func = Lambda(inputs.Distribution);

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

  return {
    Topic: topic,
  };
};
