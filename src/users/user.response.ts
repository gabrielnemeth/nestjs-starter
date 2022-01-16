import {Exclude, Expose, Transform} from 'class-transformer';
import {Types} from 'mongoose';

export class UserResponse {
    @Exclude()
    public _id: Types.ObjectId;

    @Expose()
    @Transform(params => params.obj._id.toString())
    public get id(): Types.ObjectId {
        return this._id;
    }

    public email: string;

    @Exclude()
    public password: string;

    @Exclude()
    public __v: number;

    public constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}
