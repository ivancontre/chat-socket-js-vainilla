import { Schema, model, Document, Model, PopulatedDoc } from 'mongoose';
import { ICategory } from './Category';
import { IUser } from './User';

export interface IProduct extends Document{
    name: string;
    status?: boolean;
    user: PopulatedDoc<IUser>;
    price?: number;
    category: PopulatedDoc<ICategory>;
    description?: string;
    available?: boolean;
    img?: string;
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
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

schema.methods.toJSON = function () {

    const { __v, _id, status, ...category } = this.toObject();
    category.id = _id;
    return category;

};

export const ProductModel: Model<IProduct> = model<IProduct>('Product', schema);