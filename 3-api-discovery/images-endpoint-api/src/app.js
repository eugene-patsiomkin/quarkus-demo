const bodyParserErrorHandler = (error, req, res, next) => {
    switch (true) {
        case (error instanceof SyntaxError) && error.message.includes('JSON'):
            console.error(error);
            res.status(400).end("Invalid JSON provided");
            break;

        default:
            next();
    }
};

export {
    bodyParserErrorHandler
}