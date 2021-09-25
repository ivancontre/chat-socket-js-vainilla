import { Request, Response} from 'express';
import { Types } from 'mongoose';
import { CategoryModel, ProductModel, UserModel } from '../models';

const allowedCollections = [
    'users',
    'products',
    'categories',
    //'roles',
    'products-by-category'
];

const searchUsers = async (term: string, res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term);

    if (isMongoId) {
        const user = await UserModel.findById(term);

        return res.status(200).json({
            results: user ? [ user ] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await UserModel.find({ 
        $or: [
            { name: regex }, 
            { email: regex }
        ],
        $and: [
            { status: true }
        ]
     });

    return res.status(200).json({
        results: users
    });

};

const searchProducts = async (term: string, res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term);

    if (isMongoId) {
        const product = await ProductModel.findById(term).populate('category', 'name');

        return res.status(200).json({
            results: product ? [ product ] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await ProductModel.find({ 
        $or: [
            { name: regex }
        ],
        $and: [
            { status: true }
        ]
     }).populate('category', 'name');

    return res.status(200).json({
        results: products
    });
};

const searchCategories =  async (term: string, res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term);

    if (isMongoId) {
        const category = await CategoryModel.findById(term);

        return res.status(200).json({
            results: category ? [ category ] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await CategoryModel.find({ 
        $or: [
            { name: regex }
        ],
        $and: [
            { status: true }
        ]
     });

    return res.status(200).json({
        results: categories
    });
};

const searchProductsByCategory = async (category: string, res: Response) => {

    try {
        
        const isMongoId = Types.ObjectId.isValid(category);

        if (isMongoId) {

            const products = await ProductModel.find({ 
                $or: [
                    { category: new Types.ObjectId(category) }
                ],
                $and: [
                    { status: true }
                ]
             }).populate('category', 'name');

            return res.status(200).json({
                results: products ? [ products ] : []
            });
        }

        const regex = new RegExp(category, 'i');

        const categories = await CategoryModel.find({ 
            $or: [
                { name: regex }
            ],
            $and: [
                { status: true }
            ]
         });         

        const products = await ProductModel.find({ 
            $or: [
                ...categories.map(category => {
                    return {
                        category: category._id
                    }
                })
            ],
            $and: [
                { status: true }
            ]
        }).populate('category', 'name');

        return res.status(200).json({
            results: products
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const search = async (req: Request, res: Response) => {

    try {

        const { collection, term } = req.params;

        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                msg: `Las colecciones permitidas son: ${allowedCollections.join(', ')}`
            });
        }

        switch (collection) {
            case 'users':

                await searchUsers(term, res);               
                
                break;

            case 'products':

                await searchProducts(term, res);

                break;

            case 'categories':
        
                await searchCategories(term, res);

                break;

            case 'products-by-category':

                await searchProductsByCategory(term, res);

                break;
                
            default:

                return res.status(400).json({
                    msg: 'Debe indicar una colección'
                });

                break;
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
    
};