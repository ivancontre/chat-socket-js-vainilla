import { Router } from 'express';
import { check } from 'express-validator';
import { google, login, renewToken } from '../controllers';
import { fieldsValidator, verifyJWT } from '../middlewares';

const router: Router = Router();

router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    login
);

router.post(
    '/google',
    [
        check('id_token', 'El id_token es obligatorio').notEmpty(),
        fieldsValidator
    ],
    google
);

router.get(
    '/renew-token',
    verifyJWT,
    renewToken
);

module.exports = router;