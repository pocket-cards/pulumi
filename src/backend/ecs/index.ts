import { Backend } from 'typings';
import ECR from './ECR';
import CloudMap from './CloudMap';
import ECS from './ECS';
import ELB from './ELB';

export default (inputs: Backend.VPC.Outputs): Backend.ECS.Outputs => {
  const ecr = ECR();

  const map = CloudMap();

  // const alb = ELB(inputs);

  const ecs = ECS(
    ecr.Repository,
    map.Service,
    inputs.Subnets
    // alb.TargetGroup.arn
  );

  return {
    ...ecr,
    ...map,
    ...ecs,
  };
};
