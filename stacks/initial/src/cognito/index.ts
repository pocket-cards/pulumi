import { lambda } from '@pulumi/aws';
import UserPool from './UserPool';
import UserPoolClient from './UserPoolClient';
import IdentityPool from './IdentityPool';
import UserPoolDomain from './UserPoolDomain';
import Lambda from './Lambda';
import { Initial } from 'typings';
import IdentityProvider from './IdentityProvider';

export default (inputs: Initial.CognitoInputs): Initial.CognitoOutputs => {
  const func = Lambda(inputs);
  // ユーザプール
  const pool = UserPool(func);
  // google provider
  const provider = IdentityProvider(pool);
  // ユーザプールクライアント
  const poolClient = UserPoolClient(pool);
  // domain
  const domain = UserPoolDomain(pool);

  const identity = IdentityPool(pool, poolClient);

  new lambda.Permission('lambda.permission.cognito', {
    statementId: 'lambda-permission-cognito',
    action: 'lambda:InvokeFunction',
    function: func.arn,
    principal: 'cognito-sync.amazonaws.com',
    sourceArn: identity.arn,
  });

  return {
    UserPool: pool,
    UserPoolClient: poolClient,
    IdentityPool: identity,
  };
};
