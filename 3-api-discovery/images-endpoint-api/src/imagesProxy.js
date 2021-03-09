const IMAGE_SERVER = "https://images.drivebc.ca",
    IMAGE_PREFIX = "/webcam/api/v1/webcams/",
    IMAGE_POSTFIX = "/imageDisplay";

let buildImageURL = (cameraId) => {
    return `${IMAGE_PREFIX}${cameraId}${IMAGE_POSTFIX}`;
}

let getCameraIdFromURL = (url) => {
    return url.replace(/.*\/camera\/(\d*)\/.*/i, "$1");
};

let pathResolve = (req) => {
    let parts = req.url.split('?');

    parts[0] =  buildImageURL(getCameraIdFromURL(parts[0]));
    return parts.join("?");    
}

export {
    buildImageURL
    , pathResolve
    , IMAGE_SERVER
};