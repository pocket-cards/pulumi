import { Backend } from 'typings';
import ECR from './ECR';
import CloudMap from './CloudMap';
import ECS from './ECS';
import ELB from './ELB';

export default (inputs: Backend.VPC.Outputs): Backend.ECS.Outputs => {
  const ecr = ECR();

  const map = CloudMap();

  const alb = ELB(inputs);

  const ecs = ECS(
    ecr.Repository,
    map.Service,
    [inputs.Subnet.Subnet1.id, inputs.Subnet.Subnet2.id],
    alb.TargetGroup.arn
  );

  return {
    ECR: ecr,
    ECS: ecs,
    CloudMap: map,
    ELB: alb,
  };
};
