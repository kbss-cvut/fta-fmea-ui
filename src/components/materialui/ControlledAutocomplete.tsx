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

    let map : Map<string, any> = new Map()
    options.forEach(o => map.set(o.iri, o))
    let safeDefaultValue  = defaultValue ? simplifyReferencesOfReferences(defaultValue)  : null
    let safeOptions = options.map(o => simplifyReferencesOfReferences(o))
    return (
        <Controller
            render={({onChange, ...props}) => (
                <Autocomplete
                    options={useSafeOptions ? safeOptions : options}
                    getOptionLabel={getOptionLabel}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    onChange={(e, data) => {
                        let _data = data ? (useSafeOptions ? map.get(data.iri) :data) : data
                        onChangeCallback(_data)
                        onChange(data)
                    }}
                    {...props}
                />
            )}
            onChange={([, data]) => data}
            defaultValue={useSafeOptions ? safeDefaultValue : defaultValue}
            name={name}
            control={control}
        />
    );
}


export default ControlledAutocomplete;