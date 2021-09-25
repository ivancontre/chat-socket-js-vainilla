import { Router } from 'express';
import { search } from '../controllers';

const router: Router = Router();

router.get(
    '/:collection/:term',
    search
);

module.exports = router;