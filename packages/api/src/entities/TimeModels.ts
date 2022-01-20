import {
    prop,
    getModelForClass
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    Int
} from "type-graphql";

/**
 * @description
 * Defines how times will be handled
 * and stored in various entities
 * 
 * @field _id: ID of the time model
 * @field hours: integer hour
 * @field minutes: integer minute
 */
@ObjectType()
export class TimeModel {
    @Field(() => ID)
    public _id: string;

    @Field(() => Int)
    @prop({ required: true })
    public hours!: number;

    @Field(() => Int)
    @prop({ required: true })
    public minutes!: number;
}

/**
 * @description
 * Defines how open and 
 * close times are stored
 * on a particular day
 * 
 * @field _id: ID of days hour model
 * @field day: day of the week
 * @field open: open time
 * @field close: close time
 */
@ObjectType()
export class DayHoursModel {
    @Field(() => ID)
    public _id: string;

    @Field()
    @prop({ required: true })
    public day!: string;

    @Field(() => TimeModel)
    @prop({ required: true, type: () => TimeModel })
    public open!: TimeModel;

    @Field(() => TimeModel)
    @prop({ required: true, type: () => TimeModel })
    public close!: TimeModel;
}

/**
 * @description
 * Defines how open and close times
 * on different days are stored
 * 
 * @field _id: ID of the available hours model
 * @field hours: an array of day hours models for
 *               particular days
 */
@ObjectType()
export class AvailableHoursModel {
    @Field(() => ID)
    public _id: string;

    @Field(() => [DayHoursModel])
    @prop({ required: true, type: () => DayHoursModel })
    public hours!: DayHoursModel[];
}

export const AvailableHours = getModelForClass(AvailableHoursModel);
export const DayHours = getModelForClass(DayHoursModel);
export const Time = getModelForClass(TimeModel);