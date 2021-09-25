import { Router } from 'express';
import { check, query } from 'express-validator';
import { 
    deleteCategory, 
    getCategories, 
    getCategory, 
    postCategory, 
    putCategory 
} from '../controllers';
import { existsCategory } from '../helpers/dbValidators';
import { fieldsValidator, hasRole, verifyJWT } from '../middlewares';

const router: Router = Router();

router.get(
    '/',
    [
        query('limit', 'El queryParmas "limit" debe ser un número entero').optional().isNumeric(),
        query('from', 'El queryParams "from" debe ser un número entero').optional().isNumeric(),
    ],
    getCategories
);

router.get(
    '/:id',
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsCategory),   
        fieldsValidator
    ],
    getCategory
);

router.post(
    '/', 
    verifyJWT, 
    [
        check('name', 'El campo "name" es obligatorio').not().isEmpty(),
        fieldsValidator
    ],
    postCategory
);

router.put(
    '/:id',
    verifyJWT,
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsCategory),
        check('name', 'El campo "name" es obligatorio').not().isEmpty(),        
        fieldsValidator
    ],
    putCategory
);

router.delete(
    '/:id',
    verifyJWT,
    hasRole('ADMIN_ROLE'),
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsCategory),
        fieldsValidator
    ],
    deleteCategory
);

module.exports = router;