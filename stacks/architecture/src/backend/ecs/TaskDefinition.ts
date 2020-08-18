import { ecs, iam } from '@pulumi/aws';
import { Consts, Principals, Policy } from '../../../../consts';
import { interpolate, Output } from '@pulumi/pulumi';
import { Backend } from 'typings';

export default (inputs: Backend.ECS.Inputs) => {
  const taskRole = getTaskRole();
  const execRole = getExecRole();

  const taskDef = new ecs.TaskDefinition(
    'ecs.task_definition',
    {
      containerDefinitions: TASK_DEFINITION({
        REPO_URL: inputs.TaskDef.REPO_URL,
        TABLE_GROUPS: inputs.TaskDef.TABLE_GROUPS,
        TABLE_HISTORY: inputs.TaskDef.TABLE_HISTORY,
        TABLE_USERS: inputs.TaskDef.TABLE_USERS,
        TABLE_WORDS: inputs.TaskDef.TABLE_WORDS,
        TABLE_WORD_MASTER: inputs.TaskDef.TABLE_WORD_MASTER,
        MP3_BUCKET: inputs.S3.Audio.bucket,
        PATH_PATTERN: 'audio',
        WORDS_LIMIT: 10,
      }),
      family: `${Consts.PROJECT_NAME_UC}`,
      taskRoleArn: taskRole.arn,
      executionRoleArn: execRole.arn,
      networkMode: 'awsvpc',
      requiresCompatibilities: ['FARGATE'],
      cpu: '256',
      memory: '512',
    },
    {
      dependsOn: [taskRole, execRole],
    }
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

interface TaskDefinition {
  TABLE_GROUPS: Output<string>;
  TABLE_USERS: Output<string>;
  TABLE_HISTORY: Output<string>;
  TABLE_WORD_MASTER: Output<string>;
  TABLE_WORDS: Output<string>;
  REPO_URL: Output<string>;
  MP3_BUCKET: Output<string>;
  PATH_PATTERN: string;
  WORDS_LIMIT: number;
}

const TASK_DEFINITION = (def: TaskDefinition) =>
  interpolate`[
    {
      "cpu": 0,
      "environment": [
        {
          "name": "WORDS_LIMIT",
          "value": "${def.WORDS_LIMIT}"
        },
        {
          "name": "TABLE_GROUPS",
          "value": "${def.TABLE_GROUPS}"
        },
        {
          "name": "TABLE_USERS",
          "value": "${def.TABLE_USERS}"
        },
        {
          "name": "TABLE_HISTORY",
          "value": "${def.TABLE_HISTORY}"
        },
        {
          "name": "MP3_BUCKET",
          "value": "${def.MP3_BUCKET}"
        },
        {
          "name": "TABLE_WORD_MASTER",
          "value": "${def.TABLE_WORD_MASTER}"
        },
        {
          "name": "TABLE_WORDS",
          "value": "${def.TABLE_WORDS}"
        },
        {
          "name": "PATH_PATTERN",
          "value": "${def.PATH_PATTERN}"
        }
      ],
      "essential": true,
      "image": "${def.REPO_URL}:latest",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-create-group": "true",
          "awslogs-group": "/ecs/PocketCards",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "mountPoints": [],
      "name": "Backend",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "${Consts.IPA_URL}",
          "valueFrom": "${Consts.SSM_KEY_IPA_URL}"
        },
        {
          "name": "${Consts.IPA_API_KEY}",
          "valueFrom": "${Consts.SSM_KEY_IPA_API_KEY}"
        },
        {
          "name": "${Consts.TRANSLATION_URL}",
          "valueFrom": "${Consts.SSM_KEY_TRANSLATION_URL}"
        },
        {
          "name": "${Consts.TRANSLATION_API_KEY}",
          "valueFrom": "${Consts.SSM_KEY_TRANSLATION_API_KEY}"
        },
        {
          "name": "${Consts.VISION_URL}",
          "valueFrom": "${Consts.SSM_KEY_VISION_URL}"
        },
        {
          "name": "${Consts.VISION_API_KEY}",
          "valueFrom": "${Consts.SSM_KEY_VISION_API_KEY}"
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
