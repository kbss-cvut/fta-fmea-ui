import * as Yup from "yup";
import {yupOptionalNumber} from "@utils/validationUtils";
import {EventType, GateType} from "@models/eventModel";

export const schema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Must be at least 3 character long')
        .required('Event is mandatory'),
    description: Yup.string().default(''),
    probability: Yup.number()
        .when('eventType', {
            is: (eventType) => eventType === EventType.INTERMEDIATE,
            then: Yup.number()
                .transform(yupOptionalNumber)
                .notRequired()
                .min(0, 'Probability cannot be lower than 0')
                .max(10, 'Probability cannot be greater than 10'),
            otherwise: Yup.number()
                .min(0, 'Probability cannot be lower than 0')
                .max(1, 'Probability cannot be greater than 1')
                .required('Probability is mandatory'),
        }),
    severity: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Severity cannot be lower than 0')
        .max(10, 'Severity cannot be greater than 10'),
    occurrence: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Occurrence cannot be lower than 0')
        .max(10, 'Occurrence cannot be greater than 10'),
    detection: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Detection cannot be lower than 0')
        .max(10, 'Detection cannot be greater than 10'),
    eventType: Yup.string(),
    gateType: Yup.string()
        .when('eventType', {
            is: (eventType) => eventType === EventType.INTERMEDIATE,
            then: Yup.string().notOneOf([GateType.UNUSED]),
            otherwise: Yup.string().oneOf([GateType.UNUSED]),
        })
});