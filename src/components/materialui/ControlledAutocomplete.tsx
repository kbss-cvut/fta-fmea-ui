import * as React from "react";
import {Controller} from "react-hook-form";
import {Autocomplete} from "@material-ui/lab";
import {simplifyReferencesOfReferences} from "@utils/utils";

interface Props {
    name: string
    options: any[],
    getOptionLabel: (any) => string,
    renderInput,
    control,
    onChangeCallback?,
    renderOption?: any,
    defaultValue?: any,
    useSafeOptions?: boolean
}

const ControlledAutocomplete = ({options = [], name, renderInput, getOptionLabel, control, onChangeCallback, renderOption, defaultValue, useSafeOptions = false}: Props) => {
    let _options = options;
    let _defaultValue = defaultValue;
    let _getOptionValue = (data) => data;

    if (useSafeOptions) {
        const getKey = (o) => o?.iri ? o.iri : o?.uri ? o.uri : null
            let map: Map<string, any> = new Map()
        options.forEach(o => map.set(getKey(o), o))
        _defaultValue = defaultValue ? simplifyReferencesOfReferences(defaultValue) : null
        _options = options.map(o => simplifyReferencesOfReferences(o))
        _getOptionValue = (data) => {
            let key = getKey(data)
            key ? map.get(key) : data
        }
    }

    const getOptionValue = _getOptionValue

    return (
        <Controller
            render={({onChange, ...props}) => (
                <Autocomplete
                    options={_options}
                    getOptionLabel={getOptionLabel}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    onChange={(e, data) => {
                        let _data = getOptionValue(data)
                        onChangeCallback(_data)
                        onChange(data)
                    }}
                    {...props}
                />
            )}
            onChange={([, data]) => data}
            defaultValue={_defaultValue}
            name={name}
            control={control}
        />
    );
}


export default ControlledAutocomplete;