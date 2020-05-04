import { ecr } from '@pulumi/aws';
import { Consts } from '../../../../consts';
import { Backend } from 'typings';

export default (): Backend.ECS.ECROutputs => {
  const repo = new ecr.Repository('ecr.repo.backend', {
    name: `${Consts.PROJECT_NAME}/backend`,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'IMMUTABLE',
  });

  new ecr.Repository('ecr.repo.backend.testing', {
    name: `${Consts.PROJECT_NAME}/backend-testing`,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'IMMUTABLE',
  });

  return {
    Repository: repo,
  };
};
