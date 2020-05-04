import Cognito from './cognito';
import CloudFront from './CloudFront';
import ACM from './ACM';
import { Frontend } from 'typings/frontend';

export default (inputs: Frontend.Inputs): Frontend.Outputs => {
  const cognito = Cognito();

  const acm = ACM(inputs);

  const cloudfront = CloudFront(inputs, acm);

  return {
    Cognito: cognito,
    CloudFront: cloudfront,
    ACM: acm,
  };
};
