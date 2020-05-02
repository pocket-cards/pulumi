import * as aws from '@pulumi/aws';
import { Consts } from '../../consts';

export default () => {
  return new aws.cognito.UserPool('cognito.userpool', {
    name: `${Consts.PROJECT_NAME_UC}_UserPool`,
    passwordPolicy: {
      minimumLength: 8,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      requireUppercase: true,
      temporaryPasswordValidityDays: 7,
    },
    schemas: [
      {
        name: 'email',
        required: true,
        mutable: true,
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        stringAttributeConstraints: {
          maxLength: '2048',
          minLength: '0',
        },
      },
    ],
    autoVerifiedAttributes: ['email'],
    mfaConfiguration: 'OFF',
    emailVerificationMessage: 'Your verification code is {####}. ',
    emailVerificationSubject: 'Your verification code',
    smsAuthenticationMessage: 'Your authentication code is {####}. ',
    adminCreateUserConfig: {
      allowAdminCreateUserOnly: false,
      inviteMessageTemplate: {
        emailMessage: 'Your username is {username} and temporary password is {####}.',
        emailSubject: 'Your temporary password',
        smsMessage: 'Your username is {username} and temporary password is {####}.',
      },
    },
  });
};
