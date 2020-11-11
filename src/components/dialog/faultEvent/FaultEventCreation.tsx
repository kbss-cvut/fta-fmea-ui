import * as React from "react";

import {Box, FormControl, InputLabel, MenuItem, Select, TextField,} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {Controller} from "react-hook-form";
import {EventType} from "@models/eventModel";

interface Props {
    useFormMethods: any,
    topEventOnly: boolean,
}

const FaultEventCreation = ({useFormMethods, topEventOnly}: Props) => {
    const classes = useStyles()

    const {errors, register, control} = useFormMethods

    return (
        <div className={classes.divForm}>
            {!topEventOnly && <FormControl className={classes.formControl}>
                <InputLabel id="event-type-select-label">Type</InputLabel>
                <Controller
                    as={
                        <Select labelId="event-type-select-label"
                                id="event-type-select">
                            {
                                Object.values(EventType).map(value =>
                                    <MenuItem key={`option-${value}`} value={value}>{value}</MenuItem>)
                            }
                        </Select>
                    }
                    name="eventType"
                    control={control}
                    defaultValue={EventType.BASIC}
                />
            </FormControl>}
            <TextField margin="dense" label="Event Name" name="name" type="text"
                       fullWidth inputRef={register} error={!!errors.name}
                       helperText={errors.name?.message}/>
            <TextField margin="dense" label="Description" type="text" name="description"
                       fullWidth inputRef={register} error={!!errors.description}
                       helperText={errors.description?.message}/>
            <Box className={classes.rpnBox}>
                <TextField label="Probability" type="number" name="probability"
                           InputProps={{inputProps: {min: 0, max: 1, step: 0.01}}}
                           inputRef={register} error={!!errors.probability}
                           helperText={errors.probability?.message}/>
                <TextField label="Severity" type="number" name="severity"
                           InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                           inputRef={register} error={!!errors.severity}
                           helperText={errors?.severity?.message}/>
                <TextField label="Detection" type="number" name="detection"
                           InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                           inputRef={register} error={!!errors.detection}
                           helperText={errors?.detection?.message}/>
            </Box>
        </div>
    );
}

export default FaultEventCreation;