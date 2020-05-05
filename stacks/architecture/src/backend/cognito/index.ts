import UserPool from './UserPool';
import UserPoolClient from './UserPoolClient';
import IdentityPool from './IdentityPool';
import { Frontend } from 'typings/frontend';

export default (): Frontend.CognitoOutputs => {
  // ユーザプール
  const pool = UserPool();
  // ユーザプールクライアント
  const poolClient = UserPoolClient(pool);

  const identity = IdentityPool(pool, poolClient);

  return {
    UserPool: pool,
    UserPoolClient: poolClient,
    IdentityPool: identity,
  };
};
