import express from 'express';
import { createLoggerNamespace } from '../logger/index.js';
import { createUserController } from '../controllers/user-controllers.js';
import config from '../config/config.js';
import validationMiddlewares, { createUserBodySchema } from '../middlewares/user-input-validation.js';
import createBodyParser from '../middlewares/body-parsing.js';

const userRoutesLogger = createLoggerNamespace('groupomania:api:routes:user');

const router = express.Router();
userRoutesLogger.verbose('User router initialisation');

const expressJsonOptions = {
    limit: config.get('payload.maxSize')
};

/**
 * User creation route.
 * Parses the request's body.
 * Validates and sanitizes body data.
 * Call the corresponding controller.
 */
router.post(
    '/',
    createBodyParser({
        'application/json': express.json(expressJsonOptions)
    }),
    validationMiddlewares(createUserBodySchema),
    createUserController
);
userRoutesLogger.debug('POST / - create user route added');

export default router;