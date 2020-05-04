import { getStack, output } from '@pulumi/pulumi';
import { Provider, getRegion } from '@pulumi/aws';

const BRANCHS = {
  dev: 'master',
  prod: 'master',
};

export const REPO_BRANCH = () => BRANCHS['dev'];

// Develop / Production
export const IS_DEV = () => getStack().startsWith('dev');
// US Provider
export const PROVIDER_US = new Provider('provider', { region: 'us-east-1' });
// Stack Name
export const STACK_NAME = getStack();
// Environment: dev / prod
export const ENVIRONMENT = STACK_NAME.split('-')[0];
// Default Region
export const DEFAULT_REGION = output(getRegion(undefined, { async: true })).name;
