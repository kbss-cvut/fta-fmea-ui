import * as React from "react";
import * as PropTypes from "prop-types";

// https://bit.dev/lubuskie/material-ui/multiple-select-chips

import {
    FormLabel,
    Chip,
    Typography,
    FormHelperText,
} from "@mui/material";
import useStyles from "./MultipleSelectChips.styles";


interface Props {
    value: any[],
    setValue: (updatedValue: any[]) => void,
    options: any[],
    fixedValues?: any[],
    label?: string,
    error: string,
    setError: (string) => void,
}

const MultipleSelectChips = ({value, setValue, options, fixedValues, label, error, setError,}: Props) => {
    const classes = useStyles();

    const handleClick = (clickedValue) => {
        if (setError) {
            setError("");
        }

        if (fixedValues.find((e) => e === clickedValue)) {
            console.log('Fixed value - cannot be unselected.')
            return
        }

        if (value.find((e) => e === clickedValue)) {
            const index = value.findIndex((e) => e === clickedValue);
            let arr = [...value];
            arr.splice(index, 1);
            setValue(arr);
        } else {
            setValue([...value, clickedValue]);
        }
    };

    return (
        <>
            <div className={classes.container}>
                {label && (
                    <FormLabel error={Boolean(error)}>
                        <Typography variant="body2">{`${label}${
                            value.length ? ":" : ""
                        } ${options
                            .filter((option) => value.indexOf(option.value) !== -1)
                            .map((option) => option.label)
                            .join(", ")}`}</Typography>
                    </FormLabel>
                )}
                {Boolean(error) && (
                    <FormHelperText className={classes.formHelperText} error={Boolean(error)}>
                        {error}
                    </FormHelperText>
                )}
                <div className={classes.chipsDiv}>
                    {options && options.length
                        ? options.map((option, i) => (
                            <Chip
                                icon={option.icon}
                                className={classes.chip}
                                key={i}
                                color="primary"
                                // TODO: @ts-ignore hotfix
                                //@ts-ignore
                                variant={value.find((e) => e === option.value) ? "default" : "outlined"}
                                label={<Typography variant="body2">{`${option.label}`}</Typography>}
                                clickable
                                onClick={() => handleClick(option.value)}
                            />
                        ))
                        : null}
                </div>
            </div>
        </>
    );
};

MultipleSelectChips.propTypes = {
    label: PropTypes.string,
    value: PropTypes.array.isRequired,
    setValue: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            icon: PropTypes.node,
        })
    ).isRequired,
    error: PropTypes.string,
    setError: PropTypes.func,
};

export default MultipleSelectChips;