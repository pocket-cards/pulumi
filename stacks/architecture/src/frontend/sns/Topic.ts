import { sns } from '@pulumi/aws';
import { Consts, Policy } from '../../../../consts';

export default () => {
  const topic = new sns.Topic('sns.topic.pipeline.frontend', {
    name: `${Consts.PROJECT_NAME_UC}_Pipeline_Frontend`,
    displayName: 'Codepipeline frontend build success',
  });

  // new sns.TopicPolicy('sns.topicpolicy.pipeline.frontend', {
  //   policy: Policy.SNS_Topic,
  //   arn: topic.arn,
  // });

  return topic;
};
