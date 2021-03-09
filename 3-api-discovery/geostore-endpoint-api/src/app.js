import {
    NotFoundError
} from './errors.js'

const bodyParserErrorHandler = (error, req, res, next) => {
    switch (true) {
        case (error instanceof SyntaxError) && error.message.includes('JSON'):
            res.status(400).end("Invalid JSON provided");
            break;

        default:
            next();
    }
};

export {
    bodyParserErrorHandler
}