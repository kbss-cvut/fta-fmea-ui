import axios from "axios";
import { appHistory } from "@components/routes/AppRoutes";
import { ENVVariable, HttpHeaders, ROUTES } from "@utils/constants";
import { isUsingOidcAuth } from "@utils/OidcUtils";
import { getOidcToken } from "@utils/SecurityUtils";

const axiosClient = axios.create({
  baseURL: ENVVariable.API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      console.log(`Axios response returned 401. Logging out...`);
      appHistory.push(ROUTES.LOGOUT);
      return;
    }
    throw err;
  },
);

export const axiosSource = axios.CancelToken.source();

axiosClient.interceptors.request.use((reqConfig) => {
  if (!isUsingOidcAuth()) {
    return reqConfig;
  }
  if (!reqConfig.headers) {
    // @ts-ignore
    reqConfig.headers = {};
  }
  reqConfig.headers[HttpHeaders.AUTHORIZATION] = `Bearer ${getOidcToken().access_token}`;
  return reqConfig;
});

export default axiosClient;
