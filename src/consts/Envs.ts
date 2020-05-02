import * as pulumi from '@pulumi/pulumi';
import { Provider } from '@pulumi/aws';

const BRANCHS = {
  dev: 'master',
  prod: 'master',
};

export const REPO_BRANCH = () => BRANCHS['dev'];

export const IS_DEV = () => pulumi.getStack() === 'dev';

export const PROVIDER_US = new Provider('provider', { region: 'us-east-1' });

export const ENVIRONMENT = pulumi.getStack();
