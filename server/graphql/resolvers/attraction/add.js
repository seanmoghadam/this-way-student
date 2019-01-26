import File from "../../../helpers/File";
import {formatUploadedImages, requesterIsAdmin} from "../../../helpers/helpers";
import AttractionModel from "../../../models/attraction";

export default {
    resolve(err, params, context) {
        if (requesterIsAdmin(context)) {
            return new Promise((resolve) => {
                const UserInput = params.input;
                let {title, description, lat, lng, duration, shortDescription} = UserInput;

                //promise all files for multiple uploads
                const uploadAudioPromise = UserInput.audioFiles.map(audioFile => {
                    return new Promise((resolvePath, rejectPath) => {
                        const AudioFile = new File();
                        AudioFile.uploadAudioFile(audioFile, resolvePath, rejectPath);
                    });
                });

                //proccessing all images to different sizes and upload them to aws
                const uploadImagePromise = UserInput.images.map(image => {
                    return new Promise((resolvePath, rejectPath) => {
                        const Image = new File();
                        Image.processAndUploadImage(image, resolvePath, rejectPath);
                    });
                });

                //Im going through an array of arrays which return the paths of the uploaded files
                const allUploads = [uploadAudioPromise, uploadImagePromise];

                Promise.all(allUploads.map(innerArray => {
                    return Promise.all(innerArray);
                })).then(paths => {
                    const audioFiles = paths[0];
                    const images = paths[1];
                    let Attraction = new AttractionModel();
                    Attraction.images = formatUploadedImages(images, title);
                    Attraction.audioFiles = audioFiles;
                    Attraction.description = description;
                    Attraction.shortDescription = shortDescription;
                    Attraction.title = title;
                    Attraction.lat = lat;
                    Attraction.lng = lng;
                    Attraction.duration = duration;
                    resolve(Attraction.save());
                });
            });
        }
        else {
            return "unauthorized";
        }

    }
};