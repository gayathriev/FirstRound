import { gql } from '@apollo/client';


export const ForgotPassword = gql`
  query ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;


export const ResetAccount = gql`
  mutation ResetAccount($token: String!, $password: String!) {
    resetAccount(token: $token, password: $password)
  }
`;


export const AccountResets = { ForgotPassword, ResetAccount };

