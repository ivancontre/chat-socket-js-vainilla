import { Request, Response} from 'express';
import { compareSync } from 'bcryptjs';

import { UserModel } from '../models';
import { generateJWT } from '../helpers';
import { googleVerify } from '../helpers/googleVerify';
import { TokenPayload } from 'google-auth-library';

export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        // Verficar correo existe
        if (!user) {
            return res.status(400).json({
                msg: `Usuario y contraseña no son correctos`
            });
        }

        // Verficar status
        if (!user.status) {
            return res.status(400).json({
                msg: `Usuario y contraseña no son correctos`
            });
        }

        if (user.google) {
            return res.status(400).json({
                msg: `Cuenta creada con google`
            });
        }

        // Verficar passwords
        const validPassword = compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: `Usuario y contraseña no son correctos`
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const google = async (req: Request, res: Response) => {

    try {

        const { id_token } = req.body;

        const { name, email, picture: img } = await googleVerify(id_token) as TokenPayload;

        let user = await UserModel.findOne({ email });

        // Sino existe lo creamos
        if (!user) {

            user = new UserModel({
                name,
                email,
                img,
                google: true,
                password: ':)',

            });

            await user.save();

        } else { 
            // Si existe lo actualizamos
            await UserModel.findByIdAndUpdate(user.id, {
                name,
                img,
                google: true,
                password: ':)'
            }, { new: true });
        }

        // Verficar status
        if (!user.status) {
            return res.status(401).json({
                msg: 'Por favor hable con el administrador. Usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            user,
            token
        });        

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Token google inválido'
        });
    }   

};

export const renewToken = async (req: Request, res: Response) => {

    const { user } = req;

    try {
        // Generar nuestro JWT
        const token = await generateJWT(user.id, user.name);

        return res.json({
            ok: true,
            token,
            user          
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No fue posible renovar el token'
        });
    }    
};