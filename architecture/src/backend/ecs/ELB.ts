import { ecr, lb, ec2, route53 } from '@pulumi/aws';
import { Consts } from '../../../../consts';
import { Backend } from 'typings';

export default (inputs: Backend.VPC.Outputs): Backend.ECS.ELBOutputs => {
  const loadbalancer = new lb.LoadBalancer('elb.loadbalancer.backend', {
    name: `${Consts.PROJECT_NAME}-alb`,
    internal: false,
    loadBalancerType: 'application',
    subnets: inputs.Subnets.map((item) => item.id),
    securityGroups: ['sg-02d1ced9b9b7c0ea7'],
    ipAddressType: 'ipv4',
    accessLogs: {
      enabled: false,
      bucket: '',
      prefix: '',
    },
    idleTimeout: 60,
    enableDeletionProtection: false,
    enableHttp2: true,
    enableCrossZoneLoadBalancing: false,
  });

  const targetGroup = new lb.TargetGroup('elb.targetgroup.backend', {
    name: `${Consts.PROJECT_NAME}-backend`,
    healthCheck: {
      interval: 30,
      path: '/',
      port: '8080',
      protocol: 'HTTP',
      timeout: 5,
      unhealthyThreshold: 2,
      healthyThreshold: 5,
      matcher: '200',
    },
    port: 80,
    protocol: 'HTTP',
    targetType: 'ip',
    vpcId: inputs.VPC.id,
    lambdaMultiValueHeadersEnabled: false,
    proxyProtocolV2: false,
  });

  const listener = new lb.Listener('elb.listener.backend', {
    loadBalancerArn: loadbalancer.arn,
    port: 80,
    protocol: 'HTTP',
    defaultActions: [
      {
        targetGroupArn: targetGroup.arn,
        type: 'forward',
      },
    ],
  });

  return {
    ALB: loadbalancer,
    Listener: listener,
    TargetGroup: targetGroup,
  };
};
