import {
    Field,
    ObjectType
} from "type-graphql";

/**
 * @description
 * A response type for promotion mutation calls
 * 
 * @field errors: an array of error message strings [optional]
 * @field success: a boolean value indicating success
 */
@ObjectType()
export class MutationResponse {
    @Field(() => [String], { nullable: true })
    errors?: string[];

    @Field(() => Boolean)
    success: boolean;
}