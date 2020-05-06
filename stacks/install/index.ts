import Parameters from './src/Parameters';
import Route53 from './src/Route53';
import { Install } from 'typings';

export let outputs: Install.Outputs;

const start = () => {
  const route53 = Route53();
  // parameter store
  Parameters();

  outputs = {
    Route53: route53,
  };
};

start();
