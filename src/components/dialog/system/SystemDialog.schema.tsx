import * as Yup from "yup";

export const schema = Yup.object().shape({
    systemName: Yup.string()
        .min(3, 'Must be at least 3 character long')
        .required('System name is mandatory'),
});