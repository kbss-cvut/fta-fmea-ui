import * as React from "react";

import {Mitigation} from "@models/mitigationModel";
import {TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect} from "react";
import {schema} from "./MitigationCreation.schema";
import VocabularyUtils from "@utils/VocabularyUtils";

interface Props {
    mitigation: Mitigation | null,
    onMitigationChanged: (Mitigation) => void,
}

const MitigationCreation = ({mitigation, onMitigationChanged}: Props) => {
    const useFormMethods = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            description: mitigation?.description,
        }
    });

    const mitigationWatch = useFormMethods.watch('description')

    useEffect(() => {
        onMitigationChanged({
            "@type": [VocabularyUtils.MITIGATION],
            description: mitigationWatch,
        })
    }, [mitigationWatch])

    return (
        <div>
            <TextField autoFocus margin="dense" label="Describe Mitigation" name="description" type="text"
                       fullWidth inputRef={useFormMethods.register}
                       error={!!useFormMethods.errors.description}/>
        </div>
    );
}

export default MitigationCreation;