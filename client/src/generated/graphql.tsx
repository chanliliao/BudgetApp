import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccResponse = {
  __typename?: 'AccResponse';
  acc?: Maybe<Account>;
  errors?: Maybe<Array<FieldError>>;
};

export type Account = {
  __typename?: 'Account';
  _id: Scalars['Int'];
  createdAt: Scalars['String'];
  email: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type EmailPasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  UpdateTransaction: TransactionResponse;
  changePassword: AccResponse;
  createTransaction: TransactionResponse;
  deleteTransaction: Scalars['Boolean'];
  forgotPW: Scalars['Boolean'];
  login: AccResponse;
  logout: Scalars['Boolean'];
  register: AccResponse;
};


export type MutationUpdateTransactionArgs = {
  amount?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateTransactionArgs = {
  amount: Scalars['Float'];
  description: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPwArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: EmailPasswordInput;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getTransactionByID?: Maybe<Transaction>;
  getTransactions?: Maybe<Array<Transaction>>;
  hello: Scalars['String'];
  me?: Maybe<Account>;
};


export type QueryGetTransactionByIdArgs = {
  id: Scalars['Float'];
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['Int'];
  amount: Scalars['Float'];
  createdAt: Scalars['String'];
  description: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type TransactionError = {
  __typename?: 'TransactionError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  errors?: Maybe<Array<TransactionError>>;
  transaction?: Maybe<Transaction>;
};

export type RegularAccFragment = { __typename?: 'Account', _id: number, email: string };

export type RegularAccResFragment = { __typename?: 'AccResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, acc?: Maybe<{ __typename?: 'Account', _id: number, email: string }> };

export type RegularErrFragment = { __typename?: 'FieldError', field: string, message: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'AccResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, acc?: Maybe<{ __typename?: 'Account', _id: number, email: string }> } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, acc?: Maybe<{ __typename?: 'Account', _id: number, email: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AccResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, acc?: Maybe<{ __typename?: 'Account', _id: number, email: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'Account', _id: number, email: string }> };

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', getTransactions?: Maybe<Array<{ __typename?: 'Transaction', _id: number, amount: number, description: string, createdAt: string, updatedAt: string }>> };

export const RegularErrFragmentDoc = gql`
    fragment RegularErr on FieldError {
  field
  message
}
    `;
export const RegularAccFragmentDoc = gql`
    fragment RegularAcc on Account {
  _id
  email
}
    `;
export const RegularAccResFragmentDoc = gql`
    fragment RegularAccRes on AccResponse {
  errors {
    ...RegularErr
  }
  acc {
    ...RegularAcc
  }
}
    ${RegularErrFragmentDoc}
${RegularAccFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularAccRes
  }
}
    ${RegularAccResFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(options: {email: $email, password: $password}) {
    ...RegularAccRes
  }
}
    ${RegularAccResFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    ...RegularAccRes
  }
}
    ${RegularAccResFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularAcc
  }
}
    ${RegularAccFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const TransactionsDocument = gql`
    query Transactions {
  getTransactions {
    _id
    amount
    description
    createdAt
    updatedAt
  }
}
    `;

export function useTransactionsQuery(options: Omit<Urql.UseQueryArgs<TransactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TransactionsQuery>({ query: TransactionsDocument, ...options });
};