import { Request, Response} from 'express';
import { CategoryModel, ICategory } from '../models';

export const getCategories = async (req: Request, res: Response) => {    

    try {

        const { limit = 5, from = 0 } = req.query;

        const [total, categories] = await Promise.all([
            CategoryModel.find({ status: true })
                .countDocuments(),

            CategoryModel.find({ status: true })
                .populate('user', 'name')
                .limit(Number(limit))
                .skip(Number(from))                 
        ]);

        return res.status(200).json({
            total, 
            categories
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};

export const getCategory = async (req: Request, res: Response) => {    

    try {

        const id = req.params.id;

        const category = await CategoryModel.findById(id).populate('user', 'name');

        return res.status(200).json({
            category
        });        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};


export const postCategory = async (req: Request, res: Response) => {    

    try {

        const name = req.body.name.toUpperCase();

        const categoryDB = await CategoryModel.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `La categoría ${ categoryDB.name } ya existe`
            });
        }

        const category: ICategory = new CategoryModel({
            name,
            user: req.user._id
        });

        await category.save();

        return res.status(201).json({
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};

export const putCategory = async (req: Request, res: Response) => {    

    try {

        const id = req.params.id;

        const name = req.body.name.toUpperCase();

        const categoryDB = await CategoryModel.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `La categoría ${ categoryDB.name } ya existe`
            });
        }

        const category = await CategoryModel.findByIdAndUpdate(id, { name, user: req.user._id }, { new: true });

        return res.status(200).json({
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};

export const deleteCategory = async (req: Request, res: Response) => {    

    try {

        const id = req.params.id;

        const category = await CategoryModel.findByIdAndUpdate(id, { status: false }, { new: true });

        return res.status(200).json({
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }

};