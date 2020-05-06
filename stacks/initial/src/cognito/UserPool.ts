import { Consts } from '../../../consts';
import { lambda, cognito } from '@pulumi/aws';

export default (lambda: lambda.Function) => {
  return new cognito.UserPool('cognito.userpool', {
    name: `${Consts.PROJECT_NAME_UC}_UserPool`,
    passwordPolicy: {
      minimumLength: 10,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      requireUppercase: true,
      temporaryPasswordValidityDays: 7,
    },
    lambdaConfig: {
      preSignUp: lambda.arn,
      preAuthentication: lambda.arn,
      postAuthentication: lambda.arn,
      postConfirmation: lambda.arn,
      preTokenGeneration: lambda.arn,
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
      {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'name',
        stringAttributeConstraints: {
          maxLength: '2048',
          minLength: '0',
        },
        required: false,
      },
    ],
    autoVerifiedAttributes: ['email'],
    usernameConfiguration: {
      caseSensitive: true,
    },
    usernameAttributes: ['email'],
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
