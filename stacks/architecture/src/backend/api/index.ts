import APIGateway from './APIGateway';
import Route53 from './Route53';
import { Backend } from 'typings';

export default (inputs: Backend.API.Inputs): Backend.API.Outputs => {
  // API Gateway
  const api = APIGateway(inputs.Cognito);

  // Route53 Record
  Route53(inputs.Route53.Zone, api.API);

  return {
    ...api,
  };
};
