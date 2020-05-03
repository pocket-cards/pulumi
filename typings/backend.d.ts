import { ecr, ec2, ecs, servicediscovery, elb, alb, lb } from '@pulumi/aws';
import { Install } from './install';

export namespace Backend {
  // ----------------------------------------------------------------------------------------------
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: Install.Route53Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    VPC: VPC.Outputs;
    ECS: ECS.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // ACM Outputs
  // ----------------------------------------------------------------------------------------------
  interface ACMOutputs {}

  namespace VPC {
    interface Outputs {
      VPC: VPC.VPCOutputs;
      Subnet: VPC.SubnetOutputs;
    }

    // ----------------------------------------------------------------------------------------------
    // VPC Outputs
    // ----------------------------------------------------------------------------------------------
    interface VPCOutputs {
      VPC: ec2.Vpc;
      IGW?: ec2.InternetGateway;
      RouteTable?: ec2.RouteTable;
    }

    // ----------------------------------------------------------------------------------------------
    // Subnet Outputs
    // ----------------------------------------------------------------------------------------------
    interface SubnetOutputs {
      Subnet1: ec2.Subnet;
      Subnet2: ec2.Subnet;
    }
  }

  namespace ECS {
    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    interface Outputs {
      ECR: ECROutputs;
      ECS: ECSOutputs;
      CloudMap: CloudMapOutputs;
      ELB: ELBOutputs;
    }

    // ----------------------------------------------------------------------------------------------
    // ECS Outputs
    // ----------------------------------------------------------------------------------------------
    interface ECSOutputs {
      Cluster: ecs.Cluster;
      Service: ecs.Service;
      TaskDefinition: ecs.TaskDefinition;
    }

    // ----------------------------------------------------------------------------------------------
    // ECR Outputs
    // ----------------------------------------------------------------------------------------------
    interface ECROutputs {
      Repository: ecr.Repository;
    }

    // ----------------------------------------------------------------------------------------------
    // CloudMap Outputs
    // ----------------------------------------------------------------------------------------------
    interface CloudMapOutputs {
      Namespace: servicediscovery.HttpNamespace;
      Service: servicediscovery.Service;
    }

    // ----------------------------------------------------------------------------------------------
    // ELB Outputs
    // ----------------------------------------------------------------------------------------------
    interface ELBOutputs {
      ALB: lb.LoadBalancer;
      Listener: lb.Listener;
      TargetGroup: lb.TargetGroup;
    }
  }
}
