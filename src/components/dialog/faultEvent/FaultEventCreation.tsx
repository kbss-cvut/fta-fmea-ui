import * as React from "react";

import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import { Controller } from "react-hook-form";
import { EventType, FaultEvent, GateType, gateTypeValues } from "@models/eventModel";
import { useReusableFaultEvents } from "@hooks/useReusableFaultEvents";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  useFormMethods: any;
  eventReusing: boolean;
}

// TODO: remove ts-ignores and migrate to higher version of react-hook-form
const FaultEventCreation = ({ useFormMethods, eventReusing }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const {
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
    register,
  } = useFormMethods;

  const faultEvents = useReusableFaultEvents();
  const [selectedEvent, setSelectedEvent] = useState<FaultEvent | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const existingEventSelected = Boolean(selectedEvent);
  const lastGateTypeRef = useRef(selectedEvent?.gateType);
  const eventTypeWatch = watch("eventType");
  const gateTypeWatch = watch("gateType");

  useEffect(() => {
    if (selectedEvent) {
      setValue("name", selectedEvent.name);
      setValue("description", selectedEvent.description);
      setValue("probability", selectedEvent.probability);
      setValue("eventType", selectedEvent.eventType);
      setValue("gateType", selectedEvent.gateType);
      setValue("sequenceProbability", selectedEvent.sequenceProbability);
    } else {
      reset();
    }
  }, [selectedEvent]);

  const [filteredOptions, setFilteredOptions] = useState([{}]);

  const handleFilterOptions = (inputValue) => {
    const filtered = faultEvents.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleOnCreateEventClick = (e: MouseEvent) => {
    setShowCreateEvent(true);
  };

  function renderEventSelect() {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom>
          {`${t("newFtaModal.eventPlaceholder")}:`}
        </Typography>

        {eventReusing && (
          <ControlledAutocomplete
            control={control}
            name="existingEvent"
            options={faultEvents}
            onChangeCallback={(data: any) => setSelectedEvent(data)}
            onInputChangeCallback={handleFilterOptions}
            onCreateEventClick={handleOnCreateEventClick}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={t("newFtaModal.eventPlaceholder")} variant="outlined" />
            )}
            defaultValue={null}
          />
        )}
      </>
    );
  }

  function renderCreateEventForm() {
    if (!showCreateEvent) {
      return;
    }
    return (
      <>
        {!selectedEvent && filteredOptions.length === 0 && (
          <>
            <FormControl disabled={existingEventSelected} className={classes.formControl}>
              <InputLabel id="event-type-select-label">{t("newFtaModal.type")}</InputLabel>
              <Controller
                render={({ field }) => {
                  const _onChange = field.onChange;
                  field.onChange = (e) => {
                    if (e.target.value !== EventType.INTERMEDIATE && e.target.value !== EventType.CONDITIONING) {
                      lastGateTypeRef.current = gateTypeWatch;
                      setValue("gateType", null);
                    } else setValue("gateType", lastGateTypeRef.current ? lastGateTypeRef.current : GateType.OR);
                    _onChange(e);
                  };
                  return (
                    <Select
                      {...field}
                      disabled={existingEventSelected}
                      labelId="event-type-select-label"
                      label={t("newFtaModal.type")}
                    >
                      {Object.values(EventType).map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                }}
                name="eventType"
                control={control}
                defaultValue={EventType.INTERMEDIATE}
              />
            </FormControl>

            {/*TODO: sort out default value UI bug*/}
            <TextField
              margin="dense"
              autoComplete="off"
              id="name"
              label={t("newFtaModal.name")}
              fullWidth
              disabled={existingEventSelected}
              {...register("name")}
            />

            {/*TODO: sort out default value UI bug*/}
            <TextField
              margin="dense"
              label={t("newFtaModal.description")}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              defaultValue=""
              disabled={existingEventSelected}
              {...register("description")}
            />

            {/* Probability field */}
            {eventTypeWatch !== EventType.INTERMEDIATE && (
              <TextField
                label={t("newFtaModal.probability")}
                type="number"
                min={0}
                max={1}
                step={0.01}
                error={!!errors.probability}
                helperText={errors.probability?.message}
                className={classes.probability}
                defaultValue=""
                {...register("probability")}
              />
            )}

            {(gateTypeWatch === GateType.PRIORITY_AND || !gateTypeWatch) &&
              eventTypeWatch === EventType.INTERMEDIATE &&
              gateTypeWatch === GateType.PRIORITY_AND && (
                <TextField
                  label="Sequence Probability"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  error={!!errors.sequenceProbability}
                  helperText={errors.sequenceProbability?.message}
                  className={classes.sequenceProbability}
                  defaultValue=""
                  {...register("sequenceProbability")}
                />
              )}

            {(eventTypeWatch === EventType.INTERMEDIATE || !eventTypeWatch) && (
              <div className={classes.formControlDiv}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="gate-type-select-label">{t("newFtaModal.gateType")}</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={existingEventSelected}
                        labelId="gate-type-select-label"
                        label={t("newFtaModal.gateType")}
                        error={!!errors.gateType}
                      >
                        {gateTypeValues()
                          .filter((value) => value[0])
                          .map((value) => {
                            const [enabled, optionValue] = value;
                            return (
                              <MenuItem key={optionValue} value={optionValue} disabled={!enabled}>
                                {optionValue}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                    name="gateType"
                    control={control}
                    defaultValue={GateType.OR}
                  />
                </FormControl>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <div className={classes.divForm}>
      {renderEventSelect()}
      {renderCreateEventForm()}
    </div>
  );
};

export default FaultEventCreation;
