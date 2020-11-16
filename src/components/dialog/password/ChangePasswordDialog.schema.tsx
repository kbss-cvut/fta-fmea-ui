import * as Yup from "yup";

export const schema = Yup.object().shape({
    password: Yup.string()
        .required('Password must not be blank'),
    newPassword: Yup.string()
        .required('New password must not be blank'),
});