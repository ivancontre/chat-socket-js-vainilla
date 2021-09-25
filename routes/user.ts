import { Router } from 'express';
import { check, query } from 'express-validator';
import { 
    deleteUser, 
    getUsers, 
    patchUser, 
    postUser, 
    putUser 
} from '../controllers';
import { existsEmail, existsUser, isValidRole } from '../helpers/dbValidators';

import {
    fieldsValidator,
    verifyJWT,
    hasRole
} from '../middlewares';

const router: Router = Router();

//router.use(verifyJWT);

router.get(
    '/',
    verifyJWT,
    [
        query('limit', 'El queryParmas "limit" debe ser un número entero').optional().isNumeric(),
        query('from', 'El queryParams "from" debe ser un número entero').optional().isNumeric(),
        fieldsValidator
    ],
    getUsers
);

router.post(
    '/',
    [
        check('name', 'El campo "name" es obligatorio').not().isEmpty(),
        check('email', 'El campo "email" es obligatorio').isEmail(),
        check('email').custom(existsEmail),
        check('password', 'El campo "password" debe de ser al menos de 6 caracteres').isLength({ min: 6 }),
        check('role').optional().custom(isValidRole),
        fieldsValidator
    ],
    postUser
);

router.put(
    '/:id',
    verifyJWT,
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsUser),
        fieldsValidator
    ],
    putUser
);

router.delete(
    '/:id',
    verifyJWT,
    //isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('id').custom(existsUser),
        fieldsValidator
    ],
    deleteUser
);

router.patch(
    '/',
    patchUser
);

module.exports = router;