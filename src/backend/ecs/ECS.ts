import { interpolate, Output, output } from '@pulumi/pulumi';
import { ecs, iam, getRegion, ecr, servicediscovery, ec2 } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../../consts';
import { Backend } from 'typings';

export default (
  repo: ecr.Repository,
  serviceReg: servicediscovery.Service,
  subnets: ec2.Subnet[]
  // targetGroupArn?: Output<string>
): Backend.ECS.ECSOutputs => {
  // ECS Cluster
  const cluster = new ecs.Cluster('ecs.cluster', {
    name: `${Consts.PROJECT_NAME}-cluster`,
    capacityProviders: ['FARGATE_SPOT', 'FARGATE'],
    settings: [
      {
        name: 'containerInsights',
        value: 'enabled',
      },
    ],
  });

  const taskDef = getTaskDefinition(repo);

  // ECS Service
  const service = new ecs.Service('ecs.service', {
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
      securityGroups: ['sg-0043a1dcdd0220a73'],
      subnets: subnets.map((item) => item.id),
    },
    serviceRegistries: {
      containerPort: 0,
      port: 0,
      registryArn: serviceReg.arn,
    },
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

  return {
    Cluster: cluster,
    ECSService: service,
    TaskDefinition: taskDef,
  };
};

const getTaskDefinition = (repo: ecr.Repository) => {
  const taskRole = getTaskRole();
  const execRole = getExecRole();

  const taskDef = new ecs.TaskDefinition('ecs.task_definition', {
    containerDefinitions: TASK_DEFINITION(repo.repositoryUrl),
    family: `${Consts.PROJECT_NAME_UC}`,
    taskRoleArn: taskRole.arn,
    executionRoleArn: execRole.arn,
    networkMode: 'awsvpc',
    requiresCompatibilities: ['FARGATE'],
    cpu: '256',
    memory: '512',
  });

  return taskDef;
};

const getTaskRole = () => {
  const role = new iam.Role('iam.role.ecs.task', {
    name: `${Consts.PROJECT_NAME_UC}_ECSTaskRole`,
    assumeRolePolicy: Principals.ECS_TASKS,
  });

  new iam.RolePolicy('iam.policy.ecs.task', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.ECS_Task,
  });

  return role;
};

const getExecRole = () => {
  const role = new iam.Role('iam.role.ecs.task_execution', {
    name: `${Consts.PROJECT_NAME_UC}_ECSTaskExecutionRole`,
    assumeRolePolicy: Principals.ECS_TASKS,
  });

  new iam.RolePolicy('iam.policy.ecs.task_execution', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.ECS_TaskExecution,
  });

  return role;
};

const TASK_DEFINITION = (url: Output<string>) =>
  interpolate`[
  {
    "cpu": 0,
    "environment": [],
    "essential": true,
    "image": "${url}:latest",
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/PocketCards",
        "awslogs-region": "${output(getRegion(undefined, { async: true })).name}",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "mountPoints": [],
    "name": "Backend",
    "portMappings": [
      {
        "containerPort": 8080,
        "hostPort": 8080,
        "protocol": "tcp"
      }
    ],
    "volumesFrom": []
  }
]`.apply((item) =>
    item
      .split('\n')
      .map((row) => row.trim().replace(/ /g, ''))
      .join('')
  );
