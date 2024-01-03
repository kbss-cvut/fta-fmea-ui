import * as React from "react";
import {useEffect, useState} from "react";
import MultipleSelectChips from "@components/materialui/select/MultipleSelectChips";
import {FaultEvent} from "@models/eventModel";
import {flatten} from "lodash";
import {Box, Paper, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import useStyles from "@components/dialog/faultTree/paths/FaultTreePathRow.styles";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@components/dialog/faultTree/paths/FaultTreePathRow.schema";
import {RiskPriorityNumber} from "@models/rpnModel";

interface Props {
    path: FaultEvent[],
    rowId: number,
    onRowChanged: (rowId: number, effects: FaultEvent[]) => void,
    onRpnChanged: (rowId: number, rpn: RiskPriorityNumber) => void,
}

const FaultTreePathRow = ({path, rowId, onRowChanged, onRpnChanged}: Props) => {
    const { classes } = useStyles();

    const [value, setValue] = useState(path)
    const [error, setError] = useState("")

    const options = flatten([path]).map(item => {
        return {label: item.name, value: item}
    }) as any[];
    const fixedValues = [options[0].value, options[options.length - 1].value];

    const handlePathChange = (value) => {
        setValue(value);
        onRowChanged(rowId, value);
    }

    const {control, formState: { errors }, handleSubmit, watch, register} = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });
    const severityWatch = watch("severity");
    const occurrenceWatch = watch("occurrence");
    const detectionWatch = watch("detection");

    const handleRpnChanged = (values: any) => {
        onRpnChanged(rowId, values);
    }

    useEffect(() => {
        handleSubmit(values => handleRpnChanged(values))()
    }, [severityWatch, occurrenceWatch, detectionWatch])

    return (
        <Paper className={classes.paper}>
            <Box className={classes.rpnBox}>
                {/*TODO: Adding ts-ignore and will update use-hook-form*/}
                <TextField label="Severity" type="number" name="severity"
                           inputProps={{inputProps: {min: 1, max: 10, step: 1}}}
                           error={!!errors.severity} className={classes.rpnBoxItem}
                           {...register("severity")}
                />

                <TextField label="Occurrence" type="number" name="occurrence"
                           inputProps={{min: 1, max: 10, step: 1}}
                           error={!!errors.occurrence} helperText={errors.occurrence?.message}
                           className={classes.rpnBoxItem}
                />

                <TextField label="Detection" type="number" name="detection"
                            inputProps={{min: 1, max: 10, step: 1}}
                           error={!!errors.detection} helperText={errors?.detection?.message}
                           className={classes.rpnBoxItem}
                />
            </Box>
            <MultipleSelectChips
                value={value}
                setValue={handlePathChange}
                options={options}
                fixedValues={fixedValues}
                error={error}
                setError={setError}
            />
        </Paper>
    )
}

export default FaultTreePathRow;
