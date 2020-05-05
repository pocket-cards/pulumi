import UserPool from './UserPool';
import UserPoolClient from './UserPoolClient';
import IdentityPool from './IdentityPool';
import { Backend } from 'typings';

export default (): Backend.CognitoOutputs => {
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
