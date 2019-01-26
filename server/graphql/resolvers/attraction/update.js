import File from "../../../helpers/File";
import {formatUploadedImages, requesterIsAdmin} from "../../../helpers/helpers";
import AttractionModel from "../../../models/attraction";


export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                const UserInput = params.input;
                let {title, description, lat, lng, id, duration, shortDescription} = UserInput;


                //promise all files for multiple uploads
                const uploadAudioPromise = UserInput.audioFiles.map(audioFile => {
                    if (typeof audioFile === "string") {
                        return audioFile;
                    } else {
                        return new Promise((resolvePath, rejectPath) => {
                            const AudioFile = new File();
                            AudioFile.uploadAudioFile(audioFile, resolvePath, rejectPath);
                        });
                    }

                });

                //processing all images to different sizes and upload them to aws
                const uploadImagePromise = UserInput.images.map(image => {
                    if (image.imageSet) {
                        return image;
                    } else {
                        return new Promise((resolvePath, rejectPath) => {
                            const Image = new File();
                            Image.processAndUploadImage(image, resolvePath, rejectPath);
                        });
                    }

                });

                //Im going through an array of arrays which return the paths of the uploaded files
                const allUploads = [uploadAudioPromise, uploadImagePromise];
                Promise.all(allUploads.map(innerArray => {
                    return Promise.all(innerArray);
                })).then(paths => {
                    const audioFiles = paths[0];
                    let images = paths[1];
                    images = formatUploadedImages(images);
                    AttractionModel.findOne({"_id": id}, function (err, attraction) {
                        if (err) console.error(err);
                        attraction.images = formatUploadedImages(images, title);
                        attraction.images.map(image => image.originalAlt = title);
                        attraction.audioFiles = audioFiles;
                        attraction.description = description;
                        attraction.shortDescription = shortDescription;
                        attraction.title = title;
                        attraction.lat = lat;
                        attraction.lng = lng;
                        attraction.duration = duration;
                        attraction.save(function (err, updatedAttraction) {
                            if (err) console.error(err);
                            resolve(updatedAttraction);
                        });
                    });
                });
            });
        }
        else {
            return "unauthorized";
        }

    }
};