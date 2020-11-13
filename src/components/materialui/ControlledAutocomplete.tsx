import * as React from "react";
import {Controller} from "react-hook-form";
import {Autocomplete} from "@material-ui/lab";

interface Props {
    name: string
    options: any[],
    getOptionLabel: (any) => string,
    renderInput,
    control,
    onChangeCallback?,
    renderOption?: any,
    defaultValue?: any,
}

const ControlledAutocomplete = ({options = [], name, renderInput, getOptionLabel, control, onChangeCallback, renderOption, defaultValue}: Props) => {
    return (
        <Controller
            render={({onChange, ...props}) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={getOptionLabel}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    onChange={(e, data) => {
                        onChangeCallback(data)
                        onChange(data)
                    }}
                    {...props}
                />
            )}
            onChange={([, data]) => data}
            defaultValue={defaultValue}
            name={name}
            control={control}
        />
    );
}


export default ControlledAutocomplete;