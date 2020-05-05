import { Backend } from 'typings';
import VPC from './vpc';
import ECS from './ecs';
import Cognito from './cognito';
import APIGateway from './api';

export default (inputs: Backend.Inputs): Backend.Outputs => {
  const vpc = VPC();

  const ecs = ECS(inputs.ECR, vpc);

  const cognito = Cognito();
  const api = APIGateway({ Route53: inputs.Route53, Cognito: cognito });

  return {
    VPC: vpc,
    ECS: ecs,
    APIGateway: api,
    Cognito: cognito,
  };
};
