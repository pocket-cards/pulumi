import { interpolate } from '@pulumi/pulumi';
import { cognito, iam } from '@pulumi/aws';
import { Consts, Principals, Policy, Envs } from '../../../consts';

export default (pool: cognito.UserPool, client: cognito.UserPoolClient) => {
  const identityPool = new cognito.IdentityPool('cognito.identitypool', {
    identityPoolName: 'PocketCards_IdentityPool',
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [
      {
        clientId: client.id,
        providerName: interpolate`cognito-idp.${Envs.DEFAULT_REGION}.amazonaws.com/${pool.id}`,
        serverSideTokenCheck: false,
      },
    ],
  });

  const authRole = getAuthenticatedRole(identityPool);
  // const unauthRole = getUnauthenticatedRole(identityPool);

  new cognito.IdentityPoolRoleAttachment('cognito.identitypool.attachment', {
    identityPoolId: identityPool.id,
    roles: {
      authenticated: authRole.arn,
      // unauthenticated: unauthRole.arn,
    },
  });

  return identityPool;
};

const getAuthenticatedRole = (identityPool: cognito.IdentityPool) => {
  const role = new iam.Role(
    'iam.role.cognito.authenticated',
    {
      path: '/',
      name: `${Consts.PROJECT_NAME_UC}_IdentityPool_AuthenticatedRole`,
      assumeRolePolicy: Principals.COGNITO_AUTH(identityPool.id),
      maxSessionDuration: 3600,
    },
    { deleteBeforeReplace: true }
  );

  new iam.RolePolicy('iam.policy.cognito.authenticated', {
    name: 'inline_policy',
    role: role.id,
    policy: Policy.Cognito_Authenticated,
  });

  return role;
};

// const getUnauthenticatedRole = (identityPool: cognito.IdentityPool) => {
//   const role = new iam.Role(
//     'iam.role.cognito.unauthenticated',
//     {
//       path: '/',
//       name: `${Consts.PROJECT_NAME_UC}_IdentityPool_UnauthenticatedRole`,
//       assumeRolePolicy: Principals.COGNITO_UNAUTH(identityPool.id),
//       maxSessionDuration: 3600,
//     },
//     {
//       deleteBeforeReplace: true,
//     }
//   );

//   new iam.RolePolicy('iam.policy.cognito.unauthenticated', {
//     name: 'inline_policy',
//     role: role.id,
//     policy: Policy.Cognito_UnAuthenticated,
//   });

//   return role;
// };
