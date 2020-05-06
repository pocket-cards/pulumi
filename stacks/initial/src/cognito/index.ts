import { lambda } from '@pulumi/aws';
import UserPool from './UserPool';
import UserPoolClient from './UserPoolClient';
import IdentityPool from './IdentityPool';
import Lambda from './Lambda';
import { Initial } from 'typings';

export default (): Initial.CognitoOutputs => {
  const func = Lambda();
  // ユーザプール
  const pool = UserPool(func);
  // ユーザプールクライアント
  const poolClient = UserPoolClient(pool);

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
