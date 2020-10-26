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

axios.interceptors.request.use((request) => {
    request.cancelToken = axiosSource.token
    return request;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;