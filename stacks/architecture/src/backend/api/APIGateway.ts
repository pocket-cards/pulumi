import { interpolate } from '@pulumi/pulumi';
import { apigatewayv2 } from '@pulumi/aws';
import { Consts, Envs } from '../../../../consts';
import { Backend } from 'typings';

export default (cognito: Backend.CognitoInputs, domain: apigatewayv2.DomainName): Backend.API.APIGatewayOutputs => {
  const api = new apigatewayv2.Api('apigateway.api.backend', {
    name: Consts.PROJECT_NAME,
    protocolType: 'HTTP',
    // corsConfiguration: {
    //   allowCredentials: true,
    //   allowHeaders: ['authorization'],
    //   allowMethods: ['*'],
    //   allowOrigins: ['http://localhost:3000', `https://card.${Consts.DOMAIN_NAME()}`],
    //   maxAge: 300,
    // },
  });

  const integration = new apigatewayv2.Integration(
    'apigateway.integration',
    {
      apiId: api.id,
      integrationType: 'HTTP_PROXY',
      integrationMethod: 'ANY',
      integrationUri: 'http://18.183.195.186/{proxy}',
      passthroughBehavior: 'WHEN_NO_MATCH',
    },
    {
      ignoreChanges: ['integrationUri'],
    }
  );

  const authorizer = new apigatewayv2.Authorizer('apigateway.authorizer', {
    name: 'Cognito',
    apiId: api.id,
    authorizerType: 'JWT',
    identitySources: ['$request.header.Authorization'],
    jwtConfiguration: {
      audiences: [cognito.UserPoolClient.id],
      issuer: interpolate`https://cognito-idp.${Envs.DEFAULT_REGION}.amazonaws.com/${cognito.UserPool.id}`,
    },
  });

  const proxy_post = new apigatewayv2.Route('apigateway.route.proxy.post', {
    apiId: api.id,
    routeKey: 'POST /{proxy+}',
    authorizationType: 'JWT',
    authorizerId: authorizer.id,
    target: interpolate`integrations/${integration.id}`,
  });

  const proxy_put = new apigatewayv2.Route('apigateway.route.proxy.put', {
    apiId: api.id,
    routeKey: 'PUT /{proxy+}',
    authorizationType: 'JWT',
    authorizerId: authorizer.id,
    target: interpolate`integrations/${integration.id}`,
  });

  const proxy_get = new apigatewayv2.Route('apigateway.route.proxy.get', {
    apiId: api.id,
    routeKey: 'GET /{proxy+}',
    authorizationType: 'JWT',
    authorizerId: authorizer.id,
    target: interpolate`integrations/${integration.id}`,
  });

  const proxy_delete = new apigatewayv2.Route('apigateway.route.proxy.delete', {
    apiId: api.id,
    routeKey: 'DELETE /{proxy+}',
    authorizationType: 'JWT',
    authorizerId: authorizer.id,
    target: interpolate`integrations/${integration.id}`,
  });

  const proxy_options = new apigatewayv2.Route('apigateway.route.proxy.options', {
    apiId: api.id,
    routeKey: 'OPTIONS /{proxy+}',
    target: interpolate`integrations/${integration.id}`,
  });

  const stage = new apigatewayv2.Stage(
    'apigateway.stage',
    {
      name: 'v1',
      apiId: api.id,
      autoDeploy: true,
      description: 'Example ',
    },
    { ignoreChanges: ['deploymentId'], deleteBeforeReplace: true }
  );

  const mapping = new apigatewayv2.ApiMapping(
    'apigateway.apimapping',
    {
      apiId: api.id,
      domainName: domain.domainName,
      stage: stage.id,
      apiMappingKey: 'v1',
    },
    { dependsOn: stage, deleteBeforeReplace: true }
  );

  return {
    API: api,
    Authorizer: authorizer,
    Integration: integration,
    Stage: stage,
    APIMapping: mapping,
  };
};
