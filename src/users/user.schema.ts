import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({type: String, required: true})
    public email: string;

    @Prop({type: String, required: true})
    public password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
