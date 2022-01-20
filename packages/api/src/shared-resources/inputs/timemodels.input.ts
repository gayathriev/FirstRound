import { 
    InputType, 
    Field, 
    Int as IntGQl,
} from "type-graphql";

/**
 * @description
 * Input type for times
 * 
 * @field hours: hours as an int
 * @field minutes: minutes as an int
 */
@InputType()
export class TimeInput {
    @Field(() => IntGQl)
    hours: number;

    @Field(() => IntGQl)
    minutes: number;
}

/**
 * @description
 * Input type for open and close times
 * on a given day
 * 
 * @field day: the day of the week
 * @field open: opening time
 * @field close: closing time
 */
@InputType()
export class DayHoursInput {
    @Field()
    day: string

    @Field()
    open: TimeInput;

    @Field()
    close: TimeInput;
}

/**
 * @description
 * Input type to store an array of
 * days with opening hours
 * 
 * @field hours: an array of days with open and close times
 */
@InputType()
export class AvailableHoursInput {
    @Field(() => [DayHoursInput])
    hours: DayHoursInput[];
}