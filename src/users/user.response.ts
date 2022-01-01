import {Exclude, Expose, Transform} from 'class-transformer';
import {ObjectId} from 'mongoose';

export class UserResponse {
    @Expose()
    @Transform(params => params.obj._id.toString())
    public _id: ObjectId;

    public email: string;

    @Exclude()
    public password: string;

    @Exclude()
    public __v: number;

    public constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}
