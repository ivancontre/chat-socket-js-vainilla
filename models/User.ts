import { Schema, model, Document, Model } from 'mongoose';

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    img?: string;
    role?: string;
    status?: boolean;
    google?: boolean;
};

const schema: Schema = new Schema({
    name: { 
        type: String, 
        required: [true, 'the "name" is required'] 
    },
    email: { 
        type: String, 
        required:  [true, 'the "email" is required'],
        unique: true
    },
    password: { 
        type: String, 
        required:  [true, 'the "password" is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, password, ...user } = this.toObject();
    user.id = _id;
    return user;

};


export const UserModel: Model<IUser> = model<IUser>('User', schema);