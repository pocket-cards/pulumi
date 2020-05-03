import { Backend } from 'typings';
import VPC from './VPC';
import Subnet from './Subnet';

export default (): Backend.VPC.Outputs => {
  const vpc = VPC();

  const subnets = Subnet(vpc);

  return {
    VPC: vpc,
    Subnet: subnets,
  };
};
