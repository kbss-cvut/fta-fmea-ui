import * as Yup from "yup";

export const schema = Yup.object().shape({
    description: Yup.string()
        .min(3, 'Must be at least 3 character long')
        .required('Description is mandatory'),
});