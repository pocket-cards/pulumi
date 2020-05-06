import { Backend } from 'typings';
import VPC from './vpc';
import ECS from './ecs';
import APIGateway from './api';

export default (inputs: Backend.Inputs): Backend.Outputs => {
  const vpc = VPC();

  const ecs = ECS(inputs.ECR, vpc);

  const api = APIGateway({ Route53: inputs.Route53, Cognito: inputs.Cognito });

  return {
    VPC: vpc,
    ECS: ecs,
    APIGateway: api,
  };
};
