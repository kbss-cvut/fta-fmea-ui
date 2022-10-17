import * as React from "react";
import {Autocomplete} from "@material-ui/lab";
import {simplifyReferences} from "@utils/utils";
import {AutocompleteProps} from "@material-ui/lab/Autocomplete/Autocomplete";

interface Props<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
    > extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
    useSafeOptions?: boolean,
    onChangeCallback?
}

const prepareOptions = (useSafeOptions, options, ... props) => {
    let getOptionValue = (option) => option;

    if (useSafeOptions) {
        // make options safe by simplifying their references
        const getKey = (o) => o?.iri ? o.iri : (o?.uri ? o.uri : null)
        const map: Map<string, any> = new Map()
        options.forEach(o => map.set(getKey(o), o))
        options = options.map(o => simplifyReferences(o))
        getOptionValue = (data) => {
            let key = getKey(data)
            return key ? map.get(key) : data
        }
    }
    return [options, getOptionValue]
}

const SafeAutocomplete = <
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
    >(props: Props<T, Multiple, DisableClearable, FreeSolo>): JSX.Element => {
    let {useSafeOptions, options, onChangeCallback, ... restProps} = props;
    const [_options, getOptionValue] = prepareOptions(useSafeOptions, options)

    return <Autocomplete
        options={_options}
        onChange={(e, data) => {
            let _data = getOptionValue(data)
            props.onChangeCallback(e, _data)
        }}
        {...restProps}
    />;
}


export default SafeAutocomplete;