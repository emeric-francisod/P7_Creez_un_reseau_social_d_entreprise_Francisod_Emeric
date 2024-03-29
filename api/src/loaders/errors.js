import { createLoggerNamespace } from '../logger/index.js';
import {
    unHandledRequestHandler,
    errorHandler,
    errorNormalizer,
    deleteFilesOnError,
} from '../middlewares/errors.js';

const loaderLogger = createLoggerNamespace('groupomania:api:loader:errors');

/**
 * Add all error related middlewares.
 * @param {Express.Application} app - Express application
 */
export default function errorsLoader(app) {
    loaderLogger.verbose('Loading error middlewares');

    // Intercept Express 404 errors, sent when the method or the URL isn't defined
    app.use(unHandledRequestHandler);
    loaderLogger.verbose('Middleware to intercept Express Not Found error added.');

    // Delete files saved before the request completion
    app.use(deleteFilesOnError);
    loaderLogger.verbose('File destroyer middleware added');

    // Normalizes error format
    app.use(errorNormalizer);
    loaderLogger.verbose('Error parsing middleware added');

    // Create error responses
    app.use(errorHandler);
    loaderLogger.verbose('Error handling middleware added');

}
