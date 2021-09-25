import { Router } from 'express';
import { check, query } from 'express-validator';
import { 
    deleteProduct, 
    postProduct, 
    putProduct, 
    getProduct, 
    getProducts 
} from '../controllers';
import { existsCategory, existsProduct } from '../helpers/dbValidators';
import { fieldsValidator, hasRole, verifyJWT } from '../middlewares';

const router: Router = Router();

router.get(
    '/',
    [
        query('limit', 'El queryParmas "limit" debe ser un número entero').optional().isNumeric(),
        query('from', 'El queryParams "from" debe ser un número entero').optional().isNumeric(),
    ],
    getProducts
);

router.get(
    '/:id',
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsProduct),  
        fieldsValidator
    ],
    getProduct
);

router.post(
    '/', 
    verifyJWT, 
    [
        check('name', 'El campo "name" es obligatorio').not().isEmpty(),
        check('category', 'El ID categoría no es válido').isMongoId(),
        check('category').custom(existsCategory),
        check('price').optional().isNumeric(),
        fieldsValidator
    ],
    postProduct
);

router.put(
    '/:id', 
    verifyJWT, 
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsProduct),
        check('category', 'El ID categoría no es válido').optional().isMongoId(),
        check('category').optional().custom(existsCategory),
        check('price').optional().isNumeric(),
        fieldsValidator
    ],
    putProduct
);

router.delete(
    '/:id',
    verifyJWT,
    hasRole('ADMIN_ROLE'),
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsProduct),
        fieldsValidator
    ],
    deleteProduct
);

module.exports = router;