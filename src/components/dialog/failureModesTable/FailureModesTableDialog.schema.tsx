import * as Yup from "yup";

export const schema = Yup.object().shape({
    fmeaName: Yup.string()
        .min(3, 'Must be at least 3 character long')
        .required('FMEA name is mandatory'),
});