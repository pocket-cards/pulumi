import { output } from '@pulumi/pulumi';
import { ec2, getAvailabilityZones } from '@pulumi/aws';
import { Consts } from '../../../../consts';
import { Backend } from 'typings';

export default (vpc: Backend.VPC.VPCOutputs): Backend.VPC.SubnetOutputs => {
  const azs = output(getAvailabilityZones({ allAvailabilityZones: true }, { async: true }));

  const subnet1 = new ec2.Subnet(
    'ec2.subnet1',
    {
      vpcId: vpc.VPC.id,
      cidrBlock: Consts.VPC_SUBNET1_CIDR_BLOCK,
      availabilityZone: azs.names[0],
      tags: {
        Name: `${Consts.PROJECT_NAME_UC}_Subnet1`,
      },
    },
    { dependsOn: [vpc.VPC] }
  );

  const subnet2 = new ec2.Subnet(
    'ec2.subnet2',
    {
      vpcId: vpc.VPC.id,
      cidrBlock: Consts.VPC_SUBNET2_CIDR_BLOCK,
      availabilityZone: azs.names[1],
      tags: {
        Name: `${Consts.PROJECT_NAME_UC}_Subnet2`,
      },
    },
    { dependsOn: [vpc.VPC] }
  );

  return {
    Subnets: [subnet1, subnet2],
  };
};
