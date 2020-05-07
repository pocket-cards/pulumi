import { Backend } from 'typings';
import VPC from './vpc';
import ECS from './ecs';
import APIGateway from './api';

export default (inputs: Backend.Inputs): Backend.Outputs => {
  const vpc = VPC();

  const ecs = ECS({
    S3: inputs.S3,
    VPC: vpc,
    TaskDef: {
      REPO_URL: inputs.ECR.repositoryUrl,
      TABLE_GROUPS: inputs.DynamoDB.Groups.name,
      TABLE_HISTORY: inputs.DynamoDB.History.name,
      TABLE_USERS: inputs.DynamoDB.Users.name,
      TABLE_WORDS: inputs.DynamoDB.Words.name,
      TABLE_WORD_MASTER: inputs.DynamoDB.WordMaster.name,
      MP3_BUCKET: inputs.S3.Audio.bucket,
    },
  });

  const api = APIGateway({
    Route53: inputs.Route53,
    ACM: inputs.ACM,
    Cognito: inputs.Cognito,
  });

  return {
    VPC: vpc,
    ECS: ecs,
    APIGateway: api,
  };
};
