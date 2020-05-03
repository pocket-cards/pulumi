import { Backend } from 'typings';
import VPC from './vpc';
import ECS from './ecs';

export default (inputs: Backend.Inputs): Backend.Outputs => {
  const vpc = VPC();

  const ecs = ECS(vpc);

  return {
    VPC: vpc,
    ECS: ecs,
  };
};
