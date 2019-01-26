import attractionMutation from "./attraction";
import routeMutation from "./route";
import userMutation from "./user";

export default {
    ...userMutation,
    ...routeMutation,
    ...attractionMutation,
};
