import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/router';
import React from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          // const res = await login(values);
          // if (res.data.login.errors) {
          //   setErrors(toErrorMap(res.data.login.errors));
          // } else if (res.data.login.acc) {
          //   // worked
          //   router.push('/');
          // }
        }}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                name='newPassword'
                placeholder='New Password'
                label='Password'
                type='password'
              />
            </Box>

            <Button mt={4} type='submit' colorScheme='blue'>
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
