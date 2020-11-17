import * as React from "react";

import {Box, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography,} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {Controller} from "react-hook-form";
import {EventType, FaultEvent, GateType, gateTypeValues} from "@models/eventModel";
import {useFaultEvents} from "@hooks/useFaultEvents";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import {useEffect, useState} from "react";
import DividerWithText from "@components/materialui/DividerWithText";

interface Props {
    useFormMethods: any,
    eventReusing: boolean
}

const FaultEventCreation = ({useFormMethods, eventReusing}: Props) => {
    const classes = useStyles()

    const {errors, control, setValue, reset, watch} = useFormMethods

    const faultEvents = useFaultEvents()
    const [selectedEvent, setSelectedEvent] = useState<FaultEvent | null>(null)
    const existingEventSelected = Boolean(selectedEvent)

    const eventTypeWatch = watch('eventType')

    useEffect(() => {
        if (selectedEvent) {
            setValue('name', selectedEvent.name)
            setValue('description', selectedEvent.description)
            setValue('probability', selectedEvent.probability)
            setValue('occurrence', selectedEvent.rpn?.occurrence)
            setValue('severity', selectedEvent.rpn?.severity)
            setValue('detection', selectedEvent.rpn?.detection)
            setValue('eventType', selectedEvent.eventType)
            setValue('gateType', selectedEvent.gateType)
        } else {
            reset()
        }
    }, [selectedEvent])

    return (
        <div className={classes.divForm}>
            <Typography variant={"subtitle1"} gutterBottom>Event:</Typography>
            {eventReusing &&
            <React.Fragment>
                <ControlledAutocomplete
                    control={control}
                    name="existingEvent"
                    options={faultEvents}
                    onChangeCallback={(data: any) => setSelectedEvent(data)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Event" variant="outlined"/>}
                    defaultValue={null}
                />
                <DividerWithText>New Event</DividerWithText>
            </React.Fragment>}

            <FormControl className={classes.formControl}>
                <InputLabel id="event-type-select-label">Type</InputLabel>
                <Controller
                    as={
                        <Select labelId="event-type-select-label" id="event-type-select">
                            {
                                Object.values(EventType).map(value =>
                                    <MenuItem key={`option-${value}`} value={value}>{value}</MenuItem>)
                            }
                        </Select>
                    }
                    name="eventType"
                    control={control}
                    defaultValue={EventType.INTERMEDIATE}
                    disabled={existingEventSelected}
                />
            </FormControl>

            <Controller as={TextField} control={control} margin="dense"
                        label="Event Name" name="name" type="text" fullWidth
                        error={!!errors.name} helperText={errors.name?.message}
                        defaultValue="" disabled={existingEventSelected}
            />
            <Controller as={TextField} control={control} margin="dense"
                        label="Description" type="text" name="description" fullWidth
                        error={!!errors.description} helperText={errors.description?.message}
                        defaultValue="" disabled={existingEventSelected}/>

            <Controller as={TextField} control={control} label="Probability" type="number" name="probability"
                        InputProps={{inputProps: {min: 0, max: 1, step: 0.01}}}
                        error={!!errors.probability} helperText={errors.probability?.message}
                        className={classes.probability}
                        disabled={existingEventSelected} defaultValue=""
            />

            <Box className={classes.rpnBox}>
                <Controller as={TextField} control={control} label="Occurrence" type="number" name="occurrence"
                            InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                            error={!!errors.occurrence} helperText={errors.occurrence?.message}
                            className={classes.rpnBoxItem}
                            disabled={existingEventSelected} defaultValue=""
                />
                <Controller as={TextField} control={control} label="Severity" type="number" name="severity"
                            InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                            error={!!errors.severity} helperText={errors?.severity?.message}
                            className={classes.rpnBoxItem}
                            disabled={existingEventSelected} defaultValue=""
                />
                <Controller as={TextField} control={control} label="Detection" type="number" name="detection"
                            InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                            error={!!errors.detection} helperText={errors?.detection?.message}
                            className={classes.rpnBoxItem}
                            disabled={existingEventSelected} defaultValue=""
                />
            </Box>

            {(eventTypeWatch === EventType.INTERMEDIATE || !eventTypeWatch) &&
            <FormControl className={classes.formControl}>
                <InputLabel id="gate-type-select-label">Gate Type</InputLabel>
                <Controller
                    as={
                        <Select labelId="gate-type-select-label" id="gate-type-select">
                            {
                                gateTypeValues().map(value =>
                                    <MenuItem key={`option-${value}`} value={value}>{value}</MenuItem>)
                            }
                        </Select>
                    }
                    name="gateType"
                    control={control}
                    defaultValue={GateType.OR}
                    disabled={existingEventSelected}/>
            </FormControl>}
        </div>
    );
}

export default FaultEventCreation;