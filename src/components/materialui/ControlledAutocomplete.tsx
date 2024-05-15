import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, Grid, Link, Typography } from "@mui/material";
import { simplifyReferences } from "@utils/utils";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  options: any[];
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
}

const prepareOptions = (useSafeOptions, inputOptions, defaultOption) => {
  let options = inputOptions;
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
}: Props) => {
  // TODO - refactor use SafeAutocomplete instead of the implementation here
  const [_options, _defaultValue, getOptionValue] = prepareOptions(useSafeOptions, options, defaultValue);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleOnClick = (e) => {
    onCreateEventClick(e);
    setMenuOpen(false);
  };

  const renderNoOptions = () => {
    return (
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography>{t("noEvents")}</Typography>
        </Grid>
        <Grid item>
          <Link href="#" onClick={handleOnClick}>
            {t("createEvent")}
          </Link>
        </Grid>
      </Grid>
    );
  };

  return (
    <Controller
      render={({ field: { onChange, onBlur, value, ref }, ...props }) => (
        <Autocomplete
          fullWidth
          disablePortal
          options={_options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          clearOnBlur={clearOnBlur}
          onChange={(e, data) => {
            let _data = getOptionValue(data);
            onChangeCallback(_data);
            onChange(data);
          }}
          onBlur={onBlur}
          value={value}
          ref={ref}
          onInputChange={(e, inputValue) => {
            onInputChangeCallback(inputValue);
          }}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpen={() => setMenuOpen(true)}
          noOptionsText={renderNoOptions()}
        />
      )}
      defaultValue={_defaultValue}
      name={name}
      control={control}
    />
  );
};

export default ControlledAutocomplete;
