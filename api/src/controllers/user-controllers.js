import { createLoggerNamespace } from '../logger/logger.js';
import { createUser } from '../services/users.js';

const userControllerLogger = createLoggerNamespace('groupomania:api:controllers:user');

/**
 * User creation controller.
 * Calls the right service.
 * Sends a message to the client with status 201 if the request is successful, or calls the error handler middleware if an error occurs.
 * @param {Express.Request} req - Express request object.
 * @param {Express.Response} res - Express response object.
 * @param next - Next middleware to execute.
 */
export async function createUserController(req, res, next) {
    userControllerLogger.verbose('Create user middleware starting');
    try {
        const userInfos = {
            email: req.body.email,
            password: req.body.password
        };
        const newUser = await createUser(userInfos);

        const responseData = {
            id: newUser.userId,
            email: newUser.email
        };
        res.status(201).json(responseData);
    } catch (error) {
        return next(error);
    }
}