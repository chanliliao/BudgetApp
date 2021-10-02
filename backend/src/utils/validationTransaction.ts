export const validateTransaction = (
  // firstName: string,
  // lastName: string,
  amount: number,
  description: string
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
  if (!amount) {
    return [
      {
        field: 'amount',
        message: 'Please input amount',
      },
    ];
  }

  if (!description) {
    return [
      {
        field: 'description',
        message: 'Please input a description',
      },
    ];
  }

  return null;
};
