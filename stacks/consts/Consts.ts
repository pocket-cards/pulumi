import * as pulumi from '@pulumi/pulumi';
import { Envs } from '.';

/** Github Webhook Secret */
export const GITHUB_WEBHOOK_SECRET = 'GITHUB_WEBHOOK_SECRET';
/** Pulumi Access Token */
export const PULUMI_ACCESS_TOKEN = 'PULUMI_ACCESS_TOKEN';
/** IPA URL */
export const IPA_URL = 'IPA_URL';
/** IPA API Key */
export const IPA_API_KEY = 'IPA_API_KEY';
/** Vision URL */
export const VISION_URL = 'VISION_URL';
/** Vision API Key */
export const VISION_API_KEY = 'VISION_API_KEY';
/** Translation Url */
export const TRANSLATION_URL = 'TRANSLATION_URL';
/** Translation API Key */
export const TRANSLATION_API_KEY = 'TRANSLATION_API_KEY';
/** Google App Client Id */
export const GOOGLE_APP_CLIENT_ID = 'GOOGLE_APP_CLIENT_ID';
/** Google App Secret */
export const GOOGLE_APP_SECRET = 'GOOGLE_APP_SECRET';

/** Project Name */
export const PROJECT_NAME_UC = 'PocketCards';
export const PROJECT_NAME = 'pocket-cards';

/** Stack Refrence */
export const INSTALL_STACK_NAME = `wwalpha/${PROJECT_NAME}/${Envs.ENVIRONMENT}-install`;
export const INITIAL_STACK_NAME = `wwalpha/${PROJECT_NAME}/${Envs.ENVIRONMENT}-initial`;

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

export const SSM_KEY_GOOGLE_APP_CLIENT_ID = `/${PROJECT_NAME}/${GOOGLE_APP_CLIENT_ID.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_GOOGLE_APP_SECRET = `/${PROJECT_NAME}/${GOOGLE_APP_SECRET.toLowerCase().replace(/_/g, '-')}`;

export const SSM_KEY_VISION_URL = `/${PROJECT_NAME}/${VISION_URL.toLowerCase().replace(/_/g, '-')}`;
export const SSM_KEY_VISION_API_KEY = `/${PROJECT_NAME}/${VISION_API_KEY.toLowerCase().replace(/_/g, '-')}`;

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

export const AUTH_DOMAIN = 'card';
export const AUTH_SIGN_IN_URL = `https://card.${DOMAIN_NAME()}/login`;
export const AUTH_SIGN_OUT_URL = `https://card.${DOMAIN_NAME()}/logout`;
