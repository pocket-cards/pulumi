import * as pulumi from '@pulumi/pulumi';
import { StackReference } from '@pulumi/pulumi';
import { Envs } from '.';

/** Github Webhook Secret */
export const GITHUB_WEBHOOK_SECRET = 'GITHUB_WEBHOOK_SECRET';
/** Pulumi Access Token */
export const PULUMI_ACCESS_TOKEN = 'PULUMI_ACCESS_TOKEN';
/** IPA URL */
export const IPA_URL = 'IPA_URL';
/** IPA API Key */
export const IPA_API_KEY = 'IPA_API_KEY';
/** Translation Url */
export const TRANSLATION_URL = 'TRANSLATION_URL';
/** Translation API Key */
export const TRANSLATION_API_KEY = 'TRANSLATION_API_KEY';

/** Project Name */
export const PROJECT_NAME_UC = 'PocketCards';
export const PROJECT_NAME = 'pocket-cards';

/** Stack Refrence */
export const INSTALL_STACK_NAME = `wwalpha/${PROJECT_NAME}/${Envs.ENVIRONMENT}-install`;
export const INSTALL_STACK = new StackReference(INSTALL_STACK_NAME);

export const INITIAL_STACK_NAME = `wwalpha/${PROJECT_NAME}/${Envs.ENVIRONMENT}-initial`;
export const INITIAL_STACK = new StackReference(INITIAL_STACK_NAME);

export const DOMAIN_NAME_DEF = {
  dev: 'dev.aws-handson.com',
  prod: 'aws-handson.com',
};

export const DOMAIN_NAME = () => {
  const env = pulumi.getStack();

  if (env.startsWith('dev')) return DOMAIN_NAME_DEF.dev;

  return DOMAIN_NAME_DEF.prod;
};

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
export const SSM_KEY_IPA_URL = `/${PROJECT_NAME}/${IPA_URL.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_IPA_API_KEY = `/${PROJECT_NAME}/${IPA_API_KEY.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_TRANSLATION_URL = `/${PROJECT_NAME}/${TRANSLATION_URL.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_TRANSLATION_API_KEY = `/${PROJECT_NAME}/${TRANSLATION_API_KEY.toLowerCase().replace(/_/g, '-')}`;

/** Tables */
export const TABLE_HISTORY = `${PROJECT_NAME_UC}_History`;
export const TABLE_GROUPS = `${PROJECT_NAME_UC}_Groups`;
export const TABLE_USERS = `${PROJECT_NAME_UC}_Users`;
export const TABLE_WORDS = `${PROJECT_NAME_UC}_Words`;
export const TABLE_WORD_MASTER = `${PROJECT_NAME_UC}_WordMaster`;

/** VPC */
export const VPC_CIDR_BLOCK = '10.0.0.0/23';
export const VPC_SUBNET1_CIDR_BLOCK = '10.0.0.0/24';
export const VPC_SUBNET2_CIDR_BLOCK = '10.0.1.0/24';
