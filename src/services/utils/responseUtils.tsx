import { has } from "lodash";
import i18n from "i18next";

function getResponseMessage(data: any): string {
  if (has(data, "messageId")) {
    return i18n.t(data.messageId, { ...data.messageArguments });
  }

  return has(data, "message") ? data.message : "";
}

export const handleServerError = (error: any, messageId: string): string => {
  if (!has(error, "response") && !has(error.response, "data")) {
    return i18n.exists(messageId) ? i18n.t(messageId, { error: "" }) : i18n.t("error.default");
  }

  const response = error.response;
  const responseStatus = response.status;
  const responseMessage = getResponseMessage(response.data);
  switch (responseStatus) {
    case 400:
      return i18n.exists(messageId) ? i18n.t(messageId, { error: responseMessage }) : responseMessage;
    default:
      console.log(`Response status - ${responseStatus}`);
      return i18n.t("error.default");
  }
};
