import { EmailPasswordInput } from './EmailPasswordInput';

export const validateReg = (options: EmailPasswordInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email',
      },
    ];
  }

  if (options.password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'Length must be greater than 3',
      },
    ];
  }

  return null;
};
