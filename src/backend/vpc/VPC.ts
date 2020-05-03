import { ec2 } from '@pulumi/aws';
import { Consts } from '../../consts';
import { Backend } from 'typings';

export default (): Backend.VPC.VPCOutputs => {
  const vpc = new ec2.Vpc('ec2.vpc', {
    cidrBlock: Consts.VPC_CIDR_BLOCK,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
      Name: Consts.PROJECT_NAME_UC,
    },
  });

  const gateway = new ec2.InternetGateway('ec2.internet_gateway', {
    tags: {
      Name: `${Consts.PROJECT_NAME_UC}_IGW`,
    },
    vpcId: vpc.id,
  });

  const routeTable = new ec2.RouteTable('ec2.routetable', {
    routes: [
      {
        cidrBlock: '0.0.0.0/0',
        gatewayId: gateway.id,
      },
    ],
    tags: {
      Name: `${Consts.PROJECT_NAME_UC}_RouteTable`,
    },
    vpcId: vpc.id,
  });

  new ec2.MainRouteTableAssociation('ec2.main.routetable.association', {
    routeTableId: routeTable.id,
    vpcId: vpc.id,
  });

  return {
    VPC: vpc,
    IGW: gateway,
    // RouteTable: routeTable,
  };
};
