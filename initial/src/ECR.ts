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

  const testing = new ecr.Repository('ecr.repo.backend.testing', {
    name: `${Consts.PROJECT_NAME}/backend-testing`,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'MUTABLE',
  });

  return {
    Backend: backend,
    BackendTesting: testing,
  };
};
