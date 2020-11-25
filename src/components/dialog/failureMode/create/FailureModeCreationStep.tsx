import * as React from "react";

import {FailureMode} from "@models/failureModeModel";
import {TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "../FailureMode.schema";
import {useEffect} from "react";

interface Props {
    failureMode: FailureMode,
    onFailureModeChanged: (FailureMode) => void,
}

const FailureModeCreationStep = ({failureMode, onFailureModeChanged}: Props) => {
    const useFormMethods = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            name: failureMode?.name,
        }
    });

    const nameWatch = useFormMethods.watch('name')

    useEffect(() => {
        onFailureModeChanged({
            name: nameWatch,
        })
    }, [nameWatch])

    return (
        <div>
            <TextField autoFocus margin="dense" label="Failure Mode Name" name="name" type="text"
                       fullWidth inputRef={useFormMethods.register}
                       error={!!useFormMethods.errors.name}/>
        </div>
    );
}

export default FailureModeCreationStep;