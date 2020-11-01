import * as React from "react";

import {Box, TextField,} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";

const FaultEventCreation = ({useFormMethods}) => {
    const classes = useStyles()

    const {register, errors} = useFormMethods

    return (
        <div className={classes.divForm}>
            <TextField autoFocus margin="dense" label="Name" name="name" type="text"
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
                           helperText={errors.probability?.severity}/>
                <TextField label="Detection" type="number" name="detection"
                           InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                           inputRef={register} error={!!errors.detection}
                           helperText={errors.probability?.detection}/>
            </Box>
        </div>
    );
}

export default FaultEventCreation;