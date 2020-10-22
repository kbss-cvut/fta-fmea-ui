import {getLoggedUser} from "@hooks/useLoggedUser";

export const authHeaders = () => {
    return {
        Authorization: `Bearer ${getLoggedUser().token}`
    }
}