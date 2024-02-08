import * as React from "react";
import {Controller} from "react-hook-form";
import {Autocomplete} from "@mui/material";
import {simplifyReferences} from "@utils/utils";

interface Props {
    name: string
    options: any[],
    getOptionLabel: (any) => string,
    renderInput,
    control,
    onChangeCallback?,
    renderOption?: any,
    defaultValue?: any,
    useSafeOptions?: boolean,
    fullWidth?: boolean,
    clearOnBlur?: boolean
}

const prepareOptions = (useSafeOptions, inputOptions, defaultOption) => {
    let options = inputOptions;
    let defaultValue = defaultOption;
    let getOptionValue = (option) => option;

    if (useSafeOptions) {
        // make options safe by simplifying their references
        const getKey = (o) => o?.iri ? o.iri : (o?.uri ? o.uri : null)
        const map: Map<string, any> = new Map()
        options.forEach(o => map.set(getKey(o), o))
        defaultValue = defaultValue ? simplifyReferences(defaultValue) : null
        options = options.map(o => simplifyReferences(o))
        getOptionValue = (data) => {
            let key = getKey(data)
            return key ? map.get(key) : data
        }
    }

    // TODO: The last map is hotfix to make it work with new mui
    return [options.map((o) => ({ ...o, label: o.name })), defaultValue, getOptionValue]
}

const ControlledAutocomplete = ({options = [], name, renderInput, getOptionLabel, control, onChangeCallback, renderOption,
                                    defaultValue, useSafeOptions = false, fullWidth=false, clearOnBlur= false}: Props) => {
    // TODO - refactor use SafeAutocomplete instead of the implementation here
    const [_options, _defaultValue, getOptionValue] = prepareOptions(useSafeOptions, options, defaultValue)

    return (
        <Controller
            render={({field: { onChange, onBlur, value, ref }, ...props}) => (
                <Autocomplete
                    fullWidth
                    disablePortal
                    options={_options}
                    getOptionLabel={getOptionLabel}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    clearOnBlur={clearOnBlur}
                    onChange={(e, data) => {
                        let _data = getOptionValue(data)
                        onChangeCallback(_data)
                        onChange(data)
                    }}
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                />
            )}
            // onChange={([, data]) => data}
            defaultValue={_defaultValue}
            name={name}
            control={control}
        />
    );
}


export default ControlledAutocomplete;