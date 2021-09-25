import { sign, JwtPayload, verify  } from 'jsonwebtoken';
import { UserModel } from '../models';

export const generateJWT = (id: string, name: string) => {
    
    return new Promise((resolve, reject) => {

        const payload = {
            id,
            name
        };

        sign(payload, process.env.SECRET_JWT_SEED as string, {
            expiresIn: '2h'
        }, (error, token) => {
            
            if (error) {
                console.log(error);
                return reject('No se pudo generar el token');
            }

            resolve(token);
        });
        
    });
};

export const verifyJwtInSocket = async (token: string) => {

    try {
        
        if (token.length <= 10) {
            return null;
        }

        const payload: JwtPayload = verify(token, process.env.SECRET_JWT_SEED as string) as JwtPayload;
        
        const { id } = payload;

        const userAuthtenticated = await UserModel.findOne({ _id: id });

        if (!userAuthtenticated) {
            return null;
        }
        
        if (!userAuthtenticated!.status) {
            return null;
        }

        return userAuthtenticated;

        
    } catch (error) {
        return null;
    }
};