import { Request, Response} from 'express';
import { IProduct, ProductModel } from '../models';

export const getProducts = async (req: Request, res: Response) => {

    try {

        const { limit = 5, from = 0 } = req.query;

        const [total, products] = await Promise.all([
            ProductModel.find({ status: true })
                .countDocuments(),

            ProductModel.find({ status: true })
                .populate('user', 'name')
                .populate('category', 'name')
                .limit(Number(limit))
                .skip(Number(from))                 
        ]);

        return res.status(200).json({
            total, 
            products
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};

export const getProduct =  async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        const product = await ProductModel.findById(id).populate('user', 'name').populate('category', 'name');

        return res.status(200).json({
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
    
};

export const postProduct = async (req: Request, res: Response) => {    

    try {

        const { name, status, user, ...body} = req.body;

        const productDB = await ProductModel.findOne({ name: name.toUpperCase() });

        if (productDB) {
            return res.status(400).json({
                msg: `El producto ${ productDB.name } ya existe`
            });
        }

        const product: IProduct = new ProductModel({
            name: name.toUpperCase(),
            user: req.user._id,
            ...body
        });

        await product.save();

        return res.status(201).json({
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};

export const putProduct = async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        const { status, user, ...body} = req.body;

        if (body.name) {

            body.name = body.name.toUpperCase();

            const productDB = await ProductModel.findOne({ name: body.name });            

            if (productDB) {

                if (productDB["_id"].toString() !== id) {   

                    return res.status(400).json({
                        msg: `El producto ${ productDB.name } ya existe`
                    });

                }
                
            }
        }        

        const product = await ProductModel.findByIdAndUpdate(id, {
            user: req.user._id,
            ...body
        }, { new: true });

        return res.status(200).json({
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {    

    try {

        const id = req.params.id;

        const product = await ProductModel.findByIdAndUpdate(id, { status: false }, { new: true });

        return res.status(200).json({
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};