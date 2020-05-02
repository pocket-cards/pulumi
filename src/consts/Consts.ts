import * as pulumi from '@pulumi/pulumi';

/** Github Webhook Secret */
export const GITHUB_WEBHOOK_SECRET = 'GITHUB_WEBHOOK_SECRET';
/** Pulumi Access Token */
export const PULUMI_ACCESS_TOKEN = 'PULUMI_ACCESS_TOKEN';
/** Route53 Zone Id */
export const ZONE_ID = 'ZONE_ID';

export const DOMAIN_NAME_DEF = {
  dev: 'dev.aws-handson.com',
  prod: 'aws-handson.com',
};

export const DOMAIN_NAME = () => {
  const env = pulumi.getStack();

  if (env === 'dev') return DOMAIN_NAME_DEF.dev;

  return DOMAIN_NAME_DEF.prod;
};

/** Project Name */
export const PROJECT_NAME_UC = 'PocketCards';
export const PROJECT_NAME = 'pocket-cards';

/** Repository Owner */
export const REPO_OWNER = 'pocket-cards';
/** Repository Infra */
export const REPO_PULUMI = 'pulumi-ts';
/** Repository Backend */
export const REPO_BACKEND = 'backend';
/** Repository Frontend */
export const REPO_FRONTEND = 'frontend';

export const SSM_KEY_PULUMI_ACCESS_TOKEN = `/${PROJECT_NAME}/${PULUMI_ACCESS_TOKEN.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_GITHUB_WEBHOOK_SECRET = `/${PROJECT_NAME}/${GITHUB_WEBHOOK_SECRET.toLowerCase().replace(
  /_/g,
  '-'
)}`;

/** Tables */
export const TABLE_HISTORY = `${PROJECT_NAME_UC}_History`;
export const TABLE_GROUPS = `${PROJECT_NAME_UC}_Groups`;
export const TABLE_USERS = `${PROJECT_NAME_UC}_Users`;
export const TABLE_WORDS = `${PROJECT_NAME_UC}_Words`;
export const TABLE_WORD_MASTER = `${PROJECT_NAME_UC}_WordMaster`;
