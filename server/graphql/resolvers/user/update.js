import validator from "validator";
import {validName, validPassword, validPasswords} from "../../../../common/validation";
import {
    generateHashedCredentialsWithSalt,
    getIdFromHeaderToken,
    requesterIsAdmin,
    requesterIsUser
} from "../../../helpers/helpers";
import UserModel from "../../../models/user";

export default {
    resolve(query, params, context) {
        return new Promise((resolve) => {
            if (requesterIsAdmin(context)) {
                let error;
                const id = params.input.id;
                let UserInput = params.input;
                const {forename, surname} = UserInput;
                if (!validName(validator.escape(forename.trim()))) error = true;
                if (!validName(validator.escape(surname.trim()))) error = true;
                if (!error) {
                    UserModel.findOne({"_id": id}, function (err, user) {
                        if (err) console.error(err);
                        user.forename = forename;
                        user.surname = surname;
                        user.save(function (err, updatedUser) {
                            if (err) console.error(err);
                            resolve(updatedUser);
                        });
                    });
                } else {
                    throw new Error("Error updating user");
                }

            } else if (requesterIsUser(context)) {
                let error;
                const id = getIdFromHeaderToken(context);
                let UserInput = params.input;
                const {forename, surname, passwordOne, passwordTwo} = UserInput;

                if (!validName(validator.escape(forename.trim()))) error = true;
                if (!validName(validator.escape(surname.trim()))) error = true;
                if (!validPasswords(passwordOne, passwordTwo)) error = true;
                if (!validPassword(passwordOne)) error = true;
                if (!error) {
                    UserModel.findOne({"_id": id}, function (err, user) {
                        if (err) console.error(err);
                        user.password = generateHashedCredentialsWithSalt(passwordOne);
                        user.forename = forename;
                        user.surname = surname;
                        user.save(function (err, updatedUser) {
                            if (err) console.error(err);
                            resolve(updatedUser);
                        });
                    });
                } else {
                    throw new Error("Error updating user");
                }
            }
            else {
                return "unauthorized";
            }
        });
    }
};