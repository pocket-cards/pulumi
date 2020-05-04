import { getStack, output } from '@pulumi/pulumi';
import { Provider, getRegion } from '@pulumi/aws';

const BRANCHS = {
  dev: 'master',
  prod: 'master',
};

export const REPO_BRANCH = () => BRANCHS['dev'];

export const IS_DEV = () => getStack() === 'dev';

export const PROVIDER_US = new Provider('provider', { region: 'us-east-1' });

export const ENVIRONMENT = getStack();

export const DEFAULT_REGION = output(getRegion(undefined, { async: true })).name;
