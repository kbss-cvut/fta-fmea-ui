import * as React from "react";

import {FormControl, InputLabel, MenuItem, Select, TextField, Typography,} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {Controller} from "react-hook-form";
import {EventType, FaultEvent, GateType, gateTypeValues} from "@models/eventModel";
import {useReusableFaultEvents} from "@hooks/useReusableFaultEvents";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import {useEffect, useState} from "react";

interface Props {
    useFormMethods: any,
    eventReusing: boolean
}

const FaultEventCreation = ({useFormMethods, eventReusing}: Props) => {
    const classes = useStyles()

    const {errors, control, setValue, reset, watch} = useFormMethods

    const faultEvents = useReusableFaultEvents()
    const [selectedEvent, setSelectedEvent] = useState<FaultEvent | null>(null)
    const existingEventSelected = Boolean(selectedEvent)

    const eventTypeWatch = watch('eventType')
    const gateTypeWatch = watch('gateType')

    useEffect(() => {
        if (selectedEvent) {
            setValue('name', selectedEvent.name)
            setValue('description', selectedEvent.description)
            setValue('probability', selectedEvent.probability)
            setValue('eventType', selectedEvent.eventType)
            setValue('gateType', selectedEvent.gateType)
            setValue('sequenceProbability', selectedEvent.sequenceProbability)
        } else {
            reset()
        }
    }, [selectedEvent])

    return (
        <div className={classes.divForm}>
            <Typography variant="subtitle1" gutterBottom>Event:</Typography>
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
                <Typography variant="subtitle1" className={classes.newEventTitle}>Create new Event:</Typography>
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
                        disabled={existingEventSelected || eventTypeWatch === EventType.INTERMEDIATE}
                        defaultValue=""
            />

            {(gateTypeWatch === GateType.PRIORITY_AND || !gateTypeWatch) &&
            <Controller as={TextField} control={control} label="Sequence Probability"
                        type="number" name="sequenceProbability"
                        InputProps={{inputProps: {min: 0, max: 1, step: 0.01}}}
                        error={!!errors.sequenceProbability} helperText={errors.sequenceProbability?.message}
                        className={classes.sequenceProbability}
                        defaultValue=""
            />}

            {(eventTypeWatch === EventType.INTERMEDIATE || !eventTypeWatch) &&
            <div className={classes.formControlDiv}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="gate-type-select-label">Gate Type</InputLabel>
                    <Controller
                        as={
                            <Select labelId="gate-type-select-label" id="gate-type-select" error={!!errors.gateType}>
                                {
                                    gateTypeValues().map(value => {
                                        const [enabled, optionValue] = value
                                        return <MenuItem key={`option-${value}`} value={optionValue}
                                                         disabled={!enabled}>{value}</MenuItem>
                                    })
                                }
                            </Select>
                        }
                        name="gateType"
                        control={control}
                        defaultValue={GateType.OR}
                        disabled={existingEventSelected}/>
                </FormControl>
            </div>}
        </div>
    );
}

export default FaultEventCreation;