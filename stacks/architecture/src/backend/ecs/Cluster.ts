import { ecs } from '@pulumi/aws';
import { Consts } from '../../../../consts';

export default () =>
  new ecs.Cluster('ecs.cluster', {
    name: `${Consts.PROJECT_NAME}-cluster`,
    capacityProviders: ['FARGATE_SPOT', 'FARGATE'],
    settings: [
      {
        name: 'containerInsights',
        value: 'enabled',
      },
    ],
  });
