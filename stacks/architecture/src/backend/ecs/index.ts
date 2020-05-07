import { Backend, Initial } from 'typings';
import Cluster from './Cluster';
import TaskDefinition from './TaskDefinition';
import Service from './Service';
import CloudMap from './CloudMap';

export default (inputs: Backend.ECS.Inputs): Backend.ECS.Outputs => {
  // const map = CloudMap();
  // const alb = ELB(inputs);

  const cluster = Cluster();
  const taskDef = TaskDefinition(inputs);
  const service = Service(cluster, taskDef, inputs);

  return {
    // ...map,
    Cluster: cluster,
    TaskDefinition: taskDef,
    ECSService: service,
  };
};
