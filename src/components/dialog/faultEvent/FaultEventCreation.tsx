import * as React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import { Controller } from "react-hook-form";
import { EventType, FaultEvent, GateType, gateTypeValues } from "@models/eventModel";
import { useReusableFaultEvents } from "@hooks/useReusableFaultEvents";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { asArray, updateEventsType } from "@utils/utils";

interface Props {
  useFormMethods: any;
  isRootEvent: boolean;
  eventValue?: FaultEvent;
  isEditedEvent?: boolean;
  disabled?: boolean;
  isEditMode?: boolean;
}

const FaultEventCreation = ({
  useFormMethods,
  isRootEvent,
  eventValue,
  isEditedEvent = false,
  disabled,
  isEditMode,
}: Props) => {
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

  const faultEvents = disabled ? [] : useReusableFaultEvents();
  const [newEvent, setNewEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<FaultEvent | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [isCreatedEvent, setIsCreatedEvent] = useState<boolean>(false);
  const existingEventSelected = Boolean(selectedEvent);
  const lastGateTypeRef = useRef(selectedEvent?.gateType);
  const eventTypeWatch = watch("eventType");
  const gateTypeWatch = watch("gateType");

  useEffect(() => {
    reset();
    if (selectedEvent) {
      setValue("name", selectedEvent.name);
      setValue(
        "existingEvent",
        selectedEvent?.supertypes ? selectedEvent?.supertypes[0] : selectedEvent.iri ? selectedEvent : null,
      );
      if (existingEventSelected) {
        setValue("eventType", selectedEvent.eventType);
      }
      if (isRootEvent || isCreatedEvent) {
        setValue("eventType", EventType.INTERMEDIATE);
        setValue("gateType", GateType.OR);
      }
    }
  }, [isRootEvent, selectedEvent, setValue, existingEventSelected, isCreatedEvent, reset]);

  const [filteredOptions, setFilteredOptions] = useState([{}]);
  const updatedFHAEventTypes = updateEventsType(faultEvents, "fha-fault-event", EventType.EXTERNAL);

  const handleFilterOptions = (inputValue: string) => {
    const filtered = faultEvents.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));
    setNewEvent(inputValue);
    setFilteredOptions(filtered);
  };

  const handleOnCreateEventClick = (e: MouseEvent) => {
    setSelectedEvent({ name: newEvent } as FaultEvent);
    setShowCreateEvent(true);
    setIsCreatedEvent(true);
    setValue("eventType", EventType.INTERMEDIATE);
    setValue("gateType", GateType.OR);
  };

  const handleEventSelect = (data: any) => {
    setSelectedEvent(data);
    if (!data) {
      reset();
      return;
    }
    setIsCreatedEvent(!data.iri);
  };

  function renderEventSelect() {
    const eventVal = asArray(eventValue?.supertypes)?.[0] || eventValue;
    const _eventVal = eventVal ? { name: eventVal.name, iri: eventVal.iri } : null;
    if (_eventVal && !faultEvents.some((evt) => evt.iri === _eventVal.iri)) {
      faultEvents.push(_eventVal);
      updatedFHAEventTypes.push(_eventVal);
    }
    return (
      <>
        <ControlledAutocomplete
          control={control}
          name="existingEvent"
          options={isRootEvent ? faultEvents : updatedFHAEventTypes}
          clearOnBlur={true}
          newOption={(name) => {
            return {
              iri: null,
              name: name,
            };
          }}
          defaultValue={_eventVal ? _eventVal : selectedEvent}
          onChangeCallback={handleEventSelect}
          onInputChangeCallback={handleFilterOptions}
          onCreateEventClick={handleOnCreateEventClick}
          getOptionKey={(option) => option.iri}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label={t("newFtaModal.eventPlaceholder")} variant="outlined" {...register("name")} />
          )}
          disabled={disabled}
        />

        {selectedEvent && (
          <FormControl className={classes.formControl}>
            <br />
            <InputLabel id="event-type-select-label">{t("newFtaModal.type")}</InputLabel>
            <Controller
              render={({ field }) => {
                const _onChange = field.onChange;
                field.onChange = (e) => {
                  if (e.target.value !== EventType.INTERMEDIATE && e.target.value !== EventType.CONDITIONING) {
                    lastGateTypeRef.current = gateTypeWatch;
                    setValue("gateType", null);
                  } else {
                    setValue("gateType", lastGateTypeRef.current ? lastGateTypeRef.current : GateType.OR);
                  }
                  _onChange(e);
                };
                return (
                  <Select
                    {...field}
                    disabled={isRootEvent || (!isCreatedEvent && (existingEventSelected || disabled))}
                    labelId="event-type-select-label"
                    label={t("newFtaModal.type")}
                  >
                    {Object.values(EventType).map((value, index) => (
                      <MenuItem key={index} value={value}>
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
        )}
      </>
    );
  }

  function renderEventForm() {
    return (
      <>
        {eventTypeWatch === EventType.INTERMEDIATE && (
          <div className={classes.formControlDiv}>
            <br />
            <FormControl className={classes.formControl}>
              <InputLabel id="gate-type-select-label">{t("newFtaModal.gateType")}</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="gate-type-select-label"
                    label={t("newFtaModal.gateType")}
                    error={!!errors.gateType}
                    disabled={isEditMode && !(eventValue?.eventType === EventType.INTERMEDIATE)}
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

        {selectedEvent &&
          eventTypeWatch !== EventType.INTERMEDIATE &&
          eventTypeWatch !== EventType.EXTERNAL &&
          !isRootEvent &&
          isEditedEvent && (
            <>
              <br />
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

              {!isEditMode && eventTypeWatch === EventType.BASIC && (
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
            </>
          )}
      </>
    );
  }

  return (
    <div className={classes.divForm}>
      {renderEventSelect()}
      {renderEventForm()}
    </div>
  );
};

export default FaultEventCreation;
