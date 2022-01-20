import { gql } from '@apollo/client';

export const RegisterCustomer = gql`
	mutation RegisterCustomer($data: RegisterInput!) {
		registerCustomer(data: $data){
			token
            errors {
                message
            }
	}
}`;


export const RegisterBusiness = gql`
    mutation RegisterBusiness($data: RegisterInput!) {
        registerBusiness(data: $data){
            token
            errors {
                message
            }
    }
}`;


export const RegisterQuery = { RegisterCustomer, RegisterBusiness };