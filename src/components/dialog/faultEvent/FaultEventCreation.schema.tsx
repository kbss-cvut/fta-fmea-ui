import * as Yup from "yup";
import {yupOptionalNumber} from "@utils/validationUtils";

export const schema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Must be at least 3 character long')
        .required('Event is mandatory'),
    description: Yup.string().default(''),
    probability: Yup.number()
        .min(0, 'Probability cannot be lower than 0')
        .max(1, 'Probability cannot be greater than 1')
        .required('Probability is mandatory'),
    severity: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Severity cannot be lower than 0')
        .max(10, 'Severity cannot be greater than 10'),
    detection: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Detection cannot be lower than 0')
        .max(10, 'Detection cannot be greater than 10')
});