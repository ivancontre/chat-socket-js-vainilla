import { Router } from 'express';
import { check } from 'express-validator';
import { updateImageCloudinary, upload, getImage } from '../controllers';
import { enabledCollections } from '../helpers';
import { fieldsValidator, validateFile, verifyJWT } from '../middlewares';


const router: Router = Router();

router.post(
    '/',
    verifyJWT,
    validateFile,
    upload
);

router.put(
    '/:collection/:id',
    verifyJWT,
    validateFile,
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('collection').custom(c => enabledCollections(c, ['users', 'products'])),
        fieldsValidator
    ],
    updateImageCloudinary
);

router.get(
    '/:collection/:id',
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('collection').custom(c => enabledCollections(c, ['users', 'products'])),
        fieldsValidator
    ],
    getImage

)

module.exports = router;