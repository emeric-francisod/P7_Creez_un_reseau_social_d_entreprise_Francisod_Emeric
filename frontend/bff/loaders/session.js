import { createLoggerNamespace } from '../logger/index.js';
import session from 'express-session';
import config from '../config/config.js';
import memoryStore from 'memorystore';

const loaderLogger = createLoggerNamespace('groupomania:bff:loader:session');

/**
 * Setup the session middleware.
 * @param {Express.Application} app - Express application
 */
export default function sessionLoader(app) {
    loaderLogger.verbose('Loading session middleware');

    const MemoryStore = memoryStore(session);

    app.use(
        session({
            cookie: {
                httpOnly: config.get('session.httpOnly'),
                secure: config.get('session.secure'),
                sameSite: config.get('session.sameSite'),
                maxAge: config.get('session.cookieExp'),
            },
            name: config.get('session.name'),
            secret: config.get('session.secret'),
            resave: false,
            saveUninitialized: false,
            unset: 'destroy',
            store: new MemoryStore({
                checkPeriod: config.get('session.cookieExp'),
            }),
        }),
    );
    loaderLogger.debug('Session middleware loaded');
}
