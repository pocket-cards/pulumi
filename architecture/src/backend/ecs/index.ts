import { Backend, Initial } from 'typings';
import Cluster from './Cluster';
import TaskDefinition from './TaskDefinition';
import Service from './Service';
import CloudMap from './CloudMap';

export default (inputs: Initial.ECROutputs, vpc: Backend.VPC.Outputs): Backend.ECS.Outputs => {
  // const map = CloudMap();
  // const alb = ELB(inputs);

  const cluster = Cluster();
  const taskDef = TaskDefinition(inputs.Backend);
  const service = Service(cluster, taskDef, vpc);

  return {
    // ...map,
    Cluster: cluster,
    TaskDefinition: taskDef,
    ECSService: service,
  };
};
