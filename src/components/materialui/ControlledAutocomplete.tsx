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

const prepareOptions = (useSafeOptions, inputOptions, defaultOption) => {
    let options = inputOptions;
    let defaultValue = defaultOption;
    let getOptionValue = (option) => option;

    if (useSafeOptions) {
        // make options safe by simplifying their references
        const getKey = (o) => o?.iri ? o.iri : (o?.uri ? o.uri : null)
        const map: Map<string, any> = new Map()
        options.forEach(o => map.set(getKey(o), o))
        defaultValue = defaultValue ? simplifyReferencesOfReferences(defaultValue) : null
        options = options.map(o => simplifyReferencesOfReferences(o))
        getOptionValue = (data) => {
            let key = getKey(data)
            return key ? map.get(key) : data
        }
    }
    return [options, defaultValue, getOptionValue]
}

const ControlledAutocomplete = ({options = [], name, renderInput, getOptionLabel, control, onChangeCallback, renderOption, defaultValue, useSafeOptions = false}: Props) => {
    const [_options, _defaultValue, getOptionValue] = prepareOptions(useSafeOptions, options, defaultValue)

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