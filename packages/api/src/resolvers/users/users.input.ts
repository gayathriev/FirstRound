import { 
    InputType, 
    Field
} from "type-graphql";

/**
 * @description
 * Input type for user registration
 * 
 * @field username: the user's username
 * @field email: the user's email
 * @field password: the user's password
 */
@InputType()
export class RegisterInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

/**
 * @description
 * Input type to log in
 * 
 * @field username: the user's username
 * @field password: the user's password
 */
@InputType()
export class LoginInput {
    @Field()
    username: string;

    @Field()
    password: string;
}