import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { UploadedFile } from "express-fileupload";

export const moveFile = (file: UploadedFile, validExtensions: string[], folder: string) => {

    return new Promise((resolve, reject) => {

        const splitName = file.name.split('.');

        const extension = splitName[splitName.length - 1];

        if (!validExtensions.includes(extension)) {
            return resolve(`La extensión ${extension} no es permitida. Valores permitidos: ${validExtensions.join(', ')}`);
        }

        const tempName = uuidv4() + '.' + extension;

        let uploadPath: string =  path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (error) => {
            if (error) {
                return reject(error);
            }
    
            resolve(tempName);

        });
    });

};