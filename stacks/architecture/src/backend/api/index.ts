import APIGateway from './APIGateway';
import Route53 from './Route53';
import { Backend } from 'typings';
import Domain from './Domain';

export default (inputs: Backend.API.Inputs): Backend.API.Outputs => {
  const domain = Domain(inputs.ACM);

  // API Gateway
  const api = APIGateway(inputs.Cognito, domain);

  // Route53 Record
  Route53(inputs.Route53.Zone, domain);

  return {
    ...api,
    Domain: domain,
  };
};
