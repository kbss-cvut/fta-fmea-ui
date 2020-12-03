import * as Yup from "yup";
import {yupOptionalNumber} from "@utils/validationUtils";

export const schema = Yup.object().shape({
    severity: Yup.number()
        .transform(yupOptionalNumber)
        .min(1, 'Severity cannot be lower than 1')
        .max(10, 'Severity cannot be greater than 10'),
    occurrence: Yup.number()
        .transform(yupOptionalNumber)
        .min(1, 'Occurrence cannot be lower than 1')
        .max(10, 'Occurrence cannot be greater than 10'),
    detection: Yup.number()
        .transform(yupOptionalNumber)
        .min(1, 'Detection cannot be lower than 1')
        .max(10, 'Detection cannot be greater than 10'),
});