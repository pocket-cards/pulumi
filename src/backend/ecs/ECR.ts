import { ecr } from '@pulumi/aws';
import { Consts } from '../../consts';
import { Backend } from 'typings';

export default (): Backend.ECS.ECROutputs => {
  const repo = new ecr.Repository('ecr.repo', {
    name: Consts.PROJECT_NAME,
    imageScanningConfiguration: {
      scanOnPush: false,
    },
    imageTagMutability: 'MUTABLE',
  });

  return {
    Repository: repo,
  };
};
