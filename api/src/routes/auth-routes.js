import express from 'express';
import { createLoggerNamespace } from '../logger/index.js';
import { loginController } from '../controllers/auth-controller.js';
import config from '../config/config.js';
import validationMiddlewares, { loginBodySchema } from '../middlewares/user-input-validation.js';
import createBodyParser from '../middlewares/body-parsing.js';

const authRoutesLogger = createLoggerNamespace('groupomania:api:routes:auth');

const router = express.Router();
authRoutesLogger.verbose('Authentication router initialisation');

const expressJsonOptions = {
    limit: config.get('payload.maxSize')
};

/**
 * Login route.
 * Parses the request's body.
 * Validates and sanitizes body data.
 * Call the corresponding controller.
 */
router.post(
    '/login',
    createBodyParser({
        'application/json': express.json(expressJsonOptions)
    }, false),
    validationMiddlewares(loginBodySchema),
    loginController
);
authRoutesLogger.debug('POST /login - login route added');

export default router;