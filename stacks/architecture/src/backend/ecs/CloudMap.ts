import { servicediscovery } from '@pulumi/aws';
import { Backend } from 'typings';

export default (): Backend.ECS.CloudMapOutputs => {
  const namespace = new servicediscovery.HttpNamespace('servicediscovery.namespace.backend', {
    name: 'local',
  });

  const service = new servicediscovery.Service('servicediscovery.service.backend', {
    name: 'backend',
    namespaceId: namespace.id,
    healthCheckCustomConfig: {
      failureThreshold: 1,
    },
  });

  return {
    Namespace: namespace,
    Service: service,
  };
};
