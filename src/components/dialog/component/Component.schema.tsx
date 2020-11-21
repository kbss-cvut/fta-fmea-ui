import * as Yup from "yup";

export const schema =
    Yup.object().shape({
        name: Yup.string()
            .min(3, 'Must be at least 3 character long')
            .required('Name is mandatory'),
    });