import { servicediscovery } from '@pulumi/aws';
import { Backend } from 'typings';

export default (): Backend.ECS.CloudMapOutputs => {
  const namespace = new servicediscovery.HttpNamespace('servicediscovery.namespace.backend', {
    name: 'local',
  });

  const service = new servicediscovery.Service('servicediscovery.service.backend', {
    name: 'backend',
    dnsConfig: {
      dnsRecords: [
        {
          ttl: 60,
          type: 'A',
        },
      ],
      namespaceId: namespace.id,
      routingPolicy: 'MULTIVALUE',
    },
    healthCheckCustomConfig: {
      failureThreshold: 1,
    },
  });

  return {
    Namespace: namespace,
    Service: service,
  };
};
