import { iam } from '@pulumi/aws';
import { Policy } from '../../consts';

export default (codebuildRole: iam.Role) => {
  new iam.RolePolicy('iam.policy.codebuild.pulumi.attach', {
    name: 'inline_policy_attach',
    policy: Policy.CodeBuild_Pulumi_Attach,
    role: codebuildRole.id,
  });
};
