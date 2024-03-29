import HttpError from '../../src/errors/HttpError.js';

describe('HttpError test suite', () => {
    const errorInformations = {
        message: 'Error message',
        name: 'specialError',
        title: 'Error short user description',
        description: 'More informations about the error',
        details: [
            {
                info: 'Details object',
                error: 'Invalid',
            },
            {
                info: 'Details object',
                error: 'Invalid',
            },
        ],
        logDetails: [
            {
                info: 'Details object for log',
                error: 'Invalid',
            },
            {
                info: 'Details object for log',
                error: 'Invalid',
            },
        ],
        statusCode: 555,
        path: 'api/error',
        method: 'GET',
        moreData1: 'Supplement',
        moreData2: 'Second supplement',
    };
    const origin = new Error('Error message');
    const headers = {
        'header1': 'value',
        'header2': 'value',
    };

    describe('Constructor test suite', () => {
        it('should create an instance with the specified informations', () => {
            const error = new HttpError(errorInformations, origin, headers);

            expect(error).toHaveProperty('name', errorInformations.name);
            expect(error).toHaveProperty('message', errorInformations.message);
            expect(error).toHaveProperty('title', errorInformations.title);
            expect(error).toHaveProperty('description', errorInformations.description);
            expect(error).toHaveProperty('details', errorInformations.details);
            expect(error).toHaveProperty('logDetails', errorInformations.logDetails);
            expect(error).toHaveProperty('statusCode', errorInformations.statusCode);
            expect(error).toHaveProperty('path', errorInformations.path);
            expect(error).toHaveProperty('method', errorInformations.method);
            expect(error).toHaveProperty('dateTime');
            expect(error).toHaveProperty('cause', origin);
            expect(error).toHaveProperty('more');
            expect(error.more).toHaveProperty('moreData1', errorInformations.moreData1);
            expect(error.more).toHaveProperty('moreData2', errorInformations.moreData2);
            expect(error).toHaveProperty('headers', headers);
        });

        it('should create an instance with the default informations', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
            };
            const error = new HttpError(lessErrorInformations);

            expect(error).toHaveProperty('name', 'HttpError');
            expect(error).toHaveProperty('message', errorInformations.message);
            expect(error).toHaveProperty('title');
            expect(error.title).toBeUndefined();
            expect(error).toHaveProperty('description');
            expect(error.description).toBeUndefined();
            expect(error).toHaveProperty('details');
            expect(error.details).toBeUndefined();
            expect(error).toHaveProperty('logDetails');
            expect(error.logDetails).toBeUndefined();
            expect(error).toHaveProperty('statusCode', 500);
            expect(error).toHaveProperty('path');
            expect(error.path).toBeUndefined();
            expect(error).toHaveProperty('method');
            expect(error.method).toBeUndefined();
            expect(error).toHaveProperty('dateTime');
            expect(error).not.toHaveProperty('cause');
            expect(error).toHaveProperty('more');
            expect(error.more).toEqual({});
            expect(error).toHaveProperty('headers', {});
        });

        it('should create an instance with details that is not an array', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
                details: errorInformations.details[0],
            };
            const error = new HttpError(lessErrorInformations);

            expect(error).toHaveProperty('name', 'HttpError');
            expect(error).toHaveProperty('message', errorInformations.message);
            expect(error).toHaveProperty('title');
            expect(error.title).toBeUndefined();
            expect(error).toHaveProperty('description');
            expect(error.description).toBeUndefined();
            expect(error).toHaveProperty('details', [errorInformations.details[0]]);
            expect(error).toHaveProperty('logDetails');
            expect(error.logDetails).toBeUndefined();
            expect(error).toHaveProperty('statusCode', 500);
            expect(error).toHaveProperty('path');
            expect(error.path).toBeUndefined();
            expect(error).toHaveProperty('method');
            expect(error.method).toBeUndefined();
            expect(error).toHaveProperty('dateTime');
            expect(error).not.toHaveProperty('cause');
            expect(error).toHaveProperty('more');
            expect(error.more).toEqual({});
            expect(error).toHaveProperty('headers', {});
        });

        it('should create an instance with logDetails that is not an array', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
                logDetails: errorInformations.logDetails[0],
            };
            const error = new HttpError(lessErrorInformations);

            expect(error).toHaveProperty('name', 'HttpError');
            expect(error).toHaveProperty('message', errorInformations.message);
            expect(error).toHaveProperty('title');
            expect(error.title).toBeUndefined();
            expect(error).toHaveProperty('description');
            expect(error.description).toBeUndefined();
            expect(error).toHaveProperty('details');
            expect(error.details).toBeUndefined();
            expect(error).toHaveProperty('logDetails', [errorInformations.logDetails[0]]);
            expect(error).toHaveProperty('statusCode', 500);
            expect(error).toHaveProperty('path');
            expect(error.path).toBeUndefined();
            expect(error).toHaveProperty('method');
            expect(error.method).toBeUndefined();
            expect(error).toHaveProperty('dateTime');
            expect(error).not.toHaveProperty('cause');
            expect(error).toHaveProperty('more');
            expect(error.more).toEqual({});
            expect(error).toHaveProperty('headers', {});
        });
    });



    describe('getErrorResponse test suite', () => {
        it('should return an object containing the error informations', () => {
            const error = new HttpError(errorInformations);
            const errorResponse = error.getErrorResponse();

            expect(errorResponse).toHaveProperty('error');
            expect(errorResponse).toHaveProperty('error.type', error.name);
            expect(errorResponse).toHaveProperty('error.title', error.title);
            expect(errorResponse).toHaveProperty('error.message', error.description);
            expect(errorResponse).toHaveProperty('error.details', error.details);
            expect(errorResponse).toHaveProperty('error.statusCode', error.statusCode);
            expect(errorResponse).toHaveProperty('error.path', error.path);
            expect(errorResponse).toHaveProperty('error.method', error.method);
            expect(errorResponse).toHaveProperty('error.timestamp', error.dateTime);
        });

        it('should return an object with no optionnal informations', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
            };
            const error = new HttpError(lessErrorInformations);
            const errorResponse = error.getErrorResponse();

            expect(errorResponse).toHaveProperty('error');
            expect(errorResponse).toHaveProperty('error.type', error.name);
            expect(errorResponse).toHaveProperty('error.title', error.message);
            expect(errorResponse).not.toHaveProperty('error.message');
            expect(errorResponse).not.toHaveProperty('error.details');
            expect(errorResponse).toHaveProperty('error.statusCode', error.statusCode);
            expect(errorResponse).not.toHaveProperty('error.path');
            expect(errorResponse).not.toHaveProperty('error.method');
            expect(errorResponse).toHaveProperty('error.timestamp', error.dateTime);
        });
    });



    describe('getErrorLogInformations test suite', () => {
        it('should return an object containing the error log informations', () => {
            const error = new HttpError(errorInformations, origin);
            const errorResponse = error.getErrorLogInformations();

            expect(errorResponse).toHaveProperty('label', error.name);
            expect(errorResponse).toHaveProperty('message', error.message);
            expect(errorResponse).toHaveProperty('details', error.logDetails);
            expect(errorResponse).toHaveProperty('statusCode', error.statusCode);
            expect(errorResponse).toHaveProperty('errorDate', error.dateTime);
            expect(errorResponse).toHaveProperty('path', error.path);
            expect(errorResponse).toHaveProperty('method', error.method);
            expect(errorResponse).toHaveProperty('stack', error.stack);
            expect(errorResponse).toHaveProperty('originStack', error.cause.stack);
            expect(errorResponse).toHaveProperty('moreData1', error.more.moreData1);
            expect(errorResponse).toHaveProperty('moreData2', error.more.moreData2);
        });

        it('should return an object with no optionnal informations', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
            };
            const error = new HttpError(lessErrorInformations);
            const errorResponse = error.getErrorLogInformations();

            expect(errorResponse).toHaveProperty('label', error.name);
            expect(errorResponse).toHaveProperty('message', error.message);
            expect(errorResponse).not.toHaveProperty('details');
            expect(errorResponse).toHaveProperty('statusCode', error.statusCode);
            expect(errorResponse).toHaveProperty('errorDate', error.dateTime);
            expect(errorResponse).not.toHaveProperty('path');
            expect(errorResponse).not.toHaveProperty('method');
            expect(errorResponse).toHaveProperty('stack', error.stack);
            expect(errorResponse).not.toHaveProperty('originStack');
        });

        it('should return an object with the public details if log details are not available but public details are', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
                details: errorInformations.details,
            };
            const error = new HttpError(lessErrorInformations);
            const errorResponse = error.getErrorLogInformations();

            expect(errorResponse).toHaveProperty('label', error.name);
            expect(errorResponse).toHaveProperty('message', error.message);
            expect(errorResponse).toHaveProperty('details', error.details);
            expect(errorResponse).toHaveProperty('statusCode', error.statusCode);
            expect(errorResponse).toHaveProperty('errorDate', error.dateTime);
            expect(errorResponse).not.toHaveProperty('path');
            expect(errorResponse).not.toHaveProperty('method');
            expect(errorResponse).toHaveProperty('stack', error.stack);
            expect(errorResponse).not.toHaveProperty('originStack');
        });
    });



    describe('setRequestInformations test suite', () => {
        it('should update the path and the method and return the instance', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
            };
            const error = new HttpError(lessErrorInformations);

            const errorInstance = error.setRequestInformations(errorInformations.path, errorInformations.method);

            expect(error.path).toBe(errorInformations.path);
            expect(error.method).toBe(errorInformations.method);
            expect(errorInstance).toBe(error);
        });
    });



    describe('setPublicMessages test suite', () => {
        it('should update the title and the description and return the instance', () => {
            const lessErrorInformations = {
                message: errorInformations.message,
            };
            const error = new HttpError(lessErrorInformations);

            const errorInstance = error.setPublicMessages(errorInformations.title, errorInformations.description);

            expect(error.title).toBe(errorInformations.title);
            expect(error.description).toBe(errorInformations.description);
            expect(errorInstance).toBe(error);
        });
    });
});