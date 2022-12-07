import HttpError from './HttpError.js';

/**
 * Class representing an error occuring when a ressource can't be found in the API.
 * Inherits from the HttpError object.
 */
export default class NotFoundError extends HttpError {
    /**
     * NotFoundError constructor.
     * Calls the error constructor and sets the status.
     * @param {Object} error - Object containing the public error informations. This object may contain any property, even if not defined in the documentation. Any other property will be logged, but not sent to the user.
     * @param {string} error.message - Error message.
     * @param {string} [error.title] - User friendly short error message.
     * @param {string} [error.description] - User friendly more in depth error description
     * @param {Array|*} [error.details] - More informations about the error, that would be unclear if depicted in a string.
     * @param {string} error.path - Path of the request that generated the error.
     * @param {string} error.method - Method of the request that generated the error.
     * @param {*} [cause] - Original error, used to generate the HTTP error.
     * @param {Object} [headers = {}] - Headers to add to the response.
     */
    constructor({message, title: optionnalTitle, description: optionnalDescription, details, path, method, ...otherData}, cause, headers = {}) {
        const statusCode = 404;
        const name = 'NotFoundError';
        const title = optionnalTitle || 'The ressource you are requesting can\'t be found.';
        const description = optionnalDescription || 'We can\'t find the ressource you\'re requesting. It may have been deleted, modified, move, or may have never existed. Please, double check your request and try again.';
        super({ message, name, title, description, details, statusCode, path, method, ...otherData }, cause, headers);
    }
}