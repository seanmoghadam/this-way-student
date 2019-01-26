import regex from "./regex";

export function validEmail(email) {
    return regex.email.test(String(email).toLowerCase());
}
export function validPassword(password) {
    return regex.password.test(String(password));
}
export function escapeRegExp(text) {
    return text.replace(/[^a-zA-Z0-9_.*+:@&=,!~'";]/g, "_");
}
export function validName(name) {
    return regex.name.test(String(name));
}
export function validPasswords(p1, p2) {
    return p1 === p2;
}
export function replacePasswordOne (o, old_key, new_key) {
    if (old_key !== new_key) {
        Object.defineProperty(o, new_key,
            Object.getOwnPropertyDescriptor(o, old_key));
        delete o[old_key];
    }
}
