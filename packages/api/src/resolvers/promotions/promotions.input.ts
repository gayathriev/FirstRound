import {
    InputType,
    Field,
    Int as IntGQl,
} from "type-graphql";

import {
    MinDate,
    Min,
    Max,
    ArrayMinSize
} from "class-validator";

/**
 * @description
 * Input type for adding a promotion to a venue
 * 
 * @field creditsRequired: the number of credits needed to 
 *        redeem to the promotion
 * @field startDate: the date the promotion begins
 * @field endDate: the date the promotion ends
 * @field percentageOff: percent off the available menu items
 * @field menuItemIDs: an array of menu item IDs
 */
@InputType()
export class PromotionInput {

    // must require at least one credit
    @Field(() => IntGQl)
    @Min(1, {
        message: 'Promotion must require at least $constraint1 credits, actual value is $value',
    })
    creditsRequired: number;

    
    // date cannot be in the past
    // for the minimum date: need to set the times to 00:00
    // as frontend doesn't pass times
    @Field(() => Date)
    @MinDate(new Date(new Date().setHours(0,0,0,0)), {
        message: 'The promotion start date must not be in the past',
    })
    public startDate: Date;

    // data cannot be in the past
    @Field(() => Date)
    @MinDate(new Date(new Date().setHours(0,0,0,0)), {
        message: 'The promotion end date must not be in the past',
    })
    public endDate: Date;

    // percent value must be between 1 and 100 (can't have negative or 0%)
    @Field(() => IntGQl)
    @Min(1, {
        message: 'The promotion discount must be at least $constraint1 % , but actual value is $value',
    })
    @Max(100, {
        message: 'The promotion discount must be maximum $constraint1 % , but actual value is $value',
    })
    public percentageOff:  number;

    // must include at least one menu item
    @Field(() => [String])
    @ArrayMinSize(1, {
        message: 'The promotion must apply to at least $constraint1 menu item.',
    })
    public menuItemIDs: string[];

}