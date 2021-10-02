export const validateRegister = (
  // firstName: string,
  // lastName: string,
  email: string,
  password: string
) => {
  // if (firstName.length <= 2) {
  //   return [
  //     {
  //       field: 'firstName',
  //       message: 'Length must be greater than 2',
  //     },
  //   ];
  // }
  // if (lastName.length <= 1) {
  //   return [
  //     {
  //       field: 'lastName',
  //       message: 'Length must be greater than 1',
  //     },
  //   ];
  // }
  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email',
      },
    ];
  }

  if (password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'Length must be greater than 3',
      },
    ];
  }

  return null;
};
