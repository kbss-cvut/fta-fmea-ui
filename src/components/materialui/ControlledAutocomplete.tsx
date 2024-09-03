import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, createFilterOptions, Grid, Link, Tooltip, Typography } from "@mui/material";
import { simplifyReferences } from "@utils/utils";
import { useTranslation } from "react-i18next";
import { AddCircle } from "@mui/icons-material";

interface Props {
  name: string;
  options: any[];
  newOption?: (string) => any;
  getOptionKey: (any) => string;
  getOptionLabel: (any) => string;
  renderInput;
  control;
  onChangeCallback?;
  onInputChangeCallback?;
  onCreateEventClick?;
  renderOption?: any;
  defaultValue?: any;
  useSafeOptions?: boolean;
  fullWidth?: boolean;
  clearOnBlur?: boolean;
  disabled?: boolean;
}

const prepareOptions = (useSafeOptions, inputOptions, defaultOption) => {
  let options = inputOptions ? inputOptions : [];
  let defaultValue = defaultOption;
  let getOptionValue = (option) => option;

  if (useSafeOptions) {
    // make options safe by simplifying their references
    const getKey = (o) => (o?.iri ? o.iri : o?.uri ? o.uri : null);
    const map: Map<string, any> = new Map();
    options.forEach((o) => map.set(getKey(o), o));
    defaultValue = defaultValue ? simplifyReferences(defaultValue) : null;
    options = options.map((o) => simplifyReferences(o));
    getOptionValue = (data) => {
      let key = getKey(data);
      return key ? map.get(key) : data;
    };
  }

  // TODO: The last map is hotfix to make it work with new mui
  return [options.map((o) => ({ ...o, label: o.name })), defaultValue, getOptionValue];
};

const ControlledAutocomplete = ({
  options = [],
  name,
  renderInput,
  newOption = null,
  getOptionKey,
  getOptionLabel,
  control,
  onChangeCallback,
  onInputChangeCallback,
  onCreateEventClick,
  renderOption,
  defaultValue,
  useSafeOptions = false,
  fullWidth = false,
  clearOnBlur = false,
  disabled = false,
}: Props) => {
  // TODO - refactor use SafeAutocomplete instead of the implementation here
  const [_options, _defaultValue, getOptionValue] = prepareOptions(useSafeOptions, options, defaultValue);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState(null);
  const { t } = useTranslation();

  const handleOnClick = (e) => {
    onCreateEventClick(e);
    setMenuOpen(false);
  };

  const renderNoOptions = () => {
    return (
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography>{t("newFtaModal.noEvents")}</Typography>
        </Grid>
        <Grid item>
          <Link href="#" onClick={handleOnClick}>
            {t("newFtaModal.createEvent")}
          </Link>
        </Grid>
      </Grid>
    );
  };

  const defaultFilter = createFilterOptions();
  const newOptionFilter = (options, state) => {
    const filtered = defaultFilter(options, state);
    const { inputValue } = state;
    const isExisting = filtered.some((option) => inputValue === getOptionLabel(option));
    if (inputValue !== "" && !isExisting) {
      const inputOption = newOption(inputValue);
      inputOption.newOption = true;
      filtered.splice(0, 0, inputOption);
    }
    return filtered;
  };

  const renderNewOption = (params, option) => {
    const { key, ...optionProps } = params;

    return (
      <li key={key} {...optionProps}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>{getOptionLabel(option)}</Grid>
          <Grid item>
            {option?.newOption && (
              <Tooltip title={t("newFtaModal.createEvent")}>
                <AddCircle style={{ color: "green" }} />
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </li>
    );
  };

  const getNewOptionLabel = (option) => {
    // Value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }

    // Regular option
    return getOptionLabel(option);
  };

  return (
    <Controller
      render={({ field: { onChange, onBlur, value, ref }, ...props }) => (
        <Autocomplete
          fullWidth
          options={_options}
          getOptionKey={getOptionKey}
          getOptionLabel={newOption ? getNewOptionLabel : getOptionLabel}
          renderOption={renderNewOption}
          renderInput={renderInput}
          clearOnBlur={clearOnBlur}
          freeSolo
          onChange={(e, data) => {
            let _data = getOptionValue(data);
            if (!data || data.newOption) setNewOptionValue(data);
            onChangeCallback(_data);
            onChange(data);
          }}
          filterOptions={newOption ? newOptionFilter : defaultFilter}
          onBlur={onBlur}
          value={newOptionValue ? newOptionValue : value}
          ref={ref}
          onInputChange={(e, inputValue) => {
            if (!inputValue) onChangeCallback(null);
            onInputChangeCallback(inputValue);
          }}
          isOptionEqualToValue={
            getOptionKey
              ? (option, value) => value && (value?.newOption || getOptionKey(option) === getOptionKey(value))
              : null
          }
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpen={() => setMenuOpen(true)}
          noOptionsText={renderNoOptions()}
          disabled={disabled}
        />
      )}
      defaultValue={_defaultValue}
      name={name}
      control={control}
    />
  );
};

export default ControlledAutocomplete;
