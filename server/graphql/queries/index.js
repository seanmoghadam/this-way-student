import attraction from "./attraction";
import route from "./route";
import user from "./user";

export default {
    ...user,
    ...route,
    ...attraction
};
