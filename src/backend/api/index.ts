import { Backend } from 'typings';
import APIGateway from './APIGateway';
import Route53 from './Route53';

export default (inputs: Backend.API.Inputs): Backend.API.Outputs => {
  // API Gateway
  const api = APIGateway(inputs.Cognito);

  // Route53 Record
  Route53(inputs.Route53.Zone, api.API);

  return {
    ...api,
  };
};
