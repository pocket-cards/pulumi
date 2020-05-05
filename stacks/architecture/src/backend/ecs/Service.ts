import { ecs, ec2 } from '@pulumi/aws';
import { interpolate } from '@pulumi/pulumi';
import { Backend } from 'typings';

export default (cluster: ecs.Cluster, taskDef: ecs.TaskDefinition, inputs: Backend.VPC.Outputs) => {
  const sg = new ec2.SecurityGroup('ecs.service.sg', {
    vpcId: inputs.VPC.id,
    egress: [
      {
        cidrBlocks: ['0.0.0.0/0'],
        fromPort: 0,
        protocol: '-1',
        toPort: 0,
      },
    ],
    ingress: [
      {
        fromPort: 0,
        protocol: '-1',
        self: true,
        toPort: 0,
      },
    ],
  });

  // ECS Service
  return new ecs.Service('ecs.service', {
    name: 'backend',
    cluster: cluster.arn,
    desiredCount: 0,
    // launchType: 'FARGATE',
    platformVersion: 'LATEST',
    taskDefinition: interpolate`${taskDef.id}:${taskDef.revision.apply((item) => item.toString())}`,
    deploymentMaximumPercent: 200,
    deploymentMinimumHealthyPercent: 100,
    networkConfiguration: {
      assignPublicIp: true,
      securityGroups: [sg.id],
      subnets: inputs.Subnets.map((item) => item.id),
    },
    // serviceRegistries: {
    //   containerPort: 0,
    //   port: 0,
    //   registryArn: serviceReg.arn,
    // },
    // loadBalancers: [
    //   {
    //     containerName: 'Backend',
    //     containerPort: 8080,
    //     targetGroupArn: targetGroupArn,
    //   },
    // ],
    capacityProviderStrategies: [
      {
        capacityProvider: 'FARGATE_SPOT',
        weight: 1,
        base: 0,
      },
    ],
  });
};
