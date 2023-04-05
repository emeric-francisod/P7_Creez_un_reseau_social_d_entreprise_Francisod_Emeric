import { createLoggerNamespace } from '../../logger/index.js';
import loginController from '../../controllers/authentication/login.js';
import createBodyParser from '../../middlewares/body-parsing.js';
import validationMiddlewares from '../../middlewares/user-input-validation.js';
import authenticate from '../../middlewares/authentication.js';
import loginBodySchema from '../../schemas/login.js';
import signupController from '../../controllers/authentication/signup.js';
import signupBodySchema from '../../schemas/signup.js';
import updateUserSchema from '../../schemas/updateUser.js';
import updateUserController from '../../controllers/users/updateUser.js';

const loaderLogger = createLoggerNamespace('groupomania:bff:bff-loader:routes');

/**
 * Add all routes.
 * @param {Express.Application} router - Express application
 */
export default function routeLoader(router) {
    loaderLogger.verbose('Loading html routes');

    router.post(
        '/login',
        createBodyParser(true),
        validationMiddlewares(loginBodySchema),
        authenticate(false),
        loginController
    );
    loaderLogger.debug('POST /login - add route to login or refresh the access token');

    router.post(
        '/signup',
        createBodyParser(true, false),
        validationMiddlewares(signupBodySchema),
        authenticate(false),
        signupController
    );
    loaderLogger.debug('POST /signup - add route to login or refresh the access token');

    router.put(
        '/users/:userId',
        createBodyParser(true, false),
        validationMiddlewares(updateUserSchema),
        authenticate(true),
        updateUserController
    );
    loaderLogger.debug('PUT /users/:userId - add route to update the user password and email');
}