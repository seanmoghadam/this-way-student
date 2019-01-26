import AWS from "aws-sdk";
import fs from "fs";
import sharp from "sharp";
import config from "../../config/config";
import {randomString} from "./helpers";

//this is the file management and upload class


AWS.config.loadFromPath("AwsConfig.json");
const s3 = new AWS.S3();

export default class File {
    constructor() {
        this.bucket = "this-way";
        this.uploadDir = "client/uploads";
        this.fileName = "";
        this.imageUploadOptions = config.imageUploadOptions;
    }


    _storeInFs({stream, filename}) {
        const id = randomString(15);
        const newFilename = id + "-" + filename;
        this.fileName = newFilename;
        const dir = this.uploadDir;
        const path = `${dir}/${newFilename}`;
        return new Promise((resolve, reject) => {
            stream.on("error", error => {
                if (stream.truncated) fs.unlinkSync(path);
                reject(error);
            })
                .pipe(fs.createWriteStream(path))
                .on("finish", () => resolve(path));
        });
        //returns promise
    }

    _createParams(body, fileName) {
        return {
            Key: fileName || this.fileName,
            Body: body,
            Bucket: this.bucket
        };
    }

    static _clearFromFs(path) {
        try {
            if (path !== undefined) fs.unlinkSync(path);
        } catch (err) {
        }

        //returns promise
    }


    _uploadToS3(params, path, resolvePath, rejectPath) {
        s3.upload(params, (perr, pres) => {
            if (perr) {
                rejectPath("Error", perr);
            } else {
                console.log("uploaded");
                resolvePath(pres.Location);
                File._clearFromFs(path);
            }
        });
    }

    uploadAudioFile(image, resolvePath, rejectPath) {
        image.then((uploadStream) => {
            const stream = uploadStream.stream;
            const filename = uploadStream.filename;
            this._storeInFs({stream, filename}).then((path) => {
                fs.readFile(path, (err, fileBuffer) => {
                    if (err) rejectPath(err);
                    let params = this._createParams(fileBuffer);
                    this._uploadToS3(params, path, resolvePath, rejectPath);
                });
            });
        }).catch((error) => console.log(error));

    }


    processAndUploadImage(image, resolvePaths, rejectPaths) {
        image.then((uploadStream) => {
            const stream = uploadStream.stream;
            const filename = uploadStream.filename;
            this._storeInFs({stream, filename}).then((path) => {
                fs.readFile(path, (err, fileBuffer) => {
                    Promise.all(this.imageUploadOptions.map(option => {
                        return new Promise((resolvePath, rejectPath) => {
                            const transformer = sharp(fileBuffer);
                            const newBuffer = transformer.resize(option.width, option.height);
                            let newFileName = option.filePrefix + this.fileName;
                            let params = this._createParams(newBuffer, newFileName);
                            this._uploadToS3(params, path, resolvePath, rejectPath);
                        });
                    })).then(paths => resolvePaths(paths));

                });
                //processing images to 4 sizes and preparing upload

            });
        }).catch((error) => console.log(error));
    }
}