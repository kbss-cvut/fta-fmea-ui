import * as Yup from "yup";
import {yupOptionalNumber} from "@utils/validationUtils";
import {EventType, GateType} from "@models/eventModel";

export const schema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Must be at least 1 character long')
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
    eventType: Yup.string(),
    gateType: Yup.string()
        .when('eventType', {
            is: (eventType) => eventType === EventType.INTERMEDIATE,
            then: Yup.string().notOneOf([GateType.UNUSED]),
            otherwise: Yup.string().oneOf([GateType.UNUSED]),
        }),
    sequenceProbability: Yup.number()
        .transform(yupOptionalNumber)
        .notRequired()
        .min(0, 'Sequence probability cannot be lower than 0')
        .max(1, 'Sequence probability cannot be greater than 1'),
});