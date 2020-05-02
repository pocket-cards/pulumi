import Cognito from './cognito';
import CloudFront from './CloudFront';
import ACM from './ACM';

import { Frontend } from 'typings/frontend';
import { Initialize } from 'typings';

export default (init: Initialize.Outputs): Frontend.Outputs => {
  const cognito = Cognito();

  const acm = ACM(init.Route53);

  const cloudfront = CloudFront(init, acm);

  return {
    Cognito: cognito,
    CloudFront: cloudfront,
    ACM: acm,
  };
};
