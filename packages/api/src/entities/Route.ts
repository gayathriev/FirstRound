import {
    prop,
    Ref,
    getModelForClass
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType
} from "type-graphql";

// entity imports
import { VenueModel } from './Venue';

/**
 * @description
 * Schema definition
 * Describes how route objects
 * will be stored
 * 
 * @field _id: ID of the route
 * @field routeGeometry: an array of routeGeomtry components
 *                       that make up the route
 */
@ObjectType()
export class RouteSchema {
    @Field(() => ID)
    _id: string;

    @Field()
    @prop({ required: true })
    name!: string;

    @Field(() => [ID])
    @prop({ required: true, ref: () => VenueModel })
    venuesInRoute!: Ref<VenueModel>[];

    @Field()
    @prop({ required: true })
    routeGeometry!: string;
}

export const RouteModel = getModelForClass(RouteSchema);
