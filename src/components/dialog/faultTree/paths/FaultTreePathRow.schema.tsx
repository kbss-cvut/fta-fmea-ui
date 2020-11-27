import * as Yup from "yup";
import {yupOptionalNumber} from "@utils/validationUtils";
import {EventType, GateType} from "@models/eventModel";

export const schema = Yup.object().shape({
    severity: Yup.number()
        .transform(yupOptionalNumber)
        .min(0, 'Severity cannot be lower than 0')
        .max(10, 'Severity cannot be greater than 10'),
    occurrence: Yup.number()
        .transform(yupOptionalNumber)
        .min(0, 'Occurrence cannot be lower than 0')
        .max(10, 'Occurrence cannot be greater than 10'),
    detection: Yup.number()
        .transform(yupOptionalNumber)
        .min(0, 'Detection cannot be lower than 0')
        .max(10, 'Detection cannot be greater than 10'),
});