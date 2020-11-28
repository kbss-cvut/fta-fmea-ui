import {has} from "lodash";

export const handleServerError = (e, defaultMessage): string => {
    if(has(e, "response")) {
        const response = e.response;
        const responseStatus = response.status;

        switch (responseStatus) {
            case 400:
                if(has(response, "data") && has(response?.data, "message")) {
                    return response.data.message;
                }
                break;
            default:
                console.log(`Response status - ${responseStatus}`);
                return defaultMessage;
        }
    } else {
        return defaultMessage;
    }
}