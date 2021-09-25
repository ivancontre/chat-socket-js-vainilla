import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

export interface ICategory extends Document{
    name: string;
    status?: boolean;
    user: PopulatedDoc<IUser>
};

const schema: Schema = new Schema({
    name: { 
        type: String, 
        required: [true, 'the "name" is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, status, ...category } = this.toObject();
    category.id = _id;
    return category;

};

export const CategoryModel: Model<ICategory> = model<ICategory>('Category', schema);