import * as Yup from "yup";

export const schema =
    Yup.object().shape({
        username: Yup.string()
            .min(3, 'Must be at least 3 character long')
            .required('Required'),
        password: Yup.string()
            .min(3, 'Must be at least 3 character long')
            .required('Required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required')
    });