import * as React from "react";

import {FailureMode} from "../../../../models/failureModeModel";
import {Chip, FormControl, Input, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "../FailureMode.schema";
import {useEffect, useState} from "react";
import useStyles from "./FailureModeCreationStep.styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


interface Props {
    failureMode: FailureMode,
    onFailureModeChanged: (FailureMode) => void,
    eventNamesPath: string[],
    onEventPathChanged: (eventName: string[]) => void,
}

const FailureModeCreationStep = ({failureMode, onFailureModeChanged, eventNamesPath, onEventPathChanged}: Props) => {
    const classes = useStyles();

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

    const [selectedEffects, setSelectedEffects] = useState(eventNamesPath);
    const handleChange = (event) => {
        setSelectedEffects(event.target.value);
        onEventPathChanged(event.target.value);
    };

    return (
        <div>
            <TextField autoFocus margin="dense" label="Failure Mode Name" name="name" type="text"
                       fullWidth inputRef={useFormMethods.register}
                       error={!!useFormMethods.errors.name}/>

            <FormControl fullWidth>
                <InputLabel id="effects-path-label">Effects Path</InputLabel>
                <Select
                    labelId="effects-path-label" id="effects-path-select" multiple fullWidth
                    value={selectedEffects} onChange={handleChange}
                    input={<Input id="select-multiple-chip"/>}
                    renderValue={(selected: string[]) => (
                        <div className={classes.chips}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} className={classes.chip}/>
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {eventNamesPath.map((value, index) => {
                        // first & last events must be used
                        const disabled = (index === 0 || index === eventNamesPath.length - 1)
                        return (
                            <MenuItem key={value} value={value} disabled={disabled}>
                                {value}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
}

export default FailureModeCreationStep;