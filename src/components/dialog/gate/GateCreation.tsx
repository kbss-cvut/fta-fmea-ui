import * as React from "react";

import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import useStyles from "@components/dialog/gate/GateDialog.styles";
import {Controller} from "react-hook-form";
import {GateType} from "@models/eventModel";

const GateCreation = ({useFormMethods}) => {
    const classes = useStyles()

    const {control} = useFormMethods

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="gate-type-select-label">Type</InputLabel>
            <Controller
                as={
                    <Select labelId="gate-type-select-label"
                            id="gate-type-select">
                        {
                            Object.values(GateType).map(value =>
                                <MenuItem key={`option-${value}`} value={value}>{value}</MenuItem>)
                        }
                    </Select>
                }
                name="gateType"
                control={control}
                defaultValue={GateType.OR}
            />
        </FormControl>
    );
}

export default GateCreation;