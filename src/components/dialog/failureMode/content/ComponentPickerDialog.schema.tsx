import * as Yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup';

export const schema = yupResolver(
    Yup.object().shape({
        name: Yup.string()
            .min(3, 'Must be at least 3 character long')
            .required('Name is mandatory'),
    })
);