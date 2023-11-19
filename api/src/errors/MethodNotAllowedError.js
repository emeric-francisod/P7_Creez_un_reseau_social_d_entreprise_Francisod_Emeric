import HttpError from './HttpError.js';

/**
 * Class representing an error occuring when a request is done on a known path but with a not allowed method in the API.
 * Inherits from the HttpError object.
 */
export default class MethodNotAllowedError extends HttpError {
    /**
     * MethodNotAllowed constructor.
     * Calls the error constructor and sets the status.
     * @param {Object} error - Object containing the public error informations. This object may contain any property,
     *  even if not defined in the documentation. Any other property will be logged, but not sent to the user.
     * @param {string} error.message - Error message.
     * @param {string} [error.title] - User friendly short error message.
     * @param {string} [error.description] - User friendly more in depth error description.
     * @param {Array|*} [error.details] - More informations about the error, that would be unclear if depicted in a
     *  string. These data will be shown to the user. If you need the data for logging reasons only, add them as
     *  logDetails.
     * @param {Array|*} [error.logDetails] - More informations about the error, that would be unclear if depicted in a
     *  string. These data will not be shown to the user but will be displayed in the log.
     * @param {string} [error.path] - Path of the request that generated the error.
     * @param {string} [error.method] - Method of the request that generated the error.
     * @param {*} [cause] - Original error, used to generate the HTTP error.
     * @param {Object} [headers = {}] - Headers to add to the response.
     */
    constructor(
        {
            message,
            title: optionnalTitle,
            description: optionnalDescription,
            details,
            logDetails,
            path,
            method,
            ...otherData
        },
        cause,
        headers = {}
    ) {
        const statusCode = 405;
        const name = 'MethodNotAllowedError';
        const title = optionnalTitle || 'This method can\'t be used with this ressource.';
        const description = optionnalDescription || `We can't execute you request because the ${method} can't be used on the ${path} path. Please, verify which methods are allowed and try again.`;
        super({
            message,
            name,
            title,
            description,
            details,
            logDetails,
            statusCode,
            path,
            method,
            ...otherData,
        }, cause, headers);
    }
}