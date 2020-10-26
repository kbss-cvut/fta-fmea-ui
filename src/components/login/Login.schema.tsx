import * as Yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup';

export const schema = yupResolver(
    Yup.object().shape({
        username: Yup.string()
            .trim()
            .required('Username is required'),
        password: Yup.string()
            .required('Password must not be blank'),
    })
);