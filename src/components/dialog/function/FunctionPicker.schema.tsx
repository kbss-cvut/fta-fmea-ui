import * as Yup from "yup";

export const schema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Must be at least 1 character long')
        .required('Name is mandatory'),
});