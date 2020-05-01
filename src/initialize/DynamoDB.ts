import { dynamodb } from '@pulumi/aws';
import { Consts } from '../consts';

export default () => {
  const history = new dynamodb.Table('history', {
    name: Consts.TABLE_HISTORY,
    attributes: [
      {
        name: 'userId',
        type: 'S',
      },
      {
        name: 'timestamp',
        type: 'S',
      },
    ],
    hashKey: 'userId',
    rangeKey: 'timestamp',
    readCapacity: 1,
    writeCapacity: 1,
  });

  const groups = new dynamodb.Table('groups', {
    name: Consts.TABLE_GROUPS,
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
      {
        name: 'userId',
        type: 'S',
      },
    ],
    hashKey: 'id',
    rangeKey: 'userId',
    readCapacity: 3,
    writeCapacity: 1,
    globalSecondaryIndexes: [
      {
        name: 'gsi1',
        hashKey: 'userId',
        rangeKey: 'id',
        projectionType: 'ALL',
        readCapacity: 1,
        writeCapacity: 1,
      },
    ],
  });

  const users = new dynamodb.Table('users', {
    name: Consts.TABLE_USERS,
    hashKey: 'id',
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
    ],
    readCapacity: 1,
    writeCapacity: 1,
  });

  const words = new dynamodb.Table('words', {
    name: Consts.TABLE_WORDS,
    hashKey: 'id',
    rangeKey: 'groupId',
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
      {
        name: 'groupId',
        type: 'S',
      },
      {
        name: 'nextTime',
        type: 'S',
      },
    ],
    readCapacity: 1,
    writeCapacity: 1,
    globalSecondaryIndexes: [
      {
        name: 'gsi1',
        hashKey: 'groupId',
        rangeKey: 'nextTime',
        projectionType: 'ALL',
        readCapacity: 1,
        writeCapacity: 1,
      },
    ],
  });

  const wordMaster = new dynamodb.Table('wordMaster', {
    name: Consts.TABLE_WORD_MASTER,
    hashKey: 'id',
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
    ],
    readCapacity: 1,
    writeCapacity: 1,
  });

  return {
    [Consts.TABLE_WORD_MASTER]: wordMaster,
    [Consts.TABLE_WORDS]: words,
    [Consts.TABLE_HISTORY]: history,
    [Consts.TABLE_USERS]: users,
    [Consts.TABLE_GROUPS]: groups,
  };
};
