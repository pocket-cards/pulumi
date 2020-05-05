import { ecs, iam, ecr } from '@pulumi/aws';
import { Consts, Principals, Policy, Envs } from '../../../../consts';
import { interpolate, Output } from '@pulumi/pulumi';

export default (repo: ecr.Repository) => {
  const taskRole = getTaskRole();
  const execRole = getExecRole();

  const taskDef = new ecs.TaskDefinition(
    'ecs.task_definition',
    {
      containerDefinitions: TASK_DEFINITION(repo.repositoryUrl),
      family: `${Consts.PROJECT_NAME_UC}`,
      taskRoleArn: taskRole.arn,
      executionRoleArn: execRole.arn,
      networkMode: 'awsvpc',
      requiresCompatibilities: ['FARGATE'],
      cpu: '256',
      memory: '512',
    },
    { dependsOn: [taskRole, execRole] }
  );

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
        "awslogs-region": "${Envs.DEFAULT_REGION}",
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
