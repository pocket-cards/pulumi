/** Github Webhook Secret */
export const GITHUB_WEBHOOK_SECRET = 'GITHUB_WEBHOOK_SECRET';
/** Pulumi Access Token */
export const PULUMI_ACCESS_TOKEN = 'PULUMI_ACCESS_TOKEN';

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
