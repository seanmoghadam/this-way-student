import validator from "validator";
import {generateHashedCredential, generateToken} from "../../../helpers/helpers";
import userModel from "../../../models/user";

export default {
    resolve(err, params) {
        //promise returns answer if fullfilled or rejected
        return new Promise((resolve) => {
            //error results always null, so safety is improved
            if (validator.isEmail(params.email)) {
                params.email = params.email.toLowerCase();
                userModel.findOne({email: params.email}).exec((err, user) => {
                    if (user) {
                        const email = user.email;
                        const id = user.id;
                        const forename = user.forename;
                        const hashedPasswordWithSalt = user.password;
                        const passwordInput = params.password;
                        let splitPassword = hashedPasswordWithSalt.split(":");
                        const salt = splitPassword[1];
                        const hashedPassword = splitPassword[0];
                        if (hashedPassword === generateHashedCredential(passwordInput + salt)) {
                            const token = email === "admin@admin.admin" ? generateToken({
                                id,
                                email,
                                admin: true
                            }, "3h") : generateToken({id, email});
                            resolve({email, forename, token});
                        } else {
                            resolve(null); //wrong pw
                        }
                    } else resolve(null); //user not found
                });
            }
            else {
                resolve(null);//invalid email
            }
        });
    }
};