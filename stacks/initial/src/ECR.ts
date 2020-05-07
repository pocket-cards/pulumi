import { ecr } from '@pulumi/aws';
import { Initial } from 'typings';
import { Consts } from '../../consts';

export default (): Initial.ECROutputs => {
  const backend = new ecr.Repository('ecr.repo.backend', {
    name: `${Consts.PROJECT_NAME}/backend`,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'MUTABLE',
  });

  new ecr.LifecyclePolicy('ecr.lifecycle.policy.backend', {
    policy: `{
      "rules": [
        {
          "rulePriority": 1,
          "description": "Expire images older than 1 days",
          "selection": {
              "tagStatus": "untagged",
              "countType": "sinceImagePushed",
              "countUnit": "days",
              "countNumber": 1
          },
          "action": {
              "type": "expire"
          }
        }
      ]
    }
  `,
    repository: backend.name,
  });

  const testing = new ecr.Repository('ecr.repo.backend.testing', {
    name: `${Consts.PROJECT_NAME}/backend-testing`,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'MUTABLE',
  });

  new ecr.LifecyclePolicy('ecr.lifecycle.policy.backend.testing', {
    policy: `{
      "rules": [
        {
          "rulePriority": 1,
          "description": "Expire images older than 1 days",
          "selection": {
              "tagStatus": "untagged",
              "countType": "sinceImagePushed",
              "countUnit": "days",
              "countNumber": 1
          },
          "action": {
              "type": "expire"
          }
        }
      ]
    }
  `,
    repository: testing.name,
  });

  return {
    Backend: backend,
    BackendTesting: testing,
  };
};
