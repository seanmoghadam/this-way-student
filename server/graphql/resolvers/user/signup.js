import validator from "validator";
import {validName, validPassword, validPasswords} from "../../../../common/validation";
import {generateHashedCredentialsWithSalt, randomString} from "../../../helpers/helpers";
import Mailer from "../../../helpers/Nodemailer";
import UserModel from "../../../models/user";

export default {
    resolve(query, params) {
        let error;
        let UserInput = params.input;
        const {email, forename, surname, passwordOne, passwordTwo} = UserInput;

        if (!validator.isEmail(email.trim())) error = true;
        if (!validName(validator.escape(forename.trim()))) error = true;
        if (!validName(validator.escape(surname.trim()))) error = true;
        if (!validPasswords(passwordOne, passwordTwo)) error = true;
        if (!validPassword(passwordOne)) error = true;
        if (!error) {
            UserInput.password = generateHashedCredentialsWithSalt(passwordOne);
            const token = randomString(20);
            Mailer.sendMailVerificationMail(email, forename, surname, token);
            UserInput.token = token;
            const uModel = new UserModel(UserInput);
            return uModel.save();
        } else {
            throw new Error("Error adding user");
        }
    }
};