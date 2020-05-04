import { Backend } from 'typings';
import ECR from './ECR';
import Cluster from './Cluster';
import TaskDefinition from './TaskDefinition';
import Service from './Service';
import CloudMap from './CloudMap';

export default (inputs: Backend.VPC.Outputs): Backend.ECS.Outputs => {
  const ecr = ECR();

  // const map = CloudMap();

  // const alb = ELB(inputs);
  const cluster = Cluster();
  const taskDef = TaskDefinition(ecr.Repository);
  const service = Service(cluster, taskDef, inputs);

  return {
    ...ecr,
    // ...map,
    Cluster: cluster,
    TaskDefinition: taskDef,
    ECSService: service,
  };
};
