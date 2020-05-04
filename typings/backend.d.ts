import { ecr, ec2, ecs, servicediscovery, elb, alb, lb, cognito, route53, apigatewayv2 } from '@pulumi/aws';
import { Install } from './install';

export namespace Backend {
  // ----------------------------------------------------------------------------------------------
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Inputs {
    Route53: Route53Inputs;
    Cognito: CognitoInputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Backend Outputs
  // ----------------------------------------------------------------------------------------------
  export interface Outputs {
    VPC: VPC.Outputs;
    ECS: ECS.Outputs;
    APIGateway: API.Outputs;
  }

  // ----------------------------------------------------------------------------------------------
  // Route53 Inputs
  // ----------------------------------------------------------------------------------------------
  interface Route53Inputs {
    Zone: route53.Zone;
  }

  // ----------------------------------------------------------------------------------------------
  // Cognito Inputs
  // ----------------------------------------------------------------------------------------------
  interface CognitoInputs {
    UserPool: cognito.UserPool;
    UserPoolClient: cognito.UserPoolClient;
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
      // ELB: ELBOutputs;
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

  namespace API {
    interface Inputs {
      Route53: Route53Inputs;
      Cognito: CognitoInputs;
    }

    // ----------------------------------------------------------------------------------------------
    // Outputs
    // ----------------------------------------------------------------------------------------------
    interface Outputs {
      API: APIGatewayOutputs;
    }

    interface APIGatewayOutputs {
      API: apigatewayv2.Api;
      Integration: apigatewayv2.Integration;
      Authorizer: apigatewayv2.Authorizer;
      Route: apigatewayv2.Route;
      Stage: apigatewayv2.Stage;
    }
  }
}
