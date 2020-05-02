import { iam } from '@pulumi/aws';
import { Policy } from '../consts';

export default (codebuildRole: iam.Role) => {
  new iam.RolePolicy('pulumi.attach', {
    policy: Policy.CodeBuild_Pulumi_Attach,
    role: codebuildRole.id,
  });
};
