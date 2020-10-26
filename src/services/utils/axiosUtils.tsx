import axios from 'axios'
import {appHistory} from "@components/routes/AppRoutes";

const axiosClient = axios.create({
    baseURL: process.env.BASE_API_URL
});

axiosClient.interceptors.response.use(
    res => res,
    err => {
        if (err.response.status === 401) {
            console.log(`Axios response returned 401. Logging out...`)
            appHistory.push('/logout');
            return;
        }
        throw err;
    }
);

export const axiosSource = axios.CancelToken.source();

const cancellingInterceptor = config => {
    config.cancelToken = axiosSource.token;
    return config;
};

axiosClient.interceptors.request.use(cancellingInterceptor)

export default axiosClient;