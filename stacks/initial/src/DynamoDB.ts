import { dynamodb } from '@pulumi/aws';
import { Consts } from '../../consts';
import { Initial } from 'typings';

export default (): Initial.DynamoDBOutputs => {
  return {
    Groups: groups,
    History: history,
    Users: users,
    Words: words,
    WordMaster: wordMaster,
  };
};

const history = new dynamodb.Table(
  'dynamodb.table.history',
  {
    name: Consts.TABLE_HISTORY,
    attributes: [
      {
        name: 'user',
        type: 'S',
      },
      {
        name: 'timestamp',
        type: 'S',
      },
    ],
    hashKey: 'user',
    rangeKey: 'timestamp',
    readCapacity: 1,
    writeCapacity: 1,
  },
  { protect: false }
);

const groups = new dynamodb.Table(
  'dynamodb.table.groups',
  {
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
  },
  { protect: false }
);

const users = new dynamodb.Table(
  'dynamodb.table.users',
  {
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
  },
  { protect: false }
);

const words = new dynamodb.Table(
  'dynamodb.table.words',
  {
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
  },
  { protect: false }
);

const wordMaster = new dynamodb.Table(
  'dynamodb.table.wordMaster',
  {
    name: Consts.TABLE_WORD_MASTER,
    hashKey: 'id',
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
    ],
    readCapacity: 3,
    writeCapacity: 1,
  },
  { protect: false }
);
