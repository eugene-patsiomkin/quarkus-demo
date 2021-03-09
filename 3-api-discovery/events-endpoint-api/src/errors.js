class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class NotFoundError extends ExtendableError {}
class UserInputError extends ExtendableError {}


const ControllerErrorHandler = (err, res) => {
    console.info(err);
    switch (true) {
        case err instanceof NotFoundError:
            res.status(404).send(err.message).end();
            break;
        case err instanceof UserInputError:
            res.status(400).send(err.message).end();
            break;
        case err.name == 'ValidationError':
            res.status(400).send(err).end();
            break;
        case err.name == 'MongoError':
            res.status(400).send(err).end();
            break;
        default:
            console.error(err);
            res.status(500).send(err).end();
    }
}

export {
    NotFoundError
    , UserInputError
    , ControllerErrorHandler
}