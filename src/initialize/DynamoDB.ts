import { dynamodb } from '@pulumi/aws';
import { Consts } from '../consts';
import { Initialize } from 'typings';

export default (): Initialize.DynamoDBOutputs => {
  return {
    Groups: groups.name,
    History: history.name,
    Users: users.name,
    Words: words.name,
    WordMaster: wordMaster.name,
  };
};

const history = new dynamodb.Table(
  'dynamodb.table.history',
  {
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
  },
  { protect: true }
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
  { protect: true }
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
  { protect: true }
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
  { protect: true }
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
    readCapacity: 1,
    writeCapacity: 1,
  },
  { protect: true }
);
