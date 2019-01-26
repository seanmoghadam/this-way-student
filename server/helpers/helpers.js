import compression from "compression";
import sha256 from "js-sha256";
import jwt from "jsonwebtoken";
import {pick} from "ramda";
import validator from "validator";
import config from "../../config/config";
import {server} from "../index.js";


export function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
}

export const randomString = function (length = 10) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export function generateHashedCredentialsWithSalt(password) {
    let salt = randomString(10);
    return sha256(password + salt) + ":" + salt;
}

export function generateHashedCredential(password) {
    return sha256(password);
}


export function generateToken(payload, exp) {
    return jwt.sign(payload, server.get("superSecret"), {
        expiresIn: exp ? exp : "7d" // expires in 7 days
    });
}

export function requesterIsAdmin(context) {
    if (context && context.headers && context.headers.authorization) {
        let splittedToken = context.headers.authorization.split(" ");
        let token = splittedToken[1];
        if (typeof token === "string" && token.length >= 5) {
            if (jwt.verify(token, config.secret)) {
                let decodedToken = jwt.decode(token);
                return decodedToken.admin || false;
            } else return false;
        } else return false;
    } else return false;

}

export function requesterIsUser(context) {
    if (context && context.headers && context.headers.authorization) {
        let splittedToken = context.headers.authorization.split(" ");
        let token = splittedToken[1];
        if (typeof token === "string" && token.length >= 5) {
            return jwt.verify(token, config.secret);
        } else return false;
    } else return false;

}

export function sanitizeObject(params) {
    Object.keys(params).map(item => {
        if (typeof item === "string") {
            validator.sanitize(item);
        }
    });
    return params;
}

export function getIdFromHeaderToken(context) {
    if (context && context.headers && context.headers.authorization) {
        let splittedToken = context.headers.authorization.split(" ");
        let token = splittedToken[1];
        const decodedToken = jwt.decode(token);
        return decodedToken.id;
    }


}

export function formatUploadedImages(images, title) {
    let formattedImages = [];
    images.map(sizedImages => {
        formattedImages = [...formattedImages, sizedImages.original ? pick(["original", "imageSet", "originalAlt"], sizedImages) : {
            original: sizedImages[0],
            originalAlt: title,
            imageSet: [
                {
                    srcSet: sizedImages[2],
                    media: "(min-width:" + config.imageUploadOptions[2].width + "px)",
                },
                {
                    srcSet: sizedImages[1],
                    media: "(min-width:" + config.imageUploadOptions[1].width + "px)",
                }
            ]
        }];
    });
    return formattedImages;
}
