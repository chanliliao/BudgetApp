import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{
          // firstName: '', lastName: '',
          email: '',
          password: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const res = await register(values);
          if (res.data.register.errors) {
            setErrors(toErrorMap(res.data.register.errors));
          } else if (res.data.register.acc) {
            // worked
            router.push('/');
          }
        }}
      >
        {() => (
          <Form>
            {/* <Box mt={4}>
              <InputField
                name='firstName'
                placeholder='First Name'
                label='First Name'
              />
            </Box>
            <Box mt={4}>
              <InputField
                name='lastName'
                placeholder='Last Name'
                label='Last Name'
              />
            </Box> */}
            <Box mt={4}>
              <InputField name='email' placeholder='Email' label='Email' />
            </Box>
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
              />
            </Box>
            <Button mt={4} type='submit' colorScheme='blue'>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
